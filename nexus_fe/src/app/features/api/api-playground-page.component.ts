import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { endpointGroups } from './api-endpoints';
import { EndpointCardComponent } from './components/endpoint-card.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-api-playground-page',
  standalone: true,
  imports: [CommonModule, EndpointCardComponent, IconComponent],
  templateUrl: './api-playground-page.component.html',
  styleUrl: './api-playground-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiPlaygroundPageComponent {
  readonly endpointGroups = endpointGroups;
  readonly query = signal('');
  readonly activeGroup = signal<'all' | 'auth' | 'users' | 'stores'>('all');
  readonly endpointCount = endpointGroups.reduce((total, group) => total + group.endpoints.length, 0);

  readonly visibleGroups = computed(() => {
    const search = this.query().trim().toLowerCase();

    return this.endpointGroups
      .filter((group) => this.activeGroup() === 'all' || group.id === this.activeGroup())
      .map((group) => ({
        ...group,
        endpoints: group.endpoints.filter((endpoint) => {
          if (!search) {
            return true;
          }

          const haystack = `${endpoint.title} ${endpoint.path} ${endpoint.description}`.toLowerCase();
          return haystack.includes(search);
        })
      }))
      .filter((group) => group.endpoints.length > 0);
  });

  setFilter(groupId: 'all' | 'auth' | 'users' | 'stores'): void {
    this.activeGroup.set(groupId);
  }
}
