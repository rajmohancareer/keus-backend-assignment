# TODO REST API

## Overview

A simple REST API for creating, reading, updating, and deleting TODO items. The API uses Express.js for HTTP routing and Mongoose to store TODOs in MongoDB.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv

## Project Structure

```text
todo-api/
├── controllers/
│   └── todoController.js
├── models/
│   └── Todo.js
├── routes/
│   └── todoRoutes.js
├── index.js
├── package.json
├── .env.example
├── .gitignore
├── README.md
└── postman_collection.json
```

- `models/Todo.js` defines the Mongoose TODO schema.
- `controllers/todoController.js` contains API and database logic.
- `routes/todoRoutes.js` defines the `/todos` routes.
- `index.js` configures Express, connects to MongoDB, and starts the server.
- `postman_collection.json` contains ready-to-import API requests.

## Requirements

- Node.js 18 or newer
- A running MongoDB instance or a MongoDB Atlas connection string
- npm

## Installation

Install the dependencies:

```bash
npm install
```

## Environment Configuration

Create a `.env` file by copying `.env.example` and set your MongoDB connection string:

```env
MONGODB_URI=your-mongodb-connection-string
PORT=5000
```

Do not put real credentials in source control. The `.env` file is ignored by Git.

## Running Locally

Start the API with:

```bash
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

The API runs on port `5000` by default.

## API Base URL

Local:

`http://localhost:5000`

Live URL: `https://keus-backend-assignment-2.onrender.com`

## API Endpoints

### GET /health

Checks whether the API is running.

**Success:** `200 OK`

```json
{
  "status": "OK"
}
```

### POST /todos

Creates a TODO.

**Request body:**

```json
{
  "title": "Learn REST APIs",
  "description": "Build a TODO API",
  "completed": false
}
```

**Success:** `201 Created`

Example response:

```json
{
  "_id": "665000000000000000000001",
  "title": "Learn REST APIs",
  "description": "Build a TODO API",
  "completed": false,
  "createdAt": "2026-08-11T00:00:00.000Z",
  "updatedAt": "2026-08-11T00:00:00.000Z"
}
```

**Errors:** `400 Bad Request` for invalid input, `500 Internal Server Error` for unexpected database/server failures.

### GET /todos

Returns all TODOs.

**Success:** `200 OK`

Example response:

```json
[
  {
    "_id": "665000000000000000000001",
    "title": "Learn REST APIs",
    "description": "Build a TODO API",
    "completed": false,
    "createdAt": "2026-08-11T00:00:00.000Z",
    "updatedAt": "2026-08-11T00:00:00.000Z"
  }
]
```

**Error:** `500 Internal Server Error` for unexpected database/server failures.

### GET /todos/:id

Returns one TODO by MongoDB ObjectID.

**Success:** `200 OK`

**Errors:**

- `400 Bad Request` — malformed TODO ID.
- `404 Not Found` — TODO does not exist.
- `500 Internal Server Error` — unexpected server/database failure.

Example not-found response:

```json
{
  "error": "Todo not found"
}
```

Example invalid-ID response:

```json
{
  "error": "Invalid todo ID"
}
```

### PUT /todos/:id

Updates a TODO. The supported fields are `title`, `description`, and `completed`.

**Request body:**

```json
{
  "title": "Learn REST APIs",
  "description": "Build and test the API",
  "completed": true
}
```

**Success:** `200 OK` with the updated TODO.

**Errors:**

- `400 Bad Request` — malformed ID, empty title, or no valid update fields.
- `404 Not Found` — TODO does not exist.
- `500 Internal Server Error` — unexpected server/database failure.

### DELETE /todos/:id

Deletes a TODO.

**Success:** `200 OK`

```json
{
  "message": "Todo deleted successfully"
}
```

**Errors:**

- `400 Bad Request` — malformed TODO ID.
- `404 Not Found` — TODO does not exist.
- `500 Internal Server Error` — unexpected server/database failure.

## Validation

`title` is required when creating a TODO. Missing, empty, and whitespace-only titles are rejected with:

```json
{
  "error": "Title is required"
}
```

The same validation applies when `title` is supplied during an update. The title is trimmed before it is saved.

## Error Handling

API errors use a consistent JSON structure:

```json
{
  "error": "Message"
}
```

Malformed MongoDB IDs are checked before database queries so normal invalid requests do not crash the server.

## Postman

Import `postman_collection.json` into Postman.

The collection defines:

```text
base_url = http://localhost:5000
todo_id = replace-with-created-todo-id
```

After creating a TODO, copy its `_id` into the `todo_id` collection variable and run the remaining requests.

## Testing

Start the server first, then use these examples.

### Health check

```bash
curl http://localhost:5000/health
```

### Create TODO

```bash
curl -X POST http://localhost:5000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo","description":"Testing the API","completed":false}'
```

### Get all TODOs

```bash
curl http://localhost:5000/todos
```

### Get one TODO

Replace `TODO_ID` with the `_id` returned by the create request:

```bash
curl http://localhost:5000/todos/TODO_ID
```

### Update TODO

```bash
curl -X PUT http://localhost:5000/todos/TODO_ID \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Test Todo","description":"Updated through the API","completed":true}'
```

### Delete TODO

```bash
curl -X DELETE http://localhost:5000/todos/TODO_ID
```

### Invalid ID

```bash
curl http://localhost:5000/todos/not-a-valid-id
```

Expected status: `400`

```json
{
  "error": "Invalid todo ID"
}
```

## Git Setup

The repository ignores:

- `node_modules/`
- `.env`
- npm debug logs
- common operating-system/editor files

`.env.example` is intentionally tracked so other developers know which environment variables are required.
