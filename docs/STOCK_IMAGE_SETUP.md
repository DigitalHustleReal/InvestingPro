# Stock Image Integration Setup Guide

## Overview

The Media Library now includes direct access to **Pexels** and **Unsplash** stock image APIs, allowing you to search and download professional images directly within the CMS.

## Step 1: Get API Keys

### Pexels (Recommended - Free, Unlimited)

1. Go to [https://www.pexels.com/api/](https://www.pexels.com/api/)
2. Click "Get Started" or "Get API Key"
3. Sign up for a free account (or log in)
4. Copy your API key from the dashboard
5. **Free tier**: Unlimited requests, no credit card required

### Unsplash (Free Tier Available)

1. Go to [https://unsplash.com/developers](https://unsplash.com/developers)
2. Click "Register as a developer"
3. Create an application
4. Copy your Access Key
5. **Free tier**: 50 requests/hour

## Step 2: Add API Keys to Environment Variables

Add these to your `.env.local` file:

```env
# Stock Image APIs
NEXT_PUBLIC_PEXELS_API_KEY=your_pexels_api_key_here
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

## Step 3: Restart Development Server

After adding the API keys, restart your Next.js development server:

```bash
npm run dev
```

## Step 4: Use Stock Images

1. Go to **Admin** → **Media Library**
2. Click the **"Stock Images"** tab
3. Search for images (e.g., "finance", "investment", "retirement")
4. Click on an image to download and add it to your media library
5. The image will be automatically uploaded to Supabase Storage
6. Use it in your articles like any other uploaded image

## Features

- ✅ **Free stock images** from Pexels and Unsplash
- ✅ **Automatic attribution** (photographer credit stored in metadata)
- ✅ **Direct download** to your media library
- ✅ **Search functionality** with filters
- ✅ **No external downloads** - everything stays in your CMS

## Image Licensing

- **Pexels**: Free to use, no attribution required (but we store it)
- **Unsplash**: Free to use, attribution recommended (stored automatically)

Both services allow commercial use without restrictions.

## Troubleshooting

### "API key not configured" error

- Make sure you've added the keys to `.env.local`
- Restart your development server
- Check that the keys are correct (no extra spaces)

### "Rate limit exceeded" (Unsplash)

- Unsplash free tier: 50 requests/hour
- Wait a few minutes and try again
- Consider using Pexels (unlimited) as primary source

### Images not downloading

- Check your Supabase Storage bucket exists and has proper policies
- Verify internet connection
- Check browser console for errors

## Next Steps

After setting up stock images, you can:

1. **Search and add images** directly from the media library
2. **Use in articles** via the featured image picker
3. **Edit metadata** (alt text, title, etc.) after adding
4. **Organize** images in your media library

## Cost

- **Pexels**: Free (unlimited)
- **Unsplash**: Free (50 requests/hour)
- **Total**: $0/month for small to medium usage

For high-volume usage, consider upgrading Unsplash or using Pexels exclusively.
















