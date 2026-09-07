import type { CSSProperties, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}

/** Bordered card with an offset solid shadow in the given colour. */
export default function NCard({ children, color, style = {} }: Props) {
  const c = color ?? 'var(--border)';
  return (
    <div style={{
      background: 'var(--surface)',
      border: `2px solid ${c}`,
      borderRadius: 12,
      boxShadow: `3px 3px 0 ${c}`,
      padding: '14px 16px',
      marginBottom: 12,
      ...style,
    }}>
      {children}
    </div>
  );
}
