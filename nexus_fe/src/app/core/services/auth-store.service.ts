import { computed, effect, Injectable, signal } from '@angular/core';
import { AuthSession, AuthTokenResponse, AuthUserResponse } from '../models/api.models';

const STORAGE_KEY = 'nexus.console.session';

const emptySession = (): AuthSession => ({
  accessToken: null,
  accessTokenExpiresAtUtc: null,
  refreshToken: null,
  refreshTokenExpiresAtUtc: null,
  user: null
});

@Injectable({ providedIn: 'root' })
export class AuthStoreService {
  private readonly state = signal<AuthSession>(this.readSession());

  readonly session = computed(() => this.state());
  readonly accessToken = computed(() => this.state().accessToken);
  readonly refreshToken = computed(() => this.state().refreshToken);
  readonly user = computed(() => this.state().user);
  readonly isAuthenticated = computed(() => Boolean(this.state().accessToken));

  constructor() {
    effect(() => {
      const session = this.state();
      const hasData = Boolean(session.accessToken || session.refreshToken || session.user);

      if (!hasData) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    });
  }

  setSession(response: AuthTokenResponse): void {
    this.state.set({
      accessToken: response.accessToken,
      accessTokenExpiresAtUtc: response.accessTokenExpiresAtUtc,
      refreshToken: response.refreshToken,
      refreshTokenExpiresAtUtc: response.refreshTokenExpiresAtUtc,
      user: response.user
    });
  }

  updateUser(user: AuthUserResponse): void {
    this.state.update((current) => ({
      ...current,
      user
    }));
  }

  clearSession(): void {
    this.state.set(emptySession());
  }

  private readSession(): AuthSession {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (!value) {
        return emptySession();
      }

      const parsed = JSON.parse(value) as Partial<AuthSession>;
      return {
        accessToken: typeof parsed.accessToken === 'string' ? parsed.accessToken : null,
        accessTokenExpiresAtUtc:
          typeof parsed.accessTokenExpiresAtUtc === 'string' ? parsed.accessTokenExpiresAtUtc : null,
        refreshToken: typeof parsed.refreshToken === 'string' ? parsed.refreshToken : null,
        refreshTokenExpiresAtUtc:
          typeof parsed.refreshTokenExpiresAtUtc === 'string' ? parsed.refreshTokenExpiresAtUtc : null,
        user: parsed.user ?? null
      };
    } catch {
      return emptySession();
    }
  }
}
