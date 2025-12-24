import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2 class="login-title">Sign In</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div *ngIf="errorMessage" class="error-banner">
            {{ errorMessage }}
          </div>
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              formControlName="username"
              placeholder="Enter your username"
              class="form-input"
            />
            <div *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" class="error-message">
              <span *ngIf="loginForm.get('username')?.errors?.['required']">Username is required</span>
              <span *ngIf="loginForm.get('username')?.errors?.['minlength']">Username must be at least 3 characters long</span>
              <span *ngIf="loginForm.get('username')?.errors?.['maxlength']">Username cannot exceed 50 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              placeholder="Enter your password"
              class="form-input"
            />
            <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="error-message">
              <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
              <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters long</span>
            </div>
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading" class="login-button">
            <span *ngIf="isLoading">Signing In...</span>
            <span *ngIf="!isLoading">Sign In</span>
          </button>
        </form>

        <div class="login-footer">
          <a routerLink="/auth/forgot-password" class="forgot-link">Forgot Password?</a>
          <p class="register-link">
            Don't have an account?
            <a routerLink="/auth/register">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-tertiary) 100%);
      position: relative;
      overflow: hidden;
    }

    .login-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
      animation: fadeIn 2s ease-in-out;
    }

    .login-card {
      background: rgba(31, 41, 55, 0.9);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(75, 85, 99, 0.3);
      padding: 2.5rem;
      border-radius: 1rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      width: 100%;
      max-width: 420px;
      position: relative;
      z-index: 1;
      animation: slideUp 0.6s ease-out;
    }

    .login-title {
      text-align: center;
      margin-bottom: 2rem;
      color: var(--text-primary);
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .error-banner {
      background: rgba(239, 68, 68, 0.1);
      color: #fca5a5;
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid rgba(239, 68, 68, 0.2);
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      animation: slideUp 0.3s ease-out;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 1.5rem;
    }

    .form-group label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--text-primary);
      font-size: 0.875rem;
    }

    .form-input {
      padding: 0.875rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      font-size: 1rem;
      background: var(--bg-secondary);
      color: var(--text-primary);
      transition: all 0.2s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
      background: var(--bg-secondary);
    }

    .form-input::placeholder {
      color: var(--text-secondary);
    }

    .error-message {
      color: #fca5a5;
      font-size: 0.75rem;
      margin-top: 0.5rem;
      animation: fadeIn 0.3s ease-out;
    }

    .login-button {
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      color: white;
      padding: 0.875rem 2rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
      margin-top: 1rem;
    }

    .login-button:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.3);
    }

    .login-button:disabled {
      background: var(--disabled);
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .login-button:disabled:hover {
      transform: none;
    }

    .login-footer {
      margin-top: 2rem;
      text-align: center;
    }

    .forgot-link {
      color: var(--accent-primary);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .forgot-link:hover {
      color: var(--accent-secondary);
      text-decoration: underline;
    }

    .register-link {
      margin-top: 1.5rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .register-link a {
      color: var(--accent-primary);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .register-link a:hover {
      color: var(--accent-secondary);
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 2rem 1.5rem;
        margin: 1rem;
      }

      .login-title {
        font-size: 1.75rem;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials: LoginRequest = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Navigation will be handled by the auth service
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
