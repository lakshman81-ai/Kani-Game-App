import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Settings, LeaderboardEntry } from '../types';

// Default settings
const DEFAULT_SETTINGS: Settings = {
    mathSheetUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQr3nlml1JTPMR4ROfCKarFSayMFxYyOwZO-v_A0INlG1oMloM5wm0wltURipcy0A/pub?output=csv',
    englishSheetUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRses_Y74IwZ6nFvmwMygKruq0HgQZZmOEYSdf3sE0pInXXByyU0uSf8KPY8Z6Giw/pub?output=csv',
    topicSheetUrl: '',
    selectedTopics: '',
    selectedSubtopics: '',
    selectedMathWorksheet: '1',
    selectedEnglishWorksheet: '1',
    defaultDifficulty: 'None',
    difficultyFilterEnabled: false,
    soundEnabled: true,
    leaderboardUrl: '',
    settingsSheetUrl: '',
    enabledGames: {},
    generatorGrade: 'Grade 3',
    generatorDifficulty: 'Easy'
};

// Storage helper
const storage = {
    get: async (key: string) => {
        try {
            if (window.storage?.get) return await window.storage.get(key);
            const value = localStorage.getItem(key);
            return value ? { value } : null;
        } catch (e) { return null; }
    },
    set: async (key: string, value: string) => {
        try {
            if (window.storage?.set) return await window.storage.set(key, value);
            localStorage.setItem(key, value);
        } catch (e) { }
    }
};

interface AppContextType {
    settings: Settings;
    updateSettings: (newSettings: Settings) => Promise<void>;
    leaderboard: LeaderboardEntry[];
    addLeaderboardEntry: (entry: LeaderboardEntry) => Promise<void>;
    loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load Settings
                const settingsData = await storage.get('learning-galaxy-settings');
                if (settingsData?.value) {
                    setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(settingsData.value) });
                }

                // Load Leaderboard
                const leaderboardData = await storage.get('learning-galaxy-leaderboard');
                if (leaderboardData?.value) {
                    setLeaderboard(JSON.parse(leaderboardData.value));
                }
            } catch (e) {
                console.error('Failed to load data', e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const updateSettings = async (newSettings: Settings) => {
        setSettings(newSettings);
        await storage.set('learning-galaxy-settings', JSON.stringify(newSettings));
    };

    const addLeaderboardEntry = async (entry: LeaderboardEntry) => {
        const updated = [...leaderboard, entry];
        setLeaderboard(updated);
        await storage.set('learning-galaxy-leaderboard', JSON.stringify(updated));
    };

    const value = useMemo(() => ({
        settings,
        updateSettings,
        leaderboard,
        addLeaderboardEntry,
        loading
    }), [settings, leaderboard, loading]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
