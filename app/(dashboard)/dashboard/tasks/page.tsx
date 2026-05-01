import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, Badge, Button } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default async function TasksPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: tasks } = await supabase
    .from('tasks')
    .select(
      `
      *,
      project:projects (name),
      assignee:users (email)
    `
    )
    .eq('assignee_id', user!.id)
    .order('created_at', { ascending: false })

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

  const statusIcons: Record<string, React.ReactNode> = {
    TODO: <Clock className="h-4 w-4" />,
    IN_PROGRESS: <AlertCircle className="h-4 w-4" />,
    DONE: <CheckCircle className="h-4 w-4" />,
    REVIEW: <CheckCircle className="h-4 w-4" />,
    CANCELLED: <CheckCircle className="h-4 w-4" />,
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">View and manage your assigned tasks</p>
        </div>
        <Link href="/dashboard/tasks/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </Link>
      </div>

      {tasks && tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Link key={task.id} href={`/dashboard/tasks/${task.id}`}>
              <Card hover>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <div className={`mt-1 ${statusColors[task.status]}`}>
                        {statusIcons[task.status]}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        {task.project && (
                          <p className="text-sm text-gray-500 mt-1">
                            {task.project.name}
                          </p>
                        )}
                        {task.due_date && (
                          <p className="text-xs text-gray-400 mt-2">
                            Due {formatDate(task.due_date)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={priorityColors[task.priority] || 'default'}>
                        {task.priority}
                      </Badge>
                      <span className={`px-2 py-1 rounded text-xs ${statusColors[task.status]}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tasks assigned
              </h3>
              <p className="text-gray-600 mb-4">
                Tasks assigned to you will appear here
              </p>
              <Link href="/dashboard/tasks/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}