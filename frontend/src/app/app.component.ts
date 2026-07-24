import { Component } from '@angular/core';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainLayoutComponent],
  template: `
    <app-main-layout></app-main-layout>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'SGCC';
}
