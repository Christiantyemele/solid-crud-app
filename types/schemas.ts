import { z } from 'zod'

export const projectStatusSchema = z.enum([
  'PLANNING',
  'ACTIVE',
  'ON_HOLD',
  'COMPLETED',
  'ARCHIVED',
])

export const taskStatusSchema = z.enum([
  'TODO',
  'IN_PROGRESS',
  'REVIEW',
  'DONE',
  'CANCELLED',
])

export const taskPrioritySchema = z.enum([
  'LOW',
  'MEDIUM',
  'HIGH',
  'URGENT',
])

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(1000).optional(),
  status: projectStatusSchema.optional(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
})

export const updateProjectSchema = createProjectSchema.partial()

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  dueDate: z.string().datetime().optional().nullable(),
  projectId: z.string().min(1, 'Project is required'),
  assigneeId: z.string().optional().nullable(),
})

export const updateTaskSchema = createTaskSchema.partial().omit({ projectId: true })

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(5000),
  projectId: z.string().optional().nullable(),
  taskId: z.string().optional().nullable(),
  parentCommentId: z.string().optional().nullable(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
