import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, Badge, Button } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, CheckCircle, Folder } from 'lucide-react'

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerSupabaseClient()

  const { data: project } = await supabase
    .from('projects')
    .select(
      `
      *,
      tasks (
        *,
        assignee:users (*)
      ),
      owner:users (*)
    `
    )
    .eq('id', params.id)
    .single()

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Project not found</h1>
      </div>
    )
  }

  const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    PLANNING: 'info',
    ACTIVE: 'success',
    ON_HOLD: 'warning',
    COMPLETED: 'default',
    ARCHIVED: 'default',
  }

  const taskStatusColors: Record<string, string> = {
    TODO: 'bg-gray-100 text-gray-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    REVIEW: 'bg-yellow-100 text-yellow-700',
    DONE: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">
              Created {formatDate(project.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={statusColors[project.status] || 'default'}>
            {project.status}
          </Badge>
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

      {project.description && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-700">{project.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {project.tasks?.length || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Tasks</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {project.tasks?.filter((t) => t.status === 'DONE').length || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Completed</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {project.tasks?.filter((t) => t.status === 'IN_PROGRESS').length || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">In Progress</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Tasks</h2>
            <Link href={`/dashboard/projects/${project.id}/tasks/new`}>
              <Button size="sm">
                Add Task
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {project.tasks && project.tasks.length > 0 ? (
            <div className="space-y-3">
              {project.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{task.title}</div>
                      {task.assignee && (
                        <div className="text-sm text-gray-500">
                          Assigned to {task.assignee.email}
                        </div>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${taskStatusColors[task.status]}`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No tasks yet. Add your first task to get started.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
