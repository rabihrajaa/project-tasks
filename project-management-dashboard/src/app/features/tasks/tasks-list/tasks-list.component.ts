import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, combineLatest, map, startWith, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { Task, TaskFilters } from '../../../core/models/task.model';
import { Project } from '../../../core/models/project.model';
import { AppState } from '../../../core/store/reducers';
import * as TaskActions from '../../../core/store/actions/task.actions';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="tasks-container">
      <div class="tasks-header">
        <h1>Tasks</h1>
        <button class="create-button" (click)="onCreateTask()">
          <i class="fas fa-plus"></i>
          Create Task
        </button>
      </div>

      <div class="filters-section">
        <form [formGroup]="filtersForm" class="filters-form">
          <div class="filter-group">
            <input
              type="text"
              formControlName="search"
              placeholder="Search tasks..."
              class="search-input"
            />
          </div>

          <div class="filter-group">
            <select formControlName="status" class="filter-select">
              <option value="">All Status</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Done</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>

          <div class="filter-group">
            <select formControlName="priority" class="filter-select">
              <option value="">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div class="filter-group">
            <select formControlName="projectId" class="filter-select">
              <option value="">All Projects</option>
              <option value="__no_project__">No Project</option>
              <option *ngFor="let project of projects" [value]="project.id">
                {{ project.title }}
              </option>
            </select>
            <div *ngIf="projects.length === 0" class="loading-text">Loading projects...</div>
          </div>

          <button type="button" (click)="onClearFilters()" class="clear-button">
            Clear
          </button>
        </form>
      </div>

      <div class="tasks-content">
        <div *ngIf="tasks$ | async as tasks; else loading" class="tasks-grid">
          <div *ngFor="let task of tasks" class="task-card" (click)="onTaskClick(task)">
            <div class="task-header">
              <h3 class="task-title">{{ task.title }}</h3>
              <span class="task-status" [class]="'status-' + (task.status || '').toLowerCase()">
                {{ (task.status || '').replace('_', ' ') }}
              </span>
            </div>

            <p class="task-description">
              {{ (task.description || '') | slice:0:100 }}{{ (task.description || '').length > 100 ? '...' : '' }}
            </p>

            <div class="task-meta">
              <span class="task-priority" [class]="'priority-' + (task.priority || '').toLowerCase()">
                {{ task.priority || '' }}
              </span>
              <span class="task-project" *ngIf="!task.projectId">
                <i class="fas fa-folder-open"></i> No Project
              </span>
              <span class="task-project" *ngIf="task.projectId">
                <i class="fas fa-folder"></i> {{ getProjectName(task.projectId) }}
              </span>
              <span class="task-due-date" *ngIf="task.dueDate">
                Due: {{ task.dueDate | date:'shortDate' }}
              </span>
            </div>

            <div class="task-assignees" *ngIf="task.assignedUsers && task.assignedUsers.length > 0">
              <div class="assignee-avatars">
                <div
                  *ngFor="let user of (task.assignedUsers || []).slice(0, 3); let i = index"
                  class="assignee-avatar"
                  [title]="user"
                >
                  {{ (user || '').charAt(0).toUpperCase() }}
                </div>
                <div *ngIf="task.assignedUsers.length > 3" class="assignee-more">
                  +{{ task.assignedUsers.length - 3 }}
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="tasks.length === 0" class="no-tasks">
            <i class="fas fa-tasks"></i>
            <p>No tasks found</p>
          </div>
        </div>

        <ng-template #loading>
          <div class="loading-container">
            <div class="loading-spinner">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
            <p>Loading tasks...</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .tasks-container {
      padding: 20px;
    }

    .tasks-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .tasks-header h1 {
      margin: 0;
      color: #495057;
      font-size: 2rem;
      font-weight: bold;
    }

    .create-button {
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 0.375rem;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.2s;
    }

    .create-button:hover {
      background-color: #0056b3;
    }

    .filters-section {
      background: white;
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }

    .filters-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
    }

    .search-input, .filter-select {
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 0.375rem;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .search-input:focus, .filter-select:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    .clear-button {
      background-color: #6c757d;
      color: white;
      border: none;
      border-radius: 0.375rem;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .clear-button:hover {
      background-color: #545b62;
    }

    .loading-text {
      font-size: 0.875rem;
      color: #6c757d;
      margin-top: 0.25rem;
    }

    .tasks-content {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      min-height: 400px;
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      padding: 1.5rem;
    }

    .task-card {
      border: 1px solid #e9ecef;
      border-radius: 0.5rem;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      background: white;
    }

    .task-card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }

    .task-title {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #495057;
      flex: 1;
      margin-right: 0.5rem;
    }

    .task-status {
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-todo { background-color: #e9ecef; color: #495057; }
    .status-in_progress { background-color: #cce5ff; color: #004085; }
    .status-in_review { background-color: #d1ecf1; color: #0c5460; }
    .status-done { background-color: #d4edda; color: #155724; }
    .status-blocked { background-color: #f8d7da; color: #721c24; }

    .task-description {
      color: #6c757d;
      margin-bottom: 0.75rem;
      line-height: 1.4;
    }

    .task-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .task-priority {
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .priority-low { background-color: #e9ecef; color: #495057; }
    .priority-medium { background-color: #cce5ff; color: #004085; }
    .priority-high { background-color: #f8d7da; color: #721c24; }
    .priority-urgent { background-color: #f5c6cb; color: #721c24; }

    .task-due-date {
      font-size: 0.875rem;
      color: #6c757d;
    }

    .task-project {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      color: #6c757d;
      background-color: #f8f9fa;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
    }

    .task-project i {
      font-size: 0.625rem;
    }

    .task-assignees {
      margin-top: 0.75rem;
    }

    .assignee-avatars {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .assignee-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #007bff;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .assignee-more {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #6c757d;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .no-tasks {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      color: #6c757d;
    }

    .no-tasks i {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      color: #6c757d;
    }

    .loading-spinner i {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    @media (max-width: 768px) {
      .tasks-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .filters-form {
        grid-template-columns: 1fr;
      }

      .tasks-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TasksListComponent implements OnInit, OnDestroy {
  filtersForm: FormGroup;
  tasks$: Observable<Task[]>;
  projects: Project[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private projectService: ProjectService,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.filtersForm = this.fb.group({
      search: [''],
      status: [''],
      priority: [''],
      assignedUser: [''],
      projectId: [''],
      dueDate: [''],
      tags: ['']
    });

    this.tasks$ = combineLatest([
      this.store.select(state => state.task.tasks).pipe(startWith([])),
      this.filtersForm.valueChanges.pipe(startWith(this.filtersForm.value))
    ]).pipe(
      map(([tasks, filters]) => this.filterTasks(tasks, filters))
    );
  }

  ngOnInit() {
    // Load projects for filter dropdown
    this.loadProjects();

    // Initial load
    this.store.dispatch(TaskActions.loadTasks({}));
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterTasks(tasks: Task[], filters: any): Task[] {
    if (!tasks || tasks.length === 0) {
      return [];
    }

    return tasks.filter(task => {
      if (!task) return false;

      // Search filter
      if (filters.search && filters.search.trim()) {
        const searchTerm = filters.search.toLowerCase().trim();
        const title = (task.title || '').toLowerCase();
        const description = (task.description || '').toLowerCase();
        if (!title.includes(searchTerm) && !description.includes(searchTerm)) {
          return false;
        }
      }

      // Status filter
      if (filters.status && filters.status !== '') {
        if ((task.status || '') !== filters.status) {
          return false;
        }
      }

      // Priority filter
      if (filters.priority && filters.priority !== '') {
        if ((task.priority || '') !== filters.priority) {
          return false;
        }
      }

      // Project filter - handle tasks with and without projectId
      if (filters.projectId && filters.projectId !== '') {
        const taskProjectId = task.projectId;

        if (filters.projectId === '__no_project__') {
          // Show only tasks without project
          if (taskProjectId) {
            return false;
          }
        } else {
          // Convert both to string for comparison
          const taskIdStr = String(taskProjectId || '');
          const filterIdStr = String(filters.projectId);

          if (!taskProjectId || taskIdStr !== filterIdStr) {
            return false;
          }
        }
      }

      return true;
    });
  }

  onCreateTask() {
    this.router.navigate(['/tasks/create']);
  }

  onTaskClick(task: Task) {
    this.router.navigate(['/tasks', task.id]);
  }

  onClearFilters() {
    this.filtersForm.reset();
  }

  getProjectName(projectId: string): string {
    const project = this.projects.find(p => p.id === projectId);
    return project ? project.title : 'Unknown Project';
  }
}
