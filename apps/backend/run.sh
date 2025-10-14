#!/bin/bash

echo "Starting Backend service..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Run the service in development mode
npm run start:dev