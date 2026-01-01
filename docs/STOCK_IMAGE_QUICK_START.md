# Stock Image Integration - Quick Start

## ✅ Setup Complete!

Your Pexels API key has been added to `.env.local`. The stock image integration is ready to use!

## How to Use

### 1. Restart Your Development Server

**Important**: You must restart the Next.js server for the new environment variable to take effect.

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. Access Stock Images

1. Go to **Admin** → **Media Library** (`http://localhost:3000/admin/media`)
2. Click the **"Stock Images"** tab
3. Search for images (e.g., "finance", "investment", "retirement", "credit card")
4. Browse results from Pexels (free, unlimited)
5. Click any image to automatically download and add it to your media library

### 3. Use in Articles

Once added to your media library:
- Images appear in "My Media" tab
- Can be used as featured images
- Can be inserted into article content
- All metadata (photographer, source) is automatically stored

## Features Available

✅ **Pexels Integration** (Active)
- Unlimited free images
- High-quality stock photos
- Automatic attribution

⏳ **Unsplash Integration** (Optional)
- Get API key at: https://unsplash.com/developers
- Add to `.env.local`: `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_key`
- Free tier: 50 requests/hour

## Testing

1. **Test Pexels Search**:
   - Go to Media Library → Stock Images tab
   - Search for "finance"
   - You should see results immediately

2. **Test Image Download**:
   - Click on any image
   - It should download and appear in "My Media" tab
   - Check that it's uploaded to Supabase Storage

## Troubleshooting

### "API key not configured" error
- ✅ Already fixed - key is in `.env.local`
- Make sure you restarted the dev server

### Images not loading
- Check browser console for errors
- Verify Supabase Storage bucket exists
- Check network tab for API calls

### Rate limits
- Pexels: Unlimited (no worries!)
- Unsplash: 50/hour (if you add it later)

## Next Steps

1. **Restart your dev server** (required!)
2. **Test the stock image search**
3. **Add Unsplash** (optional, for more variety)
4. **Start using in your articles!**

---

**Your Pexels API Key**: `PwXCmeo4jefIBHvVQO1yBKuPoD2OKyvxvnup0N68wotIq5cldWdyRqlR` ✅ Configured


















