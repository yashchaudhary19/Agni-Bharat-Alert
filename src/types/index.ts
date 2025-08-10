// Type definitions for the application

// Fire data from satellite
export interface FireData {
  latitude: number;
  longitude: number;
  brightness: number; // brightness temperature in Kelvin
  acq_date: string; // acquisition date in format YYYY-MM-DD
  acq_time: number; // acquisition time in format HHMM
  confidence: string; // confidence level (low, nominal, high)
  state: string; // Indian state/territory
  frp: number; // Fire Radiative Power (MW)
  daynight: 'D' | 'N'; // Day or Night detection
  satellite: string; // satellite name
}

// Weather data
export interface WeatherData {
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  current: {
    temperature: number; // in Celsius
    humidity: number; // percentage
    windSpeed: number; // in km/h
    windDirection: number; // in degrees
    pressure: number; // in hPa
    description: string;
  };
  forecast: Array<{
    date: string; // ISO string
    temperature: {
      min: number;
      max: number;
    };
    humidity: number;
    windSpeed: number;
  }>;
}

// Geographic region data
export interface Region {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  boundaries?: Array<[number, number]>; // optional polygon boundaries
}

// Historical fire data for analysis
export interface HistoricalData {
  date: string; // format YYYY-MM-DD
  region: string;
  fireCount: number;
  area: number; // area affected in sq km
  riskIndex: number; // risk index on a scale (0-10)
}

// Filters for fire data
export interface FireDataFilters {
  startDate: Date;
  endDate: Date;
  confidence: 'low' | 'nominal' | 'high' | 'all';
  region: string;
}

// Risk assessment result
export interface RiskAssessment {
  region: string;
  currentRisk: number; // scale 0-10
  factors: {
    weather: number;
    vegetation: number;
    historicalTrend: number;
  };
  recommendations: string[];
}