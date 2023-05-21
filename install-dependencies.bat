@echo off

REM Clear npm cache
npm cache clean --force

REM Update npm
npm install -g npm

REM Delete node_modules in each project directory
rmdir /s /q ".\server\node_modules"
rmdir /s /q ".\dashboard\node_modules"
rmdir /s /q ".\client\node_modules"

REM Create .env file in server directory
echo PORT=4040 > ".\server\.env"
echo DATABASE_URL=mongodb://127.0.0.1:27017/agenda_app >> ".\server\.env"
echo JWT_SECRET=v*Nfpu9IFJHh1FqgK~@YS55&u5J >> ".\server\.env"
echo MAIL_USERNAME=example@outlook.com >> ".\server\.env"
echo MAIL_PASSWORD=xxxxxxxxx >> ".\server\.env"

REM Create .env file in client directory
echo PORT=3001 > ".\client\.env"

REM Change to the server directory and install dependencies
cd ".\server"
npm install

REM Change to the client directory and install dependencies
cd "..\client"
npm install

REM Change to the dashboard directory and install dependencies
cd "..\dashboard"
npm install

REM Change back to the current directory and install dependencies
cd ".."
npm install

REM Run npm run all in the current directory
npm run all

