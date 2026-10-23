@echo off
echo Installing Firebase CLI...
call npm install -g firebase-tools

echo.
echo Logging in to Firebase...
call firebase login

echo.
echo Initializing Firebase project...
call firebase init

echo.
echo Deploying Cloud Functions...
call firebase deploy --only functions

echo.
echo Deployment complete!
pause
