import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCallResult, ApiEndpointDefinition, AuthTokenResponse, AuthUserResponse, EndpointFieldDefinition } from '../../../core/models/api.models';
import { ApiClientService } from '../../../core/services/api-client.service';
import { AuthStoreService } from '../../../core/services/auth-store.service';

const uuidPattern = /^$|^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Component({
  selector: 'app-endpoint-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './endpoint-card.component.html',
  styleUrl: './endpoint-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EndpointCardComponent {
  readonly endpoint = input.required<ApiEndpointDefinition>();

  private readonly formBuilder = inject(UntypedFormBuilder);
  private readonly apiClient = inject(ApiClientService);
  private readonly authStore = inject(AuthStoreService);

  form = this.formBuilder.group({});
  readonly isRunning = signal(false);
  readonly result = signal<ApiCallResult | null>(null);
  readonly requestPreview = signal<string>('Run the request to inspect the payload preview.');

  readonly pathFields = computed(() => this.endpoint().pathFields ?? []);
  readonly bodyFields = computed(() => this.endpoint().bodyFields ?? []);
  readonly hasFields = computed(() => this.pathFields().length > 0 || this.bodyFields().length > 0);

  constructor() {
    effect(() => {
      const endpoint = this.endpoint();
      const controls: Record<string, unknown> = {};

      for (const field of [...(endpoint.pathFields ?? []), ...(endpoint.bodyFields ?? [])]) {
        controls[field.key] = [this.resolveDefaultValue(field), this.buildValidators(field)];
      }

      this.form = this.formBuilder.group(controls);
      this.requestPreview.set(this.formatPreview(endpoint.path, this.buildBody(endpoint.bodyFields ?? [])));
      this.result.set(null);
    });
  }

  async run(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const endpoint = this.endpoint();
    const url = this.interpolatePath(endpoint.path, endpoint.pathFields ?? []);
    const body = this.buildBody(endpoint.bodyFields ?? []);

    this.requestPreview.set(this.formatPreview(url, body));
    this.isRunning.set(true);

    try {
      const result = await this.apiClient.execute(endpoint.method, url, body);
      this.result.set(result);
      this.applyAuthSideEffects(endpoint.id, result);
    } finally {
      this.isRunning.set(false);
    }
  }

  reset(): void {
    const endpoint = this.endpoint();
    this.form.reset();

    for (const field of [...(endpoint.pathFields ?? []), ...(endpoint.bodyFields ?? [])]) {
      this.form.get(field.key)?.setValue(this.resolveDefaultValue(field));
    }

    this.requestPreview.set(this.formatPreview(endpoint.path, this.buildBody(endpoint.bodyFields ?? [])));
    this.result.set(null);
  }

  fieldId(fieldKey: string): string {
    return `${this.endpoint().id}-${fieldKey}`;
  }

  controlInvalid(fieldKey: string): boolean {
    const control = this.form.get(fieldKey);
    return Boolean(control && control.invalid && control.touched);
  }

  inputType(field: EndpointFieldDefinition): string {
    if (field.kind === 'email') {
      return 'email';
    }

    if (field.kind === 'password') {
      return 'password';
    }

    return 'text';
  }

  resultJson(): string {
    return this.stringifyValue(this.result()?.body ?? null);
  }

  statusTone(): 'success' | 'error' | 'idle' {
    const result = this.result();
    if (!result) {
      return 'idle';
    }

    return result.ok ? 'success' : 'error';
  }

  private buildValidators(field: EndpointFieldDefinition): unknown[] {
    const validators = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.kind === 'email') {
      validators.push(Validators.email);
    }

    if (field.kind === 'uuid') {
      validators.push(Validators.pattern(uuidPattern));
    }

    return validators;
  }

  private resolveDefaultValue(field: EndpointFieldDefinition): string | number | boolean | null {
    if (field.defaultFrom === 'refreshToken') {
      return this.authStore.refreshToken() ?? '';
    }

    if (field.defaultValue !== undefined) {
      return field.defaultValue;
    }

    return field.kind === 'boolean' ? false : '';
  }

  private interpolatePath(path: string, pathFields: readonly EndpointFieldDefinition[]): string {
    let resolvedPath = path;

    for (const field of pathFields) {
      const value = String(this.form.get(field.key)?.value ?? '').trim();
      resolvedPath = resolvedPath.replace(`{${field.key}}`, value);
    }

    return resolvedPath;
  }

  private buildBody(bodyFields: readonly EndpointFieldDefinition[]): Record<string, unknown> | undefined {
    if (!bodyFields.length) {
      return undefined;
    }

    const payload: Record<string, unknown> = {};

    for (const field of bodyFields) {
      const rawValue = this.form.get(field.key)?.value;
      const normalizedValue = this.normalizeFieldValue(field, rawValue);

      if (normalizedValue === undefined) {
        continue;
      }

      payload[field.key] = normalizedValue;
    }

    return payload;
  }

  private normalizeFieldValue(
    field: EndpointFieldDefinition,
    rawValue: unknown
  ): string | number | boolean | null | undefined {
    if (field.kind === 'boolean') {
      return Boolean(rawValue);
    }

    if (field.kind === 'select') {
      if (typeof rawValue === 'string' && rawValue !== '') {
        return Number(rawValue);
      }

      if (typeof rawValue === 'number' || typeof rawValue === 'boolean') {
        return rawValue;
      }

      return rawValue === null ? null : undefined;
    }

    const trimmedValue = String(rawValue ?? '').trim();

    if (!trimmedValue) {
      return field.emptyBehavior === 'null' ? null : undefined;
    }

    return trimmedValue;
  }

  private applyAuthSideEffects(endpointId: string, result: ApiCallResult): void {
    if (endpointId === 'auth-logout' && result.ok) {
      this.authStore.clearSession();
      return;
    }

    if (!result.ok || !result.body) {
      return;
    }

    if (endpointId === 'auth-login' || endpointId === 'auth-refresh') {
      this.authStore.setSession(result.body as AuthTokenResponse);
      return;
    }

    if (endpointId === 'auth-me') {
      this.authStore.updateUser(result.body as AuthUserResponse);
    }
  }

  private formatPreview(url: string, body: Record<string, unknown> | undefined): string {
    return this.stringifyValue({
      url,
      body: body ?? null
    });
  }

  private stringifyValue(value: unknown): string {
    return JSON.stringify(value, null, 2);
  }
}
