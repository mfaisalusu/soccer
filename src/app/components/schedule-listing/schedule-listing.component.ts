import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match } from '@models/match.model';
import { StandingGroup, StandingEntry } from '@models/standings.model';
import { WorldCupApiService } from '@services/world-cup-api.service';
import { UtilityService } from '@services/utility.service';
import { MatchCardComponent } from '../match-card/match-card.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Schedule Listing Component
 * Main component for displaying all matches
 */
@Component({
  selector: 'app-schedule-listing',
  standalone: true,
  imports: [CommonModule, MatchCardComponent],
  templateUrl: './schedule-listing.component.html',
  styleUrls: ['./schedule-listing.component.scss']
})
export class ScheduleListingComponent implements OnInit, OnDestroy {
  matches: Match[] = [];
  groupedMatches: { [key: string]: Match[] } = {};
  competitionEmblem: string | null = null;
  currentTab: 'pertandingan' | 'klasemen' | 'babakGugur' = 'pertandingan';
  isLoading = true;
  error: string | null = null;
  
  stats = {
    total: 0,
    upcoming: 0,
    live: 0,
    completed: 0
  };

  standingsGroups: StandingGroup[] = [];

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
          this.competitionEmblem = this.apiService.getCompetitionEmblem();
          this.updateStats();
          this.groupMatchesForCurrentTab();
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Gagal memuat data pertandingan. Silakan coba lagi.';
          this.isLoading = false;
        }
      });
  }

  selectTab(tab: 'pertandingan' | 'klasemen' | 'babakGugur') {
    this.currentTab = tab;
    if (tab === 'klasemen') {
      this.loadStandings();
    } else {
      this.groupMatchesForCurrentTab();
    }
  }

  private loadStandings() {
    this.isLoading = true;
    this.error = null;

    this.apiService.getStandings(2026)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (groups) => {
          this.standingsGroups = groups;
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Gagal memuat klasemen. Silakan coba lagi.';
          this.isLoading = false;
        }
      });
  }

  private groupMatchesForCurrentTab() {
    const filtered = this.currentTab === 'babakGugur'
      ? this.getKnockoutMatches()
      : this.matches;

    this.groupedMatches = this.utilityService.groupMatchesByStage(filtered);

    const sorted: { [key: string]: Match[] } = {};
    Object.keys(this.groupedMatches)
      .sort((a, b) => this.utilityService.getStageOrder(a) - this.utilityService.getStageOrder(b))
      .forEach(stage => {
        sorted[stage] = this.groupedMatches[stage];
      });

    this.groupedMatches = sorted;
  }

  private getKnockoutMatches(): Match[] {
    return this.matches.filter(match => !this.isGroupStage(match.stage));
  }

  private isGroupStage(stage: string): boolean {
    return stage.toLowerCase().includes('group');
  }

  private updateStats() {
    this.stats.total = this.matches.length;
    this.stats.upcoming = this.matches.filter(m => m.status === 'upcoming').length;
    this.stats.live = this.matches.filter(m => m.status === 'live').length;
    this.stats.completed = this.matches.filter(m => m.status === 'completed').length;
  }

  getStandingForm(entry: StandingEntry): ('win' | 'draw' | 'loss' | 'empty')[] {
    const result: ('win' | 'draw' | 'loss' | 'empty')[] = [];
    const played = Math.min(entry.playedGames, 5);

    if (entry.form && entry.form.length) {
      result.push(...entry.form.slice(0, played));
    } else if (entry.playedGames > 0) {
      const wins = Math.min(entry.won, played);
      const draws = Math.min(entry.draw, played - wins);
      const losses = Math.max(0, played - wins - draws);

      for (let i = 0; i < wins; i++) result.push('win');
      for (let i = 0; i < draws; i++) result.push('draw');
      for (let i = 0; i < losses; i++) result.push('loss');
    }

    while (result.length < 5) {
      result.push('empty');
    }

    return result;
  }

  private getStageOptions(matches: Match[]): string[] {
    const uniqueStages = Array.from(new Set(matches.map(match => match.stage).filter(stage => !!stage)));
    return uniqueStages.sort((a, b) => this.utilityService.getStageOrder(a) - this.utilityService.getStageOrder(b));
  }

  retry() {
    this.loadMatches();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
