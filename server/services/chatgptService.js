const OpenAI = require('openai');

class ChatGPTService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    if (!this.apiKey) {
      console.warn('OPENAI_API_KEY not found in environment variables');
    }
  this.openai = this.apiKey ? new OpenAI({ apiKey: this.apiKey }) : null;
    this.model = 'gpt-3.5-turbo'; // You can change to 'gpt-4' if available
  }

  async generateContent(prompt) {
    if (!this.openai) {
      throw new Error('OpenAI API not configured. Please set OPENAI_API_KEY in environment variables.');
    }
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }

  async generateItinerary(userData, tripData) {
    const prompt = `
Create a detailed day-by-day itinerary for a ${tripData.duration}-day trip to ${tripData.destination}.

User Profile:
- Age: ${userData.ageRange}
- Travel Style: ${userData.travelStyle}
- Budget: ${userData.budgetRange}
- Group: ${userData.groupType} (${tripData.partySize} people)
- Interests: ${userData.interests.join(', ')}
- Energy Level: ${userData.energyLevel}

Trip Details:
- Dates: ${new Date(tripData.startDate).toDateString()} to ${new Date(tripData.endDate).toDateString()}
- Duration: ${tripData.duration} days

Please provide a JSON response with the following structure:
{
  "summary": "Brief overview of the itinerary",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "theme": "Day theme (e.g., 'Arrival & City Center')",
      "activities": [
        {
          "time": "9:00 AM",
          "activity": "Activity name",
          "description": "Brief description",
          "duration": "2 hours",
          "cost": "Estimated cost range",
          "tips": "Helpful tips"
        }
      ]
    }
  ],
  "tips": ["General trip tips"]
}

Focus on activities that match their interests and energy level. Consider travel time between activities and budget constraints.`;
    try {
      const response = await this.generateContent(prompt);
      return this.parseJSONResponse(response);
    } catch (error) {
      return this.getFallbackItinerary(tripData);
    }
  }

  async generateDestinations(userData) {
    const prompt = `
Recommend 5 travel destinations for someone with the following profile:

User Profile:
- Age: ${userData.ageRange}
- Travel Style: ${userData.travelStyle}
- Budget: ${userData.budgetRange}
- Group: ${userData.groupType}
- Interests: ${userData.interests.join(', ')}

Please provide a JSON response with the following structure:
{
  "recommendations": [
    {
      "destination": "City, Country",
      "matchScore": 95,
      "whyRecommended": "Explanation of why this fits their profile",
      "bestTimeToVisit": "Season/months",
      "estimatedBudget": "Budget range per person",
      "highlights": ["Top 3-4 highlights"],
      "travelTips": ["2-3 practical tips"]
    }
  ]
}

Ensure recommendations match their budget, interests, and travel style.`;
    try {
      const response = await this.generateContent(prompt);
      return this.parseJSONResponse(response);
    } catch (error) {
      return this.getFallbackDestinations();
    }
  }

  async generatePackingList(userData, tripData) {
    const prompt = `
Create a comprehensive packing checklist for a ${tripData.duration}-day trip to ${tripData.destination}.

User & Trip Info:
- Destination: ${tripData.destination}
- Duration: ${tripData.duration} days
- Dates: ${new Date(tripData.startDate).toDateString()} to ${new Date(tripData.endDate).toDateString()}
- Travel Style: ${userData.travelStyle}
- Group: ${userData.groupType}
- Accommodation Preferences: ${userData.accommodationPreferences.join(', ')}

Please provide a JSON response with the following structure:
{
  "categories": [
    {
      "category": "Clothing",
      "items": [
        {
          "item": "Item name",
          "quantity": "1-2",
          "essential": true,
          "notes": "When/why to bring this"
        }
      ]
    }
  ],
  "weatherConsiderations": "Weather-specific advice",
  "travelTips": ["Packing tips"],
  "prohibited": ["Items to avoid bringing"]
}

Consider the season, activities, and destination-specific requirements.`;
    try {
      const response = await this.generateContent(prompt);
      return this.parseJSONResponse(response);
    } catch (error) {
      return this.getFallbackPacking();
    }
  }

  async generateCuisineRecommendations(userData, tripData) {
    const prompt = `
Recommend local food experiences for a trip to ${tripData.destination}.

User Profile:
- Dietary Restrictions: ${userData.dietaryRestrictions.join(', ') || 'None'}
- Budget: ${userData.budgetRange}
- Group: ${userData.groupType}
- Interests: ${userData.interests.join(', ')}

Please provide a JSON response with the following structure:
{
  "mustTryDishes": [
    {
      "dish": "Dish name",
      "description": "What it is",
      "whereToFind": "Type of place to find it",
      "dietaryNotes": "Any dietary considerations"
    }
  ],
  "restaurants": [
    {
      "name": "Restaurant type/area",
      "cuisine": "Cuisine type",
      "priceRange": "Budget range",
      "specialties": ["What they're known for"],
      "dietaryOptions": ["Available dietary accommodations"]
    }
  ],
  "foodMarkets": ["Local markets to visit"],
  "diningEtiquette": ["Cultural dining tips"],
  "foodSafety": ["Food safety tips for the destination"]
}

Focus on authentic local experiences that match their dietary needs and budget.`;
    try {
      const response = await this.generateContent(prompt);
      return this.parseJSONResponse(response);
    } catch (error) {
      return this.getFallbackCuisine();
    }
  }

  async generateAccommodationRecommendations(userData, tripData) {
    const prompt = `
Recommend accommodation options for a ${tripData.duration}-day trip to ${tripData.destination}.

Trip Details:
- Destination: ${tripData.destination}
- Group Size: ${tripData.partySize} people
- Budget: ${userData.budgetRange}
- Accommodation Preferences: ${userData.accommodationPreferences.join(', ')}
- Location Preferences: ${userData.locationPreferences.join(', ')}
- Travel Style: ${userData.travelStyle}

Please provide a JSON response with the following structure:
{
  "recommendations": [
    {
      "type": "Hotel/Hostel/Airbnb/etc",
      "area": "Neighborhood/Area",
      "priceRange": "Price range per night",
      "pros": ["Advantages"],
      "cons": ["Disadvantages"],
      "bestFor": "Who this is best for",
      "amenities": ["Key amenities"]
    }
  ],
  "neighborhoods": [
    {
      "name": "Neighborhood name",
      "description": "What it's like",
      "pros": ["Advantages of staying here"],
      "bestFor": "Type of traveler"
    }
  ],
  "bookingTips": ["Advice for booking"],
  "whatToAvoid": ["Areas or situations to avoid"]
}

Consider their budget, group size, and preferences for location and amenities.`;
    try {
      const response = await this.generateContent(prompt);
      return this.parseJSONResponse(response);
    } catch (error) {
      return this.getFallbackAccommodation();
    }
  }

  parseJSONResponse(response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { error: 'Could not parse AI response', rawResponse: response };
    } catch (error) {
      return { error: 'Invalid JSON in AI response', rawResponse: response };
    }
  }

  getFallbackItinerary(tripData) {
    return {
      summary: `${tripData.duration}-day itinerary for ${tripData.destination}`,
      days: [
        {
          day: 1,
          date: tripData.startDate,
          theme: "Arrival & Exploration",
          activities: [
            {
              time: "10:00 AM",
              activity: "Arrival and Check-in",
              description: "Arrive at destination and check into accommodation",
              duration: "2 hours",
              cost: "Included",
              tips: "Leave luggage if room not ready"
            }
          ]
        }
      ],
      tips: ["This is a fallback itinerary. Please try again for AI-generated recommendations."]
    };
  }

  getFallbackDestinations() {
    return {
      recommendations: [
        {
          destination: "Paris, France",
          matchScore: 85,
          whyRecommended: "Classic destination with something for everyone",
          bestTimeToVisit: "April-June, September-October",
          estimatedBudget: "$100-200 per day",
          highlights: ["Eiffel Tower", "Louvre Museum", "Local Cuisine", "Historic Architecture"],
          travelTips: ["Learn basic French phrases", "Book museum tickets in advance"]
        }
      ]
    };
  }

  getFallbackPacking() {
    return {
      categories: [
        {
          category: "Essentials",
          items: [
            { item: "Passport", quantity: "1", essential: true, notes: "Required for travel" },
            { item: "Phone charger", quantity: "1", essential: true, notes: "Stay connected" }
          ]
        }
      ],
      weatherConsiderations: "Check weather forecast before packing",
      travelTips: ["Pack light", "Leave room for souvenirs"],
      prohibited: ["Check airline restrictions"]
    };
  }

  getFallbackCuisine() {
    return {
      mustTryDishes: [
        { dish: "Local specialty", description: "Ask locals for recommendations", whereToFind: "Local restaurants", dietaryNotes: "Check ingredients" }
      ],
      restaurants: [
        { name: "Local restaurants", cuisine: "Regional", priceRange: "Varies", specialties: ["Local dishes"], dietaryOptions: ["Ask server"] }
      ],
      foodMarkets: ["Visit local markets"],
      diningEtiquette: ["Respect local customs"],
      foodSafety: ["Drink bottled water if unsure"]
    };
  }

  getFallbackAccommodation() {
    return {
      recommendations: [
        {
          type: "Hotel",
          area: "City Center",
          priceRange: "$50-150 per night",
          pros: ["Central location", "Easy access to attractions"],
          cons: ["Can be noisy"],
          bestFor: "First-time visitors",
          amenities: ["WiFi", "Breakfast"]
        }
      ],
      neighborhoods: [
        { name: "City Center", description: "Heart of the city", pros: ["Walking distance to attractions"], bestFor: "Tourists" }
      ],
      bookingTips: ["Book in advance", "Read reviews"],
      whatToAvoid: ["Avoid areas far from transport"]
    };
  }
}

module.exports = new ChatGPTService();
