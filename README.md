# Smart Campus Shuttle Booking System
A full-stack web application designed to solve campus transportation challenges such as overcrowding, scheduling delays, and inefficient booking processes. Built with **React.js, TailwindCSS, Node.js, Express.js, and PostgreSQL**.

## Overview

The system provides a seamless shuttle booking experience for students and efficient route and schedule management tools for drivers and administrators. It includes secure authentication, real-time booking updates, and integrated payment processing.

## Features

### User Roles
- Students: Book seats, view schedules, track bookings
- Drivers/Admin: Manage routes, schedules, and seat availability

### Core Features
- Role-based dashboards (Student & Driver/Admin)
- JWT authentication & secure login system
- Role-Based Access Control (RBAC)
- Real-time seat availability tracking
- Booking management system
- Payment integration with Paystack
- Automated receipt generation
- Booking history and transaction records

### Security & API
- Secure authentication using JWT
- Protected API routes
- Input validation and error handling
- Tested using Postman and Thunder Client

## Tech Stack

### Frontend
- React.js
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL

### Integrations & Tools
- Paystack API (Payments)
- JWT (Authentication)
- Postman / Thunder Client (API Testing)

## Database Design

- Users table (students, drivers, admins)
- Bookings table
- Routes & schedules table
- Payments table
- Receipts generation logic
- Indexed relational schema for optimized queries

## Installation

### 1. Clone repository
```bash
git clone https://github.com/your-username/shuttle-booking-system.git
```

### 2. Install dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend:
```env
PORT=5000
DATABASE_URL=your_postgres_connection
JWT_SECRET=your_secret_key
PAYSTACK_SECRET_KEY=your_paystack_key
```

### 4. Run the application
#### Backend
```bash
npm run dev
```

#### Frontend
```bash
npm start
```

## Future Improvements
- Real-time GPS shuttle tracking
- Mobile application (React Native)
- Push notifications for arrivals and delays
- Advanced analytics dashboard
- Automated scheduling optimization

## Author

Favour Ovbude
