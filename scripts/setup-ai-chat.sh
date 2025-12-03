#!/bin/bash

# AI Chat Assistant Setup Script
# This script helps you configure the Google Gemini API for the chat assistant

echo "🤖 AI Chat Assistant Setup"
echo "=========================="
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ Found .env.local file"
else
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
fi

echo ""
echo "📋 To complete setup:"
echo ""
echo "1. Get your FREE Gemini API key:"
echo "   👉 Visit: https://makersuite.google.com/app/apikey"
echo ""
echo "2. Open .env.local and add your API key:"
echo "   GEMINI_API_KEY=your-api-key-here"
echo ""
echo "3. Save the file and restart your dev server:"
echo "   pnpm dev"
echo ""
echo "4. Look for the AI chat button in the bottom-right corner!"
echo ""
echo "📚 For detailed instructions, see:"
echo "   docs/AI_CHAT_GEMINI_GUIDE.md"
echo ""
echo "🎉 Happy chatting!"
