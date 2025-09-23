import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  const baseClasses =
    'btn font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled ?? isLoading} {...props}>
      {isLoading ? (
        <>
          <span className='loading loading-spinner loading-sm'></span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
