'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Input, Card, CardContent, CardHeader } from '@/components/ui'
import { supabase } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/login?registered=true')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gray-900">Solid CRUD</h1>
          </Link>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">Sign Up</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Full Name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
              />

              <Input
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                required
                minLength={8}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 hover:text-primary-700">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}