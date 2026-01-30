import { useState, useEffect, useCallback } from 'react';
import { Difficulty, Settings, Question, Feedback } from '../types';
import { useSheetData } from './useSheetData';
import { GAME_CONSTANTS } from '../constants/gameConstants';

export const useGameLogic = (
    gameId: string,
    difficulty: Difficulty,
    settings: Settings,
    onGameEnd: (game: string, name: string, stars: number, streak: number) => Promise<void>
) => {
    const isMath = ['space-math', 'alien-invasion', 'bubble-pop', 'planet-hopper', 'fraction-frenzy', 'time-warp', 'money-master', 'geometry-galaxy'].includes(gameId);
    const isSkill = ['pattern-forge', 'logic-lab', 'odd-wizard', 'sorting-station', 'code-breaker', 'memory-matrix', 'sequence-sprint', 'path-planner', 'data-detective', 'venn-voyager', 'mirror-match', 'scale-sense'].includes(gameId);
    const sheetUrl = isMath ? settings.mathSheetUrl : isSkill ? (settings.skillSheetUrl || settings.englishSheetUrl) : settings.englishSheetUrl;
    const { data: allQuestions, loading, error } = useSheetData(sheetUrl, gameId);

    const [stars, setStars] = useState(0);
    const baseTimer = difficulty === 'Hard' ? GAME_CONSTANTS.TIMER.HARD : difficulty === 'Medium' ? GAME_CONSTANTS.TIMER.MEDIUM : GAME_CONSTANTS.TIMER.EASY;
    const [timer, setTimer] = useState(baseTimer + (isMath ? 0 : 20));
    const [gameActive, setGameActive] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [currentQ, setCurrentQ] = useState<Question | null>(null);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [playerName, setPlayerName] = useState('');
    const [scoreSaved, setScoreSaved] = useState(false);
    const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());

    const questions = allQuestions.filter(q => !q.difficulty || q.difficulty === difficulty || difficulty === 'None');

    const getNextQuestion = useCallback(() => {
        if (questions.length === 0) return null;
        let available = questions.filter((_, i) => !usedIndices.has(i));
        if (available.length === 0) { setUsedIndices(new Set()); available = questions; }
        const idx = Math.floor(Math.random() * available.length);
        const realIdx = questions.indexOf(available[idx]);
        setUsedIndices(prev => new Set([...prev, realIdx]));
        return available[idx];
    }, [questions, usedIndices]);

    const generateQuestion = useCallback(() => {
        const q = getNextQuestion();
        if (q) setCurrentQ(q);
    }, [getNextQuestion]);

    useEffect(() => {
        if (gameActive && timer > 0) {
            const interval = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
            return () => clearInterval(interval);
        } else if (timer === 0 && gameActive) {
            setGameActive(false);
            setGameOver(true);
        }
    }, [gameActive, timer]);

    const startGame = () => {
        setStars(0);
        const baseTimer = difficulty === 'Hard' ? GAME_CONSTANTS.TIMER.HARD : difficulty === 'Medium' ? GAME_CONSTANTS.TIMER.MEDIUM : GAME_CONSTANTS.TIMER.EASY;
        setTimer(baseTimer + (isMath ? 0 : 20));
        setStreak(0);
        setMaxStreak(0);
        setUsedIndices(new Set());
        setGameActive(true);
        setGameOver(false);
        setScoreSaved(false);
        setPlayerName('');
        generateQuestion();
    };

    const [isProcessing, setIsProcessing] = useState(false);

    const handleAnswer = (selected: string, correct?: string) => {
        if (!gameActive || feedback || isProcessing) return;

        setIsProcessing(true);
        const isCorrect = selected === correct || selected === String(correct);
        if (isCorrect) {
            const mult = difficulty === 'Hard' ? GAME_CONSTANTS.SCORE.MULTIPLIER.HARD : difficulty === 'Medium' ? GAME_CONSTANTS.SCORE.MULTIPLIER.MEDIUM : GAME_CONSTANTS.SCORE.MULTIPLIER.EASY;
            setStars(s => s + Math.floor((GAME_CONSTANTS.SCORE.BASE_POINTS + streak * GAME_CONSTANTS.SCORE.STREAK_BONUS) * mult));
            setStreak(s => { const n = s + 1; setMaxStreak(m => Math.max(m, n)); return n; });
            setFeedback({ correct: true, explanation: currentQ?.explanation });
        } else {
            setStreak(0);
            setFeedback({ correct: false, answer: correct, explanation: currentQ?.explanation });
        }
        setTimeout(() => {
            setFeedback(null);
            setIsProcessing(false);
            generateQuestion();
        }, GAME_CONSTANTS.FEEDBACK_DURATION);
    };

    const handleSaveScore = async () => {
        if (!playerName.trim()) return;
        await onGameEnd(gameId, playerName, stars, maxStreak);
        setScoreSaved(true);
    };

    return {
        gameState: {
            stars,
            timer,
            gameActive,
            gameOver,
            currentQ,
            streak,
            maxStreak,
            feedback,
            playerName,
            scoreSaved
        },
        setters: {
            setPlayerName
        },
        actions: {
            startGame,
            handleAnswer,
            handleSaveScore
        },
        data: {
            loading,
            error,
            questionsCount: questions.length
        }
    };
};
