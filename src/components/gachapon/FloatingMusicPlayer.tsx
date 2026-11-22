import React from 'react';
import { Music, Pause, Play } from 'lucide-react';

interface FloatingMusicPlayerProps {
  musicEnabled: boolean;
  onToggleMusic: () => void;
}

export const FloatingMusicPlayer: React.FC<FloatingMusicPlayerProps> = ({
  musicEnabled,
  onToggleMusic,
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        type="button"
        onClick={onToggleMusic}
        aria-label={
          musicEnabled
            ? 'Pause romantic background music'
            : 'Play romantic background music'
        }
        className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-full border-2 border-white bg-[#FFF8FB]/92 px-4 py-2 text-left shadow-[0_10px_28px_rgba(78,38,57,0.18)] backdrop-blur-md transition-transform hover:-translate-y-0.5"
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${
            musicEnabled ? 'bg-[#EB5A91]' : 'bg-[#D99BB6]'
          }`}
        >
          {musicEnabled ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="ml-0.5 h-3.5 w-3.5" />
          )}
        </div>

        <div className="hidden sm:block pr-1">
          <p className="font-display text-xs font-bold leading-tight text-[#4E2639]">
            {musicEnabled ? 'Now Playing ♡' : 'Play Music ♡'}
          </p>
          <p className="text-[11px] font-medium leading-tight text-[#844864]">
            The Most Beautiful Thing
          </p>
        </div>

        {musicEnabled ? (
          <div aria-hidden="true" className="flex h-4 items-end gap-0.5 pr-0.5">
            <span className="animate-eq-1 h-4 w-1 rounded-full bg-[#EB5A91]" />
            <span className="animate-eq-2 h-4 w-1 rounded-full bg-[#F7A8C9]" />
            <span className="animate-eq-3 h-4 w-1 rounded-full bg-[#EB5A91]" />
          </div>
        ) : (
          <Music className="h-4 w-4 text-[#9A486C] sm:hidden" />
        )}
      </button>
    </div>
  );
};
