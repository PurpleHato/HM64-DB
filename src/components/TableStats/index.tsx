import React from 'react';

interface TableStatsProps {
  totalEntries: number;
  filteredEntries: number;
}

export const TableStats: React.FC<TableStatsProps> = ({
  totalEntries,
  filteredEntries
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
      <div className="flex gap-6 text-sm">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">{totalEntries}</span>
          <span className="text-text-secondary">Total Entries</span>
        </div>
        {totalEntries !== filteredEntries && (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-fuchsia">{filteredEntries}</span>
            <span className="text-text-secondary">Showing</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableStats;
