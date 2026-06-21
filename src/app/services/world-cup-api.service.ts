import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { Match, Team, ApiResponse } from '@models/match.model';

/**
 * World Cup API Service
 * Using Football API (api-football.com)
 * Free tier: 100 requests per day
 */
@Injectable({
  providedIn: 'root'
})
export class WorldCupApiService {
  private readonly API_BASE_URL = 'https://api.football-data.org/v4';
  private readonly API_KEY = 'YOUR_API_KEY'; // Get free key from football-data.org
  private matches$: Observable<Match[]> | null = null;

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
        headers: { 'X-Auth-Token': this.API_KEY }
      })
      .pipe(
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
        flag: match.homeTeam.crest || ''
      },
      awayTeam: {
        id: match.awayTeam.id?.toString() || '',
        name: match.awayTeam.name,
        code: match.awayTeam.code || '',
        flag: match.awayTeam.crest || ''
      },
      date: new Date(match.utcDate),
      time: new Date(match.utcDate).toLocaleTimeString(),
      venue: match.venue || 'TBD',
      stage: match.stage,
      status: match.status as 'upcoming' | 'live' | 'completed',
      homeScore: match.score.fullTime.home,
      awayScore: match.score.fullTime.away
    }));
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
        stage: 'Group Stage',
        status: 'upcoming'
      }
    ];
  }
}
