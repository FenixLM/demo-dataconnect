import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import {
  createUser,
  upsertUser,
} from 'dataconnect-generated/js/default-connector';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2>Create Your Account</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              formControlName="username"
              class="form-control"
            />
            <div
              *ngIf="
                registerForm.get('username')?.invalid &&
                registerForm.get('username')?.touched
              "
              class="error-message"
            >
              Username is required
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
            />
            <div
              *ngIf="
                registerForm.get('email')?.invalid &&
                registerForm.get('email')?.touched
              "
              class="error-message"
            >
              Valid email is required
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-control"
            />
            <div
              *ngIf="
                registerForm.get('password')?.invalid &&
                registerForm.get('password')?.touched
              "
              class="error-message"
            >
              Password is required (minimum 6 characters)
            </div>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              [disabled]="registerForm.invalid || isLoading"
            >
              {{ isLoading ? 'Creating Account...' : 'Register' }}
            </button>
            <button
              type="button"
              (click)="navigateToLogin()"
              [disabled]="isLoading"
            >
              Back to Login
            </button>
          </div>

          <div *ngIf="errorMessage" class="error-banner">
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f5f5f5;
      }

      .register-card {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
      }

      h2 {
        color: #333;
        margin-bottom: 1.5rem;
        text-align: center;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #555;
      }

      .form-control {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }

      .form-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 1.5rem;
      }

      button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        transition: background-color 0.2s;
      }

      button[type='submit'] {
        background-color: #4caf50;
        color: white;
      }

      button[type='submit']:hover:not(:disabled) {
        background-color: #45a049;
      }

      button[type='button'] {
        background-color: #f1f1f1;
        color: #333;
      }

      button[type='button']:hover:not(:disabled) {
        background-color: #e6e6e6;
      }

      button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .error-message {
        color: #d32f2f;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      .error-banner {
        margin-top: 1rem;
        padding: 0.75rem;
        background-color: #ffebee;
        color: #d32f2f;
        border-radius: 4px;
        text-align: center;
      }
    `,
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  async onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { email, password, username } = this.registerForm.value;

      // Register user with Firebase Auth
      const authUser = await this.authService.register(email, password);

      // // ID de rol fijo que ya sabemos que existe
      // const roleId = '3b3cb626d23d48d0af6f6cafeb023acb';

      // try {
      //   // Crear el usuario en DataConnect usando la función createUser
      //   const result = await upsertUser({
      //     username: username,
      //     role: { id: roleId }, // Pasar el ID del rol como Role_Key
      //     email: email,
      //   });

      //   console.log('Usuario creado exitosamente en DataConnect:', result);
      // } catch (dbError) {
      //   // Si falla la creación en DataConnect, seguimos pero mostramos el error
      //   console.warn(
      //     'No se pudo actualizar o crear el usuario en DataConnect, pero la autenticación sigue siendo válida:',
      //     dbError
      //   );
      // }

      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Registration error:', error);
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  private getErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already in use';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/invalid-email':
        return 'Invalid email address';
      default:
        return 'An error occurred. Please try again';
    }
  }
}
