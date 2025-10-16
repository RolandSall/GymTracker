# Gym Tracker Backend

A NestJS backend application following Domain-Driven Design (DDD) principles with clean architecture.

## Quick Start

```bash
# Navigate to project root
cd gym-tracker/

# Install dependencies
npm install

# Start PostgreSQL database
npm run docker:up

# Apply database schema
npm run db:push

# Start the backend (in a new terminal)
npm run backend:dev

# Test the API (http://localhost:3000/api/health)
```

> **⚠️ Important:** All npm commands must be run from the **project root** (`gym-tracker/`), not from `apps/backend/`.

## Table of Contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Database Management](#database-management)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)

## Architecture

This backend follows a clean DDD architecture with the following layers:

- **Domain Layer**: Core business logic and entities
- **Application Layer**: Use cases, commands, and handlers
- **Infrastructure Layer**: Database, persistence, and external services
- **Presentation Layer**: Controllers and API endpoints

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for PostgreSQL)
- PostgreSQL 16 (if running locally without Docker)

## Getting Started

> **Important:** All commands in this guide should be run from the **project root directory** (`gym-tracker/`), not from the backend directory.

### 1. Install Dependencies

From the project root:

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the project root with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gym_tracker

# Application Configuration
PORT=3000
NODE_ENV=development
```

### 3. Start PostgreSQL Database

#### Using Docker Compose (Recommended)

Start the PostgreSQL container:

```bash
npm run docker:up
```

This will:
- Start PostgreSQL on `localhost:5432`
- Create a database named `gym_tracker`
- Set up health checks
- Persist data in a Docker volume

To stop the database:

```bash
npm run docker:down
```

#### Using Docker Compose (Database Only)

If you only want to run PostgreSQL without the backend container:

```bash
docker-compose up postgres -d
```

#### Verify Database Connection

Check if PostgreSQL is running:

```bash
docker ps
```

You should see `gym-tracker-postgres` in the list.

## Database Management

> **Note:** Run all database commands from the **project root directory** (`gym-tracker/`).

### Generate Database Migrations

After making changes to your database schemas (in `src/infrastructure/persistence/`):

```bash
npm run db:generate
```

This will:
- Read your schema from `src/infrastructure/persistence/index.ts`
- Generate migration files in `apps/backend/resources/migrations/`

### Apply Migrations to Database

Push the schema changes to your database:

```bash
npm run db:push
```

This will apply all pending migrations to the database.

### Database Studio (GUI)

Launch Drizzle Studio to interact with your database:

```bash
npm run db:studio
```

This will open a web interface at `https://local.drizzle.studio`

### Seed Database (Optional)

To seed the database with initial data:

```bash
npm run db:seed
```

## Running the Application

### Development Mode

Start the backend in development mode with hot-reload:

```bash
npm run backend:dev
```

The application will be available at: **http://localhost:3000/api**

### Production Mode

Build and run in production:

```bash
# Build the application
npx nx build backend

# Run the built application
node dist/apps/backend/main.js
```

### Using Docker Compose (Full Stack)

Run both PostgreSQL and the backend:

```bash
npm run docker:up
```

## API Documentation


```

## Development Workflow

### 1. Create a New Feature

1. **Define the domain entity** in `src/domain/entities/`
2. **Create the database schema** in `src/infrastructure/persistence/[entity]/`
3. **Export the schema** in `src/infrastructure/persistence/index.ts`
4. **Generate migrations**: `npm run db:generate`
5. **Apply migrations**: `npm run db:push`
6. **Create application layer** (commands, handlers, ports) in `src/application/`
7. **Create persistence adapter** in `src/infrastructure/persistence/[entity]/`
8. **Create presentation layer** (controller, DTOs) in `src/presentation/`
9. **Register in app.module.ts**

### 2. Database Schema Changes

1. Update the entity schema in `src/infrastructure/persistence/[entity]/[entity].entity.ts`
2. Generate migration: `npm run db:generate`
3. Review the generated migration in `resources/migrations/`
4. Apply migration: `npm run db:push`

### 3. Testing

Use the HTTP request files in `/use-cases/` to test your endpoints.

## Troubleshooting

### Database Connection Issues

If you can't connect to the database:

1. Check if PostgreSQL is running:
   ```bash
   docker ps
   ```

2. Check database logs:
   ```bash
   docker logs gym-tracker-postgres
   ```

3. Verify your `.env` file has the correct `DATABASE_URL`

### Port Already in Use

If port 3000 or 5432 is already in use:

1. Stop other services using these ports
2. Or change the port in your `.env` file and `docker-compose.yml`

### Migration Issues

If migrations fail:

1. Check the schema syntax in your entity files
2. Review the generated migration in `resources/migrations/`
3. Drop the database and recreate (development only):
   ```bash
   docker-compose down -v
   docker-compose up postgres -d
   npm run db:push
   ```

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run backend:dev` | Start backend in development mode |
| `npm run docker:up` | Start all services with Docker Compose |
| `npm run docker:down` | Stop all Docker services |
| `npm run db:generate` | Generate database migrations |
| `npm run db:push` | Apply migrations to database |
| `npm run db:studio` | Open Drizzle Studio GUI |
| `npm run db:seed` | Seed database with initial data |

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

## License

MIT
