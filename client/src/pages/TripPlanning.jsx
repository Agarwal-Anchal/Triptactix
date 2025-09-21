import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravel } from '../context/TravelContext';
import { tripService } from '../services/travelService';

function TripPlanning() {
  const navigate = useNavigate();
  const { user, setCurrentTrip, setLoading, setError, setTripPlanningCompleted } = useTravel();
  
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    duration: '',
    partySize: 1
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate duration when dates change
      if (field === 'startDate' || field === 'endDate') {
        if (updated.startDate && updated.endDate) {
          const start = new Date(updated.startDate);
          const end = new Date(updated.endDate);
          const diffTime = Math.abs(end - start);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          updated.duration = diffDays;
        }
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const tripData = {
        ...formData,
        userId: user._id,
        duration: parseInt(formData.duration),
        partySize: parseInt(formData.partySize)
      };
      
      const response = await tripService.createTrip(tripData);
      setCurrentTrip(response.trip);
      setTripPlanningCompleted(true);
      navigate(`/trip/${response.trip._id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.destination && 
           formData.startDate && 
           formData.endDate && 
           formData.duration > 0 && 
           formData.partySize > 0;
  };

  if (!user) {
    navigate('/onboarding');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Plan Your Trip</h1>
        <p className="text-gray-600 mb-8">
          Tell us about your trip details to get personalized recommendations.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="form-label">Where would you like to go?</label>
            <input
              type="text"
              className="form-input"
              value={formData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              placeholder="e.g., Paris, France or Tokyo, Japan"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Duration (Days)</label>
              <input
                type="number"
                className="form-input"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                min="1"
                max="30"
                placeholder="Auto-calculated"
                readOnly={formData.startDate && formData.endDate}
                required
              />
            </div>
            <div>
              <label className="form-label">Party Size</label>
              <input
                type="number"
                className="form-input"
                value={formData.partySize}
                onChange={(e) => handleInputChange('partySize', e.target.value)}
                min="1"
                max="20"
                required
              />
            </div>
          </div>

          {formData.duration > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Trip Summary</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Destination:</strong> {formData.destination || 'Not specified'}</p>
                <p><strong>Duration:</strong> {formData.duration} days</p>
                <p><strong>Travelers:</strong> {formData.partySize} {formData.partySize === 1 ? 'person' : 'people'}</p>
                {formData.startDate && formData.endDate && (
                  <p><strong>Dates:</strong> {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/onboarding')}
              className="btn-secondary"
            >
              Back to Profile
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`px-8 py-3 rounded-lg font-medium ${
                isFormValid()
                  ? 'btn-primary'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Generate Recommendations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TripPlanning;
