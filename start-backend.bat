@echo off
echo Starting IA Management Backend (Node.js)...
cd /d "%~dp0backend-nodejs"
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)
echo Starting Backend Server...
npm run dev
pause
