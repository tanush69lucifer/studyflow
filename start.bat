@echo off
title StudyFlow - Dev
cd /d "%~dp0"

if not exist node_modules ( echo Running setup first... & call setup.bat )
if not exist backend\.env ( echo [X] backend\.env missing. Run setup.bat first. & pause & exit /b 1 )

echo Starting backend (http://localhost:3000) and frontend (http://localhost:5173)...
echo Press Ctrl+C to stop both.
start "" http://localhost:5173
call npm run dev
pause
