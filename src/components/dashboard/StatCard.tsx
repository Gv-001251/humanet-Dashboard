import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: LucideIcon;
  iconBg: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconBg
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-4xl font-bold text-gray-900 mb-2">{value}</h3>
          <p className="text-gray-600 font-medium mb-3">{title}</p>
          <div className={`flex items-center gap-1 text-sm ${
            changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            <span>{changeType === 'increase' ? '↗' : '↘'}</span>
            <span>{change}</span>
          </div>
        </div>
        <div className={`w-14 h-14 ${iconBg} rounded-full flex items-center justify-center`}>
          <Icon className="w-7 h-7 text-blue-600" />
        </div>
      </div>
    </div>
  );
};
