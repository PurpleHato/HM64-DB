import React from 'react';
import { Column, FilterValue } from '../../types';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

interface FilterControlsProps {
  columns: Column[];
  searchTerm: string;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  filterColumn: string;
  filterValue: FilterValue;
  onSearchChange: (value: string) => void;
  onSortChange: (column: string, direction: 'asc' | 'desc') => void;
  onFilterChange: (column: string, value: FilterValue) => void;
  onClearAll: () => void;
  getUniqueFilterValues: (column: string) => string[];
}

const selectStyles = "flex h-9 w-full rounded-xl border border-border/20 bg-surface px-3 py-1 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50";

export const FilterControls: React.FC<FilterControlsProps> = ({
  columns,
  searchTerm,
  sortColumn,
  sortDirection,
  filterColumn,
  filterValue,
  onSearchChange,
  onSortChange,
  onFilterChange,
  onClearAll,
  getUniqueFilterValues
}) => {
  const hasActiveFilters = searchTerm || sortColumn || filterColumn;

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-border/20 bg-surface/50 p-4 backdrop-blur-sm">
        <div className="flex flex-wrap items-end gap-4">
          {/* Search */}
          <div className="flex flex-1 flex-col gap-2 min-w-[200px]">
            <label className="text-sm font-medium text-text-secondary">Search:</label>
            <Input
              type="text"
              placeholder="Search all fields..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Sort */}
          <div className="flex flex-col gap-2 min-w-[150px]">
            <label className="text-sm font-medium text-text-secondary">Sort by:</label>
            <div className="flex gap-2">
              <select
                className={cn(selectStyles, "flex-1")}
                value={sortColumn}
                onChange={(e) => onSortChange(e.target.value, 'asc')}
              >
                <option value="">Select column...</option>
                {columns.map(col => (
                  <option key={col.key} value={col.key}>
                    {col.label}
                  </option>
                ))}
              </select>

              {sortColumn && (
                <select
                  className={selectStyles}
                  style={{ width: '100px' }}
                  value={sortDirection}
                  onChange={(e) => onSortChange(sortColumn, e.target.value as 'asc' | 'desc')}
                >
                  <option value="asc">Asc</option>
                  <option value="desc">Desc</option>
                </select>
              )}
            </div>
          </div>

          {/* Filter */}
          <div className="flex flex-col gap-2 min-w-[150px]">
            <label className="text-sm font-medium text-text-secondary">Filter by:</label>
            <div className="flex gap-2">
              <select
                className={cn(selectStyles, "flex-1")}
                value={filterColumn}
                onChange={(e) => onFilterChange(e.target.value, '')}
              >
                <option value="">Select column...</option>
                {columns.map(col => (
                  <option key={col.key} value={col.key}>
                    {col.label}
                  </option>
                ))}
              </select>

              {filterColumn && (
                <select
                  className={cn(selectStyles, "flex-1")}
                  value={String(filterValue)}
                  onChange={(e) => onFilterChange(filterColumn, e.target.value)}
                >
                  <option value="">All values</option>
                  {getUniqueFilterValues(filterColumn).map(value => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Clear button */}
          {hasActiveFilters && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-secondary">&nbsp;</label>
              <button
                onClick={onClearAll}
                className="h-9 px-4 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
