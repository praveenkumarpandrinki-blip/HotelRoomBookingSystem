Hotel Room Booking System

About the Project

The Hotel Room Booking System is a beginner-friendly full-stack web application developed to make hotel room browsing and booking easier. Users can register, log in, view available rooms, and manage their bookings through a simple interface.

This project was developed as an academic full-stack web development project using React, Node.js, Express.js, and MongoDB.

Features

- User registration and login
- Browse available hotel rooms
- View room details and prices
- Search and filter rooms
- Book hotel rooms
- View personal bookings
- Cancel bookings, if permitted by the application
- Protected pages for authenticated users
- Admin dashboard for managing hotel information, where configured
- Responsive and simple user interface

Room Types

The application includes three room categories:

1. Standard – A comfortable room for regular stays.
2. Deluxe – A room offering additional comfort and space.
3. Family Room – A room suitable for families.

Technologies Used

Frontend

- HTML
- CSS
- JavaScript
- React.js
- Vite

Backend

- Node.js
- Express.js

Database

- MongoDB
- MongoDB Atlas

Deployment

- GitHub
- Render

Project Structure

Project Structure

HotelRoomBookingSystem
|
|-- frontend
|   |-- public
|   |-- src
|   |   |-- assets
|   |   |-- components
|   |   |-- pages
|   |   |-- services
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   |-- index.css
|   |-- package.json
|
|-- backend
|   |-- config
|   |-- models
|   |-- controllers
|   |-- routes
|   |-- middleware
|   |-- utils
|   |-- server.js
|   |-- package.json
|
|-- .gitignore
|-- README.md
|-- package.json
Note: The exact folder and file names may vary slightly depending on the current project structure.

Installation and Setup

1. Clone the Repository

git clone https://github.com/praveenkumarpandrinki-blip/HotelRoomBookingSystem.git

2. Open the Project

cd HotelRoomBookingSystem

3. Install Frontend Dependencies

npm install

4. Start the Frontend

npm run dev

Open the local URL displayed in your terminal.

5. Start the Backend

Open a separate terminal and navigate to the backend folder:

cd backend
npm install

Start the backend using the start command configured in the backend's "package.json", for example:

npm start

Configure the MongoDB connection and other required environment variables before starting the backend. Never upload passwords, API keys, or database credentials to GitHub.

Live Application

- Frontend: https://hotel-room-booking-system-39z7.onrender.com
- Backend: https://hotel-room-booking-system-op1f.onrender.com
- GitHub Repository: https://github.com/praveenkumarpandrinki-blip/HotelRoomBookingSystem

The live links are provided for access; verify that the latest deployment is successful before submitting.

Project Objective

The main objective of this project is to understand how a full-stack web application works by connecting a React frontend, an Express backend, and a MongoDB database.

It demonstrates basic concepts such as user authentication, API communication, database operations, room browsing, and hotel booking management.

Conclusion

The Hotel Room Booking System provides a simple way to browse hotel rooms and manage bookings. It was designed as an academic project to practise frontend development, backend development, database connectivity, and application deployment.

Author

Developed as a full-stack web development academic project.
