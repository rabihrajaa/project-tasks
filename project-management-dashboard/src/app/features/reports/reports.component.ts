import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports-container">
      <h1>Reports</h1>
      <p>Reports section coming soon...</p>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 20px;
    }
  `]
})
export class ReportsComponent {

}
