import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Bell as BellIcon, BellOff } from 'lucide-react';
import { bellAudio } from '@/lib/bellAudio';

export interface GhantaGarlandProps {
  variant?: 'hero' | 'full';
  bellCount?: number;
  speedSeconds?: number;
  sound?: boolean;
  className?: string;
  eyebrow?: string;
}

// Preset patterns for hand-hung rhythm
const THREAD_PATTERNS_FULL = [42, 52, 38, 56, 44, 48, 36, 50, 40, 54, 46, 38];
const SCALE_PATTERNS_FULL = [0.85, 1.0, 1.15, 0.95, 1.1, 0.8, 1.05, 1.15, 0.9, 1.0, 1.15, 0.85];

const THREAD_PATTERNS_HERO = [14, 18, 12, 20, 15, 17, 13, 19];
const SCALE_PATTERNS_HERO = [0.8]; // 0.8 scale only for hero variant

export function GhantaGarland({
  variant = 'full',
  bellCount = 36,
  speedSeconds = 90,
  sound = true,
  className = '',
  eyebrow = 'MANDIR GHANTA · घंटानाद',
}: GhantaGarlandProps) {
  const isHero = variant === 'hero';
  const effectiveSound = isHero ? false : sound;

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => bellAudio.isSoundEnabled());
  const [ringingMap, setRingingMap] = useState<Record<number, 'primary' | 'neighbour'>>({});
  const lastRingTimestampRef = useRef<Record<number, number>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [isDocVisible, setIsDocVisible] = useState(true);

  // Sync with global sound state
  useEffect(() => {
    const unsubscribe = bellAudio.subscribe((enabled) => {
      setSoundEnabled(enabled);
    });
    return unsubscribe;
  }, []);

  // IntersectionObserver to pause drift when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);

    const handleVisibility = () => {
      setIsDocVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const isDriftPaused = !isIntersecting || !isDocVisible;

  // Generate metadata for each bell in one copy
  const bellsData = useMemo(() => {
    const threadPatterns = isHero ? THREAD_PATTERNS_HERO : THREAD_PATTERNS_FULL;
    const scalePatterns = isHero ? SCALE_PATTERNS_HERO : SCALE_PATTERNS_FULL;

    return Array.from({ length: bellCount }, (_, i) => {
      const threadLength = threadPatterns[i % threadPatterns.length];
      const scale = scalePatterns[i % scalePatterns.length];
      // Deterministic pseudorandom values for idle sway
      const swayDuration = 4.2 + ((i * 1.37) % 1.8); // 4.2s to 6.0s
      const swayDelay = -((i * 1.61) % 5.0); // negative delay for desynchronization

      return {
        id: i,
        threadLength,
        scale,
        swayDuration,
        swayDelay,
      };
    });
  }, [bellCount, isHero]);

  // Handle bell trigger (hover or tap)
  const handleBellRing = (globalIndex: number) => {
    const now = Date.now();
    const lastTime = lastRingTimestampRef.current[globalIndex] || 0;

    // Ignore re-triggers within 300ms debounce
    if (now - lastTime < 300) return;
    lastRingTimestampRef.current[globalIndex] = now;

    // Trigger audio if sound is enabled
    if (effectiveSound) {
      bellAudio.playRing();
    }

    // Mark primary bell and ±1 neighbours
    const nextRinging = { ...ringingMap };
    nextRinging[globalIndex] = 'primary';

    const prevIndex = globalIndex - 1;
    const nextIndex = globalIndex + 1;

    // If neighbours exist, mark them as 'neighbour'
    if (prevIndex >= 0) {
      nextRinging[prevIndex] = 'neighbour';
    }
    if (nextIndex < bellCount * 2) {
      nextRinging[nextIndex] = 'neighbour';
    }

    setRingingMap(nextRinging);

    // Clear neighbour animation after 960ms (900ms duration + 60ms delay)
    setTimeout(() => {
      setRingingMap((prev) => {
        const copy = { ...prev };
        if (copy[prevIndex] === 'neighbour') delete copy[prevIndex];
        if (copy[nextIndex] === 'neighbour') delete copy[nextIndex];
        return copy;
      });
    }, 960);

    // Clear primary animation after 1100ms
    setTimeout(() => {
      setRingingMap((prev) => {
        const copy = { ...prev };
        if (copy[globalIndex] === 'primary') delete copy[globalIndex];
        return copy;
      });
    }, 1100);
  };

  const handleToggleSound = () => {
    bellAudio.toggleSound();
  };

  // Height and spacing classes based on variant
  const sectionHeightClass = isHero ? 'h-[56px]' : 'h-[120px]';
  const bellItemWidthClass = 'w-[56px] md:w-[72px]'; // 56px mobile / 72px desktop

  return (
    <section
      ref={containerRef}
      className={`relative w-full bg-ivory overflow-hidden select-none ${sectionHeightClass} ${className}`}
      style={{ touchAction: 'pan-y' }}
      aria-label="Temple Bell Garland"
    >
      {/* Inline styles for scoped keyframes and animations */}
      <style>{`
        @keyframes ghanta-drift-ltr {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0%, 0, 0);
          }
        }

        @keyframes ghanta-sway-anim {
          0% {
            transform: rotate(-1.5deg);
          }
          100% {
            transform: rotate(1.5deg);
          }
        }

        @keyframes ghanta-ring-primary-anim {
          0% { transform: rotate(0deg); }
          15% { transform: rotate(12deg); }
          35% { transform: rotate(-9deg); }
          55% { transform: rotate(6deg); }
          75% { transform: rotate(-3deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes ghanta-ring-neighbour-anim {
          0% { transform: rotate(0deg); }
          20% { transform: rotate(4deg); }
          45% { transform: rotate(-3deg); }
          70% { transform: rotate(1.5deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes ghanta-clapper-anim {
          0% { transform: translateX(0px); }
          15% { transform: translateX(-2.2px); }
          35% { transform: translateX(1.8px); }
          55% { transform: translateX(-1px); }
          75% { transform: translateX(0.5px); }
          100% { transform: translateX(0px); }
        }

        .ghanta-track {
          display: flex;
          width: 200%;
          will-change: transform;
          animation: ghanta-drift-ltr ${speedSeconds}s linear infinite;
        }

        .ghanta-swaying {
          animation: ghanta-sway-anim 5s ease-in-out infinite alternate;
          transform-origin: 28px 0px;
        }

        @media (min-width: 768px) {
          .ghanta-swaying {
            transform-origin: 36px 0px;
          }
        }

        .ghanta-ringing-primary {
          animation: ghanta-ring-primary-anim 1.1s cubic-bezier(0.25, 1, 0.5, 1) !important;
          transform-origin: 28px 0px;
        }
        @media (min-width: 768px) {
          .ghanta-ringing-primary {
            transform-origin: 36px 0px;
          }
        }

        .ghanta-ringing-neighbour {
          animation: ghanta-ring-neighbour-anim 0.9s cubic-bezier(0.25, 1, 0.5, 1) 60ms !important;
          transform-origin: 28px 0px;
        }
        @media (min-width: 768px) {
          .ghanta-ringing-neighbour {
            transform-origin: 36px 0px;
          }
        }

        .ghanta-clapper-active {
          animation: ghanta-clapper-anim 1.1s ease-out !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .ghanta-track {
            animation: none !important;
            transform: translate3d(0, 0, 0) !important;
          }
          .ghanta-swaying {
            animation: none !important;
            transform: rotate(0deg) !important;
          }
          .ghanta-ringing-primary {
            animation: ghanta-ring-reduced 200ms ease-out !important;
          }
          .ghanta-ringing-neighbour {
            animation: none !important;
          }
          @keyframes ghanta-ring-reduced {
            0% { transform: rotate(0deg); }
            50% { transform: rotate(4deg); }
            100% { transform: rotate(0deg); }
          }
        }
      `}</style>

      {/* SVG Definitions for Ghanta & Gradients (reusable symbol) */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true" focusable="false">
        <defs>
          {/* Authentic Temple Brass Gradient */}
          <linearGradient id="varcham-ghanta-brass" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A96A" />
            <stop offset="28%" stopColor="#EFE3CC" />
            <stop offset="50%" stopColor="#8C6D38" />
            <stop offset="78%" stopColor="#5A3E2B" />
            <stop offset="100%" stopColor="#29180E" />
          </linearGradient>

          {/* Clapper / Gold-Light Highlight */}
          <linearGradient id="varcham-ghanta-clapper" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FDFBF7" />
            <stop offset="50%" stopColor="#C9A96A" />
            <stop offset="100%" stopColor="#8C6D38" />
          </linearGradient>

          {/* One reusable Indian Temple Ghanta Bell Symbol (~28px wide × 36px tall) */}
          <symbol id="varcham-ghanta-symbol" viewBox="0 0 28 36">
            {/* Top Loop / Eyelet */}
            <circle
              cx="14"
              cy="4"
              r="3.4"
              fill="none"
              stroke="url(#varcham-ghanta-brass)"
              strokeWidth="1.6"
            />
            <circle cx="14" cy="4" r="1.6" fill="#FDFBF7" />

            {/* Stepped Finial / Crown Bead */}
            <rect
              x="11.5"
              y="6.8"
              width="5"
              height="2"
              rx="0.6"
              fill="url(#varcham-ghanta-brass)"
            />

            {/* Domed Shoulder & Flared Lip Body */}
            <path
              d="M 11.5 8.8 
                 C 11.5 8.8, 8 13, 6 18 
                 C 4.6 21.8, 5.4 24, 4.4 27 
                 C 3.4 29.5, 1 30.5, 1 31.6 
                 C 1 32.6, 3 33.2, 14 33.2 
                 C 25 33.2, 27 32.6, 27 31.6 
                 C 27 30.5, 24.6 29.5, 23.6 27 
                 C 22.6 24, 23.4 21.8, 22 18 
                 C 20 13, 16.5 8.8, 16.5 8.8 
                 Z"
              fill="url(#varcham-ghanta-brass)"
              stroke="#5A3E2B"
              strokeWidth="0.5"
            />

            {/* Engraved Sacred Grooves */}
            <path
              d="M 6.4 19.8 Q 14 21.8 21.6 19.8"
              fill="none"
              stroke="#C9A96A"
              strokeWidth="0.75"
              opacity="0.85"
            />
            <path
              d="M 5.4 22.8 Q 14 24.8 22.6 22.8"
              fill="none"
              stroke="#5A3E2B"
              strokeWidth="0.6"
              opacity="0.9"
            />

            {/* Flared Rim Highlight */}
            <path
              d="M 1.2 31.6 C 1.2 32.5, 3.2 33.2, 14 33.2 C 24.8 33.2, 26.8 32.5, 26.8 31.6"
              fill="none"
              stroke="#C9A96A"
              strokeWidth="1.2"
            />

            {/* Inner Hollow Shadow */}
            <ellipse cx="14" cy="32.2" rx="11.8" ry="1.2" fill="#29180E" opacity="0.65" />

            {/* Clapper / Ghanta Loli below the lip */}
            <g className="ghanta-clapper-stem">
              <line
                x1="14"
                y1="28"
                x2="14"
                y2="33.5"
                stroke="#8C6D38"
                strokeWidth="1.5"
              />
              <circle
                cx="14"
                cy="34.5"
                r="2.2"
                fill="url(#varcham-ghanta-clapper)"
                stroke="#5A3E2B"
                strokeWidth="0.4"
              />
            </g>
          </symbol>
        </defs>
      </svg>

      {/* 1. Horizontal Brass Rod (2px Gold #8C6D38 + 1px Gold-Light #C9A96A Highlight) */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] pointer-events-none z-20"
        aria-hidden="true"
      >
        <div className="h-[2px] w-full bg-gold" />
        <div className="h-[1px] w-full bg-gold-light" />
      </div>

      {/* 2. Drifting Track with Two Side-by-Side Copies for Seamless Loop */}
      <div
        role="presentation"
        aria-hidden="true"
        className={`ghanta-track ${isHero ? 'opacity-50' : 'opacity-100'}`}
        style={{
          animationPlayState: isDriftPaused ? 'paused' : 'running',
        }}
      >
        {[0, 1].map((copyIdx) => (
          <div key={copyIdx} className="flex shrink-0">
            {bellsData.map((bell, i) => {
              const globalIndex = copyIdx * bellCount + i;
              const ringState = ringingMap[globalIndex];

              const ringClass =
                ringState === 'primary'
                  ? 'ghanta-ringing-primary'
                  : ringState === 'neighbour'
                  ? 'ghanta-ringing-neighbour'
                  : 'ghanta-swaying';

              const clapperClass = ringState ? 'ghanta-clapper-active' : '';

              // Anchor X is center of the bell container
              const anchorXDesktop = 36;
              const anchorXMobile = 28;
              const bellWidth = 28 * bell.scale;
              const bellHeight = 36 * bell.scale;

              return (
                <div
                  key={bell.id}
                  className={`relative flex justify-center shrink-0 cursor-pointer ${bellItemWidthClass} ${sectionHeightClass}`}
                  onPointerEnter={() => handleBellRing(globalIndex)}
                  onClick={() => handleBellRing(globalIndex)}
                >
                  <svg
                    className={`w-full h-full overflow-visible transition-transform duration-75 ${ringClass}`}
                    style={{
                      animationDuration: ringState ? undefined : `${bell.swayDuration}s`,
                      animationDelay: ringState ? undefined : `${bell.swayDelay}s`,
                    }}
                    viewBox={`0 0 72 ${isHero ? 56 : 120}`}
                    preserveAspectRatio="xMidYMin meet"
                  >
                    {/* Hanging Thread (1px, walnut #5A3E2B) */}
                    <line
                      x1={anchorXDesktop}
                      y1="0"
                      x2={anchorXDesktop}
                      y2={bell.threadLength}
                      stroke="#5A3E2B"
                      strokeWidth="1"
                    />

                    {/* Bell Instance via <use> */}
                    <g
                      transform={`translate(${anchorXDesktop - bellWidth / 2}, ${bell.threadLength})`}
                      className={clapperClass}
                    >
                      <use
                        href="#varcham-ghanta-symbol"
                        width={bellWidth}
                        height={bellHeight}
                      />
                    </g>
                  </svg>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 3. Centred Cinzel Gold Eyebrow below garland (Variant 'full' only) */}
      {!isHero && eyebrow && (
        <div
          className="absolute bottom-2 left-0 right-0 text-center pointer-events-none select-none z-10"
          aria-hidden="true"
        >
          <p className="font-cinzel text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-gold/90 font-medium">
            {eyebrow}
          </p>
        </div>
      )}

      {/* 4. Sound Toggle Button (Variant 'full' only) */}
      {!isHero && effectiveSound && (
        <div className="absolute right-4 md:right-8 top-3 z-30">
          <button
            type="button"
            onClick={handleToggleSound}
            aria-pressed={soundEnabled}
            aria-label={soundEnabled ? 'Mute temple bells' : 'Enable temple bell sound'}
            title={soundEnabled ? 'Sound on' : 'Sound off'}
            className="w-8 h-8 rounded-full border border-gold/40 bg-ivory/90 hover:bg-parchment text-espresso flex items-center justify-center transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-gold-light"
          >
            {soundEnabled ? (
              <BellIcon className="w-4 h-4 text-tulsi" />
            ) : (
              <BellOff className="w-4 h-4 text-walnut/60" />
            )}
          </button>
        </div>
      )}
    </section>
  );
}
