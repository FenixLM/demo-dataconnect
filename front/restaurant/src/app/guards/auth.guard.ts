import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usar el observable authState$ para verificar la autenticación de forma asíncrona
  return authService.authState$.pipe(
    take(1), // Tomar solo el primer valor emitido
    map((user) => {
      // Si hay un usuario autenticado, permitir el acceso
      if (user) {
        return true;
      }

      // Redirigir al login si no está autenticado
      console.log('Usuario no autenticado, redirigiendo a login');
      return router.createUrlTree(['/login']);
    })
  );
};
