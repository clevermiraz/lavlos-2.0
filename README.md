# Lavlos 2.0

A visual workflow automation platform built with Next.js, allowing users to create, manage, and execute automated workflows through an intuitive drag-and-drop interface.

## 🚀 Features

- **Visual Workflow Editor**: Create workflows using a drag-and-drop interface powered by React Flow
- **Multiple Node Types**: Support for Manual Triggers, HTTP Requests, Google Form Triggers, and more
- **Workflow Execution**: Execute workflows with real-time status tracking
- **User Authentication**: Secure authentication system using Better Auth
- **Background Jobs**: Workflow execution powered by Inngest
- **Modern UI**: Beautiful interface built with Tailwind CSS and shadcn/ui components

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or remote)
- **Git**

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd lavlos-2.0
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` and configure the following variables:

#### Required Variables

```env
# Database connection string
DATABASE_URL="postgresql://user:password@localhost:5432/lavlos?schema=public"

# Better Auth secret (generate a random string)
BETTER_AUTH_SECRET="your-random-secret-key-here"

# Better Auth URL (usually your local development URL)
BETTER_AUTH_URL="http://localhost:3000"

# Public app URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### Optional Variables

```env
# LLM Provider API Keys (for AI features)
GOOGLE_GENERATIVE_AI_API_KEY=""
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""

# Sentry (for error tracking)
SENTRY_AUTH_TOKEN=""

# Polar (for payments/subscriptions)
POLAR_ACCESS_TOKEN=""
POLAR_SUCCESS_URL="http://localhost:3000"
```

**Note**: Generate a secure `BETTER_AUTH_SECRET` by running:

```bash
openssl rand -base64 32
```

### 4. Set Up the Database

Run Prisma migrations to set up your database schema:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

(Optional) Open Prisma Studio to view your database:

```bash
npx prisma studio
```

### 5. Start the Development Server

#### Option 1: Run Everything (Recommended)

This will start Next.js, Inngest dev server, and ngrok (if configured):

```bash
npm run dev:all
```

#### Option 2: Run Services Individually

Start Next.js development server:

```bash
npm run dev
```

In a separate terminal, start Inngest dev server (required for workflow execution):

```bash
npm run inngest:dev
```

### 6. Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

The app will redirect you to `/workflows` where you can start creating workflows.

## 📜 Available Scripts

- `npm run dev` - Start Next.js development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run Biome linter to check for code issues
- `npm run format` - Format code using Biome
- `npm run inngest:dev` - Start Inngest development server
- `npm run dev:all` - Start all development services (Next.js, Inngest, ngrok)

## 🏗️ Project Structure

```
lavlos-2.0/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (auth)/       # Authentication pages
│   │   ├── (dashboard)/  # Dashboard pages
│   │   └── api/          # API routes
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   └── react-flow/  # React Flow components
│   ├── features/        # Feature-based modules
│   │   ├── auth/        # Authentication feature
│   │   ├── editor/      # Workflow editor feature
│   │   ├── workflows/   # Workflow management
│   │   └── triggers/    # Trigger nodes
│   ├── lib/             # Utility libraries
│   │   ├── auth.ts     # Auth configuration
│   │   └── db.ts       # Database client
│   └── trpc/            # tRPC setup
├── prisma/              # Prisma schema and migrations
├── public/              # Static assets
└── .env.example         # Environment variables template
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth
- **API**: tRPC
- **UI**: Tailwind CSS + shadcn/ui
- **Workflow Engine**: Inngest
- **Visual Editor**: React Flow (@xyflow/react)
- **State Management**: Jotai
- **Form Handling**: React Hook Form + Zod
- **Code Quality**: Biome
- **Error Tracking**: Sentry (optional)

## 🔧 Development Tips

### Database Management

- View database: `npx prisma studio`
- Create migration: `npx prisma migrate dev --name migration-name`
- Reset database: `npx prisma migrate reset`

### Code Formatting

The project uses Biome for formatting and linting. Format your code before committing:

```bash
npm run format
```

### Adding New Node Types

1. Create node component in `src/features/editor/components/`
2. Add executor in `src/features/executions/`
3. Register in `src/features/editor/lib/executor-registry.ts`
4. Update Prisma schema if needed

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Verify `DATABASE_URL` in `.env` is correct
- Check database credentials and permissions

### Port Already in Use

If port 3000 is already in use, you can change it:

```bash
PORT=3001 npm run dev
```

### Inngest Not Working

- Ensure Inngest dev server is running: `npm run inngest:dev`
- Check that Inngest functions are properly registered
- Verify Inngest configuration in `src/inngest/`

### Prisma Client Not Generated

If you see Prisma-related errors, regenerate the client:

```bash
npx prisma generate
```

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

If you'd like to contribute:

1. Fork the repository
2. Create a new branch (`feature/your-feature-name`)
3. Commit your changes with clear messages
4. Open a Pull Request

Please ensure your code follows the existing style and includes relevant documentation or tests where applicable.

## 📧 Support

If you have questions, suggestions, or issues:

- Open an issue on GitHub
- Or contact: **mirazhs@proton.me**

For business or enterprise inquiries, please contact via email.
