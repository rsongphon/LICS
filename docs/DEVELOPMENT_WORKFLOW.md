# LICS Development Workflow

This document describes the recommended workflow for developing and testing the LICS application, optimizing for both development speed (hot-reload) and production accuracy (Docker containers).

---

## Overview

The LICS application consists of:
- **Backend**: FastAPI application
- **Frontend**: React + Vite application
- **Services**: PostgreSQL, MQTT (Mosquitto), Mailcatcher, Adminer

For optimal development experience, we recommend running the **backend services in Docker** while running the **frontend locally** with Vite's hot-reload feature.

---

## Development Mode (Recommended)

### With Hot-Reload for Fast Development

This mode provides instant feedback when you make changes to the frontend code.

**1. Start backend services in Docker:**
```bash
docker-compose up -d backend db mqtt mailcatcher adminer
```

**2. Run frontend locally with hot-reload:**
```bash
cd frontend
npm run dev
```

**Access the application:**
- Frontend: `http://localhost:5173` (with hot module replacement)
- Backend API: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Mailcatcher UI: `http://localhost:1080`
- Adminer (DB): `http://localhost:8080`

**Benefits:**
- ✅ **Instant updates**: Changes to frontend code reload automatically
- ✅ **Fast iteration**: No rebuild or restart needed
- ✅ **Better debugging**: Source maps and React DevTools work optimally
- ✅ **Resource efficient**: Only rebuilds what changed

**Making changes:**
1. Edit any file in `frontend/src/`
2. Save the file
3. Browser automatically reloads with your changes

---

## Testing/Production Mode

### With Docker Containers

This mode simulates the production environment and should be used to verify changes before deployment.

**When to use:**
- Testing the full application in a production-like environment
- Verifying Docker builds work correctly
- Running E2E tests
- Before committing/deploying changes

**Steps:**

**1. Stop the local dev server** (if running):
Press `Ctrl+C` in the terminal running `npm run dev`

**2. Build the frontend Docker image:**
```bash
docker-compose build frontend
```

**3. Start all services:**
```bash
docker-compose up -d
```

**Access the application:**
- Frontend: `http://localhost:5173` (served from Docker container)
- Backend API: `http://localhost:8000`
- All other services remain the same

**Benefits:**
- ✅ **Production accuracy**: Tests the exact build that will be deployed
- ✅ **Consistency**: Same environment across all developers
- ✅ **Isolation**: All dependencies containerized

---

## Quick Command Reference

### Development (Hot-Reload)
```bash
# Start backend services
docker-compose up -d backend db mqtt mailcatcher adminer

# Start frontend dev server
cd frontend
npm run dev
```

### Testing (Docker)
```bash
# Build frontend
docker-compose build frontend

# Start all services
docker-compose up -d
```

### Full Reset
```bash
# Stop all services
docker-compose down

# Rebuild frontend
docker-compose build frontend

# Start everything fresh
docker-compose up -d
```

### Check Running Services
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## Troubleshooting

### Frontend changes not reflecting in browser

**If using local dev server (`npm run dev`):**
- Vite should auto-reload. Check the terminal for errors.
- Try hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

**If using Docker (`docker-compose up`):**
- You must rebuild: `docker-compose build frontend && docker-compose up -d frontend`
- Docker serves a static build, not a live dev server

### Port already in use

```bash
# Check what's using port 5173
lsof -i :5173

# Stop the process or change the port in vite.config.ts
```

### Backend not connecting

```bash
# Verify backend is running
docker-compose ps

# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Database issues

```bash
# Restart database
docker-compose restart db

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
```

---

## Running Tests

### E2E Tests (Playwright)

E2E tests require both frontend and backend to be running.

**Using Docker (recommended for E2E):**
```bash
# Make sure all services are running
docker-compose up -d

# Run tests
cd frontend
npx playwright test
```

**Using local dev server:**
```bash
# Start backend services
docker-compose up -d backend db mqtt mailcatcher adminer

# Start frontend dev server
cd frontend
npm run dev

# In another terminal, run tests
cd frontend
npx playwright test
```

### Backend Unit Tests

```bash
# Run backend tests in Docker
docker-compose exec backend pytest

# Or run specific test file
docker-compose exec backend pytest app/tests/api/routes/test_experiments.py
```

---

## Best Practices

1. **Use hot-reload during development** - Much faster feedback loop
2. **Test in Docker before committing** - Ensures production build works
3. **Commit often** - Small, focused commits are easier to review and debug
4. **Run E2E tests** - Verify critical paths before pushing
5. **Check Docker logs** - When something doesn't work, check logs first
6. **Clean Docker resources** - Periodically run `docker system prune` to free space

---

## Development Environment Setup

If you're setting up for the first time, see:
- [README.md](../README.md) - Initial setup instructions
- [docker_development_setup.md](./docker_development_setup.md) - Docker-specific setup
- [MANUAL_TESTING_GUIDE.md](./MANUAL_TESTING_GUIDE.md) - Manual testing procedures

---

## Summary

**For day-to-day development:**
```bash
docker-compose up -d backend db mqtt mailcatcher adminer
cd frontend && npm run dev
```

**Before committing changes:**
```bash
docker-compose build frontend
docker-compose up -d
# Test the application
# Run E2E tests
```

This workflow gives you the **best of both worlds**: fast development with hot-reload, and accurate testing in a containerized environment! 🚀
