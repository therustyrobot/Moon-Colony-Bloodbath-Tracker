
import React, { useState, useEffect } from 'react';
import { Settings, X, BookOpen, Users, Play, Moon, Sun } from 'lucide-react';
import { Theme } from '../types';

interface CenterHubProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
  onNewGame: (count: number) => void;
  forceOpen?: boolean;
  onCloseSetup?: () => void;
}

const CenterHub: React.FC<CenterHubProps> = ({ theme, setTheme, onNewGame, forceOpen = false, onCloseSetup }) => {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [activeTab, setActiveTab] = useState<'options' | 'quickstart'>('options');
  const [playerCount, setPlayerCount] = useState(4);

  useEffect(() => {
    if (forceOpen) {
        setIsOpen(true);
        setActiveTab('options');
    }
  }, [forceOpen]);

  const handleClose = () => {
      setIsOpen(false);
      if (onCloseSetup) onCloseSetup();
  };

  const handleStartGame = () => {
      onNewGame(playerCount);
      handleClose();
  };

  const isDark = theme === 'dark';
  const modalBg = isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-neutral-400' : 'text-gray-500';

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 group"
      >
        <div className="relative flex items-center justify-center">
            {/* Pulsing effect */}
            <div className="absolute inset-0 bg-red-600 rounded-full blur-xl opacity-20 group-hover:opacity-40 animate-pulse transition-opacity duration-500" />
            
            {/* Oval Shape */}
            <div className="bg-neutral-950 border-2 border-red-900/50 px-8 py-4 flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer min-w-[160px]">
                <span className="font-display font-bold text-red-500 tracking-widest text-xl">
                    OPTIONS
                </span>
            </div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4">
      <div className={`${modalBg} border w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] transition-colors`}>
        
        {/* Header */}
        <div className={`p-6 border-b ${isDark ? 'border-neutral-800 bg-neutral-950' : 'border-gray-100 bg-gray-50'} flex items-center justify-between shrink-0`}>
            <div className="flex items-center gap-3 text-red-600">
                <Settings className="w-8 h-8" />
                <h3 className="font-display text-2xl font-bold tracking-wider">GAME MENU</h3>
            </div>
            <button 
                onClick={handleClose}
                className={`p-2 rounded-full ${textSecondary} hover:bg-black/5`}
            >
                <X className="w-8 h-8" />
            </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b shrink-0 ${isDark ? 'border-neutral-800' : 'border-gray-200'}`}>
            <button 
                onClick={() => setActiveTab('options')}
                className={`flex-1 py-6 text-lg font-bold tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'options' ? (isDark ? 'bg-neutral-800 text-white' : 'bg-gray-100 text-black') : textSecondary}`}
            >
                <Settings className="w-6 h-6" /> SETUP
            </button>
            <button 
                onClick={() => setActiveTab('quickstart')}
                className={`flex-1 py-6 text-lg font-bold tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'quickstart' ? (isDark ? 'bg-neutral-800 text-cyan-400' : 'bg-cyan-50 text-cyan-600') : textSecondary}`}
            >
                <BookOpen className="w-6 h-6" /> QUICKSTART
            </button>
        </div>

        {/* Content */}
        <div className={`p-6 sm:p-8 flex-1 overflow-y-auto ${isDark ? 'text-white' : 'text-gray-800'}`}>
            
            {/* === OPTIONS TAB === */}
            {activeTab === 'options' && (
                <div className="space-y-10">
                    {/* Setup New Game */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 opacity-80">
                            <Users className="w-8 h-8 text-blue-500" />
                            <h4 className="font-bold uppercase tracking-wider text-xl">New Game Setup</h4>
                        </div>
                        
                        <div className="flex bg-black/5 rounded-xl p-2 border border-black/5 gap-2">
                            {[2, 3, 4].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setPlayerCount(num)}
                                    className={`flex-1 py-4 rounded-lg text-lg sm:text-xl font-bold transition-all ${playerCount === num 
                                        ? (isDark ? 'bg-neutral-700 text-white shadow-lg' : 'bg-white text-black shadow-lg') 
                                        : 'text-neutral-500 hover:text-neutral-400'}`}
                                >
                                    {num} PLAYERS
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={handleStartGame}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl font-bold text-xl tracking-widest flex items-center justify-center gap-3 transition-colors shadow-lg active:scale-[0.98]"
                        >
                            <Play className="w-6 h-6 fill-current" /> START NEW GAME
                        </button>
                        <p className={`text-sm text-center ${textSecondary}`}>
                            Resets all resources to: 30 People, 4 Money, 4 Food.
                        </p>
                    </div>

                    <div className={`h-px ${isDark ? 'bg-neutral-800' : 'bg-gray-200'}`} />

                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between py-2">
                         <div className="flex items-center gap-3 opacity-80">
                            {theme === 'dark' ? <Moon className="w-8 h-8 text-purple-400" /> : <Sun className="w-8 h-8 text-orange-500" />}
                            <h4 className="font-bold uppercase tracking-wider text-xl">Visual Theme</h4>
                        </div>
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className={`px-6 py-4 rounded-xl text-lg font-bold border transition-colors ${
                                isDark 
                                ? 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white' 
                                : 'border-gray-300 bg-white hover:bg-gray-50 text-black'
                            }`}
                        >
                            SWITCH TO {theme === 'dark' ? 'LIGHT' : 'DARK'}
                        </button>
                    </div>
                </div>
            )}

            {/* === QUICKSTART TAB === */}
            {activeTab === 'quickstart' && (
                <div className="space-y-8 pb-8 font-sans">
                   
                   {/* GLOBAL */}
                   <div className={`${isDark ? 'bg-neutral-800/50' : 'bg-white'} p-6 rounded-2xl border ${isDark ? 'border-neutral-700' : 'border-gray-200'}`}>
                        <h2 className="text-xl font-display font-bold mb-3 text-cyan-600 tracking-wider">GLOBAL</h2>
                        <ul className="list-disc pl-5 space-y-2 opacity-90 leading-relaxed">
                            <li><strong>Create Progress deck:</strong> draw 2x Twist faceup, add Starting Cards.</li>
                            <li><strong>Place decks:</strong> Developments, Events and (with token) &#123;Twist & Robot&#125;.</li>
                        </ul>
                   </div>

                   {/* PLAYER */}
                   <div className={`${isDark ? 'bg-neutral-800/50' : 'bg-white'} p-6 rounded-2xl border ${isDark ? 'border-neutral-700' : 'border-gray-200'}`}>
                        <h2 className="text-xl font-display font-bold mb-3 text-blue-500 tracking-wider">PLAYER</h2>
                        <p className="opacity-90 leading-relaxed">
                            Take Playmat & matching Perk cards, 4 (Action) Chits, <span className="font-bold text-blue-500">30 People</span>, <span className="font-bold text-yellow-500">4 Money</span> & <span className="font-bold text-green-500">4 Food</span>. Draw 4 Building cards.
                        </p>
                   </div>

                   {/* TURN */}
                   <div className={`${isDark ? 'bg-neutral-800/50' : 'bg-white'} p-6 rounded-2xl border ${isDark ? 'border-neutral-700' : 'border-gray-200'}`}>
                        <h2 className="text-xl font-display font-bold mb-3 text-purple-500 tracking-wider">TURN</h2>
                        <ul className="list-disc pl-5 space-y-2 opacity-90 leading-relaxed">
                            <li>Draw card from Progress deck, all players resolve the card if applicable to them. (if there are no more cards to draw, shuffle discard pile and place it face down to form the new deck)</li>
                            <li>Add 2+ cards to Progress deck: shuffle them facedown beforehand.</li>
                        </ul>
                   </div>

                   {/* WORK */}
                   <div className={`${isDark ? 'bg-neutral-800/50' : 'bg-white'} p-6 rounded-2xl border ${isDark ? 'border-neutral-700' : 'border-gray-200'}`}>
                        <h2 className="text-xl font-display font-bold mb-3 text-orange-500 tracking-wider">WORK</h2>
                        <p className="mb-3 opacity-90">(1) Put Chit on action, resolve it, and (2) Move Chit to center slot.</p>
                        <div className="grid gap-2 pl-4">
                            <p className="opacity-90"><strong className="text-orange-500">(a) Restock:</strong> Gain 2x Box, put on any Building(s).</p>
                            <p className="opacity-90"><strong className="text-orange-500">(b) Build:</strong> Pay Money cost, play card (resolve PLAY effect).</p>
                            <p className="opacity-90"><strong className="text-orange-500">(c) Mine / Farm / Research:</strong> Gain 4x Money / 4x Food / 2x Building.</p>
                        </div>
                        <p className="mt-4 italic opacity-70 text-sm">Buildings can modify your actions.</p>
                   </div>

                   {/* GAME END */}
                   <div className={`${isDark ? 'bg-neutral-800/50' : 'bg-white'} p-6 rounded-2xl border ${isDark ? 'border-neutral-700' : 'border-gray-200'}`}>
                        <h2 className="text-xl font-display font-bold mb-3 text-red-500 tracking-wider">GAME END</h2>
                        <p className="opacity-90 leading-relaxed">
                            Games ends immediately when a player is eliminated or by resolving Instruction Manual. Player with most People wins.
                        </p>
                   </div>

                   {/* MISC */}
                   <div className={`${isDark ? 'bg-neutral-800/50' : 'bg-white'} p-6 rounded-2xl border ${isDark ? 'border-neutral-700' : 'border-gray-200'}`}>
                        <h2 className="text-xl font-display font-bold mb-3 text-gray-500 tracking-wider">MISC</h2>
                        <ul className="list-disc pl-5 space-y-2 opacity-90 leading-relaxed">
                            <li>Perks only affect card's owner.</li>
                            <li>
                                <strong>Losing People:</strong> &#123;1&#125; Lose from playmat, if needed &#123;2&#125; Discard Buildings to gain their People and &#123;3&#125; if you still can't lose required amount you're eliminated (game end is triggered).
                            </li>
                            <li><strong>Limit:</strong> can only spend 1x Box to trigger a card's effect.</li>
                        </ul>
                   </div>

                   {/* VARIANTS */}
                   <div className={`${isDark ? 'bg-neutral-800/50' : 'bg-white'} p-6 rounded-2xl border ${isDark ? 'border-neutral-700' : 'border-gray-200'}`}>
                        <h2 className="text-xl font-display font-bold mb-3 text-green-500 tracking-wider">VARIANTS</h2>
                        <p className="opacity-90 leading-relaxed">
                            <strong>1 Player:</strong> Add Loneliness card to Progress Deck during setup. Goal is &#123;a&#125; to reach Instruction Manual (or score is highest numbered Event reached), or &#123;b&#125; instead of adding Instruction Manual, add Robots (score is number of extra Robots reached).
                        </p>
                   </div>

                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CenterHub;
