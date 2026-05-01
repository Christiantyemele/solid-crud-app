'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Select, Textarea, Card, CardContent, CardHeader } from '@/components/ui'

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      description: formData.get('description') || null,
      status: formData.get('status'),
      startDate: formData.get('startDate') || null,
      endDate: formData.get('endDate') || null,
    }

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Failed to create project')

      const { project } = await res.json()
      router.push(`/dashboard/projects/${project.id}`)
    } catch (err) {
      setError('Failed to create project. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-600 mt-1">
            Create a new project to organize your tasks
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
              label="Project Name"
              name="name"
              placeholder="Enter project name"
              required
            />

            <Textarea
              label="Description"
              name="description"
              placeholder="Enter project description"
              rows={4}
            />

            <Select
              label="Status"
              name="status"
              options={[
                { value: 'PLANNING', label: 'Planning' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'ON_HOLD', label: 'On Hold' },
              ]}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                name="startDate"
                type="datetime-local"
              />
              <Input
                label="End Date"
                name="endDate"
                type="datetime-local"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
