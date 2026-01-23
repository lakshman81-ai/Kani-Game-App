import React, { useState, Suspense } from 'react';
import { useAppContext } from './contexts/AppContext';
import { ALL_GAMES, MATH_GAMES, GRAMMAR_GAMES, VOCABULARY_GAMES, COMPREHENSION_GAMES } from './data/gameDefinitions';
import { Difficulty } from './types';
import { LoadingSpinner } from './components/shared/LoadingSpinner';

// Lazy load page components for better performance
const SettingsPage = React.lazy(() => import('./components/pages/SettingsPage').then(module => ({ default: module.SettingsPage })));
const LeaderboardPage = React.lazy(() => import('./components/pages/LeaderboardPage').then(module => ({ default: module.LeaderboardPage })));
const EnhancedQAPage = React.lazy(() => import('./components/pages/EnhancedQAPage').then(module => ({ default: module.EnhancedQAPage })));
const SheetBasedGame = React.lazy(() => import('./components/pages/SheetBasedGame').then(module => ({ default: module.SheetBasedGame })));
const DifficultySelector = React.lazy(() => import('./components/pages/DifficultySelector').then(module => ({ default: module.DifficultySelector })));
const GameTilesPage = React.lazy(() => import('./components/pages/GameTilesPage').then(module => ({ default: module.GameTilesPage })));
const EnglishLandingPage = React.lazy(() => import('./components/pages/EnglishLandingPage').then(module => ({ default: module.EnglishLandingPage })));
const MainLandingPage = React.lazy(() => import('./components/pages/MainLandingPage').then(module => ({ default: module.MainLandingPage })));

const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

const LearningGalaxy: React.FC = () => {
  const [currentSubject, setCurrentSubject] = useState<string | null>(null);
  const [englishCategory, setEnglishCategory] = useState<string | null>(null);
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showQA, setShowQA] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { settings, updateSettings, leaderboard } = useAppContext();

  const totalStars = leaderboard.reduce((sum, e) => sum + e.stars, 0);
  const handleBackToHome = () => { setCurrentSubject(null); setEnglishCategory(null); setCurrentGame(null); setSelectedDifficulty(null); };

  return (
    <Suspense fallback={<LoadingScreen />}>
      {(() => {
        if (showSettings) return <SettingsPage settings={settings} setSettings={updateSettings} onBack={() => setShowSettings(false)} />;
        if (showLeaderboard) return <LeaderboardPage onBack={() => setShowLeaderboard(false)} leaderboard={leaderboard} />;
        if (showQA) return <EnhancedQAPage onBack={() => setShowQA(false)} leaderboard={leaderboard} />;

        if (currentGame && selectedDifficulty) {
          const gameInfo = ALL_GAMES.find(g => g.id === currentGame);
          const variant = MATH_GAMES.find(g => g.id === currentGame) ? 'math' : GRAMMAR_GAMES.find(g => g.id === currentGame) ? 'grammar' : VOCABULARY_GAMES.find(g => g.id === currentGame) ? 'vocabulary' : 'comprehension';
          return <SheetBasedGame onBack={handleBackToHome} difficulty={selectedDifficulty} settings={settings} gameId={currentGame} title={gameInfo?.title} icon={gameInfo?.icon} color={gameInfo?.color} variant={variant} />;
        }

        if (currentGame) return <DifficultySelector game={currentGame} onSelect={setSelectedDifficulty} onBack={() => setCurrentGame(null)} settings={settings} />;

        const handleGameSelect = (gameId: string) => {
          setCurrentGame(gameId);
          if (settings.defaultDifficulty && settings.defaultDifficulty !== 'None') {
            setSelectedDifficulty(settings.defaultDifficulty);
          }
        };

        if (currentSubject === 'english' && englishCategory) {
          const games = englishCategory === 'grammar' ? GRAMMAR_GAMES : englishCategory === 'vocabulary' ? VOCABULARY_GAMES : COMPREHENSION_GAMES;
          return <GameTilesPage title={englishCategory.charAt(0).toUpperCase() + englishCategory.slice(1)} icon={englishCategory === 'grammar' ? '✏️' : englishCategory === 'vocabulary' ? '📖' : '🔍'} games={games} onSelectGame={handleGameSelect} onBack={() => setEnglishCategory(null)} totalStars={totalStars} variant={englishCategory} />;
        }
        if (currentSubject === 'english') return <EnglishLandingPage onSelectCategory={setEnglishCategory} onBack={handleBackToHome} totalStars={totalStars} />;
        if (currentSubject === 'math') return <GameTilesPage title="Math Galaxy" icon="🔢" games={MATH_GAMES} onSelectGame={handleGameSelect} onBack={handleBackToHome} totalStars={totalStars} variant="math" />;

        return <MainLandingPage onSelectSubject={setCurrentSubject} totalStars={totalStars} onOpenLeaderboard={() => setShowLeaderboard(true)} onOpenQA={() => setShowQA(true)} onOpenSettings={() => setShowSettings(true)} leaderboard={leaderboard} />;
      })()}
    </Suspense>
  );
};

export default LearningGalaxy;
