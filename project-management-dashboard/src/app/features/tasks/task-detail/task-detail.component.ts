import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="task-detail-root" *ngIf="task$ | async as task; else loading">
      <div class="task-card">
        <header class="task-header">
          <div class="title-wrap">
            <button class="back-ghost" (click)="onBack()"><i class="fas fa-arrow-left"></i></button>
            <h1 class="task-title">{{ task.title || 'Untitled Task' }}</h1>
            <span class="status-badge" [ngClass]="'status-' + (task.status || '').toLowerCase()">{{ (task.status || '').replace('_',' ') }}</span>
          </div>
          <div class="actions">
            <button class="btn btn-edit" (click)="onEdit()"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-delete" (click)="onDelete()"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </header>

        <section class="meta-grid">
          <div class="meta-chip">
            <i class="fas fa-flag"></i>
            <div>
              <div class="chip-label">Priority</div>
              <div class="chip-value" [ngClass]="'priority-' + (task.priority || '').toLowerCase()">{{ task.priority || 'N/A' }}</div>
            </div>
          </div>

          <div class="meta-chip">
            <i class="fas fa-calendar-alt"></i>
            <div>
              <div class="chip-label">Due Date</div>
              <div class="chip-value">{{ task.dueDate ? (task.dueDate | date:'mediumDate') : '—' }}</div>
            </div>
          </div>

          <div class="meta-chip">
            <i class="fas fa-clock"></i>
            <div>
              <div class="chip-label">Estimated</div>
              <div class="chip-value">{{ task.estimatedHours ? task.estimatedHours + 'h' : '—' }}</div>
            </div>
          </div>

          <div class="meta-chip">
            <i class="fas fa-folder-open"></i>
            <div>
              <div class="chip-label">Project</div>
              <div class="chip-value"><a class="project-link" [routerLink]="['/projects', task.projectId]">{{ task.projectId ? ('Project #' + task.projectId) : '—' }}</a></div>
            </div>
          </div>
        </section>

        <section class="content-columns">
          <div class="main-column">
            <div class="card description-card">
              <h3 class="section-title">Description</h3>
              <div class="description-body">{{ task.description || 'No description provided.' }}</div>
            </div>

            <div class="card details-row">
              <div class="detail-item">
                <div class="label">Created</div>
                <div class="value">{{ task.createdAt ? (task.createdAt | date:'medium') : '—' }}</div>
              </div>
              <div class="detail-item">
                <div class="label">Updated</div>
                <div class="value">{{ task.updatedAt ? (task.updatedAt | date:'medium') : '—' }}</div>
              </div>
            </div>
          </div>

          <aside class="side-column">
            <div class="card assignees-card" *ngIf="(task.assignedUsers || []).length > 0">
              <h4 class="section-title">Assignees</h4>
              <div class="assignees">
                <div *ngFor="let user of (task.assignedUsers || [])" class="assignee">
                  <div class="avatar">{{ (user || '').charAt(0) | uppercase }}</div>
                  <div class="assignee-name">{{ user }}</div>
                </div>
              </div>
            </div>

            <div class="card project-card" *ngIf="task.projectId">
              <h4 class="section-title">Project</h4>
              <div class="project-body">
                <div class="project-name">Project #{{ task.projectId }}</div>
                <a class="project-link" [routerLink]="['/projects', task.projectId]">Open project</a>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading-wrap">
        <i class="fas fa-spinner fa-spin fa-2x"></i>
        <p>Loading task details…</p>
      </div>
    </ng-template>
  `,
  styles: [`
    :host { display: block; padding: 20px; }
    .task-detail-root { max-width: 1100px; margin: 0 auto; }

    .task-card {
      background: linear-gradient(180deg, rgba(17,24,39,0.95), rgba(12,18,30,0.95));
      border-radius: 12px;
      padding: 20px;
      color: #E5E7EB;
      box-shadow: 0 6px 18px rgba(2,6,23,0.6);
    }

    .task-header { display:flex; justify-content:space-between; align-items:center; gap: 12px; }
    .title-wrap { display:flex; align-items:center; gap:12px; }
    .back-ghost { background: transparent; border: none; color: #9CA3AF; font-size: 1.1rem; padding:6px; border-radius:6px; }
    .back-ghost:hover { background: rgba(255,255,255,0.03); }

    .task-title { font-size: 1.6rem; margin:0; font-weight:700; color: #F8FAFC; }
    .status-badge { padding:6px 10px; border-radius:999px; font-weight:600; font-size:0.78rem; text-transform:uppercase; color:#0F172A; }
    .status-todo { background: #9CA3AF; color: #0F172A; }
    .status-in_progress { background: #3B82F6; color: white; }
    .status-done { background: #10B981; color: white; }
    .status-blocked { background: #EF4444; color: white; }

    .actions { display:flex; gap:8px; }
    .btn { border: none; padding:8px 12px; border-radius:8px; cursor:pointer; font-weight:600; }
    .btn-edit { background:#2563EB; color:white; }
    .btn-delete { background:#DC2626; color:white; }

    .meta-grid { display:grid; grid-template-columns: repeat(4, 1fr); gap:12px; margin-top:18px; }
    .meta-chip { display:flex; gap:10px; align-items:center; background: rgba(255,255,255,0.02); padding:10px; border-radius:10px; }
    .meta-chip i { color:#9CA3AF; width:28px; text-align:center; }
    .chip-label { font-size:0.75rem; color:#9CA3AF; }
    .chip-value { font-weight:700; color:#E5E7EB; }
    .priority-low { color:#10B981; }
    .priority-medium { color:#F59E0B; }
    .priority-high { color:#EF4444; }

    .content-columns { display:grid; grid-template-columns: 1fr 320px; gap:18px; margin-top:18px; }
    .main-column { display:flex; flex-direction:column; gap:12px; }
    .card { background: rgba(255,255,255,0.02); padding:14px; border-radius:10px; }
    .description-card .section-title { margin:0 0 8px 0; color:#E5E7EB; }
    .description-body { color:#D1D5DB; line-height:1.6; }

    .details-row { display:flex; gap:12px; }
    .detail-item .label { font-size:0.75rem; color:#9CA3AF; }
    .detail-item .value { color:#E5E7EB; font-weight:600; }

    .side-column { display:flex; flex-direction:column; gap:12px; }
    .assignees { display:flex; flex-direction:column; gap:8px; }
    .assignee { display:flex; gap:8px; align-items:center; }
    .avatar { width:36px; height:36px; border-radius:8px; background:#111827; display:flex; align-items:center; justify-content:center; color:#E5E7EB; font-weight:700; }

    .project-card .project-name { font-weight:700; color:#E5E7EB; }
    .project-link { color:#93C5FD; text-decoration:none; }

    .loading-wrap { display:flex; flex-direction:column; align-items:center; gap:10px; color:#9CA3AF; padding:40px; }

    @media (max-width: 900px) {
      .meta-grid { grid-template-columns: repeat(2, 1fr); }
      .content-columns { grid-template-columns: 1fr; }
      .side-column { order: 2; }
    }
  `]
})
export class TaskDetailComponent implements OnInit {
  task$: Observable<Task> | undefined;
  taskId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id') || '';
    if (this.taskId) {
      this.task$ = this.taskService.getTaskById(this.taskId);
    }
  }

  onBack() {
    this.router.navigate(['/tasks']);
  }

  onEdit() {
    this.router.navigate(['/tasks', this.taskId, 'edit']);
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(this.taskId).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          // TODO: Show error message to user
        }
      });
    }
  }
}
