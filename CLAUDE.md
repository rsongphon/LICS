# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LICS (Lab Instrument Control System)** is a web-based laboratory automation platform for behavioral research with non-human primates. The system provides researchers with a web-based PsychoPy experiment builder and manages multiple Raspberry Pi devices running behavioral tasks in research cages.

**Core Architecture:** Three-tier system with React/Next.js frontend, FastAPI backend, PostgreSQL database, and Raspberry Pi edge devices communicating via MQTT.

**Design Philosophy:** Simplicity first. This is a monolithic application prioritizing maintainability over scalability. The system should be operable by a graduate student with basic technical skills.

## Technology Stack

**Backend:**
- FastAPI (Python 3.11+)
- SQLAlchemy 2.0 with async support
- Alembic for database migrations
- Pydantic for validation and settings
- Jinja2 for Python code generation (PsychoPy scripts)
- MQTT client (Mosquitto) for device communication

**Frontend:**
- Next.js 14 with TypeScript
- TanStack Query for data fetching/caching
- Zustand for client state management
- Tailwind CSS for styling
- React Flow for PsychoPy experiment timeline visualization
- Monaco Editor for code preview

**Database:**
- PostgreSQL 15 (primary database)
- SQLite (local cache on edge devices only)

**Development:**
- Docker & Docker Compose for local development
- Pytest for backend testing
- Black/Ruff for code formatting and linting

## Project Structure

```
lics/
├── backend/          # FastAPI application
│   ├── app/
│   │   ├── api/routes/      # API endpoints (auth, users, experiments, devices, results, websocket)
│   │   ├── core/            # Config, security, MQTT
│   │   ├── crud/            # Database CRUD operations
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── psychopy/        # PsychoPy builder, compiler, GPIO bridge
│   │   └── tasks/           # Background tasks (deployment, data sync)
│   ├── tests/
│   └── alembic/            # Database migrations
├── frontend/        # Next.js application
│   └── src/
│       ├── app/
│       │   ├── (dashboard)/ # Protected routes (experiments, devices, results)
│       │   └── builder/     # PsychoPy builder UI
│       ├── components/
│       │   ├── psychopy/    # PsychoPy-specific components
│       │   └── ui/          # General UI components
│       └── lib/
├── edge/            # Raspberry Pi agent code
│   ├── agent.py            # Main agent orchestrating all edge device operations
│   ├── executor.py         # PsychoPy experiment execution
│   └── hardware.py         # GPIO hardware control
├── docs/            # Documentation
│   ├── LICS_Simplified_Documentation.md  # Master architecture document
│   └── implemenation_plan/  # Phased implementation plans (Phase 1-5)
└── docker-compose.yml
```

## Development Commands

### Local Development Setup

```bash
# Start all services (backend, frontend, database, MQTT broker)
docker-compose up

# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### Backend Development

```bash
# Navigate to backend directory
cd backend

# Run tests
pytest

# Run tests with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/api/test_experiments.py

# Run specific test
pytest tests/api/test_experiments.py::test_create_experiment

# Format code
black app/
ruff check app/ --fix

# Run database migrations
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "description"

# Rollback migration
alembic downgrade -1
```

### Frontend Development

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run linting with auto-fix
npm run lint:fix

# Build for production
npm run build

# Run production build locally
npm run start
```

### Edge Device Development

```bash
# Navigate to edge directory
cd edge

# Install dependencies (on Raspberry Pi)
pip install -r requirements.txt

# Run agent in development mode
python agent.py --dev

# Run agent with mock hardware
python agent.py --mock-gpio
```

## Core Architecture Concepts

### Database Schema (Core Tables)

**users** - User authentication and management (from FastAPI template)
- Standard fields: id, email, hashed_password, full_name, is_active, is_superuser

**experiments** - PsychoPy experiment definitions
- `psyexp_data` (JSONB): Complete experiment definition from React Flow builder
- `python_code` (TEXT): Generated Python script for edge device execution
- `psychojs_code` (TEXT): Generated JavaScript for web preview
- Links to `users.id` via `created_by`

**devices** - Raspberry Pi edge devices
- `device_id`: Unique hardware identifier
- `status`: Enum (online, offline, running)
- `config` (JSONB): Device configuration
- `capabilities` (JSONB): Hardware capabilities (GPIO pins, sensors, etc.)
- `last_seen`: Heartbeat timestamp

**experiment_deployments** - Tracks experiment execution on devices
- Links experiments to devices
- Tracks deployment status and timing

**trial_results** - Individual trial data from experiments
- `response` (JSONB): Response data
- `custom_data` (JSONB): Additional trial data
- Links to `experiment_deployments.id`

### Communication Architecture

**MQTT Topics:**
```
devices/{device_id}/command    # Commands to device
devices/{device_id}/status     # Status updates from device
devices/{device_id}/data       # Trial data from device
devices/{device_id}/logs       # Log messages from device
experiments/{exp_id}/deploy    # Deployment notifications
```

**WebSockets:**
- Real-time UI updates for device status changes
- Experiment progress updates
- Trial results streaming
- System notifications

### PsychoPy Integration

**Builder → Execution Flow:**
1. User designs experiment visually in React Flow (frontend)
2. Builder state saved as JSON to `experiments.psyexp_data`
3. Backend compiler (`app/psychopy/compiler.py`) generates Python code using Jinja2 templates
4. Generated code stored in `experiments.python_code`
5. Deployment pushes Python code to edge device via MQTT
6. Raspberry Pi agent executes PsychoPy script
7. Trial data synced back via MQTT to `trial_results` table

**Core PsychoPy Components:**
- Stimuli: Text, Image, Sound, Movie
- Responses: Keyboard, Mouse, Button Box
- Flow: Loop, Condition, Code
- Custom: GPIO Output, GPIO Input, Feeder

### Edge Device Agent

**Responsibilities:**
- Register with backend on startup
- Send heartbeat every 30 seconds
- Listen for MQTT commands
- Execute PsychoPy experiments
- Cache data locally in SQLite during offline periods
- Sync results when connectivity returns

**Offline Capability:**
- Edge devices continue experiments during network outages
- Local SQLite cache stores unsent trial results
- Automatic synchronization when connectivity returns
- Retain local data for 7 days as backup

## Implementation Phases

The project follows a 5-phase implementation plan (detailed documentation in `docs/implemenation_plan/`):

**Phase 1: Foundation (Weeks 1-4)** - CRITICAL FOUNDATION
- Fork FastAPI template and configure environment
- Implement core models: Users, Experiments, Devices
- Setup authentication system
- CRUD APIs for experiments and devices
- Basic MQTT client connection
- Minimal Next.js frontend with login and dashboard shell
- **Completion Criteria:** Stack boots with `docker-compose up`, superuser can login, experiments/devices CRUD works

**Phase 2: PsychoPy Builder (Weeks 5-8)** - CORE VALUE PROPOSITION
- React Flow timeline for visual experiment design
- Component palette with drag-and-drop
- Properties panel for component configuration
- Backend compiler (`app/psychopy/compiler.py`) with Jinja2 templates
- Python code generation from builder state
- Monaco editor for code preview
- **Completion Criteria:** User can build simple experiment (text + keyboard), save, compile, and see Python code

**Phase 3: Edge Integration (Weeks 9-10)**
- Raspberry Pi agent development
- MQTT command handling
- Local SQLite storage for offline operation
- GPIO control library
- Hardware component mapping
- **Completion Criteria:** Experiment can be deployed to device and executed successfully

**Phase 4: Data & Deployment (Weeks 11-12)**
- Trial result collection API
- Data synchronization from edge devices
- Export functionality (CSV, Excel, JSON)
- Basic analytics and visualization
- Production deployment setup
- **Completion Criteria:** Complete end-to-end flow from design to data export

**Phase 5: Polish & Launch (Weeks 13-14)**
- Bug fixes and testing
- Performance optimization
- UI/UX improvements
- Documentation completion

## Architecture Decisions & Key Constraints

### Simplicity First

**What We Removed (deliberately):**
- Microservices → Single FastAPI backend
- Multiple databases → PostgreSQL only (JSONB for flexibility)
- Kubernetes → Docker Compose
- API Gateway → Simple Nginx proxy
- Event sourcing → Regular CRUD
- Elasticsearch → PostgreSQL full-text search
- Grafana/Prometheus → Basic health checks
- Message queues → Background tasks
- Complex RBAC → Simple JWT with 3 roles (Admin, Researcher, Viewer)

**Why:**
- System must be maintainable by a single graduate student
- Lab scale: < 50 devices
- Budget: < $100/month infrastructure costs
- Focus on functionality over scalability

### File Storage

**Use local filesystem, not S3/MinIO:**
```
/data/
├── experiments/{experiment_id}/
│   ├── experiment.psyexp
│   ├── generated_code.py
│   └── resources/
├── results/{experiment_id}/{date}/
│   └── trial_data.csv
└── uploads/temp/
```

### Testing Approach

**Practical Coverage Goals:**
- 60-70% backend coverage (not 100%)
- Test critical paths thoroughly
- Skip testing obvious CRUD operations
- Integration tests for API endpoints
- Component testing for React components
- Manual testing for PsychoPy Builder
- E2E tests for critical workflows only

### Authentication

**Simple JWT (from FastAPI template):**
- Access tokens: 24 hours validity (intentionally long for lab use)
- Refresh tokens: 30 days validity
- Three roles: Admin, Researcher, Viewer
- No need for OAuth2/SAML complexity

## Common Development Patterns

### Creating New API Endpoint

1. Define Pydantic schema in `backend/app/schemas/`
2. Add CRUD operations in `backend/app/crud/`
3. Create route in `backend/app/api/routes/`
4. Write tests in `backend/tests/api/`
5. Add migration if database changes needed

### Adding New PsychoPy Component

1. Define component schema in frontend (`src/components/psychopy/`)
2. Add to component palette in builder
3. Create property panel form
4. Update compiler in `backend/app/psychopy/compiler.py`
5. Add Jinja2 template for Python generation
6. Test compilation and edge execution

### Adding New Device Command

1. Define command in MQTT topics structure
2. Add handler in edge agent (`edge/agent.py`)
3. Update backend MQTT client (`backend/app/core/mqtt.py`)
4. Add API endpoint for command trigger
5. Update frontend device control panel

## Environment Variables

Key environment variables (see `.env.example`):

```bash
# Database
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_DB=lics
POSTGRES_USER=lics_user
POSTGRES_PASSWORD=secure_password

# MQTT
MQTT_BROKER=localhost
MQTT_PORT=1883
MQTT_USERNAME=lics_mqtt
MQTT_PASSWORD=mqtt_password

# Application
SECRET_KEY=your-secret-key
FIRST_SUPERUSER=admin@lab.local
FIRST_SUPERUSER_PASSWORD=admin_password

# Storage
UPLOAD_PATH=/data/uploads
MAX_UPLOAD_SIZE=100MB
```

## Critical Implementation Notes

### PsychoPy Code Generation

The compiler (`backend/app/psychopy/compiler.py`) must:
- Parse `psyexp_data` JSON from React Flow
- Validate component parameters
- Generate self-contained Python script using Jinja2
- Include GPIO extensions for hardware control
- Add data collection wrappers
- Include error handling and logging

### Edge Device Offline Resilience

Edge devices MUST:
- Continue running experiments during network outages
- Cache all trial data locally in SQLite
- Batch upload every 5 minutes when online
- Mark records as synced after confirmation
- Retain synced data for 7 days as backup

### Data Export Requirements

Research-grade data export must include:
- Trial-by-trial data with timestamps
- Experiment parameters and configuration
- Device information and conditions
- Summary statistics
- Support CSV, Excel, and JSON formats

## Documentation References

- **Master Architecture:** `docs/LICS_Simplified_Documentation.md` - Complete system design
- **Phase Plans:** `docs/implemenation_plan/Phase_[1-5]_*.md` - Detailed implementation guides
- **FastAPI Template:** https://github.com/fastapi/full-stack-fastapi-template - Foundation codebase
- **PsychoPy Docs:** https://www.psychopy.org/documentation.html - PsychoPy reference

## Success Metrics

**Technical:**
- System runs with < 2GB RAM
- Page loads < 2 seconds
- Deployment takes < 30 minutes
- Single developer can maintain

**Research:**
- Experiments deploy in < 1 minute
- Data available immediately after trial
- 99% uptime during work hours
- Researchers can use without training

## Key Principle

**This system delivers 90% of functionality with 10% of complexity.** When in doubt, choose the simpler solution. The lab needs a tool that works, not a platform that scales to millions of users.
