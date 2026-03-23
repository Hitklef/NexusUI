import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiClientService } from '../../core/services/api-client.service';
import { AuthStoreService } from '../../core/services/auth-store.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellComponent {
  private readonly authStore = inject(AuthStoreService);
  private readonly apiClient = inject(ApiClientService);
  private readonly router = inject(Router);

  readonly theme = inject(ThemeService);
  readonly sidebarOpen = signal(false);
  readonly user = this.authStore.user;
  readonly userName = computed(() => {
    const user = this.user();
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown user';
  });
  readonly userRole = computed(() => {
    const role = this.user()?.role;
    return typeof role === 'number' ? ['Unknown', 'Owner', 'Manager', 'Worker'][role] ?? 'Unknown' : role ?? 'Unknown';
  });
  readonly userInitials = computed(() => {
    const user = this.user();
    if (!user) {
      return 'NX';
    }

    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  });

  readonly navItems = [
    { label: 'Home', path: '/home', icon: 'bi-house-door-fill' },
    { label: 'API Console', path: '/api', icon: 'bi-terminal-fill' }
  ] as const;

  toggleSidebar(): void {
    this.sidebarOpen.update((value) => !value);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  async logout(): Promise<void> {
    const refreshToken = this.authStore.refreshToken();

    if (refreshToken) {
      await this.apiClient.execute('POST', '/api/auth/logout', { refreshToken });
    }

    this.authStore.clearSession();
    this.closeSidebar();
    await this.router.navigateByUrl('/login');
  }
}
