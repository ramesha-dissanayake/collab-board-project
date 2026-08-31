# CollabBoard

CollabBoard is a collaborative Kanban-style project and task management application developed as a progressive full-stack group project.

Users can create an account, sign in, view their profile and projects, open a project-specific board, and manage tasks across three workflow stages:

- **To Do**
- **Doing**
- **Done**

The application is being developed incrementally across multiple milestones.

---

## Milestone Status

### Milestone 1 — Static Front-End Skeleton

**Status: Completed**

Milestone 1 established the React frontend, routing, reusable components, profile page, project dashboard, project-specific Kanban boards, mock data, and the initial UI structure.

### Milestone 2 — Working REST API with Mock Data

**Status: Completed**

Milestone 2 introduces a Node.js and Express backend and connects the React frontend to live REST API endpoints.

The application now includes real authentication, protected routes, server-side validation, project endpoints, and full task CRUD operations.

---

## Assignment 02 Features

### Authentication

- User registration
- User login
- Password hashing using `bcryptjs`
- JWT authentication
- Protected API routes
- Current authenticated user endpoint
- Frontend authentication state
- Automatic Bearer token handling

### Projects

- View accessible projects
- View a single project
- Create projects through the API
- Open a project-specific board from the profile page

### Tasks

- View tasks belonging to a project
- Create tasks
- Update task workflow status
- Delete tasks
- Search tasks from the frontend
- Display tasks under:
  - To Do
  - Doing
  - Done

### Validation and Error Handling

- Zod server-side validation
- Centralized Express error handling
- Consistent JSON error responses
- Authentication errors
- Validation errors
- Not-found errors

### Frontend Integration

The React frontend no longer reads project-board tasks directly from frontend mock data.

Instead, it communicates with the Express API through a centralized API client.

```text
React Components
       |
       v
src/api
       |
       v
HTTP Requests
       |
       v
Express REST API
       |
       v
Controller
       |
       v
Service
       |
       v
Repository
       |
       v
In-Memory Mock Data
```

---

## Application Flow

```text
Landing Page
     |
     v
Login / Create Account
     |
     v
Profile Page
     |
     v
Project List
     |
     v
Select Project
     |
     v
Project Board
     |
     +---- To Do
     |
     +---- Doing
     |
     +---- Done
```

Protected pages require a valid authenticated session.

---

## Frontend Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/login` | Login and account registration |
| `/profile` | Authenticated user profile and projects |
| `/projects/:projectId/board` | Selected project's Kanban board |
| `/board` | Redirects to `/profile` |

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- React Router DOM
- Tailwind CSS

### Backend

- Node.js
- Express
- JSON Web Token (`jsonwebtoken`)
- `bcryptjs`
- Zod
- CORS
- dotenv

### Development

- Git
- GitHub
- npm
- ESLint
- Postman

---

## Backend Architecture

The Express backend follows a layered structure.

```text
Route
  |
  v
Controller
  |
  v
Service
  |
  v
Repository
  |
  v
In-Memory Data
```

HTTP-specific objects such as `req` and `res` are handled at the controller level, while business logic is kept inside services.

---

## Project Structure

```text
collab-board-project/
|
├── docs/
│   └── postman/
│       └── CollabBoard-M2.postman_collection.json
|
├── src/
│   ├── api/
│   │   ├── authApi.js
│   │   ├── client.js
│   │   ├── projectApi.js
│   │   └── taskApi.js
│   │
│   ├── components/
│   │   ├── profile/
│   │   ├── Board.jsx
│   │   ├── Column.jsx
│   │   ├── Navbar.jsx
│   │   └── TaskCard.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── data/
│   ├── pages/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   ├── config.js
│   │   └── server.js
│   │
│   ├── .env.example
│   └── package.json
│
├── .env.example
├── package.json
└── README.md
```

---

# Running the Application

## Prerequisites

Install:

- Node.js
- npm
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/ramesha-dissanayake/collab-board-project.git
cd collab-board-project
```

---

## 2. Install Frontend Dependencies

```bash
npm install
```

Create a root `.env` file:

```env
VITE_API_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

The Vite frontend normally runs at:

```text
http://localhost:5173
```

---

## 3. Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

Create:

```text
server/.env
```

using `server/.env.example` as a template:

```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=replace-with-your-own-secret
```

Start the Express server:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:4000
```

---

## API Contract

### Authentication

| Method | Endpoint | Description | Auth | Success |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/register` | Register a user | No | 201 |
| POST | `/api/auth/login` | Login and receive JWT | No | 200 |
| GET | `/api/auth/me` | Get current user | Yes | 200 |

### Projects

| Method | Endpoint | Description | Auth | Success |
| --- | --- | --- | --- | --- |
| GET | `/api/projects` | List accessible projects | Yes | 200 |
| POST | `/api/projects` | Create a project | Yes | 201 |
| GET | `/api/projects/:id` | Get a project | Yes | 200 |
| GET | `/api/projects/:projectId/tasks` | Get project tasks | Yes | 200 |

### Tasks

| Method | Endpoint | Description | Auth | Success |
| --- | --- | --- | --- | --- |
| POST | `/api/tasks` | Create a task | Yes | 201 |
| PATCH | `/api/tasks/:id` | Update a task | Yes | 200 |
| DELETE | `/api/tasks/:id` | Delete a task | Yes | 204 |

---

## Authentication

After a successful login, the backend returns a JSON Web Token.

The frontend stores the token and includes it in protected requests using:

```text
Authorization: Bearer <token>
```

Passwords are never stored as plain text. They are hashed using `bcryptjs`.

The JWT secret is stored in:

```text
server/.env
```

The real `.env` files are ignored by Git.

---

## Validation and Error Responses

Request data is validated on the server using Zod.

Example validation error:

```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "title",
        "message": "Title must be at least 3 characters"
      }
    ]
  }
}
```

Common HTTP responses include:

| Status | Meaning |
| --- | --- |
| 200 | Successful request |
| 201 | Resource created |
| 204 | Resource deleted successfully |
| 400 | Validation or request error |
| 401 | Authentication required or invalid |
| 403 | Access forbidden |
| 404 | Resource or route not found |
| 409 | Duplicate resource |
| 500 | Unexpected server error |

---

## Postman API Collection

The Assignment 02 Postman collection is included at:

```text
docs/postman/CollabBoard-M2.postman_collection.json
```

Import the file into Postman to test the REST API.

The collection includes requests for:

- Registration
- Login
- Current authenticated user
- Project retrieval
- Project creation
- Project task retrieval
- Task creation
- Task updating
- Task deletion
- Validation errors
- Authentication errors
- Unknown routes

Because Milestone 2 uses server-side in-memory data, run **Register User** and then **Login User** after restarting the Express server.

---

## Available Scripts

### Frontend Development Server

```bash
npm run dev
```

### Frontend Production Build

```bash
npm run build
```

### ESLint

```bash
npm run lint
```

### Backend Development Server

```bash
cd server
npm run dev
```

---

## Data Persistence in Milestone 2

Milestone 2 intentionally uses in-memory mock data on the backend.

This means runtime changes are reset when the Express server restarts.

For example:

- Registered users are reset
- Newly created projects are reset
- Created or modified tasks are reset

Persistent MongoDB storage will be introduced in the database milestone.

Profile details such as age, description and profile-image information can still be stored locally in the browser using `localStorage`.

---

## Testing and Verification

The Milestone 2 implementation has been manually verified using the browser, PowerShell HTTP requests and Postman.

The following flows are supported:

```text
Register
   ↓
Login
   ↓
JWT Authentication
   ↓
Profile
   ↓
Load Projects
   ↓
Open Project Board
   ↓
Create Task
   ↓
Update Task
   ↓
Delete Task
```

The project is also checked using:

```bash
npm run lint
npm run build
```

---

## Git Workflow

Development is completed using feature branches and pull requests rather than making development changes directly on `main`.

```text
Feature Branch
      |
      v
Commits
      |
      v
Pull Request
      |
      v
Review / Merge
      |
      v
main
```

Assignment submission versions are identified using Git tags.

Final Milestone 2 submission tag:

```text
Assignment-02
```

---

## Known Limitations

The following features are outside the scope of Milestone 2:

- MongoDB persistence
- Mongoose models
- Offline synchronization
- Automated client/server test suites
- Socket.io real-time updates
- Concurrent edit detection
- Docker deployment
- Production deployment

These features will be introduced progressively in later milestones.

---

## Future Development

The next stages will extend CollabBoard with:

```text
MongoDB + Mongoose
        ↓
Persistent Data
        ↓
Client-side Caching
        ↓
Automated Testing
        ↓
GitHub Actions CI
        ↓
Socket.io Real-Time Updates
        ↓
Concurrent Edit Handling
        ↓
Docker
        ↓
Deployment
```

---

## Repository

GitHub:

```text
https://github.com/ramesha-dissanayake/collab-board-project
```

---

## Project Goal

The goal of CollabBoard is to provide a full-stack collaborative task management application where authenticated users can work with projects, manage tasks through a Kanban workflow, and progressively gain persistent and real-time collaboration capabilities as later milestones are completed.