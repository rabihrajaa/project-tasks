import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as ProjectActions from '../../../core/store/actions/project.actions';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="project-form-container">
      <div class="project-form-card">
        <h2 class="project-form-title">{{ isEditMode ? 'Edit Project' : 'Create New Project' }}</h2>

        <form [formGroup]="projectForm" (ngSubmit)="onSubmit()" class="project-form">
          <div class="form-row">
            <div class="form-group">
              <label for="title">Project Name *</label>
              <input
                type="text"
                id="title"
                formControlName="title"
                placeholder="Enter project name"
                class="form-input"
              />
              <div *ngIf="projectForm.get('title')?.invalid && projectForm.get('title')?.touched" class="error-message">
                Project name is required
              </div>
            </div>

            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" formControlName="status" class="form-select">
                <option value="PLANNING">Planning</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              formControlName="description"
              placeholder="Enter project description"
              rows="4"
              class="form-textarea"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                formControlName="startDate"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                formControlName="endDate"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="priority">Priority</label>
              <select id="priority" formControlName="priority" class="form-select">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div class="form-group">
              <label for="budget">Budget</label>
              <input
                type="number"
                id="budget"
                formControlName="budget"
                placeholder="Enter budget"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" (click)="onCancel()" class="cancel-button">
              Cancel
            </button>
            <button type="submit" [disabled]="projectForm.invalid" class="submit-button">
              {{ isEditMode ? 'Update Project' : 'Create Project' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .project-form-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .project-form-card {
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .project-form-title {
      margin-bottom: 2rem;
      color: #495057;
      font-size: 1.875rem;
      font-weight: bold;
    }

    .project-form {
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

    .form-input, .form-select, .form-textarea {
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 0.375rem;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    .cancel-button {
      background-color: #6c757d;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.375rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .cancel-button:hover {
      background-color: #545b62;
    }

    .submit-button {
      background-color: #007bff;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.375rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .submit-button:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .submit-button:disabled {
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
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  projectId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['PLANNING'],
      priority: ['MEDIUM'],
      startDate: [''],
      endDate: [''],
      budget: ['']
    });
  }

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.projectId;

    if (this.isEditMode && this.projectId) {
      // TODO: Load project data for editing
      console.log('Loading project for editing:', this.projectId);
    }
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;

      // Map form fields to project model
      const projectData = {
        title: formValue.title,
        description: formValue.description,
        status: formValue.status === 'ACTIVE' ? 'IN_PROGRESS' : formValue.status,
        priority: formValue.priority,
        startDate: formValue.startDate ? formValue.startDate + 'T00:00:00' : undefined,
        endDate: formValue.endDate ? formValue.endDate + 'T00:00:00' : undefined,
        budget: formValue.budget ? parseFloat(formValue.budget) : undefined,
        progress: 0 // Default progress
      };

      console.log('Project form submitted:', projectData);

      if (this.isEditMode && this.projectId) {
        // Update project
        this.store.dispatch(ProjectActions.updateProject({ id: this.projectId, project: projectData }));
      } else {
        // Create project
        this.store.dispatch(ProjectActions.createProject({ project: projectData }));
      }

      // Navigate back to projects list
      this.router.navigate(['/projects']);
    }
  }

  onCancel() {
    this.router.navigate(['/projects']);
  }
}
