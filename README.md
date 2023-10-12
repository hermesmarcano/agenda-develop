<h1 style="text-align: center;">
  <img src="./readme-logo.png" alt="Agenda Booking App" width="100" height="100" style="border-radius: 50%;">
  <br>
  Agenda Booking App
</h1>


## Table of Contents

- [Introduction](#introduction)
- [Installation and Configuration](#installation-and-configuration)
  - [Manual Setup](#manual-setup)
    - [Server Setup](#server-setup)
    - [Client Setup](#client-setup)
    - [Dashboard Setup](#dashboard-setup)
    - [Application Setup](#application-setup)
  - [Script Setup](#script-setup)
- [Usage](#usage)
  - [Client App](#client-app)
  - [Admin Dashboard in the Client App](#admin-dashboard-in-the-client-app)
  - [Manager's Dashboard App](#managers-dashboard-app)
- [Running the Application](#running-the-application)
- [Additional Notes](#additional-notes)
- [License](#license)

## Introduction

Agenda Booking App is a comprehensive application that allows you to register shops, services, products, and clients. It also enables clients to make reservations and complete payments seamlessly.

## Installation and Configuration

### Manual Setup

1. Clone the repository: `git clone https://github.com/username/project.git`.
2. Navigate to the project directory: `cd project`.

#### Server Setup

1. Navigate to the server directory and create a `.env` file with the following configuration:
   ```plaintext
   PORT=xxxx
   DATABASE_URL=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   MAIL_USERNAME=example@outlook.com
   MAIL_PASSWORD=xxxxxxxxx

   ```
   Example configuration:
   ```plaintext
   PORT=4040
   DATABASE_URL=mongodb://127.0.0.1:27017/agenda_app
   JWT_SECRET=v*N"fpu9IFJHh1FqgK~''@YS55&u5J
   ```

2. Run the following command in the server directory to install the required dependencies:
   ```bash
   npm install
   ```

#### Client Setup

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
   npm install
   ```

#### Dashboard Setup

1. Navigate to the dashboard directory.

2. Run the following command in the dashboard directory to install the required dependencies:
   ```bash
   npm install
   ```

#### Application Setup

1. Go back to the base directory.

2. Run the following command at the base directory to install the required dependencies:
   ```bash
   npm install
   ```

### Script Setup

1. Clone the repository: `git clone https://github.com/username/project.git`.
2. Navigate to the project directory: `cd project`.
3. Choose the appropriate setup method for your operating system:

#### Windows (CMD)

- Open Command Prompt (CMD).
- Run the script using the following command: `./install-dependencies.bat`.

#### Windows (PowerShell)

- Open PowerShell.
- Allow execution policy by running the following command: `Set-ExecutionPolicy RemoteSigned`.
- Run the script using the following command: `./install-dependencies.ps1`.

#### Mac and Linux

- Open Terminal.
- Run the script using the following command: `./install-dependencies.sh`.

Please note that for all the script setup methods, you should navigate to the project directory first.

## Usage

The application consists of three separate apps:

 client, admin dashboard, and manager's dashboard.

### Client App

To reserve an appointment, follow these steps:

1. Enter the URL of the shop or click on "Find Shop" on the home page. Alternatively, use the search bar to search for the shop name.
2. On the "Find Shop" page, click on the desired shop.
3. Now you are on the shop page where you can see the shop's logo and book an appointment. You can either log in as a customer using your phone number, register a new account, or wait until the booking summary to perform these actions.
4. On the services choosing page, choose one or more services, then click "Continue".
5. On the professional page, choose the professional you prefer.
6. Next, choose the desired date.
7. After that, choose the hour to book your appointment.
8. You will see the appointment summary, where you can review the appointment information before confirming.
9. After clicking on "Confirm" on the summary page, you will either be redirected to the login page if you haven't signed in before, or you will be directed to the checkout page if you've already signed up.
10. Congratulations on booking your appointment! Click on "Done" to return to the home page.

### Admin Dashboard in the Client App

The admin dashboard in the client app provides the following features:

1. Home Page: View cards showing total transactions, total shops, and total customers. You can also see shop data and delete items as needed.
2. Hero Page: Control the hero part of the language page text, text color, or background color.
3. Component Page: Fill in the required data for articles, section 1, section 2, recommended services, and recommended shops.
4. Settings Page: Update admin data and website logo.

### Manager's Dashboard App

To use the manager's dashboard app, follow these steps:

1. Login Page: Enter your login credentials. If this is your first time, click on "Register" to open the registration page. If you have registered before and forgot the password, click on "Forgot your password" to access the forgot password form. Enter your email address (the one you registered with), which must be a valid email.
2. After logging in, you will be directed to the home page where you can see the calendar to view available dates, your shop logo and title, and the hours at the bottom to see the appointments or reserve an appointment.
3. Appointment List Page: This page displays all the reserved appointments. You can confirm any appointment by clicking on "Confirm". To delete appointments, select the appointments using the checkboxes in the table or use the "Select All" option in the table header checkbox. Clicking on the "Delete" button will prompt a confirmation message. Confirming the deletion will remove the selected appointments.
4. Client Page: View the customers in a table, delete customers (same steps as the previous step), add a new customer (by clicking on "Add New Customer," a popup with a form will appear to fill in the required data), and edit customer details (click on the edit icon in the table for any item, and a form similar to the add form will appear as a popup with the registered data displayed in the fields. You can make changes and click "Update" to save the changes).
5. Professional, Service, and Product Pages: These pages provide the same options as the client page. However, the service and product pages include an image upload feature in the add form, and the edit form allows image deletion and re-uploading.
6. Settings Page: Change manager's shop name, name, and logo.
7. Finance Page: Monitor shop operations, including total earnings, total customers,

 total sold products, and reserved appointments. This page includes charts for earnings per day and earnings per service, as well as a table displaying all shop transactions.

## Running the Application

To start the application, run the following command in the base directory:
```bash
npm run all
```

Please ensure that your database is properly connected before running the application.

## Additional Notes

If the dependencies were not installed correctly, follow these additional steps:

1. Run the command prompt as an administrator.
2. Clean the npm cache inside each directory (server, client, and dashboard) using the following commands:
   ```bash
   npm cache clean --force
   ```
3. Update npm to the latest version:
   ```bash
   npm install -g npm@latest
   ```

## License

Ibrahim M. Badr Custom Proprietary License

1. Grant of License:
Subject to the terms and conditions of this license, Ibrahim M. Badr ("Licensor") grants to a non-exclusive, non-transferable, revocable license to use the software code (the "Code") solely for the purpose of operating an e-commerce website and selling products through the website.

2. Usage Rights:
Licensee is authorized to use the Code to operate and maintain the e-commerce website. Licensee may not use the Code for any purpose other than operating the e-commerce website.

3. Code Ownership:
Licensor retains all ownership and intellectual property rights to the Code. This license does not transfer any ownership or intellectual property rights to Licensee.

4. Code Modifications:
Licensee shall not modify, adapt, translate, reverse engineer, decompile, disassemble, or create derivative works based on the Code without the prior written consent of Licensor. Licensee may request permission for modifications by contacting Licensor at ibrahim M. Badr.

5. Prohibition of Code Sale:
Licensee is expressly prohibited from selling, licensing, leasing, or sublicensing the Code to any third party. The Code may not be sold, offered for sale, or included in any product or service intended for commercial distribution.

6. Attribution:
Licensee agrees to provide proper attribution to Licensor as the original creator of the Code on the website or within the website's documentation.

7. Termination:
This license is effective until terminated. Licensor may terminate this license at any time if Licensee breaches any of its terms. Upon termination, Licensee shall cease using the Code.

8. Governing Law:
This license shall be governed by and construed in accordance with the laws of International Sale of Goods (CISG), without regard to its conflict of law principles.

9. Entire Agreement:
This License constitutes the entire agreement between the parties with respect to the Code and supersedes all prior or contemporaneous understandings regarding the Code.

10. Contact Information:
For questions or concerns regarding this License or requests for modifications, please reach me through ibrahimbdr@outlook.com.
