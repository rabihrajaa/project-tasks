import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="settings-container">
      <div class="settings-header">
        <h1>Settings</h1>
      </div>

      <div class="settings-content">
        <div class="settings-section">
          <h2>Profile Settings</h2>
          <form [formGroup]="profileForm" class="settings-form">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  formControlName="firstName"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  formControlName="lastName"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="form-input"
              />
            </div>

            <button type="submit" [disabled]="profileForm.invalid" class="save-button">
              Save Profile
            </button>
          </form>
        </div>

        <div class="settings-section">
          <h2>Notification Settings</h2>
          <form [formGroup]="notificationForm" class="settings-form">
            <div class="form-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  formControlName="emailNotifications"
                  class="checkbox-input"
                />
                <span class="checkmark"></span>
                Email notifications for task updates
              </label>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  formControlName="projectUpdates"
                  class="checkbox-input"
                />
                <span class="checkmark"></span>
                Notifications for project updates
              </label>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  formControlName="dueDateReminders"
                  class="checkbox-input"
                />
                <span class="checkmark"></span>
                Due date reminders
              </label>
            </div>

            <button type="submit" class="save-button">
              Save Notifications
            </button>
          </form>
        </div>

        <div class="settings-section">
          <h2>Security</h2>
          <form [formGroup]="securityForm" (ngSubmit)="onChangePassword()" class="settings-form">
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                formControlName="currentPassword"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                formControlName="newPassword"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                formControlName="confirmPassword"
                class="form-input"
              />
            </div>

            <button type="submit" [disabled]="securityForm.invalid" class="save-button">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .settings-header {
      margin-bottom: 2rem;
    }

    .settings-header h1 {
      margin: 0;
      color: #495057;
      font-size: 2rem;
      font-weight: bold;
    }

    .settings-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .settings-section {
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .settings-section h2 {
      margin: 0 0 1.5rem 0;
      color: #495057;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .settings-form {
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

    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-weight: normal;
      margin-bottom: 0;
    }

    .checkbox-input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
    }

    .checkmark {
      height: 20px;
      width: 20px;
      background-color: #fff;
      border: 2px solid #ced4da;
      border-radius: 4px;
      margin-right: 0.75rem;
      position: relative;
      transition: all 0.2s;
    }

    .checkbox-input:checked ~ .checkmark {
      background-color: #007bff;
      border-color: #007bff;
    }

    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }

    .checkbox-input:checked ~ .checkmark:after {
      display: block;
    }

    .checkmark:after {
      left: 6px;
      top: 2px;
      width: 6px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .save-button {
      background-color: #007bff;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.375rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
      align-self: flex-start;
    }

    .save-button:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .save-button:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SettingsComponent {
  profileForm: FormGroup;
  notificationForm: FormGroup;
  securityForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]]
    });

    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      projectUpdates: [true],
      dueDateReminders: [true]
    });

    this.securityForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    return null;
  }

  onSaveProfile() {
    if (this.profileForm.valid) {
      // TODO: Implement save profile logic
      console.log('Profile saved:', this.profileForm.value);
    }
  }

  onSaveNotifications() {
    // TODO: Implement save notifications logic
    console.log('Notifications saved:', this.notificationForm.value);
  }

  onChangePassword() {
    if (this.securityForm.valid) {
      // TODO: Implement change password logic
      console.log('Password changed');
      this.securityForm.reset();
    }
  }
}
