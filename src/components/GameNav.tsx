import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { GameConfig, DatabaseConfig } from '../config/games';

interface GameNavProps {
  game: GameConfig;
  gameId: string;
  currentDatabase?: string;
}

export const GameNav: React.FC<GameNavProps> = ({ game, gameId, currentDatabase }) => {
  const location = useLocation();

  return (
    <nav className="border-b border-border/20 bg-surface/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {game.databases.map((db) => {
            const isActive = currentDatabase === db.id;
            const to = `/${gameId}/${db.id}`;
            return (
              <Link
                key={db.id}
                to={to}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  'hover:scale-105 active:scale-105 duration-100',
                  'glass glass-border',
                  isActive
                    ? 'bg-primary/20 text-primary border-primary/50 shadow-md'
                    : 'text-text-secondary hover:text-text-primary hover:bg-primary/10'
                )}
              >
                {db.emoji} {db.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default GameNav;
