@echo off
title StudyFlow - Push to GitHub
cd /d "%~dp0"
REM Usage:  push.bat                -> commits with a default message and pushes
REM         push.bat "your message" -> commits with your message and pushes
REM First time only: create an EMPTY repo on github.com, then run
REM   git remote add origin https://github.com/<you>/<repo>.git

where git >nul 2>nul || (echo [X] Git not found. Install from https://git-scm.com & pause & exit /b 1)

if not exist .git (
  git init
  git branch -M main
)

git remote get-url origin >nul 2>nul
if errorlevel 1 (
  set /p REPO=Paste your GitHub repo URL ^(https://github.com/you/repo.git^):
  call git remote add origin %%REPO%%
)

set MSG=%~1
if "%MSG%"=="" set MSG=Update StudyFlow

git add -A
git commit -m "%MSG%"
git push -u origin main
pause
