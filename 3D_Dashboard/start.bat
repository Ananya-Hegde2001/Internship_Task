@echo off
echo Installing dependencies...
call npm install

echo.
echo ✓ Dependencies installed successfully!
echo.
echo Starting development server...
echo The dashboard will open at http://localhost:3000
echo.
call npm run dev
pause
