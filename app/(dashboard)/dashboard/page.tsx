import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader } from '@/components/ui'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from('projects')
    .select('*, tasks(count)')
    .eq('owner_id', user!.id)
    .limit(5)

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, project:projects(name)')
    .eq('assignee_id', user!.id)
    .limit(5)

  const { count: totalProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user!.id)

  const { count: totalTasks } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('assignee_id', user!.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's an overview of your projects and tasks.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">
                {totalProjects || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Projects</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">
                {totalTasks || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Assigned Tasks</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">
                {tasks?.filter((t) => t.status === 'DONE').length || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Completed</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Recent Projects</h2>
              <Link
                href="/dashboard/projects"
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {projects && projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-gray-500">
                        {formatDateTime(project.created_at)}
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                      {project.tasks?.[0]?.count || 0} tasks
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No projects yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Your Tasks</h2>
              <Link
                href="/dashboard/tasks"
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {tasks && tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-500">
                        {task.project?.name || 'No project'}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        task.status === 'DONE'
                          ? 'bg-green-100 text-green-700'
                          : task.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No tasks assigned</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
