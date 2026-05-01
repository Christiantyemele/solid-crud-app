# API Documentation

## Base URL

```
/api
```

## Authentication

All API routes (except `/api/auth/*`) require an authenticated user session.

## Projects API

### List Projects

```
GET /api/projects
```

Returns all projects owned by the authenticated user.

**Response:**
```json
{
  "projects": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "status": "PLANNING | ACTIVE | ON_HOLD | COMPLETED | ARCHIVED",
      "owner_id": "uuid",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

### Create Project

```
POST /api/projects
```

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "status": "string (optional)",
  "startDate": "timestamp (optional)",
  "endDate": "timestamp (optional)"
}
```

### Get Project

```
GET /api/projects/:id
```

Returns a single project with tasks and owner.

### Update Project

```
PUT /api/projects/:id
```

**Request Body:**
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "status": "string (optional)",
  "startDate": "timestamp (optional)",
  "endDate": "timestamp (optional)"
}
```

### Delete Project

```
DELETE /api/projects/:id
```

Deletes a project and all associated tasks (cascade).

## Tasks API

### List Tasks

```
GET /api/tasks?projectId=uuid&status=string
```

**Query Parameters:**
- `projectId` (optional): Filter by project
- `status` (optional): Filter by status

**Response:**
```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "status": "TODO | IN_PROGRESS | REVIEW | DONE | CANCELLED",
      "priority": "LOW | MEDIUM | HIGH | URGENT",
      "due_date": "timestamp",
      "project_id": "uuid",
      "assignee_id": "uuid",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

### Create Task

```
POST /api/tasks
```

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "status": "string (optional)",
  "priority": "string (optional)",
  "dueDate": "timestamp (optional)",
  "projectId": "uuid (required)",
  "assigneeId": "uuid (optional)"
}
```

### Get Task

```
GET /api/tasks/:id
```

### Update Task

```
PUT /api/tasks/:id
```

### Delete Task

```
DELETE /api/tasks/:id
```

## Auth API

### Logout

```
POST /api/auth/logout
```

Signs out the current user and redirects to login.

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message"
}
```

**Status Codes:**
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error
