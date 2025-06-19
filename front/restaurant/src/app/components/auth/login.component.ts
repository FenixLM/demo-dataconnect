import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Restaurant Platform Login</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
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
                loginForm.get('email')?.invalid &&
                loginForm.get('email')?.touched
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
                loginForm.get('password')?.invalid &&
                loginForm.get('password')?.touched
              "
              class="error-message"
            >
              Password is required (minimum 6 characters)
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" [disabled]="loginForm.invalid || isLoading">
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
            <button
              type="button"
              (click)="navigateToRegister()"
              [disabled]="isLoading"
            >
              Register
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
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f5f5f5;
      }

      .login-card {
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
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email, password);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Login error:', error);
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  private getErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Please try again later';
      default:
        return 'An error occurred. Please try again';
    }
  }
}
