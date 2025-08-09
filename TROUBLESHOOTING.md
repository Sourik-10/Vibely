# Troubleshooting Guide - API Data Not Fetching

## Problem Description

The application is not fetching data from the API and the user profiles are not visible on the homepage.

## Root Causes Identified

### 1. Missing Environment Variables (CRITICAL)

The backend is missing essential environment variables:

- `MONGO_URI` - Database connection string
- `JWT_SECRET_KEY` - Authentication secret key
- `PORT` - Server port (defaults to 5001)

### 2. Database Connection Issues

Without `MONGO_URI`, the backend cannot connect to MongoDB, causing all API calls to fail.

### 3. Authentication Issues

Without `JWT_SECRET_KEY`, JWT tokens cannot be verified, causing authentication to fail.

## Solutions

### Option 1: Set Environment Variables (Recommended)

#### Windows Command Prompt:

```cmd
set MONGO_URI=mongodb://localhost:27017/vibely
set JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
set PORT=5001
npm run dev
```

#### Windows PowerShell:

```powershell
$env:MONGO_URI = "mongodb://localhost:27017/vibely"
$env:JWT_SECRET_KEY = "your-super-secret-jwt-key-change-this-in-production"
$env:PORT = "5001"
npm run dev
```

#### Use the provided scripts:

- Run `setup-env.bat` (Command Prompt)
- Run `setup-env.ps1` (PowerShell)

### Option 2: Create .env file manually

Create a `.env` file in the `backend/` directory with:

```
MONGO_URI=mongodb://localhost:27017/vibely
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
PORT=5001
```

### Option 3: Set System Environment Variables

1. Open System Properties → Environment Variables
2. Add the variables under "User variables" or "System variables"
3. Restart your terminal/IDE

## Prerequisites

### 1. MongoDB Installation

Ensure MongoDB is installed and running:

```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB (if not running)
mongod
```

### 2. Backend Dependencies

```bash
cd backend
npm install
```

### 3. Frontend Dependencies

```bash
cd frontend
npm install
```

## Testing Steps

### 1. Start Backend

```bash
cd backend
npm run dev
```

Expected output:

```
server is running on port 5001
✅ MongoDB Connected: localhost
```

### 2. Start Frontend

```bash
cd frontend
npm run dev
```

### 3. Check Browser Console

Open browser developer tools and check:

- Network tab for API calls
- Console for error messages
- Application tab for cookies/tokens

### 4. Test API Endpoints

```bash
# Test if backend is running
curl http://localhost:5001/api/auth/me

# Test with authentication (requires valid JWT token)
curl -H "Cookie: jwt=your-token" http://localhost:5001/api/users
```

## Common Error Messages & Solutions

### "MongoDB connection failed"

- Check if MongoDB is running
- Verify `MONGO_URI` is correct
- Ensure MongoDB port (27017) is accessible

### "unauthorized - No token provided"

- User is not logged in
- Check if login/signup is working
- Verify JWT_SECRET_KEY is set

### "unauthorized - Invalid token"

- JWT_SECRET_KEY mismatch
- Token expired
- Check if user is properly authenticated

### CORS errors

- Backend CORS is configured for `http://localhost:5173`
- Ensure frontend is running on correct port
- Check if backend is accessible

## Debug Features Added

The code now includes:

- Console logging for all API calls
- Error display on the homepage
- Request/response interceptors in axios
- Better error handling in React Query

## Next Steps

1. Set environment variables using one of the methods above
2. Ensure MongoDB is running
3. Start backend server
4. Start frontend application
5. Check browser console for debugging information
6. Verify API endpoints are working

## Still Having Issues?

If problems persist:

1. Check browser console for specific error messages
2. Verify backend server logs
3. Test API endpoints with Postman/curl
4. Ensure all dependencies are installed
5. Check if ports 5001 (backend) and 5173 (frontend) are available
