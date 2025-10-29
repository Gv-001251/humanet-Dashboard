import React from 'react';
import { IndianRupee } from 'lucide-react';
import { SearchFilters } from '../../types/talentScout.types';

interface SalaryFilterSectionProps {
  searchFilters: SearchFilters;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
}

export const SalaryFilterSection: React.FC<SalaryFilterSectionProps> = ({
  searchFilters,
  setSearchFilters
}) => {
  const handleSalaryChange = (key: 'min' | 'max', rawValue: string) => {
    const numericValue = rawValue ? Number(rawValue) * 100000 : null;

    setSearchFilters(prev => {
      const currentBudget = prev.salaryBudget || { min: null, max: null };
      const updatedBudget = {
        min: key === 'min' ? numericValue : currentBudget.min,
        max: key === 'max' ? numericValue : currentBudget.max
      };

      if (updatedBudget.min === null && updatedBudget.max === null) {
        return { ...prev, salaryBudget: null };
      }

      if (
        updatedBudget.min !== null &&
        updatedBudget.max !== null &&
        updatedBudget.max < updatedBudget.min
      ) {
        updatedBudget.max = updatedBudget.min;
      }

      return {
        ...prev,
        salaryBudget: {
          min: updatedBudget.min ?? 0,
          max: updatedBudget.max ?? (updatedBudget.min ? updatedBudget.min + 200000 : 0),
          includeNegotiable: true
        }
      };
    });
  };

  return (
    <div className="mb-5 p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
      <div className="flex items-center space-x-2 mb-3">
        <IndianRupee className="w-5 h-5 text-emerald-600" />
        <h3 className="text-sm font-bold text-gray-900">Salary Range (LPA)</h3>
      </div>

      <p className="text-xs text-gray-600 mb-3">
        Provide the allocated salary range for this role. We will determine the appropriate experience level based on this budget and show matching candidate profiles.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Minimum Salary
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            placeholder="e.g., 8"
            value={searchFilters.salaryBudget?.min ? (searchFilters.salaryBudget.min / 100000).toFixed(1) : ''}
            onChange={e => handleSalaryChange('min', e.target.value)}
            className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Lower bound of the offered package</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Maximum Salary
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            placeholder="e.g., 15"
            value={searchFilters.salaryBudget?.max ? (searchFilters.salaryBudget.max / 100000).toFixed(1) : ''}
            onChange={e => handleSalaryChange('max', e.target.value)}
            className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Upper bound of the offered package</p>
        </div>
      </div>
    </div>
  );
};
