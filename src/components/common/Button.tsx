import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  type = 'button',
  variant = 'primary',
  isLoading = false,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center px-5 py-2.5 border text-sm font-semibold rounded-xl transition-all duration-200 ease-gentle focus:outline-none focus:ring-4 focus:ring-offset-0';

  const variantClasses = {
    primary: 'text-white bg-brand-primary border-brand-primary hover:bg-brand-primaryHover hover:shadow-subtle focus:ring-brand-primary/20',
    secondary: 'text-white bg-neutral-subtler border-neutral-subtler hover:bg-neutral-text hover:shadow-subtle focus:ring-neutral-subtler/20',
    outline: 'text-neutral-text bg-white border-neutral-border hover:bg-slate-50 hover:border-brand-primary/40 hover:shadow-subtle focus:ring-brand-primary/20'
  }[variant];

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${className} ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};
