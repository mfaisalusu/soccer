import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match } from '@models/match.model';
import { UtilityService } from '@services/utility.service';

/**
 * Match Card Component
 * Displays a single match with responsive design
 */
@Component({
  selector: 'app-match-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="match-card" [ngClass]="'status-' + match.status">
      <!-- Status Badge -->
      <div class="status-badge" [ngClass]="utilityService.getStatusColor(match.status)">
        {{ utilityService.getStatusLabel(match.status) }}
      </div>

      <!-- Date and Venue -->
      <div class="match-meta">
        <p class="date">{{ utilityService.formatDate(match.date, 'dd MMM yyyy') }}</p>
        <p class="venue">{{ match.venue }}</p>
        <p class="stage">{{ match.stage }}</p>
      </div>

      <!-- Teams and Score -->
      <div class="match-content">
        <!-- Home Team -->
        <div class="team home-team">
          <div class="flag">{{ match.homeTeam.flag }}</div>
          <div class="team-info">
            <h3 class="team-name">{{ match.homeTeam.name }}</h3>
            <p class="team-code">{{ match.homeTeam.code }}</p>
          </div>
        </div>

        <!-- Score or Time -->
        <div class="score-section">
          <div class="score-display" *ngIf="match.status === 'completed'">
            <span class="score-number">{{ match.homeScore }}</span>
            <span class="score-separator">:</span>
            <span class="score-number">{{ match.awayScore }}</span>
          </div>
          <div class="time-display" *ngIf="match.status !== 'completed'">
            <span class="match-time">{{ match.time }}</span>
          </div>
        </div>

        <!-- Away Team -->
        <div class="team away-team">
          <div class="team-info">
            <h3 class="team-name">{{ match.awayTeam.name }}</h3>
            <p class="team-code">{{ match.awayTeam.code }}</p>
          </div>
          <div class="flag">{{ match.awayTeam.flag }}</div>
        </div>
      </div>

      <!-- Live Indicator -->
      <div class="live-indicator" *ngIf="match.status === 'live'">
        <span class="pulse"></span>
        Live
      </div>
    </div>
  `,
  styles: [`
    .match-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 20px;
      margin: 12px 0;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      color: white;
    }

    .match-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .match-card.status-completed {
      background: linear-gradient(135deg, #34a853 0%, #1f8e4f 100%);
    }

    .match-card.status-live {
      background: linear-gradient(135deg, #ea4335 0%, #c5221f 100%);
      animation: pulse-glow 2s infinite;
    }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 4px 15px rgba(234, 67, 53, 0.3); }
      50% { box-shadow: 0 4px 25px rgba(234, 67, 53, 0.6); }
    }

    .status-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .match-meta {
      font-size: 13px;
      opacity: 0.9;
      margin-bottom: 12px;
      padding-top: 8px;
    }

    .date {
      font-weight: 600;
      margin: 0 0 4px 0;
    }

    .venue, .stage {
      margin: 2px 0;
      opacity: 0.8;
    }

    .match-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 16px 0;
      gap: 12px;
    }

    .team {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .team.away-team {
      flex-direction: row-reverse;
    }

    .flag {
      font-size: 32px;
      min-width: 40px;
      text-align: center;
    }

    .team-info {
      flex: 1;
    }

    .team-name {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      line-height: 1.2;
    }

    .team-code {
      margin: 4px 0 0 0;
      font-size: 12px;
      opacity: 0.8;
    }

    .score-section {
      flex: 0.8;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .score-display {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 28px;
      font-weight: 700;
    }

    .score-number {
      min-width: 40px;
      text-align: center;
    }

    .score-separator {
      font-size: 24px;
    }

    .time-display {
      text-align: center;
    }

    .match-time {
      font-size: 20px;
      font-weight: 600;
    }

    .live-indicator {
      position: absolute;
      bottom: 12px;
      right: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      animation: pulse 1s infinite;
    }

    .pulse {
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
      animation: pulse-dot 1s infinite;
    }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    @media (max-width: 640px) {
      .match-card {
        padding: 16px;
      }

      .match-content {
        margin: 12px 0;
      }

      .team-name {
        font-size: 14px;
      }

      .score-display {
        font-size: 24px;
      }

      .flag {
        font-size: 28px;
      }
    }
  `]
})
export class MatchCardComponent {
  @Input() match!: Match;

  constructor(public utilityService: UtilityService) {}
}
