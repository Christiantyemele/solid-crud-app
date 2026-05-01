import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')

    let query = supabase.from('tasks').select(
      `
        *,
        project:projects (*),
        assignee:users (*),
        comments (count)
      `
    )

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: tasks, error } = await query.order('created_at', {
      ascending: false,
    })

    if (error) throw error

    return NextResponse.json({ tasks })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, status, priority, dueDate, projectId, assigneeId } =
      body

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        due_date: dueDate,
        project_id: projectId,
        assignee_id: assigneeId,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ task })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
