@echo off
echo =============================================================
echo Installing Node.js modules...
echo =============================================================
echo.
echo =============================================================
echo Checking Module: stream
echo =============================================================
echo.
call npm install stream
echo =============================================================
echo Checking Module: fs
echo =============================================================
echo.
call npm install fs
echo =============================================================
echo Checking Module: util
echo =============================================================
echo.
call npm install util
echo =============================================================
echo Installing Module: node-fetch
echo =============================================================
echo.
call npm install node-fetch
echo =============================================================
echo Installing Module: stream-throttle
echo =============================================================
echo.
call npm install stream-throttle
echo =============================================================
echo Installing Module: progress
echo =============================================================
echo.
call npm install progress
echo =============================================================
echo Installation complete.
echo =============================================================
echo.

set /p user_input=Do you wish to run the Gfycat Download script (Y/N)?
if /i %user_input%==Y (
    cls
    echo =============================================================
    echo Running the Gfycat Download script... :)
    echo =============================================================
    echo This may take a while depending on your internet connection.
    echo Please be patient.
    echo =============================================================
    echo Hit Ctrl+C or close this terminal to cancel the download...
    echo =============================================================
    echo Progress:
    call node ./gfycat-download.mjs
    echo =============================================================

) else (
    echo Exiting...
)

pause