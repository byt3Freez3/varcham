import { cn } from '@/lib/utils';

export function DiyaTulsiMark({
  className = 'w-7 h-7',
  color = 'currentColor',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Flame */}
      <path
        d="M32 10C32 10 25.5 19.2 25.5 24.8C25.5 28.5 28.4 31.5 32 31.5C35.6 31.5 38.5 28.5 38.5 24.8C38.5 19.2 32 10 32 10Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 17.5C32 17.5 29.2 21.5 29.2 24.3C29.2 25.9 30.45 27.2 32 27.2C33.55 27.2 34.8 25.9 34.8 24.3C34.8 21.5 32 17.5 32 17.5Z"
        fill={color}
      />
      {/* Diya bowl */}
      <path
        d="M14 36H50C48.2 44.2 41.2 49.5 32 49.5C22.8 49.5 15.8 44.2 14 36Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Pedestal base */}
      <path
        d="M22 54H42"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Tulsi leaves flanking */}
      <path
        d="M21 24C17.2 21.8 13 23.4 12 26.8C15.5 27.8 19.2 26.8 21 24Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M43 24C46.8 21.8 51 23.4 52 26.8C48.5 27.8 44.8 26.8 43 24Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LotusGlyph({ className = 'w-5 h-5 text-gold' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M16 3C14 8 14 14 16 19C18 14 18 8 16 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M16 19C11.5 16.5 9 12.5 9.5 7.5C13 9.5 15 14 16 19Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M16 19C20.5 16.5 23 12.5 22.5 7.5C19 9.5 17 14 16 19Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M16 19C10 19 6 16.5 4.5 12.5C8.5 13 12.5 15.5 16 19Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M16 19C22 19 26 16.5 27.5 12.5C23.5 13 19.5 15.5 16 19Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrandLogo({
  variant = 'horizontal',
  compact = false,
  className,
}: {
  variant?: 'horizontal' | 'stacked' | 'reversed';
  compact?: boolean;
  className?: string;
}) {
  if (variant === 'stacked') {
    return (
      <div className={cn('inline-flex flex-col items-center text-center select-none', className)}>
        <DiyaTulsiMark className="w-10 h-10 text-gold mb-1" />
        <span lang="hi" className="font-hindi text-3xl leading-none text-tulsi">
          वर्चम
        </span>
        <span className="font-cinzel text-xs font-semibold tracking-[0.34em] text-gold mt-1.5">
          VARCHAM
        </span>
        <span className="font-cinzel text-[9px] tracking-[0.22em] text-walnut mt-1">
          ROOTED IN FAITH · INSPIRED BY DIVINE
        </span>
      </div>
    );
  }

  const isReversed = variant === 'reversed';

  return (
    <div className={cn('inline-flex items-center gap-2 md:gap-2.5 select-none', className)}>
      <DiyaTulsiMark
        className={cn(
          'transition-all duration-base ease-temple',
          // Mobile: 28px (~1.35x visual focus). Desktop: 32px standard / 28px compact
          'w-[28px] h-[28px]',
          compact ? 'md:w-7 md:h-7' : 'md:w-8 md:h-8',
          isReversed ? 'text-gold-light' : 'text-gold'
        )}
      />
      <div className="flex flex-col leading-none">
        <span
          lang="hi"
          className={cn(
            'font-hindi transition-all duration-base ease-temple',
            // Mobile: 26px wordmark. Desktop: 22px / 19px compact
            'text-[26px]',
            compact ? 'md:text-[19px]' : 'md:text-[22px]',
            isReversed ? 'text-ivory' : 'text-tulsi'
          )}
        >
          वर्चम
        </span>
        <span
          className={cn(
            'font-cinzel font-semibold mt-0.5',
            // Mobile: 11px tracking-[0.35em]. Desktop: 10px tracking-[0.3em] / 9px compact
            'text-[11px] tracking-[0.35em]',
            compact ? 'md:text-[9px] md:tracking-[0.3em]' : 'md:text-[10px] md:tracking-[0.3em]',
            isReversed ? 'text-gold-light' : 'text-gold'
          )}
        >
          VARCHAM
        </span>
      </div>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  onDark = false,
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === 'center' ? 'text-center mx-auto max-w-2xl' : 'text-left max-w-2xl',
        className
      )}
    >
      <p
        className={cn(
          'font-cinzel text-[11px] md:text-xs font-semibold uppercase tracking-[0.3em] mb-1.5 md:mb-2.5',
          onDark ? 'text-gold-light' : 'text-gold'
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          'font-playfair text-[26px] leading-[32px] md:text-[40px] md:leading-[1.2] font-normal',
          onDark ? 'text-ivory' : 'text-espresso'
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          'mt-2.5 md:mt-4 flex items-center gap-3',
          align === 'center' ? 'justify-center' : 'justify-start'
        )}
      >
        <span
          className={cn('h-px w-8', onDark ? 'bg-gold-light/60' : 'bg-gold/60')}
          aria-hidden="true"
        />
        <LotusGlyph className={cn('w-5 h-4', onDark ? 'text-gold-light' : 'text-gold')} />
        <span
          className={cn('h-px w-8', onDark ? 'bg-gold-light/60' : 'bg-gold/60')}
          aria-hidden="true"
        />
      </div>
      {subtitle && (
        <p
          className={cn(
            'mt-2.5 md:mt-4 text-[14px] md:text-base leading-relaxed max-w-[32ch] md:max-w-none mx-auto',
            onDark ? 'text-ivory/85' : 'text-walnut'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

