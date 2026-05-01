@echo off
cd /d "c:\Users\alimo\OneDrive\SE"
set PORT=5174

rem If server is already running on this port, just open browser.
netstat -ano | findstr ":%PORT% " >nul
if %errorlevel%==0 goto open_browser

rem Start server in a separate window.
start "MS2 Local Server" cmd /c ""c:\Users\alimo\AppData\Local\Programs\cursor\resources\app\resources\helpers\node.exe" "c:\Users\alimo\OneDrive\SE\server.js""

rem Give the server a second to start.
timeout /t 1 /nobreak >nul

:open_browser
start msedge "http://localhost:%PORT%"
exit /b
