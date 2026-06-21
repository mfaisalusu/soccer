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
  template: `
    <div class="app-container">
      <!-- Navigation Bar -->
      <nav class="navbar">
        <div class="navbar-content">
          <div class="logo">⚽ World Cup Schedule</div>
          <div class="nav-info">
            <span class="year-badge">2026</span>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <app-schedule-listing></app-schedule-listing>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <p>&copy; 2026 World Cup Schedule. Built with Angular SSG</p>
          <p class="footer-note">Data dari Football-Data.org API</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .navbar {
      background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
      padding: 16px 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 24px;
      font-weight: 800;
      color: white;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .year-badge {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
    }

    .main-content {
      flex: 1;
      padding: 24px 0;
    }

    .footer {
      background: #1a202c;
      color: #a0aec0;
      text-align: center;
      padding: 32px 24px;
      border-top: 1px solid #2d3748;
      margin-top: 48px;
    }

    .footer-content p {
      margin: 8px 0;
      font-size: 14px;
    }

    .footer-note {
      font-size: 12px;
      opacity: 0.7;
    }

    @media (max-width: 768px) {
      .navbar-content {
        padding: 0 16px;
      }

      .logo {
        font-size: 20px;
      }

      .year-badge {
        font-size: 11px;
      }

      .main-content {
        padding: 16px 0;
      }
    }
  `]
})
export class AppComponent {
  title = 'World Cup Schedule';
}
