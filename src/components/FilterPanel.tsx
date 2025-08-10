import React, { useState } from 'react';
import { FireDataFilters } from '../types';
import { Calendar, Filter, X } from 'lucide-react';

interface FilterPanelProps {
  onApplyFilters: (filters: FireDataFilters) => void;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onApplyFilters, onClose }) => {
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [confidence, setConfidence] = useState<'all' | 'low' | 'nominal' | 'high'>('all');
  const [region, setRegion] = useState<string>('all');
  
  const indianStates = [
    'All Regions',
    'Maharashtra',
    'Madhya Pradesh',
    'Karnataka',
    'Uttarakhand',
    'Odisha',
    'Andhra Pradesh',
    'Chhattisgarh',
    'Assam'
  ];
  
  const handleApplyFilters = () => {
    onApplyFilters({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      confidence,
      region: region === 'All Regions' ? 'all' : region
    });
    onClose();
  };
  
  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filter Options</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={16} className="text-gray-400" />
            </div>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={16} className="text-gray-400" />
            </div>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="confidence" className="block text-sm font-medium text-gray-700 mb-1">
            Confidence Level
          </label>
          <select
            id="confidence"
            value={confidence}
            onChange={(e) => setConfidence(e.target.value as 'all' | 'low' | 'nominal' | 'high')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
          >
            <option value="all">All Confidence Levels</option>
            <option value="high">High Confidence</option>
            <option value="nominal">Nominal Confidence</option>
            <option value="low">Low Confidence</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
            Region
          </label>
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
          >
            {indianStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;