# Task Manager REST API – Clean Architecture

A RESTful API built with Express.js following a clean, scalable, and backend-focused project structure.  
This project demonstrates real-world backend engineering practices including authentication, authorization, and secure API design.

---

## Features
- Express Router
- Controller-based architecture (MVC)
- RESTful API design
- JSON-based responses
- Proper HTTP status codes
- Centralized error handling with AppError
- 404 (Route Not Found) middleware
- MongoDB integration using Mongoose
- Environment configuration using dotenv

### 🔐 Authentication & Authorization
- JWT-based Authentication (`protect` middleware)
- Role-based Authorization (`restrictTo` middleware) `admin`, `manager`, `user`
- Ownership-based Access Control (project-level implemented)
- Secure middleware chaining for route protection

### 🔎 Advanced Query Features
- Filtering, sorting, pagination, searching implemented on Users, Projects, and Tasks
- Multi-value query support for fields like `role`, `priority`, `status`
- Date comparison filters (`gte`, `gt`, `lte`, `lt`) supported
- Keyword search for `name`, `email`, `title`, `description` as applicable

---

## Authorization Design

### Roles
- **user** → Can view and work with assigned tasks
- **manager** → Can create and manage their own projects
- **admin** → Full system control (users, projects, tasks)

---

### Auth API
- SignUp for creating new user profile
- Login entry point
- Any authenticate user can Change Password 

---

### Users API 
- Only Admin can access user based CRUD api endpoint
- Any authenticated user can access `/me` api endpoint to get own profile and edit name and email only, but admin
- Supports filtering by any existing fields with rational multi-values and aslo with `gte|gt|lte|lt`
- Supports search by `name`/`email`
- Supports sorting (`sort`) and pagination (`page` & `limit`)

---

### Projects API
- Only Admin can view projects
- Manager/Admin can create projects
- Manager becomes owner automatically
- Admin assign project ownership
- Only **project owner or admin** can update/delete projects
- Only **admin** can change ownership in update endpoint.

---

### Tasks API
- Any authenticated user can view tasks
- Supports filtering, sorting, and pagination
- Task creation restricted to project manager of task/admin
- Task update is restricted based on ownership and assignment
- Task delete restricted to project manager of task/admin

---

## Implemented APIs

### Auth `/api/v1/auth`
- **POST /signup** - Create profile (User only)
- **POST /login** - Log In to account
- **POST /change-password** - Change account password (Any authenticated user)

### Users `/api/v1/users`
- **POST /** — Create user (Admin only)
- **GET /** — Get all users (Admin only, supports filtering, sorting, pagination, searching)

Example of supported query parameters:
- `search` → name, or email
- `role` → multi-value filter for users (e.g., `role=user,admin`)
- `createdAt` → date filtering using `gte`, `gt`, `lte`, `lt` (e.g., `createdAt[gte]=2026-01-01`)
- `isActive` → filter active/inactive users (e.g., `isActive=true`)
- `sort` → comma-separated fields (e.g., `sort=role,-createdAt`)
- `page` → page number for pagination (e.g., `page=1`)
- `limit` → results per page (e.g., `limit=10`)

- **GET /me** — Get profile of athenticated user or login user
- **PATCH /me** — Update profile by athenticated user or login user
- **GET /:id** — Get a particular user (Admin only)
- **PATCH /:id** — Update a particular user (Admin only)
- **PATCH /:id/reset-password** — Reset password of a particular user (Admin only)
- **DELETE /:id** — Delete a particular user (Admin only)

#### Response Metadata for GET all Users requests
- `results` → number of items returned
- `total` → total items matching filters
- `page` → current page
- `limit` → results per page
- `data` → array of objects

### Projects `/api/v1/projects`
- **POST /** — Create project (Manager/Admin)
- **GET /** — Get all projects (Admin)

Supports query parameters:
- `search` → keyword search in title, description
- `status` → single or multiple values (e.g., `status=completed` or `status=active,planned`)
- `createdAt` → date filtering using `gte`, `gt`, `lte`, `lt` (e.g., `createdAt[gte]=2026-01-01`)
- `sort` → comma-separated fields (e.g., `sort=-createdAt`)
- `page` → page number for pagination (e.g., `page=1`)
- `limit` → results per page (e.g., `limit=10`)

- **GET /:id** — Get a particular project (Authenticated users)
- **PATCH /:id** — Update project (Owner/Admin)
- **DELETE /:id** — Delete project (Owner/Admin)

#### Response Metadata for GET all Users requests
- `results` → number of items returned
- `total` → total items matching filters
- `page` → current page
- `limit` → results per page
- `data` → array of objects

### Tasks `/api/v1/tasks`
- **POST /** — Create task (Manager/Admin)
- **GET /** — Get all tasks (Authenticated users)

Supports query parameters:
- `search` → keyword search in title, description
- `priority` → single or multiple values (e.g., `priority=high` or `priority=high,medium`)
- `status` → single or multiple values (e.g., `status=todo` or `status=todo,done`)
- `createdAt` → date filtering using `gte`, `gt`, `lte`, `lt` (e.g., `createdAt[gte]=2026-01-01`)
- `sort` → comma-separated fields (e.g., `sort=-createdAt`)
- `page` → page number for pagination (e.g., `page=1`)
- `limit` → results per page (e.g., `limit=10`)

- **GET /:id** — Get a particular task
- **PATCH /:id** — Update a particular task (ownership rules in progress)
- **DELETE /tasks/:id** — Delete a particular task (restricted access in progress)

#### Response Metadata for GET all Tasks requests
- `results` → number of items returned
- `total` → total items matching filters
- `page` → current page
- `limit` → results per page
- `data` → array of objects

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)

---

## Project Status

Backend-focused learning project  
Actively under development  

✔ Authentication implemented  
✔ Role-based authorization implemented  
✔ Project-level ownership authorization implemented  
✔ Filtering, sorting, searching, pagination implemented  
✔ User-level ownership + field-level authorization in progress
⏳ Project-level ownership + field-level authorization in progress  
⏳ Task-level ownership + field-level authorization in progress  
⏳ Project-member based task assignment system (planned)

---

## Project Structure

- `src/`
  - `controllers/` — Request handling logic
    - `auth.controller.js`
    - `user.controller.js`
    - `project.controller.js`
    - `task.controller.js`
  - `models/` — Mongoose schemas & models
    - `user.model.js`
    - `project.model.js`
    - `task.model.js`
  - `routes/` — API route definitions
    - `auth.route.js`
    - `user.route.js`
    - `project.route.js`
    - `task.route.js`
  - `middlewares/` — Authentication, authorization, error handling
    - `auth.middleware.js`
    - `error.middleware.js`
  - `config/` — Database configuration
    - `db.js`
  - `utils/` — Custom utilities
    - `AppError.js`
    - `catchAsync.js`
  - `app.js` — Express app configuration
- `server.js` — Application entry point