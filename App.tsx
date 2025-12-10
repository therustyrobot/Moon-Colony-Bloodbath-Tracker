import React, { useState, useEffect } from 'react';
import PlayerQuadrant from './components/PlayerQuadrant';
import CenterHub from './components/CenterHub';
import MissionSetupModal from './components/MissionSetupModal';
import { Player, ResourceType, Theme } from './types';

const INITIAL_RESOURCES = {
  people: 30,
  money: 4,
  food: 4,
};

// Top Row: 2 (West), 3 (North)
// Bottom Row: 1 (South), 4 (East)
const INITIAL_PLAYERS: Player[] = [
  { id: 2, name: 'SECTOR WEST', color: '#3b82f6', resources: { ...INITIAL_RESOURCES }, rotation: 180, isActive: true },
  { id: 3, name: 'SECTOR NORTH', color: '#10b981', resources: { ...INITIAL_RESOURCES }, rotation: 180, isActive: true },
  { id: 1, name: 'SECTOR SOUTH', color: '#ef4444', resources: { ...INITIAL_RESOURCES }, rotation: 0, isActive: true },
  { id: 4, name: 'SECTOR EAST', color: '#eab308', resources: { ...INITIAL_RESOURCES }, rotation: 0, isActive: true },
];

function App() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [theme, setTheme] = useState<Theme>('dark');
  const [isSetupOpen, setIsSetupOpen] = useState(true);

  // Apply theme to body to prevent white flashes at edges
  useEffect(() => {
    document.body.style.backgroundColor = theme === 'dark' ? '#050505' : '#f5f5f5';
    document.body.style.color = theme === 'dark' ? '#e5e5e5' : '#171717';
  }, [theme]);

  const handleUpdateResource = (playerId: number, resource: ResourceType, delta: number) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((p) => {
        if (p.id !== playerId) return p;
        const newValue = Math.max(0, p.resources[resource] + delta);
        return {
          ...p,
          resources: {
            ...p.resources,
            [resource]: newValue,
          },
        };
      })
    );
  };

  const handleNewGame = (playerCount: number, playerNames: Record<number, string>) => {
    // Logic to activate players based on count
    // 4 Players: All
    // 3 Players: 1, 2, 3
    // 2 Players: 1 (South) and 3 (North) for head-to-head
    
    let activeIds: number[] = [];
    if (playerCount === 4) activeIds = [1, 2, 3, 4];
    else if (playerCount === 3) activeIds = [1, 2, 3];
    else activeIds = [1, 3]; // 2 players

    setPlayers(prev => prev.map(p => {
        const customName = playerNames[p.id];
        let defaultName = '';
        switch(p.id) {
            case 1: defaultName = 'SECTOR SOUTH'; break;
            case 2: defaultName = 'SECTOR WEST'; break;
            case 3: defaultName = 'SECTOR NORTH'; break;
            case 4: defaultName = 'SECTOR EAST'; break;
        }

        return {
            ...p,
            resources: { ...INITIAL_RESOURCES },
            isActive: activeIds.includes(p.id),
            name: (customName && customName.trim() !== '') ? customName : defaultName
        };
    }));
    
    setIsSetupOpen(false);
  };

  const getPlayer = (id: number) => players.find(p => p.id === id)!;

  return (
    <div className={`relative w-screen h-screen overflow-hidden flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
      
      <div className="flex-1 flex flex-col min-h-0">
        
        {/* TOP HALF - "Away Team" */}
        <div className={`flex-1 flex flex-row border-b-[12px] min-h-0 ${theme === 'dark' ? 'border-neutral-900' : 'border-gray-300'}`}>
             <div className={`flex-1 border-r-[12px] ${theme === 'dark' ? 'border-neutral-900' : 'border-gray-300'}`}>
                 <PlayerQuadrant 
                    player={getPlayer(2)} 
                    onUpdateResource={handleUpdateResource}
                    className={theme === 'dark' ? 'bg-blue-950/5' : 'bg-blue-50'}
                    theme={theme}
                 />
             </div>
             <div className="flex-1">
                 <PlayerQuadrant 
                    player={getPlayer(3)} 
                    onUpdateResource={handleUpdateResource} 
                    className={theme === 'dark' ? 'bg-emerald-950/5' : 'bg-emerald-50'}
                    theme={theme}
                 />
             </div>
        </div>

        {/* BOTTOM HALF - "Home Team" */}
        <div className="flex-1 flex flex-row min-h-0">
             <div className={`flex-1 border-r-[12px] ${theme === 'dark' ? 'border-neutral-900' : 'border-gray-300'}`}>
                 <PlayerQuadrant 
                    player={getPlayer(1)} 
                    onUpdateResource={handleUpdateResource}
                    className={theme === 'dark' ? 'bg-red-950/5' : 'bg-red-50'}
                    theme={theme}
                 />
             </div>
             <div className="flex-1">
                 <PlayerQuadrant 
                    player={getPlayer(4)} 
                    onUpdateResource={handleUpdateResource}
                    className={theme === 'dark' ? 'bg-yellow-950/5' : 'bg-yellow-50'}
                    theme={theme}
                 />
             </div>
        </div>
      </div>

      {/* Setup Modal */}
      <MissionSetupModal
        isOpen={isSetupOpen}
        onLaunch={handleNewGame}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Central Hub Button */}
      <CenterHub 
        theme={theme} 
        setTheme={setTheme} 
        onShowSetup={() => setIsSetupOpen(true)}
      />
    </div>
  );
}

export default App;