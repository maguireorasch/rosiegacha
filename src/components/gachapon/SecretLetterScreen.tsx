import React, { useEffect, useState } from 'react';
import { FastForward, Heart, RotateCcw } from 'lucide-react';
import { gachaponAudio } from '../../lib/gachaponAudio';
import { SECRET_LETTER_TEXT } from '../../lib/gachaponData';

interface SecretLetterScreenProps {
  letterAlreadyOpened: boolean;
  onLetterOpened: () => void;
}

export const SecretLetterScreen: React.FC<SecretLetterScreenProps> = ({
  letterAlreadyOpened,
  onLetterOpened,
}) => {
  const [envelopeState, setEnvelopeState] = useState<'sealed' | 'breaking' | 'opened'>(
    letterAlreadyOpened ? 'opened' : 'sealed'
  );
  const [typedLength, setTypedLength] = useState(
    letterAlreadyOpened ? SECRET_LETTER_TEXT.length : 0
  );

  const isOpened = envelopeState === 'opened';
  const isTypingDone = typedLength >= SECRET_LETTER_TEXT.length;

  useEffect(() => {
    if (envelopeState !== 'opened') return;
    if (typedLength >= SECRET_LETTER_TEXT.length) return;

    const timer = window.setTimeout(() => {
      setTypedLength((prev) => Math.min(SECRET_LETTER_TEXT.length, prev + 2));
    }, 24);
    return () => window.clearTimeout(timer);
  }, [envelopeState, typedLength]);

  const handleOpenEnvelope = () => {
    if (envelopeState !== 'sealed') return;
    setEnvelopeState('breaking');
    gachaponAudio.playSealBreak();
    window.setTimeout(() => {
      setEnvelopeState('opened');
      setTypedLength(0);
      onLetterOpened();
    }, 520);
  };

  const handleReplay = () => {
    gachaponAudio.playButtonClick();
    setTypedLength(0);
  };

  const handleRevealAll = () => {
    gachaponAudio.playButtonClick();
    setTypedLength(SECRET_LETTER_TEXT.length);
  };

  return (
    <section className="animate-screen-enter mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-10 text-center sm:px-6">
      <p className="font-display text-xs uppercase tracking-[0.22em] text-[#9A486C]">
        Secret Screen
      </p>
      <h1 className="font-display mt-1.5 text-3xl font-bold text-[#4E2639] sm:text-4xl">
        ONE LAST THING, ROSIE...
      </h1>
      <p className="mt-2 text-base font-medium text-[#7E3958]">
        There&apos;s something I haven&apos;t told you yet.
      </p>

      {/* Sealed Envelope Stage */}
      {!isOpened ? (
        <div className="my-12 flex flex-col items-center">
          <button
            type="button"
            onClick={handleOpenEnvelope}
            aria-label="Open sealed letter from Deloniel"
            className={`group relative cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#EB5A91]/40 rounded-3xl transition-transform duration-500 ${
              envelopeState === 'breaking'
                ? 'scale-105 opacity-80'
                : 'hover:-translate-y-1.5'
            }`}
          >
            <div className="relative h-56 w-80 overflow-hidden rounded-3xl border-2 border-white bg-gradient-to-b from-[#FFDCEB] to-[#F9BBD4] shadow-[0_24px_48px_rgba(132,72,100,0.22)] sm:h-64 sm:w-96">
              {/* Envelope Top Triangular Flap */}
              <svg
                viewBox="0 0 384 150"
                className={`absolute left-0 top-0 w-full transition-transform duration-500 origin-top ${
                  envelopeState === 'breaking' ? '-rotate-x-90 -translate-y-4' : ''
                }`}
                fill="none"
              >
                <path
                  d="M0 0L192 128L384 0H0Z"
                  fill="#FFF2F7"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                />
              </svg>

              {/* Envelope Side Folds */}
              <svg
                viewBox="0 0 384 256"
                className="pointer-events-none absolute inset-0 h-full w-full"
                fill="none"
              >
                <path d="M0 256L160 120L0 0V256Z" fill="#FAD4E4" fillOpacity="0.65" />
                <path d="M384 256L224 120L384 0V256Z" fill="#FAD4E4" fillOpacity="0.65" />
              </svg>

              {/* Clickable Heart-Shaped Wax Seal */}
              <div
                className={`absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#FFDCEB] bg-[#D93B6E] shadow-[0_6px_16px_rgba(157,36,84,0.45)] transition-transform duration-300 ${
                  envelopeState === 'breaking'
                    ? 'scale-125 opacity-0'
                    : 'group-hover:scale-110'
                }`}
              >
                <Heart className="h-7 w-7 fill-[#FFF2F7] text-[#FFF2F7]" />
              </div>

              <span className="absolute bottom-4 left-0 right-0 font-handwritten text-xl font-bold text-[#9A486C]">
                For Hannalle Dewyrose (Rosie)
              </span>
            </div>
          </button>

          <p className="mt-5 font-display text-sm font-semibold text-[#B53B6D]">
            {envelopeState === 'breaking'
              ? 'Breaking the wax seal...'
              : 'Tap the heart wax seal to open your letter ♡'}
          </p>
        </div>
      ) : (
        /* Unfolded Cream Letter Paper With Typing Animation */
        <div className="animate-card-unfold mt-8 w-full max-w-2xl rounded-[30px] border-2 border-white bg-[#FFFDF9] p-6 text-left shadow-[0_22px_54px_rgba(78,38,57,0.16)] sm:p-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#FAD4E4] pb-3">
            <span className="font-handwritten text-xl font-bold text-[#B53B6D]">
              A Letter From Deloniel ♡
            </span>

            <div className="flex items-center gap-2">
              {!isTypingDone && (
                <button
                  type="button"
                  onClick={handleRevealAll}
                  className="inline-flex min-h-[34px] cursor-pointer items-center gap-1 rounded-full border border-[#FAD4E4] bg-[#FFF2F7] px-3 py-1 font-display text-xs font-semibold text-[#844864] hover:bg-[#FFE6F0]"
                >
                  <FastForward className="h-3.5 w-3.5" />
                  <span>Read Full Letter</span>
                </button>
              )}
              {isTypingDone && (
                <button
                  type="button"
                  onClick={handleReplay}
                  className="inline-flex min-h-[34px] cursor-pointer items-center gap-1 rounded-full border border-[#FAD4E4] bg-[#FFF2F7] px-3 py-1 font-display text-xs font-semibold text-[#844864] hover:bg-[#FFE6F0]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Replay</span>
                </button>
              )}
            </div>
          </div>

          <div className="font-handwritten whitespace-pre-line text-2xl leading-relaxed text-[#4E2639] sm:text-[26px]">
            {SECRET_LETTER_TEXT.slice(0, typedLength)}
            {!isTypingDone && (
              <span className="ml-0.5 inline-block animate-pulse text-[#EB5A91]">
                ♡
              </span>
            )}
          </div>

          <div className="mt-8 border-t border-[#FAD4E4] pt-4 text-center">
            <p className="text-xs font-semibold tracking-wide text-[#9A486C]">
              Made with a little thought and lots of care.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
