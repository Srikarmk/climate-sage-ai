# Environment Setup Guide

## Setting up Google Gemini API Key

1. Create a `.env` file in the root directory of the project
2. Add your Gemini API key:

```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

3. Get your API key from: https://makersuite.google.com/app/apikey

## Setting up ElevenLabs API

1. Add your ElevenLabs API key and Agent IDs to the `.env` file:

```
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
VITE_ELEVENLABS_AGENT_ID=your_agent_id_here
VITE_ELEVENLABS_CLIMATE_AGENT_ID=your_climate_agent_id_here
```

2. Get your API key from: https://elevenlabs.io/
3. **Agent IDs:**
   - `VITE_ELEVENLABS_AGENT_ID`: Used for speech-to-text functionality
   - `VITE_ELEVENLABS_CLIMATE_AGENT_ID`: Your "ClimateSage-replies" agent ID for chat conversations (uses Gemini 2.5 Flash internally)
4. Get your Agent IDs from your ElevenLabs dashboard after creating agents

## Important Notes

- The `.env` file is already in `.gitignore` so it won't be committed to version control
- Make sure to restart your development server after adding the `.env` file
- The API key must start with `VITE_` to be accessible in the frontend with Vite

## Example .env file

```
VITE_GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
VITE_ELEVENLABS_AGENT_ID=your_agent_id_here
VITE_ELEVENLABS_CLIMATE_AGENT_ID=your_climate_agent_id_here
```

