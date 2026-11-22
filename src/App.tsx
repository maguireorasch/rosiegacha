import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Gift,
  Heart,
  RotateCw,
  Shuffle,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { BonusSecretModal } from './components/gachapon/BonusSecretModal';
import { CapsuleRevealModal } from './components/gachapon/CapsuleRevealModal';
import { CollectionScreen } from './components/gachapon/CollectionScreen';
import { FloatingMusicPlayer } from './components/gachapon/FloatingMusicPlayer';
import { GachaponMachine3D } from './components/gachapon/GachaponMachine3D';
import { SecretLetterScreen } from './components/gachapon/SecretLetterScreen';
import { WelcomeGiftScreen } from './components/gachapon/WelcomeGiftScreen';
import { gachaponAudio } from './lib/gachaponAudio';
import {
  CAPSULE_CATEGORIES,
  ROSIE_50_MESSAGES,
  SECRET_BONUS_MESSAGES,
  shuffleIds,
} from './lib/gachaponData';
import {
  createDefaultGachaponState,
  loadGachaponState,
  saveGachaponState,
} from './lib/gachaponStorage';
import type {
  GachaponPhase,
  GachaponSaveState,
  RosieCapsuleMessage,
  ScreenId,
} from './types/gachapon';

const NAV_ITEMS: { id: ScreenId; label: string }[] = [
  { id: 'home', label: 'HOME' },
  { id: 'gachapon', label: 'GACHAPON' },
  { id: 'collection', label: 'COLLECTION' },
  { id: 'letter', label: 'SECRET LETTER' },
];

export function App() {
  const [saveState, setSaveState] = useState<GachaponSaveState>(() =>
    loadGachaponState()
  );
  const [screen, setScreen] = useState<ScreenId>(() =>
    loadGachaponState().giftOpened ? 'gachapon' : 'home'
  );
  const [phase, setPhase] = useState<GachaponPhase>('idle');
  const [spinSignal, setSpinSignal] = useState(0);
  const [pendingCapsule, setPendingCapsule] =
    useState<RosieCapsuleMessage | null>(null);
  const [openModalData, setOpenModalData] = useState<{
    capsule: RosieCapsuleMessage;
    fromCollection: boolean;
  } | null>(null);
  const [bonusMessage, setBonusMessage] = useState<string | null>(null);
  const [toastText, setToastText] = useState<string | null>(
    'A little happiness is waiting for you!'
  );
  const [showAllCollectedBurst, setShowAllCollectedBurst] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const collectedCount = Object.keys(saveState.collected).length;

  useEffect(() => {
    gachaponAudio.setSfxEnabled(saveState.sfxEnabled);
    saveGachaponState(saveState);
  }, [saveState]);

  // Dismiss toast gently after a few seconds
  useEffect(() => {
    if (!toastText) return;
    const t = window.setTimeout(() => setToastText(null), 4500);
    return () => window.clearTimeout(t);
  }, [toastText]);

  const handleFirstInteraction = useCallback(() => {
    if (!userInteracted) {
      setUserInteracted(true);
      if (saveState.musicEnabled) {
        gachaponAudio.setMusicEnabled(true);
      }
    }
  }, [userInteracted, saveState.musicEnabled]);

  const drawNextCapsule = useCallback(() => {
    handleFirstInteraction();
    if (phase !== 'idle' && phase !== 'ready') return;

    // Pick next non-repeating message from unusedIds
    let drawnMessage: RosieCapsuleMessage = ROSIE_50_MESSAGES[0];
    setSaveState((prev) => {
      let pool = [...prev.unusedIds];
      if (pool.length === 0) {
        pool = shuffleIds(
          ROSIE_50_MESSAGES.map((m) => m.id).filter(
            (id) => id !== prev.lastDrawnId
          )
        );
      }
      const chosenId = pool[0];
      const nextPool = pool.slice(1);
      drawnMessage =
        ROSIE_50_MESSAGES.find((m) => m.id === chosenId) ||
        ROSIE_50_MESSAGES[0];

      const nextCollected = {
        ...prev.collected,
        [drawnMessage.id]: prev.collected[drawnMessage.id] || {
          messageId: drawnMessage.id,
          color: drawnMessage.color,
          collectedAt: new Date().toISOString(),
        },
      };

      const prevCount = Object.keys(prev.collected).length;
      const newCount = Object.keys(nextCollected).length;
      if (prevCount < 50 && newCount === 50) {
        window.setTimeout(() => {
          setShowAllCollectedBurst(true);
          setToastText("YOU'VE COLLECTED ALL 50 CAPSULES! ♡");
        }, 1600);
      }

      return {
        ...prev,
        collected: nextCollected,
        unusedIds: nextPool,
        lastDrawnId: drawnMessage.id,
      };
    });

    window.setTimeout(() => {
      setPendingCapsule(drawnMessage);
      setSpinSignal((s) => s + 1);
      setToastText('Turned the handle — a capsule is dropping!');
    }, 0);
  }, [handleFirstInteraction, phase]);

  const handleOpenTrayCapsule = useCallback(() => {
    if (!pendingCapsule) return;
    gachaponAudio.playButtonClick();
    setOpenModalData({ capsule: pendingCapsule, fromCollection: false });
    setPendingCapsule(null);
    setPhase('idle');
  }, [pendingCapsule]);

  const handleToggleMusic = () => {
    setUserInteracted(true);
    setSaveState((prev) => {
      const next = !prev.musicEnabled;
      gachaponAudio.setMusicEnabled(next);
      return { ...prev, musicEnabled: next };
    });
  };

  const handleToggleSfx = () => {
    handleFirstInteraction();
    setSaveState((prev) => {
      const next = !prev.sfxEnabled;
      gachaponAudio.setSfxEnabled(next);
      if (next) gachaponAudio.playButtonClick();
      return { ...prev, sfxEnabled: next };
    });
  };

  const handleTriggerBonus = () => {
    handleFirstInteraction();
    gachaponAudio.playRewardReveal();
    const randomMsg =
      SECRET_BONUS_MESSAGES[
        Math.floor(Math.random() * SECRET_BONUS_MESSAGES.length)
      ];
    setBonusMessage(randomMsg);
  };

  const handleResetCollection = () => {
    setSaveState((prev) => ({
      ...createDefaultGachaponState(),
      musicEnabled: prev.musicEnabled,
      sfxEnabled: prev.sfxEnabled,
      giftOpened: prev.giftOpened,
    }));
    setPendingCapsule(null);
    setPhase('idle');
    setShowAllCollectedBurst(false);
    setToastText('Collection reset! 50 fresh surprises await ♡');
  };

  const celebrationConfetti = useMemo(() => {
    if (!showAllCollectedBurst) return [];
    const glyphs = ['♡', '✦', '★', '✿'];
    const colors = ['#EB5A91', '#FCE07A', '#92CCF4', '#C9B1FF', '#FF8FB8'];
    return Array.from({ length: 24 }, (_, idx) => {
      const angle = (idx / 24) * Math.PI * 2;
      const r = 160 + (idx % 3) * 45;
      return {
        id: idx,
        cx: `${Math.round(Math.cos(angle) * r)}px`,
        cy: `${Math.round(Math.sin(angle) * r - 40)}px`,
        crot: `${(idx % 2 === 0 ? 1 : -1) * (160 + idx * 14)}deg`,
        cdur: `${1.5 + (idx % 4) * 0.25}s`,
        symbol: glyphs[idx % glyphs.length],
        color: colors[idx % colors.length],
      };
    });
  }, [showAllCollectedBurst]);

  return (
    <div
      className="relative flex min-h-screen flex-col text-[#4E2639]"
      style={{
        background:
          'radial-gradient(circle at 18% 16%, rgba(255, 255, 255, 0.9) 0%, transparent 45%), radial-gradient(circle at 84% 22%, rgba(235, 219, 255, 0.55) 0%, transparent 45%), linear-gradient(180deg, #FFF2F7 0%, #FFE4EF 52%, #FAD1E3 100%)',
      }}
    >
      {/* Floating Pastel Hearts & Stars Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      >
        {[
          { left: '6%', dur: '17s', delay: '-2s', sym: '♡' },
          { left: '19%', dur: '22s', delay: '-11s', sym: '✦' },
          { left: '36%', dur: '19s', delay: '-6s', sym: '♡' },
          { left: '68%', dur: '21s', delay: '-14s', sym: '★' },
          { left: '84%', dur: '18s', delay: '-4s', sym: '♡' },
          { left: '94%', dur: '23s', delay: '-9s', sym: '✿' },
        ].map((item, idx) => (
          <span
            key={idx}
            className="animate-dreamy-float absolute -bottom-10 text-base text-[#EB5A91]/35"
            style={
              {
                left: item.left,
                '--float-dur': item.dur,
                animationDelay: item.delay,
              } as React.CSSProperties
            }
          >
            {item.sym}
          </span>
        ))}
      </div>

      {/* Global 50/50 Celebration Confetti */}
      {showAllCollectedBurst && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
        >
          {celebrationConfetti.map((c) => (
            <span
              key={c.id}
              className="animate-pastel-confetti absolute text-2xl select-none"
              style={
                {
                  color: c.color,
                  '--cx': c.cx,
                  '--cy': c.cy,
                  '--crot': c.crot,
                  '--cdur': c.cdur,
                } as React.CSSProperties
              }
            >
              {c.symbol}
            </span>
          ))}
        </div>
      )}

      {/* ================= 3-ZONE TOP NAVIGATION BAR ================= */}
      <header className="relative z-30 w-full border-b border-white/85 bg-[#FFF9FB]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3 sm:px-6">
          {/* Zone 1: Brand Title */}
          <button
            type="button"
            onClick={() => {
              handleFirstInteraction();
              gachaponAudio.playButtonClick();
              setScreen('home');
            }}
            className="font-display cursor-pointer whitespace-nowrap shrink-0 text-base font-bold text-[#4E2639] sm:text-lg"
          >
            Rosie&apos;s Little World ♡
          </button>

          {/* Zone 2: Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7"
          >
            {NAV_ITEMS.map((item) => {
              const active = screen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    handleFirstInteraction();
                    gachaponAudio.playButtonClick();
                    setScreen(item.id);
                  }}
                  className={`min-h-[38px] cursor-pointer whitespace-nowrap shrink-0 border-b-2 font-display text-xs font-semibold tracking-wider transition-colors ${
                    active
                      ? 'border-[#EB5A91] text-[#B53B6D]'
                      : 'border-transparent text-[#7E3958] hover:border-[#F7A8C9] hover:text-[#B53B6D]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Sound Mute/Unmute Primary Control */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleToggleSfx}
              aria-label={
                saveState.sfxEnabled
                  ? 'Mute machine sound effects'
                  : 'Unmute machine sound effects'
              }
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-[#FAD4E4] bg-white px-3.5 py-1.5 font-display text-xs font-semibold text-[#6E3450] shadow-sm hover:bg-[#FFF2F7]"
            >
              {saveState.sfxEnabled ? (
                <Volume2 className="h-4 w-4 text-[#EB5A91]" />
              ) : (
                <VolumeX className="h-4 w-4 text-[#A8708B]" />
              )}
              <span>{saveState.sfxEnabled ? 'Sound On' : 'Muted'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <nav
          aria-label="Mobile navigation"
          className="flex items-center justify-around border-t border-white/70 bg-[#FFF5F9]/90 px-2 py-1.5 md:hidden"
        >
          {NAV_ITEMS.map((item) => {
            const active = screen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  handleFirstInteraction();
                  gachaponAudio.playButtonClick();
                  setScreen(item.id);
                }}
                className={`min-h-[36px] cursor-pointer whitespace-nowrap px-2.5 py-1 font-display text-[11px] font-semibold tracking-wide ${
                  active ? 'text-[#B53B6D] underline decoration-2 underline-offset-4' : 'text-[#844864]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Cute Notification Popup */}
      {toastText && (
        <div
          role="status"
          className="animate-screen-enter fixed left-1/2 top-20 z-40 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-white bg-[#FFFDF9]/95 px-5 py-2 font-display text-xs font-semibold text-[#B53B6D] shadow-[0_12px_28px_rgba(132,72,100,0.2)] sm:text-sm"
        >
          <Heart className="mr-1.5 inline h-3.5 w-3.5 fill-[#EB5A91] text-[#EB5A91]" />
          {toastText}
        </div>
      )}

      {/* ================= SCREEN ROUTER ================= */}
      <main className="relative z-10 flex-1 pb-20">
        {screen === 'home' && (
          <WelcomeGiftScreen
            onOpenGift={() => {
              handleFirstInteraction();
              setSaveState((prev) => ({ ...prev, giftOpened: true }));
              setScreen('gachapon');
              setToastText('Welcome! Turn the handle for your first capsule ♡');
            }}
          />
        )}

        {screen === 'gachapon' && (
          <section className="animate-screen-enter mx-auto flex w-full max-w-5xl flex-col items-center px-4 pt-6 sm:px-6 sm:pt-8">
            <div className="max-w-2xl text-center">
              <p className="font-display text-xs uppercase tracking-[0.22em] text-[#9A486C]">
                Rosie&apos;s Happy Capsules
              </p>
              <h1 className="font-display mt-1 text-3xl font-bold text-[#4E2639] sm:text-4xl">
                ROSIE&apos;S LITTLE GACHAPON 🎀
              </h1>
              <p className="mt-1.5 text-sm font-medium text-[#7E3958] sm:text-base">
                Drag or click the turning handle on the machine, then open your capsule from the tray.
              </p>
            </div>

            {/* Clean Unboxed Progress & Category Counter Strip */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 border-y border-white/85 px-4 py-2 font-mono-num text-xs font-semibold text-[#7E3958]">
              <span>Collected: {collectedCount}/50</span>
              <span aria-hidden="true">·</span>
              <span>Remaining: {50 - collectedCount}</span>
              <span aria-hidden="true">·</span>
              <span>
                Status:{' '}
                {phase === 'idle'
                  ? 'Ready'
                  : phase === 'ready'
                    ? 'Capsule in Tray!'
                    : 'Spinning...'}
              </span>
            </div>

            {/* 3D Interactive Gachapon Machine */}
            <div className="mt-2 flex w-full flex-col items-center">
              <GachaponMachine3D
                phase={phase}
                spinSignal={spinSignal}
                dispensedColor={pendingCapsule?.color ?? null}
                hasDispensedInTray={Boolean(pendingCapsule)}
                onPhaseChange={setPhase}
                onRequestSpin={drawNextCapsule}
                onTrayCapsuleClick={handleOpenTrayCapsule}
              />

              {/* Action Bar Right Under Dispensing Tray */}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                {pendingCapsule && phase === 'ready' ? (
                  <button
                    type="button"
                    onClick={handleOpenTrayCapsule}
                    className="gacha-cta-btn inline-flex min-h-[50px] cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border-2 border-white px-8 py-3 font-display text-base font-bold text-white"
                  >
                    <Gift className="h-5 w-5" />
                    <span>OPEN CAPSULE IN TRAY ♡</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={phase !== 'idle'}
                    onClick={drawNextCapsule}
                    className="gacha-cta-btn inline-flex min-h-[50px] cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border-2 border-white px-8 py-3 font-display text-base font-bold text-white disabled:opacity-75"
                  >
                    <RotateCw
                      className={`h-5 w-5 ${
                        phase === 'cranking' || phase === 'bouncing'
                          ? 'animate-spin'
                          : ''
                      }`}
                    />
                    <span>
                      {phase === 'idle' ? 'TURN HANDLE ♡' : 'DISPENSING...'}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={phase !== 'idle'}
                  onClick={drawNextCapsule}
                  className="gacha-soft-btn inline-flex min-h-[48px] cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-[#F7A8C9] px-5 py-2.5 font-display text-sm font-semibold text-[#6E3450] disabled:opacity-60"
                >
                  <Shuffle className="h-4 w-4 text-[#EB5A91]" />
                  <span>Random Capsule</span>
                </button>

                <button
                  type="button"
                  onClick={handleTriggerBonus}
                  className="gacha-soft-btn inline-flex min-h-[48px] cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-[#DCCBFF] px-5 py-2.5 font-display text-sm font-semibold text-[#6544AE]"
                >
                  <Sparkles className="h-4 w-4 text-[#9B7CEB]" />
                  <span>Secret Bonus</span>
                </button>
              </div>
            </div>

            {/* Capsule Color Guide (Clean 5-Item Legend) */}
            <div className="mt-9 w-full max-w-3xl rounded-3xl border-2 border-white bg-white/75 p-5 shadow-sm">
              <h2 className="font-display text-center text-xs uppercase tracking-[0.2em] text-[#9A486C]">
                Capsule Colors &amp; Meanings
              </h2>
              <div className="mt-3.5 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {(['pink', 'yellow', 'white', 'blue', 'purple'] as const).map(
                  (col) => {
                    const cat = CAPSULE_CATEGORIES[col];
                    return (
                      <div
                        key={col}
                        className="flex flex-col items-center rounded-2xl border border-[#FAD4E4]/80 bg-[#FFFDF9] p-3 text-center"
                      >
                        <span
                          className="mb-1.5 h-5 w-5 rounded-full border-2 shadow-sm"
                          style={{
                            backgroundColor: cat.shellHex,
                            borderColor: col === 'white' ? '#E85A93' : '#FFFFFF',
                          }}
                        />
                        <span className="font-display text-xs font-bold text-[#4E2639] capitalize">
                          {col}
                        </span>
                        <span className="mt-0.5 text-[11px] leading-tight text-[#844864]">
                          {cat.meaning}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </section>
        )}

        {screen === 'collection' && (
          <CollectionScreen
            collected={saveState.collected}
            onSelectMessage={(msg) =>
              setOpenModalData({ capsule: msg, fromCollection: true })
            }
            onResetCollection={handleResetCollection}
            onGoToGachapon={() => setScreen('gachapon')}
            onGoToSecretLetter={() => setScreen('letter')}
          />
        )}

        {screen === 'letter' && (
          <SecretLetterScreen
            letterAlreadyOpened={saveState.letterOpened}
            onLetterOpened={() =>
              setSaveState((prev) => ({ ...prev, letterOpened: true }))
            }
          />
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-20 border-t border-white/85 bg-[#FFF8FB]/80 px-4 py-5 text-center">
        <p className="font-medium text-sm text-[#7E3958]">
          Made with care, just for Rosie.
        </p>
        <p className="font-handwritten mt-0.5 text-xl font-bold text-[#B53B6D]">
          — Deloniel ♡
        </p>
      </footer>

      {/* Floating Music Player */}
      <FloatingMusicPlayer
        musicEnabled={saveState.musicEnabled}
        onToggleMusic={handleToggleMusic}
      />

      {/* Capsule Split & Reminder Card Modal */}
      {openModalData && (
        <CapsuleRevealModal
          capsule={openModalData.capsule}
          fromCollection={openModalData.fromCollection}
          onGetAnother={() => {
            setOpenModalData(null);
            setScreen('gachapon');
            window.setTimeout(() => drawNextCapsule(), 160);
          }}
          onClose={() => setOpenModalData(null)}
        />
      )}

      {/* Secret Bonus Note Modal */}
      {bonusMessage && (
        <BonusSecretModal
          message={bonusMessage}
          onAnotherBonus={handleTriggerBonus}
          onClose={() => setBonusMessage(null)}
        />
      )}
    </div>
  );
}

export default App;
