import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getGameById, getDatabaseById } from '../config/games';
import { Column, DataItem } from '../types';
import { Input } from '../components/ui/Input';
import SegmentCallsTutorial from '../components/SegmentCallsTutorial';
import { cn } from '../lib/utils';

// Color mapping for cells
const cellColors: Record<string, string> = {
  'cell-green-tech': 'rgba(34, 197, 94, 0.12)',
  'cell-purple-tech': 'rgba(168, 85, 247, 0.12)',
  'cell-teal-tech': 'rgba(20, 184, 166, 0.12)',
  'cell-orange-tech': 'rgba(249, 115, 22, 0.12)',
  'cell-blue-tech': 'rgba(96, 165, 250, 0.12)',
  'cell-red-tech': 'rgba(239, 68, 68, 0.12)',
  'cell-indigo-tech': 'rgba(129, 140, 248, 0.12)',
  'cell-brown-tech-small': 'rgba(234, 179, 8, 0.12)',
  'cell-green-small': 'rgba(34, 197, 94, 0.12)',
  'cell-red-small': 'rgba(239, 68, 68, 0.12)',
  'cell-pink-small': 'rgba(244, 114, 182, 0.12)',
};

// Category colors for instruments
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

export const DatabaseView: React.FC = () => {
  const { gameId, databaseId, subcategory: subcategoryParam } = useParams<{
    gameId: string;
    databaseId: string;
    subcategory?: string;
  }>();

  const [searchTerm, setSearchTerm] = React.useState<string>('');

  // Get base path for data fetching
  const basePath = import.meta.env.BASE_URL || '/';

  const game = gameId ? getGameById(gameId) : undefined;
  const database = databaseId && gameId ? getDatabaseById(gameId, databaseId) : undefined;

  // Get subcategory info
  const subcategoryKey = React.useMemo(() => {
    if (!database?.subcategories) return undefined;
    return subcategoryParam
      ? Object.keys(database.subcategories).find(
          (key) => key.toLowerCase() === subcategoryParam.toLowerCase()
        ) || subcategoryParam
      : Object.keys(database.subcategories)[0];
  }, [subcategoryParam, database]);

  const subcategoryConfig = subcategoryKey
    ? database?.subcategories?.[subcategoryKey]
    : undefined;

  // Check if current view is tutorial (has no data file)
  const isTutorial = subcategoryConfig?.dataFile === null;

  // Build data path
  const dataPath = useMemo(() => {
    if (!gameId || !databaseId || isTutorial) return null;

    const gameFolder = gameId.toUpperCase();
    // Map database ID to folder name (handle special cases like segment-calls -> SegmentCalls)
    const folderNameMap: Record<string, string> = {
      'segment-calls': 'SegmentCalls',
    };
    // Default: capitalize first letter (dlists -> Dlists, sounds -> Sounds, etc.)
    const defaultName = databaseId.charAt(0).toUpperCase() + databaseId.slice(1);
    const dbName = folderNameMap[databaseId] || defaultName;

    if (subcategoryConfig?.dataFile) {
      return `${basePath}data/${gameFolder}/${dbName}/${subcategoryConfig.dataFile}`;
    } else if (!database?.hasSubcategories) {
      if (databaseId === 'animations') {
        return `${basePath}data/${gameFolder}/Animations/Animations.json`;
      } else if (databaseId === 'instruments') {
        return `${basePath}data/${gameFolder}/Instruments/Instruments.json`;
      }
    }
    return null;
  }, [gameId, databaseId, subcategoryConfig, database, isTutorial, basePath]);

  // Fetch data - ALWAYS call this hook (before any conditional returns)
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['gameData', gameId, databaseId, subcategoryKey],
    queryFn: async () => {
      if (!dataPath) return [];
      const response = await fetch(dataPath);
      if (!response.ok) throw new Error('Failed to load data');
      return response.json();
    },
    enabled: !!dataPath,
  });

  // Generate columns dynamically
  const columns: Column[] = useMemo(() => {
    if (!data.length) return [];
    const firstItem = data[0];
    return Object.keys(firstItem).map((key) => {
      let label = key;
      const specificReplacements: Record<string, string> = {
        'SoH Directory': 'SoH Directory',
        'SoH Name (For Export)': 'SoH Name (For Export)',
        'Decomp Directory': 'Decomp Directory',
        'Decomp File Name (For Import)': 'Decomp File Name (For Import)',
        'Out of Range?': 'Out of Range?',
        'PRed ?': 'PRed ?',
      };
      if (specificReplacements[key]) {
        label = specificReplacements[key];
      } else {
        label = key
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/^./, (str) => str.toUpperCase());
      }
      return {
        key,
        label,
        searchable: true,
        sortable: true,
        filterable: true,
      };
    });
  }, [data]);

  // Get cell class for coloring
  const getCellClass = (item: DataItem, column: Column): string => {
    const key = column.key.toLowerCase();
    const fieldClasses: Record<string, string> = {
      'scene name': 'cell-green-tech',
      'object name': 'cell-purple-tech',
      'skeleton name': 'cell-teal-tech',
      'bone name': 'cell-orange-tech',
      'source model file': 'cell-blue-tech',
      'soh skel name': 'cell-red-tech',
      'decomp filename': 'cell-indigo-tech',
      'soh filename': 'cell-brown-tech-small',
      'decomp skel': 'cell-green-small',
      'soh skel': 'cell-red-small',
      'segment call': 'cell-purple-tech',
      'location': 'cell-teal-tech',
      'instructions': 'cell-orange-tech',
      'matches': 'cell-pink-small',
      'animation name': 'cell-blue-tech',
      'character': 'cell-green-tech',
      'type': 'cell-red-tech',
      'filename': 'cell-indigo-tech',
      'sample rate': 'cell-brown-tech-small',
      'channels': 'cell-green-small',
      'format': 'cell-red-small',
      'size': 'cell-pink-small',
      'description': 'cell-standard',
      'setid': 'cell-green-tech',
      'slot': 'cell-purple-tech',
      'instrument': 'cell-blue-tech',
      'category': 'cell-orange-tech',
      'notes': 'cell-standard',
    };
    return fieldClasses[key] || 'cell-standard';
  };

  // Filter data
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item: DataItem) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Subcategory selector
  const subcategories = database?.subcategories;
  const hasSubcategories = database?.hasSubcategories && subcategories;
  const hasData = !isTutorial && data.length > 0;

  if (!game || !database) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-text-primary">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-error">Database not found</h1>
          <Link to={`/${gameId}`} className="mt-4 inline-block text-primary hover:underline">
            Back to {game?.title || 'Home'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* Subcategory Selector */}
      {hasSubcategories && (
        <div className="mx-auto max-w-screen-2xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(subcategories!).map(([key, sub]) => {
              const isActive = subcategoryKey === key;
              return (
                <Link
                  key={key}
                  to={`/${gameId}/${databaseId}/${key}`}
                  className={cn(
                    'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
                    'hover:scale-105 active:scale-105 duration-100',
                    'relative overflow-hidden',
                    isActive
                      ? 'bg-gradient-to-r from-primary/30 to-fuchsia/30 text-primary border-2 border-primary/50 shadow-lg shadow-primary/20'
                      : 'bg-surface/80 text-text-secondary hover:text-text-primary hover:bg-primary/15 border border-border/40 hover:border-primary/40'
                  )}
                >
                  {sub.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Tutorial View - inline content */}
      {isTutorial && databaseId === 'segment-calls' && (
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <SegmentCallsTutorial />
        </div>
      )}

      {/* Filters - only show when there's data */}
      {hasData && (
        <div className="mx-auto max-w-screen-2xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border/30 bg-surface/70 p-4 backdrop-blur-sm holographic-card shadow-lg">
            <div className="flex flex-wrap items-center justify-center gap-6">
              {/* Search */}
              <div className="flex flex-1 flex-col gap-2 min-w-[280px] max-w-md">
                <label className="text-sm font-medium text-text-secondary">Search:</label>
                <Input
                  type="text"
                  placeholder="Search all fields..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Stats */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">{filteredData.length}</span>
                <span className="text-sm text-text-secondary">
                  {filteredData.length !== data.length ? `of ${data.length}` : 'entries'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !isTutorial && (
        <div className="mx-auto max-w-screen-2xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <p className="text-text-secondary">Loading data...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isTutorial && (
        <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-error/50 bg-error/10 p-6 text-center">
            <p className="text-error">Error loading data</p>
          </div>
        </div>
      )}

      {/* Data Display - Neo-Retro Table */}
      {hasData && (
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border-2 border-primary/50 bg-surface/80 backdrop-blur-md shadow-2xl overflow-hidden">
            {/* Sticky header container - vertical scroll with visible scrollbar */}
            <div className="max-h-[70vh] overflow-y-auto">
              <table className="w-full border-separate border-spacing-0">
                <thead className="sticky top-0 z-30 shadow-lg">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className="bg-surface-elevated text-primary px-4 py-3 text-left text-sm font-bold border-b-2 border-primary border-r-2 border-border last:border-r-0"
                      >
                        <span>{column.label}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item: DataItem, rowIndex: number) => (
                    <tr
                      key={rowIndex}
                      className="border-b-2 border-border transition-all duration-150 hover:bg-primary/15"
                    >
                      {columns.map((column) => {
                        const cellClass = getCellClass(item, column);
                        const value = item[column.key];
                        const bgColor = cellColors[cellClass];

                        return (
                          <td
                            key={column.key}
                            className={cn(
                              'px-4 py-2.5 text-sm border-r border-border last:border-r-0 break-words',
                              'transition-all duration-150 group-hover:text-text-primary'
                            )}
                            style={{
                              backgroundColor: bgColor,
                              minWidth: '120px',
                              maxWidth: '400px',
                            }}
                          >
                            {(() => {
                              if (column.key === 'category' && value) {
                                const catLower = String(value).toLowerCase();
                                const bgColor = categoryColors[catLower] || 'rgb(100, 100, 100)';
                                return (
                                  <span
                                    className="inline-block rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg border border-white/20"
                                    style={{ backgroundColor: bgColor }}
                                  >
                                    {String(value)}
                                  </span>
                                );
                              }
                              if (typeof value === 'boolean') {
                                return (
                                  <span className={cn(
                                    'inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold',
                                    value ? 'bg-success/20 text-success border border-success/30' : 'bg-error/20 text-error border border-error/30'
                                  )}>
                                    {value ? '✓' : '✗'}
                                  </span>
                                );
                              }
                              if (typeof value === 'object' && value !== null) {
                                return (
                                  <code className="rounded bg-background/50 px-2 py-1 text-xs text-cyan font-mono border border-cyan/30 break-all">
                                    {JSON.stringify(value)}
                                  </code>
                                );
                              }
                              return String(value || '-');
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
        </div>
      )}
    </div>
  );
};

export default DatabaseView;
