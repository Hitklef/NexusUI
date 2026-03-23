import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { endpointGroups } from '../api/api-endpoints';
import { AuthStoreService } from '../../core/services/auth-store.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  private readonly authStore = inject(AuthStoreService);

  readonly user = this.authStore.user;
  readonly endpointGroups = endpointGroups;
  readonly endpointCount = endpointGroups.reduce((total, group) => total + group.endpoints.length, 0);
  readonly userName = computed(() => {
    const user = this.user();
    return user ? `${user.firstName} ${user.lastName}` : 'Guest';
  });
}
