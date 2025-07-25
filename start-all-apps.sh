#!/bin/bash

# Start all Encodly apps in development mode
# This script starts all apps concurrently on their respective ports

echo "🚀 Starting all Encodly apps..."
echo "Main Site: http://localhost:5000"
echo "JSON Formatter: http://localhost:5001"
echo "Percentage Calculator: http://localhost:5002"
echo "Base64 Converter: http://localhost:5003"
echo "URL Converter: http://localhost:5004"
echo "JWT Decoder: http://localhost:5005"
echo "JWT Encoder: http://localhost:5006"
echo "Hash Generator: http://localhost:5007"
echo "UUID Generator: http://localhost:5008"
echo "Password Generator: http://localhost:5009"
echo "Markdown Viewer: http://localhost:5010"
echo ""
echo "Press Ctrl+C to stop all apps"
echo ""

# Run the dev script which starts all apps
npm run dev