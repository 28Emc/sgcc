import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { errorInterceptor } from './http/error.interceptor';

export const coreProviders = [
  provideHttpClient(withInterceptors([errorInterceptor])),
  provideAnimationsAsync(),
];
