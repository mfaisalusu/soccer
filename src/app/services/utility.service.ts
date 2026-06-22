import { Injectable } from '@angular/core';
import { formatDistanceToNow, format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

/**
 * Utility service for formatting and helper functions
 */
@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  
  /**
   * Format date to readable string
   */
  formatDate(date: Date, formatStr: string = 'dd MMM yyyy'): string {
    return format(new Date(date), formatStr, { locale: localeId });
  }

  /**
   * Format date and time
   */
  formatDateTime(date: Date): string {
    return format(new Date(date), 'dd MMM yyyy, HH:mm', { locale: localeId });
  }

  /**
   * Get relative time (e.g., "in 2 hours")
   */
  getRelativeTime(date: Date): string {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: localeId 
    });
  }

  /**
   * Get status badge color
   */
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'upcoming': 'bg-blue-100 text-blue-800',
      'live': 'bg-red-100 text-red-800',
      'completed': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Get status label
   */
  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'upcoming': 'Akan Datang',
      'live': 'Sedang Berlangsung',
      'completed': 'Selesai'
    };
    return labels[status] || status;
  }

  /**
   * Sort matches by date
   */
  sortMatchesByDate(matches: any[]): any[] {
    return [...matches].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  /**
   * Group matches by stage
   */
  groupMatchesByStage(matches: any[]): { [key: string]: any[] } {
    return matches.reduce((grouped, match) => {
      const stage = match.stage;
      if (!grouped[stage]) {
        grouped[stage] = [];
      }
      grouped[stage].push(match);
      return grouped;
    }, {});
  }

  /**
   * Get stage order for sorting
   */
  getStageOrder(stage: string): number {
    if (!stage) {
      return 0;
    }

    const normalized = stage.trim().toLowerCase();
    const groupMatch = normalized.match(/^group\s+([a-z])$/i);
    if (groupMatch) {
      return 10 + (groupMatch[1].toUpperCase().charCodeAt(0) - 65);
    }

    const order: { [key: string]: number } = {
      'group stage': 1,
      'round of 16': 100,
      'quarter-finals': 200,
      'semi-finals': 300,
      'third place play-off': 400,
      'final': 500
    };

    return order[normalized] || 999;
  }
}
