import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { gachaponAudio } from '../../lib/gachaponAudio';
import { CAPSULE_CATEGORIES } from '../../lib/gachaponData';
import type { CapsuleColor, RosieCapsuleMessage } from '../../types/gachapon';

interface CapsuleRevealModalProps {
  capsule: RosieCapsuleMessage;
  fromCollection?: boolean;
  onGetAnother: () => void;
  onClose: () => void;
}

interface BurstSpec {
  id: number;
  cx: string;
  cy: string;
  crot: string;
  cdur: string;
  symbol: string;
  color: string;
}

const CategoryIllustration: React.FC<{ color: CapsuleColor }> = ({ color }) => {
  if (color === 'pink') {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" className="mx-auto">
        <circle cx="24" cy="24" r="22" fill="#FFE6F0" stroke="#F7A8C9" strokeWidth="2" />
        <path
          d="M24 34C24 34 13 27 13 20.5C13 17.4 15.5 15 18.5 15C20.6 15 22.5 16.1 24 17.9C25.5 16.1 27.4 15 29.5 15C32.5 15 35 17.4 35 20.5C35 27 24 34 24 34Z"
          fill="#EB5A91"
        />
      </svg>
    );
  }
  if (color === 'yellow') {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" className="mx-auto">
        <circle cx="24" cy="24" r="22" fill="#FFF7D6" stroke="#FCE07A" strokeWidth="2" />
        <path
          d="M24 12L27.2 19.3L35 20.1L29.1 25.3L30.8 33L24 28.9L17.2 33L18.9 25.3L13 20.1L20.8 19.3L24 12Z"
          fill="#EBBF38"
        />
      </svg>
    );
  }
  if (color === 'blue') {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" className="mx-auto">
        <circle cx="24" cy="24" r="22" fill="#EBF6FF" stroke="#92CCF4" strokeWidth="2" />
        <path
          d="M17 29H31.5C33.4 29 35 27.4 35 25.5C35 23.8 33.7 22.3 32 22.1C31.4 18.6 28.4 16 24.8 16C21.6 16 18.9 18 17.9 20.9C15.7 21.3 14 23.2 14 25.5C14 27.4 15.6 29 17 29Z"
          fill="#59A8DF"
        />
      </svg>
    );
  }
  if (color === 'purple') {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" className="mx-auto">
        <circle cx="24" cy="24" r="22" fill="#F4EEFF" stroke="#C9B1FF" strokeWidth="2" />
        <path
          d="M28.5 15C24.5 15.8 21.5 19.3 21.5 23.6C21.5 28.4 25.4 32.3 30.2 32.3C31.3 32.3 32.4 32.1 33.4 31.7C31.3 33.8 28.4 35 25.2 35C19.2 35 14.3 30.1 14.3 24.1C14.3 18.8 18.2 14.4 23.3 13.4C25.2 13 27 13.7 28.5 15Z"
          fill="#9B7CEB"
        />
        <circle cx="32" cy="18" r="2" fill="#EBBF38" />
      </svg>
    );
  }
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" className="mx-auto">
      <circle cx="24" cy="24" r="22" fill="#FFF7FB" stroke="#F7A8C9" strokeWidth="2" />
      <circle cx="24" cy="24" r="5" fill="#FCE07A" />
      <circle cx="24" cy="15" r="4" fill="#F99EC3" />
      <circle cx="24" cy="33" r="4" fill="#F99EC3" />
      <circle cx="15" cy="24" r="4" fill="#F99EC3" />
      <circle cx="33" cy="24" r="4" fill="#F99EC3" />
    </svg>
  );
};

export const CapsuleRevealModal: React.FC<CapsuleRevealModalProps> = ({
  capsule,
  fromCollection = false,
  onGetAnother,
  onClose,
}) => {
  const [stage, setStage] = useState<'rolling' | 'closed' | 'wobbling' | 'opened'>(
    fromCollection ? 'opened' : 'rolling'
  );

  const meta = CAPSULE_CATEGORIES[capsule.color];
  const isOpened = stage === 'opened';

  useEffect(() => {
    if (fromCollection) {
      setStage('opened');
      return;
    }
    setStage('rolling');
    const timer = window.setTimeout(() => {
      setStage((curr) => (curr === 'rolling' ? 'closed' : curr));
    }, 880);
    return () => window.clearTimeout(timer);
  }, [capsule.id, fromCollection]);

  const burstItems = useMemo<BurstSpec[]>(() => {
    if (!isOpened || fromCollection) return [];
    const colors = ['#EB5A91', '#FCE07A', '#92CCF4', '#C9B1FF', '#FF8FB8'];
    const glyphs = ['♡', '✦', '★', '✿'];
    return Array.from({ length: 18 }, (_, idx) => {
      const angle = (idx / 18) * Math.PI * 2;
      const r = 128 + (idx % 3) * 28;
      return {
        id: idx,
        cx: `${Math.round(Math.cos(angle) * r)}px`,
        cy: `${Math.round(Math.sin(angle) * r - 20)}px`,
        crot: `${(idx % 2 === 0 ? 1 : -1) * (140 + idx * 18)}deg`,
        cdur: `${1.1 + (idx % 4) * 0.2}s`,
        symbol: glyphs[idx % glyphs.length],
        color: colors[idx % colors.length],
      };
    });
  }, [isOpened, fromCollection]);

  const handleOpenCapsule = () => {
    if (stage !== 'closed') return;
    setStage('wobbling');
    gachaponAudio.playCapsuleOpen();
    window.setTimeout(() => {
      setStage('opened');
      gachaponAudio.playRewardReveal();
    }, 420);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#4E2639]/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-[32px] border-2 border-white bg-[#FFF9FB] p-6 sm:p-8 text-center shadow-[0_28px_64px_rgba(78,38,57,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#FAD4E4] bg-white text-[#6E3450] hover:bg-[#FFEBF2]"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Clean Unboxed Metadata Line */}
        <p className="font-mono-num text-xs font-semibold uppercase tracking-[0.16em] text-[#9A486C]">
          {capsule.numberLabel} · {meta.name} · {capsule.categoryLabel}
        </p>

        <h2 className="font-display mt-1.5 text-2xl font-bold text-[#4E2639] sm:text-3xl">
          {isOpened
            ? 'A Little Reminder For You ♡'
            : stage === 'rolling'
              ? 'Here Comes Your Capsule!'
              : 'Tap Your Capsule To Open!'}
        </h2>

        {/* Animated Rolling + Splitting Capsule Stage */}
        <div className="relative my-5 flex min-h-[268px] flex-col items-center justify-center">
          {burstItems.length > 0 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
            >
              {burstItems.map((b) => (
                <span
                  key={b.id}
                  className="animate-pastel-confetti absolute text-lg select-none"
                  style={
                    {
                      color: b.color,
                      '--cx': b.cx,
                      '--cy': b.cy,
                      '--crot': b.crot,
                      '--cdur': b.cdur,
                    } as React.CSSProperties
                  }
                >
                  {b.symbol}
                </span>
              ))}
            </div>
          )}

          {/* Floor Rolling Shadow */}
          {!isOpened && (
            <div
              aria-hidden="true"
              className={`absolute bottom-3 h-4 w-36 rounded-full bg-[#4E2639]/20 blur-md ${
                stage === 'rolling' ? 'animate-capsule-shadow-roll' : 'opacity-45'
              }`}
            />
          )}

          {/* Two-Half Gachapon Capsule */}
          {!fromCollection && (
            <div
              onClick={stage === 'closed' ? handleOpenCapsule : undefined}
              className={`relative flex flex-col items-center justify-center ${
                stage === 'closed' ? 'cursor-pointer group' : 'pointer-events-none'
              } ${stage === 'rolling' ? 'animate-capsule-roll-in' : ''} ${
                stage === 'wobbling' ? 'animate-capsule-wobble' : ''
              }`}
            >
              <div
                aria-hidden="true"
                className={`absolute h-36 w-36 rounded-full blur-2xl transition-all duration-500 ${
                  isOpened ? 'opacity-80 scale-125' : 'opacity-30 scale-90'
                }`}
                style={{ backgroundColor: meta.glowHex }}
              />

              {/* Top Colored Dome */}
              <div
                className={`relative z-20 h-22 w-44 rounded-t-full border-2 border-white overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isOpened
                    ? '-translate-y-24 -translate-x-10 -rotate-[22deg] scale-75 opacity-95'
                    : 'group-hover:-translate-y-1.5'
                }`}
                style={{
                  background: `radial-gradient(circle at 32% 28%, #FFFFFF 0%, ${meta.shellHex} 56%, ${meta.shellDarkHex} 100%)`,
                  boxShadow: `0 -6px 20px ${meta.glowHex}`,
                }}
              >
                <div className="absolute top-3 left-7 h-5 w-11 -rotate-18 rounded-full bg-white/65 blur-[1px]" />
              </div>

              {/* Seam Band */}
              <div
                className={`z-20 h-2.5 w-46 rounded-full border border-[#EAD0DC] bg-white shadow-sm transition-all duration-300 ${
                  isOpened ? 'opacity-0 scale-x-125' : 'opacity-100'
                }`}
              />

              {/* Bottom Frosted White Dome */}
              <div
                className={`relative z-20 flex h-22 w-44 items-center justify-center rounded-b-full border-2 border-white bg-gradient-to-b from-white to-[#FFF0F6] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isOpened
                    ? 'translate-y-24 translate-x-10 rotate-[20deg] scale-75 opacity-95'
                    : 'group-hover:translate-y-1.5'
                }`}
              >
                <span className="font-display text-lg text-[#EB5A91]">♡</span>
              </div>
            </div>
          )}

          {/* Collectible Reminder Card */}
          {isOpened && (
            <div
              className={`animate-card-unfold relative z-10 w-full rounded-3xl border-2 border-white p-6 shadow-[0_14px_34px_rgba(78,38,57,0.14)] ${
                fromCollection ? '' : '-my-12'
              }`}
              style={{ backgroundColor: meta.cardTint }}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-[#844864]">
                <span className="font-mono-num" style={{ color: meta.textAccent }}>
                  {capsule.numberLabel}
                </span>
                <span>{meta.meaning}</span>
              </div>

              <div className="my-3">
                <CategoryIllustration color={capsule.color} />
              </div>

              <p className="text-lg font-semibold leading-relaxed text-[#4E2639] sm:text-xl">
                “{capsule.message}”
              </p>

              <div className="mx-auto my-3 h-px w-20 bg-[#F7A8C9]/70" />

              <p className="font-handwritten text-2xl font-bold text-[#B53B6D]">
                — Deloniel ♡
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isOpened ? (
          <button
            type="button"
            disabled={stage !== 'closed'}
            onClick={handleOpenCapsule}
            className="gacha-cta-btn min-h-[48px] cursor-pointer whitespace-nowrap rounded-full border-2 border-white px-8 py-3 font-display text-base font-bold text-white disabled:opacity-75"
          >
            {stage === 'rolling'
              ? 'ROLLING OUT...'
              : stage === 'wobbling'
                ? 'OPENING...'
                : 'OPEN CAPSULE ♡'}
          </button>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                gachaponAudio.playButtonClick();
                onGetAnother();
              }}
              className="gacha-cta-btn inline-flex min-h-[46px] cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border-2 border-white px-7 py-2.5 font-display text-sm font-bold text-white sm:text-base"
            >
              <RefreshCw className="h-4 w-4" />
              <span>GET ANOTHER CAPSULE</span>
            </button>

            <button
              type="button"
              onClick={() => {
                gachaponAudio.playButtonClick();
                onClose();
              }}
              className="gacha-soft-btn inline-flex min-h-[46px] cursor-pointer items-center whitespace-nowrap rounded-full border border-[#F7A8C9] px-6 py-2.5 font-display text-sm font-semibold text-[#6E3450]"
            >
              {fromCollection ? 'BACK TO COLLECTION' : 'CLOSE'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
