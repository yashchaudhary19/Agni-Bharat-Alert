import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { format, subMonths, subDays } from 'date-fns';
import { fetchHistoricalData } from '../services/api';
import { HistoricalData as HistoricalDataType } from '../types';
import { AlertTriangle, CalendarRange, MapPin, Download } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HistoricalDataPage: React.FC = () => {
  const [historicalData, setHistoricalData] = useState<HistoricalDataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '6m' | '1y'>('30d');
  
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
  
  // Calculate start and end dates based on selected time range
  const getDateRange = () => {
    const endDate = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '30d':
        startDate = subDays(endDate, 30);
        break;
      case '90d':
        startDate = subDays(endDate, 90);
        break;
      case '6m':
        startDate = subMonths(endDate, 6);
        break;
      case '1y':
        startDate = subMonths(endDate, 12);
        break;
      default:
        startDate = subDays(endDate, 30);
    }
    
    return { startDate, endDate };
  };
  
  const loadHistoricalData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { startDate, endDate } = getDateRange();
      const region = selectedRegion === 'All Regions' ? 'all' : selectedRegion;
      
      const data = await fetchHistoricalData(
        region,
        startDate,
        endDate
      );
      
      setHistoricalData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load historical data');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadHistoricalData();
  }, [selectedRegion, timeRange]);
  
  // Prepare data for charts
  const prepareChartData = () => {
    if (!historicalData.length) return null;
    
    // Group by date
    const groupedByDate: Record<string, { fireCount: number, area: number, riskIndex: number }> = {};
    
    historicalData.forEach(item => {
      if (!groupedByDate[item.date]) {
        groupedByDate[item.date] = {
          fireCount: 0,
          area: 0,
          riskIndex: 0
        };
      }
      
      groupedByDate[item.date].fireCount += item.fireCount;
      groupedByDate[item.date].area += item.area;
      
      // For risk index, we'll take the max value for the day
      groupedByDate[item.date].riskIndex = Math.max(
        groupedByDate[item.date].riskIndex,
        item.riskIndex
      );
    });
    
    // Sort dates
    const sortedDates = Object.keys(groupedByDate).sort();
    
    // Create chart data
    return {
      labels: sortedDates.map(date => format(new Date(date), 'dd MMM')),
      datasets: [
        {
          label: 'Fire Count',
          data: sortedDates.map(date => groupedByDate[date].fireCount),
          borderColor: '#E53E3E',
          backgroundColor: 'rgba(229, 62, 62, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Affected Area (sq km)',
          data: sortedDates.map(date => groupedByDate[date].area),
          borderColor: '#ED8936',
          backgroundColor: 'rgba(237, 137, 54, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };
  };
  
  const chartData = prepareChartData();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading historical data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertTriangle className="text-red-500 mr-2" />
          <p className="text-red-700">Error: {error}</p>
        </div>
        <button 
          onClick={loadHistoricalData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-md p-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Historical Fire Data</h1>
        
        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
              Select Region
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={16} className="text-gray-400" />
              </div>
              <select
                id="region"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
              >
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex-1">
            <label htmlFor="timerange" className="block text-sm font-medium text-gray-700 mb-1">
              Time Range
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarRange size={16} className="text-gray-400" />
              </div>
              <select
                id="timerange"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '30d' | '90d' | '6m' | '1y')}
                className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
              >
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
          </div>
          
          <div className="self-end">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download size={16} className="mr-2" />
              Export Data
            </button>
          </div>
        </div>
        
        {/* Chart */}
        {chartData && (
          <div className="h-80">
            <Line 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: 'index',
                  intersect: false,
                },
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: 'Fire Count'
                    },
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                      display: true,
                      text: 'Area (sq km)'
                    },
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                }
              }}
            />
          </div>
        )}
      </div>
      
      {/* Summary statistics */}
      <div className="bg-white rounded-md p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Summary Statistics</h2>
        
        {historicalData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Total Fires</p>
              <p className="text-2xl font-bold text-gray-800">
                {historicalData.reduce((sum, item) => sum + item.fireCount, 0)}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Total Area Affected</p>
              <p className="text-2xl font-bold text-gray-800">
                {historicalData.reduce((sum, item) => sum + item.area, 0).toFixed(2)} sq km
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Average Risk Index</p>
              <p className="text-2xl font-bold text-gray-800">
                {(
                  historicalData.reduce((sum, item) => sum + item.riskIndex, 0) / 
                  historicalData.length
                ).toFixed(1)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No data available for the selected criteria.</p>
        )}
      </div>
      
      {/* Data table */}
      {historicalData.length > 0 && (
        <div className="bg-white rounded-md p-4 shadow-sm overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Detailed Data</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fire Count
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Area (sq km)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Index
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {historicalData.slice(0, 10).map((item, index) => (
                  <tr key={`${item.date}-${item.region}-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(item.date), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.fireCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.area.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="h-2.5 rounded-full w-16 mr-2" 
                          style={{ 
                            background: `linear-gradient(90deg, #10B981 0%, #FBBF24 50%, #EF4444 100%)`,
                            backgroundSize: '100% 100%'
                          }}
                        ></div>
                        <span className="text-sm text-gray-900">{item.riskIndex.toFixed(1)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {historicalData.length > 10 && (
            <div className="mt-4 text-center">
              <button className="text-sm text-red-600 hover:text-red-800">
                Load More Data
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoricalDataPage;