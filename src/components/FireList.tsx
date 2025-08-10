import React from 'react';
import { FireData } from '../types';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock, Thermometer } from 'lucide-react';

interface FireListProps {
  fires: FireData[];
}

const FireList: React.FC<FireListProps> = ({ fires }) => {
  if (!fires.length) {
    return <p className="text-gray-500">No fire data available.</p>;
  }
  
  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Confidence
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brightness
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                FRP (MW)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fires.map((fire, index) => {
              // Format acquisition time (convert from HHMM to HH:MM)
              const timeStr = String(fire.acq_time).padStart(4, '0');
              const formattedTime = `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}`;
              
              // Get confidence level color
              const confidenceColor = 
                fire.confidence === 'high' ? 'bg-red-100 text-red-800' : 
                fire.confidence === 'nominal' ? 'bg-orange-100 text-orange-800' : 
                'bg-yellow-100 text-yellow-800';
              
              return (
                <tr key={`${fire.latitude}-${fire.longitude}-${index}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin size={16} className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{fire.state}</div>
                        <div className="text-xs text-gray-500">
                          {fire.latitude.toFixed(4)}, {fire.longitude.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar size={14} className="text-gray-400 mr-1" />
                        {fire.acq_date}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock size={14} className="text-gray-400 mr-1" />
                        {formattedTime} ({fire.daynight === 'D' ? 'Day' : 'Night'})
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${confidenceColor}`}>
                      {fire.confidence}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Thermometer size={14} className="text-orange-500 mr-1" />
                      {Math.round(fire.brightness)}K
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fire.frp.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FireList;