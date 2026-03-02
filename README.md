# Task Manager REST API – Clean Architecture

A backend-focused RESTful API built with **Node.js, Express.js, and MongoDB**, following **clean architecture principles** and real-world backend engineering practices.

This project demonstrates how production-grade APIs are structured, queried, and maintained — with a strong focus on backend logic, scalability, and maintainability.

---

## 🚀 Features

- Clean controller–model separation
- RESTful API design
- Express Router
- Centralized async error handling
- Custom `AppError` class
- Global error handling middleware
- MongoDB integration using Mongoose
- Advanced query handling (filtering, searching, sorting, pagination)
- Environment-based configuration using `dotenv`
- Proper HTTP status codes
- JSON-based consistent API responses

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- nodemon

---

## 📂 Project Structure

src/
 ├─ controllers/                 # Request handling logic
 │   ├─ user.controller.js
 │   ├─ project.controller.js
 │   └─ task.controller.js
 │
 ├─ models/                      # Mongoose schemas & models
 │   ├─ user.model.js
 │   ├─ project.model.js
 │   └─ task.model.js
 │
 ├─ routes/                      # API route definitions
 │   ├─ user.route.js
 │   ├─ project.route.js
 │   └─ task.route.js
 │
 ├─ middlewares/                 # Custom & global middlewares
 │   └─ error.middleware.js
 │
 ├─ utils/
 │   └─ AppError.js              # Custom error handling utility
 │
 ├─ config/
 │   └─ db.js                    # MongoDB connection configuration
 │
 ├─ app.js                       # Express application setup
 └─ server.js                    # Application entry point

---

## 📌 Implemented APIs

### Users
- POST /users — Create user  
- GET /users — Get all users  
- GET /users/:id — Get a particular user  
- PUT /users/:id — Update a user  
- DELETE /users/:id — Delete a user  

### Projects
- POST /projects — Create project  
- GET /projects — Get all projects  
- GET /projects/:id — Get a particular project  
- PUT /projects/:id — Update a project  
- DELETE /projects/:id — Delete a project  

### Tasks
- POST /tasks — Create task  
- GET /tasks — Get all tasks (advanced query support)  
- GET /tasks/:id — Get a particular task  
- PUT /tasks/:id — Update a task  
- DELETE /tasks/:id — Delete a task  

---

## 🔎 Advanced Query Features (Tasks API)

The GET /tasks endpoint supports powerful query options using URL parameters.

### Filtering
Filter tasks by any field:
- /tasks?priority=high
- /tasks?status=todo

Advanced comparison operators:
- /tasks?priority[gte]=medium

Supported operators:
- gte (greater than or equal)
- gt
- lte
- lt

---

### Searching
Case-insensitive search on `title` and `description`:
- /tasks?search=backend

---

### Sorting
Sort by one or multiple fields:
- /tasks?sort=priority
- /tasks?sort=-priority,createdAt

Use `-` for descending order.

---

### Pagination
Paginate results using:
- /tasks?page=2&limit=5

Defaults:
- page = 1
- limit = 10

---

## 📦 Standard API Response Format

All list endpoints follow a consistent response structure:

{
  "success": true,
  "results": 10,
  "total": 42,
  "page": 1,
  "limit": 10,
  "data": []
}

### Response Fields
- results → number of items in current page
- total → total matching documents (before pagination)
- page → current page number
- limit → items per page

---

## 🧠 Backend Concepts Demonstrated

- Clean architecture principles
- Centralized async error handling
- Custom error classes
- Advanced Mongoose query manipulation
- Regex-based searching
- Pagination and sorting logic
- Separation of concerns (routes, controllers, models)
- API contract consistency
- Environment-based configuration

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
NODE_ENV=development  

---

## 📈 Project Status

Backend-focused learning & portfolio project  
Actively evolving toward production-ready standards

---

## 🎯 Purpose

This project is built to:
- Strengthen backend engineering fundamentals
- Demonstrate real-world Express + MongoDB API patterns
- Serve as a backend portfolio project for job applications