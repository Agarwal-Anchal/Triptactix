import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravel } from '../context/TravelContext';
import { userService } from '../services/travelService';

function Onboarding() {
  const navigate = useNavigate();
  const { setUser, setLoading, setError, setOnboardingCompleted } = useTravel();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    ageRange: '',
    travelStyle: '',
    budgetRange: '',
    dietaryRestrictions: [],
    groupType: '',
    interests: [],
    energyLevel: 'moderate',
    accommodationPreferences: [],
    locationPreferences: []
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await userService.createUser(formData);
      setUser(response.user);
      setOnboardingCompleted(true);
      navigate('/trip-planning');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about yourself</h2>
      
      <div>
        <label className="form-label">What's your name?</label>
        <input
          type="text"
          className="form-input"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label className="form-label">Age Range</label>
        <div className="grid grid-cols-3 gap-3">
          {['18-25', '26-35', '36-50', '51-65', '65+'].map(range => (
            <button
              key={range}
              type="button"
              className={`p-3 rounded-lg border-2 text-center transition-colors ${
                formData.ageRange === range
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleInputChange('ageRange', range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="form-label">Travel Style</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'adventure', label: 'Adventure & Active' },
            { value: 'relaxation', label: 'Relaxation & Leisure' },
            { value: 'cultural', label: 'Cultural & Historical' },
            { value: 'mixed', label: 'Mix of Everything' }
          ].map(style => (
            <button
              key={style.value}
              type="button"
              className={`p-4 rounded-lg border-2 text-center transition-colors ${
                formData.travelStyle === style.value
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleInputChange('travelStyle', style.value)}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Travel Preferences</h2>
      
      <div>
        <label className="form-label">Budget Range</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'budget', label: 'Budget ($)', desc: 'Under $100/day' },
            { value: 'mid-range', label: 'Mid-range ($$)', desc: '$100-250/day' },
            { value: 'luxury', label: 'Luxury ($$$)', desc: '$250+/day' }
          ].map(budget => (
            <button
              key={budget.value}
              type="button"
              className={`p-4 rounded-lg border-2 text-center transition-colors ${
                formData.budgetRange === budget.value
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleInputChange('budgetRange', budget.value)}
            >
              <div className="font-medium">{budget.label}</div>
              <div className="text-sm text-gray-500">{budget.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="form-label">Group Type</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'solo', label: 'Solo Travel' },
            { value: 'couple', label: 'Couple' },
            { value: 'family', label: 'Family' },
            { value: 'friends', label: 'Friends Group' }
          ].map(group => (
            <button
              key={group.value}
              type="button"
              className={`p-3 rounded-lg border-2 text-center transition-colors ${
                formData.groupType === group.value
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleInputChange('groupType', group.value)}
            >
              {group.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="form-label">Energy Level</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'low', label: 'Relaxed pace' },
            { value: 'moderate', label: 'Moderate pace' },
            { value: 'high', label: 'Action-packed' }
          ].map(energy => (
            <button
              key={energy.value}
              type="button"
              className={`p-3 rounded-lg border-2 text-center transition-colors ${
                formData.energyLevel === energy.value
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleInputChange('energyLevel', energy.value)}
            >
              {energy.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Interests</h2>
      
      <div>
        <label className="form-label">What interests you? (Select all that apply)</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            'culture', 'food', 'nature', 'nightlife', 'history', 'art', 
            'adventure', 'shopping', 'beaches', 'museums', 'architecture', 'festivals'
          ].map(interest => (
            <button
              key={interest}
              type="button"
              className={`p-3 rounded-lg border-2 text-center transition-colors capitalize ${
                formData.interests.includes(interest)
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleArrayChange('interests', interest)}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="form-label">Dietary Restrictions (Optional)</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            'vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher', 'dairy-free', 'nut-free'
          ].map(dietary => (
            <button
              key={dietary}
              type="button"
              className={`p-3 rounded-lg border-2 text-center transition-colors capitalize ${
                formData.dietaryRestrictions.includes(dietary)
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleArrayChange('dietaryRestrictions', dietary)}
            >
              {dietary.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const totalSteps = 3;
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.ageRange && formData.travelStyle;
      case 2:
        return formData.budgetRange && formData.groupType;
      case 3:
        return formData.interests.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form content */}
      <div className="card p-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg font-medium ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed()}
              className={`px-6 py-2 rounded-lg font-medium ${
                canProceed()
                  ? 'btn-primary'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className={`px-6 py-2 rounded-lg font-medium ${
                canProceed()
                  ? 'btn-primary'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Complete Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
