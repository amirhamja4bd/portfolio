# 🎯 Quick Start: AI Chat Assistant

## What's New?

Your portfolio now has an **intelligent AI Chat Assistant** powered by Google Gemini (FREE)! It reads from your MongoDB database and provides smart, formatted answers about your portfolio.

## 🚀 5-Minute Setup

### 1️⃣ Get FREE API Key

Visit: **https://makersuite.google.com/app/apikey**

- Sign in with Google
- Click "Create API Key"
- Copy the key

### 2️⃣ Add to Environment

```bash
# Create .env.local if it doesn't exist
cp .env.example .env.local

# Edit .env.local and add:
GEMINI_API_KEY=your-api-key-here
```

### 3️⃣ Start Server

```bash
pnpm dev
```

### 4️⃣ Test It!

- Open http://localhost:3000
- Click the AI button (bottom-right corner)
- Ask: "What are your skills?"
- Watch the magic! ✨

## 📖 Full Documentation

See **[docs/AI_CHAT_GEMINI_GUIDE.md](./docs/AI_CHAT_GEMINI_GUIDE.md)** for:

- Complete setup instructions
- Customization options
- Troubleshooting guide
- Advanced features
- API reference

## 🎨 Features

- ✅ Reads real data from MongoDB
- ✅ Smart, context-aware responses
- ✅ Beautiful markdown formatting
- ✅ Syntax highlighting for code
- ✅ Smooth animations
- ✅ Mobile responsive
- ✅ 100% FREE (15 req/min limit)

## 💬 Example Questions

Try asking:

- "What are your technical skills?"
- "Tell me about your projects"
- "What's your work experience?"
- "Show me your latest blog posts"
- "How can I contact you?"

## 🔧 Troubleshooting

### Not working?

1. Check API key in `.env.local`
2. Restart dev server: `pnpm dev`
3. Check browser console for errors
4. Verify MongoDB is connected

### Need help?

Run the setup script:

```bash
./scripts/setup-ai-chat.sh
```

## 🎊 That's It!

Your AI assistant is ready to impress visitors and answer questions about your portfolio!

---

**Note**: The Gemini API is completely FREE with generous limits perfect for personal portfolios.
