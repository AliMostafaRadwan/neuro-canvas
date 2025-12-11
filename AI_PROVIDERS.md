# AI Provider Configuration Guide

## Overview

Neuro-Canvas now supports multiple AI providers for code generation. You can choose between:
- **Gemini** (Google's Generative AI) - **Default & Recommended**
- **OpenAI** (GPT-4o)
- **Together AI** (Meta LLaMA 3.1 70B)
- **OpenRouter** (Access to 100+ models including Claude, GPT-4, LLaMA, etc.)
- **Mistral** (Codestral - specialized for coding)


## Quick Start

### 1. Get Your API Key

Choose one or more providers and get your API key:

#### Gemini (Recommended - Free tier available)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

#### OpenAI (Paid service)
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Navigate to API keys
4. Click "Create new secret key"
5. Copy your API key

#### Together AI (Paid service with generous free tier)
1. Visit [Together AI](https://api.together.xyz/settings/api-keys)
2. Sign up for an account
3. Navigate to API Keys in settings
4. Create a new API key
5. Copy your API key

#### OpenRouter (Access to 100+ models)
1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Sign up for an account
3. Click "Create Key"
4. Copy your API key

### 2. Configure Environment Variables

Create a `.env` file in the project root (or update your existing one):

```bash
# Choose at least one provider:

# Gemini (Recommended)
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI (Optional)
OPENAI_API_KEY=your_openai_api_key_here

# Together AI (Optional)
TOGETHER_API_KEY=your_together_api_key_here

# OpenRouter (Optional)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Mistral (Optional)
MISTRAL_API_KEY=your_mistral_api_key_here
```

**Note**: You only need to configure the provider(s) you want to use. Gemini is recommended as the default.

### 3. Restart the Development Server

After adding your API key(s), restart the server:

```bash
npm run dev
```

## Provider Comparison

| Feature | Gemini | OpenAI | Together AI | OpenRouter | Mistral |
|---------|--------|--------|-------------|------------|---------|
| **Model** | gemini-flash-latest | GPT-4o | LLaMA 3.1 70B | Claude 3.5 Sonnet | Mistral codestral-latest |
| **Free Tier** | ✅ Yes (generous) | ❌ No | ❌ No | ✅ Yes (limited) | ✅ Yes (limited) |
| **Speed** | ⚡ Very Fast | 🚀 Fast | 🚀 Fast | 🚀 Fast | 🚀 Fast |
| **Code Quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Context Length** | 128K tokens | 128K tokens | 128K tokens | 200K tokens | 128K tokens |
| **Best For** | General use, cost-effective | Premium quality, latest features | Open source, customization | Access to multiple models | General use, cost-effective |

## Using the Provider Selector

### In the Web Interface

1. **Before Code Generation**:
   - Open the Code Preview panel (right side)
   - Select your desired framework (PyTorch, TensorFlow, JAX)
   - **Select your AI provider** from the dropdown:
     - "Gemini (Default)" - Uses Google's Gemini
     - "OpenAI" - Uses GPT-4o
     - "Together AI" - Uses Meta LLaMA 3.1
     - "OpenRouter" - Uses Claude 3.5 Sonnet (+ access to 100+ models)
   - Click "Generate Code"

2. **After Code Generation**:
   - You can change providers at any time
   - The provider selector remains visible in the header
   - Regenerate code to use the new provider

### Provider Selection UI

```
┌─────────────────────────────────────┐
│   Framework    │   AI Provider      │
│  [PyTorch ▼]   │  [Gemini ▼]        │
│                                     │
│  [Generate Code]                    │
└─────────────────────────────────────┘
```

## Technical Details

### API Endpoints

The `/api/generate-code` endpoint now accepts a `provider` field:

```typescript
POST /api/generate-code
{
  "graph": { /* node graph */ },
  "framework": "pytorch",  // "pytorch" | "tensorflow" | "jax"
  "provider": "gemini"      // "gemini" | "openai" | "together" | "openrouter"
}
```

### Models Used

- **Gemini**: `gemini-2.0-flash-exp`
- **OpenAI**: `gpt-4o`
- **Together AI**: `meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo`
- **OpenRouter**: `anthropic/claude-3.5-sonnet`

### Error Handling

If an API key is missing when you try to use a provider, you'll see an error:

```
Error: GEMINI_API_KEY environment variable is not set.
Please add your Gemini API key to use Gemini provider.
```

Simply add the required API key to your `.env` file and restart the server.

## Environment Variables Reference

```bash
# AI Provider API Keys (choose at least one)
GEMINI_API_KEY=      # Google Gemini API key
OPENAI_API_KEY=      # OpenAI API key
TOGETHER_API_KEY=    # Together AI API key
OPENROUTER_API_KEY=  # OpenRouter API key
MISTRAL_API_KEY=     # Mistral API key

# Database (optional - uses in-memory if not set)
DATABASE_URL=postgresql://user:password@localhost:5432/neurocanvas

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Troubleshooting

### "Failed to generate code"

1. **Check your API key**:
   - Ensure the API key is correctly set in `.env`
   - Verify there are no extra spaces or quotes
   - Confirm the key is valid and hasn't expired

2. **Check your internet connection**:
   - All providers require an active internet connection

3. **Check Rate Limits**:
   - Gemini: 15 requests per minute (free tier)
   - OpenAI: Varies by plan
   - Together AI: Varies by plan
   - OpenRouter: Varies by model

### "Provider not available"

- Ensure you've set the API key for the selected provider
- Restart the development server after adding API keys

### Code Quality Issues

- Try different providers - each has strengths
- Gemini: Great for general neural networks
- OpenAI: Best for complex architectures
- Together AI: Good for open-source focused projects
- OpenRouter: Best when you need access to multiple models

## Best Practices

1. **Start with Gemini**: It's free, fast, and produces excellent code
2. **Keep Multiple Keys**: Configure all providers for maximum flexibility
3. **Monitor Usage**: Check your API usage in each provider's dashboard
4. **Secure Your Keys**: Never commit `.env` files to version control
5. **Use .env.example**: Keep `.env.example` updated for team members

## Cost Optimization

### Free Tier Usage
1. **Gemini**: 1,500 requests per day (free forever)
2. **Together AI**: $25 free credits on signup
3. **OpenRouter**: $5 free credits on signup
4. **OpenAI**: No free tier, pay-as-you-go

### Recommendations
- Use Gemini for development and testing
- Switch to OpenAI for production if needed
- Use Together AI for open-source compliance

## Security Notes

⚠️ **Important Security Guidelines**:

1. **Never commit API keys** to Git repositories
2. Add `.env` to `.gitignore` (already done)
3. Rotate keys periodically
4. Use separate keys for development and production
5. Restrict API key permissions in provider dashboards

## Support

If you encounter issues:
1. Check the [Gemini AI documentation](https://ai.google.dev/docs)
2. Check the [OpenAI API documentation](https://platform.openai.com/docs)
3. Check the [Together AI documentation](https://docs.together.ai)
4. Check the [OpenRouter documentation](https://openrouter.ai/docs)

---

**Last Updated**: December 9, 2025
**Neuro-Canvas Version**: 1.0.0
