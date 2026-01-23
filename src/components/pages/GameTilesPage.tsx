import React from 'react';
import { SpaceBackground } from '../shared/SpaceBackground';
import { StarIcon } from '../shared/StarIcon';
import { GameDefinition } from '../../types';

interface GameTilesPageProps {
    title: string;
    icon: string | JSX.Element;
    games: GameDefinition[];
    onSelectGame: (id: string) => void;
    onBack: () => void;
    totalStars: number;
    variant?: string;
}

export const GameTilesPage: React.FC<GameTilesPageProps> = ({ title, icon, games, onSelectGame, onBack, totalStars, variant }) => (
    <SpaceBackground variant={variant}>
        <div className="flex flex-col items-center h-full px-4 py-8 overflow-y-auto">
            <button onClick={onBack} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gray-900/80 flex items-center justify-center text-white hover:bg-gray-700 z-20 cursor-pointer">←</button>
            <div className="text-center mb-8 pt-8">
                <h1 className="text-4xl font-bold text-white mb-2">{icon} {title}</h1>
                <div className="flex items-center justify-center gap-2 mt-4 bg-gray-900/60 px-4 py-2 rounded-full">
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-bold">{totalStars} Stars</span>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full pb-8 relative z-20">
                {games.map((game, i) => (
                    <button key={game.id} onClick={() => onSelectGame(game.id)}
                        className={`bg-gradient-to-br ${game.color} p-4 rounded-2xl shadow-xl text-left transition-all hover:scale-105 cursor-pointer`}
                        style={{ animation: `slideIn 0.3s ease-out ${i * 0.05}s both` }}>
                        <div className="text-3xl mb-2">{game.icon}</div>
                        <h3 className="text-sm font-bold text-white mb-1">{game.title}</h3>
                        <p className="text-white/80 text-xs">{game.description}</p>
                    </button>
                ))}
            </div>
        </div>
    </SpaceBackground>
);
