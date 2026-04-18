# Task Manager REST API – Clean Architecture

A RESTful API built with Express.js following a clean, scalable, and production-ready backend architecture.  
This project demonstrates real-world backend engineering practices including authentication, authorization, and secure API design.

---

## 🚀 Features

- Express Router
- RESTful API design
- MVC (Controller-based architecture)
- MongoDB integration with Mongoose
- JSON-based structured responses
- Proper HTTP status codes
- Centralized error handling (`AppError`)
- 404 (Route Not Found) handling
- Environment configuration using dotenv

### 🔐 Authentication & Authorization

- JWT-based Authentication (`protect` middleware)
- Role-based Authorization (`restrictTo` middleware): `admin`, `manager`, `user`
- Ownership-based Access Control (project & task level)
- Secure middleware chaining for route protection

### 🔎 Advanced Query Features

- Filtering, sorting, pagination, and searching
- Multi-value filtering (e.g., `role=user,admin`)
- Date filtering (`gte`, `gt`, `lte`, `lt`)
- Keyword search for relevant fields (`name`, `email`, `title`, `description`)

---

## 🧠 Authorization Design

### Roles

- **user** → Work with assigned tasks
- **manager** → Manage own projects and related tasks
- **admin** → Full system access (users, projects, tasks)

---

## 🔑 Auth API `/api/v1/auth`

- **POST /signup** — Create user account
- **POST /login** — Authenticate user
- **POST /change-password** — Change password (authenticated users)

---

## 👤 Users API `/api/v1/users`

- **POST /** — Create user (Admin only)
- **GET /** — Get all users (Admin only) with supported `Query Features`
- **GET /me** — Get current user profile
- **PATCH /me** — Update own profile (name, email)
- **GET /:id** — Get user by ID (Admin only)
- **PATCH /:id** — Update user (Admin only)
- **PATCH /:id/reset-password** — Reset user password (Admin only)
- **DELETE /:id** — Delete user (Admin only)

### Query Features

- `search` → name, email
- `role` → multi-value filtering
- `createdAt[gte|gt|lte|lt]` → date filtering
- `isActive` → filter active users
- `sort` → sorting fields
- `page`, `limit` → pagination

---

## 📁 Projects API `/api/v1/projects`

- **POST /** — Create project (Manager/Admin)
- **GET /** — Get all projects (Admin only) with supported `Query Features`
- **GET /my** — Get own projects (Manager) with supported `Query Features`
- **GET /:id** — Get project by ID (Authenticated users)
- **PATCH /:id** — Update project (Owner/Admin)
- **DELETE /:id** — Delete project (Owner/Admin)

### Rules

- Manager becomes owner automatically
- Admin must assign ownership manually
- Only owner/admin can update/delete
- Only admin can change ownership

### Query Features

- `search` → title, description
- `status` → single/multi-value
- `createdAt` → date filtering
- `sort`, `page`, `limit`

---

## ✅ Tasks API `/api/v1/tasks`

- **POST /** — Create task (Manager/Admin)
- **GET /** — Get tasks (Admin/Manager) with supported `Query Features`
- **GET /my** — Get assigned tasks (User) with supported `Query Features`
- **GET /:id** — Get task by ID
- **PATCH /:id** — Update task (role & ownership based)
- **DELETE /:id** — Delete task (Manager/Admin)

### Rules

- Manager sees only tasks of their projects
- Assigned users can view their tasks
- Task updates depend on role & ownership

### Query Features

- `search` → title, description
- `priority`, `status` → multi-value filtering
- `createdAt` → date filtering
- `sort`, `page`, `limit`

---

## 📊 Response Format

All list endpoints return:

- `results` → number of items returned
- `total` → total matching documents
- `page` → current page
- `limit` → results per page
- `data` → array of resources

---

## 📘 API Response Fields

### ✅ Success Response Structure

#### 🔹 List Response (GET all)

`json`
{
  "success": true,
  "results": number,   // number of items returned in current response
  "total": number,     // total items matching the query in database
  "page": number,      // current page number
  "limit": number,     // number of items per page
  "data": [            // array of resources
    {
      // resource object
    }
  ]
}

#### 🔹 Single Resource Response (GET one)

`json`
{
  "success": true,
  "data": {
    // single resource object
  }
}

#### ❌ Error Response Structure

`Json`
{
  "success": false,
  "message": "Error message describing what went wrong"
}

---

### 📡 HTTP Status Codes

- `200 OK` → Successful GET, PATCH requests  
- `201 Created` → Resource successfully created  
- `204 No Content` → Successful delete (no response body)  
- `400 Bad Request` → Invalid input or validation error  
- `401 Unauthorized` → Not authenticated (no/invalid token)  
- `403 Forbidden` → Authenticated but no permission  
- `404 Not Found` → Resource not found  
- `500 Internal Server Error` → Server-side error

---

## 📬 API Testing (Postman)

You can test all API endpoints using Postman.

### 🔽 Import Collection

1. Open Postman
2. Click **Import**
3. Select the file:

---

## 🌐 Live API

Base URL:
https://task-manager-rest-api-node-js-express.onrender.com

Example:
GET /api/v1/users

---

### 🔐 Authentication

- Login to get JWT token
- Add token in headers: 
- Authorization: Bearer <your_token>

---

### 📌 Notes

- Collection includes all endpoints (Auth, Users, Projects, Tasks)
- Requests are pre-configured for quick testing
- Update base URL if running locally

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (Authentication)

---

## Project Structure 

- src/ 
    - controllers/ — Request handling logic 
        - auth.controller.js 
        - user.controller.js 
        - project.controller.js 
        - task.controller.js 
    - models/ — Mongoose schemas & models 
        - user.model.js 
        - project.model.js 
        - task.model.js 
    - routes/ — API route definitions 
        - auth.route.js 
        - user.route.js 
        - project.route.js 
        - task.route.js 
    - middlewares/ — Authentication, authorization, error handling 
        - auth.middleware.js 
        - error.middleware.js 
    - config/ — Database configuration 
        - db.js 
    - utils/ — Custom utilities 
        - AppError.js 
        - catchAsync.js 
    - app.js — Express app configuration 
- server.js — Application entry point

---

## ⚙️ Environment Variables

Create a `.env` file:

`env`
NODE_ENV=development
PORT=3000

DATABASE=your_mongodb_connection_string
DATABASE_PASSWORD=your_password

JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d

---

## ⚙️ Run Locally
npm install
npm run dev