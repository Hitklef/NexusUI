import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'nexus.console.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  readonly theme = signal<ThemeMode>(this.readTheme());

  constructor() {
    effect(() => {
      const mode = this.theme();
      const root = this.document.documentElement;

      root.dataset['theme'] = mode;
      root.style.colorScheme = mode;
      localStorage.setItem(STORAGE_KEY, mode);
    });
  }

  toggleTheme(): void {
    this.theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  private readTheme(): ThemeMode {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
  }
}
