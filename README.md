The Grand Aurelia — Full-Stack Hotel Room Booking System (MERN)

A responsive hotel room booking application built with React.js, Vite, Node.js, Express.js, and MongoDB.»
---

1. Project Overview

The Grand Aurelia is a full-stack hotel reservation platform designed around a luxury coastal resort theme. The interface uses deep forest green ("#0f382c"), warm ivory ("#faf7f2"), and champagne gold ("#c59d5f").

The application demonstrates the main features of a hotel room reservation system, including:

- User registration and login with password hashing using "bcryptjs".
- JWT-based authentication.
- Hotel room browsing, searching, filtering, and sorting.
- Date-based room booking with overlapping reservation checks.
- Booking cost calculation, including nights, 12% GST, and the total amount in Indian Rupees.
- Guest booking history and cancellation.
- Administrator room management and booking status management.
- Database seeding for sample hotel rooms and demonstration accounts.

Note: The features available depend on the current implementation of the application.

2. Technology Stack

Frontend

- HTML5 — Application structure.
- CSS3 — Responsive styling and custom design system.
- JavaScript — Application logic.
- React.js — Component-based user interface.
- Vite — Frontend development server and build tool.
- React Router DOM — Client-side routing.
- Lucide React — Icons.

Backend

- Node.js — JavaScript runtime.
- Express.js — REST API and server-side routing.
- MongoDB — NoSQL database.
- Mongoose — Database schemas, validation, and queries.
- bcryptjs — Password hashing.
- jsonwebtoken — JWT authentication.
- cors — Cross-origin request handling.
- dotenv — Environment variable configuration.

3. Project Structure

HotelRoomBookingSystem/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── contactController.js
│   │   └── roomController.js
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Contact.js
│   │   ├── Room.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── contactRoutes.js
│   │   └── roomRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── seedData.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   ├── data/
│   │   └── rooms.js
│   ├── pages/
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   ├── bookingHelpers.js
│   │   └── storage.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
📁 Project Structure

HotelRoomBookingSystem/
|
|-- backend/
|   |-- config/
|   |   |-- db.js
|   |
|   |-- controllers/
|   |   |-- authController.js
|   |   |-- bookController.js
|   |   |-- contactController.js
|   |   |-- roomController.js
|   |
|   |-- middleware/
|   |   |-- adminMiddleware.js
|   |   |-- authMiddleware.js
|   |   |-- errorMiddleware.js
|   |
|   |-- models/
|   |   |-- booking.js
|   |   |-- contact.js
|   |   |-- room.js
|   |   |-- user.js
|   |
|   |-- routes/
|   |   |-- authRoutes.js
|   |   |-- bookingRoutes.js
|   |   |-- contactRoutes.js
|   |   |-- roomRoutes.js
|   |
|   |-- utils/
|   |   |-- generateToken.js
|   |   |-- seedData.js
|   |
|   |-- .env.example
|   |-- package.json
|   |-- server.js
|
|-- public/
|   |-- favicon.svg
|
|-- src/
|   |-- components/
|   |
|   |-- context/
|   |   |-- authContext.js
|   |   |-- toastContext.js
|   |
|   |-- data/
|   |   |-- rooms.js
|   |
|   |-- pages/
|   |
|   |-- services/
|   |   |-- API.js
|   |
|   |-- utils/
|   |   |-- bookingHelper.js
|   |   |-- storage.js
|   |
|   |-- App.jsx
|   |-- index.css
|   |-- main.jsx
|
|-- .gitignore
|-- index.html
|-- package.json
|-- package-lock.json
|-- write-config.js
|-- README.md
The tree above describes the expected project layout. Some files may differ depending on your current implementation.

4. Prerequisites

Install the following software before running the application:

1. Node.js and npm — Node.js 18 or a compatible version supported by your dependencies.
   
   - Download: https://nodejs.org/
   - Verify installation:
   
   node -v
npm -v

2. MongoDB Community Server for local development, or a hosted MongoDB database.
   
   - Download: https://www.mongodb.com/try/download/community
   - Hosted database: https://www.mongodb.com/atlas

For local development, the default database URI may be:

mongodb://127.0.0.1:27017/hotel_booking

Make sure the MongoDB service is running before starting the backend.

5. Installation and Setup

Step 1: Clone the Repository

git clone https://github.com/praveenkumarpandrinki-blip/HotelRoomBookingSystem.git
cd HotelRoomBookingSystem

Alternatively, download the repository ZIP from GitHub and extract it.

Step 2: Install Frontend Dependencies

Run the following command from the project root:

npm install

Step 3: Install Backend Dependencies

From the project root, run:

npm install --prefix backend

Step 4: Configure Environment Variables

Create a file named ".env" inside the "backend/" directory.

If "backend/.env.example" exists, use it as the template and adjust the values to match the variables expected by your backend code.

Example configuration for local development:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hotel_booking
JWT_SECRET=replace_with_a_unique_random_secret
JWT_EXPIRE=7d
NODE_ENV=development

Important:

- Replace the example JWT secret with a unique, randomly generated secret.
- Never commit your real ".env" file or production credentials to GitHub.
- Keep ".env" excluded through ".gitignore".
- Use your hosting provider's environment-variable settings for production.
- Ensure the environment variable names match those used in your backend code.

6. Running the Application Locally

You will generally need two terminal windows: one for the backend and one for the frontend.

Terminal 1: Start the Backend

From the project root, run:

npm run server

If this script is not defined in the root "package.json", check the available scripts. Alternatively, navigate to the backend directory and use the start command defined in "backend/package.json":

cd backend
npm start

When configured correctly, the backend should start on port "5000" and connect to MongoDB. The exact console messages depend on your implementation.

Terminal 2: Start the Frontend

Open a second terminal in the project root and run:

npm run dev

Vite displays the frontend URL in the terminal. Open that exact URL in your browser. It may be:

http://localhost:5173

The port can differ if it has been configured differently or the default port is already occupied.

API Communication

During local development, the Vite configuration may proxy API requests beginning with "/api" to the Express backend at:

http://127.0.0.1:5000

This proxy works only when configured in "vite.config.js". Production deployment requires the frontend to communicate with the deployed backend API.

7. Demonstration Accounts

The application may seed demonstration accounts into the database when the backend starts.

If the following credentials are configured by "backend/utils/seedData.js", they can be used for local project demonstrations:

Role| Email| Password
Guest| "guest@example.com"| "Password@123"
Administrator| "admin@grandaurelia.com"| "Admin@123"

These credentials are intended for a local demonstration only. They must not be treated as production credentials. Change or disable demonstration accounts before exposing the application publicly, especially administrator accounts.

If the seed script uses different credentials, follow the values defined in that script.

8. Booking and Overlapping Reservation Prevention

The booking system is designed to prevent overlapping confirmed reservations for the same room.

For a new booking, the backend checks existing confirmed bookings against the requested check-in and check-out dates.

Two date ranges overlap when:

[
\text{existingCheckIn} < \text{newCheckOut}
]

and

[
\text{existingCheckOut} > \text{newCheckIn}
]

If an overlapping reservation is found, the backend should reject the new booking and return an appropriate error message.

The frontend can then inform the guest that the selected room is unavailable for the requested dates.

This check helps avoid double-booking in ordinary application flows. For production use, concurrent booking requests should also be protected against race conditions using suitable database-level or transactional safeguards.

9. Pricing and Bill Calculation

The application is designed to calculate the booking total using:

- Room price per night.
- Number of nights between check-in and check-out.
- Applicable GST, shown as 12% in the project interface.
- Final total payable in Indian Rupees (₹).

The displayed tax rate is a project demonstration setting. Actual hotel tax requirements may vary and should be verified before real-world use.

10. REST API Reference

The following endpoints describe the intended API structure. Access requirements and exact behavior should match the backend implementation.

Authentication — "/api/auth"

Method| Endpoint| Description
"POST"| "/api/auth/register"| Register a new user
"POST"| "/api/auth/login"| Authenticate a user and receive a token
"GET"| "/api/auth/me"| Retrieve the authenticated user's profile

Rooms — "/api/rooms"

Method| Endpoint| Description
"GET"| "/api/rooms"| Retrieve rooms with supported search and filter options
"GET"| "/api/rooms/:id"| Retrieve a room by its supported identifier
"POST"| "/api/rooms"| Create a room; administrator access
"PUT"| "/api/rooms/:id"| Update a room; administrator access
"DELETE"| "/api/rooms/:id"| Delete a room; administrator access
"POST"| "/api/rooms/reset/catalog"| Reset the room catalog; administrator access

Bookings — "/api/bookings"

Method| Endpoint| Description
"POST"| "/api/bookings"| Create a booking
"GET"| "/api/bookings/my"| Retrieve the authenticated user's bookings
"PATCH"| "/api/bookings/:id/cancel"| Cancel a booking
"GET"| "/api/bookings/admin/all"| Retrieve all bookings; administrator access
"PATCH"| "/api/bookings/admin/:id/status"| Update booking status; administrator access

Contact — "/api/contact"

Method| Endpoint| Description
"POST"| "/api/contact"| Submit a contact inquiry

Protected endpoints require the authentication method implemented by the backend. Administrator endpoints should enforce server-side authorization.

11. Database Seeding

The project includes a seed utility at:

backend/utils/seedData.js

Depending on the implementation, it may create sample hotel rooms and demonstration accounts for local testing.

Only run seeding against a database intended for development or demonstration. Check the seed script before running it against an existing database, as seeding may create, update, or reset records.

12. Deployment

For public deployment, the application requires a hosted backend and a database accessible to that backend.

General deployment steps:

1. Create a hosted MongoDB database, such as a MongoDB Atlas cluster.
2. Deploy the Express backend to a Node.js-compatible hosting service.
3. Configure the backend's environment variables securely on the hosting platform.
4. Configure the frontend API client to use the deployed backend URL.
5. Deploy the React frontend to a static hosting service.
6. Configure CORS and any required frontend environment variables.
7. Test registration, login, room browsing, booking, and cancellation on the deployed application.

Do not use "127.0.0.1" as the MongoDB or backend address for a publicly hosted frontend or backend. On a hosting provider, "127.0.0.1" refers to that hosting environment itself.

Live application: To be added after successful deployment and testing.

13. Security Notes

- Do not publish real database credentials, JWT secrets, or API keys.
- Keep local environment files out of version control.
- Generate a strong and unique production JWT secret.
- Store production secrets in hosting environment variables.
- Protect administrator endpoints with server-side authorization.
- Use HTTPS for the deployed application.
- Do not rely on frontend checks alone to secure bookings or administrative actions.
- Use demonstration credentials only for controlled testing.

14. Future Improvements

Potential future improvements include:

- Online payment gateway integration.
- Booking confirmation emails.
- Room image uploads.
- Advanced availability search.
- Booking reports and analytics.
- Automated testing.
- Enhanced deployment monitoring.

These are possible enhancements and may not be implemented in the current version.

15. Repository

GitHub Repository:
https://github.com/praveenkumarpandrinki-blip/HotelRoomBookingSystem

16. Project Purpose

This project is developed as a college internal assessment / mini-project to demonstrate full-stack web development using React, Node.js, Express.js, and MongoDB.
