import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Project } from '../../../core/models/project.model';
import { Task } from '../../../core/models/task.model';
import { AppState } from '../../../core/store/reducers';
import * as ProjectActions from '../../../core/store/actions/project.actions';
import * as TaskActions from '../../../core/store/actions/task.actions';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <button routerLink="/projects" class="text-blue-600 hover:text-blue-800 mb-4">
          ← Back to Projects
        </button>
        <h1 class="text-3xl font-bold text-gray-900" *ngIf="project$ | async as project">
          {{ project.title }}
        </h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6" *ngIf="project$ | async as project">
        <!-- Project Info -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Project Details</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [ngClass]="getStatusColor(project.status)">
                  {{ project.status }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Priority</label>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [ngClass]="getPriorityColor(project.priority)">
                  {{ project.priority }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Start Date</label>
                <p class="text-sm text-gray-900">{{ project.startDate | date:'mediumDate' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">End Date</label>
                <p class="text-sm text-gray-900">{{ project.endDate | date:'mediumDate' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Budget</label>
                <p class="text-sm text-gray-900">{{ project.budget | currency }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Progress</label>
                <p class="text-sm text-gray-900">{{ project.progress }}%</p>
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <p class="text-sm text-gray-900 mt-1">{{ project.description }}</p>
            </div>
          </div>
        </div>

        <!-- Tasks Summary -->
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Tasks Overview</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Total Tasks</span>
                <span class="text-sm font-medium">{{ (tasks$ | async)?.length || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Completed</span>
                <span class="text-sm font-medium text-green-600">
                  {{ getCompletedTasksCount() }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">In Progress</span>
                <span class="text-sm font-medium text-blue-600">
                  {{ getInProgressTasksCount() }}
                </span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
            <div class="space-y-2">
              <button class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                Add Task
              </button>
              <button class="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm">
                Edit Project
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tasks List -->
      <div class="mt-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Project Tasks</h2>
          <button routerLink="/tasks/create" [queryParams]="{ projectId: projectId }"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Add Task
          </button>
        </div>

        <div class="bg-white shadow overflow-hidden sm:rounded-md" *ngIf="tasks$ | async as tasks">
          <ul class="divide-y divide-gray-200" *ngIf="tasks.length > 0; else noTasks">
            <li *ngFor="let task of tasks" class="px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-gray-900">{{ task.title }}</h3>
                  <p class="text-sm text-gray-600">{{ task.description }}</p>
                  <div class="mt-2 flex items-center space-x-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          [ngClass]="getTaskStatusColor(task.status)">
                      {{ task.status }}
                    </span>
                    <span class="text-sm text-gray-500">
                      Due: {{ task.dueDate | date:'shortDate' }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button routerLink="/tasks/{{ task.id }}"
                          class="text-blue-600 hover:text-blue-900 text-sm">
                    View
                  </button>
                  <button routerLink="/tasks/{{ task.id }}/edit"
                          class="text-green-600 hover:text-green-900 text-sm">
                    Edit
                  </button>
                </div>
              </div>
            </li>
          </ul>
          <ng-template #noTasks>
            <div class="text-center py-12">
              <p class="text-gray-500">No tasks found for this project.</p>
              <button routerLink="/tasks/create" [queryParams]="{ projectId: projectId }"
                      class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Create First Task
              </button>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProjectDetailComponent implements OnInit {
  project$: Observable<Project | null>;
  tasks$: Observable<Task[]>;
  projectId!: string;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    this.project$ = this.store.select(state => state.project.selectedProject);
    this.tasks$ = this.store.select(state => state.task.tasks);
  }

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    if (this.projectId) {
      this.store.dispatch(ProjectActions.loadProject({ id: this.projectId }));
      this.store.dispatch(TaskActions.loadTasks({ projectId: this.projectId }));
    }
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTaskStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getCompletedTasksCount(): number {
    // This would need to be implemented based on your state structure
    return 0;
  }

  getInProgressTasksCount(): number {
    // This would need to be implemented based on your state structure
    return 0;
  }
}
