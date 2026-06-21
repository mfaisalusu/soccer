import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match, Filter } from '@models/match.model';
import { WorldCupApiService } from '@services/world-cup-api.service';
import { UtilityService } from '@services/utility.service';
import { MatchCardComponent } from '../match-card/match-card.component';
import { FilterComponent } from '../filter/filter.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Schedule Listing Component
 * Main component for displaying all matches
 */
@Component({
  selector: 'app-schedule-listing',
  standalone: true,
  imports: [CommonModule, MatchCardComponent, FilterComponent],
  template: `
    <!-- Loading State -->
    <div class="loading-container" *ngIf="isLoading">
      <div class="loader">
        <div class="spinner"></div>
        <p>Memuat jadwal pertandingan...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="schedule-container" *ngIf="!isLoading">
      <!-- Header -->
      <div class="header">
        <h1>⚽ Jadwal Piala Dunia</h1>
        <p class="subtitle">Pantau semua pertandingan piala dunia 2026</p>
      </div>

      <!-- Filter Section -->
      <app-filter 
        [currentFilters]="activeFilters"
        (filterChange)="onFilterChange($event)"
      ></app-filter>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ stats.total }}</div>
          <div class="stat-label">Total Pertandingan</div>
        </div>
        <div class="stat-card upcoming">
          <div class="stat-number">{{ stats.upcoming }}</div>
          <div class="stat-label">Akan Datang</div>
        </div>
        <div class="stat-card live">
          <div class="stat-number">{{ stats.live }}</div>
          <div class="stat-label">Sedang Berlangsung</div>
        </div>
        <div class="stat-card completed">
          <div class="stat-number">{{ stats.completed }}</div>
          <div class="stat-label">Selesai</div>
        </div>
      </div>

      <!-- Matches by Stage -->
      <div class="matches-section" *ngIf="groupedMatches | keyvalue as stageGroups">
        <div class="stage-group" *ngFor="let group of stageGroups">
          <div class="stage-header">
            <h2>{{ group.key }}</h2>
            <span class="match-count">{{ group.value.length }} pertandingan</span>
          </div>

          <!-- Matches List -->
          <div class="matches-list">
            <app-match-card 
              *ngFor="let match of group.value"
              [match]="match"
            ></app-match-card>

            <!-- Empty State -->
            <div class="empty-state" *ngIf="group.value.length === 0">
              <p>Tidak ada pertandingan yang sesuai filter</p>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div class="no-results" *ngIf="(groupedMatches | keyvalue).length === 0">
        <p>Tidak ada pertandingan ditemukan</p>
      </div>
    </div>

    <!-- Error State -->
    <div class="error-container" *ngIf="error">
      <p>{{ error }}</p>
      <button (click)="retry()">Coba Lagi</button>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .loader {
      text-align: center;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #e2e8f0;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .schedule-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 32px;
    }

    h1 {
      margin: 0;
      font-size: 36px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 800;
    }

    .subtitle {
      margin: 8px 0 0 0;
      color: #718096;
      font-size: 16px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      color: white;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
    }

    .stat-card.upcoming {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .stat-card.live {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }

    .stat-card.completed {
      background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
    }

    .stat-number {
      font-size: 32px;
      font-weight: 800;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      opacity: 0.9;
    }

    .matches-section {
      margin-top: 32px;
    }

    .stage-group {
      margin-bottom: 48px;
    }

    .stage-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e2e8f0;
    }

    .stage-header h2 {
      margin: 0;
      font-size: 24px;
      color: #1a202c;
      font-weight: 700;
    }

    .match-count {
      background: #edf2f7;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      color: #4a5568;
    }

    .matches-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 16px;
    }

    .empty-state,
    .no-results {
      text-align: center;
      padding: 40px 20px;
      color: #a0aec0;
      font-size: 16px;
    }

    .error-container {
      background: #fed7d7;
      color: #c53030;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 20px;
    }

    .error-container button {
      margin-top: 12px;
      padding: 10px 20px;
      background: #c53030;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }

    @media (max-width: 1024px) {
      .matches-list {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .schedule-container {
        padding: 16px;
      }

      h1 {
        font-size: 28px;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .matches-list {
        grid-template-columns: 1fr;
      }

      .stage-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  `]
})
export class ScheduleListingComponent implements OnInit, OnDestroy {
  matches: Match[] = [];
  groupedMatches: { [key: string]: Match[] } = {};
  activeFilters: Filter = {};
  isLoading = true;
  error: string | null = null;
  
  stats = {
    total: 0,
    upcoming: 0,
    live: 0,
    completed: 0
  };

  private destroy$ = new Subject<void>();

  constructor(
    private apiService: WorldCupApiService,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.loadMatches();
  }

  private loadMatches() {
    this.isLoading = true;
    this.error = null;

    this.apiService.getMatches(2026)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (matches) => {
          this.matches = this.utilityService.sortMatchesByDate(matches);
          this.updateStats();
          this.applyFilters();
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Gagal memuat data pertandingan. Silakan coba lagi.';
          this.isLoading = false;
        }
      });
  }

  onFilterChange(filters: Filter) {
    this.activeFilters = filters;
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = this.matches;

    if (this.activeFilters.stage) {
      filtered = filtered.filter(m => 
        m.stage.toLowerCase().includes(this.activeFilters.stage!.toLowerCase())
      );
    }

    if (this.activeFilters.status) {
      filtered = filtered.filter(m => m.status === this.activeFilters.status);
    }

    if (this.activeFilters.team) {
      const teamQuery = this.activeFilters.team.toLowerCase();
      filtered = filtered.filter(m =>
        m.homeTeam.name.toLowerCase().includes(teamQuery) ||
        m.homeTeam.code.toLowerCase().includes(teamQuery) ||
        m.awayTeam.name.toLowerCase().includes(teamQuery) ||
        m.awayTeam.code.toLowerCase().includes(teamQuery)
      );
    }

    this.groupedMatches = this.utilityService.groupMatchesByStage(filtered);
    
    // Sort stages
    const sorted: { [key: string]: Match[] } = {};
    Object.keys(this.groupedMatches)
      .sort((a, b) => this.utilityService.getStageOrder(a) - this.utilityService.getStageOrder(b))
      .forEach(stage => {
        sorted[stage] = this.groupedMatches[stage];
      });
    
    this.groupedMatches = sorted;
  }

  private updateStats() {
    this.stats.total = this.matches.length;
    this.stats.upcoming = this.matches.filter(m => m.status === 'upcoming').length;
    this.stats.live = this.matches.filter(m => m.status === 'live').length;
    this.stats.completed = this.matches.filter(m => m.status === 'completed').length;
  }

  retry() {
    this.loadMatches();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
