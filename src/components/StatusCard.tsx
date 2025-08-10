import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
}

const StatusCard: React.FC<StatusCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendType = 'neutral' 
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-full bg-red-50">
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-3 flex items-center">
          {trendType === 'up' ? (
            <TrendingUp size={16} className="text-red-600 mr-1" />
          ) : trendType === 'down' ? (
            <TrendingDown size={16} className="text-green-600 mr-1" />
          ) : null}
          
          <span 
            className={`text-xs ${
              trendType === 'up' 
                ? 'text-red-600' 
                : trendType === 'down' 
                  ? 'text-green-600' 
                  : 'text-gray-500'
            }`}
          >
            {trend} from previous period
          </span>
        </div>
      )}
    </div>
  );
};

export default StatusCard;