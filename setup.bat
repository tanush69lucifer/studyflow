@echo off
title StudyFlow - Setup
cd /d "%~dp0"

where node >nul 2>nul || (echo [X] Node.js not found. Install Node 20+ from https://nodejs.org & pause & exit /b 1)
echo Node version:
node -v

echo.
echo [1/3] Installing root tools...
call npm install || goto :fail

echo.
echo [2/3] Installing backend + frontend packages...
call npm run install:all || goto :fail

echo.
echo [3/3] Creating .env files (only if missing)...
if not exist backend\.env (
  copy backend\.env.example backend\.env >nul
  echo   - backend\.env created. PUT YOUR MONGODB ATLAS URI + JWT_SECRET IN IT.
) else ( echo   - backend\.env already exists, kept it. )
if not exist frontend\.env (
  copy frontend\.env.example frontend\.env >nul
  echo   - frontend\.env created.
) else ( echo   - frontend\.env already exists, kept it. )

echo.
echo Generating a random JWT_SECRET you can paste into backend\.env:
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

echo.
echo ==========================================================
echo  Setup done. Next:
echo   1. Open backend\.env and set MONGODB_URI and JWT_SECRET
echo   2. Double-click start.bat
echo ==========================================================
notepad backend\.env
pause
exit /b 0

:fail
echo.
echo [X] Setup failed. Scroll up for the error.
pause
exit /b 1
