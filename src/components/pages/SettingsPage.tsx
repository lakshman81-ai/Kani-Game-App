import React, { useState } from 'react';
import { SpaceBackground } from '../shared/SpaceBackground';
import { Settings, Difficulty } from '../../types';
import { DEFAULT_SETTINGS } from '../../data/gameDefinitions';

interface SettingsPageProps {
    settings: Settings;
    setSettings: (settings: Settings) => void;
    onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ settings, setSettings, onBack }) => {
    const [localSettings, setLocalSettings] = useState(settings);
    const [password, setPassword] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [error, setError] = useState('');

    const SETTINGS_PASSWORD = 'Superdad';

    const handleUnlock = () => {
        if (password === SETTINGS_PASSWORD) {
            setIsUnlocked(true);
            setError('');
        } else {
            setError('Incorrect password');
            setPassword('');
        }
    };

    const validateGoogleSheetUrl = (url: string) => {
        if (!url || !url.trim()) return 'URL is required';
        const googleSheetsPattern = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/(e\/)?[\w-]+\/pub\?output=csv/;
        if (!googleSheetsPattern.test(url)) {
            return 'Invalid Google Sheets URL. Must be a published CSV link (File → Share → Publish to web → CSV)';
        }
        return '';
    };

    const handleSave = async () => {
        setSettings(localSettings);

        // Save to Google Sheet if URL is provided
        if (localSettings.settingsSheetUrl && localSettings.settingsSheetUrl.trim()) {
            try {
                const settingsData = {
                    timestamp: new Date().toISOString(),
                    mathSheetUrl: localSettings.mathSheetUrl,
                    englishSheetUrl: localSettings.englishSheetUrl,
                    defaultDifficulty: localSettings.defaultDifficulty,
                    soundEnabled: localSettings.soundEnabled,
                    leaderboardUrl: localSettings.leaderboardUrl || '',
                    settingsSheetUrl: localSettings.settingsSheetUrl || ''
                };

                await fetch(localSettings.settingsSheetUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(settingsData)
                });
                console.log('Settings saved to Google Sheet');
            } catch (e) {
                console.error('Failed to save settings to Google Sheet:', e);
            }
        }

        onBack();
    };

    const handleReset = () => {
        setLocalSettings(DEFAULT_SETTINGS);
    };

    const isValid = !validateGoogleSheetUrl(localSettings.mathSheetUrl) && !validateGoogleSheetUrl(localSettings.englishSheetUrl);

    if (!isUnlocked) {
        return (
            <SpaceBackground>
                <div className="flex flex-col items-center justify-center h-full px-4">
                    <button onClick={onBack} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gray-900/80 flex items-center justify-center text-white hover:bg-gray-700 z-20 cursor-pointer">←</button>
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-3xl font-bold text-white mb-2">Settings Locked</h1>
                    <p className="text-purple-300 mb-6 text-sm">Enter password to access settings</p>
                    <div className="w-full max-w-xs relative z-20">
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none mb-3"
                        />
                        {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}
                        <button onClick={handleUnlock} className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform cursor-pointer">
                            Unlock
                        </button>
                    </div>
                </div>
            </SpaceBackground>
        );
    }

    return (
        <SpaceBackground>
            <div className="flex flex-col items-center h-full px-4 py-8 overflow-y-auto">
                <button onClick={onBack} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gray-900/80 flex items-center justify-center text-white hover:bg-gray-700 z-20 cursor-pointer">←</button>
                <h1 className="text-4xl font-bold text-white mb-8 pt-8">⚙️ Settings</h1>
                <div className="w-full max-w-lg space-y-6 relative z-20">
                    <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur">
                        <h2 className="text-xl font-bold text-white mb-4">🔢 Math Questions Sheet</h2>
                        <textarea value={localSettings.mathSheetUrl} onChange={(e) => setLocalSettings({ ...localSettings, mathSheetUrl: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none text-xs font-mono resize-none" rows={3} />
                    </div>
                    <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur">
                        <h2 className="text-xl font-bold text-white mb-4">📚 English Questions Sheet</h2>
                        <textarea value={localSettings.englishSheetUrl} onChange={(e) => setLocalSettings({ ...localSettings, englishSheetUrl: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none text-xs font-mono resize-none" rows={3} />
                    </div>
                    <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur">
                        <h2 className="text-xl font-bold text-white mb-4">🎯 Default Difficulty</h2>
                        <p className="text-gray-400 text-sm mb-4">Choose "None" to let kids pick difficulty each game</p>
                        <select value={localSettings.defaultDifficulty} onChange={(e) => setLocalSettings({ ...localSettings, defaultDifficulty: e.target.value as Difficulty })}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 cursor-pointer">
                            <option value="None">None (Choose per game)</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                        <p className="text-gray-400 text-xs mt-2">When "None" is selected, you can choose difficulty before each game. Otherwise, only the selected difficulty will be available.</p>
                    </div>
                    <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur">
                        <h2 className="text-xl font-bold text-white mb-4">📊 Leaderboard Integration</h2>
                        <p className="text-gray-400 text-sm mb-4">Paste Google Apps Script Web App URL to save scores online</p>
                        <input type="text" placeholder="https://script.google.com/macros/s/..." value={localSettings.leaderboardUrl || ''} onChange={(e) => setLocalSettings({ ...localSettings, leaderboardUrl: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none" />
                    </div>
                    <div className="bg-gray-900/80 rounded-2xl p-6 backdrop-blur">
                        <h2 className="text-xl font-bold text-white mb-4">⚙️ Settings Backup to Google Sheet</h2>
                        <p className="text-gray-400 text-sm mb-4">Paste Google Apps Script Web App URL to save settings to Google Sheets</p>
                        <input type="text" placeholder="https://script.google.com/macros/s/..." value={localSettings.settingsSheetUrl || ''} onChange={(e) => setLocalSettings({ ...localSettings, settingsSheetUrl: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none" />
                        <p className="text-gray-400 text-xs mt-2">💡 When configured, all settings changes will be saved to your Google Sheet</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleReset} className="flex-1 bg-gray-600 text-white px-6 py-4 rounded-full text-lg font-bold hover:bg-gray-500 transition-colors cursor-pointer">🔄 Reset</button>
                        <button onClick={handleSave} disabled={!isValid}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                            💾 Save
                        </button>
                    </div>
                    <button onClick={handleSave} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-lg cursor-pointer">💾 Save Settings</button>
                </div>
            </div>
        </SpaceBackground>
    );
};
