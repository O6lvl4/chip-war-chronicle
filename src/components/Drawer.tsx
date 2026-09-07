import type { ReactNode } from 'react';
import type { DrawerMode } from '../hooks/useTimelineState';

interface Props {
  mode: DrawerMode;
  onClose: () => void;
  children: ReactNode;
}

const TITLES: Record<DrawerMode, string> = {
  none: '',
  event: 'DETAIL',
  section: 'CROSS-SECTION',
  sql: 'SQL CONSOLE',
};

/** Right-hand sliding drawer with a backdrop; content is provided by the caller. */
export default function Drawer({ mode, onClose, children }: Props) {
  const open = mode !== 'none';
  return (
    <>
      {open && <div className="drawer-backdrop" onClick={onClose} />}
      <aside className={`drawer${open ? ' open' : ''}${mode === 'sql' ? ' wide' : ''}`} aria-hidden={!open}>
        <div className="drawer-head">
          <span className="drawer-title">{TITLES[mode]}</span>
          <button type="button" className="drawer-close" onClick={onClose} aria-label="閉じる">✕</button>
        </div>
        <div className="drawer-content">{children}</div>
      </aside>
    </>
  );
}
