import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: 'primary' | 'secondary';
};

export function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent-300 disabled:cursor-not-allowed disabled:opacity-60';
  const variants = {
    primary: 'bg-ink-900 text-white hover:bg-ink-700',
    secondary: 'bg-white text-ink-900 ring-1 ring-ink-200 hover:bg-ink-100',
  };

  return (
    <button className={[base, variants[variant], className].join(' ')} {...props}>
      {children}
    </button>
  );
}