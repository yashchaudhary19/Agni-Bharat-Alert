import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Flame, MapPin, BarChart2, Info, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <BarChart2 className="mr-2" size={20} /> },
    { path: '/map', label: 'Live Map', icon: <MapPin className="mr-2" size={20} /> },
    { path: '/historical', label: 'Historical Data', icon: <BarChart2 className="mr-2" size={20} /> },
    { path: '/about', label: 'About', icon: <Info className="mr-2" size={20} /> },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center">
            <Flame className="text-red-500 mr-2" size={28} />
            <h1 className="text-xl font-bold text-gray-800">Agni Bharat Alert</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">Wildfire Risk Assessment</p>
        </div>
        <nav className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-4">
            <p className="text-xs uppercase font-semibold text-gray-500 mb-2">Main Navigation</p>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center w-full p-3 rounded-md mb-1 transition-colors ${
                  location.pathname === item.path
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </nav>
        <div className="p-4 text-center border-t border-gray-200 text-xs text-gray-500">
          <p>© 2025 Agni Bharat Alert</p>
        </div>
      </aside>

      {/* Mobile header and menu */}
      <div className="flex flex-col flex-1">
        <header className="md:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Flame className="text-red-500 mr-2" size={24} />
              <h1 className="text-lg font-bold text-gray-800">Agni Bharat Alert</h1>
            </div>
            <button onClick={toggleMenu} className="p-1">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          {isMenuOpen && (
            <nav className="mt-4">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center w-full p-3 rounded-md mb-1 transition-colors ${
                    location.pathname === item.path
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          )}
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;