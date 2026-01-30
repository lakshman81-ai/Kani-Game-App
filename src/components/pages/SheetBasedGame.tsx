import React from 'react';
import { SpaceBackground } from '../shared/SpaceBackground';
import { Header } from '../shared/Header';
import { DifficultyBadge } from '../shared/DifficultyBadge';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { GameOverScreen } from '../shared/GameOverScreen';
import { StoryNebulaRenderer, InferenceInvestigatorRenderer } from '../../renderers/ComprehensionRenderer';
import { useAppContext } from '../../contexts/AppContext';
import { useGameLogic } from '../../hooks/useGameLogic';
import { GAME_THEMES } from '../../themes/themeConfig';
import { Settings, Difficulty } from '../../types';

interface SheetBasedGameProps {
    onBack: () => void;
    difficulty: Difficulty;
    settings: Settings;
    gameId: string;
    title: string | undefined;
    icon: string | undefined;
    color: string | undefined;
    variant: string;
}

const shuffleArray = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

const SHAPES: Record<string, string> = {
    triangle: '△', square: '□', circle: '○',
    rectangle: '▭', pentagon: '⬠', hexagon: '⬡',
    octagon: '⬢', star: '⭐', rhombus: '♢', trapezoid: '⏢'
};

export const SheetBasedGame: React.FC<SheetBasedGameProps> = ({ onBack, difficulty, settings, gameId, title, icon, variant }) => {
    const { addLeaderboardEntry } = useAppContext();

    const handleGameEnd = async (game: string, name: string, stars: number, streak: number) => {
        await addLeaderboardEntry({ game, name, stars, streak, date: new Date().toISOString() });
    };

    const {
        gameState: { stars, timer, gameActive, gameOver, currentQ, streak, maxStreak, feedback, playerName, scoreSaved },
        setters: { setPlayerName },
        actions: { startGame, handleAnswer, handleSaveScore },
        data: { loading, error, questionsCount }
    } = useGameLogic(gameId, difficulty, settings, handleGameEnd);

    const gameTheme = GAME_THEMES[gameId];

    // Auto-select background based on theme or variant
    const background = gameTheme ? `linear-gradient(135deg, var(--theme-secondary, #1a1a2e) 0%, ${gameTheme.gradient.includes('to-') ? 'rgba(0,0,0,0.8)' : gameTheme.gradient} 100%)` : variant;

    const safeTitle = title || 'Game';
    const safeIcon = icon || '🎮';
    const safeAnswer = currentQ?.answer || '';
    const safeHint = currentQ?.hint || '';
    const safeExplanation = feedback?.explanation || '';

    // Render question based on game type
    const renderQuestion = () => {
        if (!currentQ) return <p className="text-white">No questions available</p>;

        // Math equations (space-math, alien-invasion, bubble-pop)
        if (['space-math', 'alien-invasion', 'bubble-pop'].includes(gameId)) {
            const options = [currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].filter(Boolean);
            return (
                <div className="w-full max-w-lg">
                    <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur mb-6 text-center">
                        <div className="text-white text-4xl font-bold mb-2">
                            {currentQ.num1} {currentQ.operation} {currentQ.num2} = ?
                        </div>
                        {safeHint && <p className="text-gray-400 text-sm">{safeHint}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3 relative z-20">
                        {options.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(opt, safeAnswer)}
                                className={`p-4 rounded-xl text-2xl font-bold transition-all cursor-pointer ${feedback ? (opt === safeAnswer ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400')
                                    : `${gameTheme?.buttonBg || 'bg-blue-600'} text-white hover:scale-105`
                                    }`}>{opt}</button>
                        ))}
                    </div>
                    {safeExplanation && (
                        <div className="mt-6 bg-white/10 rounded-xl p-4 backdrop-blur animate-slideIn">
                            <h3 className="text-yellow-400 font-bold mb-1">💡 Know More</h3>
                            <p className="text-white text-sm">{safeExplanation}</p>
                        </div>
                    )}
                </div>
            );
        }

        // Sequences (planet-hopper)
        if (gameId === 'planet-hopper') {
            const seqParts = currentQ.num1 ? currentQ.num1.split(' ') : [];
            const options = [currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].filter(Boolean);
            return (
                <div className="w-full max-w-lg">
                    <div className="flex justify-center gap-2 mb-6 flex-wrap">
                        {seqParts.map((part, i) => (
                            <div key={i} className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-lg border-4 border-white/30 ${part === '?' ? 'bg-gray-600' : 'bg-gradient-to-b from-purple-400 to-purple-600'
                                }`} style={{ animation: 'float 3s ease-in-out infinite' }}>
                                {part}
                            </div>
                        ))}
                    </div>
                    <p className="text-white text-center mb-4">Find the missing number!</p>
                    {safeHint && <p className="text-gray-400 text-sm text-center mb-4">{safeHint}</p>}
                    <div className="grid grid-cols-2 gap-3 relative z-20">
                        {options.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(opt, safeAnswer)}
                                className={`p-4 rounded-xl text-xl font-bold transition-all cursor-pointer ${feedback ? (opt === safeAnswer ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400')
                                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105'
                                    }`}>{opt}</button>
                        ))}
                    </div>
                </div>
            );
        }

        // Grammar
        if (gameId === 'grammar-galaxy') {
            const options = [currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].filter(Boolean);
            return (
                <div className="w-full max-w-lg">
                    <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur mb-6">
                        <div className="text-xs text-purple-400 mb-2">{currentQ.text2}</div>
                        <div className="text-white text-2xl font-medium text-center">"{currentQ.text1}"</div>
                    </div>
                    <p className="text-purple-200 text-center mb-4">Choose the correct word:</p>
                    <div className="grid grid-cols-2 gap-3 relative z-20">
                        {options.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(opt, safeAnswer)}
                                className={`p-4 rounded-xl text-lg font-bold transition-all cursor-pointer ${feedback ? (opt === safeAnswer ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400')
                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105'
                                    }`}>{opt}</button>
                        ))}
                    </div>
                </div>
            );
        }

        // Word class
        if (gameId === 'word-class-warp') {
            const categories = ['noun', 'verb', 'adjective', 'adverb'];
            const icons_map = { noun: '📦', verb: '🏃', adjective: '🎨', adverb: '⚡' };
            const colors_map: Record<string, string> = { noun: 'from-red-500 to-orange-500', verb: 'from-green-500 to-emerald-500', adjective: 'from-blue-500 to-purple-500', adverb: 'from-yellow-500 to-amber-500' };
            return (
                <div className="w-full max-w-lg">
                    <div className="bg-gray-900/80 rounded-2xl p-8 backdrop-blur mb-8 text-center">
                        <div className="text-4xl font-bold text-white" style={{ animation: 'float 2s ease-in-out infinite' }}>{currentQ.text1}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 relative z-20">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => handleAnswer(cat, safeAnswer)}
                                className={`p-6 rounded-2xl text-white font-bold text-lg transition-all hover:scale-105 cursor-pointer bg-gradient-to-br ${colors_map[cat]} ${feedback && cat === safeAnswer ? 'ring-4 ring-green-400' : ''
                                    }`}>
                                <div className="text-3xl mb-2">{icons_map[cat as keyof typeof icons_map]}</div>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        // Punctuation
        if (gameId === 'punctuation-pop') {
            const marks = ['.', '?', '!', ','];
            return (
                <div className="w-full max-w-lg">
                    <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur mb-6">
                        <div className="text-white text-2xl font-medium text-center">
                            {currentQ.text1}<span className="text-yellow-400 text-3xl animate-pulse">_</span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 relative z-20">
                        {marks.map(mark => (
                            <button key={mark} onClick={() => handleAnswer(mark, safeAnswer)}
                                className={`w-16 h-16 rounded-full text-3xl font-bold transition-all hover:scale-110 cursor-pointer ${feedback && mark === safeAnswer ? 'bg-green-500 text-white' : 'bg-gradient-to-b from-pink-400 to-rose-500 text-white'
                                    }`}>{mark}</button>
                        ))}
                    </div>
                </div>
            );
        }

        // Tenses
        if (gameId === 'tense-traveler') {
            const options = [currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].filter(Boolean);
            const tenseColors: Record<string, string> = { past: 'from-amber-600 to-orange-700', present: 'from-green-500 to-emerald-600', future: 'from-blue-500 to-indigo-600' };
            const tenseIcons: Record<string, string> = { past: '⏪', present: '▶️', future: '⏩' };
            return (
                <div className="w-full max-w-lg">
                    <div className={`bg-gradient-to-r ${tenseColors[currentQ.text2 || ''] || 'from-gray-500 to-gray-600'} rounded-2xl p-4 mb-4 text-center`}>
                        <div className="text-3xl mb-1">{tenseIcons[currentQ.text2 || ''] || '🕐'}</div>
                        <div className="text-white text-xl font-bold">{(currentQ.text2 || 'TENSE').toUpperCase()}</div>
                    </div>
                    <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur mb-6 text-center">
                        <div className="text-gray-400 text-sm mb-2">Convert this verb:</div>
                        <div className="text-white text-4xl font-bold">{currentQ.text1}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 relative z-20">
                        {options.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(opt, safeAnswer)}
                                className={`p-4 rounded-xl text-lg font-bold transition-all cursor-pointer ${feedback ? (opt === safeAnswer ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400')
                                    : 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:scale-105'
                                    }`}>{opt}</button>
                        ))}
                    </div>
                </div>
            );
        }

        // Synonyms & Antonyms
        if (gameId === 'synonym-stars' || gameId === 'antonym-asteroids') {
            const options = shuffleArray([safeAnswer, currentQ.option2, currentQ.option3, currentQ.option4].filter(Boolean));
            const isSynonym = gameId === 'synonym-stars';
            return (
                <div className="w-full max-w-lg">
                    <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur mb-6 text-center">
                        <div className="text-green-300 text-sm mb-2">Find {isSynonym ? 'a word that means the same as' : 'the OPPOSITE of'}:</div>
                        <div className="text-white text-4xl font-bold">{currentQ.text1}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 relative z-20">
                        {options.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(opt, safeAnswer)}
                                className={`p-4 rounded-xl text-lg font-bold transition-all cursor-pointer ${feedback ? (opt === safeAnswer ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400')
                                    : `bg-gradient-to-r ${isSynonym ? 'from-yellow-500 to-orange-500' : 'from-red-500 to-orange-500'} text-white hover:scale-105`
                                    }`}>{opt}</button>
                        ))}
                    </div>
                </div>
            );
        }

        // Story comprehension
        if (gameId === 'story-nebula') {
            const gameTheme = GAME_THEMES['story-nebula'] || GAME_THEMES['space-math'];
            return (
                <StoryNebulaRenderer
                    currentQ={currentQ}
                    handleAnswer={handleAnswer}
                    feedback={feedback}
                    gameTheme={gameTheme}
                />
            );
        }

        // Inference
        if (gameId === 'inference-investigator') {
            const gameTheme = GAME_THEMES['inference-investigator'] || GAME_THEMES['space-math'];
            return (
                <InferenceInvestigatorRenderer
                    currentQ={currentQ}
                    handleAnswer={handleAnswer}
                    feedback={feedback}
                    gameTheme={gameTheme}
                />
            );
        }

        // Fractions
        if (gameId === 'fraction-frenzy') {
            const options = [currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].filter(Boolean);
            return (
                <div className="w-full max-w-lg">
                    <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur mb-6 text-center">
                        <div className="text-yellow-400 text-sm mb-2 capitalize">{currentQ.num2}</div>
                        <div className="text-white text-2xl font-bold mb-4">{currentQ.num1}</div>
                        {safeHint && <p className="text-gray-400 text-sm">{safeHint}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3 relative z-20">
                        {options.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(opt, safeAnswer)}
                                className={`p-4 rounded-xl text-2xl font-bold transition-all cursor-pointer ${feedback ? (opt === safeAnswer ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400')
                                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-105'
                                    }`}>{opt}</button>
                        ))}
                    </div>
                </div>
            );
        }

        // Time
        if (gameId === 'time-warp') {
            const options = [currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].filter(Boolean);
            const hour = parseInt(currentQ.num1 || '3');
            const minute = parseInt(currentQ.num2 || '0');
            return (
                <div className="w-full max-w-lg">
                    <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur mb-6 text-center">
                        <div className="text-blue-400 text-sm mb-2">{currentQ.operation === 'read' ? 'Read the Clock' : 'Calculate Duration'}</div>
                        {currentQ.operation === 'read' && (
                            <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto">
                                <circle cx="50" cy="50" r="45" fill="#1f2937" stroke="#fbbf24" strokeWidth="3" />
                                {[...Array(12)].map((_, i) => {
                                    const angle = (i * 30 - 90) * Math.PI / 180;
                                    return <text key={i} x={50 + 35 * Math.cos(angle)} y={50 + 35 * Math.sin(angle) + 4} fill="white" fontSize="10" textAnchor="middle">{i === 0 ? 12 : i}</text>;
                                })}
                                <line x1="50" y1="50" x2={50 + 20 * Math.cos(((hour % 12) * 30 + minute * 0.5 - 90) * Math.PI / 180)} y2={50 + 20 * Math.sin(((hour % 12) * 30 + minute * 0.5 - 90) * Math.PI / 180)} stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                                <line x1="50" y1="50" x2={50 + 30 * Math.cos((minute * 6 - 90) * Math.PI / 180)} y2={50 + 30 * Math.sin((minute * 6 - 90) * Math.PI / 180)} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        )}
                        {currentQ.operation === 'duration' && <div className="text-white text-xl">From {currentQ.num1} to {currentQ.num2}</div>}
                    </div>
                    <div className="grid grid-cols-2 gap-3 relative z-20">
                        {options.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(opt, safeAnswer)}
                                className={`p-4 rounded-xl text-lg font-bold transition-all cursor-pointer ${feedback ? (opt === safeAnswer ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400')
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:scale-105'
                                    }`}>{opt}</button>
                        ))}
                    </div>
                </div>
            );
        }

        // Money
        if (gameId === 'money-master') {
            const options = [currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].filter(Boolean);
            const isChange = currentQ.num2 === 'change';
            return (
                <div className="w-full max-w-lg">
                    <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur mb-6 text-center">
                        <div className="text-green-400 text-sm mb-2">{isChange ? '💵 Make Change' : '🪙 Count the Coins'}</div>
                        <div className="text-white text-2xl font-bold mb-4">{currentQ.num1 || ''}</div>
                        {safeHint && <p className="text-gray-400 text-sm">{safeHint}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3 relative z-20">
                        {options.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(opt, safeAnswer)}
                                className={`p-4 rounded-xl text-2xl font-bold transition-all cursor-pointer ${feedback ? (opt === safeAnswer ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400')
                                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-105'
                                    }`}>{opt}</button>
                        ))}
                    </div>
                </div>
            );
        }

        // Geometry
        if (gameId === 'geometry-galaxy') {
            const options = [currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].filter(Boolean);
            return (
                <div className="w-full max-w-lg">
                    <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur mb-6 text-center">
                        <div className="text-pink-400 text-sm mb-2">{currentQ.operation}</div>
                        {currentQ.operation === 'identify' && <div className="text-8xl mb-4">{SHAPES[(currentQ.text1 || '').toLowerCase()] || '?'}</div>}
                        {currentQ.operation === 'sides' && <div className="text-white text-2xl mb-4">How many sides does a {currentQ.text1} have?</div>}
                        {(currentQ.operation === 'perimeter' || currentQ.operation === 'area') && (
                            <>
                                <div className="text-white text-xl mb-4">{currentQ.operation === 'perimeter' ? 'Perimeter' : 'Area'} of square with side {currentQ.num1}?</div>
                                <div className="w-20 h-20 bg-pink-500/30 border-4 border-pink-400 mx-auto flex items-center justify-center text-white text-lg font-bold">{currentQ.num1}</div>
                            </>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 relative z-20">
                        {options.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(opt, currentQ.answer)}
                                className={`p-4 rounded-xl text-lg font-bold transition-all cursor-pointer ${feedback ? (opt === currentQ.answer ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400')
                                    : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:scale-105'
                                    }`}>{opt}</button>
                        ))}
                    </div>
                </div>
            );
        }

        // ==================== SKILL GAMES ====================

        // Pattern Forge - Complete the pattern
        if (gameId === 'pattern-forge') {
            const options = [currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].filter(Boolean);
            const patternParts = currentQ.text1 ? currentQ.text1.split(' ') : [];
            return (
                <div className="w-full max-w-lg">
                    <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur mb-6 text-center">
                        <div className="text-violet-400 text-sm mb-4">🧩 Complete the pattern!</div>
                        <div className="flex justify-center gap-3 mb-4 flex-wrap">
                            {patternParts.map((part, i) => (
                                <div
                                    key={i}
                                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg border-2 
                                        ${part === '?'
                                            ? 'bg-violet-500/30 border-violet-400 text-violet-300 animate-pulse'
                                            : 'bg-gradient-to-br from-violet-500 to-indigo-600 border-violet-300/50 text-white'
                                        }`}
                                    style={{ animation: part !== '?' ? `float ${2 + i * 0.2}s ease-in-out infinite` : undefined }}
                                >
                                    {part}
                                </div>
                            ))}
                        </div>
                        {currentQ.hint && <p className="text-gray-400 text-sm">💡 {currentQ.hint}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3 relative z-20">
                        {options.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(opt, currentQ.answer)}
                                className={`p-4 rounded-xl text-xl font-bold transition-all cursor-pointer ${feedback ? (opt === currentQ.answer ? 'bg-green-500 text-white scale-105' : 'bg-gray-700 text-gray-400')
                                    : 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:scale-105 hover:shadow-lg'
                                    }`}>{opt}</button>
                        ))}
                    </div>
                </div>
            );
        }

        // Logic Lab - Deductive reasoning puzzles
        if (gameId === 'logic-lab') {
            const options = [currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].filter(Boolean);
            return (
                <div className="w-full max-w-lg">
                    <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur mb-6">
                        <div className="text-emerald-400 text-sm mb-3 text-center">🔍 Solve the puzzle!</div>
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-4">
                            <div className="text-white text-lg leading-relaxed">{currentQ.text1}</div>
                        </div>
                        {currentQ.text2 && (
                            <div className="text-teal-300 text-center text-lg font-medium">{currentQ.text2}</div>
                        )}
                        {currentQ.hint && <p className="text-gray-400 text-sm mt-3 text-center">💡 {currentQ.hint}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3 relative z-20">
                        {options.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(opt, currentQ.answer)}
                                className={`p-4 rounded-xl text-lg font-bold transition-all cursor-pointer ${feedback ? (opt === currentQ.answer ? 'bg-green-500 text-white scale-105' : 'bg-gray-700 text-gray-400')
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-105'
                                    }`}>{opt}</button>
                        ))}
                    </div>
                </div>
            );
        }

        // Odd Wizard - Find the item that doesn't belong
        if (gameId === 'odd-wizard') {
            const options = [currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].filter(Boolean);
            return (
                <div className="w-full max-w-lg">
                    <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur mb-6 text-center">
                        <div className="text-amber-400 text-sm mb-4">🎯 Find the odd one out!</div>
                        {currentQ.text1 && (
                            <div className="text-gray-300 text-sm mb-2">{currentQ.text1}</div>
                        )}
                        {currentQ.hint && <p className="text-gray-400 text-sm">💡 {currentQ.hint}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4 relative z-20">
                        {options.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(opt, currentQ.answer)}
                                className={`p-5 rounded-2xl text-xl font-bold transition-all cursor-pointer border-2 ${feedback
                                    ? (opt === currentQ.answer
                                        ? 'bg-green-500 text-white border-green-400 scale-105 ring-4 ring-green-400/50'
                                        : 'bg-gray-700 text-gray-400 border-gray-600')
                                    : 'bg-gradient-to-br from-amber-500 to-yellow-500 text-white border-amber-300/50 hover:scale-105 hover:shadow-xl'
                                    }`}
                                style={{ animation: `slideIn 0.3s ease-out ${i * 0.1}s both` }}
                            >{opt}</button>
                        ))}
                    </div>
                </div>
            );
        }

        // Sorting Station - Put items in order
        if (gameId === 'sorting-station') {
            const options = [currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].filter(Boolean);
            return (
                <div className="w-full max-w-lg">
                    <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur mb-6 text-center">
                        <div className="text-cyan-400 text-sm mb-4">📦 Put in correct order!</div>
                        <div className="text-white text-xl font-medium mb-4">{currentQ.text1}</div>
                        {currentQ.text2 && (
                            <div className="text-blue-300 text-sm">{currentQ.text2}</div>
                        )}
                        {currentQ.hint && <p className="text-gray-400 text-sm mt-3">💡 {currentQ.hint}</p>}
                    </div>
                    <div className="grid grid-cols-1 gap-3 relative z-20">
                        {options.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(opt, currentQ.answer)}
                                className={`p-4 rounded-xl text-lg font-bold transition-all cursor-pointer flex items-center gap-3 ${feedback
                                    ? (opt === currentQ.answer
                                        ? 'bg-green-500 text-white scale-102'
                                        : 'bg-gray-700 text-gray-400')
                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:scale-102 hover:translate-x-2'
                                    }`}
                            >
                                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">{i + 1}</span>
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        // Code Breaker - Decode secret messages
        if (gameId === 'code-breaker') {
            const options = [currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].filter(Boolean);
            return (
                <div className="w-full max-w-lg">
                    <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur mb-6 text-center">
                        <div className="text-fuchsia-400 text-sm mb-4">🔐 Crack the code!</div>
                        {currentQ.text2 && (
                            <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-3 mb-4">
                                <div className="text-purple-300 text-xs mb-1">Cipher Key:</div>
                                <div className="text-white font-mono text-sm">{currentQ.text2}</div>
                            </div>
                        )}
                        <div className="bg-fuchsia-500/20 border-2 border-fuchsia-400/50 rounded-xl p-4 mb-4">
                            <div className="text-fuchsia-200 text-xs mb-2">Decode this:</div>
                            <div className="text-white text-2xl font-bold font-mono tracking-wider">{currentQ.text1}</div>
                        </div>
                        {currentQ.hint && <p className="text-gray-400 text-sm">💡 {currentQ.hint}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3 relative z-20">
                        {options.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(opt, currentQ.answer)}
                                className={`p-4 rounded-xl text-lg font-bold transition-all cursor-pointer ${feedback
                                    ? (opt === currentQ.answer
                                        ? 'bg-green-500 text-white scale-105'
                                        : 'bg-gray-700 text-gray-400')
                                    : 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white hover:scale-105'
                                    }`}>{opt}</button>
                        ))}
                    </div>
                </div>
            );
        }

        return <p className="text-white">Question type not supported</p>;
    };

    if (loading) return <SpaceBackground variant={variant}><div className="flex items-center justify-center h-full"><LoadingSpinner /></div></SpaceBackground>;
    if (error) return <SpaceBackground variant={variant}><div className="flex flex-col items-center justify-center h-full"><p className="text-red-400 mb-4">Error: {error}</p><button onClick={onBack} className="bg-gray-600 text-white px-6 py-3 rounded-full cursor-pointer">Back</button></div></SpaceBackground>;

    return (
        <SpaceBackground variant={background}>
            <Header timer={timer} streak={streak} stars={stars} onBack={onBack} formatTime={(s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`} difficulty={difficulty} />
            <div className="flex flex-col items-center justify-center h-full pt-20 px-4">
                {!gameActive && !gameOver && (
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-white mb-2">{safeIcon} {safeTitle}</h1>
                        <DifficultyBadge difficulty={difficulty} />
                        <p className="text-gray-300 my-4">{questionsCount} questions loaded from Google Sheets</p>
                        <button onClick={startGame} disabled={questionsCount === 0}
                            className={`${GAME_THEMES[gameId]?.buttonBg || 'bg-blue-600'} text-white px-8 py-4 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-lg cursor-pointer disabled:opacity-50`}>
                            {questionsCount > 0 ? 'START GAME' : 'No Questions Available'}
                        </button>
                    </div>
                )}
                {gameOver && <GameOverScreen stars={stars} streak={maxStreak} onRestart={startGame} onBack={onBack} onSaveScore={handleSaveScore} playerName={playerName} setPlayerName={setPlayerName} scoreSaved={scoreSaved} />}
                {gameActive && renderQuestion()}
                {feedback && <div className={`mt-4 text-center text-xl font-bold ${feedback.correct ? 'text-green-400' : 'text-red-400'}`}>{feedback.correct ? '✓ Correct!' : `✗ Answer: ${feedback.answer}`}</div>}
            </div>
        </SpaceBackground>
    );
};
