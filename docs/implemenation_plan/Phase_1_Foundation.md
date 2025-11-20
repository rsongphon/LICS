# PHASE 1 DOCUMENTATION: Foundation (Weeks 1-4)

## 1. Phase Overview

### 1.1 Phase Objectives and Success Criteria

**Objectives:**
* Establish the complete, runnable foundation for the LICS application by forking and configuring the standard [FastAPI Full-Stack Template](https://github.com/fastapi/full-stack-fastapi-template).
* Implement the core database models and tables for `Users`, `Experiments`, and `Devices`.
* Implement the backend authentication system (leveraging the template) for user login, registration, and management.
* Implement the core CRUD (Create, Read, Update, Delete) API endpoints for `Experiments` and `Devices`.
* Implement the basic MQTT client connection within the backend service.
* Create a minimal Next.js frontend with a functional login page and a protected dashboard layout containing placeholders.

**Success Criteria:**
* The full application stack (backend, frontend, db, mqtt) boots successfully with a single `docker-compose up` command.
* A `Superuser` can be created via the documented environment variable (`FIRST_SUPERUSER`).
* A `Superuser` can log in via the frontend UI and access the dashboard.
* An authenticated `User` can programmatically (via API tests) create, read, and delete an `Experiment` entry tied to their user ID.
* An external service (simulating a device) can `POST` to the `/api/devices/register` endpoint and successfully create a `Device` entry in the database.
* All new database tables (`experiments`, `devices`) are created and managed via Alembic migration scripts.
* The backend service successfully logs a "Connected to MQTT broker" message on startup.

### 1.2 Phase Sequencing
This is Phase 1, the foundational "bedrock" of the entire system. It must be completed first as every subsequent phase depends on the components built here:
* **Phase 2 (PsychoPy Builder)** needs the `Experiments` API to save its work and the `Users` API for authentication.
* **Phase 3 (Edge Integration)** needs the `Devices` API to register devices and the `MQTT` service to communicate.
* **Phase 4 (Data & Deployment)** needs all preceding components to function.

### 1.3 Dependencies on Previous Phases
* None. This is the first phase.

### 1.4 Completion Requirements for Next Phase
Before Phase 2 (PsychoPy Builder) can begin, the following must be delivered and stable:
1.  A stable, authenticated `/api/experiments` endpoint (GET, POST, PUT, DELETE).
2.  The `experiments` database table, specifically the `psyexp_data` (JSON) column, must be implemented for storing the builder's state.
3.  A functional frontend login system and dashboard shell, allowing developers to add the new "Builder" page within a protected route.

### 1.5 Estimated Timeline
* **Total:** 4 Weeks
* **Buffer:** 1 Week (allocated for potential complexities in understanding and modifying the FastAPI template).
* **Total Allotted:** 5 Weeks

### 1.6 Key Deliverables and Artifacts
* Forked LICS GitHub repository based on the FastAPI template.
* `docker-compose.yml` for the full local development environment.
* Alembic migration script for `experiments` and `devices` tables.
* Postman collection or automated `pytest` suite for all new Phase 1 API endpoints.
* Running backend service with functional `/api/auth/login`, `/api/experiments`, and `/api/devices` endpoints.
* Running frontend application with a functional login page.

---

## 2. Scope Definition

### 2.1 What IS included in this phase
* **Backend:**
    * Forking the [FastAPI Full-Stack Template](https://github.com/fastapi/full-stack-fastapi-template).
    * Full User Authentication (login, logout, refresh, get me) via JWT (from template).
    * Superuser creation and management (from template).
    * Database models for `User` (from template), `Experiment`, and `Device` (new).
    * Database schemas (Pydantic) for `Experiment` and `Device` (new).
    * CRUD helper logic for `Experiment` and `Device` (new).
    * API routes for `Experiment` (GET, POST, PUT, DELETE) and `Device` (GET, POST, PUT).
    * Alembic migration script to create the new tables.
    * Initial MQTT client setup (`core/mqtt.py`) that connects to the broker on startup.
* **Frontend:**
    * Basic Next.js setup (from template).
    * A public `/login` page.
    * State management for storing the auth token.
    * A protected `/(dashboard)` route group.
    * A shared `/(dashboard)/layout.tsx` component with a sidebar.
    * Placeholder pages for `/(dashboard)/experiments` and `/(dashboard)/devices`.
* **Database:**
    * Implementation of `users`, `experiments`, and `devices` tables in PostgreSQL.
* **DevOps:**
    * A complete `docker-compose.yml` for `backend`, `frontend`, `db`, and `mqtt` (see Section 13.1 of master doc).

### 2.2 What IS NOT included in this phase
* **PsychoPy Builder:** The entire UI for building experiments is **Phase 2**.
* **Experiment Compilation:** Generating Python/JS from `psyexp_data` is **Phase 2**.
* **Experiment Deployment:** Pushing experiments to devices is **Phase 3**.
* **Edge Device Agent:** The Python code for the Raspberry Pi is **Phase 3**.
* **Real-time Data:**
    * WebSocket implementation for UI updates is **Phase 3/4**.
    * Handling incoming MQTT data from devices is **Phase 3/4**.
* **Data Collection:** The `trial_results` and `device_logs` tables and APIs are **Phase 4**.
* **Data Visualization:** All charts and tables for results are **Phase 4**.
* **Advanced Features:** Video streaming, scheduling, and analytics are **Future Enhancements**.

---

## 3. Technical Architecture for This Phase

### 3.1 Component Architecture

This phase establishes the main containers and codebases.

* **Backend (`backend/`)**
    * **Source:** Forked from `fastapi/full-stack-fastapi-template`.
    * **Modifications:**
        * **`app/models/`**:
            * `experiment.py`: **NEW**. Defines `Experiment` SQLAlchemy model.
            * `device.py`: **NEW**. Defines `Device` SQLAlchemy model.
        * **`app/schemas/`**:
            * `experiment.py`: **NEW**. Defines `ExperimentCreate`, `ExperimentUpdate`, `ExperimentInDB` Pydantic schemas.
            * `device.py`: **NEW**. Defines `DeviceCreate`, `DeviceUpdate`, `DeviceInDB` Pydantic schemas.
        * **`app/crud/`**:
            * `crud_experiment.py`: **NEW**. Contains helper functions like `get_experiment`, `create_experiment_with_owner`, `get_multi_by_owner`.
            * `crud_device.py`: **NEW**. Contains `get_device`, `create_device`, `get_multi`.
        * **`app/api/routes/`**:
            * `experiments.py`: **NEW**. Defines the `router` for `/api/experiments` endpoints.
            * `devices.py`: **NEW**. Defines the `router` for `/api/devices` endpoints.
        * **`app/api/deps.py`**:
            * **MODIFY** to include `get_current_active_researcher` (if different from `User`) or `get_current_active_admin` (from template).
        * **`app/main.py`**:
            * **MODIFY** to include the new routers from `experiments.py` and `devices.py`.
        * **`app/core/`**:
            * `mqtt.py`: **NEW**. Defines a simple MQTT client class that connects on startup and logs.

* **Frontend (`frontend/`)**
    * **Source:** Based on the `frontend` in the template.
    * **Modifications:**
        * **`src/app/login/page.tsx`**: **MODIFY/CREATE**. A simple form with email/password fields that calls the backend auth API.
        * **`src/lib/auth.ts`**: **CREATE**. (Or similar) A helper/context (e.g., Zustand/React Context) to manage the user's auth state and token.
        * **`src/app/(dashboard)/layout.tsx`**: **CREATE**. This component will wrap all protected pages. It should check for auth state and redirect to `/login` if unauthorized. It will contain the main sidebar navigation.
        * **`src/app/(dashboard)/page.tsx`**: **CREATE**. The main dashboard landing page (can be a placeholder).
        * **`src/app/(dashboard)/experiments/page.tsx`**: **CREATE**. Placeholder page with `<h1>Experiments</h1>`.
        * **`src/app/(dashboard)/devices/page.tsx`**: **CREATE**. Placeholder page with `<h1>Devices</h1>`.

### 3.2 Data Architecture

* **Tables to Implement (See Section 7.1):**
    * `users`: Provided by the FastAPI template. Verify it matches Section 7.1 of the master doc.
    * `experiments`: **NEW**.
    * `devices`: **NEW**.
* **Tables to Defer:**
    * `experiment_deployments` (Phase 3)
    * `trial_results` (Phase 4)
    * `device_logs` (Phase 4)
* **Migration:**
    * A single new Alembic migration script will be generated (e.g., `alembic revision --autogenerate -m "Add experiment and device tables"`) to add `experiments` and `devices`.
* **Data Flow:**
    1.  **User Creation:** `POST /api/users` (admin) or `POST /api/users/open` (if enabled) -> `crud_user.create` -> `users` table.
    2.  **Experiment Creation:** User logs in, gets JWT. `POST /api/experiments` (with JWT) -> `deps.get_current_active_user` -> `crud_experiment.create_with_owner` -> `experiments` table (with `created_by` foreign key).
    3.  **Device Registration:** `POST /api/devices/register` -> `crud_device.create` -> `devices` table.

### 3.3 Technology Stack

* **Backend:** FastAPI, SQLAlchemy 2.0, Alembic, Pydantic, Python 3.11+
* **Frontend:** Next.js 14, TypeScript, TanStack Query, Tailwind CSS
* **Database:** PostgreSQL 15
* **Communication:** MQTT (Mosquitto), WebSockets (FastAPI - *setup deferred*)
* **Development:** Docker, Docker Compose, Pytest, Black/Ruff
* **Justification:** See Master Doc Section 3.2. We are using the template to avoid reimplementing auth, migrations, and Docker setup.
* **Setup:**
    1.  Fork the template on GitHub to your own account
    2.  `git clone https://github.com/YOUR_USERNAME/full-stack-fastapi-template.git` (into a temporary location)
    3.  Move the template contents to your LICS project root directory (not nested in a subdirectory)
    4.  Follow template instructions to initialize (e.g., configure `.env` file)
    5.  Modify `docker-compose.yml` to add the `mqtt` service (see Section 10.1)
    6.  `docker-compose up -d`

**Important:** Ensure the final structure is:
```
/path/to/LICS/
├── backend/
├── frontend/
├── docker-compose.yml
├── .env
├── mosquitto.conf
├── docs/
└── CLAUDE.md
```
NOT:
```
/path/to/LICS/
└── full-stack-fastapi-template/
    ├── backend/
    └── ...
```

---

## 4. Detailed Implementation Plan

### 4.1 Week-by-Week Breakdown

* **Week 1 Objectives: Setup & Familiarization**
    * **Tasks:**
        * **Technical Spike (CRITICAL):** Validate PsychoPy headless execution on target Raspberry Pi hardware. Ensure drivers and dependencies (e.g., OpenGL) function as expected before building dependent features.
        * Fork/clone the FastAPI template to the LICS root directory.
        * Get the stock-standard template running locally via `docker-compose up`.
        * Create the first superuser via `.env` variable.
        * Log in to the default backend-generated UI and the frontend.
        * **Thoroughly read the template's code.** Understand its auth flow (`deps.py`), database setup (`db/session.py`, `models/user.py`), and configuration (`core/config.py`).
        * Add the `eclipse-mosquitto` service to `docker-compose.yml`.
        * Ensure proper project structure (template at root level, not in subdirectory).
    * **Outputs:** A running, unmodified template; understanding of the codebase; proper directory structure; **Spike Report** confirming Pi compatibility.
    * **Checkpoints:** Can you log in? Do you know where to add a new API router? Is the project structure correct? Does PsychoPy run on the Pi?

* **Week 2 Objectives: Database Models & Migrations**
    * **Tasks:**
        * Create `app/models/experiment.py` and `app/models/device.py` (see Section 7.1 for schemas).
        * Create `app/schemas/experiment.py` and `app/schemas/device.py` (Pydantic models).
        * Import new models into `app/db/base.py` so Alembic can see them.
        * Run `docker-compose exec backend alembic revision --autogenerate -m "Add experiment and device tables"`.
        * Inspect the generated migration file for correctness.
        * Run `docker-compose exec backend alembic upgrade head`.
        * Connect to the PostgreSQL container and verify the tables exist.
    * **Outputs:** Alembic migration script; `experiments` and `devices` tables in the database.
    * **Blockers:** Alembic failing to auto-generate correctly. (Mitigation: Manually edit the migration script).

* **Week 3 Objectives: Core Backend APIs**
    * **Tasks:**
        * Create `app/crud/crud_experiment.py` and `app/crud/crud_device.py`. Implement `create`, `get`, `get_multi`, `update`, `remove` functions.
        * Pay special attention to `crud_experiment.create_with_owner`.
        * Create `app/api/routes/experiments.py` and `app/api/routes/devices.py`.
        * Implement all REST endpoints (see Section 5). Secure them with `deps.get_current_active_user`.
        * Add the new routers to `app/main.py`.
        * Write `pytest` tests for the new CRUD functions and API endpoints. Use the template's `tests/` structure as a guide.
    * **Outputs:** Functional and tested `/api/experiments` and `/api/devices` endpoints.
    * **Checkpoints:** Can you create an experiment via `pytest`? Does it correctly assign the `created_by` field?

* **Week 4 Objectives: Frontend Login & MQTT Connect**
    * **Tasks:**
        * **Frontend:**
            * Build the `app/login/page.tsx` component.
            * Use TanStack Query's `useMutation` to call the `/api/auth/login` endpoint.
            * On success, store the auth state (e.g., in Zustand or React Context).
            * Build the `app/(dashboard)/layout.tsx` to protect routes.
            * Create placeholder pages for `experiments` and `devices`.
        * **Backend:**
            * Create `app/core/mqtt.py`. Implement a simple class that uses `paho-mqtt` to connect to the `mqtt` service (using credentials from `.env`).
            * Log success or failure.
            * Instantiate and call this connection in `app/main.py` on startup.
    * **Outputs:** A frontend where a user can log in and see a dashboard. A backend that logs MQTT connection.
    * **Checkpoints:** Log in as superuser. Are you redirected? Refresh the page. Are you still logged in? Check backend logs. Does it say "Connected to MQTT"?

### 4.2 Task Breakdown (Example)

* **Task:** Implement `experiments` CRUD API
* **Description:** Create the API endpoints for managing `Experiment` records, ensuring they are tied to the user who created them.
* **Prerequisites:** `Experiment` model and schema (Week 2). User auth (from template).
* **Implementation Approach:**
    1.  Create `app/crud/crud_experiment.py`.
    2.  Implement `create_with_owner(db: Session, *, obj_in: ExperimentCreate, user_id: UUID) -> Experiment`.
    3.  Create `app/api/routes/experiments.py`.
    4.  Add a `router = APIRouter()`.
    5.  Implement `POST /` endpoint:
        * `dependencies=[Depends(deps.get_current_active_user)]`
        * Takes `experiment_in: schemas.ExperimentCreate` and `current_user: models.User = Depends(deps.get_current_active_user)`.
        * Calls `crud.experiment.create_with_owner(db=db, obj_in=experiment_in, user_id=current_user.id)`.
    6.  Implement `GET /` endpoint to return `crud.experiment.get_multi_by_owner(db=db, user_id=current_user.id)`.
* **Technical Considerations:**
    * All endpoints *must* be protected.
    * When retrieving or updating a specific experiment (`GET /{id}`, `PUT /{id}`), you must verify that the `current_user` is the owner *or* a superuser. This logic is critical for security.
* **Acceptance Criteria:**
    * `POST /api/experiments` returns a 201 and creates a record with the correct `created_by` ID.
    * `GET /api/experiments` only returns experiments created by the logged-in user.
    * A user *cannot* `GET` or `PUT` an experiment owned by another user.
    * A superuser *can* see all experiments.
* **Testing:** Write Pytest cases for each acceptance criterion.

---

## 5. API and Interface Specifications

* **Endpoint:** `POST /api/auth/login` (from template)
    * **Purpose:** Authenticate a user and set `httpOnly` cookies for session management.
    * **Request:** `application/x-www-form-urlencoded` with `username` (email) and `password`.
    * **Response:** `200 OK` with user details. Cookies are set.
* **Endpoint:** `GET /api/users/me` (from template)
    * **Purpose:** Get the profile of the currently authenticated user.
    * **Auth:** Requires valid auth cookie.
    * **Response:** `200 OK` with `User` schema.
* **Endpoint:** `POST /api/experiments`
    * **Purpose:** Create a new experiment record.
    * **Auth:** `get_current_active_user`
    * **Request format:** `application/json`
        ```json
        {
          "name": "My First Primate Task",
          "description": "A simple task to test the builder.",
          "psyexp_data": { "builder_state": "initial" }
        }
        ```
    * **Response format:** `201 Created`
        ```json
        {
          "id": "a1b2c3d4-...",
          "name": "My First Primate Task",
          "description": "A simple task to test the builder.",
          "psyexp_data": { "builder_state": "initial" },
          "python_code": null,
          "psychojs_code": null,
          "created_by": "e5f6g7h8-...",
          "version": 1,
          "status": "draft",
          "created_at": "2025-11-14T10:00:00Z",
          "updated_at": "2025-11-14T10:00:00Z"
        }
        ```
    * **Error Handling:** `401 Unauthorized`, `422 Unprocessable Entity` (validation error).
* **Endpoint:** `GET /api/experiments`
    * **Purpose:** Get all experiments owned by the current user.
    * **Auth:** `get_current_active_user`
    * **Response format:** `200 OK`
        ```json
        [
          { ... (Experiment schema from above) ... }
        ]
        ```
* **Endpoint:** `POST /api/devices/register`
#### **2. Register Device**
- **Endpoint:** `POST /api/devices/register`
- **Auth:** Required (Shared Secret in Header: `Authorization: Bearer <REGISTRATION_SECRET>`)
- **Description:** Registers a new device or updates an existing one.
- **Request Body:**
  ```json
  {
    "device_id": "mac-address-or-serial",
    "name": "Cage 1 Pi",
    "location": "Room 101",
    "capabilities": { ... }
  }
  ```
- **Response:**
  ```json
  {
    "id": "uuid",
    "status": "registered",
    "api_key": "generated-device-key-for-future-auth" 
  }
  ```
  > **Note:** The `api_key` returned here is for the device to use in Phase 3 for MQTT/API auth. The registration itself is protected by the `REGISTRATION_SECRET`.
    * **Response format:** `201 Created`
        ```json
        {
          "id": "f1g2h3j4-...",
          "device_id": "b8:27:eb:xx:xx:xx",
          "name": "Cage 01 Pi",
          "location": "Cage 01",
          "ip_address": null,
          "last_seen": null,
          "status": "offline",
          "config": {},
          "capabilities": { "screen": "1080p", "feeder": true, "rfid": false },
          "registered_at": "2025-11-14T10:05:00Z"
        }
        ```
    * **Error Handling:** `422 Unprocessable Entity` (if `device_id` is missing or not unique).

---

## 6. User Interface Specifications

* **Component:** `LoginForm` (`app/login/page.tsx`)
    * **Purpose:** Allow users to authenticate.
    * **Visual:** Two `Input` components (Email, Password) and a `Button` (Login).
    * **Interactions:**
        * `onChange` updates local state for email/password.
        * `onSubmit` (on form or button click) triggers `useMutation` hook.
        * While mutation is `isLoading`, button is disabled.
        * If mutation `isError`, display a toast/alert with the error message.
        * If mutation `isSuccess`, auth context is updated, and user is redirected to `/` (which will be the dashboard).
    * **State:** `email`, `password`, `mutation.isLoading`, `mutation.error`.
    * **Integration:** Calls `POST /api/auth/login`.

* **Component:** `DashboardLayout` (`app/(dashboard)/layout.tsx`)
    * **Purpose:** Provides persistent navigation and auth protection.
    * **Visual:** A `Sidebar` component on the left, a `Header` component on top, and a `main` content area.
    * **Interactions:**
        * Sidebar links (`/experiments`, `/devices`) navigate the main content area.
        * Header shows `user.email` and a "Logout" button.
        * "Logout" button clears auth state and redirects to `/login`.
    * **State Management:**
        * This layout *must* check for auth state.
        * A `useAuth()` hook (from context/Zustand) should provide `user` and `isAuthenticated`.
        * If `isAuthenticated` is false, it should use `redirect()` or `router.push()` to send the user to `/login`.
    * **Integration:** Uses `useQuery` to call `GET /api/users/me` to fetch user data on load.

* **Component:** `ExperimentListPage` (Placeholder)
    * **Purpose:** Confirms routing and auth protection.
    * **Visual:** `<h1>Experiments</h1><p>Work in progress. Phase 2.</p>`
    * **State:** None.

---

## 7. Database Implementation

### 7.1 Schema Design (SQLAlchemy Models)

* **`app/models/user.py`** (From template, verify)
    ```python
    class User(Base):
        id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
        email = Column(String, unique=True, index=True, nullable=False)
        hashed_password = Column(String, nullable=False)
        full_name = Column(String)
        is_active = Column(Boolean(), default=True)
        is_superuser = Column(Boolean(), default=False)
        # Timestamps
        created_at = Column(DateTime, default=datetime.utcnow)
        updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
        
        experiments = relationship("Experiment", back_populates="owner", cascade="all, delete-orphan")
    ```

* **`app/models/experiment.py`** (NEW)
    ```python
    import uuid
    from datetime import datetime
    from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, ForeignKey, Enum
    from sqlalchemy.dialects.postgresql import UUID, JSONB
    from sqlalchemy.orm import relationship
    from app.db.base_class import Base

    class ExperimentStatus(str, enum.Enum):
        DRAFT = "draft"
        COMPILED = "compiled"
        DEPLOYED = "deployed"

    class Experiment(Base):
        id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
        name = Column(String, nullable=False, index=True)
        description = Column(Text)
        
        # JSONB for storing the PsychoPy builder state
        psyexp_data = Column(JSONB, nullable=False, default=lambda: {})
        
        # These will be populated in Phase 2
        python_code = Column(Text, nullable=True)
        psychojs_code = Column(Text, nullable=True)
        
        version = Column(Integer, default=1, nullable=False)
        status = Column(Enum(ExperimentStatus), default=ExperimentStatus.DRAFT, nullable=False)
        
        created_at = Column(DateTime, default=datetime.utcnow)
        updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
        
        # Foreign key to User
        created_by = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
        owner = relationship("User", back_populates="experiments")
    ```

* **`app/models/device.py`** (NEW)
    ```python
    import uuid
    from datetime import datetime
    from sqlalchemy import Column, String, Boolean, DateTime, Enum
    from sqlalchemy.dialects.postgresql import UUID, JSONB, INET
    from app.db.base_class import Base

    class DeviceStatus(str, enum.Enum):
        ONLINE = "online"
        OFFLINE = "offline"
        RUNNING = "running"

    class Device(Base):
        id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
        
        # Unique hardware ID (e.g., MAC address)
        device_id = Column(String, unique=True, index=True, nullable=False) 
        
        name = Column(String, nullable=False)
        location = Column(String) # e.g., "Cage 01"
        
        ip_address = Column(INET, nullable=True) # Store current IP
        last_seen = Column(DateTime, nullable=True) # Heartbeat
        status = Column(DeviceStatus, default=DeviceStatus.OFFLINE, nullable=False)
        
        config = Column(JSONB, default=lambda: {}) # Config overrides
        capabilities = Column(JSONB, default=lambda: {}) # Reported hardware
        
        registered_at = Column(DateTime, default=datetime.utcnow)
    ```

### 7.2 Migration Strategy
1.  Add new model files (`experiment.py`, `device.py`).
2.  Import them in `app/db/base.py` (e.g., `from app.models.experiment import Experiment`).
3.  Run `docker-compose exec backend alembic revision --autogenerate -m "Add experiment and device tables"`.
4.  **Manually inspect** the generated script in `backend/alembic/versions/`.
5.  Run `docker-compose exec backend alembic upgrade head` to apply.
6.  **Rollback:**
    *   Command: `docker-compose exec backend alembic downgrade -1` (Reverts the last migration).
    *   **WARNING:** Downgrading will **DROP** the `experiments` and `devices` tables. All data stored in these tables will be **PERMANENTLY LOST**. Ensure you have backups if this is done in a production-like environment.

### 7.3 Queries and Operations (Example CRUD)

* **`app/crud/crud_experiment.py`**
    ```python
    from sqlalchemy.orm import Session
    from app.models.experiment import Experiment
    from app.schemas.experiment import ExperimentCreate, ExperimentUpdate
    from .base import CRUDBase

    class CRUDExperiment(CRUDBase[Experiment, ExperimentCreate, ExperimentUpdate]):
        def create_with_owner(
            self, db: Session, *, obj_in: ExperimentCreate, user_id: UUID
        ) -> Experiment:
            db_obj = Experiment(**obj_in.model_dump(), created_by=user_id)
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj

        def get_multi_by_owner(
            self, db: Session, *, user_id: UUID, skip: int = 0, limit: int = 100
        ) -> list[Experiment]:
            return (
                db.query(self.model)
                .filter(self.model.created_by == user_id)
                .order_by(self.model.name)
                .offset(skip)
                .limit(limit)
                .all()
            )

    experiment = CRUDExperiment(Experiment)
    ```

---

## 8. Testing Strategy for This Phase

### 8.1 Unit Testing
* **Target:** New `crud` functions.
* **Scenarios:**
    * Test `crud.experiment.create_with_owner`: Does it correctly assign `user_id`?
    * Test `crud.experiment.get_multi_by_owner`: Does it only return experiments for that user?
* **Strategy:** Use the template's `db` session fixture. Create mock users and experiments directly in the test DB.

### 8.2 Integration Testing
* **Target:** New API endpoints.
* **Scenarios:**
    * `POST /api/experiments`:
        * Test as unauthenticated user (expect 401).
        * Test as authenticated user (expect 201).
        * Test with invalid data (expect 422).
    * `GET /api/experiments`:
        * Test as User A, create 2 experiments.
        * Test as User B, create 1 experiment.
        * Log in as User A, `GET /api/experiments` (expect 2 experiments).
        * Log in as User B, `GET /api/experiments` (expect 1 experiment).
    * `POST /api/devices/register`:
        * Test with valid data (expect 201).
        * Test with duplicate `device_id` (expect 422).
* **Strategy:** Use the `client` fixture from the template, which provides a `TestClient` for the FastAPI app.

### 8.3 End-to-End Testing
* **Scenarios:**
    * (Manual) User loads frontend -> is redirected to `/login` -> enters superuser credentials -> is redirected to `/` (dashboard) -> clicks "Experiments" link -> sees "Experiments" placeholder page.
* **Tools:** Manual testing for Phase 1. Automated E2E (e.g., Playwright) is out of scope.

### 8.4 Performance Testing
* **None for this phase.** Per Master Doc 1.3, simplicity > scalability.

---

## 9. Security Implementation

* **Authentication:**
    * Implement `POST /api/auth/login` and `GET /api/users/me` from the template. This uses JWTs stored in `httpOnly` cookies, which is the correct and secure approach.
* **Authorization:**
    * All new API endpoints (e.g., `POST /api/experiments`) **must** include `Depends(deps.get_current_active_user)` in their signature.
    * Endpoints that modify *another* user's data (e.g., admin panels) must use `Depends(deps.get_current_active_superuser)`.
    * **CRITICAL:** When editing/deleting an object (e.g., `PUT /api/experiments/{id}`), the endpoint must first retrieve the object, then check `if experiment.created_by != current_user.id and not current_user.is_superuser: raise HTTPException(403)`.
* **Data Validation:**
    * All API endpoints **must** use Pydantic schemas for request bodies and responses. This is our primary defense against injection and malformed data.
* **Vulnerability Assessments:**
    * None for this phase. Rely on the security practices of FastAPI, Pydantic, and the template.

---

## 10. DevOps and Infrastructure

### 10.1 Environment Setup

* **`docker-compose.yml`**:
    ```yaml
    version: '3.8'
    services:
      db:
        image: postgres:15
        environment:
          POSTGRES_DB: ${POSTGRES_DB}
          POSTGRES_USER: ${POSTGRES_USER}
          POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
        volumes:
          - postgres_data:/var/lib/postgresql/data
    
      backend:
        build: ./backend
        ports:
          - "8000:8000"
        environment:
          DATABASE_URL: "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db/${POSTGRES_DB}"
          MQTT_BROKER: "mqtt"
          MQTT_PORT: 1883
          # ... (other .env vars) ...
        volumes:
          - ./backend:/app
          - ./data:/data
        depends_on:
          - db
          - mqtt
    
      frontend:
        build: ./frontend
        ports:
          - "3000:3000"
        environment:
          NEXT_PUBLIC_API_URL: http://localhost:8000
        depends_on:
          - backend
    
      mqtt:
        image: eclipse-mosquitto:2
        ports:
          - "1883:1883"
        volumes:
          - ./mosquitto.conf:/mosquitto/config/mosquitto.conf
          # (Need to add mosquitto.conf for user/pass)
    
    volumes:
      postgres_data:
    ```
* **`.env.example`** (Key variables to add)
    ```
    # Database (from template)
    POSTGRES_SERVER=db
    POSTGRES_PORT=5432
    POSTGRES_DB=lics
    POSTGRES_USER=lics_user
   - `POSTGRES_PASSWORD`: Database password
- `SECRET_KEY`: For JWT generation
- `REGISTRATION_SECRET`: Shared secret for device registration (Critical for security)
- `ALLOWED_ORIGINS`: CORS settings
    MQTT_PORT=1883
    MQTT_USERNAME=lics_mqtt
    MQTT_PASSWORD=mqtt_password
    
    # Application (from template)
    SECRET_KEY=your-secret-key
    FIRST_SUPERUSER=admin@lab.local
    FIRST_SUPERUSER_PASSWORD=admin_password
    ```

### 10.2 CI/CD Pipeline
* The template includes a GitHub Actions workflow. We will use it.
* **Action:** On `push` to a PR, it will:
    1.  Install Python dependencies.
    2.  Run `black --check`.
    3.  Run `ruff`.
    4.  Run `pytest`.
* **Requirement:** All new code must pass these checks before merging to `main`.

### 10.3 Monitoring and Logging
* **Logging:** All logging is to `stdout` within the `backend` container.
* **Monitoring:** View logs with `docker-compose logs -f backend`.
* **Alerting:** None.
* **Debug:** `docker-compose exec backend /bin/bash` to get a shell.

---

## 11. Code Organization and Standards

### 11.1 Project Structure
* We will follow the *exact* project structure from the template (Master Doc 4.1).
* **New Files for this Phase:**
    ```
    lics/
    ├── backend/
    │   ├── app/
    │   │   ├── api/
    │   │   │   ├── routes/
    │   │   │   │   ├── experiments.py  <-- NEW
    │   │   │   │   └── devices.py      <-- NEW
    │   │   ├── core/
    │   │   │   └── mqtt.py           <-- NEW
    │   │   ├── crud/
    │   │   │   ├── crud_experiment.py <-- NEW
    │   │   │   └── crud_device.py     <-- NEW
    │   │   ├── models/
    │   │   │   ├── experiment.py     <-- NEW
    │   │   │   └── device.py         <-- NEW
    │   │   ├── schemas/
    │   │   │   ├── experiment.py     <-- NEW
    │   │   │   └── device.py         <-- NEW
    │   └── alembic/versions/
    │       └── ..._add_exp_dev_tables.py <-- NEW
    ├── frontend/
    │   ├── src/
    │   │   ├── app/
    │   │   │   ├── (dashboard)/          <-- NEW
    │   │   │   │   ├── experiments/
    │   │   │   │   │   └── page.tsx    <-- NEW
    │   │   │   │   ├── devices/
    │   │   │   │   │   └── page.tsx    <-- NEW
    │   │   │   │   └── layout.tsx        <-- NEW
    │   │   │   ├── login/
    │   │   │   │   └── page.tsx        <-- NEW
    │   │   └── lib/
    │   │       └── auth.ts           <-- NEW (or similar)
    └── mosquitto.conf                <-- NEW
    ```

### 11.2 Coding Standards
* **Backend:** Python 3.11+, full type hinting.
* **Formatter:** `black` (enforced by CI).
* **Linter:** `ruff` (enforced by CI).
* **Frontend:** TypeScript, `eslint`/`prettier` from template.
* **Git Workflow:**
    * `main` branch is protected.
    * All work must be done on feature branches (e.g., `feat/phase1-experiment-api`).
    * Branches must be up-to-date with `main` and pass CI to be merged.
    * Pull Requests require at least one review (even if by the same developer).

---

## 12. Dependencies and Prerequisites

### 12.1 External Dependencies
* **FastAPI Full-Stack Template:** The entire phase is a modification of this template.
* **Mosquitto:** The `eclipse-mosquitto:2` Docker image is required.
* **paho-mqtt:** Python library to be added to `backend/requirements.txt`.

### 12.2 Internal Dependencies
* None. This phase is the starting point.

---

## 13. Risk Management

* **Technical Risk:** FastAPI template is overly complex or "opinionated," making modification difficult.
    * **Likelihood:** High.
    * **Mitigation:** **Week 1 is dedicated *only* to reading and understanding the template.** No new code should be written. This "study week" is critical to de-risk modification.
* **Timeline Risk:** 4 weeks is aggressive for a developer new to this stack.
    * **Likelihood:** Medium.
    * **Mitigation:** Defer all non-essential frontend work. A `pytest` that proves the API works is sufficient; a beautiful login page is not. Prioritize backend and API stability.
* **Scope Creep Risk:** Wanting to add more features (e.g., "let's get WebSockets working").
    * **Likelihood:** High.
    * **Mitigation:** **Strict adherence to the "What IS NOT included" list (Section 2.2).** Any requests for such features are immediately deferred to their designated phase.

---

## 14. Phase Completion Checklist

**Week 1 (Setup & Familiarization):**
* [x] `docker-compose up` starts all 4 services (backend, frontend, db, mqtt) without errors.
* [x] MQTT broker running and accessible on ports 1883 and 9001.
* [x] `Superuser` (from `.env`) can log in via the frontend.
* [x] Template codebase thoroughly studied and documented.
* [ ] **Hardware Spike:** PsychoPy verified running on Raspberry Pi (headless).

**Week 2 (Database Models & Migrations) - IN PROGRESS:**
* [ ] `docker-compose exec backend alembic current` shows the latest migration revision.
* [ ] `experiments` and `devices` tables exist in PostgreSQL.

**Week 3 (Core Backend APIs) - PENDING:**
* [ ] `pytest` (in backend container) passes all tests (template + new tests).
* [ ] API call (via Postman or `pytest`) to `POST /api/experiments` successfully creates a record in the `experiments` table.
* [ ] API call (via Postman or `pytest`) to `POST /api/devices/register` successfully creates a record in the `devices` table.

**Week 4 (Frontend Login & MQTT Connect) - PENDING:**
* [ ] Backend logs show "Connected to MQTT broker".
* [ ] Authenticated user is redirected to the dashboard.
* [ ] User can navigate to `/experiments` and `/devices` placeholder pages.

**Final:**
* [ ] All new code is merged into the `main` branch.

---

## 1S. Known Issues and Technical Debt

* **Issue:** The `/api/devices/register` endpoint is unauthenticated. This is a security risk but acceptable for Phase 1 on an isolated lab network. **This must be addressed in Phase 3** (e.g., with a shared secret or device-specific tokens).
* **Debt:** The frontend is a collection of placeholders. Only the `login` page is functional.
* **Debt:** The MQTT client only connects; it does not subscribe, publish, or handle automatic reconnection. This is a placeholder for Phase 3.

---

## 16. Lessons Learned and Retrospective

### Week 1 Completion (2025-11-14)

**Status:** ✅ COMPLETED

**What was accomplished:**
1. ✅ Forked FastAPI Full-Stack Template to GitHub
2. ✅ Cloned template initially into `fastapi-template/full-stack-fastapi-template/` subdirectory
3. ✅ Moved template contents to LICS root directory for proper project structure
4. ✅ Configured `.env` file with LICS-specific settings:
   - PROJECT_NAME: "LICS - Lab Instrument Control System"
   - STACK_NAME: lics
   - Generated secure SECRET_KEY and POSTGRES_PASSWORD
   - FIRST_SUPERUSER: admin@lics.com (Note: Changed from admin@lab.local due to email validation)
   - POSTGRES_DB: lics
   - POSTGRES_USER: lics_user
5. ✅ Successfully deployed all template services via `docker-compose up`
6. ✅ Created superuser account and verified login functionality
7. ✅ Studied template codebase and documented key patterns:
   - Authentication flow (backend/app/api/deps.py)
   - Database setup (backend/app/core/db.py, backend/app/models.py)
   - Configuration management (backend/app/core/config.py)
   - API router registration (backend/app/api/main.py, backend/app/main.py)
8. ✅ Added MQTT service to docker-compose.yml with:
   - eclipse-mosquitto:2 image
   - Ports 1883 (MQTT) and 9001 (WebSocket)
   - Persistent volumes for data and logs
9. ✅ Created mosquitto.conf configuration file with:
   - Anonymous authentication (development mode)
   - MQTT and WebSocket listeners
   - Persistence and logging configuration

---

## Appendix A: JSON Schema Specifications

### A.1 `psyexp_data` Schema
This JSON structure represents the state of the PsychoPy Builder. It is stored in the `experiments` table.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "builder_state": {
      "type": "string",
      "enum": ["initial", "modified", "saved"],
      "description": "Current state of the builder session"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "psychopy_version": { "type": "string" },
        "author": { "type": "string" },
        "created_at": { "type": "string", "format": "date-time" }
      }
    },
    "flow": {
      "type": "array",
      "description": "Ordered list of routines and loops defining the experiment flow",
      "items": {
        "type": "object",
        "properties": {
          "type": { "type": "string", "enum": ["Routine", "LoopInitiator", "LoopTerminator"] },
          "name": { "type": "string" },
          "parameters": { "type": "object" }
        },
        "required": ["type", "name"]
      }
    },
    "routines": {
      "type": "object",
      "description": "Dictionary of routines, where keys are routine names",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "components": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "type": { "type": "string", "enum": ["TextStim", "ImageStim", "Keyboard", "Code", "Sound"] },
                "name": { "type": "string" },
                "parameters": {
                  "type": "object",
                  "description": "Component-specific parameters (e.g., duration, text, image path)"
                }
              },
              "required": ["type", "name", "parameters"]
            }
          }
        },
        "required": ["name", "components"]
      }
    }
  },
  "required": ["metadata", "flow", "routines"]
}
```
10. ✅ Verified MQTT broker running successfully
11. ✅ Reorganized directory structure (moved template to root level)

**What went well:**
* FastAPI Full-Stack Template is well-structured and documented
* Docker setup worked seamlessly once all services were configured
* Template's authentication system is production-ready with JWT + httpOnly cookies
* SQLModel (SQLAlchemy 2.0) provides excellent type safety with Pydantic integration
* Alembic migrations are properly set up and working
* MQTT integration was straightforward

**What could be improved:**
* Initial confusion about directory structure - initially cloned to subdirectory but should have been at root level from the start
* Email validation issue with `.local` TLD - learned that only standard TLDs are accepted
* Better to start services after all configuration is complete rather than incrementally

**Key learnings:**
1. **Email Validation Gotcha:** The `.local` TLD is reserved and rejected by Pydantic's EmailValidator. Use standard TLDs like `.com` even for development.
2. **Project Structure:** The template contents should be at the LICS root level, not nested in a subdirectory:
   - **Correct:** `/Users/beacon/LICS/backend/`, `/Users/beacon/LICS/frontend/`, `/Users/beacon/LICS/docker-compose.yml`
   - **Incorrect:** `/Users/beacon/LICS/fastapi-template/full-stack-fastapi-template/backend/`
   - This ensures proper project structure and cleaner container names (`lics-*` instead of `full-stack-fastapi-template-*`)
3. **Template Structure:** The FastAPI template uses a clean separation:
   - `app/api/deps.py` - Dependency injection for auth and DB sessions
   - `app/api/routes/` - API endpoint definitions
   - `app/crud/` - Database CRUD operations
   - `app/models/` - SQLModel table definitions
   - `app/schemas/` - Pydantic request/response schemas
4. **Router Registration:** New API routers must be:
   - Created in `app/api/routes/`
   - Imported and included in `app/api/main.py` via `api_router.include_router()`
   - The main `api_router` is already included in `app/main.py` with prefix `settings.API_V1_STR`
5. **Docker Compose Changes:** After modifying docker-compose.yml, use `docker-compose down && docker-compose up -d` to ensure new services are created.

**Services Running:**
- PostgreSQL 17 (port 5432) - Database ✅
- FastAPI Backend (port 8000) - API server ✅
- Next.js Frontend (port 5173) - Web interface ✅
- Mosquitto MQTT (ports 1883, 9001) - Device communication ✅
- Adminer (port 8080) - Database admin UI ✅
- Mailcatcher (ports 1025, 1080) - Email testing ✅
- Traefik (ports 80, 8090) - Reverse proxy ✅

**Checkpoint Verification:**
- ✅ Can log in as superuser (admin@lics.com)
- ✅ Understand where to add new API routers (app/api/routes/ + app/api/main.py)
- ✅ MQTT broker connected and running
- ✅ All services healthy

**Next Steps (Week 2):**
- Create `app/models/experiment.py` and `app/models/device.py`
- Create corresponding Pydantic schemas
- Generate Alembic migration
- Verify tables created in PostgreSQL

**Process adjustments for Phase 2:**
* Continue incremental verification after each major change
* Document all gotchas and learnings immediately while context is fresh
* Verify project structure matches documentation before proceeding with development
* Container names should reflect the project name (`lics-*`) for easier identification

---

## 17. Handoff to Next Phase

* **To: Phase 2 (PsychoPy Builder) Team**
* **What is provided:**
    * A stable, authenticated backend API at the LICS root directory
    * A protected frontend dashboard shell
    * The `experiments` API endpoints (`GET`, `POST`, `PUT` on `/api/experiments`) are ready for use
    * The `experiments` table in PostgreSQL, specifically the `psyexp_data` (JSONB) column, is ready to store your builder's state
    * Proper project structure with all services running under the `lics-*` namespace
* **Setup Instructions for Next Phase:**
    1.  Ensure you're working in the correct directory structure:
        ```
        /path/to/LICS/
        ├── backend/
        ├── frontend/
        └── docker-compose.yml
        ```
    2.  `git pull` the `main` branch
    3.  `docker-compose up -d --build`
    4.  Your team will begin work in the `frontend/` directory, primarily by creating a new route `frontend/src/app/(dashboard)/builder/[id]/page.tsx`
    5.  Your builder UI will fetch data from `GET /api/experiments/{id}` and save data using `PUT /api/experiments/{id}`
    6.  Your "Compile" button will trigger a new API endpoint (e.g., `POST /api/experiments/{id}/compile`) that you will build in Phase 2. This endpoint will populate the `python_code` and `psychojs_code` columns