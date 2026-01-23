import { useState, useEffect } from 'react';
import { Question } from '../types';
import { parseCSV } from '../utils/csvParser';

export const useSheetData = (url: string, gameType: string) => {
    const [data, setData] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!url) { setLoading(false); return; }
        setLoading(true);
        fetch(url)
            .then(res => res.text())
            .then(csv => {
                const parsed = parseCSV(csv);
                const filtered = gameType ? parsed.filter(row => row.game_type === gameType) : parsed;
                setData(filtered);
                setLoading(false);
            })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [url, gameType]);

    return { data, loading, error };
};

