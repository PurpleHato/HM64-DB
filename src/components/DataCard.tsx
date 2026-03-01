import React from 'react';
import { DataItem, Column } from '../types';
import { cn } from '../lib/utils';

interface DataCardProps {
  item: DataItem;
  columns: Column[];
  getCellClass?: (item: DataItem, column: Column) => string;
  index?: number;
}

// Color mapping for cells (dark mode optimized)
const cellColors: Record<string, string> = {
  'cell-green-tech': 'rgba(34, 197, 94, 0.15)',
  'cell-purple-tech': 'rgba(168, 85, 247, 0.15)',
  'cell-teal-tech': 'rgba(20, 184, 166, 0.15)',
  'cell-orange-tech': 'rgba(249, 115, 22, 0.15)',
  'cell-blue-tech': 'rgba(96, 165, 250, 0.15)',
  'cell-red-tech': 'rgba(239, 68, 68, 0.15)',
  'cell-indigo-tech': 'rgba(129, 140, 248, 0.15)',
  'cell-brown-tech-small': 'rgba(234, 179, 8, 0.15)',
  'cell-green-small': 'rgba(34, 197, 94, 0.15)',
  'cell-red-small': 'rgba(239, 68, 68, 0.15)',
  'cell-pink-small': 'rgba(244, 114, 182, 0.15)',
  'cell-standard': 'transparent',
};

export const DataCard: React.FC<DataCardProps> = ({ item, columns, getCellClass, index = 0 }) => {
  return (
    <div
      className="group rounded-xl border border-border/20 bg-surface p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg holographic-card stagger-enter"
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      <div className="space-y-2">
        {columns.slice(0, 6).map((column) => {
          const value = item[column.key];
          const cellClass = getCellClass?.(item, column);
          const bgColor = cellColors[cellClass || 'cell-standard'];

          return (
            <div key={column.key} className="flex justify-between gap-4">
              <span className="text-xs font-medium text-text-muted min-w-[100px]">
                {column.label}:
              </span>
              <div
                className="flex-1 rounded px-2 py-1 text-xs"
                style={{
                  backgroundColor: bgColor,
                }}
              >
                {(() => {
                  if (typeof value === 'boolean') {
                    return (
                      <span className={value ? 'text-success' : 'text-error'}>
                        {value ? '✓' : '✗'}
                      </span>
                    );
                  }
                  if (typeof value === 'object' && value !== null) {
                    return (
                      <code className="text-xs text-text-secondary">
                        {JSON.stringify(value)}
                      </code>
                    );
                  }
                  return String(value || '-');
                })()}
              </div>
            </div>
          );
        })}
        {columns.length > 6 && (
          <div className="text-xs text-text-muted italic">
            + {columns.length - 6} more fields
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCard;
