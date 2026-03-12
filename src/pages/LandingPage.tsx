import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { games } from '../config/games';

export const LandingPage: React.FC = () => {
  // Get base path for assets
  const basePath = import.meta.env.BASE_URL || '/';

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold gradient-text sm:text-6xl">
            Harbour Master 64 - Asset Database
          </h1>
          <p className="mt-4 text-xl text-text-secondary">
            Modding Resources for Ship of Harkinian & 2Ship2Harkinian
          </p>
          <p className="mt-2 text-sm text-text-muted">
            Technical asset documentation for PC ports of Ocarina of Time and Majora's Mask
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="mx-auto max-w-4xl px-4 pb-8 sm:px-6 lg:px-8">
        <Card className="p-6 holographic-card">
          <h2 className="text-2xl font-bold text-primary mb-4">📚 About Harbour Master 64</h2>
          <p className="text-text-secondary leading-relaxed">
            Harbour Master 64 is a comprehensive multi-game asset database designed for modders and developers working on
            PC ports of Nintendo 64 games. It provides essential information for display lists, segment calls, animations,
            sounds, and instruments — everything needed to create, modify, or understand game assets for projects like
            Ship of Harkinian (Ocarina of Time) and 2Ship2Harkinian (Majora's Mask).
          </p>
          <p className="mt-4 text-text-secondary leading-relaxed">
            Whether you're creating custom music, replacing models, working with special effects, or just exploring the
            technical internals of these classic games, you'll find the technical documentation and references needed for
            your modding endeavors.
          </p>
        </Card>
      </div>

      {/* Game Selection Cards */}
      <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-text-primary mb-6">Select a Game</h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {Object.values(games).map((game) => (
            <Link key={game.id} to={`/${game.id}`} className="group">
              <Card className="group cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] holographic-card electric-border h-full">
                <div className="p-8">
                  {game.titleImage ? (
                    <img
                      src={`${basePath}${game.titleImage}`}
                      alt={game.title}
                      className="h-20 w-auto object-contain mb-4 mx-auto drop-shadow-lg"
                    />
                  ) : (
                    <div className="text-6xl mb-4">{game.emoji}</div>
                  )}
                  <h2 className="text-2xl font-bold text-primary mb-2 group-hover:text-fuchsia transition-colors">
                    {game.title}
                  </h2>
                  <p className="text-text-secondary">{game.subtitle}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {game.databases.map((db) => (
                      <span
                        key={db.id}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30"
                      >
                        {db.emoji} {db.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-primary mb-4">📚 Credits & Resources</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            This database is made possible by the hard work of the Zelda modding community. Special thanks to Citrus, Dany,
            DanaTheElf, Jameriquiah, Malon Rose, Peyton, PurpleHato, wisefries, and more contributors who have documented and
            shared this technical information.
          </p>
          <div className="mt-6 pt-6 border-t border-border/20">
            <p className="text-xs text-text-muted">
              Part of the Harbour Master 64 project • Built for the modding community
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LandingPage;
