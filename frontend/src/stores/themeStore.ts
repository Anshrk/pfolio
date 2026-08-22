import { writable } from 'svelte/store';
import type { ThemeConfig, ThemeName } from '../types';

export const THEMES: Record<ThemeName, ThemeConfig> = {
  'tokyo-night': {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    bg: '#0f141c',
    windowBg: 'rgba(26, 27, 38, 0.88)',
    windowHeaderBg: 'rgba(19, 20, 30, 0.95)',
    text: '#a9b1d6',
    accent: '#7aa2f7',
    secondary: '#bb9af7',
    border: 'rgba(122, 162, 247, 0.25)',
    promptUser: '#7aa2f7',
    promptHost: '#bb9af7',
    promptPath: '#7dcfff',
    promptSymbol: '#9ece6a',
    selection: 'rgba(122, 162, 247, 0.3)',
    cursorColor: '#7aa2f7'
  },
  'dracula': {
    id: 'dracula',
    name: 'Dracula',
    bg: '#1e1f29',
    windowBg: 'rgba(40, 42, 54, 0.88)',
    windowHeaderBg: 'rgba(30, 31, 41, 0.95)',
    text: '#f8f8f2',
    accent: '#ff79c6',
    secondary: '#bd93f9',
    border: 'rgba(189, 147, 249, 0.3)',
    promptUser: '#50fa7b',
    promptHost: '#ff79c6',
    promptPath: '#8be9fd',
    promptSymbol: '#f1fa8c',
    selection: 'rgba(68, 71, 90, 0.6)',
    cursorColor: '#f8f8f2'
  },
  'matrix': {
    id: 'matrix',
    name: 'The Matrix',
    bg: '#020b05',
    windowBg: 'rgba(5, 18, 10, 0.92)',
    windowHeaderBg: 'rgba(2, 10, 5, 0.98)',
    text: '#00ff66',
    accent: '#00ff41',
    secondary: '#22c55e',
    border: 'rgba(0, 255, 65, 0.35)',
    promptUser: '#00ff41',
    promptHost: '#00cc33',
    promptPath: '#86efac',
    promptSymbol: '#ffffff',
    selection: 'rgba(0, 255, 65, 0.25)',
    cursorColor: '#00ff66'
  },
  'cyberpunk': {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    bg: '#050711',
    windowBg: 'rgba(15, 12, 34, 0.90)',
    windowHeaderBg: 'rgba(10, 8, 24, 0.96)',
    text: '#00f0ff',
    accent: '#ffe600',
    secondary: '#ff0055',
    border: 'rgba(255, 0, 85, 0.35)',
    promptUser: '#ffe600',
    promptHost: '#ff0055',
    promptPath: '#00f0ff',
    promptSymbol: '#ffe600',
    selection: 'rgba(255, 0, 85, 0.3)',
    cursorColor: '#ffe600'
  },
  'apple-retro': {
    id: 'apple-retro',
    name: 'Apple Classic 1984',
    bg: '#101712',
    windowBg: 'rgba(16, 26, 18, 0.92)',
    windowHeaderBg: 'rgba(10, 18, 12, 0.98)',
    text: '#33ff33',
    accent: '#4ade80',
    secondary: '#86efac',
    border: 'rgba(51, 255, 51, 0.28)',
    promptUser: '#4ade80',
    promptHost: '#22c55e',
    promptPath: '#bbf7d0',
    promptSymbol: '#33ff33',
    selection: 'rgba(51, 255, 51, 0.2)',
    cursorColor: '#33ff33'
  },
  'monokai': {
    id: 'monokai',
    name: 'Monokai Pro',
    bg: '#19181a',
    windowBg: 'rgba(34, 31, 34, 0.90)',
    windowHeaderBg: 'rgba(25, 23, 25, 0.96)',
    text: '#fcfcfa',
    accent: '#ffd866',
    secondary: '#ff6188',
    border: 'rgba(255, 216, 102, 0.25)',
    promptUser: '#a9dc76',
    promptHost: '#ff6188',
    promptPath: '#78dce8',
    promptSymbol: '#ab9df2',
    selection: 'rgba(255, 97, 136, 0.25)',
    cursorColor: '#fcfcfa'
  },
  'catppuccin': {
    id: 'catppuccin',
    name: 'Catppuccin Mocha',
    bg: '#11111b',
    windowBg: 'rgba(30, 30, 46, 0.88)',
    windowHeaderBg: 'rgba(24, 24, 37, 0.95)',
    text: '#cdd6f4',
    accent: '#cba6f7',
    secondary: '#f38ba8',
    border: 'rgba(203, 166, 247, 0.25)',
    promptUser: '#89b4fa',
    promptHost: '#f5c2e7',
    promptPath: '#94e2d5',
    promptSymbol: '#a6e3a1',
    selection: 'rgba(203, 166, 247, 0.25)',
    cursorColor: '#f5e0dc'
  },
  'nord': {
    id: 'nord',
    name: 'Nord Frost',
    bg: '#1e222b',
    windowBg: 'rgba(46, 52, 64, 0.90)',
    windowHeaderBg: 'rgba(36, 41, 51, 0.96)',
    text: '#eceff4',
    accent: '#88c0d0',
    secondary: '#81a1c1',
    border: 'rgba(136, 192, 208, 0.25)',
    promptUser: '#8fbcbb',
    promptHost: '#81a1c1',
    promptPath: '#88c0d0',
    promptSymbol: '#a3be8c',
    selection: 'rgba(136, 192, 208, 0.25)',
    cursorColor: '#eceff4'
  },
  'synthwave': {
    id: 'synthwave',
    name: 'Synthwave 84',
    bg: '#120a21',
    windowBg: 'rgba(38, 22, 64, 0.90)',
    windowHeaderBg: 'rgba(26, 14, 46, 0.96)',
    text: '#f92aad',
    accent: '#fe4450',
    secondary: '#36f9f6',
    border: 'rgba(249, 42, 173, 0.35)',
    promptUser: '#fede5d',
    promptHost: '#36f9f6',
    promptPath: '#ff7edb',
    promptSymbol: '#72f1b8',
    selection: 'rgba(254, 68, 80, 0.3)',
    cursorColor: '#36f9f6'
  }
};

const savedTheme = (typeof localStorage !== 'undefined' && localStorage.getItem('pfolio_theme')) as ThemeName;
const initialTheme: ThemeName = (savedTheme && THEMES[savedTheme]) ? savedTheme : 'tokyo-night';

export const currentTheme = writable<ThemeConfig>(THEMES[initialTheme]);
export const isCrtEnabled = writable<boolean>(false);
export const isScanlinesEnabled = writable<boolean>(false);
export const isGlowEnabled = writable<boolean>(true);

export function setTheme(name: ThemeName): boolean {
  if (THEMES[name]) {
    currentTheme.set(THEMES[name]);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('pfolio_theme', name);
    }
    return true;
  }
  return false;
}
