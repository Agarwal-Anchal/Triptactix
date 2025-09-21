import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTravel } from '../context/TravelContext';
import { advisoryService } from '../services/travelService';

function DestinationsPage() {
  const { user, setLoading, setError } = useTravel();
  const [recommendations, setRecommendations] = useState(null);
  const [generating, setGenerating] = useState(false);

  const generateDestinations = async () => {
    if (!user) {
      setError('Please complete onboarding first');
      return;
    }

    setGenerating(true);
    try {
      const response = await advisoryService.generateDestinations(user._id);
      setRecommendations(response.recommendations);
    } catch (error) {
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete your profile first</h3>
        <p className="text-gray-600 mb-6">We need to know your preferences to recommend destinations.</p>
        <Link to="/onboarding" className="btn-primary">
          Complete Onboarding
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Your Next Adventure</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get personalized destination recommendations based on your travel style, interests, and preferences.
        </p>
      </div>

      {/* User Profile Summary */}
      <div className="card p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Travel Profile</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Travel Style:</span>
            <span className="ml-2 font-medium capitalize">{user.travelStyle}</span>
          </div>
          <div>
            <span className="text-gray-600">Budget:</span>
            <span className="ml-2 font-medium capitalize">{user.budgetRange}</span>
          </div>
          <div>
            <span className="text-gray-600">Group Type:</span>
            <span className="ml-2 font-medium capitalize">{user.groupType}</span>
          </div>
          <div>
            <span className="text-gray-600">Age Range:</span>
            <span className="ml-2 font-medium">{user.ageRange}</span>
          </div>
        </div>
        <div className="mt-3">
          <span className="text-gray-600">Interests:</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {user.interests?.map((interest, index) => (
              <span key={index} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Recommendations */}
      {!recommendations && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to explore?</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get AI-powered destination recommendations tailored to your unique travel preferences.
          </p>
          <button
            onClick={generateDestinations}
            disabled={generating}
            className={`btn-primary text-lg px-8 py-3 ${generating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {generating ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Generating Recommendations...
              </div>
            ) : (
              'Get My Recommendations'
            )}
          </button>
        </div>
      )}

      {/* Recommendations Results */}
      {recommendations && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Your Personalized Recommendations</h2>
            <button
              onClick={generateDestinations}
              disabled={generating}
              className="btn-secondary"
            >
              {generating ? 'Regenerating...' : 'Get New Recommendations'}
            </button>
          </div>

          <div className="grid gap-6">
            {recommendations.recommendations?.map((destination, index) => (
              <div key={index} className="card hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  {/* Destination Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{destination.destination}</h3>
                      <p className="text-gray-700 leading-relaxed">{destination.whyRecommended}</p>
                    </div>
                    <div className="text-center ml-6">
                      <div className="text-3xl font-bold text-primary-600 mb-1">{destination.matchScore}%</div>
                      <div className="text-sm text-gray-600">Match</div>
                    </div>
                  </div>

                  {/* Key Information */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Best Time to Visit</h4>
                      <p className="text-gray-700">{destination.bestTimeToVisit}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Estimated Budget</h4>
                      <p className="text-gray-700">{destination.estimatedBudget}</p>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Highlights</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {destination.highlights?.map((highlight, idx) => (
                        <div key={idx} className="flex items-start">
                          <span className="text-primary-600 mr-2">•</span>
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Travel Tips */}
                  {destination.travelTips && (
                    <div className="bg-beige-50 rounded-lg p-4">
                      <h4 className="font-semibold text-beige-900 mb-2">💡 Travel Tips</h4>
                      <ul className="space-y-1">
                        {destination.travelTips.map((tip, idx) => (
                          <li key={idx} className="text-beige-800 text-sm">• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center py-8 border-t">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Found your perfect destination?</h3>
            <p className="text-gray-600 mb-6">Start planning your trip and get detailed itineraries, packing lists, and more!</p>
            <Link to="/trip-planning" className="btn-primary text-lg px-8 py-3">
              Plan Your Trip
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default DestinationsPage;
