# Background Video Setup

## Current Implementation

The landing page now includes a video background with sky and mountains. Currently using a Pexels video as a placeholder.

## To Use Your Own Video/GIF

1. **Option 1: Use a local video file**
   - Place your video file in the `public` folder (e.g., `public/background-video.mp4`)
   - Update the video source in `src/pages/Index.tsx`:
   ```tsx
   <source src="/background-video.mp4" type="video/mp4" />
   ```

2. **Option 2: Use a GIF**
   - Place your GIF in the `public` folder
   - Replace the video element with an img tag:
   ```tsx
   <img 
     src="/background-animation.gif" 
     alt="Background" 
     className="absolute inset-0 w-full h-full object-cover opacity-40"
     style={{ filter: 'brightness(0.6) contrast(1.2)' }}
   />
   ```

3. **Option 3: Use an online video/GIF**
   - Update the `src` attribute with your video URL
   - Ensure the video is publicly accessible

## Recommended Video Sources

- **Pexels**: https://www.pexels.com/videos/ (free, high-quality)
- **Pixabay**: https://pixabay.com/videos/ (free)
- **Unsplash**: https://unsplash.com/ (free images, can convert to video)

## Video Specifications

- **Format**: MP4 (H.264 codec recommended)
- **Resolution**: 1920x1080 or higher
- **Duration**: Loop-friendly (10-30 seconds)
- **File Size**: Keep under 5MB for better performance
- **Content**: Sky, mountains, birds, nature scenes work best

## Current Video

Currently using: Pexels video ID 3045163 (sky and nature scene)

