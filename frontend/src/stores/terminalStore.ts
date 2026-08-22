import { writable, get } from 'svelte/store';
import type { TerminalLine, TabInfo, VirtualFile } from '../types';

export const lines = writable<TerminalLine[]>([]);
export const activeDir = writable<string>('~');
export const commandHistory = writable<string[]>([]);
export const historyIndex = writable<number>(-1);
export const isMatrixActive = writable<boolean>(false);
export const activeEditingFile = writable<VirtualFile | null>(null);

export const isWindowMaximized = writable<boolean>(false);
export const isWindowMinimized = writable<boolean>(false);

export const tabs = writable<TabInfo[]>([
  { id: 'tab-1', title: 'zsh (ansh)', active: true, dir: '~' }
]);

export function addLine(line: Omit<TerminalLine, 'id'>) {
  const newLine: TerminalLine = {
    ...line,
    id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: Date.now()
  };
  lines.update(cur => [...cur, newLine]);
}

export function clearTerminal() {
  lines.set([]);
}

export function addHistory(cmd: string) {
  if (!cmd.trim()) return;
  commandHistory.update(h => [...h, cmd]);
  historyIndex.set(-1);
}

export function createNewTab(title: string = 'zsh') {
  tabs.update(cur => {
    const id = `tab-${Date.now()}`;
    const newTabs = cur.map(t => ({ ...t, active: false }));
    newTabs.push({ id, title: `${title} (${newTabs.length + 1})`, active: true, dir: '~' });
    return newTabs;
  });
  lines.set([]);
  addLine({ type: 'fastfetch' });
}

export function switchTab(id: string) {
  tabs.update(cur => cur.map(t => ({ ...t, active: t.id === id })));
}

export function closeTab(id: string) {
  tabs.update(cur => {
    if (cur.length <= 1) return cur;
    const remaining = cur.filter(t => t.id !== id);
    if (!remaining.some(t => t.active)) {
      remaining[remaining.length - 1].active = true;
    }
    return remaining;
  });
}
