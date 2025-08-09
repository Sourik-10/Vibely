# Profile Image Setup with Cloudinary

This guide explains how to set up Cloudinary for profile image uploads in your Vibely application.

## Prerequisites

1. A Cloudinary account (free tier available)
2. Node.js and npm installed

## Setup Steps

### 1. Install Dependencies

In the backend directory, install the required packages:

```bash
cd backend
npm install cloudinary multer
```

### 2. Configure Cloudinary

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Sign up or log in to your account
3. Get your credentials from the Dashboard:
   - Cloud Name
   - API Key
   - API Secret

### 3. Set Environment Variables

Create a `.env` file in the backend directory with your Cloudinary credentials:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Other existing variables...
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret_key
```

### 4. Restart Your Backend Server

After setting up the environment variables, restart your backend server:

```bash
cd backend
npm run dev
```

## Features Implemented

### ✅ Profile Image Upload

- Users can upload profile images during onboarding
- Support for JPG, PNG, GIF, and other image formats
- 5MB file size limit
- Automatic image optimization and cropping

### ✅ Fallback Avatars

- DiceBear API integration for generating unique avatars
- Fallback icons when images fail to load
- Consistent avatar generation based on user's name

### ✅ Image Error Handling

- Graceful fallbacks when images fail to load
- Loading states and error handling
- Responsive image display

### ✅ Cloudinary Integration

- Secure image storage in the cloud
- Automatic image transformations (400x400, face detection)
- CDN delivery for fast loading

## API Endpoints

- `POST /api/profile/upload-image` - Upload profile image
- `DELETE /api/profile/delete-image` - Reset to default avatar

## Usage

1. **During Onboarding**: Users can upload an image or generate a random avatar
2. **Image Preview**: Real-time preview of selected images
3. **Automatic Upload**: Images are uploaded to Cloudinary when onboarding is submitted
4. **Fallback Display**: ProfileImage component handles all image display scenarios

## Troubleshooting

### Images Not Loading

- Check if Cloudinary credentials are correct
- Verify environment variables are set
- Check browser console for errors
- Ensure backend server is running

### Upload Failures

- Check file size (must be under 5MB)
- Verify file type (must be an image)
- Check network connectivity
- Review backend logs for errors

### Profile Images Not Visible

- Clear browser cache
- Check if user has completed onboarding
- Verify profilePic field in database
- Check if Cloudinary URLs are accessible

## Security Features

- File type validation
- File size limits
- Secure image URLs (HTTPS)
- User authentication required for uploads
- Automatic image optimization

## Performance Optimizations

- Lazy loading for profile images
- Automatic image compression
- CDN delivery
- Responsive image sizing
- Fallback caching
