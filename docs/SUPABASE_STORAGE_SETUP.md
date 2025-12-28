# Supabase Storage Setup Guide

## Creating the Media Storage Bucket

The InvestingPro CMS requires a Supabase Storage bucket named `media` to store uploaded images.

### Step 1: Access Supabase Dashboard

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in to your account
3. Select your project

### Step 2: Create the Storage Bucket

1. In the left sidebar, click **Storage**
2. Click **New bucket** (or **Create bucket**)
3. Configure the bucket:
   - **Name**: `media` (must be exactly "media" - case-sensitive)
   - **Public bucket**: ✅ **Enable this** (allows public access to images)
   - **File size limit**: 10 MB (or your preferred limit)
   - **Allowed MIME types**: `image/*` (or leave empty for all types)
4. Click **Create bucket**

### Step 3: Set Up Storage Policies (Row Level Security)

After creating the bucket, you need to configure policies to allow uploads and public access:

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to **Storage** → **Policies** (or click on the `media` bucket → **Policies**)
2. Click **New Policy**
3. Create the following policies:

**Policy 1: Allow Public Read Access**
- **Policy name**: `Public can view images`
- **Allowed operation**: `SELECT` (Read)
- **Policy definition**: 
  ```sql
  true
  ```
- **Description**: Allows anyone to view images

**Policy 2: Allow Authenticated Uploads**
- **Policy name**: `Authenticated users can upload`
- **Allowed operation**: `INSERT` (Upload)
- **Policy definition**:
  ```sql
  auth.role() = 'authenticated'
  ```
- **Description**: Allows authenticated users to upload images

**Policy 3: Allow Authenticated Deletes**
- **Policy name**: `Authenticated users can delete`
- **Allowed operation**: `DELETE`
- **Policy definition**:
  ```sql
  auth.role() = 'authenticated'
  ```
- **Description**: Allows authenticated users to delete images

#### Option B: Using SQL Editor (Alternative)

1. Go to **SQL Editor** in Supabase Dashboard
2. Run the following SQL:

```sql
-- Allow public read access
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media' 
  AND auth.role() = 'authenticated'
);
```

### Step 4: Verify Setup

1. Go to **Storage** → **media** bucket
2. Try uploading a test image manually in the dashboard
3. If successful, the bucket is configured correctly

### Troubleshooting

#### Error: "Storage bucket 'media' does not exist"
- **Solution**: Make sure the bucket name is exactly `media` (lowercase, no spaces)

#### Error: "Permission denied" or "new row violates row-level security"
- **Solution**: Check that the storage policies are set up correctly (Step 3)

#### Error: "File size too large"
- **Solution**: Increase the file size limit in bucket settings or upload smaller images

#### Images not displaying
- **Solution**: Ensure the bucket is set to **Public** (Step 2)

### Development Mode (Without Supabase)

If you're running the app locally without Supabase configured, the upload functionality will show an error. To fully test media uploads, you need:

1. ✅ Supabase project created
2. ✅ `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
3. ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
4. ✅ Storage bucket `media` created
5. ✅ Storage policies configured

### Environment Variables

Make sure your `.env.local` file includes:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase Dashboard under **Settings** → **API**.











