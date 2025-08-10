import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useWildfire } from '../context/WildfireContext';

const RegionSelector: React.FC = () => {
  const { setSelectedRegion } = useWildfire();
  const [isOpen, setIsOpen] = useState(false);
  
  const indianRegions = [
    { id: 'all', name: 'All India', latitude: 20.5937, longitude: 78.9629 },
    { id: 'mh', name: 'Maharashtra', latitude: 19.7515, longitude: 75.7139 },
    { id: 'mp', name: 'Madhya Pradesh', latitude: 23.4733, longitude: 77.9470 },
    { id: 'ka', name: 'Karnataka', latitude: 15.3173, longitude: 75.7139 },
    { id: 'uk', name: 'Uttarakhand', latitude: 30.0668, longitude: 79.0193 },
    { id: 'od', name: 'Odisha', latitude: 20.9517, longitude: 85.0985 },
    { id: 'ap', name: 'Andhra Pradesh', latitude: 15.9129, longitude: 79.7400 },
    { id: 'cg', name: 'Chhattisgarh', latitude: 21.2787, longitude: 81.8661 },
    { id: 'as', name: 'Assam', latitude: 26.2006, longitude: 92.9376 }
  ];
  
  const handleSelectRegion = (region: typeof indianRegions[0]) => {
    setSelectedRegion(region);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <MapPin size={16} className="mr-2" />
        Select Region
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1 max-h-64 overflow-y-auto">
            {indianRegions.map((region) => (
              <li key={region.id}>
                <button
                  onClick={() => handleSelectRegion(region)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {region.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RegionSelector;