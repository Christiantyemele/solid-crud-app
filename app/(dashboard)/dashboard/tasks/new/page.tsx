'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Input, Select, Textarea, Card, CardContent, CardHeader } from '@/components/ui'

export default function NewTaskPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title'),
      description: formData.get('description') || null,
      status: formData.get('status'),
      priority: formData.get('priority'),
      dueDate: formData.get('dueDate') || null,
      projectId: projectId || formData.get('projectId'),
      assigneeId: formData.get('assigneeId') || null,
    }

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Failed to create task')

      const { task } = await res.json()
      router.push(`/dashboard/tasks/${task.id}`)
    } catch (err) {
      setError('Failed to create task. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-gray-600 mt-1">
            Add a new task to track your work
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Task Title"
              name="title"
              placeholder="Enter task title"
              required
            />

            <Textarea
              label="Description"
              name="description"
              placeholder="Enter task description"
              rows={4}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Status"
                name="status"
                options={[
                  { value: 'TODO', label: 'To Do' },
                  { value: 'IN_PROGRESS', label: 'In Progress' },
                  { value: 'REVIEW', label: 'Review' },
                  { value: 'DONE', label: 'Done' },
                  { value: 'CANCELLED', label: 'Cancelled' },
                ]}
              />

              <Select
                label="Priority"
                name="priority"
                options={[
                  { value: 'LOW', label: 'Low' },
                  { value: 'MEDIUM', label: 'Medium' },
                  { value: 'HIGH', label: 'High' },
                  { value: 'URGENT', label: 'Urgent' },
                ]}
              />
            </div>

            <Input
              label="Due Date"
              name="dueDate"
              type="datetime-local"
            />

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}