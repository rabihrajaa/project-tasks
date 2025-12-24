import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

import { Project, ProjectStats, CreateProjectRequest, UpdateProjectRequest, ProjectFilters } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly API_URL = '/api/projects';
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all projects with optional filters and pagination
  getProjects(filters?: ProjectFilters, page: number = 0, size: number = 10): Observable<{ projects: Project[], total: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.priority) params = params.set('priority', filters.priority);
      if (filters.assignedUser) params = params.set('assignedUser', filters.assignedUser);
      if (filters.search) params = params.set('search', filters.search);
      if (filters.dateRange?.start) params = params.set('startDate', filters.dateRange.start);
      if (filters.dateRange?.end) params = params.set('endDate', filters.dateRange.end);
    }

    return this.http.get<{ content: Project[], totalElements: number }>(this.API_URL, { params }).pipe(
      map(response => ({
        projects: response.content,
        total: response.totalElements
      })),
      tap(({ projects }) => this.updateProjectsList(projects))
    );
  }

  // Get project by ID
  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.API_URL}/${id}`);
  }

  // Create new project
  createProject(request: CreateProjectRequest): Observable<Project> {
    return this.http.post<Project>(this.API_URL, request).pipe(
      tap(project => this.addProjectToList(project))
    );
  }

  // Update existing project
  updateProject(id: string, request: UpdateProjectRequest): Observable<Project> {
    return this.http.put<Project>(`${this.API_URL}/${id}`, request).pipe(
      tap(project => this.updateProjectInList(project))
    );
  }

  // Delete project
  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => this.removeProjectFromList(id))
    );
  }

  // Update project progress
  updateProjectProgress(id: string, progress: number): Observable<Project> {
    return this.http.patch<Project>(`${this.API_URL}/${id}/progress`, { progress }).pipe(
      tap(project => this.updateProjectInList(project))
    );
  }

  // Assign user to project
  assignUserToProject(projectId: string, userId: string): Observable<Project> {
    return this.http.post<Project>(`${this.API_URL}/${projectId}/assign/${userId}`, {}).pipe(
      tap(project => this.updateProjectInList(project))
    );
  }

  // Remove user from project
  removeUserFromProject(projectId: string, userId: string): Observable<Project> {
    return this.http.delete<Project>(`${this.API_URL}/${projectId}/assign/${userId}`).pipe(
      tap(project => this.updateProjectInList(project))
    );
  }

  // Get project statistics
  getProjectStats(): Observable<ProjectStats> {
    return this.http.get<ProjectStats>(`${this.API_URL}/stats`);
  }

  // Get projects assigned to current user
  getMyProjects(page: number = 0, size: number = 10): Observable<{ projects: Project[], total: number }> {
    return this.http.get<{ content: Project[], totalElements: number }>(`${this.API_URL}/my-projects`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
    }).pipe(
      map(response => ({
        projects: response.content,
        total: response.totalElements
      }))
    );
  }

  // Private methods for managing local state
  private updateProjectsList(projects: Project[]): void {
    this.projectsSubject.next(projects);
  }

  private addProjectToList(project: Project): void {
    const currentProjects = this.projectsSubject.value;
    this.projectsSubject.next([...currentProjects, project]);
  }

  private updateProjectInList(updatedProject: Project): void {
    const currentProjects = this.projectsSubject.value;
    const index = currentProjects.findIndex(p => p.id === updatedProject.id);
    if (index !== -1) {
      currentProjects[index] = updatedProject;
      this.projectsSubject.next([...currentProjects]);
    }
  }

  private removeProjectFromList(id: string): void {
    const currentProjects = this.projectsSubject.value;
    const filteredProjects = currentProjects.filter(p => p.id !== id);
    this.projectsSubject.next(filteredProjects);
  }
}
