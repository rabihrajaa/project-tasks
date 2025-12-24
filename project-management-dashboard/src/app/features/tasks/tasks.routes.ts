import { Routes } from '@angular/router';

export const tasksRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tasks-list/tasks-list.component').then(m => m.TasksListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./task-form/task-form.component').then(m => m.TaskFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./task-detail/task-detail.component').then(m => m.TaskDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./task-form/task-form.component').then(m => m.TaskFormComponent)
  }
];
