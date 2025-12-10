
import React from 'react';
import { Plus, Minus, User, Apple } from 'lucide-react';
import { Player, ResourceType, Theme } from '../types';

interface PlayerQuadrantProps {
  player: Player;
  onUpdateResource: (playerId: number, resource: ResourceType, delta: number) => void;
  className?: string;
  theme: Theme;
}

const MoneyIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4 20h16" />
    <path d="M4 16V8l8 5 8-5v8" />
  </svg>
);

const PlayerQuadrant: React.FC<PlayerQuadrantProps> = ({ player, onUpdateResource, className, theme }) => {
  const rotationStyle: React.CSSProperties = {
    transform: `rotate(${player.rotation}deg)`,
  };

  // Configurations based on theme
  const getResourceConfig = (resType: ResourceType) => {
    const isDark = theme === 'dark';
    switch (resType) {
        case 'people':
            return {
                icon: <User className="w-6 h-6 sm:w-8 sm:h-8" />,
                label: 'PEOPLE',
                color: isDark ? 'text-blue-400' : 'text-blue-600',
                bg: isDark ? 'bg-blue-950/20' : 'bg-blue-50',
                border: isDark ? 'border-white/5' : 'border-blue-200',
                text: isDark ? 'text-white' : 'text-blue-900',
                btnHover: isDark ? 'hover:bg-blue-900/30' : 'hover:bg-blue-100',
                btnBg: isDark ? 'bg-black/20' : 'bg-blue-100/50'
            };
        case 'money':
            return {
                icon: <MoneyIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
                label: 'MONEY',
                color: isDark ? 'text-yellow-400' : 'text-yellow-600',
                bg: isDark ? 'bg-yellow-950/20' : 'bg-yellow-50',
                border: isDark ? 'border-white/5' : 'border-yellow-200',
                text: isDark ? 'text-white' : 'text-yellow-900',
                btnHover: isDark ? 'hover:bg-yellow-900/30' : 'hover:bg-yellow-100',
                btnBg: isDark ? 'bg-black/20' : 'bg-yellow-100/50'
            };
        case 'food':
            return {
                icon: <Apple className="w-6 h-6 sm:w-8 sm:h-8" />,
                label: 'FOOD',
                color: isDark ? 'text-green-500' : 'text-green-600',
                bg: isDark ? 'bg-green-950/20' : 'bg-green-50',
                border: isDark ? 'border-white/5' : 'border-green-200',
                text: isDark ? 'text-white' : 'text-green-900',
                btnHover: isDark ? 'hover:bg-green-900/30' : 'hover:bg-green-100',
                btnBg: isDark ? 'bg-black/20' : 'bg-green-100/50'
            };
    }
  };

  if (!player.isActive) {
      return (
          <div className={`relative w-full h-full ${className} flex items-center justify-center opacity-30 grayscale pointer-events-none transition-all duration-500`}>
              <div className="text-center p-4">
                  <h2 className="font-display text-2xl font-bold uppercase tracking-widest text-neutral-500">
                      Sector Closed
                  </h2>
              </div>
          </div>
      );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className} flex flex-col transition-colors duration-500`}>
      {/* Background decoration */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{ 
            backgroundColor: player.color,
            backgroundBlendMode: 'overlay'
        }} 
      />
      
      {/* Main Container - Rotated */}
      <div className="flex-1 flex flex-col p-2 sm:p-4" style={rotationStyle}>
        
        {/* Player Name Header */}
        <div className="flex items-center justify-center mb-1 sm:mb-2 opacity-80">
          <h2 className="font-display text-lg sm:text-xl font-bold tracking-[0.2em] uppercase truncate" style={{ color: player.color }}>
            {player.name}
          </h2>
        </div>

        {/* Resources Container - Takes full remaining space */}
        <div className="flex-1 flex flex-col gap-2 sm:gap-4">
          {(['people', 'money', 'food'] as ResourceType[]).map((resType) => {
            const config = getResourceConfig(resType);
            return (
              <div 
                key={resType} 
                className={`flex-1 flex items-stretch rounded-xl overflow-hidden border ${config.border} ${config.bg} shadow-sm relative group transition-colors duration-300`}
              >
                {/* Decrease Button - Large Touch Target */}
                <button
                  className={`w-20 sm:w-28 flex items-center justify-center transition-colors border-r ${config.border} ${config.btnBg} ${config.btnHover} active:opacity-70`}
                  onClick={() => onUpdateResource(player.id, resType, -1)}
                  aria-label={`Decrease ${config.label}`}
                >
                  <Minus className={`w-8 h-8 sm:w-12 sm:h-12 ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-400'} group-hover:text-red-500 transition-colors`} />
                </button>
                
                {/* Value Display - Center */}
                <div className="flex-1 flex flex-col items-center justify-center py-2 relative">
                   {/* Label + Icon */}
                   <div className={`flex items-center gap-2 mb-0 sm:mb-1 opacity-80 ${config.color}`}>
                        {config.icon}
                        <span className="text-[10px] sm:text-xs font-bold tracking-widest hidden sm:inline-block">{config.label}</span>
                   </div>
                   
                   {/* Giant Number */}
                   <span className={`font-display text-5xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tight ${config.text}`}>
                    {player.resources[resType]}
                   </span>
                </div>

                {/* Increase Button - Large Touch Target */}
                <button
                  className={`w-20 sm:w-28 flex items-center justify-center transition-colors border-l ${config.border} ${config.btnBg} ${config.btnHover} active:opacity-70`}
                  onClick={() => onUpdateResource(player.id, resType, 1)}
                  aria-label={`Increase ${config.label}`}
                >
                  <Plus className={`w-8 h-8 sm:w-12 sm:h-12 ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-400'} group-hover:text-emerald-500 transition-colors`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerQuadrant;
