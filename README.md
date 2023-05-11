# <img src="./readme-logo.png" alt="Agenda Booking App" style="width: 100px; height: 100px; border-radius: 50%;"> Agenda Booking App

## Table of Contents
- [Introduction](#introduction)
- [Installation and Configuration](#installation-and-configuration)
- [Running the Application](#running-the-application)
- [Additional Notes](#additional-notes)

## Introduction
Agenda Booking App is a comprehensive application that allows you to register shops, services, products, and clients. It also enables clients to make reservations and complete payments seamlessly.

## Installation and Configuration

### Server Setup
1. Navigate to the server directory and create a `.env` file with the following configuration:
   ```plaintext
   PORT=xxxx
   DATABASE_URL=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   Example configuration:
   ```plaintext
   PORT=4040
   DATABASE_URL=mongodb://127.0.0.1:27017/agenda_app
   JWT_SECRET=v*N"fpu9IFJHh1FqgK~''@YS55&u5J
   ```

2. Run the following command in the server directory to install the required dependencies:
   ```bash
   npm install --save
   ```

### Client Setup
1. Navigate to the client directory and create a `.env` file.

2. Set the following configuration in the `.env` file:
   ```plaintext
   PORT=xxxx
   ```
   Example:
   ```plaintext
   PORT=3001
   ```

3. Run the following command in the client directory to install the required dependencies:
   ```bash
   npm install --save
   ```

### Dashboard Setup
1. Navigate to the dashboard directory.

2. Run the following command in the dashboard directory to install the required dependencies:
   ```bash
   npm install --save
   ```

### Application Setup
1. Go back to the base directory.

2. Run the following command at the base directory to install the required dependencies:
   ```bash
   npm install --save
   ```

## Running the Application
To start the application, run the following command in the base directory:
```bash
npm run all
```

Please ensure that your database is properly connected before running the application.

## Additional Notes
If you have Bash installed on your machine, you can simply type `./install-dependencies.sh` to install the dependencies.

If the dependencies were not installed correctly, follow these additional steps:

1. Run the command prompt as administrator.

2. Clean the npm cache inside each directory (server, client, and dashboard) using the following commands:
   ```bash
   cd server
   npm cache clean --force
   cd ../client
   npm cache clean --force
   cd ../dashboard
   npm cache clean --force
   ```

3. Update npm to the latest version:
   ```bash
   npm install -g npm@latest
   ```