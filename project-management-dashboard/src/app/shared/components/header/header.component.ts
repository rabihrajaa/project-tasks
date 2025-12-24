import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Observable } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar class="header-toolbar">
      <!-- Mobile menu button -->
      <button mat-icon-button
              *ngIf="isMobile"
              (click)="toggleSidenav.emit()"
              class="menu-btn"
              matTooltip="Toggle menu">
        <mat-icon>menu</mat-icon>
      </button>

      <!-- Page title -->
      <div class="page-title">
        <h1 class="title-text">{{ pageTitle }}</h1>
      </div>

      <!-- Spacer -->
      <span class="spacer"></span>

      <!-- Header actions -->
      <div class="header-actions">
        <!-- Search -->
        <button mat-icon-button
                class="action-btn"
                matTooltip="Search">
          <mat-icon>search</mat-icon>
        </button>

        <!-- Notifications -->
        <button mat-icon-button
                class="action-btn"
                matTooltip="Notifications"
                [matBadge]="notificationCount$ | async"
                matBadgeColor="warn"
                matBadgeSize="small">
          <mat-icon>notifications</mat-icon>
        </button>

        <!-- User menu -->
        <button mat-icon-button
                [matMenuTriggerFor]="userMenu"
                class="user-menu-btn"
                matTooltip="User menu">
          <div class="user-avatar">
            <mat-icon *ngIf="!currentUser?.avatar">person</mat-icon>
            <img *ngIf="currentUser?.avatar"
                 [src]="currentUser.avatar"
                 [alt]="currentUser.firstName">
          </div>
        </button>

        <mat-menu #userMenu="matMenu" class="user-menu">
          <div class="user-menu-header" *ngIf="currentUser">
            <div class="user-info">
              <div class="user-name">{{ currentUser.firstName }} {{ currentUser.lastName }}</div>
              <div class="user-email">{{ currentUser.email }}</div>
            </div>
          </div>
          <mat-divider></mat-divider>
          <button mat-menu-item>
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </button>
          <button mat-menu-item>
            <mat-icon>settings</mat-icon>
            <span>Settings</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      background: #1e293b;
      color: #e2e8f0;
      border-bottom: 1px solid #334155;
      min-height: 64px;
      padding: 0 1rem;
      display: flex;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .menu-btn {
      margin-right: 1rem;
      color: #94a3b8;
    }

    .menu-btn:hover {
      color: #e2e8f0;
    }

    .page-title {
      display: flex;
      align-items: center;
    }

    .title-text {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
      color: #e2e8f0;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .action-btn {
      color: #94a3b8;
      transition: color 0.2s ease;
    }

    .action-btn:hover {
      color: #e2e8f0;
    }

    .user-menu-btn {
      margin-left: 0.5rem;
    }

    .user-avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: #334155;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .user-avatar mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: #94a3b8;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-menu {
      margin-top: 0.5rem;
    }

    .user-menu-header {
      padding: 1rem;
      min-width: 200px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .user-name {
      font-weight: 500;
      color: #1f2937;
    }

    .user-email {
      font-size: 0.875rem;
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .header-toolbar {
        padding: 0 0.75rem;
      }

      .title-text {
        font-size: 1.25rem;
      }

      .header-actions {
        gap: 0.25rem;
      }
    }
  `]
})
export class HeaderComponent {
  @Input() isMobile = false;
  @Output() toggleSidenav = new EventEmitter<void>();

  pageTitle = 'Project Management Dashboard';
  currentUser: any = null;
  notificationCount$: Observable<number>;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Mock notification count - replace with actual service
    this.notificationCount$ = new Observable(observer => {
      observer.next(3);
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
