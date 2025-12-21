# Notes — Personal Full-Stack Project

A small full-stack note-taking application built with the MERN stack.  
It includes user registration and login, secure authentication, and personal note management (create, edit, delete).  
The project was developed independently to practice full-stack development, API design, authentication, cloud deployment, and continuous integration workflows.

---

## Live Links

- **Frontend (Netlify):** https://hampusrydinnotes.netlify.app  
- **Backend (Render):** https://notes-backend-bx4s.onrender.com  

---

## What the Project Includes

### **Frontend**
- React (Vite)
- React Router
- Context-based authentication state
- Note CRUD interface
- API calls using environment-based URLs

### **Backend**
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT authentication
- Password hashing with bcrypt
- User-scoped routes (each user only sees their own notes)

### **DevOps / Deployment**
- Render for backend hosting
- Netlify for frontend hosting
- Secure environment variables for config
- MongoDB Atlas cloud database
- GitHub Actions for CI test automation

---

## Features

- User registration & login  
- Secure password hashing  
- JWT token authentication  
- Protected API endpoints  
- Protected frontend routes  
- Create, edit, and delete notes  
- Each user has isolated data  

---

## Testing

- **Backend:** Jest + Supertest API integration tests  
- **Frontend:** Vitest + React Testing Library  
- **CI/CD:** GitHub Actions running all tests on push  

---

## Tech Stack

**Frontend:** React, Vite, React Router  
**Backend:** Node.js, Express, Mongoose  
**Database:** MongoDB Atlas  
**Deployment:** Netlify (frontend), Render (backend)  
**Testing:** Jest, Supertest, Vitest  

---

## Purpose

This project was built to strengthen practical experience with modern full-stack development including API design, authentication, state management, database modeling, deployment pipelines, cloud infrastructure, and automated testing.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

