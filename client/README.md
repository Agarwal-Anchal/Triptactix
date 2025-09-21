# TripTactix - AI Travel Planning Assistant

A modern, chat-based travel planning application built with React and Vite.

## Features

### 🤖 Chat-Based Onboarding
- Conversational interface for collecting user preferences
- Natural language processing for trip planning
- Seamless integration of user profile and trip creation

### 🎯 AI-Powered Recommendations
- Personalized itinerary suggestions
- Destination recommendations based on preferences
- Packing lists tailored to your trip
- Local cuisine and dining suggestions
- Accommodation recommendations

### 🎨 Modern UI/UX
- Clean, responsive design with green and beige color scheme
- Real-time chat interface with typing indicators
- Mobile-first approach

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the chat onboarding to start planning your trip!

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS with custom green/beige theme
- **State Management**: React Context API
- **Routing**: React Router v6
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **AI Integration**: Google Gemini API

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ChatMessage.jsx  # Chat message component
│   ├── ChatInput.jsx    # Chat input with quick options
│   └── Navbar.jsx       # Navigation component
├── pages/              # Route components
│   ├── ChatOnboarding.jsx  # Main chat-based onboarding
│   ├── Home.jsx        # Landing page
│   ├── TripDetailPage.jsx  # Trip details and recommendations
│   └── ...
├── context/            # State management
│   └── TravelContext.jsx
└── services/           # API integration
    └── travelService.js
```

## Chat Flow

The onboarding process uses a conversational interface that:

1. **Collects user preferences** through natural conversation
2. **Gathers trip details** including destination, dates, and party size
3. **Creates user profile and trip** in one seamless flow
4. **Generates personalized recommendations** using AI

## Development

- **Linting**: ESLint with React-specific rules
- **Hot Reload**: Vite provides fast HMR
- **Build**: `npm run build` for production builds
