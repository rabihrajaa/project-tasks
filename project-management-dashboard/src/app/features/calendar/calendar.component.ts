import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendar-container">
      <h1>Calendar</h1>
      <p>Calendar view coming soon...</p>
    </div>
  `,
  styles: [`
    .calendar-container {
      padding: 20px;
    }
  `]
})
export class CalendarComponent {

}
