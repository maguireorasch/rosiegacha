import React, { useMemo, useState } from 'react';
import { Gift, Heart, Sparkles } from 'lucide-react';
import { gachaponAudio } from '../../lib/gachaponAudio';

interface WelcomeGiftScreenProps {
  onOpenGift: () => void;
}

export const WelcomeGiftScreen: React.FC<WelcomeGiftScreenProps> = ({
  onOpenGift,
}) => {
  const [opening, setOpening] = useState(false);

  const sparkles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const angle = (i / 18) * Math.PI * 2;
        const dist = 90 + (i % 3) * 42;
        return {
          id: i,
          cx: `${Math.round(Math.cos(angle) * dist)}px`,
          cy: `${Math.round(Math.sin(angle) * dist - 40)}px`,
          crot: `${(i % 2 === 0 ? 1 : -1) * (160 + i * 20)}deg`,
          cdur: `${0.9 + (i % 4) * 0.16}s`,
          symbol: i % 3 === 0 ? '♡' : i % 3 === 1 ? '✦' : '★',
          color: ['#EB5A91', '#FCE07A', '#92CCF4', '#C9B1FF', '#FF8FB8'][i % 5],
        };
      }),
    []
  );

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    gachaponAudio.playGiftOpen();
    window.setTimeout(() => {
      onOpenGift();
    }, 820);
  };

  return (
    <section className="animate-screen-enter mx-auto flex min-h-[calc(100vh-148px)] w-full max-w-3xl flex-col items-center justify-center px-4 py-10 text-center">
      <p className="font-display text-xs uppercase tracking-[0.24em] text-[#9A486C]">
        A Little Present For Hannalle Dewyrose
      </p>

      <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-[#4E2639] sm:text-5xl md:text-6xl">
        HELLO, ROSIE! ♡
      </h1>

      <p className="mt-3 text-lg font-semibold text-[#7E3958] sm:text-xl">
        Someone prepared a little something for you.
      </p>

      <p className="mt-2 max-w-md text-sm leading-relaxed text-[#844864] sm:text-base">
        50 tiny reminders, little surprises, and a secret message waiting inside.
      </p>

      {/* Interactive Animated Pastel Gift Box */}
      <div className="relative my-10 flex items-center justify-center">
        {/* Soft Ambient Glow Behind Box */}
        <div
          aria-hidden="true"
          className={`absolute h-52 w-52 rounded-full bg-[#F7A8C9]/45 blur-3xl transition-transform duration-700 ${
            opening ? 'scale-150 opacity-90' : 'scale-100 opacity-75'
          }`}
        />

        {/* Floating Mini Hearts Around Closed Gift */}
        {!opening && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <Heart className="absolute -top-4 left-2 h-5 w-5 animate-bounce fill-[#F49AC2] text-[#EB5A91]" />
            <Sparkles className="absolute -top-2 right-1 h-5 w-5 animate-pulse text-[#EBBF38]" />
            <Heart className="absolute bottom-4 -left-6 h-4 w-4 fill-[#C9B1FF] text-[#9B7CEB]" />
          </div>
        )}

        {/* Sparkle Burst on Gift Open */}
        {opening && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
          >
            {sparkles.map((s) => (
              <span
                key={s.id}
                className="animate-pastel-confetti absolute text-xl select-none"
                style={
                  {
                    color: s.color,
                    '--cx': s.cx,
                    '--cy': s.cy,
                    '--crot': s.crot,
                    '--cdur': s.cdur,
                  } as React.CSSProperties
                }
              >
                {s.symbol}
              </span>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleOpen}
          aria-label="Open your little gift box"
          className={`group relative cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#EB5A91]/40 rounded-3xl p-4 ${
            opening ? '' : 'animate-gift-bob'
          }`}
        >
          <svg
            width="196"
            height="196"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_18px_30px_rgba(132,72,100,0.22)] transition-transform duration-300 group-hover:scale-105"
          >
            {/* Box Ground Shadow */}
            <ellipse cx="100" cy="182" rx="68" ry="10" fill="#D95F90" fillOpacity="0.18" />

            {/* Gift Base */}
            <rect
              x="38"
              y="88"
              width="124"
              height="88"
              rx="18"
              fill="url(#boxBodyGrad)"
              stroke="#FFFFFF"
              strokeWidth="3"
            />
            {/* Vertical Satin Ribbon on Body */}
            <rect x="88" y="88" width="24" height="88" fill="#EB5A91" />
            <rect x="94" y="88" width="6" height="88" fill="#FF9DC3" fillOpacity="0.65" />

            {/* Subtle Heart Tag */}
            <circle cx="136" cy="134" r="14" fill="#FFF9FB" stroke="#F7A8C9" strokeWidth="2" />
            <path
              d="M136 141C136 141 128 136 128 131.5C128 129.3 129.8 127.6 131.9 127.6C133.4 127.6 134.8 128.4 136 129.7C137.2 128.4 138.6 127.6 140.1 127.6C142.2 127.6 144 129.3 144 131.5C144 136 136 141 136 141Z"
              fill="#EB5A91"
            />

            {/* Animated Gift Lid + Bow */}
            <g className={opening ? 'animate-gift-lid-open origin-bottom' : ''}>
              <rect
                x="30"
                y="64"
                width="140"
                height="28"
                rx="12"
                fill="url(#boxLidGrad)"
                stroke="#FFFFFF"
                strokeWidth="3"
              />
              <rect x="88" y="64" width="24" height="28" fill="#D9457D" />

              {/* Big Satin Ribbon Bow */}
              <path
                d="M100 63C85 45 55 42 54 57C53 68 78 68 100 64Z"
                fill="#EB5A91"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
              <path
                d="M100 63C115 45 145 42 146 57C147 68 122 68 100 64Z"
                fill="#EB5A91"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
              <circle cx="100" cy="61" r="10" fill="#FF8FB8" stroke="#FFFFFF" strokeWidth="2.5" />
            </g>

            <defs>
              <linearGradient id="boxBodyGrad" x1="38" y1="88" x2="162" y2="176" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFD6E7" />
                <stop offset="1" stopColor="#F7A8C9" />
              </linearGradient>
              <linearGradient id="boxLidGrad" x1="30" y1="64" x2="170" y2="92" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFEBF2" />
                <stop offset="1" stopColor="#F9BFD6" />
              </linearGradient>
            </defs>
          </svg>
        </button>
      </div>

      {/* Primary Interactive CTA */}
      <button
        type="button"
        disabled={opening}
        onClick={handleOpen}
        className="gacha-cta-btn inline-flex min-h-[52px] cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-full border-2 border-white px-8 py-3 font-display text-base font-bold tracking-wide text-white disabled:opacity-80 sm:text-lg"
      >
        <Gift className="h-5 w-5" />
        <span>{opening ? 'OPENING YOUR GIFT...' : 'OPEN YOUR LITTLE GIFT ♡'}</span>
      </button>
    </section>
  );
};
