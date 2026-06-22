import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ScheduleListingComponent } from './components/schedule-listing/schedule-listing.component';

/**
 * Root App Component
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ScheduleListingComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'World Cup Schedule';
}
