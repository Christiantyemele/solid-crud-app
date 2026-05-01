# Solid CRUD Application

A complete, production-ready CRUD application built with modern technologies and best practices.

## 🚀 Features

- **Full CRUD Operations**: Create, Read, Update, Delete for all entities
- **Authentication**: Secure user authentication with Supabase Auth
- **Real-time Updates**: Live data synchronization with Supabase Realtime
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Mobile-first, clean UI with Tailwind CSS
- **Well-Documented Schemas**: Comprehensive database documentation

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| ORM | Prisma |

## 📁 Project Structure

```
solid-crud-app/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API route handlers
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── features/         # Feature-specific components
├── lib/                   # Utilities and configurations
│   ├── supabase/         # Supabase client and helpers
│   └── utils/            # Utility functions
├── types/                 # TypeScript type definitions
├── prisma/               # Database schema and migrations
│   └── migrations/       # SQL migration files
└── docs/                 # Documentation
    └── database/         # Database schema documentation
```

## 🗄️ Database Schema

See [Database Documentation](./docs/database/README.md) for detailed schema documentation.

### Core Entities

- **Users**: User accounts and profiles
- **Projects**: Project management entities
- **Tasks**: Task management with assignments
- **Comments**: Task and project discussions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/the-agenticflow/solid-crud-app.git
cd solid-crud-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your Supabase credentials in `.env.local`

5. Run the development server:
```bash
npm run dev
```

## 📚 Documentation

- [Database Schema](./docs/database/README.md)
- [API Reference](./docs/api/README.md)
- [Components](./docs/components/README.md)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
