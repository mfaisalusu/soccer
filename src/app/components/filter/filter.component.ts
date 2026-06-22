import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Filter } from '@models/match.model';

/**
 * Filter Component
 * Allows users to filter matches by various criteria
 */
@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Input() currentFilters: Filter = {};
  @Input() stageOptions: string[] = [];
  @Output() filterChange = new EventEmitter<Filter>();
  filters: Filter = {};

  ngOnInit() {
    this.filters = { ...this.currentFilters };
  }

  onFilterChange() {
    this.filterChange.emit(this.filters);
  }

  resetFilters() {
    this.filters = {};
    this.filterChange.emit(this.filters);
  }
}
