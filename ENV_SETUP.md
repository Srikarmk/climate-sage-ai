# Environment Setup Guide

## Setting up Google Gemini API Key

1. Create a `.env` file in the root directory of the project
2. Add your Gemini API key:

```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

3. Get your API key from: https://makersuite.google.com/app/apikey

## Important Notes

- The `.env` file is already in `.gitignore` so it won't be committed to version control
- Make sure to restart your development server after adding the `.env` file
- The API key must start with `VITE_` to be accessible in the frontend with Vite

## Example .env file

```
VITE_GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

