import React, { useRef } from 'react';
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

  // Refs for Long Press Interval
  const pressTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const handlePressStart = (resType: ResourceType, delta: number) => {
    // Immediate action
    onUpdateResource(player.id, resType, delta);

    // Setup hold timer
    pressTimeout.current = setTimeout(() => {
        // Start rapid fire / larger increments
        pressInterval.current = setInterval(() => {
            onUpdateResource(player.id, resType, delta * 5); // Add 5 if holding
        }, 150);
    }, 500);
  };

  const handlePressEnd = () => {
    if (pressTimeout.current) clearTimeout(pressTimeout.current);
    if (pressInterval.current) clearInterval(pressInterval.current);
    pressTimeout.current = null;
    pressInterval.current = null;
  };

  // Configurations based on theme
  const getResourceConfig = (resType: ResourceType) => {
    const isDark = theme === 'dark';
    // Larger icons for horizontal layout
    const iconClass = "w-5 h-5 md:w-8 md:h-8 lg:w-10 lg:h-10";
    
    switch (resType) {
        case 'people':
            return {
                icon: <User className={iconClass} />,
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
                icon: <MoneyIcon className={iconClass} />,
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
                icon: <Apple className={iconClass} />,
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
                  <h2 className="font-display text-xs lg:text-2xl font-bold uppercase tracking-widest text-neutral-500">
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
      <div className="flex-1 flex flex-col p-0.5 lg:p-4 min-h-0" style={rotationStyle}>
        
        {/* Player Name Header */}
        <div className="flex items-center justify-center mb-0 lg:mb-1 opacity-80 shrink-0">
          <h2 className="font-display text-[8px] lg:text-xl font-bold tracking-[0.2em] uppercase truncate" style={{ color: player.color }}>
            {player.name}
          </h2>
        </div>

        {/* Resources Container - Takes full remaining space */}
        <div className="flex-1 flex flex-col gap-0.5 lg:gap-4 min-h-0">
          {(['people', 'money', 'food'] as ResourceType[]).map((resType) => {
            const config = getResourceConfig(resType);
            return (
              <div 
                key={resType} 
                className={`flex-1 flex items-stretch rounded lg:rounded-xl overflow-hidden border ${config.border} ${config.bg} shadow-sm relative group transition-colors duration-300 min-h-0`}
              >
                {/* Decrease Button - Scaled Touch Target */}
                <button
                  className={`w-12 md:w-16 lg:w-28 flex items-center justify-center transition-colors border-r ${config.border} ${config.btnBg} ${config.btnHover} active:opacity-70 touch-none select-none`}
                  onPointerDown={() => handlePressStart(resType, -1)}
                  onPointerUp={handlePressEnd}
                  onPointerLeave={handlePressEnd}
                  aria-label={`Decrease ${config.label}`}
                >
                  <Minus className={`w-4 h-4 lg:w-12 lg:h-12 ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-400'} group-hover:text-red-500 transition-colors`} />
                </button>
                
                {/* Value Display - Center */}
                <div className="flex-1 flex flex-row items-center justify-center gap-2 md:gap-4 relative min-w-0">
                   {/* Icon */}
                   <div className={`flex items-center justify-center opacity-80 ${config.color}`}>
                        {config.icon}
                   </div>
                   
                   {/* Giant Number - Increased size for mobile */}
                   <span className={`font-display text-4xl md:text-6xl lg:text-8xl font-black leading-none tracking-tight ${config.text}`}>
                    {player.resources[resType]}
                   </span>
                </div>

                {/* Increase Button - Scaled Touch Target */}
                <button
                  className={`w-12 md:w-16 lg:w-28 flex items-center justify-center transition-colors border-l ${config.border} ${config.btnBg} ${config.btnHover} active:opacity-70 touch-none select-none`}
                  onPointerDown={() => handlePressStart(resType, 1)}
                  onPointerUp={handlePressEnd}
                  onPointerLeave={handlePressEnd}
                  aria-label={`Increase ${config.label}`}
                >
                  <Plus className={`w-4 h-4 lg:w-12 lg:h-12 ${theme === 'dark' ? 'text-neutral-500' : 'text-gray-400'} group-hover:text-emerald-500 transition-colors`} />
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