import type { Thread } from '../types';

export const THREADS: Thread[] = [
  { id: 'si', name: '半導体産業', en: 'INDUSTRY', color: '#E84500', darkColor: '#FF6B3D' },
  { id: 'pr', name: '政策・規制', en: 'POLICY',   color: '#009E5C', darkColor: '#00D97E' },
  { id: 'gp', name: '地政学',     en: 'GEO-POL',  color: '#0055CC', darkColor: '#4488FF' },
  { id: 'ai', name: 'AI・需要',   en: 'AI/DEMAND',color: '#6B21A8', darkColor: '#C084FC' },
  { id: 'mm', name: '市場・マクロ',en: 'MARKET',   color: '#CC8800', darkColor: '#FFBB00' },
  { id: 'jp', name: '日本の法制', en: 'JP LAW',   color: '#C2185B', darkColor: '#F472B6' },
];
