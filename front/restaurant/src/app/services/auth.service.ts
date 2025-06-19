import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from '@angular/fire/auth';
import { upsertUser } from 'dataconnect-generated/js/default-connector';

// import { injectUpsertUser } from 'dataconnect-generated/js/default-connector/angular';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Inyectar la mutación para actualizar usuarios
  // private upsertUserMutation = injectUpsertUser();

  constructor(private auth: Auth) {
    // Configurar la persistencia de la sesión al inicio
    this.setupPersistence();
  }

  // Configurar la persistencia de la sesión de autenticación
  private async setupPersistence() {
    try {
      await setPersistence(this.auth, browserLocalPersistence);
      console.log('Persistencia de autenticación configurada como LOCAL');
    } catch (error) {
      // console.error('Error al configurar la persistencia:', error);
    }
  }

  // Get current authenticated user
  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  // Get authentication state as an Observable
  get authState$(): Observable<User | null> {
    return new Observable<User | null>((observer) => {
      const unsubscribe = onAuthStateChanged(
        this.auth,
        async (user) => {
          try {
            if (user) {
              // Extraer el nombre de usuario del email
              const username = user.email?.split('@')[0] || 'anon';

              try {
                // Intentar actualizar la información del usuario en la base de datos
                const result = await upsertUser({
                  username: username,
                  role: { id: '3b3cb626d23d48d0af6f6cafeb023acb' }, // ID de rol predeterminado 'user'
                  email: user.email || null,
                });
                console.log('Usuario actualizado en la base de datos:', result);
              } catch (dbError) {
                // Si DataConnect falla, seguimos con la autenticación pero mostramos el error
                console.warn(
                  'No se pudo actualizar el usuario en DataConnect, pero la autenticación sigue siendo válida:',
                  dbError
                );
              }
            }
          } catch (error) {
            console.error(
              'Error al actualizar el usuario en la base de datos:',
              error
            );
          } finally {
            // Notificar del cambio de estado de autenticación
            observer.next(user);
          }
        },
        (error) => {
          console.error('Error en el estado de autenticación:', error);
          observer.error(error);
        }
      );

      return unsubscribe;
    });
  }
  // Register a new user with email and password
  async register(email: string, password: string): Promise<User> {
    const credential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    // Extraer nombre de usuario del email
    const user = credential.user;
    const username = user.email?.split('@')[0] || 'anon';

    try {
      // Crear entrada en la base de datos para el nuevo usuario
      await upsertUser({
        username: username,
        role: { id: '3b3cb626d23d48d0af6f6cafeb023acb' }, // ID de rol predeterminado 'user'
        email: user.email || null,
      });
      console.log('Usuario registrado en la base de datos');
    } catch (dbError) {
      // Si DataConnect falla, seguimos con el registro pero mostramos el error
      console.warn(
        'No se pudo registrar el usuario en DataConnect, pero la autenticación sigue siendo válida:',
        dbError
      );
    }

    return user;
  }
  // Sign in an existing user with email and password
  async login(email: string, password: string): Promise<User> {
    // Aseguramos que la persistencia está configurada antes de iniciar sesión
    await this.setupPersistence();

    const credential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    // Actualizar información del usuario al iniciar sesión
    const user = credential.user;
    return user;
  }

  // Sign out the current user
  async logout(): Promise<void> {
    await signOut(this.auth);
  }
  // Check if the user is authenticated
  isLoggedIn(): boolean {
    // Verificamos el usuario actual, que puede estar cargado desde localStorage por Firebase
    return !!this.auth.currentUser;
  }
}
