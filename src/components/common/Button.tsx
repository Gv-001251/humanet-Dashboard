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
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'text-white bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
    outline: 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-blue-500'
  }[variant];

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};
