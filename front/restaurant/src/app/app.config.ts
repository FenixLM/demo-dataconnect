import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { connectorConfig } from '@firebasegen/default-connector';
import { provideDataConnect } from '@angular/fire/data-connect';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';

// Importar la inicialización de Firebase con emuladores
import { app, auth, dataConnect } from './firebase-init';

const queryClient = new QueryClient();

export const appConfig: ApplicationConfig = {
  providers: [
    provideTanStackQuery(queryClient),
    // Usar la instancia predefinida de DataConnect
    provideDataConnect(() => {
      console.log('Usando DataConnect con emulador preconfigurado');
      return dataConnect;
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([])),
    provideAnimations(),
    // Usar la app de Firebase ya inicializada
    provideFirebaseApp(() => app),
    // Usar la autenticación ya configurada con el emulador
    provideAuth(() => auth),
    provideFirestore(() => getFirestore()),
  ],
};
