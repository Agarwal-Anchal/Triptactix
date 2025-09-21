import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTravel } from '../context/TravelContext';
import { tripService } from '../services/travelService';

function TripsPage() {
  const { user, setLoading, setError } = useTravel();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await tripService.getUserTrips(user._id);
      setTrips(response.trips || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTripStatus = (trip) => {
    const today = new Date();
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);

    if (today < startDate) return { status: 'upcoming', color: 'bg-green-100 text-green-800' };
    if (today >= startDate && today <= endDate) return { status: 'ongoing', color: 'bg-green-100 text-green-800' };
    return { status: 'completed', color: 'bg-gray-100 text-gray-800' };
  };

  const getProgressPercentage = (trip) => {
    const modules = ['itinerary', 'packing', 'cuisine', 'accommodation'];
    const completed = modules.filter(module => 
      trip.recommendations?.[module]?.generated
    ).length;
    return Math.round((completed / modules.length) * 100);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please complete onboarding to view your trips.</p>
        <Link to="/onboarding" className="btn-primary mt-4 inline-block">
          Complete Onboarding
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
          <p className="text-gray-600 mt-2">Plan and manage your adventures</p>
        </div>
        <Link to="/trip-planning" className="btn-primary">
          Plan New Trip
        </Link>
      </div>

      {/* Quick Stats */}
      {trips.length > 0 && (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-primary-600">{trips.length}</div>
            <div className="text-sm text-gray-600">Total Trips</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {trips.filter(trip => getTripStatus(trip).status === 'upcoming').length}
            </div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {trips.filter(trip => getTripStatus(trip).status === 'ongoing').length}
            </div>
            <div className="text-sm text-gray-600">Ongoing</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {trips.filter(trip => getTripStatus(trip).status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>
      )}

      {/* Trips List */}
      {trips.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips yet</h3>
          <p className="text-gray-600 mb-6">Start planning your first adventure!</p>
          <Link to="/trip-planning" className="btn-primary">
            Plan Your First Trip
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const tripStatus = getTripStatus(trip);
            const progress = getProgressPercentage(trip);
            
            return (
              <Link
                key={trip._id}
                to={`/trip/${trip._id}`}
                className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Trip Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {trip.destination}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tripStatus.color}`}>
                      {tripStatus.status}
                    </span>
                  </div>

                  {/* Trip Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{trip.duration} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Party Size:</span>
                      <span className="font-medium">{trip.partySize} {trip.partySize === 1 ? 'person' : 'people'}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Planning Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Recommendations Status */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['itinerary', 'packing', 'cuisine', 'accommodation'].map((module) => (
                      <div 
                        key={module}
                        className={`flex items-center ${
                          trip.recommendations?.[module]?.generated 
                            ? 'text-green-600' 
                            : 'text-gray-400'
                        }`}
                      >
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {module.charAt(0).toUpperCase() + module.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TripsPage;
