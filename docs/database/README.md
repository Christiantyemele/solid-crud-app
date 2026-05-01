# Database Schema Documentation

This document provides comprehensive documentation for the database schema used in the Solid CRUD application.

## Overview

The database is built on PostgreSQL (via Supabase) and uses Prisma as the ORM. The schema is designed with:

- **Data integrity**: Foreign key constraints and cascading deletes
- **Performance**: Strategic indexes on frequently queried fields
- **Scalability**: Normalized structure with proper relationships
- **Auditability**: Activity logging for all important actions

## Entity Relationship Diagram

```
+-------------+       +-------------+       +-------------+
|    User     |       |   Project   |       |    Task     |
+-------------+       +-------------+       +-------------+
| id          |<----->| id          |<----->| id          |
| email       |       | name        |       | title       |
| name        |       | description |       | description |
| avatarUrl   |       | status      |       | status      |
| createdAt   |       | startDate   |       | priority    |
| updatedAt   |       | endDate     |       | dueDate     |
+-------------+       +-------------+       +-------------+
      |                     |                     |
      |                     |                     |
      v                     v                     v
+-------------+       +-------------+       +-------------+
|  Comment    |       | ActivityLog |       |   Indexes   |
+-------------+       +-------------+       +-------------+
```

## Tables

### Users

Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (cuid) | PRIMARY KEY | Unique identifier |
| email | String | UNIQUE, NOT NULL | User email address |
| name | String | NULLABLE | User display name |
| avatarUrl | String | NULLABLE | URL to avatar image |
| createdAt | DateTime | DEFAULT now() | Account creation timestamp |
| updatedAt | DateTime | AUTO UPDATE | Last update timestamp |

**Indexes**:
- `users_email_idx` on `email` for fast lookups

### Projects

Stores project information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (cuid) | PRIMARY KEY | Unique identifier |
| name | String | NOT NULL | Project name |
| description | Text | NULLABLE | Project description |
| status | Enum | DEFAULT PLANNING | Project status |
| startDate | DateTime | NULLABLE | Project start date |
| endDate | DateTime | NULLABLE | Project end date |
| ownerId | String | FOREIGN KEY | Reference to User |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO UPDATE | Last update timestamp |

**ProjectStatus Enum**:
- `PLANNING`: Project is in planning phase
- `ACTIVE`: Project is actively being worked on
- `ON_HOLD`: Project is temporarily paused
- `COMPLETED`: Project is finished
- `ARCHIVED`: Project is archived

**Indexes**:
- `projects_owner_id_idx` on `ownerId`
- `projects_status_idx` on `status`

### Tasks

Stores task information within projects.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (cuid) | PRIMARY KEY | Unique identifier |
| title | String | NOT NULL | Task title |
| description | Text | NULLABLE | Task description |
| status | Enum | DEFAULT TODO | Task status |
| priority | Enum | DEFAULT MEDIUM | Task priority |
| dueDate | DateTime | NULLABLE | Task due date |
| projectId | String | FOREIGN KEY | Reference to Project |
| assigneeId | String | FOREIGN KEY, NULLABLE | Reference to User |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO UPDATE | Last update timestamp |

**TaskStatus Enum**:
- `TODO`: Task is not yet started
- `IN_PROGRESS`: Task is currently being worked on
- `REVIEW`: Task is ready for review
- `DONE`: Task is completed
- `CANCELLED`: Task was cancelled

**TaskPriority Enum**:
- `LOW`: Low priority
- `MEDIUM`: Normal priority
- `HIGH`: High priority
- `URGENT`: Urgent priority

**Indexes**:
- `tasks_project_id_idx` on `projectId`
- `tasks_assignee_id_idx` on `assigneeId`
- `tasks_status_idx` on `status`
- `tasks_priority_idx` on `priority`

### Comments

Stores comments on tasks and projects.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (cuid) | PRIMARY KEY | Unique identifier |
| content | Text | NOT NULL | Comment content |
| authorId | String | FOREIGN KEY | Reference to User |
| projectId | String | FOREIGN KEY, NULLABLE | Reference to Project |
| taskId | String | FOREIGN KEY, NULLABLE | Reference to Task |
| parentCommentId | String | FOREIGN KEY, NULLABLE | For threaded comments |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO UPDATE | Last update timestamp |

**Indexes**:
- `comments_author_id_idx` on `authorId`
- `comments_project_id_idx` on `projectId`
- `comments_task_id_idx` on `taskId`

### Activity Logs

Stores audit trail for all important actions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String (cuid) | PRIMARY KEY | Unique identifier |
| action | String | NOT NULL | Action type (CREATE, UPDATE, DELETE) |
| entityType | String | NOT NULL | Type of entity affected |
| entityId | String | NOT NULL | ID of entity affected |
| metadata | JSON | NULLABLE | Additional context |
| userId | String | FOREIGN KEY | User who performed action |
| projectId | String | FOREIGN KEY, NULLABLE | Related project |
| taskId | String | FOREIGN KEY, NULLABLE | Related task |
| createdAt | DateTime | DEFAULT now() | Action timestamp |

**Indexes**:
- `activity_logs_user_id_idx` on `userId`
- `activity_logs_entity_idx` on `entityType, entityId`
- `activity_logs_created_at_idx` on `createdAt`

## Relationships

### User -> Projects
- **Type**: One-to-Many
- **Description**: A user can own multiple projects
- **On Delete**: CASCADE (deleting user deletes their projects)

### Project -> Tasks
- **Type**: One-to-Many
- **Description**: A project can have multiple tasks
- **On Delete**: CASCADE (deleting project deletes its tasks)

### User -> Tasks (Assignee)
- **Type**: One-to-Many
- **Description**: A user can be assigned to multiple tasks
- **On Delete**: SET NULL (unassign tasks when user is deleted)

### User -> Comments
- **Type**: One-to-Many
- **Description**: A user can write multiple comments
- **On Delete**: CASCADE (deleting user deletes their comments)

### Comment -> Comments (Replies)
- **Type**: Self-referential One-to-Many
- **Description**: A comment can have replies
- **On Delete**: SET NULL (replies become top-level when parent is deleted)

## Row-Level Security (RLS) Policies

Supabase RLS policies ensure data access control at the database level:

### Users Table
```sql
-- Users can view all users
CREATE POLICY "Users are viewable by everyone" 
ON users FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE USING (auth.uid()::text = id);
```

### Projects Table
```sql
-- Projects are viewable by owner
CREATE POLICY "Projects are viewable by owner" 
ON projects FOR SELECT USING (auth.uid()::text = owner_id);

-- Users can create projects
CREATE POLICY "Users can create projects" 
ON projects FOR INSERT WITH CHECK (auth.uid()::text = owner_id);

-- Users can update own projects
CREATE POLICY "Users can update own projects" 
ON projects FOR UPDATE USING (auth.uid()::text = owner_id);

-- Users can delete own projects
CREATE POLICY "Users can delete own projects" 
ON projects FOR DELETE USING (auth.uid()::text = owner_id);
```

### Tasks Table
```sql
-- Tasks are viewable by project owner and assignee
CREATE POLICY "Tasks are viewable by project owner and assignee" 
ON tasks FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE id = project_id AND owner_id = auth.uid()::text)
  OR assignee_id = auth.uid()::text
);
```

## Migrations

To run migrations:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Create and apply migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio
```

## Performance Considerations

1. **Indexes**: All foreign keys and frequently filtered fields are indexed
2. **Cascading Deletes**: Prevents orphaned records
3. **Connection Pooling**: Supabase handles connection pooling automatically
4. **Query Optimization**: Use Prisma's `include` for eager loading

## Backup Strategy

Supabase provides:
- Daily automated backups
- Point-in-time recovery
- Export to SQL/JSON

Access backups via Supabase Dashboard > Database > Backups.
