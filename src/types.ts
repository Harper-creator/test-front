export interface ThoughtCard {
  id: string;
  text: string;
  translation?: string;
  category: string;
  meta: string;
  stylePreset: 'ice' | 'fog' | 'lead' | 'ceiling' | 'custom';
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  isCustom?: boolean;
  createdAt: string;
}

export type LayoutMode = 'mindscape' | 'zine' | 'breathing' | 'exporter';

export interface AmbientSound {
  id: string;
  name: string;
  type: 'rain' | 'bowl' | 'noise';
  isPlaying: boolean;
}
