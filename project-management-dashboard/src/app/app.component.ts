import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable } from 'rxjs';

import { AuthService } from './core/services/auth.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    MatBadgeModule,
    MatProgressBarModule,
    SidebarComponent,
    HeaderComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="app-container">
      <mat-sidenav-container class="sidenav-container">
        <!-- Sidebar -->
        <mat-sidenav
          [mode]="isMobile ? 'over' : 'side'"
          [opened]="!isMobile"
          hasBackdrop
          class="sidebar"
          [class.mobile]="isMobile">
          <app-sidebar (toggleSidenav)="toggleSidenav()"></app-sidebar>
        </mat-sidenav>

        <!-- Main content -->
        <mat-sidenav-content class="main-content">
          <!-- Header -->
          <app-header
            [isMobile]="isMobile"
            (toggleSidenav)="toggleSidenav()">
          </app-header>

          <!-- Main router outlet -->
          <main class="content-area">
            <router-outlet></router-outlet>
          </main>
        </mat-sidenav-content>
      </mat-sidenav-container>

      <!-- Loading overlay -->
      <app-loading-spinner *ngIf="isLoading$ | async"></app-loading-spinner>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .sidenav-container {
      flex: 1;
      background: #0f172a;
    }

    .sidebar {
      width: 280px;
      background: #1e293b;
      border-right: 1px solid #334155;
    }

    .sidebar.mobile {
      width: 280px;
    }

    .main-content {
      display: flex;
      flex-direction: column;
      background: #0f172a;
    }

    .content-area {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
      background: #0f172a;
    }

    @media (max-width: 768px) {
      .content-area {
        padding: 1rem;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Project Management Dashboard';
  isMobile = false;
  isLoading$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isLoading$ = this.authService.isAuthenticated$;
  }

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleSidenav(): void {
    // This will be handled by the sidebar component
  }
}
