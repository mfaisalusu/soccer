import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay, tap } from 'rxjs/operators';
import { Match, Team, ApiResponse } from '@models/match.model';
import { StandingGroup } from '@models/standings.model';
import { environment } from '../../environments/environment';

/**
 * World Cup API Service
 * Using Football Data API (football-data.org)
 */
@Injectable({
  providedIn: 'root'
})
export class WorldCupApiService {
  private readonly API_BASE_URL = environment.apiUrl;
  private readonly API_KEY = environment.apiKey;
  private matches$: Observable<Match[]> | null = null;
  private standings$: Observable<StandingGroup[]> | null = null;
  private competitionEmblem: string | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Get all World Cup matches
   * Caches results to minimize API calls
   */
  getMatches(year: number = 2022): Observable<Match[]> {
    if (this.matches$) {
      return this.matches$;
    }

    const competitionId = this.getCompetitionId(year);
    
    this.matches$ = this.http
      .get<any>(`${this.API_BASE_URL}/competitions/${competitionId}/matches`, {
        headers: {
          'X-Auth-Token': this.API_KEY
        }
      })
      .pipe(
        tap(response => {
          this.competitionEmblem = response.competition?.emblem ?? null;
        }),
        map(response => this.transformMatches(response.matches)),
        catchError(error => {
          console.error('Error fetching matches:', error);
          return of(this.getMockData()); // Fallback to mock data
        }),
        shareReplay(1)
      );

    return this.matches$;
  }

  /**
   * Get matches filtered by stage
   */
  getMatchesByStage(stage: string, year: number = 2022): Observable<Match[]> {
    return this.getMatches(year).pipe(
      map(matches => matches.filter(m => m.stage.toLowerCase().includes(stage.toLowerCase())))
    );
  }

  /**
   * Get standings for World Cup competition
   */
  getStandings(year: number = 2022): Observable<StandingGroup[]> {
    if (this.standings$) {
      return this.standings$;
    }

    const competitionId = this.getCompetitionId(year);
    this.standings$ = this.http
      .get<any>(`${this.API_BASE_URL}/competitions/${competitionId}/standings`, {
        headers: {
          'X-Auth-Token': this.API_KEY
        }
      })
      .pipe(
        map(response => this.transformStandings(response.standings)),
        catchError(error => {
          console.error('Error fetching standings:', error);
          return of([]);
        }),
        shareReplay(1)
      );

    return this.standings$;
  }

  /**
   * Get matches for a specific team
   */
  getTeamMatches(teamCode: string, year: number = 2022): Observable<Match[]> {
    return this.getMatches(year).pipe(
      map(matches => 
        matches.filter(m => 
          m.homeTeam.code === teamCode || m.awayTeam.code === teamCode
        )
      )
    );
  }

  /**
   * Transform API response to Match model
   */
  private transformMatches(matches: any[]): Match[] {
    return matches.map(match => ({
      id: match.id.toString(),
      homeTeam: {
        id: match.homeTeam.id?.toString() || '',
        name: match.homeTeam.name,
        code: match.homeTeam.code || '',
        flag: match.homeTeam.crest ? '' : match.homeTeam.code || '',
        crest: match.homeTeam.crest || ''
      },
      awayTeam: {
        id: match.awayTeam.id?.toString() || '',
        name: match.awayTeam.name,
        code: match.awayTeam.code || '',
        flag: match.awayTeam.crest ? '' : match.awayTeam.code || '',
        crest: match.awayTeam.crest || ''
      },
      date: new Date(match.utcDate),
      time: new Date(match.utcDate).toLocaleTimeString(),
      venue: match.venue || 'TBD',
      stage: this.normalizeStage(match.stage, match.group),
      group: match.group || '',
      status: match.status as 'upcoming' | 'live' | 'completed',
      homeScore: match.score.fullTime.home,
      awayScore: match.score.fullTime.away
    }));
  }

  private normalizeStage(stage: string, group?: string): string {
    if (group) {
      return this.formatGroupLabel(group);
    }
    return this.formatStageLabel(stage);
  }

  private transformStandings(standings: any[]): StandingGroup[] {
    if (!Array.isArray(standings)) {
      return [];
    }

    return standings.map(group => ({
      stage: group.stage || '',
      type: group.type || '',
      group: group.group || '',
      table: Array.isArray(group.table)
        ? group.table.map((entry: any) => ({
            position: entry.position,
            team: {
              id: entry.team?.id?.toString() || '',
              name: entry.team?.name || '',
              shortName: entry.team?.shortName || '',
              tla: entry.team?.tla || '',
              crest: entry.team?.crest || ''
            },
            playedGames: entry.playedGames ?? 0,
            won: entry.won ?? 0,
            draw: entry.draw ?? 0,
            lost: entry.lost ?? 0,
            points: entry.points ?? 0,
            goalsFor: entry.goalsFor ?? 0,
            goalsAgainst: entry.goalsAgainst ?? 0,
            goalDifference: entry.goalDifference ?? 0,
            form: Array.isArray(entry.form)
              ? entry.form.map((value: string) => {
                  if (value.toUpperCase() === 'W') return 'win';
                  if (value.toUpperCase() === 'D') return 'draw';
                  return 'loss';
                })
              : typeof entry.form === 'string'
              ? entry.form.split('').map((value: string) => {
                  if (value.toUpperCase() === 'W') return 'win';
                  if (value.toUpperCase() === 'D') return 'draw';
                  return 'loss';
                })
              : []
          }))
        : []
    }));
  }

  private formatGroupLabel(group: string): string {
    if (!group) {
      return 'Group Stage';
    }
    return group
      .replace(/_/g, ' ')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  private formatStageLabel(stage: string): string {
    const stageMap: { [key: string]: string } = {
      'GROUP_STAGE': 'Group Stage',
      'ROUND_OF_16': 'Round of 16',
      'QUARTER_FINALS': 'Quarter-finals',
      'SEMI_FINALS': 'Semi-finals',
      'THIRD_PLACE_PLAY_OFF': 'Third Place Play-off',
      'FINAL': 'Final'
    };

    const key = stage?.toString().toUpperCase() || '';
    if (stageMap[key]) {
      return stageMap[key];
    }

    return stage
      ? stage
          .replace(/_/g, ' ')
          .toLowerCase()
          .replace(/\b\w/g, char => char.toUpperCase())
      : '';
  }

  /**
   * Get competition ID for World Cup
   */
  private getCompetitionId(year: number): string {
    const competitions: { [key: number]: string } = {
      2022: 'WC',
      2026: 'WC',
      2018: 'WC'
    };
    return competitions[year] || 'WC';
  }

  getCompetitionEmblem(): string | null {
    return this.competitionEmblem;
  }

  /**
   * Mock data for development/fallback
   */
  private getMockData(): Match[] {
    return [
      {
        id: '1',
        homeTeam: {
          id: '1',
          name: 'Argentina',
          code: 'ARG',
          flag: '🇦🇷'
        },
        awayTeam: {
          id: '2',
          name: 'France',
          code: 'FRA',
          flag: '🇫🇷'
        },
        date: new Date('2022-12-18T15:00:00Z'),
        time: '15:00',
        venue: 'Lusail Stadium',
        stage: 'Final',
        group: '',
        status: 'completed',
        homeScore: 3,
        awayScore: 3
      },
      {
        id: '2',
        homeTeam: {
          id: '3',
          name: 'Brazil',
          code: 'BRA',
          flag: '🇧🇷'
        },
        awayTeam: {
          id: '4',
          name: 'Germany',
          code: 'GER',
          flag: '🇩🇪'
        },
        date: new Date('2026-06-12T18:00:00Z'),
        time: '18:00',
        venue: 'Stadium Name',
        stage: 'Group A',
        group: 'Group A',
        status: 'upcoming'
      }
    ];
  }
}
