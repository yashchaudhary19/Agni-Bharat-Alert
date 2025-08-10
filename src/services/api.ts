import axios from 'axios';
import { 
  FireData, 
  WeatherData, 
  HistoricalData
} from '../types';

// NASA FIRMS API for satellite fire data
// This is a free API that provides active fire data
const FIRMS_API_URL = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv/';
// You would need to register for a free API key
const FIRMS_API_KEY = 'YOUR_FIRMS_API_KEY'; 
// Bounding box for India (approx)
const INDIA_BBOX = '68.1,6.5,97.4,35.5'; 

// Open Weather Map API for weather data
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
// You would need to register for a free API key
const WEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';

// Note: In a production app, you would store API keys in environment variables
// and not hardcode them

/**
 * Fetch active fire data from NASA FIRMS API
 * In production, you would use the actual NASA FIRMS API
 * For this demo, we'll use mock data for demonstration
 */
export const fetchFireData = async (): Promise<FireData[]> => {
  try {
    // In a real app, you would make a real API call like this:
    // const response = await axios.get(
    //   `${FIRMS_API_URL}${FIRMS_API_KEY}/${INDIA_BBOX}/1/VIIRS_SNPP_NRT`
    // );
    
    // For demonstration, we're using mock data
    return getMockFireData();
  } catch (error) {
    console.error('Error fetching fire data:', error);
    throw new Error('Failed to fetch fire data');
  }
};

/**
 * Fetch weather data for a specific location
 */
export const fetchWeatherData = async (
  lat: number, 
  lon: number
): Promise<WeatherData> => {
  try {
    // In a real app, you would make a real API call like this:
    // const response = await axios.get(
    //   `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
    // );
    // return response.data;
    
    // For demonstration, we're using mock data
    return getMockWeatherData(lat, lon);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
};

/**
 * Fetch historical wildfire data for trend analysis
 */
export const fetchHistoricalData = async (
  region: string = 'all',
  startDate: Date,
  endDate: Date
): Promise<HistoricalData[]> => {
  try {
    // In a real app, you would make a real API call
    // For demonstration, we're using mock data
    return getMockHistoricalData(region, startDate, endDate);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw new Error('Failed to fetch historical data');
  }
};

// Mock data for demonstration purposes
// In a real app, this would come from the APIs
function getMockFireData(): FireData[] {
  // Generate some realistic mock data across India
  const data: FireData[] = [];
  
  // Add some random fire clusters in various Indian states
  const states = [
    { name: 'Maharashtra', lat: 19.75, lon: 75.71 },
    { name: 'Madhya Pradesh', lat: 23.26, lon: 77.41 },
    { name: 'Karnataka', lat: 15.32, lon: 75.71 },
    { name: 'Uttarakhand', lat: 30.06, lon: 79.01 },
    { name: 'Odisha', lat: 20.95, lon: 85.09 },
    { name: 'Andhra Pradesh', lat: 15.91, lon: 79.74 },
    { name: 'Chhattisgarh', lat: 21.27, lon: 81.86 },
    { name: 'Assam', lat: 26.20, lon: 92.93 }
  ];
  
  // For each state, create some fire points
  states.forEach(state => {
    const fireCount = Math.floor(Math.random() * 15) + 3; // 3-18 fires per state
    
    for (let i = 0; i < fireCount; i++) {
      // Random offset from state center
      const latOffset = (Math.random() - 0.5) * 3;
      const lonOffset = (Math.random() - 0.5) * 3;
      
      // Random date within the last week
      const daysAgo = Math.floor(Math.random() * 7);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      // Format date as YYYY-MM-DD
      const acq_date = date.toISOString().split('T')[0];
      
      // Random hour
      const acq_time = Math.floor(Math.random() * 24) * 100;
      
      // Random confidence level
      const confidenceLevels = ['low', 'nominal', 'high'];
      const confidence = confidenceLevels[Math.floor(Math.random() * confidenceLevels.length)];
      
      // Random fire brightness temperature (typical VIIRS values)
      const brightness = 300 + Math.random() * 50;
      
      // Add to data array
      data.push({
        latitude: state.lat + latOffset,
        longitude: state.lon + lonOffset,
        brightness: brightness,
        acq_date: acq_date,
        acq_time: acq_time,
        confidence: confidence,
        state: state.name,
        frp: Math.random() * 50, // Fire Radiative Power (MW)
        daynight: Math.random() > 0.7 ? 'N' : 'D', // 30% chance of night fire
        satellite: 'VIIRS'
      });
    }
  });
  
  return data;
}

function getMockWeatherData(lat: number, lon: number): WeatherData {
  // Generate realistic weather data
  return {
    location: {
      latitude: lat,
      longitude: lon,
      name: "Sample Location",
    },
    current: {
      temperature: 25 + Math.random() * 10, // 25-35°C
      humidity: 30 + Math.random() * 40, // 30-70%
      windSpeed: 5 + Math.random() * 15, // 5-20 km/h
      windDirection: Math.floor(Math.random() * 360), // 0-359 degrees
      pressure: 1000 + Math.random() * 15, // 1000-1015 hPa
      description: "Partly Cloudy",
    },
    forecast: [
      {
        date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
        temperature: {
          min: 20 + Math.random() * 5,
          max: 30 + Math.random() * 8,
        },
        humidity: 40 + Math.random() * 30,
        windSpeed: 3 + Math.random() * 10,
      },
      {
        date: new Date(Date.now() + 86400000 * 2).toISOString(), // day after tomorrow
        temperature: {
          min: 20 + Math.random() * 5,
          max: 30 + Math.random() * 8,
        },
        humidity: 40 + Math.random() * 30,
        windSpeed: 3 + Math.random() * 10,
      },
      {
        date: new Date(Date.now() + 86400000 * 3).toISOString(), // day after
        temperature: {
          min: 20 + Math.random() * 5,
          max: 30 + Math.random() * 8,
        },
        humidity: 40 + Math.random() * 30,
        windSpeed: 3 + Math.random() * 10,
      },
    ],
  };
}

function getMockHistoricalData(
  region: string,
  startDate: Date,
  endDate: Date
): HistoricalData[] {
  const data: HistoricalData[] = [];
  
  // If no specific region, generate data for major regions
  const regions = region === 'all' 
    ? [
        'Maharashtra', 
        'Madhya Pradesh', 
        'Karnataka', 
        'Uttarakhand', 
        'Odisha', 
        'Andhra Pradesh',
        'Chhattisgarh',
        'Assam'
      ] 
    : [region];
  
  // Number of days between start and end
  const dayDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Create historical data for each day in the range
  for (let i = 0; i <= dayDiff; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateString = currentDate.toISOString().split('T')[0];
    
    // For each region, generate a data point
    regions.forEach(regionName => {
      data.push({
        date: dateString,
        region: regionName,
        fireCount: Math.floor(Math.random() * 20) + 1, // 1-20 fires
        area: Math.random() * 50, // area in sq km
        riskIndex: Math.random() * 10 // 0-10 risk index
      });
    });
  }
  
  return data;
}