/**
 * Models for World Cup Match Schedule
 */

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: Date;
  time: string;
  venue: string;
  stage: string;
  group?: string;
  status: 'upcoming' | 'live' | 'completed';
  homeScore?: number;
  awayScore?: number;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  flag?: string;
  crest?: string;
}

export interface Tournament {
  id: string;
  name: string;
  year: number;
  country: string;
  startDate: Date;
  endDate: Date;
}

export interface Filter {
  stage?: string;
  team?: string;
  date?: string;
  status?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
