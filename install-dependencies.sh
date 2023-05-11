#!/bin/bash

script_path=$(readlink -f $0)
script_path=$(dirname $script_path)

echo $script_path

# Clean npm cache in each project folder
echo "Cleaning npm cache..."
cd $script_path
cd server && sudo npm cache clean --force
cd ../dashboard && sudo npm cache clean --force
cd ../client && sudo npm cache clean --force

# Check npm version and update if necessary
echo "Checking npm version..."
npm_version=$(npm --version)
latest_npm_version=$(npm view npm version)

if [[ $npm_version != $latest_npm_version ]]; then
  echo "Updating npm to the latest version..."
  npm install -g npm@latest
fi

# Delete node_modules in each project folder
echo "Deleting node_modules..."
cd $script_path
rm -rf /node_modules
rm -rf server/node_modules
rm -rf dashboard/node_modules
rm -rf client/node_modules

# Delete package-lock.json
# echo "Deleting package-lock.json..."
# rm -f server/package-lock.json
# rm -f dashboard/package-lock.json
# rm -f client/package-lock.json

# Create .env file in the client folder
# Create .env file in the client folder if it doesn't exist
cd $script_path
echo "Creating .env file..."
if [[ -f client/.env ]]; then
  read -p "A .env file already exists. Do you want to overwrite it? (y/n): " overwrite
  if [[ $overwrite != "y" && $overwrite != "Y" ]]; then
    echo "Skipping .env file creation..."
  else
    echo "PORT=3001" > client/.env
    echo "Successfully created a new .env file."
  fi
else
  echo "PORT=3001" > client/.env
  echo "Successfully created a new .env file."
fi

# Create .env file in the server folder
cd $script_path
echo "Creating .env file in the server folder..."
echo "PORT=4040" > server/.env
echo "DATABASE_URL=mongodb://127.0.0.1:27017/agenda_app" >> server/.env
echo "JWT_SECRET=v*N\"fpu9IFJHh1FqgK~''@YS55&u5J" >> server/.env
echo "Successfully created a new .env file in the server folder."

# Installing Nodemon for server as a dev-dependency
cd $script_path
echo "Installing nodemon for server..."
cd server && npm install --save-dev nodemon

# Install dependencies using npm install
cd $script_path
echo "Installing dependencies with npm install..."
cd server && npm install
cd ../dashboard && npm install
cd ../client && npm install

# Installing Concurrently as a dev-dependency
cd $script_path
echo "Installing concurrently"
cd ../ && npm install --save-dev concurrently

echo "Dependencies installation completed successfully!"

# Running the App
cd $script_path
echo "Running agenda-app"
npm run all
