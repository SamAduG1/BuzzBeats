'use client';

import { Music, Zap, Layers, Skull, FileText } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { GameModeId } from '@shared/types/gameMode';

type IconComponent = React.ComponentType<LucideProps>;

const MODE_CONFIG: Record<GameModeId, { Icon: IconComponent; color: string }> = {
  'classic':         { Icon: Music,    color: '#00f0ff' },
  'speed':           { Icon: Zap,      color: '#ffe600' },
  'snippet':         { Icon: Layers,   color: '#39ff14' },
  'elimination':     { Icon: Skull,    color: '#ff1744' },
  'name-that-lyric':  { Icon: FileText, color: '#ff00e5' },
};

interface Props {
  id: GameModeId;
  size?: number;
  /** Override the default mode color */
  color?: string;
}

export default function GameModeIcon({ id, size = 32, color: colorOverride }: Props) {
  const config = MODE_CONFIG[id];
  if (!config) return null;
  const { Icon, color } = config;
  const c = colorOverride ?? color;
  return (
    <Icon
      size={size}
      strokeWidth={1.75}
      style={{ color: c, filter: `drop-shadow(0 0 10px ${c}99)` }}
    />
  );
}
