export type { User, Project, Task, Comment, ActivityLog } from '@prisma/client'

export type ProjectWithTasks = Project & {
  tasks: Task[]
  owner: User
}

export type TaskWithAssignee = Task & {
  assignee: User | null
  project: Project
  comments: Comment[]
}

export type CommentWithAuthor = Comment & {
  author: User
  replies?: CommentWithAuthor[]
}
