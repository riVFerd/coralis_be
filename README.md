# Coralis Backend

This repository contains the backend API and database setup for the Coralis mobile application, which features user authentication (Register, Login, Forgot Password).

## Prerequisites

- **Node.js**: v24.13.0
- **MySQL**: v8.0+

## Backend Setup

### 1. Installation

Navigate to the backend directory and install dependencies:

```bash
cd coralis_be
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Open `.env` and update the database credentials and JWT secret:

```ini
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=coralis
JWT_SECRET=your_secure_random_secret
```

### 3. Database Setup

You can initialize the database using the provided script or the SQL dump file.

**Option A: Using the Init Script (Recommended!)**

```bash
npm run db:init
```

**Option B: Using SQL Dump**

Import the `database.sql` file into your MySQL server:

```bash
mysql -u root -p < database.sql
```

### 4. Running the Server

Start the development server:

```bash
npm run dev
```

The server will run on `http://localhost:3000`.

## API Endpoints

- **POST** `/api/auth/register`: Register a new user
- **POST** `/api/auth/login`: Login
- **POST** `/api/auth/forgot-password`: Request password reset token
- **POST** `/api/auth/reset-password`: Reset password using token

API Documentation (Swagger) is available at `http://localhost:3000/api-docs`.
