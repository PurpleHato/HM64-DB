// Game and database configuration for Harbour Master 64

export interface GameConfig {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  titleImage?: string;
  description: string;
  databases: DatabaseConfig[];
}

export interface DatabaseConfig {
  id: string;
  name: string;
  emoji: string;
  hasSubcategories: boolean;
  hasPercussion?: boolean;
  dynamicColumns?: boolean;
  subcategories?: Record<string, SubcategoryConfig>;
}

export interface SubcategoryConfig {
  name: string;
  dataFile: string | null;
}

export const games: Record<string, GameConfig> = {
  oot: {
    id: 'oot',
    title: 'Zelda: Ocarina of Time',
    subtitle: 'Ship of Harkinian - Asset Database',
    emoji: '🗡️',
    titleImage: 'SoHTitle.png',
    description: 'Comprehensive database of Ocarina of Time assets including display lists, segment calls, animations, sounds, and instruments for modding and development.',
    databases: [
      {
        id: 'dlists',
        name: 'Display Lists',
        emoji: '🗂️',
        hasSubcategories: true,
        dynamicColumns: true,
        subcategories: {
          objects: { name: 'Objects', dataFile: 'Objects.json' },
          scenes: { name: 'Scenes', dataFile: 'Scenes.json' },
          skeletons: { name: 'Skeletons', dataFile: 'Skeletons.json' },
          skeletonsAlt: { name: 'Skeletons Alt', dataFile: 'SkeletonsAlt.json' },
          skeletonsBones: { name: 'Skeleton Bones', dataFile: 'SkeletonsBones.json' },
          customs: { name: 'Customs SoH', dataFile: 'CustomsSoH.json' },
          others: { name: 'Others', dataFile: 'Others.json' },
        },
      },
      {
        id: 'segment-calls',
        name: 'Segment Calls',
        emoji: '📋',
        hasSubcategories: true,
        subcategories: {
          tutorial: { name: 'Tutorial', dataFile: null },
          objects: { name: 'Objects', dataFile: 'SegmentCallsObjects.json' },
          scenes: { name: 'Scenes', dataFile: 'SegmentCallsScenes.json' },
        },
      },
      {
        id: 'animations',
        name: 'Animations',
        emoji: '🎬',
        hasSubcategories: false,
      },
      {
        id: 'sounds',
        name: 'Sounds',
        emoji: '🔊',
        hasSubcategories: true,
        subcategories: {
          sampleBank0: { name: 'SampleBank 0', dataFile: 'SampleBank_0.json' },
          sampleBank2: { name: 'SampleBank 2', dataFile: 'SampleBank_2.json' },
          sampleBank3: { name: 'SampleBank 3', dataFile: 'SampleBank_3.json' },
          sampleBank4: { name: 'SampleBank 4', dataFile: 'SampleBank_4.json' },
          sampleBank5: { name: 'SampleBank 5', dataFile: 'SampleBank_5.json' },
          sampleBank6: { name: 'SampleBank 6', dataFile: 'SampleBank_6.json' },
          extra: { name: 'Extra', dataFile: 'Extra.json' },
          blad13: { name: 'Blad13', dataFile: 'Blad13.json' },
          nightlyNew: { name: 'Nightly New', dataFile: 'NightlyNew.json' },
        },
      },
      {
        id: 'instruments',
        name: 'Instruments',
        emoji: '🎵',
        hasSubcategories: false,
        hasPercussion: true,
      },
    ],
  },
  mm: {
    id: 'mm',
    title: "Zelda: Majora's Mask",
    subtitle: '2Ship2Harkinian - Asset Database',
    emoji: '🎭',
    titleImage: '2shipTitle.png',
    description: 'Comprehensive database of Majora\'s Mask assets including display lists, segment calls, animations, sounds, and instruments for modding and development.',
    databases: [
      {
        id: 'dlists',
        name: 'Display Lists',
        emoji: '🗂️',
        hasSubcategories: true,
        dynamicColumns: true,
        subcategories: {
          objects: { name: 'Objects', dataFile: 'Objects.json' },
          scenes: { name: 'Scenes', dataFile: 'Scenes.json' },
          skeletons: { name: 'Skeletons', dataFile: 'Skeletons.json' },
          skeletonsAlt: { name: 'Skeletons Alt', dataFile: 'SkeletonsAlt.json' },
          skeletonsBones: { name: 'Skeleton Bones', dataFile: 'SkeletonsBones.json' },
          customs: { name: 'Customs 2S2H', dataFile: 'Customs2S2H.json' },
          others: { name: 'Others', dataFile: 'Others.json' },
        },
      },
      {
        id: 'segment-calls',
        name: 'Segment Calls',
        emoji: '📋',
        hasSubcategories: true,
        subcategories: {
          tutorial: { name: 'Tutorial', dataFile: null },
          objects: { name: 'Objects', dataFile: 'SegmentCallsObjects.json' },
          scenes: { name: 'Scenes', dataFile: 'SegmentCallsScenes.json' },
        },
      },
      {
        id: 'animations',
        name: 'Animations',
        emoji: '🎬',
        hasSubcategories: false,
      },
      {
        id: 'sounds',
        name: 'Sounds',
        emoji: '🔊',
        hasSubcategories: true,
        subcategories: {
          sampleBank0: { name: 'SampleBank 0', dataFile: 'SampleBank_0.json' },
          sampleBank2: { name: 'SampleBank 2', dataFile: 'SampleBank_2.json' },
          sampleBank3: { name: 'SampleBank 3', dataFile: 'SampleBank_3.json' },
          sampleBank4: { name: 'SampleBank 4', dataFile: 'SampleBank_4.json' },
          sampleBank5: { name: 'SampleBank 5', dataFile: 'SampleBank_5.json' },
          sampleBank6: { name: 'SampleBank 6', dataFile: 'SampleBank_6.json' },
          extra: { name: 'Extra', dataFile: 'Extra.json' },
          blad13: { name: 'Blad13', dataFile: 'Blad13.json' },
          nightlyNew: { name: 'Nightly New', dataFile: 'NightlyNew.json' },
        },
      },
      {
        id: 'instruments',
        name: 'Instruments',
        emoji: '🎵',
        hasSubcategories: false,
        hasPercussion: true,
      },
    ],
  },
};

export const gameList = Object.values(games);

export function getGameById(gameId: string): GameConfig | undefined {
  return games[gameId];
}

export function getDatabaseById(gameId: string, databaseId: string): DatabaseConfig | undefined {
  const game = getGameById(gameId);
  return game?.databases.find((db) => db.id === databaseId);
}
