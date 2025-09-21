#!/bin/bash

echo "Building client..."
cd client

# Create env.js from environment variables
echo "Creating client environment configuration..."
cat > public/env.js << EOF
window.ENV = {
  VITE_API_URL: '/api'
};
EOF

npm run build

echo "Creating server public directory..."
cd ../server
mkdir -p public

echo "Copying client build to server public..."
cp -r ../client/dist/* public/

echo "Installing server dependencies..."
npm install

echo "Checking environment files..."
if [ -f "../.env" ]; then
  echo "Root .env found, copying to server..."
  cp ../.env .env
elif [ -f ".env" ]; then
  echo "Server .env already exists"
else
  echo "Warning: No .env file found. Creating from .env.example..."
  if [ -f ".env.example" ]; then
    cp .env.example .env
    echo "Please update .env with your actual API keys"
  fi
fi

echo "Starting server with static file serving..."
export NODE_ENV=development
npm run dev