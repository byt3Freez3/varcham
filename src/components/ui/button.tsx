import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-jakarta font-semibold uppercase tracking-[0.08em] text-[13px] transition-all duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tulsi focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:pointer-events-none disabled:bg-sandal disabled:text-walnut/50 disabled:border-hairline active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-tulsi text-ivory hover:bg-tulsi-hover',
        secondary: 'border border-espresso bg-transparent text-espresso hover:bg-sandal',
        ghost: 'bg-transparent text-gold hover:underline underline-offset-4 hover:text-espresso normal-case tracking-normal text-sm',
        onDark: 'bg-ivory text-tulsi hover:bg-parchment',
        danger: 'bg-sindoor text-ivory hover:bg-[#8E2A23]',
        outlineLight: 'border border-ivory/60 bg-transparent text-ivory hover:bg-ivory/10',
      },
      size: {
        sm: 'h-10 px-4',
        default: 'h-12 px-6',
        lg: 'h-14 px-8',
        icon: 'h-11 w-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { buttonVariants };

