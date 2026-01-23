import React, { useState } from 'react';

interface SpaceBackgroundProps {
    children: React.ReactNode;
    variant?: string;
}

export const SpaceBackground: React.FC<SpaceBackgroundProps> = ({ children, variant = 'default' }) => {
    const [bubbles] = useState(() => Array.from({ length: 30 }, (_, i) => ({
        id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 3 + 1, duration: Math.random() * 3 + 2
    })));
    const gradients: Record<string, string> = {
        default: 'linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 50%, #4a2c7a 100%)',
        english: 'linear-gradient(180deg, #0a1628 0%, #1e3a5f 50%, #2d5a87 100%)',
        grammar: 'linear-gradient(180deg, #1a1a2e 0%, #2e1f5e 50%, #4a3c7a 100%)',
        vocabulary: 'linear-gradient(180deg, #1a2a1a 0%, #2e4e2e 50%, #3a6a3a 100%)',
        comprehension: 'linear-gradient(180deg, #0a2020 0%, #1e4a4a 50%, #2d6a6a 100%)',
        math: 'linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 50%, #4a2c7a 100%)'
    };
    return (
        <div className="relative w-full h-screen overflow-hidden" style={{ background: gradients[variant] || gradients['default'] }}>
            <div className="pointer-events-none absolute inset-0">
                {bubbles.map(bubble => (
                    <div key={bubble.id} className="absolute rounded-full bg-white opacity-60"
                        style={{ left: `${bubble.x}%`, top: `${bubble.y}%`, width: bubble.size, height: bubble.size, animation: `twinkle ${bubble.duration}s ease-in-out infinite` }} />
                ))}
            </div>
            <div className="relative z-10 h-full">{children}</div>
            <style>{`
        @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
      `}</style>
        </div>
    );
};
