import { writable } from 'svelte/store';
import { soundEngine } from '../utils/audio';

const savedSound = typeof localStorage !== 'undefined' ? localStorage.getItem('pfolio_sound') : null;
const initialEnabled = savedSound !== null ? savedSound === 'true' : true;

export const isAudioEnabled = writable<boolean>(initialEnabled);
soundEngine.setEnabled(initialEnabled);

export function toggleAudio(val?: boolean): boolean {
  isAudioEnabled.update(current => {
    const next = typeof val === 'boolean' ? val : !current;
    soundEngine.setEnabled(next);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('pfolio_sound', String(next));
    }
    return next;
  });
  return soundEngine.isEnabled();
}
