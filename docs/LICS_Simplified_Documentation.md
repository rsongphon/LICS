# Lab Instrument Control System (LICS) - Simplified Implementation
## Practical Laboratory Automation Platform

---

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Frontend Implementation](#5-frontend-implementation)
6. [Backend API Service](#6-backend-api-service)
7. [Database Design](#7-database-design)
8. [Edge Device Management](#8-edge-device-management)
9. [PsychoPy Integration](#9-psychopy-integration)
10. [Real-time Communication](#10-real-time-communication)
11. [Authentication & Security](#11-authentication--security)
12. [File Storage & Data Management](#12-file-storage--data-management)
13. [Deployment Strategy](#13-deployment-strategy)
14. [Testing Approach](#14-testing-approach)
15. [Monitoring & Maintenance](#15-monitoring--maintenance)
16. [Implementation Roadmap](#16-implementation-roadmap)

---

## 1. System Overview

### 1.1 Project Goals

LICS is a streamlined laboratory control system designed specifically for behavioral research with non-human primates. The system provides researchers with a web-based PsychoPy experiment builder and manages multiple Raspberry Pi devices running behavioral tasks in research cages.

**Core Objectives:**
- Web-based PsychoPy Builder for experiment design (no coding required)
- Remote control and monitoring of cage-mounted Raspberry Pi devices
- Automated data collection and export for analysis
- Simple, maintainable architecture suitable for research labs

### 1.2 Key Features

#### Essential Features (MVP)
- **PsychoPy Web Builder**: Visual experiment design interface
- **Device Management**: Register and control Raspberry Pi devices
- **Experiment Deployment**: Push experiments to edge devices
- **Data Collection**: Automatic trial data gathering and storage
- **Basic Monitoring**: Device status and experiment progress tracking
- **Data Export**: CSV/Excel export for statistical analysis

#### Future Enhancements (Phase 2)
- Video streaming from cages
- Advanced scheduling system
- Template library for common experiments
- Basic analytics dashboard

### 1.3 Design Principles

- **Simplicity First:** "Boring" technology is better. Use standard tools (Postgres, Docker).
- **Monolithic by Default:** One backend repo, one frontend repo. No microservices.
- **Security by Design:** Devices must authenticate. Registration requires a shared secret.
- **Use Existing Tools:** Don't reinvent the wheel. Use PsychoPy for the engine.
- **Offline Capability:** The lab network *will* fail. Devices must keep running and sync later (Outbox Pattern).cialized services.

**Offline Capability**: Edge devices must continue experiments even during network outages, with automatic data synchronization when connectivity returns.

---

## 2. Architecture Overview

### 2.1 Three-Tier Architecture

The system follows a simple three-tier architecture that any developer can understand and maintain:

```
┌─────────────────────────────────────┐
│     React Frontend (Next.js)         │
│   - PsychoPy Builder Interface       │
│   - Device Management Dashboard      │
│   - Data Visualization               │
└────────────────┬────────────────────┘
                 │ WebSockets (Real-time)
┌────────────────▼────────────────────┐
│     FastAPI Backend (Python)        │
│   - REST API Endpoints              │
│   - WebSocket Connections           │
│   - Background Task Queue           │
│   - MQTT Client for Devices         │
└────────────────┬────────────────────┘
                 │ MQTT (Control/Data)
┌────────────────▼────────────────────┐
│           MQTT Broker               │
└────────────────┬────────────────────┘
                 │ MQTT
┌────────────────▼────────────────────┐
│     Edge Devices (Raspberry Pi)     │
│   - Dockerized Agent (Container)    │
│   - PsychoPy Runtime Environment    │
│   - Local SQLite Cache (Outbox)     │
│   - GPIO Hardware Control           │
└─────────────────────────────────────┘
```

### 2.2 Component Responsibilities

**Frontend (Next.js)**
- Provides the user interface for all interactions
- Renders PsychoPy Builder using React components
- Displays real-time device status and experiment progress
- Handles file uploads and data visualization

**Backend (FastAPI)**
- Single API service handling all business logic
- Manages database operations through SQLAlchemy ORM
- Processes PsychoPy experiment files
- Coordinates communication with edge devices
- Handles authentication and authorization

**Database (PostgreSQL)**
- Single source of truth for all data
- Stores users, experiments, devices, and results
- Handles time-series data with proper indexing
- Provides full-text search capabilities

**Edge Devices (Raspberry Pi)**
- Run PsychoPy experiments autonomously
- Cache data locally during network outages
- Control hardware through GPIO pins
- Report status and results via MQTT

---

## 3. Technology Stack

### 3.1 Core Technologies

Based on the [FastAPI Full-Stack Template](https://github.com/fastapi/full-stack-fastapi-template):

**Backend:**
- **FastAPI**: Modern Python web framework with automatic OpenAPI documentation
- **SQLAlchemy 2.0**: ORM with async support
- **Alembic**: Database migration management
- **Pydantic**: Data validation and settings management
- **fastapi-apscheduler**: Scheduled tasks management
- **Python 3.11+**: Latest stable Python version

**Frontend:**
- **Next.js 14**: React framework with SSR/SSG capabilities
- **TypeScript**: Type-safe JavaScript
- **TanStack Query**: Data fetching and caching
- **Tailwind CSS**: Utility-first CSS framework
- **React Flow**: For PsychoPy experiment timeline visualization

**Database:**
- **PostgreSQL 15**: Primary database for all data
- **SQLite**: Local cache on edge devices only

**Communication:**
- **MQTT (Mosquitto)**: Lightweight messaging for IoT devices
- **WebSockets**: Real-time updates to frontend

**Development Tools:**
- **Docker**: Containerization for consistent environments
- **Docker Compose**: Local development orchestration
- **Pytest**: Testing framework
- **Black/Ruff**: Code formatting and linting

### 3.2 Why This Stack?

**FastAPI Template Benefits:**
- Production-ready authentication system included
- Database migrations setup out of the box
- Docker configuration ready
- Testing infrastructure included
- Email templates for notifications
- Admin user management built-in

**Single Backend Service:**
- Reduces operational complexity
- Easier debugging and logging
- Shared memory for caching
- No inter-service communication issues
- Single deployment unit

**PostgreSQL for Everything:**
- JSON columns for flexible data
- Full-text search built-in
- Time-series data with proper indexing
- No need for separate NoSQL database
- Excellent Python support

---

## 4. Project Structure

### 4.1 Repository Organization

Following the FastAPI template structure with additions for PsychoPy:

```
lics/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── auth.py
│   │   │   │   ├── users.py
│   │   │   │   ├── experiments.py
│   │   │   │   ├── devices.py
│   │   │   │   ├── results.py
│   │   │   │   └── websocket.py
│   │   │   └── deps.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── mqtt.py
│   │   ├── crud/
│   │   │   ├── experiment.py
│   │   │   ├── device.py
│   │   │   └── result.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── experiment.py
│   │   │   ├── device.py
│   │   │   └── result.py
│   │   ├── schemas/
│   │   │   └── [corresponding schemas]
│   │   ├── psychopy/
│   │   │   ├── builder.py
│   │   │   ├── compiler.py
│   │   │   ├── components.py
│   │   │   └── gpio_bridge.py
│   │   ├── tasks/
│   │   │   ├── deployment.py
│   │   │   └── data_sync.py
│   │   └── main.py
│   ├── tests/
│   ├── alembic/
│   └── pyproject.toml
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── experiments/
│   │   │   │   ├── devices/
│   │   │   │   └── results/
│   │   │   ├── builder/
│   │   │   │   ├── components/
│   │   │   │   ├── canvas/
│   │   │   │   └── timeline/
│   │   │   └── api/
│   │   ├── components/
│   │   │   ├── psychopy/
│   │   │   └── ui/
│   │   └── lib/
│   ├── public/
│   └── package.json
├── edge/
│   ├── agent.py
│   ├── executor.py
│   ├── hardware.py
│   └── requirements.txt
├── docker-compose.yml
├── .env.example
└── README.md
```

### 4.2 Configuration Management

Using Pydantic settings for type-safe configuration:

**Environment Variables (.env):**
```
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

---

## 5. Frontend Implementation

### 5.1 Core Components

**Dashboard Layout:**
- Navigation sidebar with main sections
- Header with user info and notifications
- Main content area with responsive grid
- Status bar showing connected devices

**PsychoPy Builder Interface:**
- **Timeline View**: React Flow diagram showing experiment flow
- **Component Panel**: Draggable PsychoPy components
- **Properties Panel**: Component configuration forms
- **Code Preview**: Monaco editor showing generated Python/JS
- **Toolbar**: Save, compile, deploy, and test actions

**Device Management:**
- Device list with status indicators (online/offline/running)
- Device detail view with configuration
- Remote control panel (start/stop/restart)
- Log viewer with filtering

**Data Visualization:**
- Trial results table with sorting/filtering
- Basic charts using Recharts
- Export functionality (CSV, Excel)
- Simple statistical summaries

### 5.2 State Management

**TanStack Query for Server State:**
- Automatic caching and refetching
- Optimistic updates for better UX
- Background refetching for live data
- Mutation handling for CRUD operations

**Zustand for Client State:**
- PsychoPy Builder state (components, connections)
- UI preferences and settings
- Temporary form data
- WebSocket connection state

### 5.3 PsychoPy Builder Components

**Visual Components (React-based):**
- TextStimulus: Display text to subjects
- ImageStimulus: Show images with timing control
- SoundStimulus: Play audio files
- KeyboardResponse: Capture keyboard input
- MouseResponse: Track mouse/touchscreen input
- GPIOTrigger: Control hardware devices
- DataLogger: Record custom variables

**Component Properties:**
Each component has a property panel with:
- Basic settings (name, start time, duration)
- Stimulus parameters (position, size, color)
- Response options (allowed keys, timeout)
- Data collection settings (variables to save)

**Timeline Management:**
- Drag-and-drop components onto timeline
- Connect components to define flow
- Loop and conditional structures
- Trial organization with blocks

---

## 6. Backend API Service

### 6.1 API Structure

**RESTful Endpoints following FastAPI patterns:**

**Authentication:**
- POST /api/auth/login - User login with JWT token
- POST /api/auth/refresh - Refresh access token
- POST /api/auth/logout - Logout and invalidate token

**Users:**
- GET /api/users/me - Current user profile
- PUT /api/users/me - Update profile
- GET /api/users - List users (admin only)
- POST /api/users - Create user (admin only)

**Experiments:**
- GET /api/experiments - List experiments
- POST /api/experiments - Create new experiment
- GET /api/experiments/{id} - Get experiment details
- PUT /api/experiments/{id} - Update experiment
- DELETE /api/experiments/{id} - Delete experiment
- POST /api/experiments/{id}/compile - Compile to Python/JS
- POST /api/experiments/{id}/deploy - Deploy to devices

**Devices:**
- GET /api/devices - List registered devices
- POST /api/devices/register - Register new device
- GET /api/devices/{id} - Get device details
- PUT /api/devices/{id} - Update device config
- POST /api/devices/{id}/command - Send command
- GET /api/devices/{id}/logs - Get device logs

**Results:**
- GET /api/results - List experiment results
- GET /api/results/{experiment_id} - Get specific results
- GET /api/results/export - Export data (CSV/Excel)
- POST /api/results/analyze - Basic statistics

### 6.2 Core Services

**ExperimentService:**
- Parse and validate .psyexp files (XML format)
- Generate Python code for edge execution
- Generate PsychoJS for web preview
- Manage experiment versions and history
- Handle component parameter validation

**DeviceService:**
- Track device registration and heartbeats
- Queue commands for device execution
- Monitor device health metrics
- Handle offline/online transitions
- Manage device-experiment assignments

**DataService:**
- Process incoming trial data from devices
- Aggregate results by experiment/subject
- Calculate basic statistics
- Generate export files
- Clean up old data based on retention policy

### 6.3 Background Tasks

Using FastAPI BackgroundTasks for lightweight async operations:

**Task Types:**
- Experiment compilation (< 30 seconds)
- Device deployment (< 1 minute)
- Data export generation (< 2 minutes)
- Email notifications
- Periodic device health checks

For anything longer, results are cached and users are notified when complete.

---

## 7. Database Design

### 7.1 Core Tables

**users** (from FastAPI template)
- id: UUID primary key
- email: Unique email address
- hashed_password: Bcrypt hashed password
- full_name: User's full name
- is_active: Account status
- is_superuser: Admin privileges
- created_at: Registration timestamp
- updated_at: Last modification

**experiments**
- id: UUID primary key
- name: Experiment name
- description: Text description
- psyexp_data: JSON - Complete .psyexp file content
- python_code: Text - Generated Python code
- psychojs_code: Text - Generated JavaScript code
- created_by: Foreign key to users
- version: Integer version number
- status: Enum (draft, compiled, deployed)
- created_at: Timestamp
- updated_at: Timestamp

**devices**
- id: UUID primary key
- device_id: Unique hardware identifier
- name: Friendly device name
- location: Physical location (cage number)
- ip_address: Current IP address
- last_seen: Last heartbeat timestamp
- status: Enum (online, offline, running)
- config: JSON - Device configuration
- capabilities: JSON - Hardware capabilities
- registered_at: Timestamp

**experiment_deployments**
- id: UUID primary key
- experiment_id: Foreign key to experiments
- device_id: Foreign key to devices
- deployed_at: Timestamp
- deployed_by: Foreign key to users
- status: Enum (pending, running, completed, failed)
- started_at: Nullable timestamp
- completed_at: Nullable timestamp

**trial_results**
- id: UUID primary key
- deployment_id: Foreign key to deployments
- trial_number: Sequential trial number
- started_at: Trial start timestamp
- ended_at: Trial end timestamp
- response: JSON - Response data
- reaction_time: Float milliseconds
- correct: Boolean if applicable
- custom_data: JSON - Additional trial data
**trial_results**
- id: UUID primary key
- deployment_id: Foreign key to deployments
- trial_number: Sequential trial number
- started_at: Trial start timestamp
- ended_at: Trial end timestamp
- response: JSON - Response data
- reaction_time: Float milliseconds
- correct: Boolean if applicable
- custom_data: JSON - Additional trial data
- synced_at: When synced from device

> **Note:** This table is for *trial-level* summary data. High-frequency time-series data (e.g., 100Hz eye tracking) should be stored as binary blobs or flat files referenced here, not as individual rows, to prevent database bloat.

**device_logs**
- id: UUID primary key
- device_id: Foreign key to devices
- level: Enum (debug, info, warning, error)
- message: Log message text
- context: JSON - Additional context
- created_at: Timestamp

### 7.2 Indexes and Optimization

**Performance Indexes:**
- devices.device_id - Unique index for fast lookup
- devices.status - For filtering by status
- trial_results.deployment_id - For result aggregation
- trial_results.created_at - For time-range queries
- device_logs.device_id + created_at - Composite for log queries

**PostgreSQL-Specific Features:**
- JSONB columns for flexible schema
- GIN indexes on JSON fields for fast queries
- Partial indexes for common filters
- Table partitioning for trial_results if > 1M rows

---

## 8. Edge Device Management

### 8.1 Raspberry Pi Agent

**Simple Python agent running on each device:**

**Core Responsibilities:**
- Register with backend on startup
- Send heartbeat every 30 seconds
- Listen for MQTT commands
- Execute PsychoPy experiments
- Cache data locally in SQLite
- Sync results when online

**Agent Architecture:**
```python
# Simplified agent structure
class EdgeAgent:
    def __init__(self):
        self.mqtt_client = MQTTClient()
        self.local_db = SQLiteCache()
        self.executor = PsychoPyExecutor()
        self.hardware = GPIOController()
    
    def run(self):
        self.register_device()
        self.start_heartbeat()
        self.listen_for_commands()
        self.sync_data_periodically()
```

### 8.2 Local Data Management

**SQLite Schema (minimal):**
- experiments: Cached experiment definitions
- trial_queue: Unsent trial results
- device_config: Local configuration
- logs: Recent log entries

**Sync Strategy:**
- Store trial results locally first
- Batch upload every 5 minutes when online
- Mark as synced after confirmation
- Retain for 7 days as backup

### 8.3 Hardware Integration

**GPIO Control for Lab Equipment:**
- LED indicators for status
- Feeder control (pellet dispensers)
- Touch screen input detection
- RFID reader for subject identification
- Sensor inputs (IR beam breaks)

**Hardware Abstraction Layer:**
```python
# Simple hardware interface
class HardwareInterface:
    def __init__(self):
        self.gpio = GPIO()
        
    def deliver_reward(self, duration_ms):
        """Activate feeder for specified duration"""
        
    def read_rfid(self):
        """Get RFID tag if present"""
        
    def set_led(self, color, state):
        """Control status LEDs"""
```

---

## 9. PsychoPy Integration

### 9.1 Web-Based Builder

**Implementation Strategy:**
- Use React Flow for visual experiment timeline
- Custom React components for each PsychoPy element
- Property panels using React Hook Form
- Real-time validation of parameters

**Component Library:**
Core PsychoPy components to implement:
1. **Stimuli**: Text, Image, Sound, Movie
2. **Responses**: Keyboard, Mouse, Button Box
3. **Flow**: Loop, Condition, Code
4. **Custom**: GPIO Output, GPIO Input, Feeder

### 9.2 Experiment File Format

**Using standard .psyexp XML format:**
- Maintain compatibility with desktop PsychoPy
- Store as JSON in database for easier querying
- Convert between XML and JSON as needed

**Example Structure:**
```xml
<PsychoPy version="2023.2">
  <Settings>
    <Monitor name="default"/>
    <Window size="[1920, 1080]"/>
  </Settings>
  <Routines>
    <Routine name="trial">
      <TextComponent name="stimulus">
        <Param name="text">Hello World</Param>
        <Param name="pos">[0, 0]</Param>
      </TextComponent>
    </Routine>
  </Routines>
  <Flow>
    <Routine name="trial"/>
  </Flow>
</PsychoPy>
```

### 9.3 Code Generation

**Python Code Generation:**
- Template-based generation using Jinja2
- Include GPIO extensions for hardware control
- Add data collection wrappers
- Include error handling and logging

**Execution on Edge Device:**
1. Receive compiled Python code via MQTT
2. Save to local filesystem
3. Run using PsychoPy runtime
4. Capture output and trial data
5. Handle errors gracefully

---

## 10. Real-time Communication

### 10.1 MQTT for Device Communication

**Simple MQTT Topics:**
```
devices/{device_id}/command    - Commands to device
devices/{device_id}/status     - Status from device
devices/{device_id}/data       - Trial data from device
devices/{device_id}/logs       - Log messages
experiments/{exp_id}/deploy     - Deployment notifications
```

**Message Patterns:**
- Command-Response for control operations
- Publish-Subscribe for status updates
- QoS 1 for important messages (at least once)
- Retained messages for last known status

### 10.2 WebSockets for UI Updates

**WebSocket Events:**
- Device status changes (online/offline)
- Experiment progress updates
- Real-time trial results
- System notifications

**Implementation:**
```python
# FastAPI WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str):
    await websocket.accept()
    # Verify token
    # Subscribe to relevant events
    # Forward updates to client
```

---

## 11. Authentication & Security

### 11.1 Simple JWT Authentication

Using FastAPI template's built-in auth:

**Token Management:**
- Access tokens: 24 hours validity (not 15 minutes!)
- Refresh tokens: 30 days validity
- Simple logout (client-side token removal)

**User Roles (simplified):**
- **Admin**: Full system access
- **Researcher**: Create/run experiments
- **Viewer**: Read-only access

### 11.2 Security Measures

**Basic Security (sufficient for lab):**
- HTTPS only in production
- Password hashing with bcrypt
- SQL injection prevention via ORM
- Input validation with Pydantic
- CORS configuration for frontend

**Not Needed:**
- Complex RBAC systems
- API rate limiting (it's internal!)
- OAuth2/SAML (too complex)
- Audit logging everything

---

## 12. File Storage & Data Management

### 12.1 Local File Storage

**Simple file organization:**
```
/data/
├── experiments/
│   └── {experiment_id}/
│       ├── experiment.psyexp
│       ├── generated_code.py
│       └── resources/
├── results/
│   └── {experiment_id}/
│       └── {date}/
│           └── trial_data.csv
└── uploads/
    └── temp/
```

**No need for:**
- MinIO or S3 (local filesystem is fine)
- CDN (it's local network)
- Complex backup systems (use rsync)

### 12.2 Data Export

**Export Formats:**
- CSV: Primary format for statistical software
- Excel: For researchers who prefer spreadsheets
- JSON: For custom processing

**Export includes:**
- Trial-by-trial data
- Summary statistics
- Experiment parameters
- Device information

---

## 13. Deployment Strategy

### 13.1 Development Environment

**Docker Compose for everything:**
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: lics
      POSTGRES_USER: lics
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://lics:password@db/lics
    volumes:
      - ./backend:/app
      - ./data:/data

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000

  mqtt:
    image: eclipse-mosquitto:2
    ports:
      - "1883:1883"
    volumes:
      - ./mosquitto.conf:/mosquitto/config/mosquitto.conf
```

### 13.2 Production Deployment

**Single Server Setup:**
1. Ubuntu 22.04 LTS server
2. Docker and Docker Compose
3. Nginx reverse proxy
4. Let's Encrypt SSL certificate
5. PostgreSQL backup cron job
6. Basic firewall rules

**Deployment Process:**
1. SSH to server
2. Pull latest code from git
3. Run docker-compose up -d
4. Run database migrations
5. Restart services if needed

**No need for:**
- Kubernetes
- CI/CD pipelines (for a lab?)
- Blue-green deployments
- Auto-scaling

---

## 14. Testing Approach

### 14.1 Practical Testing

**Backend Testing:**
- Unit tests for critical functions
- Integration tests for API endpoints
- Use pytest and FastAPI test client
- Mock MQTT and hardware interfaces

**Frontend Testing:**
- Component testing with React Testing Library
- E2E tests for critical workflows only
- Manual testing for PsychoPy Builder

**Coverage Goals:**
- 60-70% backend coverage (not 100%!)
- Test critical paths thoroughly
- Skip testing obvious CRUD operations

### 14.2 Edge Device Testing

**Simulation Mode:**
- Mock GPIO for development
- Simulated trial execution
- Fake data generation for testing

---

## 15. Monitoring & Maintenance

### 15.1 Simple Monitoring

**Application Monitoring:**
- Health check endpoint (/health)
- Basic metrics endpoint (/metrics)
- Database connection status
- MQTT broker connectivity
- Device online/offline count

**Logging:**
- Application logs to files
- Rotate daily, keep 30 days
- Error notifications via email
- Simple grep for troubleshooting

**No need for:**
- Prometheus/Grafana
- Distributed tracing
- APM tools
- Complex dashboards

### 15.2 Maintenance Tasks

**Daily:**
- Check device status dashboard
- Review error logs
- Verify backups completed

**Weekly:**
- Clear old temporary files
- Archive completed experiment data
- Update device software if needed

**Monthly:**
- PostgreSQL maintenance (VACUUM)
- Review disk usage
- Security updates

---

## 16. Implementation Roadmap

**Total Timeline: 16 Weeks**

### Phase 1: Foundation (Weeks 1-2)
- Setup FastAPI backend and Next.js frontend
- Database schema design and migration setup
- Basic user authentication and management
- Docker Compose environment

### Phase 2: PsychoPy Builder MVP (Weeks 3-8)
- **Strict MVP**: Text, Image, and Keyboard components only
- React Flow integration for timeline
- Component property panels
- .psyexp file generation
- Python code compilation engine

### Phase 3: Device Management (Weeks 9-11)
- MQTT broker setup and integration
- Raspberry Pi agent implementation
- Device registration and heartbeat
- Remote command execution

### Phase 4: Data & Integration (Weeks 12-14)
- Trial result collection and storage
- Data export functionality
- Real-time dashboard updates
- End-to-end system testing

### Phase 5: Polish & Deployment (Weeks 15-16)
- Documentation and user guides
- Deployment to lab server
- Training for lab members
- Final bug fixes

---

## 17. Operational Strategy

### 17.1 Backup & Recovery

**Database Backups:**
- Daily automated `pg_dump` to local storage
- Retention: Keep last 7 daily, 4 weekly, and 6 monthly backups
- Scripted restore procedure for disaster recovery

**Configuration Backup:**
- Weekly backup of `.env` files and docker-compose configurations
- Manual backup required before major updates

### 17.2 Maintenance

**Log Management:**
- Application logs rotated daily, kept for 30 days
- Device logs stored in database, pruned after 90 days

**System Updates:**
- Monthly OS security updates
- Quarterly dependency updates (Python/Node packages)

---

## Summary: Key Simplifications

### What We Removed

1. **Microservices** → Single FastAPI backend
2. **Multiple databases** → PostgreSQL only
3. **Kubernetes** → Docker Compose
4. **API Gateway** → Simple Nginx proxy
5. **Event sourcing** → Regular CRUD
6. **Complex auth** → Simple JWT
7. **Elasticsearch** → PostgreSQL full-text search
8. **Grafana/Prometheus** → Basic health checks
9. **Message queues** → Background tasks
10. **Multi-tenancy** → Single lab focus

### What We Kept

1. **PsychoPy Builder** - Core value proposition
2. **Edge device support** - Essential for lab
3. **Offline capability** - Network reliability
4. **Data export** - Research requirement
5. **Real-time updates** - User experience
6. **Docker** - Development consistency

### Resource Requirements

**Development Team:**
- 1 Full-stack developer (you!)
- Part-time assistance for testing

**Infrastructure:**
- 1 Server (8GB RAM, 4 CPU cores)
- 1 Backup location
- Basic monitoring

**Monthly Costs:**
- Server: $40-80/month
- Domain: $15/year
- SSL: Free (Let's Encrypt)
- Total: < $100/month

### Success Metrics

**Technical:**
- System runs with < 2GB RAM
- Page loads < 2 seconds
- Deployment takes < 30 minutes
- Single developer can maintain

**Research:**
- Experiments deploy in < 1 minute
- Data available immediately
- 99% uptime during work hours
- Researchers can use without training

---

## Conclusion

This simplified architecture delivers 90% of the functionality with 10% of the complexity. It's maintainable by a single developer, deployable on modest hardware, and focused on what researchers actually need: running PsychoPy experiments on Raspberry Pi devices with reliable data collection.

The system can grow if needed, but starts simple and functional. Most importantly, it can be built in 3 months instead of 12, and maintained by your existing team without hiring DevOps specialists.

Remember: **Your lab needs a tool that works, not a platform that scales to millions of users.**
