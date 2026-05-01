import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, Badge, Button } from '@/components/ui'
import { formatDate, formatDateTime } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, MessageSquare } from 'lucide-react'

export default async function TaskDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerSupabaseClient()

  const { data: task } = await supabase
    .from('tasks')
    .select(
      `
      *,
      project:projects (*),
      assignee:users (*),
      comments (
        *,
        author:users (*),
        replies (*, author:users (*))
      )
    `
    )
    .eq('id', params.id)
    .single()

  if (!task) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Task not found</h1>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    TODO: 'bg-gray-100 text-gray-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    REVIEW: 'bg-yellow-100 text-yellow-700',
    DONE: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  const priorityColors: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
    LOW: 'default',
    MEDIUM: 'info',
    HIGH: 'warning',
    URGENT: 'danger',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/tasks">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
            <p className="text-gray-600 mt-1">
              Created {formatDateTime(task.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={priorityColors[task.priority] || 'default'}>
            {task.priority}
          </Badge>
          <span className={`px-3 py-1 rounded text-sm ${statusColors[task.status]}`}>
            {task.status}
          </span>
          <Button variant="secondary" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="danger" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Project</div>
            <Link
              href={`/dashboard/projects/${task.project_id}`}
              className="text-lg font-medium text-primary-600 hover:text-primary-700"
            >
              {task.project?.name || 'No project'}
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Assigned To</div>
            <div className="text-lg font-medium text-gray-900">
              {task.assignee?.email || 'Unassigned'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Due Date</div>
            <div className="text-lg font-medium text-gray-900">
              {task.due_date ? formatDate(task.due_date) : 'No due date'}
            </div>
          </CardContent>
        </Card>
      </div>

      {task.description && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Description</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Comments</h2>
            <Button size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {task.comments && task.comments.length > 0 ? (
            <div className="space-y-4">
              {task.comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-medium text-sm">
                        {comment.author?.email?.[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{comment.author?.email}</span>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Start the discussion.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}