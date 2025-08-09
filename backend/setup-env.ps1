# PowerShell script to set up environment variables for Vibely backend

Write-Host "Setting up environment variables for Vibely backend..." -ForegroundColor Green
Write-Host ""

# Set MongoDB URI (change this to your actual MongoDB connection string)
$env:MONGO_URI = "mongodb://localhost:27017/vibely"

# Set JWT Secret Key (change this to a secure random string)
$env:JWT_SECRET_KEY = "your-super-secret-jwt-key-change-this-in-production"

# Set Port
$env:PORT = "5001"

Write-Host "Environment variables set:" -ForegroundColor Yellow
Write-Host "MONGO_URI: $env:MONGO_URI"
Write-Host "JWT_SECRET_KEY: $env:JWT_SECRET_KEY"
Write-Host "PORT: $env:PORT"
Write-Host ""

Write-Host "To start the backend with these environment variables, run:" -ForegroundColor Cyan
Write-Host "npm run dev"
Write-Host ""

Write-Host "Note: These environment variables are only set for the current PowerShell session." -ForegroundColor Red
Write-Host "To make them permanent, add them to your system environment variables or create a .env file." -ForegroundColor Red

Read-Host "Press Enter to continue"
