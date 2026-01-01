# Media Library Setup Guide

## Supabase Storage Configuration

The Media Library requires a Supabase Storage bucket named `media`.

### Create the Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** → **Buckets**
3. Click **New bucket**
4. Name: `media`
5. Make it **Public** (for now - you can restrict later with RLS)
6. Click **Create bucket**

### Storage Policies (Optional - for better security)

If you want to restrict access, you can add RLS policies:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Allow public read access
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');
```

### Current Features

✅ Upload images to Supabase Storage
✅ Grid view with thumbnails
✅ Search and filter
✅ Image preview and details
✅ Delete images
✅ Copy image URL
✅ File size display
✅ Error handling

### Future Enhancements

- [ ] Media metadata table (for alt text, captions, etc.)
- [ ] Image optimization/thumbnails
- [ ] Bulk upload
- [ ] Image cropping/editing
- [ ] Usage tracking (which articles use which images)


















