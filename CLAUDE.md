# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LICS (Lab Instrument Control System)** is a web-based laboratory automation platform for behavioral research with non-human primates. The system provides researchers with a web-based PsychoPy experiment builder and manages multiple Raspberry Pi devices running behavioral tasks in research cages.

**Core Architecture:** Three-tier system with React/Next.js frontend, FastAPI backend, PostgreSQL database, and Raspberry Pi edge devices communicating via MQTT.

**Design Philosophy:** Simplicity first. This is a monolithic application prioritizing maintainability over scalability. The system should be operable by a graduate student with basic technical skills.

## Current State vs Target Architecture

### Current Implementation Status

**Phase 1 Progress: ~20% Complete** (Template foundation only, no LICS-specific features)

✅ **Completed:**
- FastAPI template foundation forked and configured
- User authentication system (JWT)
- Docker Compose orchestration (PostgreSQL, MQTT broker, Adminer)
- Basic frontend with authentication UI
- Development environment setup

🚧 **In Progress:**
- Phase 1 foundation setup

⏳ **Not Yet Implemented:**
- Experiments API, models, and UI
- Devices API, models, and UI
- MQTT client integration (broker running, but no application code connects)
- PsychoPy builder interface
- PsychoPy compiler and code generation
- Edge device agent
- Trial data collection and storage
- Real-time WebSocket updates
- React Flow experiment designer
- Monaco Editor code preview

### Technology Stack: Current vs Target

**Frontend Stack Mismatch:**

The project currently uses a **different frontend stack** than specified in the target architecture. A migration plan is documented below.

| Component | Current Reality | Target Architecture |
|-----------|----------------|---------------------|
| Framework | React 19 + Vite 7 | Next.js 14 |
| Routing | TanStack Router | Next.js App Router |
| Styling | Chakra UI v3 | Tailwind CSS |
| State Management | TanStack Query only | TanStack Query + Zustand |
| Build Tool | Vite | Next.js (webpack) |
| Linter | Biome | ESLint (typically) |

**Backend Stack:**

| Component | Current Reality | Target Architecture |
|-----------|----------------|---------------------|
| Structure | Flat files (`models.py`, `crud.py`) | Modular folders (`models/`, `crud/`, `schemas/`) |
| Database | PostgreSQL 17 | PostgreSQL 15+ |
| Models | User, Item (template) | User, Experiment, Device, ExperimentDeployment, TrialResult |
| MQTT Client | Not implemented | Implemented in `core/mqtt.py` |

**Rationale for Migration:** The target architecture (Next.js 14) provides better server-side rendering, static site generation, and integrated full-stack patterns that align with the LICS requirements as defined in `docs/LICS_Simplified_Documentation.md`.

## Frontend Migration Plan

### Migration Strategy: React+Vite → Next.js 14

**Current Stack Analysis:**
- **React 19** with Vite 7 build tooling
- **TanStack Router** for file-based routing
- **Chakra UI v3** for component library
- **TanStack Query** for server state management
- **Biome** for linting

**Target Stack (per LICS_Simplified_Documentation.md):**
- **Next.js 14** with App Router
- **Tailwind CSS** for styling
- **TanStack Query** for server state (keep)
- **Zustand** for client state
- **React Flow** for experiment builder
- **Monaco Editor** for code preview

### Migration Phases

**Phase A: Preparation (Before starting)**
1. Document all current routes in TanStack Router
2. Audit Chakra UI component usage
3. Create Tailwind component equivalents
4. Test current functionality thoroughly

**Phase B: Next.js Setup (Parallel development)**
1. Create new Next.js 14 app with App Router
2. Set up Tailwind CSS configuration
3. Migrate authentication flow to Next.js patterns
4. Configure API routes or continue using separate FastAPI backend

**Phase C: Component Migration (Incremental)**
1. Convert Chakra UI components to Tailwind equivalents:
   - Chakra `<Button>` → Tailwind custom `<Button>` component
   - Chakra `<Box>`, `<Flex>` → Tailwind utility classes
   - Chakra theme → Tailwind config
2. Migrate routes from TanStack Router to Next.js App Router:
   - `routes/login.tsx` → `app/login/page.tsx`
   - `routes/_layout/*` → `app/(dashboard)/*`
3. Update data fetching to use Next.js patterns (Server Components where beneficial)

**Phase D: Feature Parity & Testing**
1. Verify all current features work in Next.js version
2. Update documentation and development commands
3. Switch deployment to Next.js build

**Phase E: Cleanup**
1. Remove Vite configuration
2. Remove Chakra UI dependencies
3. Archive old frontend code

### Migration Decision Points

**Option 1: Migrate Now (Before Phase 1 completion)**
- ✅ Minimal LICS-specific code to migrate
- ✅ Aligns with target architecture early
- ❌ Delays Phase 1 feature development

**Option 2: Complete Phase 1, Then Migrate**
- ✅ Maintain current momentum on LICS features
- ✅ Migration happens with more LICS context
- ❌ More code to migrate later

**Option 3: Incremental Migration Alongside Development**
- ✅ Gradual transition reduces risk
- ❌ Maintaining two stacks simultaneously

**Recommendation:** Complete Phase 1 core features (Experiments, Devices, MQTT) using current stack, then migrate before Phase 2 (PsychoPy Builder UI) to avoid migrating complex React Flow components twice.

## Technology Stack

> **Note:** This section describes the **TARGET architecture** as defined in `docs/LICS_Simplified_Documentation.md`. See "Current State vs Target Architecture" above for what's currently implemented and the migration plan.

**Backend:**
- FastAPI (Python 3.11+) ✅ *Implemented*
- SQLAlchemy 2.0 with async support ✅ *Implemented (via SQLModel)*
- Alembic for database migrations ✅ *Implemented*
- Pydantic for validation and settings ✅ *Implemented*
- Jinja2 for Python code generation (PsychoPy scripts) ⏳ *Planned*
- MQTT client (Mosquitto) for device communication ⚠️ *Broker running, client not implemented*

**Frontend (Target Architecture):**
- Next.js 14 with TypeScript ⚠️ *Currently: React 19 + Vite 7 + TanStack Router*
- TanStack Query for data fetching/caching ✅ *Implemented*
- Zustand for client state management ⏳ *Not installed (TanStack Query currently sufficient)*
- Tailwind CSS for styling ⚠️ *Currently: Chakra UI v3*
- React Flow for PsychoPy experiment timeline visualization ⏳ *Not installed*
- Monaco Editor for code preview ⏳ *Not installed*

**Database:**
- PostgreSQL 17 ✅ *Implemented (upgraded from template's PostgreSQL 12)*
- SQLite (local cache on edge devices only) ⏳ *Planned*

**Development:**
- Docker & Docker Compose for local development
- Pytest for backend testing
- Black/Ruff for code formatting and linting

## Project Structure

> **Note:** This shows the **TARGET structure**. Current reality differs as noted below.

**Target Structure:**
```
lics/
├── backend/          # FastAPI application
│   ├── app/
│   │   ├── api/routes/      # API endpoints ⚠️ Currently: login, users, items (template only)
│   │   │   ├── auth.py      # ⏳ Planned (currently login.py)
│   │   │   ├── users.py     # ✅ Implemented
│   │   │   ├── experiments.py  # ⏳ Not implemented
│   │   │   ├── devices.py      # ⏳ Not implemented
│   │   │   ├── results.py      # ⏳ Not implemented
│   │   │   └── websocket.py    # ⏳ Not implemented
│   │   ├── core/            # Config, security ✅ | MQTT ⏳
│   │   ├── crud/            # ⚠️ Currently: Single crud.py file (not folder)
│   │   ├── models/          # ⚠️ Currently: Single models.py file (not folder)
│   │   ├── schemas/         # ⚠️ Currently: Folder but only template schemas
│   │   ├── psychopy/        # ⏳ Entire directory not implemented
│   │   └── tasks/           # ⏳ Entire directory not implemented
│   ├── tests/              # ✅ Template tests exist
│   └── alembic/            # ✅ Migrations exist (User, Item tables only)
├── frontend/        # ⚠️ React + Vite (target: Next.js)
│   └── src/
│       ├── routes/         # ⚠️ Currently: TanStack Router (target: app/)
│       │   ├── _layout/    # ✅ Protected routes (template: items, admin, settings)
│       │   └── login.tsx   # ✅ Auth pages exist
│       ├── components/     # ✅ Template components (Admin, Common, Items, UserSettings)
│       │   ├── psychopy/   # ⏳ Not implemented
│       │   └── ui/         # ✅ Chakra UI primitives (target: Tailwind components)
│       └── lib/            # ✅ Basic utilities
├── edge/            # ⏳ Entire directory does not exist
│   ├── agent.py
│   ├── executor.py
│   └── hardware.py
├── docs/            # ✅ Implemented
│   ├── LICS_Simplified_Documentation.md
│   └── implemenation_plan/
└── docker-compose.yml  # ✅ Implemented (PostgreSQL, MQTT, Adminer, backend, frontend)
```

**Current Backend Structure (Flat):**
```
backend/app/
├── api/routes/
│   ├── login.py       # JWT auth
│   ├── users.py       # User CRUD
│   ├── items.py       # Template placeholder
│   ├── private.py     # Dev utilities
│   └── utils.py       # Health checks
├── core/
│   ├── config.py      # Settings
│   ├── db.py          # Database connection
│   └── security.py    # JWT/passwords
├── models.py          # Single file (User, Item models)
├── crud.py            # Single file (all CRUD ops)
└── schemas/           # Folder with template schemas
```

**Migration to Modular Structure:** As LICS-specific features are added (Experiments, Devices), refactor to modular structure with separate files in `models/`, `crud/`, and `schemas/` directories.

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

> **Note:** Commands below reflect the **current stack** (React + Vite + Biome). After migration to Next.js, some commands will change.

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server (Vite)
npm run dev
# Opens on http://localhost:5173 (Vite default port)

# Generate OpenAPI TypeScript client (after backend schema changes)
npm run generate-client

# Run type checking
npm run type-check

# Run linting (using Biome, not ESLint)
npm run lint

# Run linting with auto-fix
npm run lint:fix

# Format code (using Biome)
npm run format

# Build for production (Vite build)
npm run build

# Preview production build locally
npm run preview

# Run E2E tests (Playwright)
npm run test:e2e
```

**After Next.js Migration:**
```bash
# Development server will use Next.js (port 3000)
npm run dev

# Build will use Next.js compiler
npm run build

# Production preview
npm run start
```

### Edge Device Development

> **Note:** Edge device code **not yet implemented**. Commands below are for future reference.

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

> **Note:** This section describes the **TARGET architecture**. Implementation status is indicated with ✅ (implemented), ⏳ (planned), or ⚠️ (partial).

### Database Schema (Core Tables)

**users** ✅ - User authentication and management (from FastAPI template)
- Standard fields: id, email, hashed_password, full_name, is_active, is_superuser
- **Status:** Fully implemented with migrations

**experiments** ⏳ - PsychoPy experiment definitions
- `psyexp_data` (JSONB): Complete experiment definition from React Flow builder
- `python_code` (TEXT): Generated Python script for edge device execution
- `psychojs_code` (TEXT): Generated JavaScript for web preview
- Links to `users.id` via `created_by`
- **Status:** Not implemented (table does not exist)

**devices** ⏳ - Raspberry Pi edge devices
- `device_id`: Unique hardware identifier
- `status`: Enum (online, offline, running)
- `config` (JSONB): Device configuration
- `capabilities` (JSONB): Hardware capabilities (GPIO pins, sensors, etc.)
- `last_seen`: Heartbeat timestamp
- **Status:** Not implemented (table does not exist)

**experiment_deployments** ⏳ - Tracks experiment execution on devices
- Links experiments to devices
- Tracks deployment status and timing
- **Status:** Not implemented (table does not exist)

**trial_results** ⏳ - Individual trial data from experiments
- `response` (JSONB): Response data
- `custom_data` (JSONB): Additional trial data
- Links to `experiment_deployments.id`
- **Status:** Not implemented (table does not exist)

### Communication Architecture

**MQTT Topics:** ⏳ *Not implemented - broker running but no application code*
```
devices/{device_id}/command    # Commands to device
devices/{device_id}/status     # Status updates from device
devices/{device_id}/data       # Trial data from device
devices/{device_id}/logs       # Log messages from device
experiments/{exp_id}/deploy    # Deployment notifications
```

**Status:** Mosquitto MQTT broker is running in Docker, but no backend MQTT client code exists yet.

**WebSockets:** ⏳ *Not implemented*
- Real-time UI updates for device status changes
- Experiment progress updates
- Trial results streaming
- System notifications

**Status:** No WebSocket endpoints implemented yet.

### PsychoPy Integration

⏳ **Entire integration not yet implemented**

**Builder → Execution Flow (Target):**
1. User designs experiment visually in React Flow (frontend) ⏳
2. Builder state saved as JSON to `experiments.psyexp_data` ⏳
3. Backend compiler (`app/psychopy/compiler.py`) generates Python code using Jinja2 templates ⏳
4. Generated code stored in `experiments.python_code` ⏳
5. Deployment pushes Python code to edge device via MQTT ⏳
6. Raspberry Pi agent executes PsychoPy script ⏳
7. Trial data synced back via MQTT to `trial_results` table ⏳

**Core PsychoPy Components (Planned):**
- Stimuli: Text, Image, Sound, Movie
- Responses: Keyboard, Mouse, Button Box
- Flow: Loop, Condition, Code
- Custom: GPIO Output, GPIO Input, Feeder

**Status:** No PsychoPy code exists yet. This is Phase 2-3 work.

### Edge Device Agent

⏳ **Not yet implemented - entire `edge/` directory does not exist**

**Responsibilities (Planned):**
- Register with backend on startup
- Send heartbeat every 30 seconds
- Listen for MQTT commands
- Execute PsychoPy experiments
- Cache data locally in SQLite during offline periods
- Sync results when connectivity returns

**Offline Capability (Planned):**
- Edge devices continue experiments during network outages
- Local SQLite cache stores unsent trial results
- Automatic synchronization when connectivity returns
- Retain local data for 7 days as backup

**Status:** This is Phase 3 work. No edge device code has been written yet.

## Implementation Phases

The project follows a 5-phase implementation plan (detailed documentation in `docs/implemenation_plan/`):

**Phase 1: Foundation (Weeks 1-4)** 🚧 **IN PROGRESS (~20% complete)**
- ✅ Fork FastAPI template and configure environment
- ⏳ Implement core models: Users ✅, Experiments ⏳, Devices ⏳
- ✅ Setup authentication system
- ⏳ CRUD APIs for experiments and devices
- ⏳ Basic MQTT client connection (broker running, client not implemented)
- ⚠️ Minimal frontend with login and dashboard shell (React+Vite, not Next.js yet)
- **Completion Criteria:** Stack boots with `docker-compose up` ✅, superuser can login ✅, experiments/devices CRUD works ⏳
- **Current Status:** Template foundation complete. Need to implement Experiments and Devices models/APIs.

**Phase 2: PsychoPy Builder (Weeks 5-8)** ⏳ **NOT STARTED**
- React Flow timeline for visual experiment design
- Component palette with drag-and-drop
- Properties panel for component configuration
- Backend compiler (`app/psychopy/compiler.py`) with Jinja2 templates
- Python code generation from builder state
- Monaco editor for code preview
- **Completion Criteria:** User can build simple experiment (text + keyboard), save, compile, and see Python code
- **Dependencies:** Requires Phase 1 completion (Experiments model/API)

**Phase 3: Edge Integration (Weeks 9-10)** ⏳ **NOT STARTED**
- Raspberry Pi agent development
- MQTT command handling
- Local SQLite storage for offline operation
- GPIO control library
- Hardware component mapping
- **Completion Criteria:** Experiment can be deployed to device and executed successfully
- **Dependencies:** Requires Phase 1-2 completion

**Phase 4: Data & Deployment (Weeks 11-12)** ⏳ **NOT STARTED**
- Trial result collection API
- Data synchronization from edge devices
- Export functionality (CSV, Excel, JSON)
- Basic analytics and visualization
- Production deployment setup
- **Completion Criteria:** Complete end-to-end flow from design to data export
- **Dependencies:** Requires Phase 1-3 completion

**Phase 5: Polish & Launch (Weeks 13-14)** ⏳ **NOT STARTED**
- Bug fixes and testing
- Performance optimization
- UI/UX improvements
- Documentation completion
- **Dependencies:** Requires Phase 1-4 completion

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

**Progress Tracker Document**  @/Users/beacon/LICS/docs/PROGRESS_TRACKER.md is a living document. Update it frequently as you make progress!

**Update progress after test complete** if feature implement successfully and pass the test, update the documentaion related to each phase and @/Users/beacon/LICS/CLAUDE.md as the application changes.