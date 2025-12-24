import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, catchError, of, throwError } from 'rxjs';

import { Task, TaskStats, CreateTaskRequest, UpdateTaskRequest, TaskFilters } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_URL = '/api/tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all tasks with optional filters and pagination
  getTasks(filters?: TaskFilters, page: number = 0, size: number = 10): Observable<{ tasks: Task[], total: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.priority) params = params.set('priority', filters.priority);
      if (filters.assignedUser) params = params.set('assignedUser', filters.assignedUser);
      if (filters.projectId) params = params.set('projectId', filters.projectId);
      if (filters.tags && filters.tags.length > 0) params = params.set('tags', filters.tags.join(','));
      if (filters.dueDate) params = params.set('dueDate', filters.dueDate.toISOString());
      if (filters.search) params = params.set('search', filters.search);
    }

    return this.http.get<{ content: Task[], totalElements: number }>(this.API_URL, { params }).pipe(
      map(response => ({
        tasks: response.content,
        total: response.totalElements
      })),
      tap(({ tasks }) => this.updateTasksList(tasks)),
      catchError(err => {
        // Network or gateway error (e.g. 503) — return safe empty result and keep UI stable
        console.error('Failed to load tasks', err);
        this.updateTasksList([]);
        return of({ tasks: [], total: 0 });
      })
    );
  }

  // Get task by ID
  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.API_URL}/${id}`).pipe(
      catchError(err => {
        console.error('Failed to load task', err);
        return throwError(() => err);
      })
    );
  }

  // Create new task
  createTask(request: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.API_URL, request).pipe(
      tap(task => this.addTaskToList(task)),
      catchError(err => {
        console.error('Failed to create task', err);
        return throwError(() => err);
      })
    );
  }

  // Update existing task
  updateTask(id: string, request: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/${id}`, request).pipe(
      tap(task => this.updateTaskInList(task)),
      catchError(err => {
        console.error('Failed to update task', err);
        return throwError(() => err);
      })
    );
  }

  // Delete task
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => this.removeTaskFromList(id)),
      catchError(err => {
        console.error('Failed to delete task', err);
        return throwError(() => err);
      })
    );
  }

  // Update task status
  updateTaskStatus(id: string, status: string): Observable<Task> {
    return this.http.patch<Task>(`${this.API_URL}/${id}/status`, { status }).pipe(
      tap(task => this.updateTaskInList(task)),
      catchError(err => {
        console.error('Failed to update task status', err);
        return throwError(() => err);
      })
    );
  }

  // Assign user to task
  assignUserToTask(taskId: string, userId: string): Observable<Task> {
    return this.http.post<Task>(`${this.API_URL}/${taskId}/assign/${userId}`, {}).pipe(
      tap(task => this.updateTaskInList(task)),
      catchError(err => {
        console.error('Failed to assign user to task', err);
        return throwError(() => err);
      })
    );
  }

  // Remove user from task
  removeUserFromTask(taskId: string, userId: string): Observable<Task> {
    return this.http.delete<Task>(`${this.API_URL}/${taskId}/assign/${userId}`).pipe(
      tap(task => this.updateTaskInList(task)),
      catchError(err => {
        console.error('Failed to remove user from task', err);
        return throwError(() => err);
      })
    );
  }

  // Get task statistics
  getTaskStats(): Observable<TaskStats> {
    return this.http.get<TaskStats>(`${this.API_URL}/stats`).pipe(
      catchError(err => {
        console.error('Failed to load task stats', err);
        return of({} as TaskStats);
      })
    );
  }

  // Get tasks assigned to current user
  getMyTasks(page: number = 0, size: number = 10): Observable<{ tasks: Task[], total: number }> {
    return this.http.get<{ content: Task[], totalElements: number }>(`${this.API_URL}/my-tasks`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
    }).pipe(
      map(response => ({
        tasks: response.content,
        total: response.totalElements
      })),
      catchError(err => {
        console.error('Failed to load my tasks', err);
        return of({ tasks: [], total: 0 });
      })
    );
  }

  // Get tasks by project
  getTasksByProject(projectId: string, page: number = 0, size: number = 10): Observable<{ tasks: Task[], total: number }> {
    return this.http.get<{ content: Task[], totalElements: number }>(`${this.API_URL}/project/${projectId}`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
    }).pipe(
      map(response => ({
        tasks: response.content,
        total: response.totalElements
      })),
      catchError(err => {
        console.error('Failed to load project tasks', err);
        return of({ tasks: [], total: 0 });
      })
    );
  }

  // Private methods for managing local state
  private updateTasksList(tasks: Task[]): void {
    this.tasksSubject.next(tasks);
  }

  private addTaskToList(task: Task): void {
    if (!task) return;
    const currentTasks = this.tasksSubject.value || [];
    this.tasksSubject.next([...currentTasks, task]);
  }

  private updateTaskInList(updatedTask: Task): void {
    if (!updatedTask) return;
    const currentTasks = this.tasksSubject.value || [];
    const index = currentTasks.findIndex(t => t && t.id === updatedTask.id);
    if (index !== -1) {
      currentTasks[index] = updatedTask;
      this.tasksSubject.next([...currentTasks]);
    }
  }

  private removeTaskFromList(id: string): void {
    const currentTasks = this.tasksSubject.value;
    const filteredTasks = currentTasks.filter(t => t.id !== id);
    this.tasksSubject.next(filteredTasks);
  }
}
