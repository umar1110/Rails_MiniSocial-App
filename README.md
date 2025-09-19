# Rails Test Project

A Rails application with real-time commenting using ActionCable and Redis.

## Features

- User authentication with Devise
- Community creation and management
- Posts with images and text
- Real-time commenting with ActionCable
- Like functionality
- Modern UI with Tailwind CSS

## Docker Setup

### Development Environment

1. **Start Redis and PostgreSQL with Docker Compose:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Run the Rails application:**
   ```bash
   ./bin/rails server
   ```

### Production Environment

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

2. **Access the application at:** `http://localhost:3000`

## Environment Variables

Create a `.env` file with the following variables:

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/rails_test_project_development

# Redis for ActionCable
REDIS_URL=redis://localhost:6379/1

# Rails
RAILS_ENV=development
RAILS_MASTER_KEY=your_master_key_here
```

## Real-time Features

The application uses ActionCable with Redis for real-time features:

- **Comments**: New comments appear instantly on all connected browsers
- **Redis**: Required for ActionCable WebSocket connections
- **Docker**: Redis runs in a separate container for scalability

## Deployment with Kamal

The application is configured for deployment with Kamal:

1. **Configure secrets** in `.kamal/secrets`
2. **Update server IPs** in `config/deploy.yml`
3. **Deploy:**
   ```bash
   kamal deploy
   ```

## System Dependencies

* Ruby 3.3.4
* PostgreSQL
* Redis
* Docker (optional)
