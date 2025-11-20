# Docker Development Environment Setup

## Problem

Volume mount `./backend:/app` in `docker-compose.yml` was overwriting the Docker image's built venv at runtime, causing `ModuleNotFoundError` for packages installed during build (e.g., `paho-mqtt`).

## Solution

Use `docker-compose.override.yml` with a **named volume** for venv persistence.

### Configuration

**docker-compose.yml** (production):
```yaml
backend:
  volumes:
    - ./backend:/app
    - /app/.venv
```

**docker-compose.override.yml** (development only):
```yaml
backend:
  volumes:
    - ./backend:/app
    - backend-venv:/app/.venv  # Named volume preserves built venv

volumes:
  backend-venv:
```

## How It Works

- **Development**: `docker-compose up` automatically uses override
  - Code changes sync via `./backend:/app` (hot reload)
  - Dependencies persist in named volume `backend-venv`
  
- **Production**: Override file is ignored
  - Uses Docker image's built-in code and venv
  - No volume mounts

## Adding Dependencies

1. Add to `backend/pyproject.toml`
2. Regenerate lock: `cd backend && uv lock`
3. Rebuild: `docker-compose build backend`
4. Named volume preserves the new venv across restarts

## Key Learnings

- Docker volume mounts override image contents at runtime
- Anonymous volumes (`/app/.venv`) don't preserve build-time contents
- Named volumes persist across container lifecycle
- Use `docker-compose.override.yml` for dev/prod separation
- `uv` package manager doesn't include `pip` in venvs by default
