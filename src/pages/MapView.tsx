import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useWildfire } from '../context/WildfireContext';
import { AlertTriangle, Calendar, Filter, Layers } from 'lucide-react';
import { FireData } from '../types';
import FilterPanel from '../components/FilterPanel';
import { LatLngBounds } from 'leaflet';

// Fix Leaflet marker icon issue
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// India bounds approximation
const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [6.5, 68.1], // Southwest
  [35.5, 97.4]  // Northeast
];

// Component to set map bounds
const SetBoundsControl = ({ bounds }: { bounds: [[number, number], [number, number]] }) => {
  const map = useMap();
  
  useEffect(() => {
    map.fitBounds(bounds);
  }, [map, bounds]);
  
  return null;
};

const MapView: React.FC = () => {
  const { fireData, isLoading, error, applyFilters } = useWildfire();
  const [showFilters, setShowFilters] = useState(false);
  const [mapLayer, setMapLayer] = useState<'standard' | 'satellite'>('standard');
  
  // Helper function to determine circle color based on confidence
  const getFireColor = (confidence: string): string => {
    switch(confidence) {
      case 'high': return '#E53E3E'; // red
      case 'nominal': return '#ED8936'; // orange
      case 'low': return '#ECC94B'; // yellow
      default: return '#E53E3E';
    }
  };
  
  // Helper function to determine circle radius based on FRP (Fire Radiative Power)
  const getFireRadius = (frp: number): number => {
    return Math.max(5, Math.min(15, frp / 5));
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertTriangle className="text-red-500 mr-2" />
          <p className="text-red-700">Error loading map: {error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full relative">
      <div className="bg-white shadow-sm rounded-md p-3 mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Live Wildfire Map</h1>
        <div className="flex space-x-2">
          <button 
            className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-1.5" />
            Filter
          </button>
          <button 
            className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setMapLayer(mapLayer === 'standard' ? 'satellite' : 'standard')}
          >
            <Layers size={16} className="mr-1.5" />
            {mapLayer === 'standard' ? 'Satellite' : 'Standard'}
          </button>
        </div>
      </div>
      
      {/* Filter panel (conditional) */}
      {showFilters && (
        <div className="bg-white shadow-md rounded-md p-4 mb-4">
          <FilterPanel onApplyFilters={applyFilters} onClose={() => setShowFilters(false)} />
        </div>
      )}
      
      {/* Map stats */}
      <div className="absolute top-16 right-4 z-[1000] bg-white p-3 rounded-md shadow-md text-sm">
        <p className="font-semibold text-gray-800">Active Fires: {fireData.length}</p>
        <p className="text-xs text-gray-500">Updated: {new Date().toLocaleTimeString()}</p>
      </div>
      
      {/* Map container */}
      <div className="h-[calc(100%-6rem)] rounded-md overflow-hidden shadow-md">
        <MapContainer
          center={[20.5937, 78.9629]} // Center of India
          zoom={5}
          style={{ height: '100%', width: '100%' }}
        >
          {/* Set initial bounds to India */}
          <SetBoundsControl bounds={INDIA_BOUNDS} />
          
          {/* Base map layer */}
          {mapLayer === 'standard' ? (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}
          
          {/* Fire markers */}
          {fireData.map((fire, index) => (
            <CircleMarker
              key={`${fire.latitude}-${fire.longitude}-${index}`}
              center={[fire.latitude, fire.longitude]}
              radius={getFireRadius(fire.frp)}
              pathOptions={{
                color: getFireColor(fire.confidence),
                fillColor: getFireColor(fire.confidence),
                fillOpacity: 0.7
              }}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-semibold">Fire Detection</h3>
                  <p><strong>Region:</strong> {fire.state}</p>
                  <p><strong>Date:</strong> {fire.acq_date}</p>
                  <p><strong>Time:</strong> {String(fire.acq_time).padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2')}</p>
                  <p><strong>Confidence:</strong> {fire.confidence}</p>
                  <p><strong>Brightness:</strong> {Math.round(fire.brightness)}K</p>
                  <p><strong>FRP:</strong> {fire.frp.toFixed(2)} MW</p>
                  <p><strong>Detected:</strong> {fire.daynight === 'D' ? 'Day' : 'Night'}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white p-3 rounded-md shadow-md">
        <h3 className="font-semibold text-sm mb-2">Legend</h3>
        <div className="space-y-1.5">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-600 mr-2"></div>
            <span className="text-xs">High Confidence</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
            <span className="text-xs">Nominal Confidence</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-xs">Low Confidence</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;