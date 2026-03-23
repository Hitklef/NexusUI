import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="icon-shell" [style.--icon-size]="size() + 'rem'" aria-hidden="true">
      @switch (name()) {
        @case ('home') {
          <svg viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5.5v-7h-5v7H4a1 1 0 0 1-1-1V10.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
        }
        @case ('api') {
          <svg viewBox="0 0 24 24" fill="none"><path d="M8 5 4 12l4 7M16 5l4 7-4 7M13.5 4 10.5 20" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        }
        @case ('user') {
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        }
        @case ('users') {
          <svg viewBox="0 0 24 24" fill="none"><path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3.5 20a5.5 5.5 0 0 1 11 0M14.5 20a4.5 4.5 0 0 1 6 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        }
        @case ('store') {
          <svg viewBox="0 0 24 24" fill="none"><path d="M4 10.5h16V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-9.5ZM6 10.5l1.2-6h9.6l1.2 6" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
        }
        @case ('login') {
          <svg viewBox="0 0 24 24" fill="none"><path d="M10 17 5 12l5-5M5 12h10M13 4h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        }
        @case ('logout') {
          <svg viewBox="0 0 24 24" fill="none"><path d="M14 17l5-5-5-5M19 12H9M11 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        }
        @case ('moon') {
          <svg viewBox="0 0 24 24" fill="none"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
        }
        @case ('sun') {
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        }
        @case ('menu') {
          <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
        }
        @case ('spark') {
          <svg viewBox="0 0 24 24" fill="none"><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM18.5 16l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2ZM5.5 15l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" fill="currentColor"/></svg>
        }
        @default {
          <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7"/></svg>
        }
      }
    </span>
  `,
  styles: [
    `
      .icon-shell {
        width: var(--icon-size, 1.25rem);
        height: var(--icon-size, 1.25rem);
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      svg {
        width: 100%;
        height: 100%;
      }
    `
  ]
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly size = input(1.25);
}
