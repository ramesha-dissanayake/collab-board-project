# CollabBoard

CollabBoard is a collaborative Kanban-style project and task management application built as a progressive full-stack group project.

Authenticated users can create projects, add registered members, manage tasks across a Kanban workflow, work with persistent MongoDB data, and continue selected board operations during temporary network loss.

---

## Current Milestones

### Milestone 1 — Frontend Skeleton

**Completed**

Built the React interface, routing, profile page, project dashboard, reusable components, and Kanban board.

### Milestone 2 — REST API Integration

**Completed**

Added the Express backend, JWT authentication, validation, protected routes, project APIs, task CRUD operations, and frontend API integration.

### Milestone 3 — Persistence & Offline Support

**Completed**

Milestone 3 replaces temporary server data with MongoDB and introduces browser-side persistence.

Main additions include:

- MongoDB persistence through Mongoose
- MongoDB Atlas cloud database integration
- Persistent users, projects, memberships, and tasks
- MongoDB indexes and aggregation
- Repeatable development seed data
- PouchDB / IndexedDB browser caching
- Offline board loading
- Queued offline task changes
- Reconnection synchronization
- Optimistic concurrency for task updates
- `409 Conflict` handling for stale edits

---

## Main Features

### Authentication

- User registration and login
- Password hashing with `bcryptjs`
- JWT authentication
- Protected API routes
- Current authenticated user endpoint

### Projects

- Create projects
- View accessible projects
- Project owner and member relationships
- Search registered users by email
- Add and remove project members
- Member-specific project dashboards

### Tasks

- Create tasks
- View project tasks
- Move tasks between:
  - To Do
  - Doing
  - Done
- Delete tasks
- Search tasks
- Persist tasks in MongoDB
- Track task versions for concurrent editing

### Offline Support

Boards opened while online are cached in PouchDB using IndexedDB.

When the connection is unavailable:

- cached boards can still be displayed
- task creation can be queued locally
- task status changes can be queued locally
- task deletion can be queued locally
- queued changes survive browser refresh
- pending changes synchronize when connectivity returns

### Concurrent Edit Handling

Each task contains a numeric `version`.

Task updates send a `baseVersion` to the API. The server updates the task only when the stored version still matches.

```text
Client version = 2
Server version = 2
        ↓
Update succeeds
        ↓
Version becomes 3
````

If another user has already modified the task:

```text
Client version = 2
Server version = 3
        ↓
409 Conflict
```

The client can then use the latest server version or deliberately reapply the local change.

This prevents silent lost updates.

---

## Technology Stack

### Frontend

* React
* Vite
* React Router
* JavaScript
* Tailwind CSS
* PouchDB
* IndexedDB

### Backend

* Node.js
* Express
* MongoDB
* MongoDB Atlas
* Mongoose
* JWT
* bcryptjs
* Zod
* CORS
* dotenv

### Development Tools

* Git / GitHub
* npm
* ESLint
* Postman
* MongoDB Atlas Data Explorer
* MongoDB Compass
* mongosh

---

## Architecture

```text
React Frontend
      |
      +------ PouchDB / IndexedDB
      |           |
      |       Local Cache
      |       Offline Queue
      |
      v
REST API
      |
      v
Controllers
      |
      v
Services
      |
      v
Repositories
      |
      v
Mongoose
      |
      v
MongoDB Atlas
```

---

## Project Structure

```text
collab-board-project/
|
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── db/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── scripts/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── .env.example
│   └── package.json
│
├── docs/
├── postman/
├── .env.example
├── package.json
└── README.md
```

---

# Running the Application

## Prerequisites

Install:

* Node.js
* npm
* Git

Required external service:

* MongoDB Atlas account with an M0 Free cluster

Recommended:

* Postman
* MongoDB Compass

---

## 1. Clone the Repository

```bash
git clone https://github.com/ramesha-dissanayake/collab-board-project.git
cd collab-board-project
```

---

## 2. Install Dependencies

Frontend:

```bash
npm install
```

Backend:

```bash
cd server
npm install
cd ..
```

---

## 3. Configure Environment Variables

Create a root `.env` file:

```env
VITE_API_URL=http://localhost:4000
```

Create `server/.env`:

```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=replace-with-your-own-secret
MONGODB_URI=your-mongodb-atlas-connection-string
```

`MONGODB_URI` should contain the MongoDB Atlas connection string for the `collabboard` database.

Example structure:

```text
mongodb+srv://<username>:<password>@<cluster-host>/collabboard
```

or a standard non-SRV Atlas connection string.

Real `.env` files are ignored by Git and must not be committed.

Database credentials and JWT secrets must never be added to the repository.

---

## 4. Seed the Development Database

From the `server` folder:

```bash
cd server
npm run seed
```

The seed script creates sample users, projects, memberships, and tasks for development and testing.

Example test account:

```text
maya.seed@example.com
password123
```

The seed script clears the configured development database before recreating the sample records.

> Do not run the seed script against a production database containing real data.

---

## 5. Start the Backend

From the `server` folder:

```bash
npm run dev
```

Expected backend address:

```text
http://localhost:4000
```

Health endpoint:

```text
GET /api/health
```

A successful startup should confirm that MongoDB is connected.

---

## 6. Start the Frontend

Open another terminal at the project root:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## API Overview

### Authentication

| Method | Endpoint             | Purpose                    |
| ------ | -------------------- | -------------------------- |
| POST   | `/api/auth/register` | Register user              |
| POST   | `/api/auth/login`    | Login                      |
| GET    | `/api/auth/me`       | Current authenticated user |

### Projects

| Method | Endpoint                                 | Purpose                         |
| ------ | ---------------------------------------- | ------------------------------- |
| GET    | `/api/projects`                          | Get accessible projects         |
| POST   | `/api/projects`                          | Create project                  |
| GET    | `/api/projects/:id`                      | Get project                     |
| GET    | `/api/projects/:id/member-candidate`     | Find registered member by email |
| POST   | `/api/projects/:id/members`              | Add project member              |
| DELETE | `/api/projects/:id/members/:memberId`    | Remove project member           |
| GET    | `/api/projects/:projectId/tasks`         | Get project tasks               |
| GET    | `/api/projects/:projectId/stats/overdue` | Get overdue task statistics     |

### Tasks

| Method | Endpoint         | Purpose     |
| ------ | ---------------- | ----------- |
| POST   | `/api/tasks`     | Create task |
| PATCH  | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

Protected endpoints require:

```text
Authorization: Bearer <token>
```

Task updates also include the current task version:

```json
{
  "status": "doing",
  "baseVersion": 2
}
```

A stale version returns:

```text
409 Conflict
```

---

## Postman API Collection

A Postman collection is included in the repository for testing the REST API.

Example location:

```text
postman/CollabBoard_API.postman_collection.json
```

The collection contains requests for:

* Register
* Login
* Current User
* Get Projects
* Get One Project
* Get Project Tasks
* Create Task
* Update Task
* Delete Task
* Overdue Task Statistics

Protected requests require a valid JWT token generated by the Login endpoint.

---

## Database Design

The Assignment 03 version of CollabBoard uses a MongoDB Atlas M0 Free cluster for persistent cloud database storage.

Mongoose is used by the Express backend to communicate with MongoDB Atlas.

MongoDB uses three main collections:

```text
users
projects
tasks
```

Relationships are stored using MongoDB ObjectId references.

```text
User
  ↑
  |
Project
  ├── ownerId
  └── memberIds[]

Task
  ├── projectId → Project
  └── assigneeId → User
```

Tasks also contain a `version` field for optimistic concurrency.

---

## MongoDB Performance

Task indexes support common operations such as:

* project + status + position
* project + due date
* assignee + status
* task title/description text search

The project also includes an aggregation endpoint that reports incomplete overdue tasks grouped by assignee.

---

## Client Persistence

PouchDB stores project and task copies locally in IndexedDB.

Typical local document IDs follow prefixes such as:

```text
project:<userId>:<projectId>

task:<userId>:<projectId>:<taskId>

queue:<userId>:<projectId>:<taskId>
```

Queue documents represent task changes waiting to synchronize with the API.

---

## Available Scripts

Frontend:

```bash
npm run dev
npm run build
npm run lint
```

Backend:

```bash
cd server
npm run dev
npm run seed
```

---

## Verification

Before merging milestone changes, run:

```bash
npm run lint
npm run build
```

The main Milestone 3 flow supports:

```text
Register / Login
        ↓
Create Project
        ↓
Add Members
        ↓
Create / Update / Delete Tasks
        ↓
MongoDB Atlas Persistence
        ↓
PouchDB Cache
        ↓
Offline Task Changes
        ↓
Reconnect & Sync
        ↓
Conflict Detection
```

---

## Git Workflow

Development uses feature branches and pull requests.

```text
main
 ↑
Pull Request
 ↑
Feature Branch
```

Normal development changes should not be committed directly to `main`.

---

## Current Limitations

* Project creation and project member management require connectivity.
* Offline support currently focuses on board/task operations.
* Optimistic concurrency currently protects task updates.
* Task deletion does not currently use version-based conflict detection.
* Real-time Socket.io synchronization is planned for a later milestone.
* Docker and production deployment are planned for later milestones.

---

## Repository

```text
https://github.com/ramesha-dissanayake/collab-board-project
```

---

## Assignment 03

**Assignment 03 — Working Full Stack Application**

This version demonstrates:

* React frontend
* Node.js / Express backend
* MongoDB Atlas cloud database
* Mongoose persistence
* JWT authentication
* REST API integration
* Postman API testing
* Browser-side PouchDB caching
* Offline task synchronization
* Optimistic concurrency handling

The submitted Git tag for this version is:

```text
Assignment-03
```

---

## Project Goal

CollabBoard demonstrates the progressive development of a collaborative full-stack application, moving from a static React interface to REST APIs, persistent MongoDB storage, offline-capable client persistence, concurrency handling, testing, real-time collaboration, and deployment.
