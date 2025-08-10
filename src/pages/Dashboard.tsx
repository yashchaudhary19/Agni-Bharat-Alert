import React, { useState } from 'react';
import { useWildfire } from '../context/WildfireContext';
import { 
  AlertTriangle, 
  ThermometerSun, 
  Flame, 
  Wind, 
  Droplets,
  RefreshCw,
  MapPin
} from 'lucide-react';
import { 
  Pie, 
  Bar
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import RegionSelector from '../components/RegionSelector';
import StatusCard from '../components/StatusCard';
import FireList from '../components/FireList';

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Dashboard: React.FC = () => {
  const { 
    fireData, 
    weatherData, 
    isLoading, 
    error, 
    refreshData 
  } = useWildfire();
  
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('7d');
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wildfire data...</p>
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
          onClick={refreshData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // Calculate statistics
  const totalFires = fireData.length;
  const highConfidenceFires = fireData.filter(fire => fire.confidence === 'high').length;
  const activeRegions = [...new Set(fireData.map(fire => fire.state))].length;
  
  // Data for the confidence level pie chart
  const confidenceData = {
    labels: ['High', 'Nominal', 'Low'],
    datasets: [
      {
        data: [
          fireData.filter(fire => fire.confidence === 'high').length,
          fireData.filter(fire => fire.confidence === 'nominal').length,
          fireData.filter(fire => fire.confidence === 'low').length
        ],
        backgroundColor: ['#E53E3E', '#ED8936', '#ECC94B'],
        borderWidth: 0,
      },
    ],
  };
  
  // Data for the regions bar chart (top 5 regions by fire count)
  const regionCounts: Record<string, number> = {};
  fireData.forEach(fire => {
    regionCounts[fire.state] = (regionCounts[fire.state] || 0) + 1;
  });
  
  const topRegions = Object.entries(regionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  const regionData = {
    labels: topRegions.map(([region]) => region),
    datasets: [
      {
        label: 'Active Fires',
        data: topRegions.map(([, count]) => count),
        backgroundColor: '#E53E3E',
      },
    ],
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Wildfire Dashboard</h1>
        <div className="flex items-center">
          <button 
            onClick={refreshData}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors mr-2"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
          <RegionSelector />
        </div>
      </div>
      
      {/* Time selector for data range */}
      <div className="bg-white rounded-md p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Summary</h2>
          <div className="flex items-center space-x-1 text-sm">
            <button 
              onClick={() => setTimeframe('24h')}
              className={`px-3 py-1 rounded-md ${
                timeframe === '24h' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              24h
            </button>
            <button 
              onClick={() => setTimeframe('7d')}
              className={`px-3 py-1 rounded-md ${
                timeframe === '7d' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              7d
            </button>
            <button 
              onClick={() => setTimeframe('30d')}
              className={`px-3 py-1 rounded-md ${
                timeframe === '30d' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              30d
            </button>
          </div>
        </div>
        
        {/* Status cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatusCard 
            title="Active Fires"
            value={totalFires.toString()}
            icon={<Flame size={20} className="text-red-500" />}
            trend="+12%"
            trendType="up"
          />
          <StatusCard 
            title="High Confidence"
            value={`${Math.round((highConfidenceFires / totalFires) * 100)}%`}
            icon={<AlertTriangle size={20} className="text-orange-500" />}
            trend="-3%"
            trendType="down"
          />
          <StatusCard 
            title="Affected Regions"
            value={activeRegions.toString()}
            icon={<MapPin size={20} className="text-blue-500" />}
            trend="+2"
            trendType="up"
          />
        </div>
        
        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Fire Confidence Levels</h3>
            <div className="h-64">
              <Pie data={confidenceData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          
          <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Affected Regions</h3>
            <div className="h-64">
              <Bar 
                data={regionData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Number of Fires'
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Weather conditions for fire spread (if weather data available) */}
      {weatherData && (
        <div className="bg-white rounded-md p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Weather Conditions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-orange-50 p-4 rounded-md flex items-center">
              <ThermometerSun className="text-orange-500 mr-3" size={24} />
              <div>
                <p className="text-xs text-gray-500">Temperature</p>
                <p className="text-lg font-semibold">{Math.round(weatherData.current.temperature)}°C</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-md flex items-center">
              <Droplets className="text-blue-500 mr-3" size={24} />
              <div>
                <p className="text-xs text-gray-500">Humidity</p>
                <p className="text-lg font-semibold">{Math.round(weatherData.current.humidity)}%</p>
              </div>
            </div>
            <div className="bg-teal-50 p-4 rounded-md flex items-center">
              <Wind className="text-teal-500 mr-3" size={24} />
              <div>
                <p className="text-xs text-gray-500">Wind Speed</p>
                <p className="text-lg font-semibold">{Math.round(weatherData.current.windSpeed)} km/h</p>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-md flex items-center">
              <Compass className="text-purple-500 mr-3" size={24} />
              <div>
                <p className="text-xs text-gray-500">Wind Direction</p>
                <p className="text-lg font-semibold">{getWindDirection(weatherData.current.windDirection)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Recent fires list */}
      <div className="bg-white rounded-md p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Fire Detections</h2>
        <FireList fires={fireData.slice(0, 5)} />
      </div>
    </div>
  );
};

// Helper component for wind direction
const Compass = (props: any) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

// Helper function to convert wind direction in degrees to cardinal direction
function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export default Dashboard;