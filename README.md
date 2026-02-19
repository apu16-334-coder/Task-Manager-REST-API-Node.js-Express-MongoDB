# Task Manager REST API – Clean Architecture

A RESTful API built with Express.js following a clean, scalable, and backend-focused project structure.  
This project is being developed to demonstrate real-world backend engineering practices.

## Features
- Express Router
- Controller-based architecture
- RESTful API design
- JSON-based responses
- Proper HTTP status codes
- Centralized error handling (structure prepared)
- Custom AppError class (structure prepared)
- 404 (Route Not Found) middleware (structure prepared)
- MongoDB database integration using Mongoose
- Nodemon as a development dependency
- Environment configuration using dotenv

## Implemented APIs
- POST /users — Create user
- GET /users — Get all users
- GET /users/:id — Get a particular user
- PUT /users/:id — Edit a partcular user
- DELETE /users/:id — Delete a partcular user
- POST /projects — Create project
- GET /projects — Get all projects
- GET /projects/:id — Get a particular project
- PUT /projects/:id — Edit a partcular project
- DELETE /projects/:id — Delete a partcular project


## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)

## Project Status
Backend-focused learning project  
Actively under development

## Project Structure
- src/
 - controllers/    # Request handling logic
 - models/         # Mongoose schemas & models
 - routes/         # API route definitions
 - middlewares/    # Global & custom middlewares
 - config/         # Database & environment configuration
 - utils/          # Custom Error handling & utilities
 - app.js          # Express application configuration
- server.js        # Application entry point
