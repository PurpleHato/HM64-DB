import React from 'react';
import { DataItem, Column } from '../../types';

interface DataTableProps {
  data: DataItem[];
  columns: Column[];
  getCellClass: (item: DataItem, column: Column) => string;
  currentProject?: string;
}

// Color mapping for cell types (dark mode optimized)
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
  'cell-tech-standard': 'transparent',
  'cell-tech-small': 'transparent',
  'cell-small': 'transparent',
};

// Category pill colors for instruments
const categoryColors: Record<string, string> = {
  'percussion': 'rgb(34, 197, 94)',
  'strings': 'rgb(249, 115, 22)',
  'brass': 'rgb(239, 68, 68)',
  'woodwind': 'rgb(96, 165, 250)',
  'voice': 'rgb(168, 85, 247)',
  'sfx': 'rgb(120, 113, 108)',
  'synth': 'rgb(20, 184, 166)',
  'keyboard': 'rgb(66, 66, 66)',
  'empty': 'rgb(120, 120, 120)',
  'wind': 'rgb(14, 165, 233)',
  'ethnic': 'rgb(107, 33, 168)',
  'pluck': 'rgb(120, 85, 72)',
  'bell': 'rgb(234, 179, 8)',
  'lead': 'rgb(225, 29, 72)',
  'pad': 'rgb(103, 58, 183)',
  'fx': 'rgb(255, 87, 34)',
  'chromatic': 'rgb(63, 81, 181)',
  'pipe': 'rgb(0, 150, 136)',
};

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  getCellClass,
  currentProject
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
      <div className="overflow-x-auto rounded-xl border border-border/20 bg-surface/50 backdrop-blur-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="sticky top-0 bg-gradient-to-r from-primary/80 to-fuchsia/80 text-white px-4 py-3 text-left font-semibold shadow-lg"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-border/10 transition-colors hover:bg-primary/5"
              >
                {columns.map((column) => {
                  const cellClass = getCellClass(item, column);
                  const value = item[column.key];

                  return (
                    <td
                      key={column.key}
                      className="px-4 py-2.5"
                      style={{
                        backgroundColor: rowIndex % 2 === 0
                          ? 'transparent'
                          : cellColors[cellClass] || 'rgba(35, 32, 55, 0.5)'
                      }}
                    >
                      {(() => {
                        // Handle category pills for instruments
                        if (column.key === 'category' && currentProject === 'instruments' && value) {
                          const catLower = String(value).toLowerCase();
                          const bgColor = categoryColors[catLower] || 'rgb(100, 100, 100)';
                          return (
                            <span
                              className="inline-block rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white"
                              style={{ backgroundColor: bgColor }}
                            >
                              {String(value)}
                            </span>
                          );
                        }

                        if (typeof value === 'boolean') {
                          return (
                            <span className={value ? 'text-success' : 'text-error'}>
                              {value ? '✓' : '✗'}
                            </span>
                          );
                        }
                        if (typeof value === 'object' && value !== null) {
                          return (
                            <code className="rounded bg-surface-elevated px-1.5 py-0.5 text-xs text-text-secondary">
                              {JSON.stringify(value)}
                            </code>
                          );
                        }
                        return String(value || '');
                      })()}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
