import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { Observable } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';

interface NavigationItem {
  label: string;
  icon: string;
  route: string;
  badge?: Observable<number>;
  children?: NavigationItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatBadgeModule
  ],
  template: `
    <div class="sidebar-content">
      <!-- Logo/Brand -->
      <div class="brand-section">
        <div class="brand-logo">
          <mat-icon class="brand-icon">dashboard</mat-icon>
          <span class="brand-text">PM Dashboard</span>
        </div>
      </div>

      <mat-divider></mat-divider>

      <!-- Navigation Menu -->
      <nav class="navigation-menu">
        <mat-nav-list>
          <ng-container *ngFor="let item of navigationItems">
            <a mat-list-item
               [routerLink]="item.route"
               routerLinkActive="active"
               [routerLinkActiveOptions]="{exact: false}"
               class="nav-item">
              <mat-icon matListIcon>{{ item.icon }}</mat-icon>
              <span matLine>{{ item.label }}</span>
              <mat-icon matSuffix *ngIf="item.children">expand_more</mat-icon>
              <mat-badge matSuffix
                        *ngIf="item.badge | async as badgeValue"
                        [matBadge]="badgeValue"
                        matBadgeColor="accent"
                        matBadgeSize="small">
              </mat-badge>
            </a>
          </ng-container>
        </mat-nav-list>
      </nav>

      <mat-divider></mat-divider>

      <!-- User Section -->
      <div class="user-section" *ngIf="currentUser$ | async as user">
        <div class="user-info">
          <div class="user-avatar">
            <mat-icon *ngIf="!user.avatar">person</mat-icon>
            <img *ngIf="user.avatar" [src]="user.avatar" [alt]="user.firstName">
          </div>
          <div class="user-details">
            <div class="user-name">{{ user.firstName }} {{ user.lastName }}</div>
            <div class="user-role">{{ user.role | titlecase }}</div>
          </div>
        </div>
        <button mat-icon-button
                class="logout-btn"
                (click)="logout()"
                matTooltip="Logout">
          <mat-icon>logout</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #1e293b;
      color: #e2e8f0;
    }

    .brand-section {
      padding: 1.5rem 1rem;
      border-bottom: 1px solid #334155;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #10b981;
    }

    .brand-text {
      font-size: 1.25rem;
      font-weight: 600;
      color: #e2e8f0;
    }

    .navigation-menu {
      flex: 1;
      padding: 1rem 0;
    }

    .nav-item {
      margin: 0.25rem 0.5rem;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
    }

    .nav-item:hover {
      background: rgba(16, 185, 129, 0.1);
    }

    .nav-item.active {
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
    }

    .nav-item.active mat-icon {
      color: #10b981;
    }

    .user-section {
      padding: 1rem;
      border-top: 1px solid #334155;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
    }

    .user-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: #334155;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .user-avatar mat-icon {
      color: #94a3b8;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-details {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: #e2e8f0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .logout-btn {
      color: #94a3b8;
      transition: color 0.2s ease;
    }

    .logout-btn:hover {
      color: #ef4444;
    }

    @media (max-width: 768px) {
      .brand-section {
        padding: 1rem;
      }

      .user-section {
        padding: 0.75rem;
      }
    }
  `]
})
export class SidebarComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  currentUser$ = this.authService.currentUser$;

  navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Projects',
      icon: 'folder',
      route: '/projects'
    },
    {
      label: 'Tasks',
      icon: 'task',
      route: '/tasks'
    },
    {
      label: 'Calendar',
      icon: 'calendar_today',
      route: '/calendar'
    },
    {
      label: 'Analytics',
      icon: 'analytics',
      route: '/analytics'
    },
    {
      label: 'Reports',
      icon: 'assessment',
      route: '/reports'
    },
    {
      label: 'Settings',
      icon: 'settings',
      route: '/settings'
    }
  ];

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
