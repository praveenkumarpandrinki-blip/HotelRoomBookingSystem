# The Grand Aurelia — Full-Stack Hotel Room Booking System (MERN)

> **College Internal Project / Mini-Project Demonstration**  
> A complete, responsive, full-stack Hotel Room Booking System with a **React.js + Vite** frontend and a **Node.js + Express.js + MongoDB (Mongoose)** backend.

---

## 1. Project Overview

**The Grand Aurelia** is a full-stack hotel reservation platform built for a luxury coastal resort. It combines an aesthetic frontend design (deep forest green `#0f382c`, warm ivory `#faf7f2`, and champagne gold `#c59d5f`) with a structured REST API and a MongoDB database.

The system handles the entire hotel reservation lifecycle:
- User registration and login with **bcryptjs** password hashing and **JWT** session authentication.
- Room catalog discovery with real-time text search, type categorization, dynamic price filtering, and sorting.
- Date-based booking engine with **strict overlapping booking prevention** to prevent double-booking of any room.
- Dynamic bill breakdown (nights calculation, 12% GST, grand total in Indian Rupees ₹).
- Guest self-service portal to view reservation history and cancel bookings with confirmation dialogs.
- Administrator management dashboard to create, update, delete rooms, and manage booking statuses.
- In-memory/database seeding of default luxury rooms and demo accounts.

---

## 2. Technology Stack

### Frontend
- **React.js (v18.3)**: Component-based user interface.
- **Vite (v6.0)**: Modern build tool and development server with API proxying.
- **React Router DOM (v6.28)**: Declarative routing and route protection.
- **Lucide React**: Clean vector iconography.
- **CSS3 Variables**: Custom luxury hotel theme design system without heavy CSS frameworks.

### Backend
- **Node.js & Express.js**: RESTful HTTP API server with modular route handlers and error middleware.
- **MongoDB Community Server**: NoSQL database running locally at `mongodb://127.0.0.1:27017/hotel_booking`.
- **Mongoose (v8.10)**: Schema modeling, validation, pre-save password hashing, and queries.
- **bcryptjs**: Secure one-way salt hashing for passwords.
- **jsonwebtoken (JWT)**: Stateless token-based authorization.
- **cors & dotenv**: Cross-origin resource sharing and environment variable management.

---

## 3. Project Structure

```text
HotelRoomBookingSystem/
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongoose connection to local MongoDB
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, and profile verification
│   │   ├── bookingController.js  # Booking creation (with overlap check), cancellation, admin listing
│   │   ├── contactController.js  # Contact inquiry submission
│   │   └── roomController.js     # Room queries, filtering, and admin CRUD
│   ├── middleware/
│   │   ├── adminMiddleware.js    # Restricts routes to role === 'admin'
│   │   ├── authMiddleware.js     # JWT Bearer token verification
│   │   └── errorMiddleware.js    # 404 handler and central JSON error formatting
│   ├── models/
│   │   ├── Booking.js            # Booking schema with reference codes and date ranges
│   │   ├── Contact.js            # Contact messages schema
│   │   ├── Room.js               # Room inventory schema (type, price, capacity, amenities)
│   │   └── User.js               # User schema with bcrypt password hashing
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── bookingRoutes.js      # /api/bookings routes
│   │   ├── contactRoutes.js      # /api/contact routes
│   │   └── roomRoutes.js         # /api/rooms routes
│   ├── utils/
│   │   ├── generateToken.js      # JWT signing helper
│   │   └── seedData.js           # Auto-seeds 8 luxury rooms and demo users
│   ├── .env                      # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server entry point
├── public/
│   └── favicon.svg               # Brand favicon
├── src/
│   ├── components/               # Reusable UI components (Navbar, Footer, RoomCard, Modals)
│   ├── context/
│   │   ├── AuthContext.jsx       # Global auth state & JWT token sync
│   │   └── ToastContext.jsx      # Custom floating toast notifications
│   ├── data/
│   │   └── rooms.js              # Sample room info, hotel facilities, testimonials
│   ├── pages/                    # Home, Rooms, RoomDetails, Booking, MyBookings, Admin, Contact
│   ├── services/
│   │   └── api.js                # Frontend API client communicating with Express backend
│   ├── utils/
│   │   ├── bookingHelpers.js     # Date calculations, currency formatting, validation
│   │   └── storage.js            # Local storage helper
│   ├── App.jsx                   # Main React routes table
│   ├── index.css                 # Custom luxury styling and responsive layout
│   └── main.jsx                  # React DOM root
├── index.html
├── package.json                  # Root/frontend dependencies and run scripts
├── vite.config.js                # Vite config with /api proxy to backend (port 5000)
└── README.md                     # Full documentation
```

---

## 4. Prerequisites

1. **Node.js**: v18.0.0 or higher. Check with:
   ```bash
   node -v
   npm -v
   ```
2. **MongoDB Community Server**: Installed and running locally. Check with:
   ```powershell
   Get-Service -Name *mongo*
   ```
   Default connection URI: `mongodb://127.0.0.1:27017/hotel_booking`

---

## 5. Installation & Setup Instructions

### Step 1: Install Frontend Dependencies
In the root directory (`HotelRoomBookingSystem/`):
```bash
npm install
```

### Step 2: Install Backend Dependencies
In the root directory or inside `backend/`:
```bash
npm install --prefix backend
```

### Step 3: Configure Environment Variables
A `.env` file is already created in `backend/.env`. You can adjust it if needed:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hotel_booking
JWT_SECRET=hotel_booking_secret_key_2026_jwt_token
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## 6. How to Run the Application

You need two terminal windows open: one for the backend server and one for the frontend client.

### Terminal 1: Start Backend Server
From the project root:
```bash
npm run server
```
*(Or navigate to `backend/` and run `npm start`)*

Expected console output:
```text
[Server Running]: Hotel Booking Backend active on http://127.0.0.1:5000
[MongoDB Connected]: 127.0.0.1/hotel_booking
[Seed]: Demo users created successfully.
[Seed]: 8 luxury rooms seeded successfully.
```

### Terminal 2: Start Frontend Development Server
From the project root:
```bash
npm run dev
```

Open your browser and navigate to:
```text
http://localhost:3000
```
*(Vite proxies all `/api/*` requests directly to `http://127.0.0.1:5000`)*

---

## 7. Demo Account Credentials

The backend automatically seeds two demonstration accounts into MongoDB:

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Guest User** | `guest@example.com` | `Password@123` | Search, filter, book rooms, view reservation history, cancel bookings |
| **Admin User** | `admin@grandaurelia.com` | `Admin@123` | Full admin dashboard: Add Room, Edit Room, Delete Room, manage booking statuses |

*Tip: The Login page provides 1-click autofill buttons for both accounts.*

---

## 8. Overlapping Booking Prevention Logic

A key feature of the reservation engine is preventing double-booking of any room for overlapping date ranges.

When a reservation is submitted:
1. The backend queries MongoDB for any active booking (`status: 'Confirmed'`) for the same room.
2. It verifies the date interval condition:
   $$\text{existingCheckIn} < \text{newCheckOut} \quad \text{AND} \quad \text{existingCheckOut} > \text{newCheckIn}$$
3. If an overlapping booking is detected, the API rejects the request with HTTP 400 and returns a clear, descriptive message:
   `"This room is already reserved from YYYY-MM-DD to YYYY-MM-DD. Please choose alternative dates or explore another suite."`
4. The frontend catches this error and highlights the conflicting date fields for the user.

---

## 9. REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve current user profile |

### Rooms (`/api/rooms`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/rooms` | Public | Get all rooms with optional `type`, `maxPrice`, `search`, and `sort` query params |
| `GET` | `/api/rooms/:id` | Public | Get single room by `roomId` or MongoDB `_id` |
| `POST` | `/api/rooms` | Admin | Create a new hotel room |
| `PUT` | `/api/rooms/:id` | Admin | Update room details |
| `DELETE` | `/api/rooms/:id` | Admin | Delete a room from catalog |
| `POST` | `/api/rooms/reset/catalog` | Admin | Reset rooms back to default 8 luxury suites |

### Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Public/User | Create booking with date overlap verification |
| `GET` | `/api/bookings/my` | Private | Get reservations of currently logged-in user |
| `PATCH` | `/api/bookings/:id/cancel` | Private | Cancel a booking reservation |
| `GET` | `/api/bookings/admin/all` | Admin | View all bookings across the hotel |
| `PATCH` | `/api/bookings/admin/:id/status`| Admin | Update booking status (`Confirmed`, `Completed`, `Cancelled`) |

### Contact (`/api/contact`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/contact` | Public | Save guest inquiry message to MongoDB |
