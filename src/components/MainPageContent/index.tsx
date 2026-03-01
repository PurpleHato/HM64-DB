import React from 'react';
import { Card } from '../ui/Card';

export const MainPageContent: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold gradient-text sm:text-4xl">
            🎮 Welcome to the Zelda: Ocarina of Time Asset Database
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            This comprehensive database provides essential information for modders and enthusiasts working with Zelda: Ocarina of Time assets. Whether you're creating custom music, replacing models, or working with special effects, you'll find the technical details you need here.
          </p>
        </div>

        {/* Getting Started */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-primary">🚀 Getting Started</h3>
          <p className="mt-2 text-text-secondary">Use the navigation tabs above to explore different sections of the database:</p>
          <ul className="mt-4 space-y-2 text-text-secondary">
            <li><strong className="text-text-primary">Display Lists:</strong> Visual model and skeleton information for 3D assets</li>
            <li><strong className="text-text-primary">Segment Calls:</strong> Integration tools for special effects preservation</li>
            <li><strong className="text-text-primary">Animations:</strong> Character and object movement data for dynamic content</li>
            <li><strong className="text-text-primary">Sounds:</strong> Audio samples and effects with technical specifications</li>
            <li><strong className="text-text-primary">Instruments:</strong> Musical instrument sets for custom soundtracks</li>
          </ul>
        </Card>

        {/* Feature Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6 holographic-card">
            <h3 className="text-lg font-bold text-primary">🗂️ Display Lists Database</h3>
            <p className="mt-2 text-sm text-text-secondary">Comprehensive display lists information for both decomp and Ship of Harkinian projects. Essential for model development and asset management.</p>
            <ul className="mt-3 space-y-1 text-xs text-text-muted">
              <li>• Objects and scenes display lists</li>
              <li>• Skeleton and bone information</li>
              <li>• Custom SoH implementations</li>
              <li>• Cross-reference between decomp and SoH</li>
            </ul>
          </Card>

          <Card className="p-6 holographic-card">
            <h3 className="text-lg font-bold text-fuchsia">📋 Segment Calls Database</h3>
            <p className="mt-2 text-sm text-text-secondary">Essential segment call information for maintaining special effects when replacing models. Includes automated tools and manual instructions.</p>
            <ul className="mt-3 space-y-1 text-xs text-text-muted">
              <li>• Tutorial for beginners</li>
              <li>• Object and scene segment calls</li>
              <li>• Automated integration tools</li>
              <li>• Special effects preservation</li>
            </ul>
          </Card>

          <Card className="p-6 holographic-card">
            <h3 className="text-lg font-bold text-pink">🎬 Animations Database</h3>
            <p className="mt-2 text-sm text-text-secondary">Complete character and object animation data for both decomp and Ship of Harkinian projects. Essential for character modding and custom animations.</p>
            <ul className="mt-3 space-y-1 text-xs text-text-muted">
              <li>• Character movement animations</li>
              <li>• Object interaction sequences</li>
              <li>• Cross-reference between decomp and SoH</li>
              <li>• Animation timing and technical details</li>
            </ul>
          </Card>

          <Card className="p-6 holographic-card">
            <h3 className="text-lg font-bold text-indigo">🔊 Sounds Database</h3>
            <p className="mt-2 text-sm text-text-secondary">Audio samples and effects database with technical specifications. Essential for custom sound implementation and audio replacement.</p>
            <ul className="mt-3 space-y-1 text-xs text-text-muted">
              <li>• Audio file specifications</li>
              <li>• Sample rates and formats</li>
              <li>• Sound effect categorization</li>
              <li>• Technical implementation details</li>
            </ul>
          </Card>

          <Card className="p-6 holographic-card sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold text-cyan">🎵 Instruments Database</h3>
            <p className="mt-2 text-sm text-text-secondary">Musical instrument sets and sample information for custom soundtrack creation. Includes percussion maps and detailed technical specifications.</p>
            <ul className="mt-3 space-y-1 text-xs text-text-muted">
              <li>• Instrument sample sets</li>
              <li>• Percussion mapping data</li>
              <li>• Audio format specifications</li>
              <li>• Custom music integration guides</li>
            </ul>
          </Card>
        </div>

        {/* Credits */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-primary">📚 Credits & Resources</h3>
          <p className="mt-2 text-sm text-text-secondary">
            This database is made possible by the hard work of the Zelda modding community. Special thanks to Citrus, Dany, DanaTheElf, Laqueeshous, Malon Rose, Peyton, PurpleHato, wisefries, and more contributors who have documented and shared this technical information.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default MainPageContent;
