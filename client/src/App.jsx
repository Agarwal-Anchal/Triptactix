import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TravelProvider } from './context/TravelContext';

// Pages
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import ChatOnboarding from './pages/ChatOnboarding';
import TripPlanning from './pages/TripPlanning';
import TripsPage from './pages/TripsPage';
import TripDetailPage from './pages/TripDetailPage';
import DestinationsPage from './pages/DestinationsPage';
import AdvisoryDetail from './pages/AdvisoryDetail';

// Components
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <TravelProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/onboarding" element={
                <ErrorBoundary>
                  <ChatOnboarding />
                </ErrorBoundary>
              } />
              <Route path="/onboarding-old" element={<Onboarding />} />
              <Route path="/destinations" element={<DestinationsPage />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/trip-planning" element={<TripPlanning />} />
              <Route path="/trip/:tripId" element={<TripDetailPage />} />
              <Route path="/advisory/:tripId/:type" element={<AdvisoryDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </TravelProvider>
  );
}

export default App;
