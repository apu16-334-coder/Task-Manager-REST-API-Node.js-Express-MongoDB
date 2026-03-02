# Task Manager REST API – Clean Architecture

A RESTful API built with Express.js following a clean, scalable, and backend-focused project structure.  
This project demonstrates real-world backend engineering practices.

## Features
- Express Router
- Controller-based architecture (MVC)
- RESTful API design
- JSON-based responses
- Proper HTTP status codes
- Centralized error handling with AppError
- 404 (Route Not Found) middleware
- MongoDB integration using Mongoose
- Nodemon for development
- Environment configuration using dotenv

## Implemented APIs

### Users
- **POST /users** — Create user
- **GET /users** — Get all users
- **GET /users/:id** — Get a particular user
- **PUT /users/:id** — Edit a particular user
- **DELETE /users/:id** — Delete a particular user

### Projects
- **POST /projects** — Create project
- **GET /projects** — Get all projects
- **GET /projects/:id** — Get a particular project
- **PUT /projects/:id** — Edit a particular project
- **DELETE /projects/:id** — Delete a particular project

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
- `data` → array of task objects (`id`, `title`, `description`, `priority`, `status`, `createdAt`)

## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)

## Project Status
Backend-focused learning project  
Actively under development

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
  - `middlewares/` — Error handler, auth, etc.
    - `error.middleware.js`
  - `config/db.js` — Database configuration
  - `utils/` — Custom error handling & utilities
    - `AppError.js`
  - `app.js` — Express app configuration
- `server.js` — Application entry point