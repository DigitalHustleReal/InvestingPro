# Supabase Storage Setup Guide

## Quick Setup

### 1. Create Storage Bucket

1. Go to your **Supabase Dashboard**
2. Navigate to **Storage** → **Buckets**
3. Click **New bucket**
4. **Name**: `media`
5. **Public**: ✅ Check this (for now - you can restrict later)
6. Click **Create bucket**

### 2. Set Storage Policies

After creating the bucket, you need to set policies to allow uploads:

#### Option A: Public Access (Development)
```sql
-- Allow anyone to upload (for development)
CREATE POLICY "Public can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media');

-- Allow anyone to view images
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Allow anyone to delete images
CREATE POLICY "Public can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'media');
```

#### Option B: Authenticated Users Only (Production)
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Allow public to view
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'media' AND auth.role() = 'authenticated');
```

### 3. Environment Variables

Make sure your `.env.local` file has:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Test Upload

1. Go to `/admin/media`
2. Click "Upload Image"
3. Select an image file
4. It should upload successfully

## Troubleshooting

### Error: "Bucket not found"
- **Solution**: Create the `media` bucket in Supabase Dashboard

### Error: "Permission denied" or "row-level security"
- **Solution**: Add the storage policies above

### Error: "Supabase Storage not configured"
- **Solution**: Check your `.env.local` file has the correct variables

### Upload works but images don't show
- **Solution**: Make sure the bucket is set to **Public** or policies allow SELECT

## Security Notes

For production:
- Use authenticated-only upload policies
- Set bucket to private and use signed URLs
- Implement file size limits
- Add file type validation
- Consider image optimization


















