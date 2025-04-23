import { GiMeditation, GiLotus } from 'react-icons/gi';
import { TbWaveSine } from 'react-icons/tb';

export const breathingPatterns = [
  {
    id: 'relaxation',
    name: '4-7-8 Relaxation',
    description: 'Calming breath for stress and anxiety relief',
    icon: <GiLotus />,
    color: '#4CAF50',
    pattern: { inhale: 4, hold: 7, exhale: 8 },
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal breathing for focus and concentration',
    icon: <TbWaveSine />,
    color: '#2196F3',
    pattern: { inhale: 4, hold: 4, exhale: 4, holdAfterExhale: 4 },
  },
  {
    id: 'deep',
    name: 'Deep Belly',
    description: 'Deep breathing for relaxation and stress relief',
    icon: <GiMeditation />,
    color: '#9C27B0',
    pattern: { inhale: 5, hold: 2, exhale: 5 },
  },
];
