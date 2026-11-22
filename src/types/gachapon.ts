export type CapsuleColor = 'pink' | 'yellow' | 'blue' | 'purple' | 'white';

export type ScreenId = 'home' | 'gachapon' | 'collection' | 'letter';

export type GachaponPhase =
  | 'idle'
  | 'cranking'
  | 'bouncing'
  | 'dispensing'
  | 'ready';

export interface RosieCapsuleMessage {
  id: number; // 1..50
  numberLabel: string; // "01/50"
  categoryLabel: string;
  color: CapsuleColor;
  message: string;
}

export interface CollectedCapsule {
  messageId: number;
  color: CapsuleColor;
  collectedAt: string;
}

export interface GachaponSaveState {
  collected: Record<number, CollectedCapsule>;
  unusedIds: number[];
  lastDrawnId: number | null;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  giftOpened: boolean;
  letterOpened: boolean;
}
