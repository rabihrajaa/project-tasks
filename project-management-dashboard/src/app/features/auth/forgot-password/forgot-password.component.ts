import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="forgot-password-container">
      <div class="forgot-password-card">
        <h2 class="forgot-password-title">Reset Password</h2>
        <p class="forgot-password-subtitle">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()" class="forgot-password-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              placeholder="Enter your email"
              class="form-input"
            />
            <div *ngIf="forgotPasswordForm.get('email')?.invalid && forgotPasswordForm.get('email')?.touched" class="error-message">
              Please enter a valid email address
            </div>
          </div>

          <button type="submit" [disabled]="forgotPasswordForm.invalid" class="reset-button">
            Send Reset Link
          </button>
        </form>

        <div class="forgot-password-footer">
          <a routerLink="/auth/login" class="back-link">
            <i class="fas fa-arrow-left"></i>
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forgot-password-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    .forgot-password-card {
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .forgot-password-title {
      text-align: center;
      margin-bottom: 1rem;
      color: #495057;
      font-size: 1.875rem;
      font-weight: bold;
    }

    .forgot-password-subtitle {
      text-align: center;
      margin-bottom: 2rem;
      color: #6c757d;
      font-size: 0.875rem;
      line-height: 1.4;
    }

    .forgot-password-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #495057;
    }

    .form-input {
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 0.375rem;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .reset-button {
      background-color: #007bff;
      color: white;
      padding: 0.75rem;
      border: none;
      border-radius: 0.375rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .reset-button:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .reset-button:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .forgot-password-footer {
      margin-top: 2rem;
      text-align: center;
    }

    .back-link {
      color: #007bff;
      text-decoration: none;
      font-size: 0.875rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .back-link:hover {
      text-decoration: underline;
    }
  `]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      // TODO: Implement forgot password logic
      console.log('Forgot password form submitted:', this.forgotPasswordForm.value);
      // Show success message and navigate back to login
      alert('Password reset link sent to your email!');
      this.router.navigate(['/auth/login']);
    }
  }
}
