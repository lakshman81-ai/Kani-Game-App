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

    const getSheetUrl = () => {
        if (settings.useGoogleSheets) {
            return isMath ? settings.mathSheetUrl : isSkill ? (settings.skillSheetUrl || settings.englishSheetUrl) : settings.englishSheetUrl;
        }
        // Local fallbacks
        return isMath ? 'MATH_GOOGLE_SHEET_DATA.csv' : isSkill ? 'SKILL_GAMES_DATA.csv' : 'ENGLISH_GOOGLE_SHEET_DATA.csv';
    };

    const sheetUrl = getSheetUrl();
    const { data: allQuestions, loading, error } = useSheetData(sheetUrl, gameId);

    const [stars, setStars] = useState(0);
    // Timer now counts UP
    const [timer, setTimer] = useState(0);
    const [gameActive, setGameActive] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [currentQ, setCurrentQ] = useState<Question | null>(null);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [playerName, setPlayerName] = useState('');
    const [scoreSaved, setScoreSaved] = useState(false);

    // New state for 10-question session
    const [questionsQueue, setQuestionsQueue] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);

    const filterQuestions = useCallback(() => {
        return allQuestions.filter(q => !q.difficulty || q.difficulty === difficulty || difficulty === 'None');
    }, [allQuestions, difficulty]);

    // Shuffle array helper
    const shuffleArray = <T,>(array: T[]): T[] => {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    };

    useEffect(() => {
        // Timer counts UP when game is active
        if (gameActive && !gameOver) {
            const interval = setInterval(() => setTimer(t => t + 1), 1000);
            return () => clearInterval(interval);
        }
    }, [gameActive, gameOver]);

    const startGame = () => {
        setStars(0);
        setTimer(0); // Start from 0
        setStreak(0);
        setMaxStreak(0);
        setGameActive(true);
        setGameOver(false);
        setScoreSaved(false);
        setPlayerName('');

        // Prepare session questions
        const filtered = filterQuestions();
        const shuffled = shuffleArray(filtered);
        const session = shuffled.slice(0, 10); // Take top 10

        setQuestionsQueue(session);
        setTotalQuestions(session.length);
        setCurrentIndex(0);

        if (session.length > 0) {
            setCurrentQ(session[0]);
        } else {
            // Handle no questions case
            setGameActive(false);
        }
    };

    const [isProcessing, setIsProcessing] = useState(false);

    const handleAnswer = (selected: string, correct?: string) => {
        if (!gameActive || feedback || isProcessing) return;

        setIsProcessing(true);
        const isCorrect = selected === correct || selected === String(correct);

        // Calculate points
        if (isCorrect) {
            const mult = difficulty === 'Hard' ? GAME_CONSTANTS.SCORE.MULTIPLIER.HARD : difficulty === 'Medium' ? GAME_CONSTANTS.SCORE.MULTIPLIER.MEDIUM : GAME_CONSTANTS.SCORE.MULTIPLIER.EASY;
            setStars(s => s + Math.floor((GAME_CONSTANTS.SCORE.BASE_POINTS + streak * GAME_CONSTANTS.SCORE.STREAK_BONUS) * mult));
            setStreak(s => { const n = s + 1; setMaxStreak(m => Math.max(m, n)); return n; });
            setFeedback({ correct: true, explanation: currentQ?.explanation });
        } else {
            setStreak(0);
            setFeedback({ correct: false, answer: correct, explanation: currentQ?.explanation });
        }

        // Delay for feedback then move to next question
        setTimeout(() => {
            setFeedback(null);
            setIsProcessing(false);

            const nextIndex = currentIndex + 1;
            if (nextIndex < questionsQueue.length) {
                setCurrentIndex(nextIndex);
                setCurrentQ(questionsQueue[nextIndex]);
            } else {
                // Game Over
                setGameActive(false);
                setGameOver(true);
            }
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
            scoreSaved,
            currentIndex, // Expose for UI "1/10"
            totalQuestions // Expose for UI "1/10"
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
            questionsCount: filterQuestions().length
        }
    };
};
