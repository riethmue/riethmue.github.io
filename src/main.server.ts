import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideServerRendering } from '@angular/platform-server';

const bootstrap = () =>
  bootstrapApplication(AppComponent, {
    providers: [provideRouter(routes), provideServerRendering()],
  });

export default bootstrap;
