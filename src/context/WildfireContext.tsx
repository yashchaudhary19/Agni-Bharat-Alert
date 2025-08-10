import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchFireData, fetchWeatherData } from '../services/api';
import type { 
  FireData, 
  WeatherData, 
  Region,
  FireDataFilters
} from '../types';

interface WildfireContextType {
  fireData: FireData[];
  weatherData: WeatherData | null;
  selectedRegion: Region | null;
  isLoading: boolean;
  error: string | null;
  setSelectedRegion: (region: Region | null) => void;
  refreshData: () => void;
  applyFilters: (filters: FireDataFilters) => void;
}

const WildfireContext = createContext<WildfireContextType | undefined>(undefined);

export const WildfireProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fireData, setFireData] = useState<FireData[]>([]);
  const [filteredFireData, setFilteredFireData] = useState<FireData[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FireDataFilters>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
    confidence: 'all',
    region: 'all'
  });

  const fetchAllData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fires = await fetchFireData();
      setFireData(fires);
      setFilteredFireData(fires);
      
      // If a region is selected, fetch its weather data
      if (selectedRegion) {
        const weather = await fetchWeatherData(selectedRegion.latitude, selectedRegion.longitude);
        setWeatherData(weather);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // Set up polling for real-time updates (every 5 minutes)
    const intervalId = setInterval(fetchAllData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [selectedRegion]);

  useEffect(() => {
    applyFilters(filters);
  }, [fireData, filters]);

  const refreshData = () => {
    fetchAllData();
  };

  const applyFilters = (newFilters: FireDataFilters) => {
    setFilters(newFilters);
    
    let filtered = [...fireData];
    
    // Apply date filters
    if (newFilters.startDate && newFilters.endDate) {
      filtered = filtered.filter(fire => {
        const fireDate = new Date(fire.acq_date);
        return fireDate >= newFilters.startDate && fireDate <= newFilters.endDate;
      });
    }
    
    // Apply confidence filter
    if (newFilters.confidence !== 'all') {
      filtered = filtered.filter(fire => fire.confidence === newFilters.confidence);
    }
    
    // Apply region filter
    if (newFilters.region !== 'all') {
      filtered = filtered.filter(fire => fire.state === newFilters.region);
    }
    
    setFilteredFireData(filtered);
  };

  return (
    <WildfireContext.Provider
      value={{
        fireData: filteredFireData,
        weatherData,
        selectedRegion,
        isLoading,
        error,
        setSelectedRegion,
        refreshData,
        applyFilters
      }}
    >
      {children}
    </WildfireContext.Provider>
  );
};

export const useWildfire = (): WildfireContextType => {
  const context = useContext(WildfireContext);
  if (context === undefined) {
    throw new Error('useWildfire must be used within a WildfireProvider');
  }
  return context;
};