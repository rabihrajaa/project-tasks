import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="projects-container">
      <div class="projects-header">
        <h1>Projects</h1>
        <button class="create-button" (click)="onCreateProject()">
          <i class="fas fa-plus"></i>
          Create Project
        </button>
      </div>

      <div class="projects-content">
        <div *ngIf="projects$ | async as projects; else loading" class="projects-grid">
          <div *ngFor="let project of projects" class="project-card" (click)="onProjectClick(project)">
            <div class="project-header">
              <h3 class="project-title">{{ project.title }}</h3>
              <span class="project-status" [class]="'status-' + project.status.toLowerCase()">
                {{ project.status }}
              </span>
            </div>

            <p class="project-description">
              {{ project.description | slice:0:150 }}{{ project.description.length > 150 ? '...' : '' }}
            </p>

            <div class="project-meta">
              <div class="meta-item">
                <i class="fas fa-flag"></i>
                <span>{{ project.priority }}</span>
              </div>
              <div class="meta-item" *ngIf="project.startDate">
                <i class="fas fa-calendar"></i>
                <span>{{ project.startDate | date:'shortDate' }}</span>
              </div>
              <div class="meta-item" *ngIf="project.budget">
                <i class="fas fa-dollar-sign"></i>
                <span>{{ project.budget | currency }}</span>
              </div>
            </div>

            <div class="project-progress" *ngIf="project.progress !== undefined">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="project.progress"></div>
              </div>
              <span class="progress-text">{{ project.progress }}% Complete</span>
            </div>
          </div>

          <div *ngIf="projects.length === 0" class="no-projects">
            <i class="fas fa-folder-open"></i>
            <p>No projects found</p>
          </div>
        </div>

        <ng-template #loading>
          <div class="loading-container">
            <div class="loading-spinner">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
            <p>Loading projects...</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .projects-container {
      padding: 1.5rem;
      animation: slideUp 0.4s ease-out;
    }

    .projects-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .projects-header h1 {
      margin: 0;
      color: var(--text-primary);
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .create-button {
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      color: white;
      border: none;
      border-radius: 0.5rem;
      padding: 0.875rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .create-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    }

    .projects-content {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 0.75rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      min-height: 400px;
      backdrop-filter: blur(10px);
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
      padding: 1.5rem;
    }

    .project-card {
      border: 1px solid var(--border-color);
      border-radius: 0.75rem;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      background: var(--bg-secondary);
      position: relative;
      overflow: hidden;
    }

    .project-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .project-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
      border-color: var(--accent-primary);
    }

    .project-card:hover::before {
      transform: scaleX(1);
    }

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .project-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      flex: 1;
      margin-right: 0.5rem;
    }

    .project-status {
      padding: 0.375rem 0.875rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .status-planning { background: var(--disabled); color: var(--text-primary); }
    .status-active { background: var(--success); color: white; }
    .status-on_hold { background: var(--warning); color: var(--bg-primary); }
    .status-completed { background: var(--success); color: white; }
    .status-cancelled { background: var(--danger); color: white; }

    .project-description {
      color: var(--text-secondary);
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .project-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
      background: var(--bg-tertiary);
      padding: 0.375rem 0.75rem;
      border-radius: 0.375rem;
      border: 1px solid var(--border-color);
    }

    .meta-item i {
      font-size: 0.75rem;
      color: var(--accent-primary);
    }

    .project-progress {
      margin-top: 1rem;
    }

    .progress-bar {
      width: 100%;
      height: 10px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 0.5rem;
      position: relative;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
      transition: width 0.4s ease;
      border-radius: 4px;
    }

    .progress-text {
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .no-projects {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);
    }

    .no-projects i {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
      color: var(--text-muted);
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      color: var(--text-secondary);
    }

    .loading-spinner i {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: var(--accent-primary);
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .projects-container {
        padding: 1rem;
      }

      .projects-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .projects-header h1 {
        font-size: 1.75rem;
      }

      .projects-grid {
        grid-template-columns: 1fr;
        padding: 1rem;
      }

      .project-card {
        padding: 1.25rem;
      }
    }
  `]
})
export class ProjectsListComponent implements OnInit {
  projects$: Observable<Project[]>;

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) {
    this.projects$ = this.projectService.getProjects().pipe(map(result => result.projects));
  }

  ngOnInit() {
    // Initial load
    this.projectService.getProjects().subscribe();
  }

  onCreateProject() {
    this.router.navigate(['/projects/create']);
  }

  onProjectClick(project: Project) {
    this.router.navigate(['/projects', project.id]);
  }
}
