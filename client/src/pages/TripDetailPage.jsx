import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTravel } from '../context/TravelContext';
import { tripService, advisoryService } from '../services/travelService';

function TripDetailPage() {
  const { tripId } = useParams();
  const { user, currentTrip, setCurrentTrip, setLoading, setError } = useTravel();
  const [trip, setTrip] = useState(null);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [generatingModule, setGeneratingModule] = useState(null);

  useEffect(() => {
    if (tripId && (!currentTrip || currentTrip._id !== tripId)) {
      fetchTrip();
    } else if (currentTrip) {
      setTrip(currentTrip);
    }
  }, [tripId, currentTrip]);

  const fetchTrip = async () => {
    setLoading(true);
    try {
      const response = await tripService.getTrip(tripId);
      setTrip(response.trip);
      setCurrentTrip(response.trip);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateAllRecommendations = async () => {
    setGeneratingAll(true);
    try {
      const response = await advisoryService.generateAllRecommendations(tripId);
      // Refresh trip data to get updated recommendations
      await fetchTrip();
    } catch (error) {
      setError(error.message);
    } finally {
      setGeneratingAll(false);
    }
  };

  const generateSingleRecommendation = async (type) => {
    setGeneratingModule(type);
    try {
      let response;
      switch (type) {
        case 'itinerary':
          response = await advisoryService.generateItinerary(tripId);
          break;
        case 'packing':
          response = await advisoryService.generatePacking(tripId);
          break;
        case 'cuisine':
          response = await advisoryService.generateCuisine(tripId);
          break;
        case 'accommodation':
          response = await advisoryService.generateAccommodation(tripId);
          break;
      }
      await fetchTrip();
    } catch (error) {
      setError(error.message);
    } finally {
      setGeneratingModule(null);
    }
  };

  if (!trip || !user) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  const advisoryModules = [
    {
      id: 'itinerary',
      title: 'Itinerary Advisor',
      description: 'Day-by-day personalized travel itinerary',
      icon: '📅',
      color: 'bg-green-500',
      generated: trip.recommendations?.itinerary?.generated || false,
      data: trip.recommendations?.itinerary?.data
    },
    {
      id: 'packing',
      title: 'Packing Advisor',
      description: 'Weather and activity-based packing lists',
      icon: '🎒',
      color: 'bg-purple-500',
      generated: trip.recommendations?.packing?.generated || false,
      data: trip.recommendations?.packing?.data
    },
    {
      id: 'cuisine',
      title: 'Cuisine Advisor',
      description: 'Local food experiences and restaurants',
      icon: '🍽️',
      color: 'bg-orange-500',
      generated: trip.recommendations?.cuisine?.generated || false,
      data: trip.recommendations?.cuisine?.data
    },
    {
      id: 'accommodation',
      title: 'Stay Advisor',
      description: 'Accommodation recommendations by type',
      icon: '🏨',
      color: 'bg-red-500',
      generated: trip.recommendations?.accommodation?.generated || false,
      data: trip.recommendations?.accommodation?.data
    }
  ];

  const hasAnyRecommendations = advisoryModules.some(module => module.generated);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Link 
          to="/trips"
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Trips
        </Link>
      </div>

      {/* Trip Header */}
      <div className="card p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {trip.destination} Trip
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>📍 {trip.destination}</span>
              <span>📅 {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
              <span>⏱️ {trip.duration} days</span>
              <span>👥 {trip.partySize} {trip.partySize === 1 ? 'traveler' : 'travelers'}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-2">Welcome back,</div>
            <div className="font-semibold text-gray-900">{user.name}</div>
          </div>
        </div>
      </div>

      {/* Generate All Button */}
      {!hasAnyRecommendations && (
        <div className="text-center mb-8">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Personalized Recommendations?
            </h2>
            <p className="text-gray-600 mb-6">
              Generate AI-powered recommendations for all aspects of your trip based on your preferences.
            </p>
            <button
              onClick={generateAllRecommendations}
              disabled={generatingAll}
              className={`btn-primary text-lg px-8 py-3 ${generatingAll ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {generatingAll ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Recommendations...
                </span>
              ) : (
                'Generate All Recommendations'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Advisory Modules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advisoryModules.map((module) => (
          <div key={module.id} className="card hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center text-2xl mr-4`}>
                  {module.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                  <p className="text-sm text-gray-600">{module.description}</p>
                </div>
              </div>

              {module.generated ? (
                <div className="space-y-3">
                  <div className="flex items-center text-green-600 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Recommendations generated
                  </div>
                  <Link
                    to={`/advisory/${tripId}/${module.id}`}
                    className="btn-primary w-full text-center block"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => generateSingleRecommendation(module.id)}
                    disabled={generatingModule === module.id}
                    className="btn-secondary w-full text-sm"
                  >
                    {generatingModule === module.id ? 'Regenerating...' : 'Regenerate'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-gray-500 text-sm">
                    No recommendations yet
                  </div>
                  <button
                    onClick={() => generateSingleRecommendation(module.id)}
                    disabled={generatingModule === module.id}
                    className={`btn-primary w-full ${generatingModule === module.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {generatingModule === module.id ? 'Generating...' : 'Generate'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      {hasAnyRecommendations && (
        <div className="mt-8 card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
          <div className="grid grid-cols-5 gap-4">
            {advisoryModules.map((module) => (
              <div key={module.id} className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  module.generated ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {module.generated ? '✓' : '○'}
                </div>
                <div className="text-xs text-gray-600">{module.title.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TripDetailPage;
