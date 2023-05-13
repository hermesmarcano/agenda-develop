# Get the current directory
$currentDir = Get-Location

# Clear npm cache
npm cache clean --force

# Update npm
npm install -g npm

# Delete node_modules in each project directory
Remove-Item -Path "$currentDir\server\node_modules" -Force -Recurse
Remove-Item -Path "$currentDir\dashboard\node_modules" -Force -Recurse
Remove-Item -Path "$currentDir\client\node_modules" -Force -Recurse

# Create .env file in server directory
@"
PORT=4040
DATABASE_URL=mongodb://127.0.0.1:27017/agenda_app
JWT_SECRET=v*N`"fpu9IFJHh1FqgK~''@YS55&u5J
"@ | Set-Content -Path "$currentDir\server\.env" -Encoding UTF8

# Create .env file in client directory
@"
PORT=3001
"@ | Set-Content -Path "$currentDir\client\.env" -Encoding UTF8

# Change to the server directory and install dependencies
cd "$currentDir\server"
npm install

# Change to the client directory and install dependencies
cd "$currentDir\client"
npm install

# Change to the dashboard directory and install dependencies
cd "$currentDir\dashboard"
npm install

# Change back to the current directory and install dependencies
cd "$currentDir"
npm install

# Run npm run all in the current directory
npm run all

