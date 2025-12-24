import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { Observable, combineLatest, map, catchError, of } from 'rxjs';

import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { ProjectStats, TaskStats } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatGridListModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1 class="dashboard-title">Dashboard</h1>
        <p class="dashboard-subtitle">Welcome back! Here's an overview of your projects and tasks.</p>
      </div>

      <!-- Stats Cards -->
      <mat-grid-list cols="4" rowHeight="120px" class="stats-grid">
        <mat-grid-tile *ngFor="let stat of statsCards">
          <mat-card class="stat-card" [class]="stat.color">
            <mat-card-content class="stat-content">
              <div class="stat-icon">
                <mat-icon>{{ stat.icon }}</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>

      <!-- Charts and Recent Activity -->
      <div class="dashboard-content">
        <div class="charts-section">
          <!-- Project Progress Chart -->
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>Project Progress</mat-card-title>
              <mat-card-subtitle>Current status of active projects</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="chart-placeholder">
                <mat-icon>bar_chart</mat-icon>
                <p>Project progress chart will be displayed here</p>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Task Distribution Chart -->
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>Task Distribution</mat-card-title>
              <mat-card-subtitle>Tasks by status and priority</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="chart-placeholder">
                <mat-icon>pie_chart</mat-icon>
                <p>Task distribution chart will be displayed here</p>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Recent Activity -->
        <mat-card class="activity-card">
          <mat-card-header>
            <mat-card-title>Recent Activity</mat-card-title>
            <mat-card-subtitle>Latest updates from your projects and tasks</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-list">
              <div class="activity-item" *ngFor="let activity of recentActivities">
                <div class="activity-icon">
                  <mat-icon>{{ activity.icon }}</mat-icon>
                </div>
                <div class="activity-content">
                  <div class="activity-text">{{ activity.text }}</div>
                  <div class="activity-time">{{ activity.time }}</div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-title {
      font-size: 2rem;
      font-weight: 700;
      color: #e2e8f0;
      margin: 0 0 0.5rem 0;
    }

    .dashboard-subtitle {
      color: #94a3b8;
      font-size: 1rem;
      margin: 0;
    }

    .stats-grid {
      margin-bottom: 2rem;
    }

    .stat-card {
      height: 100%;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 0.75rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .stat-card.blue {
      border-left: 4px solid #3b82f6;
    }

    .stat-card.green {
      border-left: 4px solid #10b981;
    }

    .stat-card.yellow {
      border-left: 4px solid #f59e0b;
    }

    .stat-card.red {
      border-left: 4px solid #ef4444;
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      height: 100%;
    }

    .stat-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
    }

    .stat-icon mat-icon {
      color: #e2e8f0;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .stat-info {
      flex: 1;
    }

    .stat-value {
      font-size: 1.875rem;
      font-weight: 700;
      color: #e2e8f0;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #94a3b8;
      font-weight: 500;
    }

    .dashboard-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    .charts-section {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .chart-card, .activity-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 0.75rem;
    }

    .chart-card mat-card-header, .activity-card mat-card-header {
      border-bottom: 1px solid #334155;
    }

    .chart-card mat-card-title, .activity-card mat-card-title {
      color: #e2e8f0;
      font-weight: 600;
    }

    .chart-card mat-card-subtitle, .activity-card mat-card-subtitle {
      color: #94a3b8;
    }

    .chart-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      color: #94a3b8;
      text-align: center;
    }

    .chart-placeholder mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      border-radius: 0.5rem;
      background: #0f172a;
      border: 1px solid #334155;
    }

    .activity-icon {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .activity-icon mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      color: #10b981;
    }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      color: #e2e8f0;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .activity-time {
      color: #94a3b8;
      font-size: 0.75rem;
    }

    @media (max-width: 1024px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .dashboard-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  statsCards: any[] = [];
  recentActivities: any[] = [];

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    combineLatest([
      this.projectService.getProjectStats().pipe(
        catchError(error => {
          console.warn('Backend not available for project stats, using mock data');
          return of(this.getMockProjectStats());
        })
      ),
      this.taskService.getTaskStats().pipe(
        catchError(error => {
          console.warn('Backend not available for task stats, using mock data');
          return of(this.getMockTaskStats());
        })
      )
    ]).pipe(
      map(([projectStats, taskStats]) => ({
        projectStats,
        taskStats
      }))
    ).subscribe(({ projectStats, taskStats }) => {
      this.updateStatsCards(projectStats, taskStats);
      this.loadRecentActivities();
    });
  }

  private updateStatsCards(projectStats: ProjectStats, taskStats: TaskStats): void {
    this.statsCards = [
      {
        label: 'Total Projects',
        value: projectStats.totalProjects,
        icon: 'folder',
        color: 'blue'
      },
      {
        label: 'Active Tasks',
        value: taskStats.activeTasks,
        icon: 'task',
        color: 'green'
      },
      {
        label: 'Completed This Week',
        value: taskStats.completedThisWeek,
        icon: 'check_circle',
        color: 'yellow'
      },
      {
        label: 'Overdue Items',
        value: projectStats.overdueProjects + taskStats.overdueTasks,
        icon: 'warning',
        color: 'red'
      },
      {
        label: 'Total Users',
        value: taskStats.totalUsers,
        icon: 'people',
        color: 'purple'
      },
      {
        label: 'Avg Project Completion Time',
        value: `${projectStats.averageCompletionTime} days`,
        icon: 'schedule',
        color: 'orange'
      }
    ];
  }

  private loadRecentActivities(): void {
    // Mock data - replace with actual service calls
    this.recentActivities = [
      {
        icon: 'add',
        text: 'New project "Website Redesign" was created',
        time: '2 hours ago'
      },
      {
        icon: 'task',
        text: 'Task "Update user interface" was completed',
        time: '4 hours ago'
      },
      {
        icon: 'person',
        text: 'John Doe joined project "Mobile App"',
        time: '1 day ago'
      },
      {
        icon: 'comment',
        text: 'New comment on task "Database optimization"',
        time: '2 days ago'
      }
    ];
  }

  private getMockProjectStats(): ProjectStats {
    return {
      totalProjects: 5,
      activeProjects: 3,
      completedProjects: 2,
      overdueProjects: 1,
      totalBudget: 150000,
      averageProgress: 65,
      averageCompletionTime: 14.5
    };
  }

  private getMockTaskStats(): TaskStats {
    return {
      totalTasks: 25,
      activeTasks: 12,
      completedTasks: 13,
      overdueTasks: 2,
      completedThisWeek: 8,
      averageCompletionTime: 3.5,
      totalUsers: 8,
      taskPriorityDistribution: { 'low': 5, 'medium': 10, 'high': 8, 'urgent': 2 }
    };
  }
}
