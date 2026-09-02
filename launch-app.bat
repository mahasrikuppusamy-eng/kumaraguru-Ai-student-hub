@echo off
title Kumaraguru AI Student Hub
echo ========================================================
echo   Launching Kumaraguru AI Student Hub (Desktop App)
echo ========================================================
echo.

:: Start Vite dev server in background if not already running
start /B npm run dev > nul 2>&1

:: Wait 2 seconds for server to be ready
ping 127.0.0.1 -n 3 > nul

:: Launch in native Standalone Application Window mode
start msedge --app=http://localhost:3000/ --window-size=1280,820 || start chrome --app=http://localhost:3000/ --window-size=1280,820 || start http://localhost:3000/

echo Application launched in standalone window!
exit
