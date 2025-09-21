import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravel } from '../context/TravelContext';
import { userService, advisoryService } from '../services/travelService';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import { v4 as uuidv4 } from 'uuid';

function ChatOnboarding() {
  const navigate = useNavigate();
  const { 
    setUser, 
    setCurrentTrip, 
    setLoading, 
    setError, 
    setChatOnboardingCompleted, 
    loading = false,
    error = null
  } = useTravel();
  const messagesEndRef = useRef(null);
  const isProcessingRef = useRef(false);
  
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const lastMessageRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Helper function to add messages with deduplication
  const addMessage = (message) => {
    const messageKey = `${message.message}_${message.isUser}_${message.timestamp}`;
    
    // Check if this exact message was just added
    if (lastMessageRef.current === messageKey) {
      return;
    }
    
    lastMessageRef.current = messageKey;
    setMessages(prev => [...prev, message]);
  };

  // Generate unique message ID
  const generateMessageId = () => {
    return uuidv4();
  };

  // Input validation and auto-correction
  const validateAndCorrectInput = (input, type) => {
    switch (type) {
      case 'date':
        return validateAndCorrectDate(input);
      case 'number':
        return validateAndCorrectNumber(input);
      case 'text':
        return validateAndCorrectText(input);
      default:
        return input;
    }
  };

  const validateAndCorrectDate = (input) => {
    if (!input || input.trim() === '') return null;
    
    const cleanInput = input.trim();
    
    // Check for the specific format: "Month DD, YYYY" (e.g., "December 25, 2024")
    const dateFormatRegex = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})$/i;
    const match = cleanInput.match(dateFormatRegex);
    
    if (!match) {
      return 'INVALID_FORMAT';
    }
    
    const [, monthName, day, year] = match;
    const monthIndex = ['january', 'february', 'march', 'april', 'may', 'june', 
                       'july', 'august', 'september', 'october', 'november', 'december']
                       .indexOf(monthName.toLowerCase());
    
    if (monthIndex === -1) {
      return 'INVALID_FORMAT';
    }
    
    const date = new Date(parseInt(year), monthIndex, parseInt(day));
    
    // Check if it's a valid date
    if (isNaN(date.getTime())) {
      return 'INVALID_DATE';
    }
    
    // Check if date is in the future (reasonable for trip planning)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
      return 'PAST_DATE';
    }
    
    // Return the original input (no conversion)
    return cleanInput;
  };

  const validateAndCorrectNumber = (input) => {
    const num = parseInt(input);
    if (isNaN(num) || num < 1) {
      return 1; // Default to 1 if invalid
    }
    if (num > 20) {
      return 20; // Cap at 20 people
    }
    return num;
  };

  const validateAndCorrectText = (input) => {
    return input.trim();
  };

  // Show validation feedback to user
  const showValidationFeedback = (originalInput, correctedInput, type) => {
    if (originalInput !== correctedInput) {
      const feedbackMessage = {
        id: generateMessageId(),
        message: getValidationFeedbackMessage(originalInput, correctedInput, type),
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setTimeout(() => {
        addMessage(feedbackMessage);
      }, 300);
    }
  };

  const getValidationFeedbackMessage = (original, corrected, type) => {
    switch (type) {
      case 'date':
        if (corrected === 'INVALID_FORMAT') {
          return `❌ Please enter the date in the exact format: "Month DD, YYYY" (e.g., "December 25, 2024"). You entered: "${original}"`;
        } else if (corrected === 'INVALID_DATE') {
          return `❌ The date "${original}" is not valid. Please enter a valid date in format "Month DD, YYYY".`;
        } else if (corrected === 'PAST_DATE') {
          return `❌ The date "${original}" is in the past. Please enter a future date for your trip.`;
        } else {
          return `✅ Date accepted: ${corrected}`;
        }
      case 'number':
        return `✅ I've set the number to ${corrected} (was "${original}").`;
      case 'text':
        return `✅ I've cleaned up your input: "${corrected}".`;
      default:
        return `✅ I've processed your input: "${corrected}".`;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Conversation flow configuration
  const conversationFlow = [
    {
      botMessage: "Hi there! 👋 I'm your TripTactix assistant. I'd love to help you plan an amazing trip! What's your name?",
      field: 'name',
      type: 'text',
      quickOptions: []
    },
    {
      botMessage: `Nice to meet you, {name}! 😊 How old are you? This helps me suggest age-appropriate activities.`,
      field: 'ageRange',
      type: 'options',
      quickOptions: ['18-25', '26-35', '36-50', '51-65', '65+']
    },
    {
      botMessage: "Great! What kind of travel experience are you looking for?",
      field: 'travelStyle',
      type: 'options',
      quickOptions: ['Adventure & Active', 'Relaxation & Leisure', 'Cultural & Historical', 'Mix of Everything']
    },
    {
      botMessage: "Perfect! What's your budget range for this trip?",
      field: 'budgetRange',
      type: 'options',
      quickOptions: ['Budget ($100/day)', 'Mid-range ($100-250/day)', 'Luxury ($250+/day)']
    },
    {
      botMessage: "Who are you traveling with?",
      field: 'groupType',
      type: 'options',
      quickOptions: ['Solo Travel', 'Couple', 'Family', 'Friends Group']
    },
    {
      botMessage: "How many people will be traveling?",
      field: 'partySize',
      type: 'number',
      quickOptions: ['1', '2', '3', '4', '5+']
    },
    {
      botMessage: "What pace do you prefer for your travels?",
      field: 'energyLevel',
      type: 'options',
      quickOptions: ['Relaxed pace', 'Moderate pace', 'Action-packed']
    },
    {
      botMessage: "What interests you most when traveling? (You can select multiple - type 'done' when finished)",
      field: 'interests',
      type: 'multi-select',
      quickOptions: ['Culture', 'Food', 'Nature', 'Nightlife', 'History', 'Art', 'Adventure', 'Shopping', 'Beaches', 'Museums', 'Architecture', 'Festivals']
    },
    {
      botMessage: "Any dietary restrictions I should know about? (Optional - you can skip this or type 'done' when finished)",
      field: 'dietaryRestrictions',
      type: 'multi-select',
      quickOptions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher', 'Dairy-free', 'Nut-free', 'None']
    },
    {
      botMessage: "When are you planning to travel?",
      field: 'startDate',
      type: 'date',
      quickOptions: []
    },
    {
      botMessage: "And when do you plan to return?",
      field: 'endDate',
      type: 'date',
      quickOptions: []
    },
    {
      botMessage: "Excellent! Now let's talk about your trip. Where would you like to go?",
      field: 'destination',
      type: 'text',
      quickOptions: ['Suggest destinations for me']
    }
  ];

  // Initialize with welcome message (only once)
  useEffect(() => {
    if (isInitialized) return;
    
    setTimeout(() => {
      if (conversationFlow.length > 0 && !isInitialized) {
        const welcomeMessage = {
          id: generateMessageId(),
          message: conversationFlow[0].botMessage,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([welcomeMessage]);
        setIsInitialized(true);
      }
    }, 1000);
  }, [isInitialized]);

  const handleDestinationSelect = (destination) => {
    // Close the modal
    setShowSuggestions(false);
    
    // Process the selected destination as if the user typed it
    processUserResponse(destination);
  };

  const handleDestinationSuggestions = async () => {
    setLoadingSuggestions(true);
    
    try {
      // Create a temporary user first
      const tempUserData = {
        name: userData.name || 'User',
        ageRange: userData.ageRange || '26-35',
        travelStyle: userData.travelStyle || 'mixed',
        budgetRange: userData.budgetRange || 'mid-range',
        groupType: userData.groupType || 'couple',
        interests: userData.interests || ['Culture', 'Food'],
        energyLevel: userData.energyLevel || 'moderate',
        dietaryRestrictions: userData.dietaryRestrictions || []
      };
      
      // Create temporary user
      const userResponse = await userService.createUser(tempUserData);
      
      if (userResponse.success) {
        // Call the destination suggestions API with the created user ID
        const response = await advisoryService.generateDestinations(userResponse.user._id);
        
        if (response.success && response.recommendations?.recommendations) {
          setSuggestions(response.recommendations.recommendations);
          setShowSuggestions(true);
          
          // Add a message to the chat
          const suggestionMessage = {
            id: generateMessageId(),
            message: "Here are some destination suggestions based on your preferences! Click on any destination to select it, or you can type your own destination below.",
            isUser: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          addMessage(suggestionMessage);
        } else {
          throw new Error('Failed to get suggestions');
        }
      } else {
        throw new Error('Failed to create temporary user');
      }
    } catch (error) {
      console.error('Error getting destination suggestions:', error);
      
      // Add error message to chat
      const errorMessage = {
        id: generateMessageId(),
        message: "Sorry, I couldn't get destination suggestions right now. Please type your destination manually.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      addMessage(errorMessage);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const processUserResponse = async (userMessage) => {
    // Don't process if loading, typing, or already processing
    if (loading || isTyping || isProcessingRef.current) {
      return;
    }
    
    isProcessingRef.current = true;
    
    // Handle retry and restart commands
    if (userMessage.toLowerCase() === 'retry') {
      isProcessingRef.current = false;
      handleComplete();
      return;
    }
    
    if (userMessage.toLowerCase() === 'restart') {
      // Reset everything and start over
      setMessages([]);
      setCurrentStep(0);
      setUserData({});
      setIsComplete(false);
      setError(null);
      isProcessingRef.current = false;
      
      // Restart with welcome message
      setTimeout(() => {
        const welcomeMessage = {
          id: generateMessageId(),
          message: conversationFlow[0].botMessage,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([welcomeMessage]);
      }, 500);
      return;
    }
    
    if (currentStep >= conversationFlow.length) {
      return;
    }
    
    const currentFlow = conversationFlow[currentStep];
    if (!currentFlow) {
      return;
    }
    
    // Handle "done" command for multi-select fields
    if (currentFlow.type === 'multi-select' && userMessage.toLowerCase() === 'done') {
      // Move to next step without updating the field
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const nextStep = currentStep + 1;
          
          if (nextStep < conversationFlow.length) {
            const nextFlow = conversationFlow[nextStep];
            let nextMessage = nextFlow.botMessage;
            
            // Replace placeholders in message
            if (userData.name) {
              nextMessage = nextMessage.replace('{name}', userData.name);
            }
            
            const botMessage = {
              id: generateMessageId(),
              message: nextMessage,
              isUser: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            addMessage(botMessage);
            setCurrentStep(nextStep);
            isProcessingRef.current = false;
          } else {
            setIsComplete(true);
            isProcessingRef.current = false;
            handleComplete();
          }
        }, 1500);
      }, 500);
      return;
    }
    
    const newUserMessage = {
      id: generateMessageId(),
      message: userMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    addMessage(newUserMessage);

    // Validate and correct input
    const validatedInput = validateAndCorrectInput(userMessage, currentFlow.type);
    
    // Show validation feedback if input was corrected
    showValidationFeedback(userMessage, validatedInput, currentFlow.type);
    
    // If validation failed (invalid date), don't proceed
    if (validatedInput === 'INVALID_FORMAT' || validatedInput === 'INVALID_DATE' || validatedInput === 'PAST_DATE') {
      isProcessingRef.current = false;
      return;
    }
    
    // Handle destination suggestions
    if (currentFlow.field === 'destination' && userMessage === 'Suggest destinations for me') {
      await handleDestinationSuggestions();
      isProcessingRef.current = false;
      return;
    }
    
    // Process the response based on field type
    let processedValue = validatedInput;
    
    if (currentFlow.type === 'options') {
      // Map display text to values
      const optionMap = {
        'Adventure & Active': 'adventure',
        'Relaxation & Leisure': 'relaxation',
        'Cultural & Historical': 'cultural',
        'Mix of Everything': 'mixed',
        'Budget ($100/day)': 'budget',
        'Mid-range ($100-250/day)': 'mid-range',
        'Luxury ($250+/day)': 'luxury',
        'Solo Travel': 'solo',
        'Couple': 'couple',
        'Family': 'family',
        'Friends Group': 'friends',
        'Relaxed pace': 'low',
        'Moderate pace': 'moderate',
        'Action-packed': 'high',
        'None': null
      };
      processedValue = optionMap[userMessage] || userMessage.toLowerCase();
    } else if (currentFlow.type === 'multi-select') {
      // Handle multi-select fields
      const currentValues = userData[currentFlow.field] || [];
      
      if (userMessage === 'None' || userMessage === 'Skip') {
        processedValue = [];
      } else {
        const value = userMessage.toLowerCase().replace(/\s+/g, '-');
        if (currentValues.includes(value)) {
          // Remove if already selected
          processedValue = currentValues.filter(item => item !== value);
        } else {
          // Add to selection
          processedValue = [...currentValues, value];
        }
      }
    } else if (currentFlow.type === 'date') {
      // Handle date input
      if (userMessage.includes('/') || userMessage.includes('-')) {
        processedValue = userMessage;
      } else {
        // Handle relative dates like "next month", "in 3 weeks", etc.
        const today = new Date();
        if (userMessage.toLowerCase().includes('next week')) {
          const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          processedValue = nextWeek.toISOString().split('T')[0];
        } else if (userMessage.toLowerCase().includes('next month')) {
          const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
          processedValue = nextMonth.toISOString().split('T')[0];
        } else {
          processedValue = userMessage;
        }
      }
    } else if (currentFlow.type === 'number') {
      processedValue = parseInt(userMessage) || 1;
    }

    // Update user data
    setUserData(prev => {
      const updatedUserData = {
        ...prev,
        [currentFlow.field]: processedValue
      };
      
      // For multi-select fields, don't automatically move to next step
      // Let user continue selecting or type "done" to proceed
      if (currentFlow.type === 'multi-select' && userMessage !== 'None' && userMessage !== 'Skip' && userMessage.toLowerCase() !== 'done') {
        // Just return the updated data without adding a message
        // The user can continue selecting or type "done"
        isProcessingRef.current = false;
        return updatedUserData;
      }
      
      // For other field types, move to next step after state update
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const nextStep = currentStep + 1;
          
          if (nextStep < conversationFlow.length) {
            const nextFlow = conversationFlow[nextStep];
            
            let nextMessage = nextFlow.botMessage;
            
            // Replace placeholders in message using updated data
            if (updatedUserData.name) {
              nextMessage = nextMessage.replace('{name}', updatedUserData.name);
            }
            
            const botMessage = {
              id: generateMessageId(),
              message: nextMessage,
              isUser: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            addMessage(botMessage);
            setCurrentStep(nextStep);
            isProcessingRef.current = false;
          } else {
            // Conversation complete
            setIsComplete(true);
            isProcessingRef.current = false;
            handleComplete();
          }
        }, 1500);
      }, 500);
      
      return updatedUserData;
    });
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Calculate duration if we have dates
      let duration = 1;
      if (userData.startDate && userData.endDate) {
        const start = new Date(userData.startDate);
        const end = new Date(userData.endDate);
        const diffTime = Math.abs(end - start);
        duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      // Validate and prepare user data for API
      const userProfile = {
        name: userData.name || 'User',
        ageRange: userData.ageRange || '26-35',
        travelStyle: userData.travelStyle || 'mixed',
        budgetRange: userData.budgetRange || 'mid-range',
        dietaryRestrictions: Array.isArray(userData.dietaryRestrictions) ? userData.dietaryRestrictions : [],
        groupType: userData.groupType || 'solo',
        interests: Array.isArray(userData.interests) ? userData.interests : ['culture'],
        energyLevel: userData.energyLevel || 'moderate',
        accommodationPreferences: [],
        locationPreferences: []
      };

      // Ensure we have valid dates
      let startDate = userData.startDate;
      let endDate = userData.endDate;
      
      if (!startDate || !endDate) {
        const today = new Date();
        startDate = startDate || today.toISOString().split('T')[0];
        endDate = endDate || new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      }

      const tripData = {
        destination: userData.destination || 'Paris, France',
        startDate: startDate,
        endDate: endDate,
        duration: duration,
        partySize: userData.partySize || 1
      };

      // Create user and trip
      const userResponse = await userService.createUser(userProfile);
      if (userResponse && userResponse.user) {
        setUser(userResponse.user);
        
        // Create trip
        const tripResponse = await userService.createTrip({
          ...tripData,
          userId: userResponse.user._id
        });
        
        if (tripResponse && tripResponse.trip) {
          setCurrentTrip(tripResponse.trip);
          setChatOnboardingCompleted(true);
          
          // Show completion message
          const completionMessage = {
            id: generateMessageId(),
            message: `Perfect! 🎉 I've got everything I need to create your personalized trip to ${userData.destination || 'your destination'}. Let me generate some amazing recommendations for you!`,
            isUser: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          addMessage(completionMessage);
          
          // Navigate to trip details after a short delay
          setTimeout(() => {
            navigate(`/trip/${tripResponse.trip._id}`);
          }, 2000);
        } else {
          throw new Error('Failed to create trip');
        }
      } else {
        throw new Error('Failed to create user');
      }
      
    } catch (error) {
      console.error('Error in handleComplete:', error);
      setError(error.message || 'An unexpected error occurred');
      
      // Show user-friendly error message with more context
      let errorMessage = "I'm having trouble creating your trip right now. ";
      
      if (error.message && error.message.includes('network')) {
        errorMessage += "It looks like there's a network issue. ";
      } else if (error.message && error.message.includes('API')) {
        errorMessage += "There seems to be an issue with our AI service. ";
      } else {
        errorMessage += "This might be a temporary issue. ";
      }
      
      errorMessage += "Would you like to try again?";
      
      const errorBotMessage = {
        id: generateMessageId(),
        message: errorMessage,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      // Add retry option
      const retryMessage = {
        id: generateMessageId(),
        message: "You can type 'retry' to try again, or 'restart' to start over with a fresh conversation.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      addMessage(errorBotMessage);
      addMessage(retryMessage);
      
      // Reset completion state so user can retry
      setIsComplete(false);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentOptions = () => {
    // If there's an error and we're in completion state, show retry options
    if (error && isComplete) {
      return ['Retry', 'Restart'];
    }
    
    if (currentStep < conversationFlow.length && conversationFlow[currentStep]) {
      const currentFlow = conversationFlow[currentStep];
      let options = currentFlow.quickOptions || [];
      
      // For multi-select fields, add "Done" option if user has made selections
      if (currentFlow.type === 'multi-select' && userData[currentFlow.field] && userData[currentFlow.field].length > 0) {
        options = [...options, 'Done'];
      }
      
      return options;
    }
    return [];
  };

  const getCurrentPlaceholder = () => {
    // If there's an error, show retry options
    if (error && isComplete) {
      return "Type 'retry' or 'restart'...";
    }
    
    if (currentStep < conversationFlow.length && conversationFlow[currentStep]) {
      const currentFlow = conversationFlow[currentStep];
      switch (currentFlow.type) {
        case 'text':
          return "Type your answer...";
        case 'date':
          return "Enter date in format: Month DD, YYYY (e.g., December 25, 2024)...";
        case 'number':
          return "Enter a number...";
        case 'multi-select':
          return "Select options or type 'done' when finished...";
        default:
          return "Select an option or type your answer...";
      }
    }
    return "Type your message...";
  };

  return (
    <div className="max-w-2xl mx-auto h-screen flex flex-col">
      {/* Chat Header */}
      <div className="bg-beige-50 border-b border-beige-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-beige-100 p-2 rounded-lg">
              <img 
                src="/logo-icon.png" 
                alt="TripTactix Icon" 
                className="h-8 w-auto"
              />
            </div>
            <div>
              <h2 className="font-semibold text-secondary-900">TripTactix Assistant</h2>
              <p className="text-sm text-secondary-600">Let's plan your perfect trip together!</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Step {Math.min(currentStep + 1, conversationFlow.length)} of {conversationFlow.length}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg.message}
            isUser={msg.isUser}
            timestamp={msg.timestamp}
          />
        ))}
        
        {isTyping && (
          <ChatMessage
            message=""
            isUser={false}
            isTyping={true}
          />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      {!isComplete && (
        <div className="border-t bg-beige-50">
          <ChatInput
            onSendMessage={processUserResponse}
            placeholder={getCurrentPlaceholder()}
            options={getCurrentOptions()}
            disabled={isTyping || loading}
          />
        </div>
      )}

      {/* Destination Suggestions Modal */}
      {showSuggestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Destination Suggestions</h3>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{suggestion.destination}</h4>
                    <span className="text-sm text-primary-600 font-medium">{suggestion.matchScore}% match</span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{suggestion.whyRecommended}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Best time to visit:</span>
                      <p className="text-sm text-gray-600">{suggestion.bestTimeToVisit}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Estimated budget:</span>
                      <p className="text-sm text-gray-600">{suggestion.estimatedBudget}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">Highlights:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {suggestion.highlights.map((highlight, idx) => (
                        <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700">Travel tips:</span>
                    <ul className="text-sm text-gray-600 mt-1">
                      {suggestion.travelTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-primary-500 mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => handleDestinationSelect(suggestion.destination)}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Plan Trip to {suggestion.destination}
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Don't see what you're looking for? You can also type your own destination below.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatOnboarding;
