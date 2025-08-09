@echo off
echo Setting up environment variables for Vibely backend...
echo.

REM Set MongoDB URI (change this to your actual MongoDB connection string)
set MONGO_URI=mongodb://localhost:27017/vibely

REM Set JWT Secret Key (change this to a secure random string)
set JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production

REM Set Port
set PORT=5001

echo Environment variables set:
echo MONGO_URI=%MONGO_URI%
echo JWT_SECRET_KEY=%JWT_SECRET_KEY%
echo PORT=%PORT%
echo.

echo To start the backend with these environment variables, run:
echo npm run dev
echo.

pause
