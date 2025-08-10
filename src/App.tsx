import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import HistoricalData from './pages/HistoricalData';
import About from './pages/About';
import { WildfireProvider } from './context/WildfireContext';

function App() {
  return (
    <WildfireProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/historical" element={<HistoricalData />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </Router>
    </WildfireProvider>
  );
}

export default App;