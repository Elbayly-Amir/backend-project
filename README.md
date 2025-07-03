# Doctor Profile & Appointment API

> A comprehensive and secure RESTful API for managing doctor profiles, patient information, reviews, and medical appointments.

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://mongodb.com/)
[![Express](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![Jest](https://img.shields.io/badge/Tests-Jest-red.svg)](https://jestjs.io/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Future Improvements](#future-improvements)

---

## 🎯 Overview

This API provides a complete solution for managing a medical appointment system. It allows doctors to manage their professional profiles and patients to book appointments and leave reviews. The layered architecture ensures clear separation of concerns and optimal maintainability.

## ✨ Features

### 🔐 Authentication and Authorization
- Secure JWT-based authentication system
- Role management (patients, doctors)
- Personal data protection

### 👨‍⚕️ Doctor Profile Management
- Complete CRUD operations for doctor profiles
- Advanced filtering by specialty and city
- Public profiles with integrated reviews

### 📅 Appointment System
- Online appointment booking
- Available time slot management
- Appointment history tracking

### ⭐ Review System
- Doctor evaluations by patients
- Detailed comments

### 🧪 Automated Testing
- High test coverage with Jest
- Integration tests with Supertest
- Validation of all endpoints

## 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ODM |
| **Security** | JWT, bcryptjs |
| **Testing** | Jest, Supertest |
| **Development** | nodemon, dotenv |
| **Containerization** | Docker |

## 🏗 Project Architecture

```
src/
├── api/
│   ├── controllers/     # Request processing logic
│   └── routes/          # API route definitions
├── config/              # Database configuration
├── middleware/          # Authentication middleware and error handling
├── models/              # Mongoose data schemas
├── services/            # Business logic
├── app.js               # Express application configuration
└── server.js            # Server startup

tests/                   # Automated Jest tests
.env                     # Environment variables
package.json            # Dependencies and scripts
```

## 🚀 Setup and Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker](https://www.docker.com)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd <your-repository-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the project root:
   ```env
   # Server port
   PORT=3000

   # Database URLs
   DATABASE_URL=mongodb://mongoadmin:secret@localhost:27017/doctor_db?authSource=admin
   TEST_DATABASE_URL=mongodb://mongoadmin:secret@localhost:27017/doctor_db_test?authSource=admin

   # JWT Secret
   JWT_SECRET=a_very_long_and_random_secret_for_your_jwt
   ```

4. **Start MongoDB with Docker**
   ```bash
   docker run --name mongo-db -p 27017:27017 \
     -e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
     -e MONGO_INITDB_ROOT_PASSWORD=secret \
     -d mongo
   ```

## 💻 Usage

### Development mode
```bash
npm run dev
```
The server will be accessible at `http://localhost:3000`

### Production mode
```bash
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### 🔑 Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "new.doctor@email.com",
  "password": "password123456",
  "role": "doctor",
  "firstName": "John",
  "lastName": "Doe",
  "specialty": "Cardiology"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "new.doctor@email.com",
  "password": "password123456"
}
```

### 👨‍⚕️ Doctors

#### List all doctors
```http
GET /doctors?specialty=Cardiology&city=Paris
```

#### Get doctor profile
```http
GET /doctors/:id
```

#### Update profile (authenticated doctor)
```http
PATCH /doctors/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "specialty": "Cardiology",
  "city": "Lyon"
}
```

#### Delete profile (authenticated doctor)
```http
DELETE /doctors/:id
Authorization: Bearer <token>
```

### 📅 Appointments

#### Book an appointment (patient)
```http
POST /appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "doctorId": "...",
  "date": "2025-12-25T10:00:00.000Z",
  "reason": "Annual check-up"
}
```

#### View appointments (doctor)
```http
GET /appointments/my-appointments
Authorization: Bearer <token>
```

### ⭐ Reviews

#### Create a review (patient)
```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "doctorId": "...",
  "patientId": "...",
  "rating": 5,
  "comment": "Very professional and helpful."
}
```

## 🧪 Testing

Run the complete test suite:
```bash
npm test
```

Tests cover:
- All API endpoints
- Authentication and authorization
- Data validation
- Error handling

## 🔮 Future Improvements

### Planned Features
- **Pagination**: Implementation of pagination for lists
- **Advanced Appointment Management**: Confirmation/cancellation by doctors
- **Full-text Search**: Advanced search in profiles
- **File Upload**: Profile pictures for doctors
- **Real-time Notifications**: WebSockets for appointment reminders
- **Centralized Error Handling**: Refactoring of error middleware