import { Link } from 'react-router-dom';
import { useTravel } from '../context/TravelContext';

function Navbar() {
  const { user, currentTrip } = useTravel();

  return (
    <nav className="bg-beige-50 shadow-lg border-b border-beige-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-beige-100 p-2 rounded-lg">
              <img 
                src="/logo-icon.png" 
                alt="TripTactix Icon" 
                className="h-8 w-auto"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-secondary-900">TripTactix</span>
              <span className="text-xs text-secondary-600 -mt-1">Plan Smart. Pack Light. Explore Bold.</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-6">
                <Link
                  to="/destinations"
                  className="text-gray-700 hover:text-primary-600 font-medium"
                >
                  Discover
                </Link>
                <Link
                  to="/trips"
                  className="text-gray-700 hover:text-primary-600 font-medium"
                >
                  My Trips
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {user.name}!
                  </span>
                </div>
              </div>
            )}
            
            {!user && (
              <div className="flex items-center space-x-4">
                <Link
                  to="/onboarding"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
