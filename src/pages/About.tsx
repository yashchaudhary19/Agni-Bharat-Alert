import React from 'react';
import { Flame, Server, Database, Map, AlertTriangle, Cpu } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-red-600 to-orange-400 text-white rounded-lg p-8 shadow-md">
        <h1 className="text-3xl font-bold mb-4">About Agni Bharat Alert</h1>
        <p className="text-lg opacity-90">
          An advanced wildfire monitoring and risk assessment platform designed to provide real-time data and analytics for wildfire detection and prevention across India.
        </p>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Our Mission</h2>
        <p className="text-gray-600 mb-4">
          Agni Bharat Alert was created to address the growing challenges of wildfire management in India. Our platform combines cutting-edge satellite technology, real-time data analytics, and weather forecasting to provide actionable intelligence for wildfire prevention, early detection, and effective response.
        </p>
        <p className="text-gray-600">
          We aim to reduce the impact of wildfires on communities, ecosystems, and natural resources by providing stakeholders with the tools and information they need to make informed decisions.
        </p>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-md p-4 flex">
            <div className="mr-4 bg-red-50 p-3 rounded-full">
              <Flame size={24} className="text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Satellite Fire Detection</h3>
              <p className="text-sm text-gray-600">
                We utilize data from VIIRS (Visible Infrared Imaging Radiometer Suite) satellites to detect thermal anomalies that indicate active fires.
              </p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-md p-4 flex">
            <div className="mr-4 bg-blue-50 p-3 rounded-full">
              <Cpu size={24} className="text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Advanced Analytics</h3>
              <p className="text-sm text-gray-600">
                Our algorithms process satellite and weather data to identify fire locations, assess severity, and predict potential spread patterns.
              </p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-md p-4 flex">
            <div className="mr-4 bg-green-50 p-3 rounded-full">
              <Map size={24} className="text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">GIS Visualization</h3>
              <p className="text-sm text-gray-600">
                Interactive maps showcase fire locations, risk zones, and environmental factors to facilitate quick understanding and response.
              </p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-md p-4 flex">
            <div className="mr-4 bg-yellow-50 p-3 rounded-full">
              <AlertTriangle size={24} className="text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Risk Assessment</h3>
              <p className="text-sm text-gray-600">
                We combine weather forecasts, vegetation indices, and historical patterns to evaluate wildfire risks across different regions.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Data Sources</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-red-500">•</div>
            <p className="ml-2 text-gray-600">
              <span className="font-medium">NASA FIRMS:</span> Fire Information for Resource Management System provides near real-time active fire data from MODIS and VIIRS satellites.
            </p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-red-500">•</div>
            <p className="ml-2 text-gray-600">
              <span className="font-medium">OpenWeatherMap:</span> Provides current weather conditions and forecasts to assess fire risk factors like temperature, humidity, and wind.
            </p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-red-500">•</div>
            <p className="ml-2 text-gray-600">
              <span className="font-medium">Indian Forest Department:</span> Historical fire data and forest cover information to analyze patterns and vulnerable areas.
            </p>
          </li>
        </ul>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Future Developments</h2>
        <div className="space-y-4">
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
            <h3 className="font-semibold text-gray-800">Machine Learning Predictions</h3>
            <p className="text-sm text-gray-600">
              Implementing AI models to predict fire risk with greater accuracy based on historical patterns and environmental conditions.
            </p>
          </div>
          <div className="p-4 border-l-4 border-green-500 bg-green-50">
            <h3 className="font-semibold text-gray-800">Mobile Alerts</h3>
            <p className="text-sm text-gray-600">
              Developing a mobile app to deliver real-time alerts and notifications to communities and first responders in affected areas.
            </p>
          </div>
          <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
            <h3 className="font-semibold text-gray-800">Integration with IoT Sensors</h3>
            <p className="text-sm text-gray-600">
              Incorporating data from ground-based IoT sensors in high-risk forest areas to complement satellite observations.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
        <p className="text-gray-600 mb-4">
          For more information, partnerships, or technical support, please reach out to us:
        </p>
        <div className="space-y-2">
          <p className="text-gray-800"><strong>Email:</strong> info@agnibharatalert.org</p>
          <p className="text-gray-800"><strong>Phone:</strong> +91-11-2345-6789</p>
          <p className="text-gray-800"><strong>Address:</strong> Forest Research Institute, Dehradun, Uttarakhand, India</p>
        </div>
      </div>
      
      <footer className="text-center text-gray-500 text-sm py-4">
        <p>© 2025 Agni Bharat Alert. All rights reserved.</p>
        <p className="mt-1">Developed with ❤️ for India's forests and communities</p>
      </footer>
    </div>
  );
};

export default About;