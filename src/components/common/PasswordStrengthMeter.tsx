import React, { useEffect, useState } from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: number;
  strengthLabel: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const [validation, setValidation] = useState<PasswordValidation | null>(null);

  useEffect(() => {
    if (!password) {
      setValidation(null);
      return;
    }

    const checkPasswordStrength = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/validate-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });

        if (response.ok) {
          const data = await response.json();
          setValidation({
            isValid: data.isValid,
            errors: data.errors || [],
            strength: data.strength,
            strengthLabel: data.strengthLabel
          });
        }
      } catch (error) {
        console.error('Password validation error:', error);
      }
    };

    const timer = setTimeout(checkPasswordStrength, 300);
    return () => clearTimeout(timer);
  }, [password]);

  if (!validation || !password) {
    return null;
  }

  const getStrengthColor = (strength: number) => {
    if (strength < 40) return 'bg-red-500';
    if (strength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthTextColor = (strength: number) => {
    if (strength < 40) return 'text-red-600';
    if (strength < 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor(validation.strength)}`}
            style={{ width: `${validation.strength}%` }}
          />
        </div>
        <span className={`text-sm font-medium ${getStrengthTextColor(validation.strength)}`}>
          {validation.strengthLabel}
        </span>
      </div>
      
      {validation.errors.length > 0 && (
        <ul className="text-xs text-red-600 space-y-1">
          {validation.errors.map((error, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-1">•</span>
              <span>{error}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
