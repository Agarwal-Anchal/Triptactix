import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTravel } from '../context/TravelContext';
import { tripService } from '../services/travelService';

function AdvisoryDetail() {
  const { tripId, type } = useParams();
  const { setLoading, setError } = useTravel();
  const [trip, setTrip] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    fetchTripData();
  }, [tripId, type]);

  const fetchTripData = async () => {
    setLoading(true);
    try {
      const response = await tripService.getTrip(tripId);
      setTrip(response.trip);
      setRecommendations(response.trip.recommendations?.[type]?.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!trip || !recommendations) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  const getModuleInfo = (type) => {
    const modules = {
      itinerary: { title: 'Itinerary Recommendations', icon: '📅', color: 'bg-green-500' },
      destinations: { title: 'Destination Recommendations', icon: '🗺️', color: 'bg-green-500' },
      packing: { title: 'Packing Recommendations', icon: '🎒', color: 'bg-purple-500' },
      cuisine: { title: 'Cuisine Recommendations', icon: '🍽️', color: 'bg-orange-500' },
      accommodation: { title: 'Accommodation Recommendations', icon: '🏨', color: 'bg-red-500' }
    };
    return modules[type];
  };

  const moduleInfo = getModuleInfo(type);

  const renderItinerary = () => {
    if (!recommendations.days) return null;
    
    return (
      <div className="space-y-6">
        {recommendations.summary && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-3">Trip Overview</h3>
            <p className="text-gray-700">{recommendations.summary}</p>
          </div>
        )}
        
        {recommendations.days.map((day) => (
          <div key={day.day} className="card p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                {day.day}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{day.theme}</h3>
                <p className="text-gray-600">{new Date(day.date).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {day.activities?.map((activity, index) => (
                <div key={index} className="border-l-4 border-primary-200 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{activity.activity}</h4>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{activity.description}</p>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>⏱️ {activity.duration}</span>
                    <span>💰 {activity.cost}</span>
                  </div>
                  {activity.tips && (
                    <p className="text-sm text-green-600 mt-2">💡 {activity.tips}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {recommendations.tips && (
          <div className="card p-6 bg-yellow-50 border-yellow-200">
            <h3 className="text-lg font-semibold mb-3 text-yellow-800">General Tips</h3>
            <ul className="space-y-2">
              {recommendations.tips.map((tip, index) => (
                <li key={index} className="text-yellow-700">• {tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderDestinations = () => {
    if (!recommendations.recommendations) return null;
    
    return (
      <div className="grid gap-6">
        {recommendations.recommendations.map((destination, index) => (
          <div key={index} className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{destination.destination}</h3>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {destination.matchScore}% match
              </span>
            </div>
            
            <p className="text-gray-700 mb-4">{destination.whyRecommended}</p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Best Time to Visit</h4>
                <p className="text-gray-600">{destination.bestTimeToVisit}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Estimated Budget</h4>
                <p className="text-gray-600">{destination.estimatedBudget}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Highlights</h4>
              <div className="flex flex-wrap gap-2">
                {destination.highlights?.map((highlight, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
            
            {destination.travelTips && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Travel Tips</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  {destination.travelTips.map((tip, idx) => (
                    <li key={idx}>• {tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderPacking = () => {
    if (!recommendations.categories) return null;
    
    return (
      <div className="space-y-6">
        {recommendations.categories.map((category, index) => (
          <div key={index} className="card p-6">
            <h3 className="text-lg font-semibold mb-4">{category.category}</h3>
            <div className="grid gap-3">
              {category.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-3 ${item.essential ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                    <div>
                      <span className="font-medium">{item.item}</span>
                      {item.notes && <p className="text-sm text-gray-600">{item.notes}</p>}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {recommendations.weatherConsiderations && (
          <div className="card p-6 bg-beige-50 border-beige-200">
            <h3 className="text-lg font-semibold mb-3 text-beige-800">Weather Considerations</h3>
            <p className="text-beige-700">{recommendations.weatherConsiderations}</p>
          </div>
        )}
      </div>
    );
  };

  const renderCuisine = () => {
    return (
      <div className="space-y-6">
        {recommendations.mustTryDishes && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Must-Try Dishes</h3>
            <div className="grid gap-4">
              {recommendations.mustTryDishes.map((dish, index) => (
                <div key={index} className="border-l-4 border-orange-200 pl-4">
                  <h4 className="font-medium text-gray-900">{dish.dish}</h4>
                  <p className="text-gray-700 text-sm mb-1">{dish.description}</p>
                  <p className="text-gray-600 text-sm">Find at: {dish.whereToFind}</p>
                  {dish.dietaryNotes && (
                    <p className="text-orange-600 text-sm">⚠️ {dish.dietaryNotes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {recommendations.restaurants && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Restaurant Recommendations</h3>
            <div className="grid gap-4">
              {recommendations.restaurants.map((restaurant, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{restaurant.name}</h4>
                    <span className="text-sm text-gray-600">{restaurant.priceRange}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{restaurant.cuisine}</p>
                  {restaurant.specialties && (
                    <div className="flex flex-wrap gap-2">
                      {restaurant.specialties.map((specialty, idx) => (
                        <span key={idx} className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAccommodation = () => {
    return (
      <div className="space-y-6">
        {recommendations.recommendations && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Accommodation Options</h3>
            <div className="grid gap-4">
              {recommendations.recommendations.map((accommodation, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">{accommodation.type}</h4>
                    <span className="text-sm text-gray-600">{accommodation.priceRange}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{accommodation.area}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-green-700 text-sm mb-1">Pros</h5>
                      <ul className="text-sm text-gray-600">
                        {accommodation.pros?.map((pro, idx) => (
                          <li key={idx}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-red-700 text-sm mb-1">Cons</h5>
                      <ul className="text-sm text-gray-600">
                        {accommodation.cons?.map((con, idx) => (
                          <li key={idx}>• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <p className="text-sm text-green-600 mt-3">Best for: {accommodation.bestFor}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (type) {
      case 'itinerary':
        return renderItinerary();
      case 'destinations':
        return renderDestinations();
      case 'packing':
        return renderPacking();
      case 'cuisine':
        return renderCuisine();
      case 'accommodation':
        return renderAccommodation();
      default:
        return <div>Unknown recommendation type</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to={`/trip/${tripId}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Trip Details
        </Link>
        
        <div className="flex items-center">
          <div className={`w-12 h-12 ${moduleInfo.color} rounded-lg flex items-center justify-center text-2xl mr-4`}>
            {moduleInfo.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{moduleInfo.title}</h1>
            <p className="text-gray-600">{trip.destination} • {trip.duration} days</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}

export default AdvisoryDetail;
