import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { gachaponAudio } from '../../lib/gachaponAudio';

interface BonusSecretModalProps {
  message: string;
  onAnotherBonus: () => void;
  onClose: () => void;
}

export const BonusSecretModal: React.FC<BonusSecretModalProps> = ({
  message,
  onAnotherBonus,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#4E2639]/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-card-unfold relative w-full max-w-md rounded-3xl border-2 border-white bg-[#FFF9FB] p-6 text-center shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close secret bonus message"
          className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#FAD4E4] bg-white text-[#6E3450] hover:bg-[#FFEBF2]"
        >
          <X className="h-4 w-4" />
        </button>

        <Sparkles className="mx-auto mb-2 h-6 w-6 text-[#EBBF38]" />
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#9A486C]">
          Secret Bonus Note
        </p>

        <p className="mt-4 text-lg font-semibold leading-relaxed text-[#4E2639]">
          “{message}”
        </p>

        <p className="font-handwritten mt-4 text-2xl font-bold text-[#B53B6D]">
          — Deloniel ♡
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              gachaponAudio.playButtonClick();
              onAnotherBonus();
            }}
            className="gacha-cta-btn min-h-[42px] cursor-pointer whitespace-nowrap rounded-full border-2 border-white px-5 py-2 font-display text-xs font-bold text-white"
          >
            Another Bonus Note ✨
          </button>
          <button
            type="button"
            onClick={onClose}
            className="gacha-soft-btn min-h-[42px] cursor-pointer whitespace-nowrap rounded-full border border-[#F7A8C9] px-5 py-2 font-display text-xs font-semibold text-[#6E3450]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
