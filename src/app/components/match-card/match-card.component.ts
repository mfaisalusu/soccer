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
  templateUrl: './match-card.component.html',
  styleUrls: ['./match-card.component.scss']
})
export class MatchCardComponent {
  @Input() match!: Match;

  constructor(public utilityService: UtilityService) {}
}
