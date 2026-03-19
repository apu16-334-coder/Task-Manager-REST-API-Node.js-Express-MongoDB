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
- JWT-based Authentication (protect middleware)
- Role-based Authorization (user, manager, admin)
- Ownership-based Access Control
- Secure route protection using middleware chaining:

---

## Authorization Design

### Roles
- **user** → Can view resources and work with tasks
- **manager** → Can create and manage their own projects
- **admin** → Full system control (users, projects, tasks)

---

### Users API
- Admin only access
- Only admin can create, update, delete users

---

### Projects API
- Any authenticated user can view projects
- Manager/Admin can create projects
- Manager becomes owner automatically
- Admin can assign owner or become owner
- Only **project owner or admin** can update/delete

---

### Tasks API
- Any authenticated user can view tasks
- Supports filtering, sorting, pagination
- (Ownership rules will be extended further)

---

## Implemented APIs

### Users
- **POST /users** — Create user (Admin only)
- **GET /users** — Get all users (Admin only)
- **GET /users/:id** — Get a particular user (Admin only)
- **PUT /users/:id** — Edit a particular user (Admin only)
- **DELETE /users/:id** — Delete a particular user (Admin only)

---

### Projects
- **POST /projects** — Create project (Manager/Admin)
- **GET /projects** — Get all projects (Authenticated users)
- **GET /projects/:id** — Get a particular project (Authenticated users)
- **PUT /projects/:id** — Edit project (Owner/Admin)
- **DELETE /projects/:id** — Delete project (Owner/Admin)

---

### Tasks
- **POST /tasks** — Create task
- **GET /tasks** — Get all tasks  
Supports query parameters:
- `search` → keyword search in title & description
- `priority` → single or multiple values (e.g., `priority=high` or `priority=high,medium`)
- `status` → single or multiple values (e.g., `status=open` or `status=open,completed`)
- `sort` → comma-separated fields (e.g., `sort=priority,-createdAt`)
- `page` → page number for pagination
- `limit` → results per page

- **GET /tasks/:id** — Get a particular task
- **PUT /tasks/:id** — Edit a particular task
- **DELETE /tasks/:id** — Delete a particular task

#### Response Metadata for GET /tasks
- `results` → number of tasks returned
- `total` → total tasks matching filters
- `page` → current page
- `limit` → results per page
- `data` → array of task objects

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
✔ Ownership-based authorization for projects implemented  
⏳ Task-level authorization in progress  

---

## Project Structure

- `src/`
- `controllers/` — Request handling logic
  - `user.controller.js`
  - `project.controller.js`
  - `task.controller.js`
- `models/` — Mongoose schemas & models
  - `user.model.js`
  - `project.model.js`
  - `task.model.js`
- `routes/` — API route definitions
  - `user.route.js`
  - `project.route.js`
  - `task.route.js`
- `middlewares/` — Authentication, authorization, error handling
  - `auth.middleware.js`
  - `error.middleware.js`
- `config/db.js` — Database configuration
- `utils/` — Custom utilities
  - `AppError.js`
  - `catchAsync.js`
- `app.js` — Express app configuration

- `server.js` — Application entry point