import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  user: null,
  currentTrip: null,
  loading: false,
  error: null,
  recommendations: {},
  onboardingCompleted: false,
  tripPlanningCompleted: false,
  chatOnboardingCompleted: false
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER: 'SET_USER',
  SET_CURRENT_TRIP: 'SET_CURRENT_TRIP',
  SET_RECOMMENDATIONS: 'SET_RECOMMENDATIONS',
  UPDATE_RECOMMENDATION: 'UPDATE_RECOMMENDATION',
  SET_ONBOARDING_COMPLETED: 'SET_ONBOARDING_COMPLETED',
  SET_TRIP_PLANNING_COMPLETED: 'SET_TRIP_PLANNING_COMPLETED',
  SET_CHAT_ONBOARDING_COMPLETED: 'SET_CHAT_ONBOARDING_COMPLETED',
  CLEAR_STATE: 'CLEAR_STATE'
};

// Reducer function
function travelReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.SET_USER:
      return { ...state, user: action.payload, error: null };
    
    case actionTypes.SET_CURRENT_TRIP:
      return { ...state, currentTrip: action.payload, error: null };
    
    case actionTypes.SET_RECOMMENDATIONS:
      return { ...state, recommendations: action.payload };
    
    case actionTypes.UPDATE_RECOMMENDATION:
      return {
        ...state,
        recommendations: {
          ...state.recommendations,
          [action.payload.type]: action.payload.data
        }
      };
    
    case actionTypes.SET_ONBOARDING_COMPLETED:
      return { ...state, onboardingCompleted: action.payload };
    
    case actionTypes.SET_TRIP_PLANNING_COMPLETED:
      return { ...state, tripPlanningCompleted: action.payload };
    
    case actionTypes.SET_CHAT_ONBOARDING_COMPLETED:
      return { ...state, chatOnboardingCompleted: action.payload };
    
    case actionTypes.CLEAR_STATE:
      return initialState;
    
    default:
      return state;
  }
}

// Create context
const TravelContext = createContext();

// Provider component
export function TravelProvider({ children }) {
  const [state, dispatch] = useReducer(travelReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('tripTactixState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        if (parsedState.user) {
          dispatch({ type: actionTypes.SET_USER, payload: parsedState.user });
        }
        if (parsedState.currentTrip) {
          dispatch({ type: actionTypes.SET_CURRENT_TRIP, payload: parsedState.currentTrip });
        }
        if (parsedState.onboardingCompleted) {
          dispatch({ type: actionTypes.SET_ONBOARDING_COMPLETED, payload: true });
        }
        if (parsedState.tripPlanningCompleted) {
          dispatch({ type: actionTypes.SET_TRIP_PLANNING_COMPLETED, payload: true });
        }
        if (parsedState.chatOnboardingCompleted) {
          dispatch({ type: actionTypes.SET_CHAT_ONBOARDING_COMPLETED, payload: true });
        }
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    const stateToSave = {
      user: state.user,
      currentTrip: state.currentTrip,
      onboardingCompleted: state.onboardingCompleted,
      tripPlanningCompleted: state.tripPlanningCompleted,
      chatOnboardingCompleted: state.chatOnboardingCompleted
    };
    localStorage.setItem('tripTactixState', JSON.stringify(stateToSave));
  }, [state.user, state.currentTrip, state.onboardingCompleted, state.tripPlanningCompleted, state.chatOnboardingCompleted]);

  // Action creators
  const actions = {
    setLoading: (loading) => 
      dispatch({ type: actionTypes.SET_LOADING, payload: loading }),
    
    setError: (error) => 
      dispatch({ type: actionTypes.SET_ERROR, payload: error }),
    
    setUser: (user) => 
      dispatch({ type: actionTypes.SET_USER, payload: user }),
    
    setCurrentTrip: (trip) => 
      dispatch({ type: actionTypes.SET_CURRENT_TRIP, payload: trip }),
    
    setRecommendations: (recommendations) => 
      dispatch({ type: actionTypes.SET_RECOMMENDATIONS, payload: recommendations }),
    
    updateRecommendation: (type, data) => 
      dispatch({ type: actionTypes.UPDATE_RECOMMENDATION, payload: { type, data } }),
    
    setOnboardingCompleted: (completed) => 
      dispatch({ type: actionTypes.SET_ONBOARDING_COMPLETED, payload: completed }),
    
    setTripPlanningCompleted: (completed) => 
      dispatch({ type: actionTypes.SET_TRIP_PLANNING_COMPLETED, payload: completed }),
    
    setChatOnboardingCompleted: (completed) => 
      dispatch({ type: actionTypes.SET_CHAT_ONBOARDING_COMPLETED, payload: completed }),
    
    clearState: () => {
      localStorage.removeItem('tripTactixState');
      dispatch({ type: actionTypes.CLEAR_STATE });
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <TravelContext.Provider value={value}>
      {children}
    </TravelContext.Provider>
  );
}

// Custom hook to use the travel context
export function useTravel() {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
}

export default TravelContext;
