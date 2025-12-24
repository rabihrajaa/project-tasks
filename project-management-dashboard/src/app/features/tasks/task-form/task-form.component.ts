import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';
import { Task } from '../../../core/models/task.model';
import { AppState } from '../../../core/store/reducers';
import * as TaskActions from '../../../core/store/actions/task.actions';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="task-form-container">
      <div class="task-form-card">
        <h2 class="task-form-title">{{ isEditMode ? 'Edit Task' : 'Create New Task' }}</h2>

        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="task-form">
          <div class="form-group">
            <label for="title">Task Title *</label>
            <input
              type="text"
              id="title"
              formControlName="title"
              placeholder="Enter task title"
              class="form-input"
            />
            <div *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched" class="error-message">
              Task title is required
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              formControlName="description"
              placeholder="Enter task description"
              rows="4"
              class="form-textarea"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" formControlName="status" class="form-select">
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>

            <div class="form-group">
              <label for="priority">Priority</label>
              <select id="priority" formControlName="priority" class="form-select">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="dueDate">Due Date</label>
              <input
                type="datetime-local"
                id="dueDate"
                formControlName="dueDate"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="estimatedHours">Estimated Hours</label>
              <input
                type="number"
                id="estimatedHours"
                formControlName="estimatedHours"
                placeholder="Enter estimated hours"
                min="0"
                step="0.5"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="projectId">Project</label>
            <select id="projectId" formControlName="projectId" class="form-select">
              <option value="">Select a project</option>
              <option *ngFor="let project of projects" [value]="project.id">
                {{ project.title }}
              </option>
            </select>
          </div>

          <div class="form-actions">
            <button type="button" (click)="onCancel()" class="cancel-button">
              Cancel
            </button>
            <button type="submit" [disabled]="taskForm.invalid" class="submit-button">
              {{ isEditMode ? 'Update Task' : 'Create Task' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .task-form-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .task-form-card {
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .task-form-title {
      margin-bottom: 2rem;
      color: #495057;
      font-size: 1.875rem;
      font-weight: bold;
    }

    .task-form {
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

    .assigned-users, .tags {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .user-input-group, .tag-input-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .user-input, .tag-input {
      flex: 1;
    }

    .remove-user-btn, .remove-tag-btn {
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 0.25rem;
      width: 32px;
      height: 32px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }

    .remove-user-btn:hover, .remove-tag-btn:hover {
      background-color: #c82333;
    }

    .add-user-btn, .add-tag-btn {
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 0.375rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      align-self: flex-start;
      transition: background-color 0.2s;
    }

    .add-user-btn:hover, .add-tag-btn:hover {
      background-color: #218838;
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
export class TaskFormComponent implements OnInit, OnDestroy {
  taskForm: FormGroup;
  isEditMode = false;
  taskId: string | null = null;
  projects: Project[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private store: Store<AppState>
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['TODO'],
      priority: ['MEDIUM'],
      dueDate: [''],
      estimatedHours: [''],
      projectId: ['']
    });
  }

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.taskId;

    // Load projects for the dropdown
    this.loadProjects();

    if (this.isEditMode && this.taskId) {
      // Dispatch action to load task data for editing
      this.store.dispatch(TaskActions.loadTask({ id: this.taskId }));

      // Subscribe to selectedTask to populate form when data is loaded
      this.store.pipe(
        select(state => state.task.selectedTask),
        filter(task => !!task),
        takeUntil(this.destroy$)
      ).subscribe(task => {
        this.populateForm(task!);
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: ({ projects }) => {
        this.projects = projects;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
  }

  populateForm(task: Task) {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? this.formatDateForInput(task.dueDate) : '',
      estimatedHours: task.estimatedHours || '',
      projectId: task.projectId
    });
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;

      // Convert date string to Date object if needed
      if (formValue.dueDate) {
        formValue.dueDate = new Date(formValue.dueDate);
      }

      console.log('Task form submitted:', formValue);

      if (this.isEditMode && this.taskId) {
        // Update task
        this.store.dispatch(TaskActions.updateTask({ id: this.taskId, task: formValue }));
      } else {
        // Create task
        this.store.dispatch(TaskActions.createTask({ task: formValue }));
      }

      // Navigate back to tasks list
      this.router.navigate(['/tasks']);
    }
  }

  onCancel() {
    this.router.navigate(['/tasks']);
  }
}
