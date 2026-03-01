import React from 'react';
import { Outlet, useParams, Link } from 'react-router-dom';
import { getGameById } from '../config/games';
import Header from '../components/Header';
import GameNav from '../components/GameNav';

export const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const game = gameId ? getGameById(gameId) : undefined;

  if (!game) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-text-primary">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-error">Game not found</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  // Get current database from path (after gameId)
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const currentDatabase = pathParts[2] || undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header
        title={game.title}
        subtitle={game.subtitle}
        breadcrumb={{ label: 'Games', href: '/' }}
      />
      <GameNav game={game} gameId={gameId!} currentDatabase={currentDatabase} />
      <Outlet />
    </div>
  );
};

export default GamePage;
