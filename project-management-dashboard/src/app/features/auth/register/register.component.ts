import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2 class="register-title">Create Account</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                formControlName="firstName"
                placeholder="Enter your first name"
                class="form-input"
              />
              <div *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched" class="error-message">
                First name is required
              </div>
            </div>

            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                formControlName="lastName"
                placeholder="Enter your last name"
                class="form-input"
              />
              <div *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched" class="error-message">
                Last name is required
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              placeholder="Enter your email"
              class="form-input"
            />
            <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="error-message">
              Please enter a valid email address
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
            <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="error-message">
              Password must be at least 6 characters long
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              formControlName="confirmPassword"
              placeholder="Confirm your password"
              class="form-input"
            />
            <div *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched" class="error-message">
              Passwords do not match
            </div>
          </div>

          <button type="submit" [disabled]="registerForm.invalid" class="register-button">
            Create Account
          </button>
        </form>

        <div class="register-footer">
          <p class="login-link">
            Already have an account?
            <a routerLink="/auth/login">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-tertiary) 100%);
      position: relative;
      overflow: hidden;
    }

    .register-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 30% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
      animation: fadeIn 2s ease-in-out;
    }

    .register-card {
      background: rgba(31, 41, 55, 0.9);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(75, 85, 99, 0.3);
      padding: 2.5rem;
      border-radius: 1rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      width: 100%;
      max-width: 520px;
      position: relative;
      z-index: 1;
      animation: slideUp 0.6s ease-out;
    }

    .register-title {
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

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
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

    .register-button {
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
      margin-top: 0.5rem;
    }

    .register-button:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.3);
    }

    .register-button:disabled {
      background: var(--disabled);
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .register-button:disabled:hover {
      transform: none;
    }

    .register-footer {
      margin-top: 2rem;
      text-align: center;
    }

    .login-link {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .login-link a {
      color: var(--accent-primary);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .login-link a:hover {
      color: var(--accent-secondary);
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .register-card {
        padding: 2rem 1.5rem;
        margin: 1rem;
      }

      .register-title {
        font-size: 1.75rem;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // TODO: Implement registration logic
      console.log('Registration form submitted:', this.registerForm.value);
      // Navigate to login after successful registration
      this.router.navigate(['/auth/login']);
    }
  }
}
