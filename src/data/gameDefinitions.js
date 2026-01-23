// Game Definitions
// Centralized configuration for all games

export const MATH_GAMES = [
  {
    id: 'space-math',
    title: 'Space Math',
    icon: '🚀',
    color: 'from-orange-500 to-yellow-500',
    difficulty: 'Easy',
    description: 'Solve equations!'
  },
  {
    id: 'alien-invasion',
    title: 'Alien Invasion',
    icon: '👾',
    color: 'from-green-500 to-cyan-500',
    difficulty: 'Hard',
    description: 'Zap aliens!'
  },
  {
    id: 'bubble-pop',
    title: 'Bubble Pop',
    icon: '🫧',
    color: 'from-cyan-500 to-blue-500',
    difficulty: 'Easy',
    description: 'Pop answers!'
  },
  {
    id: 'planet-hopper',
    title: 'Planet Hopper',
    icon: '🪐',
    color: 'from-purple-500 to-pink-500',
    difficulty: 'Medium',
    description: 'Complete sequences!'
  },
  {
    id: 'fraction-frenzy',
    title: 'Fraction Frenzy',
    icon: '🍕',
    color: 'from-amber-500 to-orange-500',
    difficulty: 'Medium',
    description: 'Master fractions!'
  },
  {
    id: 'time-warp',
    title: 'Time Warp',
    icon: '⏰',
    color: 'from-blue-500 to-indigo-500',
    difficulty: 'Easy',
    description: 'Tell time!'
  },
  {
    id: 'money-master',
    title: 'Money Master',
    icon: '💰',
    color: 'from-green-500 to-emerald-500',
    difficulty: 'Medium',
    description: 'Count money!'
  },
  {
    id: 'geometry-galaxy',
    title: 'Geometry Galaxy',
    icon: '📐',
    color: 'from-pink-500 to-purple-500',
    difficulty: 'Medium',
    description: 'Learn shapes!'
  },
];

export const GRAMMAR_GAMES = [
  {
    id: 'grammar-galaxy',
    title: 'Grammar Galaxy',
    icon: '🛸',
    color: 'from-purple-500 to-indigo-500',
    difficulty: 'Medium',
    description: 'Fix grammar!'
  },
  {
    id: 'word-class-warp',
    title: 'Word Class Warp',
    icon: '🌟',
    color: 'from-pink-500 to-purple-500',
    difficulty: 'Easy',
    description: 'Sort words!'
  },
  {
    id: 'punctuation-pop',
    title: 'Punctuation Pop',
    icon: '✨',
    color: 'from-pink-500 to-rose-500',
    difficulty: 'Easy',
    description: 'Add punctuation!'
  },
  {
    id: 'tense-traveler',
    title: 'Tense Traveler',
    icon: '⏰',
    color: 'from-emerald-500 to-teal-500',
    difficulty: 'Medium',
    description: 'Verb tenses!'
  },
];

export const VOCABULARY_GAMES = [
  {
    id: 'synonym-stars',
    title: 'Synonym Stars',
    icon: '⭐',
    color: 'from-yellow-500 to-orange-500',
    difficulty: 'Easy',
    description: 'Find synonyms!'
  },
  {
    id: 'antonym-asteroids',
    title: 'Antonym Asteroids',
    icon: '☄️',
    color: 'from-red-500 to-orange-500',
    difficulty: 'Easy',
    description: 'Find opposites!'
  },
];

export const COMPREHENSION_GAMES = [
  {
    id: 'story-nebula',
    title: 'Story Nebula',
    icon: '📖',
    color: 'from-indigo-500 to-purple-500',
    difficulty: 'Medium',
    description: 'Read stories!'
  },
  {
    id: 'inference-investigator',
    title: 'Inference Investigator',
    icon: '🔍',
    color: 'from-violet-500 to-purple-500',
    difficulty: 'Hard',
    description: 'Make inferences!'
  },
];

export const ALL_GAMES = [
  ...MATH_GAMES,
  ...GRAMMAR_GAMES,
  ...VOCABULARY_GAMES,
  ...COMPREHENSION_GAMES
];

export const DEFAULT_SETTINGS = {
  mathSheetUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQr3nlml1JTPMR4ROfCKarFSayMFxYyOwZO-v_A0INlG1oMloM5wm0wltURipcy0A/pub?output=csv',
  englishSheetUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRses_Y74IwZ6nFvmwMygKruq0HgQZZmOEYSdf3sE0pInXXByyU0uSf8KPY8Z6Giw/pub?output=csv',
  selectedMathWorksheet: '1',
  selectedEnglishWorksheet: '1',
  defaultDifficulty: 'None',
  soundEnabled: true,
  leaderboardUrl: '',
  settingsSheetUrl: ''
};

export default {
  MATH_GAMES,
  GRAMMAR_GAMES,
  VOCABULARY_GAMES,
  COMPREHENSION_GAMES,
  ALL_GAMES,
  DEFAULT_SETTINGS,
};
