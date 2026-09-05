# SWIFT

### Delivery Coordination Platform for Small Retailers

SWIFT is a web-based delivery coordination platform that connects retailers, dispatchers, and riders through one delivery workflow.

The system allows a retailer to create a delivery request, a dispatcher to assign it to a rider, and the rider to update the delivery status and submit proof of delivery. The main goal of the project is to provide a simple, centralized way of managing deliveries from request creation to completion.

---

## Live Application

**Frontend:**
https://swift-taupe-omega.vercel.app/

**Backend API:**
https://swift-backend-tuz3.onrender.com/

---

## Test Login Credentials

The following test accounts are available for evaluating the **live deployed product**.

| Role       | Email                   | Password              |
| ---------- | ----------------------- | --------------------- |
| Retailer   | `retailer@swift.test`   | `SwiftRetailer123!`   |
| Dispatcher | `dispatcher@swift.test` | `SwiftDispatcher123!` |
| Rider      | `rider@swift.test`      | `SwiftRider123!`      |

### Recommended Demo Flow

To test the complete delivery workflow, use the accounts in this order:

**1. Retailer**

Log in using the Retailer account and create a delivery request.

↓

**2. Dispatcher**

Log in using the Dispatcher account and assign the newly created delivery to the Rider.

↓

**3. Rider**

Log in using the Rider account, view the assigned delivery, update the status, and submit proof of delivery.

↓

**4. Completed Delivery**

The delivery is then recorded as **DELIVERED** with the proof of delivery and completion time.

These accounts are provided specifically for project demonstration and evaluation of the deployed MVP.

---

## Project Workflow

The core delivery process is:

**Retailer → Create Request → Dispatcher → Assign Rider → Rider → Pickup → Proof of Delivery → Completed**

Each stage updates the same delivery record through the backend and database.

---

## Main Features

### Retailer

* Login to the retailer dashboard
* View delivery activity
* Create new delivery requests
* Enter customer information
* Enter delivery address
* Enter item description
* View recent delivery requests

### Dispatcher

* Login to the dispatcher dashboard
* View delivery requests
* View available riders
* Assign deliveries to riders
* Monitor delivery status

### Rider

* Login to the rider dashboard
* View assigned deliveries
* View customer and delivery information
* Update delivery status
* Mark a delivery as picked up
* Submit proof of delivery
* Complete a delivery

---

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* NestJS
* Node.js
* REST API
* Class Validator

### Database

* PostgreSQL
* Prisma ORM

### Deployment

* Vercel — Frontend
* Render — Backend
* Render PostgreSQL — Database

---

## System Architecture

```text
                    SWIFT
                      |
        +-------------+-------------+
        |                           |
   User Browser                Web Browser
        |                           |
        +-------------+-------------+
                      |
               React / Vite
                  Frontend
                      |
                  REST API
                      |
                NestJS Backend
                      |
                   Prisma
                      |
                PostgreSQL
```

The frontend is responsible for the user interface and user interaction.

The NestJS backend handles API requests, validation, authentication, delivery operations, and communication with the database.

Prisma provides the database access layer, while PostgreSQL stores the application's persistent data.

---

## Project Structure

```text
SWIFT/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── auth/
│   │   ├── deliveries/
│   │   └── main.ts
│   ├── package.json
│   └── ...
│
└── README.md
```

The project is divided into frontend and backend applications to keep the user interface and server-side logic separate.

---

## API Overview

The backend exposes REST endpoints for authentication and delivery management.

### Authentication

```text
POST /auth/register
POST /auth/login
```

### Deliveries

```text
POST   /deliveries
GET    /deliveries
GET    /deliveries/riders
PATCH  /deliveries/:id/assign
PATCH  /deliveries/:id/status
PATCH  /deliveries/:id/proof
```

These endpoints support the main delivery lifecycle from creation through completion.

---

## Database

The application uses PostgreSQL for persistent data storage.

The main entities are:

### User

Stores users of the system and their roles.

Roles include:

* RETAILER
* DISPATCHER
* RIDER

### Delivery

Stores delivery requests and their progress.

A delivery contains information such as:

* Customer name
* Customer phone
* Delivery address
* Item description
* Retailer
* Assigned rider
* Delivery status
* Proof of delivery
* Delivery completion time

---

## Delivery Statuses

The current MVP uses the following delivery stages:

```text
ASSIGNED
    ↓
PICKED_UP
    ↓
DELIVERED
```

A newly created request is initially unassigned. Once the dispatcher assigns a rider, the delivery enters the assigned stage.

The rider can then update the delivery to `PICKED_UP` and finally submit proof of delivery, which completes the delivery as `DELIVERED`.

---

## Running the Project Locally

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* PostgreSQL

### 1. Clone the repository

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
cd SWIFT
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Start the frontend

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

### 4. Install backend dependencies

Open another terminal:

```bash
cd backend
npm install
```

### 5. Configure environment variables

Create a `.env` file inside the `backend` directory.

Example:

```env
DATABASE_URL="your-postgresql-connection-string"
FRONTEND_URL="http://localhost:5173"
PORT=3000
```

The actual database connection string should not be committed to GitHub.

### 6. Start the backend

```bash
npm run start:dev
```

The backend will normally run on:

```text
http://localhost:3000
```

---

## Environment Variables

### Backend

```text
DATABASE_URL
FRONTEND_URL
PORT
```

### Frontend

```text
VITE_API_URL
```

Sensitive credentials and database connection strings should never be committed to the repository.

---

## Current MVP Scope

SWIFT currently focuses on proving the core delivery coordination workflow.

The MVP includes:

* Role-based user interfaces
* Login
* Delivery request creation
* Rider assignment
* Delivery status updates
* Proof of delivery
* Persistent PostgreSQL storage
* Deployed frontend and backend

Some production-level capabilities are intentionally outside the current MVP scope:

* Self-service user onboarding
* Stronger production authentication and password security
* QR-based proof of delivery
* Photo and signature evidence
* Dedicated mobile rider application
* Offline delivery operation and synchronization
* Real-time delivery updates
* Advanced notifications and analytics

These are potential extensions rather than requirements for the current working MVP.

---

## Future Development

The project can be extended in several areas:

1. **Authentication and Security**

   * Secure password hashing
   * Token-based authentication
   * Stronger role-based authorization
   * User onboarding and account management

2. **Rider Experience**

   * Dedicated mobile application
   * Offline support
   * Background synchronization
   * Location-aware delivery features

3. **Proof of Delivery**

   * QR/code scanning
   * Customer signature
   * Photo evidence

4. **Operations**

   * Real-time status updates
   * Notifications
   * Delivery analytics
   * Operational reporting

---

## Project Objective

The objective of SWIFT is to demonstrate how a simple digital workflow can bring the main participants in a retail delivery process into one system.

Rather than treating delivery requests, rider assignments, status updates, and completion proof as separate communications, SWIFT connects them into a single delivery record.

The MVP therefore focuses on one complete workflow:

**Create → Assign → Pick Up → Prove → Complete**

---

## Project Status

**Status: Working MVP — Deployed**

The current version has been deployed and the main retailer, dispatcher, and rider workflow is operational.

---



Developed as a delivery coordination MVP for small retail businesses.
