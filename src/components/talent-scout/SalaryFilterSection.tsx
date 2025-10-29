import React from 'react';
import { IndianRupee } from 'lucide-react';
import { SearchFilters } from '../../types/talentScout.types';

interface SalaryFilterSectionProps {
  searchFilters: SearchFilters;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  enableSalaryFilter: boolean;
  setEnableSalaryFilter: (enabled: boolean) => void;
}

export const SalaryFilterSection: React.FC<SalaryFilterSectionProps> = ({
  searchFilters,
  setSearchFilters,
  enableSalaryFilter,
  setEnableSalaryFilter
}) => {
  return (
    <div className="mb-5 p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <IndianRupee className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-gray-900">Salary Budget Filter</h3>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded">AI-Powered</span>
        </div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={enableSalaryFilter}
            onChange={e => {
              setEnableSalaryFilter(e.target.checked);
              if (!e.target.checked) {
                setSearchFilters(prev => ({ ...prev, salaryBudget: null }));
              } else {
                setSearchFilters(prev => ({
                  ...prev,
                  salaryBudget: {
                    min: 800000,
                    max: 1500000,
                    includeNegotiable: true
                  }
                }));
              }
            }}
            className="w-5 h-5 text-emerald-600 focus:ring-2 focus:ring-emerald-500 rounded"
          />
          <span className="text-sm font-medium text-gray-700">Enable</span>
        </label>
      </div>

      {enableSalaryFilter && (
        <>
          <p className="text-xs text-gray-600 mb-3">
            Filter candidates by expected salary range. Our AI predicts salaries based on experience, skills, and location.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Min Budget (LPA) *
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="e.g., 8"
                value={searchFilters.salaryBudget?.min ? (searchFilters.salaryBudget.min / 100000).toFixed(1) : ''}
                onChange={e => {
                  const value = e.target.value ? Number(e.target.value) * 100000 : 0;
                  setSearchFilters(prev => ({
                    ...prev,
                    salaryBudget: {
                      min: value,
                      max: prev.salaryBudget?.max || value + 500000,
                      includeNegotiable: prev.salaryBudget?.includeNegotiable !== false
                    }
                  }));
                }}
                className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum acceptable salary</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Max Budget (LPA) *
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="e.g., 15"
                value={searchFilters.salaryBudget?.max ? (searchFilters.salaryBudget.max / 100000).toFixed(1) : ''}
                onChange={e => {
                  const value = e.target.value ? Number(e.target.value) * 100000 : 0;
                  setSearchFilters(prev => ({
                    ...prev,
                    salaryBudget: {
                      min: prev.salaryBudget?.min || 0,
                      max: value,
                      includeNegotiable: prev.salaryBudget?.includeNegotiable !== false
                    }
                  }));
                }}
                className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum budget available</p>
            </div>
          </div>
          <label className="flex items-center space-x-2 cursor-pointer bg-white p-3 rounded-lg border border-emerald-200">
            <input
              type="checkbox"
              checked={searchFilters.salaryBudget?.includeNegotiable !== false}
              onChange={e => {
                setSearchFilters(prev => ({
                  ...prev,
                  salaryBudget: prev.salaryBudget ? {
                    ...prev.salaryBudget,
                    includeNegotiable: e.target.checked
                  } : null
                }));
              }}
              className="w-4 h-4 text-emerald-600 focus:ring-2 focus:ring-emerald-500 rounded"
            />
            <span className="text-xs text-gray-700 font-medium">
              Include negotiable candidates (within 10-20% above max budget)
            </span>
          </label>
        </>
      )}
    </div>
  );
};
