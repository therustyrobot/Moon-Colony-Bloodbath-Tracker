import React, { useState } from 'react';
import { Users, Check, Sun, Moon, Rocket } from 'lucide-react';
import { Theme } from '../types';

interface MissionSetupModalProps {
  isOpen: boolean;
  onLaunch: (count: number, names: Record<number, string>) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const MissionSetupModal: React.FC<MissionSetupModalProps> = ({ isOpen, onLaunch, theme, setTheme }) => {
  const [playerCount, setPlayerCount] = useState(4);
  const [playerNames, setPlayerNames] = useState<Record<number, string>>({});

  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const modalBg = isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-gray-200';
  const textSecondary = isDark ? 'text-neutral-400' : 'text-gray-500';

  const handleNameChange = (id: number, val: string) => {
    setPlayerNames(prev => ({ ...prev, [id]: val }));
  };

  const getActiveIds = () => {
    if (playerCount === 4) return [2, 3, 1, 4]; // West, North, South, East
    if (playerCount === 3) return [2, 3, 1]; // West, North, South
    return [3, 1]; // North vs South (Head to Head)
  };

  const getLabelForId = (id: number) => {
    switch(id) {
        case 1: return "SOUTH (Home)";
        case 2: return "WEST (Left)";
        case 3: return "NORTH (Away)";
        case 4: return "EAST (Right)";
        default: return "Player";
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-300">
      <div className={`${modalBg} border w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-auto max-h-[95vh]`}>
        
        {/* Header */}
        <div className={`p-4 lg:p-6 border-b ${isDark ? 'border-neutral-800 bg-neutral-950' : 'border-gray-100 bg-gray-50'} flex items-center justify-between shrink-0`}>
            <div className="flex items-center gap-2 lg:gap-3 text-red-600">
                <Rocket className="w-6 h-6 lg:w-8 lg:h-8" />
                <h3 className="font-display text-lg lg:text-2xl font-bold tracking-wider">MISSION SETUP</h3>
            </div>
            
            {/* Theme Toggle */}
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-lg border transition-colors flex items-center gap-2 ${
                    isDark 
                    ? 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white' 
                    : 'border-gray-300 bg-white hover:bg-gray-50 text-black'
                }`}
            >
                {theme === 'dark' ? <Sun className="w-4 h-4 lg:w-5 lg:h-5 text-orange-500" /> : <Moon className="w-4 h-4 lg:w-5 lg:h-5 text-purple-500" />}
                <span className="text-xs font-bold hidden lg:inline">{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
            </button>
        </div>

        {/* Content */}
        <div className={`p-4 lg:p-8 flex-1 overflow-y-auto ${isDark ? 'text-white' : 'text-gray-800'}`}>
             
             {/* Player Count */}
             <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 opacity-80">
                    <Users className="w-5 h-5 text-blue-500" />
                    <label className="font-bold uppercase tracking-wider text-sm lg:text-base">Player Count</label>
                </div>
                <div className="flex bg-black/5 rounded-xl p-1 gap-1">
                    {[2, 3, 4].map(num => (
                        <button
                            key={num}
                            onClick={() => setPlayerCount(num)}
                            className={`flex-1 py-3 lg:py-4 rounded-lg text-sm lg:text-xl font-bold transition-all ${playerCount === num 
                                ? (isDark ? 'bg-neutral-700 text-white shadow-lg ring-1 ring-white/10' : 'bg-white text-black shadow-lg ring-1 ring-black/5') 
                                : 'text-neutral-500 hover:text-neutral-400'}`}
                        >
                            {num} Players
                        </button>
                    ))}
                </div>
             </div>

             {/* Player Names */}
             <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 opacity-80">
                    <Users className="w-5 h-5 text-green-500" />
                    <label className="font-bold uppercase tracking-wider text-sm lg:text-base">Crew Manifest (Optional)</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getActiveIds().map(id => (
                        <div key={id} className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary}`}>
                                    {getLabelForId(id)}
                                </span>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Enter Name..." 
                                value={playerNames[id] || ''}
                                onChange={(e) => handleNameChange(id, e.target.value)}
                                className={`w-full pl-28 pr-4 py-3 rounded-lg border font-bold tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                    isDark 
                                    ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-600' 
                                    : 'bg-white border-gray-300 text-black placeholder-gray-400'
                                }`}
                            />
                        </div>
                    ))}
                </div>
             </div>

             {/* Launch Button */}
             <div className="pt-2">
                <button 
                    onClick={() => onLaunch(playerCount, playerNames)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 lg:py-6 rounded-xl font-bold text-lg lg:text-2xl tracking-widest flex items-center justify-center gap-3 transition-colors shadow-lg active:scale-[0.98]"
                >
                    <Check className="w-6 h-6" /> LAUNCH MISSION
                </button>
                <p className={`text-[10px] lg:text-xs text-center mt-3 ${textSecondary}`}>
                    Resets all counters: 30 People, 4 Money, 4 Food.
                </p>
             </div>
        </div>
      </div>
    </div>
  );
};

export default MissionSetupModal;