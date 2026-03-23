export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type EndpointFieldKind = 'text' | 'email' | 'password' | 'uuid' | 'boolean' | 'select';

export interface SelectOption {
  readonly label: string;
  readonly value: string | number | boolean | null;
}

export interface EndpointFieldDefinition {
  readonly key: string;
  readonly label: string;
  readonly kind: EndpointFieldKind;
  readonly required?: boolean;
  readonly placeholder?: string;
  readonly hint?: string;
  readonly options?: readonly SelectOption[];
  readonly defaultValue?: string | number | boolean | null;
  readonly defaultFrom?: 'refreshToken';
  readonly emptyBehavior?: 'omit' | 'null';
}

export interface ApiEndpointDefinition {
  readonly id: string;
  readonly title: string;
  readonly group: 'auth' | 'users' | 'stores';
  readonly method: HttpMethod;
  readonly path: string;
  readonly description: string;
  readonly authRequired: boolean;
  readonly accessLevel: string;
  readonly pathFields?: readonly EndpointFieldDefinition[];
  readonly bodyFields?: readonly EndpointFieldDefinition[];
}

export interface ApiEndpointGroupDefinition {
  readonly id: 'auth' | 'users' | 'stores';
  readonly title: string;
  readonly icon: string;
  readonly description: string;
  readonly endpoints: readonly ApiEndpointDefinition[];
}

export interface AuthUserResponse {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: number | string;
  readonly managerId: string | null;
}

export interface AuthTokenResponse {
  readonly accessToken: string;
  readonly accessTokenExpiresAtUtc: string;
  readonly refreshToken: string;
  readonly refreshTokenExpiresAtUtc: string;
  readonly user: AuthUserResponse;
}

export interface AuthSession {
  readonly accessToken: string | null;
  readonly accessTokenExpiresAtUtc: string | null;
  readonly refreshToken: string | null;
  readonly refreshTokenExpiresAtUtc: string | null;
  readonly user: AuthUserResponse | null;
}

export interface ApiCallResult<T = unknown> {
  readonly ok: boolean;
  readonly status: number;
  readonly body: T | null;
  readonly method: HttpMethod;
  readonly url: string;
  readonly durationMs: number;
  readonly errorMessage?: string;
}
