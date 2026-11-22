import type { GachaponSaveState } from '../types/gachapon';
import { ROSIE_50_MESSAGES, shuffleIds } from './gachaponData';

const STORAGE_KEY = 'rosie_little_gachapon_v1';

export function createDefaultGachaponState(): GachaponSaveState {
  return {
    collected: {},
    unusedIds: shuffleIds(ROSIE_50_MESSAGES.map((m) => m.id)),
    lastDrawnId: null,
    musicEnabled: false,
    sfxEnabled: true,
    giftOpened: false,
    letterOpened: false,
  };
}

export function loadGachaponState(): GachaponSaveState {
  if (typeof window === 'undefined') return createDefaultGachaponState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultGachaponState();
    const parsed = JSON.parse(raw) as Partial<GachaponSaveState>;
    const fallback = createDefaultGachaponState();
    return {
      collected:
        parsed.collected && typeof parsed.collected === 'object'
          ? parsed.collected
          : {},
      unusedIds:
        Array.isArray(parsed.unusedIds) && parsed.unusedIds.length > 0
          ? parsed.unusedIds.filter(
              (id) => typeof id === 'number' && id >= 1 && id <= 50
            )
          : fallback.unusedIds,
      lastDrawnId:
        typeof parsed.lastDrawnId === 'number' ? parsed.lastDrawnId : null,
      musicEnabled: Boolean(parsed.musicEnabled),
      sfxEnabled:
        parsed.sfxEnabled !== undefined ? Boolean(parsed.sfxEnabled) : true,
      giftOpened: Boolean(parsed.giftOpened),
      letterOpened: Boolean(parsed.letterOpened),
    };
  } catch {
    return createDefaultGachaponState();
  }
}

export function saveGachaponState(state: GachaponSaveState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}
