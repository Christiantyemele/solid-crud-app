import Link from 'next/link'
import { ArrowRight, CheckCircle, Database, Shield, Zap } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Solid CRUD</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Production-Ready CRUD Application
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            A complete, well-architected application with solid database schemas,
            clean UI, and Supabase backend. Built with best practices and type safety.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">
              View Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="https://github.com/the-agenticflow/solid-crud-app"
              className="btn-secondary text-lg px-8 py-3"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="card p-6">
            <Database className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Solid Schemas</h3>
            <p className="text-gray-600">
              Well-documented database schemas with proper relationships,
              constraints, and indexes for optimal performance.
            </p>
          </div>

          <div className="card p-6">
            <Shield className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Auth</h3>
            <p className="text-gray-600">
              Built-in authentication with Supabase Auth, row-level security,
              and proper access control.
            </p>
          </div>

          <div className="card p-6">
            <Zap className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time</h3>
            <p className="text-gray-600">
              Live updates with Supabase Realtime. See changes instantly
              across all connected clients.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              'Full CRUD operations for all entities',
              'TypeScript for end-to-end type safety',
              'Responsive mobile-first design',
              'Prisma ORM with migrations',
              'API route handlers',
              'Real-time subscriptions',
              'Row-level security',
              'Clean component architecture',
            ].map((feature) => (
              <div key={feature} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
