# Notes — Full-Stack MERN Application

This project is a simple full-stack note-taking application built with the MERN stack.  
It includes user registration and authentication, personal note management, and a complete cloud deployment pipeline.  
The goal of the project was to practice building and deploying a modern web application end-to-end, including frontend architecture, backend API design, database integration, and automated testing.

---

## Live Links

**Frontend (Netlify)**  
https://hampusrydinnotes.netlify.app  

**Backend (Render)**  
https://notes-backend-bx4s.onrender.com  

---

## Project Overview

### Frontend
- React with Vite
- React Router for navigation
- Context-based authentication state
- UI for creating, editing, and deleting notes
- Environment-based API URL configuration

### Backend
- Node.js with Express
- MongoDB Atlas with Mongoose
- JWT authentication
- Password hashing (bcrypt)
- User-specific note access

### Deployment and Infrastructure
- Netlify for frontend hosting
- Render for backend hosting
- MongoDB Atlas cloud database
- Secure environment variables
- GitHub Actions for continuous testing

---

## Features

- Account registration and login  
- Secure password storage  
- JWT-protected routes  
- Client-side route protection  
- Create, edit, and delete notes  
- User-scoped data (each user has their own notes)  

---

## Testing

- Backend integration tests using Jest and Supertest  
- Frontend component tests using Vitest and React Testing Library  
- Automated test suite triggered on each push via GitHub Actions  

---

## Technology Stack

**Frontend:** React, Vite, React Router  
**Backend:** Node.js, Express, Mongoose  
**Database:** MongoDB Atlas  
**Hosting:** Netlify (frontend), Render (backend)  
**Testing:** Jest, Supertest, Vitest  

---

## Purpose of the Project

This application was created as part of a broader effort to gain practical experience with full-stack development.  
It provides hands-on exposure to designing APIs, structuring a React application, managing authentication, integrating with a cloud database, deploying web services, and setting up automated testing workflows.

---
