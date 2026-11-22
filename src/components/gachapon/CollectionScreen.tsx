import React, { useMemo, useState } from 'react';
import { Lock, Mail, RotateCcw, Sparkles } from 'lucide-react';
import { gachaponAudio } from '../../lib/gachaponAudio';
import { CAPSULE_CATEGORIES, ROSIE_50_MESSAGES } from '../../lib/gachaponData';
import type {
  CapsuleColor,
  CollectedCapsule,
  RosieCapsuleMessage,
} from '../../types/gachapon';

interface CollectionScreenProps {
  collected: Record<number, CollectedCapsule>;
  onSelectMessage: (msg: RosieCapsuleMessage) => void;
  onResetCollection: () => void;
  onGoToGachapon: () => void;
  onGoToSecretLetter: () => void;
}

export const CollectionScreen: React.FC<CollectionScreenProps> = ({
  collected,
  onSelectMessage,
  onResetCollection,
  onGoToGachapon,
  onGoToSecretLetter,
}) => {
  const [filterColor, setFilterColor] = useState<'all' | CapsuleColor>('all');
  const [confirmReset, setConfirmReset] = useState(false);

  const collectedCount = Object.keys(collected).length;
  const progressPercent = Math.round((collectedCount / 50) * 100);
  const allCollected = collectedCount === 50;

  const filtered = useMemo(() => {
    if (filterColor === 'all') return ROSIE_50_MESSAGES;
    return ROSIE_50_MESSAGES.filter((m) => m.color === filterColor);
  }, [filterColor]);

  return (
    <section className="animate-screen-enter mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="text-center">
        <p className="font-display text-xs uppercase tracking-[0.22em] text-[#9A486C]">
          Rosie&apos;s Keepsakes
        </p>
        <h1 className="font-display mt-1 text-3xl font-bold text-[#4E2639] sm:text-4xl">
          YOUR LITTLE COLLECTION
        </h1>
        <p className="font-mono-num mt-2 text-sm font-semibold text-[#B53B6D]">
          {collectedCount} / 50 CAPSULES COLLECTED
        </p>

        {/* Animated Progress Bar */}
        <div className="mx-auto mt-3 h-4 w-full max-w-md overflow-hidden rounded-full border-2 border-white bg-[#FAD4E4]/75 p-0.5 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF8FB8] via-[#EB5A91] to-[#C9B1FF] transition-all duration-700 ease-out"
            style={{ width: `${Math.max(collectedCount > 0 ? 4 : 0, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* All 50 Celebration Banner */}
      {allCollected && (
        <div className="mt-7 rounded-3xl border-2 border-white bg-gradient-to-r from-[#FFF5F9] via-[#FFFDF2] to-[#F7F1FF] p-6 text-center shadow-[0_14px_34px_rgba(181,59,109,0.16)]">
          <Sparkles className="mx-auto mb-2 h-6 w-6 text-[#EBBF38]" />
          <h2 className="font-display text-xl font-bold text-[#B53B6D] sm:text-2xl">
            YOU&apos;VE COLLECTED ALL THE LITTLE HAPPINESS! ♡
          </h2>
          <p className="mt-1.5 text-sm font-medium text-[#6E3450]">
            Every single message from Deloniel has been unlocked. Have you opened your secret letter yet?
          </p>
          <button
            type="button"
            onClick={() => {
              gachaponAudio.playButtonClick();
              onGoToSecretLetter();
            }}
            className="gacha-cta-btn mt-4 inline-flex min-h-[44px] cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border-2 border-white px-6 py-2 font-display text-sm font-bold text-white"
          >
            <Mail className="h-4 w-4" />
            <span>READ SECRET LETTER ♡</span>
          </button>
        </div>
      )}

      {/* Filter Segmented Bar & Actions */}
      <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-y border-white/80 py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilterColor('all')}
            className={`min-h-[36px] cursor-pointer whitespace-nowrap rounded-xl px-3.5 py-1.5 font-display text-xs font-semibold transition-colors ${
              filterColor === 'all'
                ? 'bg-[#EB5A91] text-white shadow-sm'
                : 'bg-white/80 text-[#6E3450] hover:bg-white'
            }`}
          >
            All (50)
          </button>
          {(Object.keys(CAPSULE_CATEGORIES) as CapsuleColor[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilterColor(c)}
              className={`min-h-[36px] cursor-pointer whitespace-nowrap rounded-xl px-3.5 py-1.5 font-display text-xs font-semibold capitalize transition-colors ${
                filterColor === c
                  ? 'bg-[#EB5A91] text-white shadow-sm'
                  : 'bg-white/80 text-[#6E3450] hover:bg-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onGoToGachapon}
            className="gacha-soft-btn min-h-[38px] cursor-pointer whitespace-nowrap rounded-full border border-[#F7A8C9] px-4 py-1.5 font-display text-xs font-semibold text-[#6E3450]"
          >
            Back to Machine
          </button>
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-white bg-white/70 px-4 py-1.5 font-display text-xs font-semibold text-[#9A486C] hover:bg-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 50-Capsule Collection Grid */}
      <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4 md:grid-cols-5">
        {filtered.map((item) => {
          const isUnlocked = Boolean(collected[item.id]);
          const meta = CAPSULE_CATEGORIES[item.color];

          if (!isUnlocked) {
            return (
              <div
                key={item.id}
                className="flex flex-col items-center justify-center rounded-2xl border border-white/80 bg-white/45 p-4 text-center opacity-60"
              >
                <div className="relative mb-2.5 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-[#F5DCE6]">
                  <Lock className="h-4 w-4 text-[#B57B95]" />
                </div>
                <span className="font-mono-num text-xs font-semibold text-[#9A5D7A]">
                  {item.numberLabel}
                </span>
                <span className="mt-0.5 text-[11px] text-[#A8708B]">Locked</span>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                gachaponAudio.playButtonClick();
                onSelectMessage(item);
              }}
              className="group flex cursor-pointer flex-col items-center justify-between rounded-2xl border-2 border-white bg-white/95 p-4 text-center shadow-[0_8px_20px_rgba(132,72,100,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(181,59,109,0.18)]"
            >
              {/* Colorful Two-Tone Capsule Icon */}
              <div className="relative mb-2.5 h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-110">
                <div
                  className="h-1/2 w-full"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, #FFFFFF 0%, ${meta.shellHex} 60%, ${meta.shellDarkHex} 100%)`,
                  }}
                />
                <div className="h-[2px] w-full bg-[#EAD0DC]" />
                <div className="flex h-1/2 w-full items-center justify-center bg-[#FFF9FB]">
                  <span className="text-[9px] text-[#EB5A91]">♡</span>
                </div>
              </div>

              <span
                className="font-mono-num text-xs font-bold"
                style={{ color: meta.textAccent }}
              >
                {item.numberLabel}
              </span>
              <span className="mt-1 line-clamp-2 text-[11px] font-medium text-[#6E3450]">
                {item.message}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom In-App Reset Confirmation Modal */}
      {confirmReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#4E2639]/50 p-4 backdrop-blur-sm"
          onClick={() => setConfirmReset(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border-2 border-white bg-[#FFF9FB] p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-xl font-bold text-[#4E2639]">
              Reset Your Collection?
            </h3>
            <p className="mt-2 text-sm text-[#844864]">
              This will lock all 50 capsules again so you can open every surprise from the beginning.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="gacha-soft-btn min-h-[42px] cursor-pointer rounded-full border border-[#F7A8C9] px-5 py-2 font-display text-sm font-semibold text-[#6E3450]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  gachaponAudio.playButtonClick();
                  setConfirmReset(false);
                  onResetCollection();
                }}
                className="gacha-cta-btn min-h-[42px] cursor-pointer rounded-full border-2 border-white px-5 py-2 font-display text-sm font-bold text-white"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
