import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      {/* Hero Section */}
      <div className="mb-16">
        <div className="flex justify-center mb-6">
          <div className="bg-beige-100 p-4 rounded-xl">
            <img 
              src="/logo-icon.png" 
              alt="TripTactix Icon" 
              className="h-16 w-auto"
            />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-secondary-900 mb-2">
          TripTactix
        </h1>
        <p className="text-lg text-secondary-600 mb-6">
          Plan Smart. Pack Light. Explore Bold.
        </p>
        <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
          Your AI-powered travel planning assistant that provides personalized recommendations 
          for itineraries, destinations, packing, cuisine, and accommodation.
        </p>
        <Link 
          to="/onboarding" 
          className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-lg px-8 py-3 rounded-lg transition-colors inline-block"
        >
          Start Planning Your Trip
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="card p-6">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Smart Itineraries</h3>
          <p className="text-gray-600">AI-generated day-by-day plans tailored to your interests and travel style.</p>
        </div>

        <div className="card p-6">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Perfect Destinations</h3>
          <p className="text-gray-600">Discover destinations that match your preferences and budget.</p>
        </div>

        <div className="card p-6">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Smart Packing</h3>
          <p className="text-gray-600">Never forget essentials with weather and activity-based packing lists.</p>
        </div>

        <div className="card p-6">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Local Cuisine</h3>
          <p className="text-gray-600">Explore authentic local food experiences and restaurant recommendations.</p>
        </div>

        <div className="card p-6">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Best Stays</h3>
          <p className="text-gray-600">Find perfect accommodations based on your budget and location preferences.</p>
        </div>

        <div className="card p-6">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
          <p className="text-gray-600">Advanced AI understands your preferences and creates personalized recommendations.</p>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-white rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
              1
            </div>
            <h3 className="text-lg font-semibold mb-2">Tell Us About You</h3>
            <p className="text-gray-600">Share your travel preferences, interests, and budget to get personalized recommendations.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
              2
            </div>
            <h3 className="text-lg font-semibold mb-2">Plan Your Trip</h3>
            <p className="text-gray-600">Choose your destination, dates, and travel details to start the planning process.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
              3
            </div>
            <h3 className="text-lg font-semibold mb-2">Get AI Recommendations</h3>
            <p className="text-gray-600">Receive personalized recommendations for every aspect of your trip.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-lg text-gray-600 mb-6">
          Ready to plan your perfect trip?
        </p>
        <Link 
          to="/onboarding" 
          className="btn-primary text-lg px-8 py-3 inline-block"
        >
          Get Started Now
        </Link>
      </div>
    </div>
  );
}

export default Home;
