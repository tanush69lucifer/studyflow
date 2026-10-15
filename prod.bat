@echo off
title StudyFlow - Production build
cd /d "%~dp0"
REM Builds the React app and serves everything from the Express server on one port,
REM exactly how it runs when deployed live.

call npm run build || ( echo [X] Build failed & pause & exit /b 1 )
echo.
echo Open http://localhost:3000
start "" http://localhost:3000
call npm start
pause
