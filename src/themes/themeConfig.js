// Theme Configuration for Learning Galaxy
// Centralized colors, gradients, and visual styling

export const THEME_COLORS = {
  // Subject themes
  math: {
    primary: '#4a2c7a',
    secondary: '#2d1b4e',
    background: 'linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 50%, #4a2c7a 100%)',
    accent: '#fbbf24',
  },
  english: {
    primary: '#2d5a87',
    secondary: '#1e3a5f',
    background: 'linear-gradient(180deg, #0a1628 0%, #1e3a5f 50%, #2d5a87 100%)',
    accent: '#60a5fa',
  },
  grammar: {
    primary: '#4a3c7a',
    secondary: '#2e1f5e',
    background: 'linear-gradient(180deg, #1a1a2e 0%, #2e1f5e 50%, #4a3c7a 100%)',
    accent: '#a78bfa',
  },
  vocabulary: {
    primary: '#3a6a3a',
    secondary: '#2e4e2e',
    background: 'linear-gradient(180deg, #1a2a1a 0%, #2e4e2e 50%, #3a6a3a 100%)',
    accent: '#4ade80',
  },
  comprehension: {
    primary: '#2d6a6a',
    secondary: '#1e4a4a',
    background: 'linear-gradient(180deg, #0a2020 0%, #1e4a4a 50%, #2d6a6a 100%)',
    accent: '#22d3ee',
  },
  default: {
    primary: '#4a2c7a',
    secondary: '#2d1b4e',
    background: 'linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 50%, #4a2c7a 100%)',
    accent: '#fbbf24',
  },
};

// Game-specific color schemes with unique styling per game
export const GAME_THEMES = {
  // Math games
  'space-math': {
    gradient: 'from-orange-500 to-yellow-500',
    buttonBg: 'bg-gradient-to-r from-orange-500 to-yellow-500',
    cardBg: 'bg-orange-900/30',
    accentColor: 'text-orange-400',
    borderColor: 'border-orange-500',
    glowColor: 'shadow-orange-500/50',
  },
  'alien-invasion': {
    gradient: 'from-green-500 to-cyan-500',
    buttonBg: 'bg-gradient-to-r from-green-500 to-cyan-500',
    cardBg: 'bg-green-900/30',
    accentColor: 'text-green-400',
    borderColor: 'border-green-500',
    glowColor: 'shadow-green-500/50',
  },
  'bubble-pop': {
    gradient: 'from-cyan-500 to-blue-500',
    buttonBg: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    cardBg: 'bg-cyan-900/30',
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-500',
    glowColor: 'shadow-cyan-500/50',
  },
  'planet-hopper': {
    gradient: 'from-purple-500 to-pink-500',
    buttonBg: 'bg-gradient-to-r from-purple-500 to-pink-500',
    cardBg: 'bg-purple-900/30',
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500',
    glowColor: 'shadow-purple-500/50',
  },
  'fraction-frenzy': {
    gradient: 'from-amber-500 to-orange-500',
    buttonBg: 'bg-gradient-to-r from-amber-500 to-orange-500',
    cardBg: 'bg-amber-900/30',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500',
    glowColor: 'shadow-amber-500/50',
  },
  'time-warp': {
    gradient: 'from-blue-500 to-indigo-500',
    buttonBg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    cardBg: 'bg-blue-900/30',
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-500',
    glowColor: 'shadow-blue-500/50',
  },
  'money-master': {
    gradient: 'from-green-500 to-emerald-500',
    buttonBg: 'bg-gradient-to-r from-green-500 to-emerald-500',
    cardBg: 'bg-emerald-900/30',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500',
    glowColor: 'shadow-emerald-500/50',
  },
  'geometry-galaxy': {
    gradient: 'from-pink-500 to-purple-500',
    buttonBg: 'bg-gradient-to-r from-pink-500 to-purple-500',
    cardBg: 'bg-pink-900/30',
    accentColor: 'text-pink-400',
    borderColor: 'border-pink-500',
    glowColor: 'shadow-pink-500/50',
  },

  // Grammar games
  'grammar-galaxy': {
    gradient: 'from-purple-500 to-indigo-500',
    buttonBg: 'bg-gradient-to-r from-purple-600 to-indigo-600',
    cardBg: 'bg-indigo-900/30',
    accentColor: 'text-indigo-400',
    borderColor: 'border-indigo-500',
    glowColor: 'shadow-indigo-500/50',
  },
  'word-class-warp': {
    gradient: 'from-pink-500 to-purple-500',
    buttonBg: 'bg-gradient-to-r from-pink-500 to-purple-500',
    cardBg: 'bg-purple-900/30',
    accentColor: 'text-pink-400',
    borderColor: 'border-pink-500',
    glowColor: 'shadow-pink-500/50',
  },
  'punctuation-pop': {
    gradient: 'from-pink-500 to-rose-500',
    buttonBg: 'bg-gradient-to-b from-pink-400 to-rose-500',
    cardBg: 'bg-rose-900/30',
    accentColor: 'text-rose-400',
    borderColor: 'border-rose-500',
    glowColor: 'shadow-rose-500/50',
  },
  'tense-traveler': {
    gradient: 'from-emerald-500 to-teal-500',
    buttonBg: 'bg-gradient-to-r from-teal-600 to-emerald-600',
    cardBg: 'bg-teal-900/30',
    accentColor: 'text-teal-400',
    borderColor: 'border-teal-500',
    glowColor: 'shadow-teal-500/50',
  },

  // Vocabulary games
  'synonym-stars': {
    gradient: 'from-yellow-500 to-orange-500',
    buttonBg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    cardBg: 'bg-yellow-900/30',
    accentColor: 'text-yellow-400',
    borderColor: 'border-yellow-500',
    glowColor: 'shadow-yellow-500/50',
  },
  'antonym-asteroids': {
    gradient: 'from-red-500 to-orange-500',
    buttonBg: 'bg-gradient-to-r from-red-500 to-orange-500',
    cardBg: 'bg-red-900/30',
    accentColor: 'text-red-400',
    borderColor: 'border-red-500',
    glowColor: 'shadow-red-500/50',
  },
  'word-wizard': {
    gradient: 'from-indigo-500 to-blue-500',
    buttonBg: 'bg-gradient-to-r from-indigo-500 to-blue-500',
    cardBg: 'bg-indigo-900/30',
    accentColor: 'text-indigo-300',
    borderColor: 'border-indigo-400',
    glowColor: 'shadow-indigo-500/50',
  },
  'root-raider': {
    gradient: 'from-green-600 to-teal-500',
    buttonBg: 'bg-gradient-to-r from-green-600 to-teal-500',
    cardBg: 'bg-green-900/30',
    accentColor: 'text-green-300',
    borderColor: 'border-green-400',
    glowColor: 'shadow-green-500/50',
  },
  'idiom-island': {
    gradient: 'from-orange-500 to-yellow-400',
    buttonBg: 'bg-gradient-to-r from-orange-500 to-yellow-400',
    cardBg: 'bg-orange-900/30',
    accentColor: 'text-orange-300',
    borderColor: 'border-orange-400',
    glowColor: 'shadow-orange-500/50',
  },
  'homophone-hunt': {
    gradient: 'from-pink-500 to-red-400',
    buttonBg: 'bg-gradient-to-r from-pink-500 to-red-400',
    cardBg: 'bg-pink-900/30',
    accentColor: 'text-pink-300',
    borderColor: 'border-pink-400',
    glowColor: 'shadow-pink-500/50',
  },

  // Comprehension games - Enhanced with unique themes
  'story-nebula': {
    gradient: 'from-indigo-500 to-purple-500',
    buttonBg: 'bg-gradient-to-r from-teal-600 to-cyan-600',
    cardBg: 'bg-gradient-to-br from-teal-900/40 to-cyan-900/40',
    accentColor: 'text-teal-300',
    borderColor: 'border-teal-400',
    glowColor: 'shadow-teal-500/50',
    storyTitleColor: 'text-yellow-300',
    questionBg: 'bg-teal-800/60',
  },
  'inference-investigator': {
    gradient: 'from-violet-500 to-purple-500',
    buttonBg: 'bg-gradient-to-r from-violet-600 to-purple-600',
    cardBg: 'bg-gradient-to-br from-violet-900/40 to-purple-900/40',
    accentColor: 'text-violet-300',
    borderColor: 'border-violet-400',
    glowColor: 'shadow-violet-500/50',
    magnifyingGlass: '🔎',
    questionBg: 'bg-violet-800/60',
  },
};

// Icon library
export const ICONS = {
  games: {
    'space-math': '🚀',
    'alien-invasion': '👾',
    'bubble-pop': '🫧',
    'planet-hopper': '🪐',
    'fraction-frenzy': '🍕',
    'time-warp': '⏰',
    'money-master': '💰',
    'geometry-galaxy': '📐',
    'grammar-galaxy': '🛸',
    'word-class-warp': '🌟',
    'punctuation-pop': '✨',
    'tense-traveler': '⏰',
    'synonym-stars': '⭐',
    'antonym-asteroids': '☄️',
    'story-nebula': '📖',
    'inference-investigator': '🔍',
  },
  wordClass: {
    noun: '📦',
    verb: '🏃',
    adjective: '🎨',
    adverb: '⚡',
  },
  tense: {
    past: '⏪',
    present: '▶️',
    future: '⏩',
  },
  ui: {
    star: '⭐',
    settings: '⚙️',
    back: '←',
    home: '🏠',
    leaderboard: '🏆',
    analytics: '📊',
    lock: '🔒',
    save: '💾',
    reset: '🔄',
  },
  subjects: {
    math: '🔢',
    english: '📚',
    grammar: '✏️',
    vocabulary: '📖',
    comprehension: '🔍',
  },
  decorative: {
    rocket: '🚀',
    star: '⭐',
    earth: '🌍',
    spaceship: '🛸',
    sparkle: '💫',
    glowStar: '🌟',
  },
};

// Difficulty color schemes
export const DIFFICULTY_COLORS = {
  Easy: {
    bg: 'bg-green-500',
    text: 'text-green-400',
    border: 'border-green-500',
    gradient: 'from-green-500 to-green-600',
  },
  Medium: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-400',
    border: 'border-yellow-500',
    gradient: 'from-yellow-500 to-orange-500',
  },
  Hard: {
    bg: 'bg-red-500',
    text: 'text-red-400',
    border: 'border-red-500',
    gradient: 'from-red-500 to-red-600',
  },
};

// Typography configuration
export const TYPOGRAPHY = {
  headings: {
    h1: 'text-4xl md:text-5xl font-bold',
    h2: 'text-3xl md:text-4xl font-bold',
    h3: 'text-2xl md:text-3xl font-bold',
    h4: 'text-xl md:text-2xl font-bold',
  },
  body: {
    large: 'text-lg md:text-xl',
    medium: 'text-base md:text-lg',
    small: 'text-sm md:text-base',
    tiny: 'text-xs md:text-sm',
  },
  question: {
    title: 'text-2xl md:text-4xl font-bold',
    description: 'text-sm md:text-base',
    option: 'text-lg md:text-2xl font-bold',
  },
};

// Animation keyframes
export const ANIMATIONS = `
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 5px currentColor; }
    50% { box-shadow: 0 0 20px currentColor; }
  }
`;

export default {
  THEME_COLORS,
  GAME_THEMES,
  ICONS,
  DIFFICULTY_COLORS,
  TYPOGRAPHY,
  ANIMATIONS,
};
