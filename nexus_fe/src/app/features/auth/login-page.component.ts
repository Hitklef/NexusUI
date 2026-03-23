import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthTokenResponse } from '../../core/models/api.models';
import { ApiClientService } from '../../core/services/api-client.service';
import { AuthStoreService } from '../../core/services/auth-store.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  private readonly formBuilder = inject(UntypedFormBuilder);
  private readonly apiClient = inject(ApiClientService);
  private readonly authStore = inject(AuthStoreService);
  private readonly router = inject(Router);

  readonly form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  constructor() {
    effect(() => {
      if (this.authStore.isAuthenticated()) {
        void this.router.navigateByUrl('/home');
      }
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.isSubmitting.set(true);

    try {
      const result = await this.apiClient.execute<AuthTokenResponse>('POST', '/api/auth/login', this.form.getRawValue());

      if (!result.ok || !result.body) {
        this.errorMessage.set('Не вдалося увійти. Перевір email, пароль або відповідь API.');
        return;
      }

      this.authStore.setSession(result.body);
      await this.router.navigateByUrl('/home');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  controlInvalid(controlName: 'email' | 'password'): boolean {
    const control = this.form.get(controlName);
    return Boolean(control && control.invalid && control.touched);
  }
}
