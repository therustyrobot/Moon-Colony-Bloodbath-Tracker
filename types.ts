
export type ResourceType = 'people' | 'money' | 'food';
export type Theme = 'light' | 'dark';

export interface PlayerResources {
  people: number;
  money: number;
  food: number;
}

export interface Player {
  id: number;
  name: string;
  color: string;
  resources: PlayerResources;
  // Rotation in degrees: 0, 180
  rotation: number;
  isActive: boolean;
}
