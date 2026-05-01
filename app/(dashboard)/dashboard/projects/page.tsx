import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, Badge, Button } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Plus, Folder } from 'lucide-react'

export default async function ProjectsPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from('projects')
    .select('*, tasks(count)')
    .eq('owner_id', user!.id)
    .order('created_at', { ascending: false })

  const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    PLANNING: 'info',
    ACTIVE: 'success',
    ON_HOLD: 'warning',
    COMPLETED: 'default',
    ARCHIVED: 'default',
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your projects and tasks</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <Card hover className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                        <Folder className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-500">
                          {project.tasks?.[0]?.count || 0} tasks
                        </p>
                      </div>
                    </div>
                    <Badge variant={statusColors[project.status] || 'default'}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {project.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Created {formatDate(project.created_at)}</span>
                    {project.end_date && (
                      <span>Due {formatDate(project.end_date)}</span>
                    )}
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
              <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No projects yet
              </h3>
              <p className="text-gray-600 mb-4">
                Get started by creating your first project
              </p>
              <Link href="/dashboard/projects/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
