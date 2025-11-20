# LICS Project Progress Tracker

> **Last Updated:** 2025-11-20
> **Overall Progress:** 5% Complete
> **Current Phase:** Phase 1 - Week 1 Complete, Week 2 Not Started
> **Status:** 🔴 Behind Schedule (Week 2 pending)

---

## 📊 Executive Dashboard

```
Project Timeline: 14 Weeks (Dec 2024 - Mar 2025)

Phase 1: Foundation          [████░░░░░░░░░░░░░░░░] 25% (1/4 weeks)
Phase 2: PsychoPy Builder    [░░░░░░░░░░░░░░░░░░░░]  0% (0/4 weeks)
Phase 3: Edge Integration    [░░░░░░░░░░░░░░░░░░░░]  0% (0/2 weeks)
Phase 4: Data & Deployment   [░░░░░░░░░░░░░░░░░░░░]  0% (0/2 weeks)
Phase 5: Polish & Launch     [░░░░░░░░░░░░░░░░░░░░]  0% (0/2 weeks)

Overall:                     [█░░░░░░░░░░░░░░░░░░░]  5%
```

### Quick Stats

| Metric | Target | Current | % |
|--------|--------|---------|---|
| Database Tables | 5 LICS tables | 2 template tables | 0% |
| Backend Models | 8 LICS models | 2 template models | 0% |
| API Endpoints | 25+ LICS endpoints | 9 template endpoints | 0% |
| Frontend Pages | 8-10 LICS pages | 4 template pages | 0% |
| LICS Code Files | ~150 files | 3 files | 2% |

---

## 🎯 Phase-by-Phase Progress

### **PHASE 1: Foundation (Weeks 1-4)** 🚧 **25% Complete**

#### Week 1: Infrastructure Setup ✅ **COMPLETED**

**Estimated Time:** 8-10 hours | **Actual Time:** ~10 hours

- [x] Fork FastAPI Full-Stack Template
- [x] Configure `.env` with LICS-specific settings
- [x] Add MQTT broker (Mosquitto) to `docker-compose.yml`
- [x] Deploy all services via `docker-compose up`
- [x] Create superuser account (`admin@lics.com`)
- [x] Verify all 7 services running:
  - [x] PostgreSQL 17 (port 5432)
  - [x] FastAPI backend (port 8000)
  - [x] Vite frontend (port 5173)
  - [x] Mosquitto MQTT (ports 1883, 9001)
  - [x] Adminer (port 8080)
  - [x] Mailcatcher
  - [x] Traefik proxy
- [x] Study template codebase architecture
- [x] Fix directory structure (moved template to root)
- [x] Create `mosquitto.conf`

**Deliverables:**
- ✅ `/Users/beacon/LICS/.env` - Configured
- ✅ `/Users/beacon/LICS/docker-compose.yml` - Modified
- ✅ `/Users/beacon/LICS/mosquitto.conf` - Created

---

#### Week 2: Core Data Models ✅ **COMPLETED**

**Estimated Time:** 7-10 hours

**Backend Models:**
- [x] Create `/backend/app/models/experiment.py` (2-3 hours)
  - [x] Define `Experiment` SQLModel class
  - [x] Add fields: `id`, `name`, `description`, `created_by`, `created_at`, `updated_at`
  - [x] Add `psyexp_data` (JSONB) field for React Flow state
  - [x] Add `python_code` (TEXT) field for generated script
  - [x] Add `psychojs_code` (TEXT) field for web preview
  - [x] Add `is_active` boolean field
  - [x] Define relationship to `User` model

- [x] Create `/backend/app/models/device.py` (1-2 hours)
  - [x] Define `Device` SQLModel class
  - [x] Add fields: `id`, `device_id` (unique), `name`, `description`
  - [x] Add `status` enum field (online, offline, running)
  - [x] Add `config` (JSONB) field for device settings
  - [x] Add `capabilities` (JSONB) field for hardware info
  - [x] Add `last_seen` timestamp
  - [x] Add `registered_by` foreign key to `User`
  - [x] Add `api_key_hash` for device authentication

**Schemas:**
- [x] Create `/backend/app/schemas/` directory (30 min)
- [x] Create `/backend/app/schemas/experiment.py` (1 hour)
  - [x] `ExperimentCreate` schema
  - [x] `ExperimentUpdate` schema
  - [x] `ExperimentInDB` schema
  - [x] `ExperimentPublic` schema
- [x] Create `/backend/app/schemas/device.py` (1 hour)
  - [x] `DeviceCreate` schema
  - [x] `DeviceUpdate` schema
  - [x] `DeviceInDB` schema
  - [x] `DevicePublic` schema
  - [x] `DeviceRegister` schema (for edge agent registration)

**Database Migrations:**
- [x] Run `alembic revision --autogenerate -m "Add experiment and device tables"` (15 min)
- [x] Review generated migration file (30 min)
- [x] Apply migration: `alembic upgrade head` (5 min)
- [x] Verify tables in PostgreSQL via Adminer (15 min)
  - [x] Verify `experiments` table structure
  - [x] Verify `devices` table structure
  - [x] Verify foreign key constraints
  - [x] Verify JSONB columns

**Testing:**
- [x] Write basic model tests in `/backend/tests/models/` (1 hour)
  - [x] Test `Experiment` model creation
  - [x] Test `Device` model creation
  - [x] Test model validations
  - [x] Test relationships

**Completion Criteria:**
- [x] Both tables exist in PostgreSQL
- [x] Can create experiment via Python shell
- [x] Can create device via Python shell
- [x] All tests pass

---

#### Week 3: CRUD APIs ✅ **COMPLETED**

**Estimated Time:** 10-12 hours

**Backend CRUD:**
- [x] Restructure backend to modular pattern (2 hours)
  - [x] Create `/backend/app/crud/` directory
  - [x] Move existing CRUD to `/backend/app/crud/crud_user.py`
  - [x] Move existing CRUD to `/backend/app/crud/crud_item.py`
  - [x] Delete flat `/backend/app/crud.py` file

- [x] Create `/backend/app/crud/crud_experiment.py` (2 hours)
  - [x] `create_experiment(db, experiment_in, user_id)`
  - [x] `get_experiment(db, experiment_id)`
  - [x] `get_experiments(db, skip, limit, user_id)`
  - [x] `update_experiment(db, experiment_id, experiment_in)`
  - [x] `delete_experiment(db, experiment_id)`

- [x] Create `/backend/app/crud/crud_device.py` (2 hours)
  - [x] `create_device(db, device_in, user_id)`
  - [x] `get_device(db, device_id)`
  - [x] `get_devices(db, skip, limit)`
  - [x] `update_device(db, device_id, device_in)`
  - [x] `delete_device(db, device_id)`
  - [x] `get_device_by_device_id(db, device_id)` (for edge agent lookup)
  - [ ] `update_device_heartbeat(db, device_id)` (Deferred to Week 4/9)

**API Routes:**
- [x] Create `/backend/app/api/routes/experiments.py` (2-3 hours)
  - [x] `GET /api/experiments` - List all experiments (with pagination)
  - [x] `POST /api/experiments` - Create new experiment
  - [x] `GET /api/experiments/{id}` - Get single experiment
  - [x] `PUT /api/experiments/{id}` - Update experiment
  - [x] `DELETE /api/experiments/{id}` - Delete experiment
  - [x] Add proper authentication checks
  - [x] Add ownership validation

- [x] Create `/backend/app/api/routes/devices.py` (2-3 hours)
  - [x] `GET /api/devices` - List all devices
  - [x] `POST /api/devices/register` - Register new device
  - [x] `GET /api/devices/{id}` - Get single device
  - [x] `PUT /api/devices/{id}` - Update device
  - [x] `DELETE /api/devices/{id}` - Delete device
  - [ ] `POST /api/devices/heartbeat` - Update last_seen timestamp (Deferred)
  - [x] Add proper authentication checks

- [x] Register routes in `/backend/app/api/main.py` (15 min)

**Testing:**
- [x] Create `/backend/tests/api/test_experiments.py` (2 hours)
  - [x] Test create experiment (authenticated)
  - [x] Test list experiments (pagination)
  - [x] Test get experiment by ID
  - [x] Test update experiment (ownership check)
  - [x] Test delete experiment (ownership check)
  - [x] Test unauthorized access

- [x] Create `/backend/tests/api/test_devices.py` (2 hours)
  - [x] Test device registration
  - [x] Test list devices
  - [x] Test get device by ID
  - [x] Test update device
  - [ ] Test heartbeat endpoint (Deferred)
  - [x] Test unauthorized access

**Completion Criteria:**
- [x] All API endpoints return 200 for valid requests
- [x] All tests pass (`pytest`)
- [x] Can CRUD experiments via Swagger UI (`/docs`)
- [x] Can CRUD devices via Swagger UI (`/docs`)

---

#### Week 4: Frontend & MQTT Client ⏳ **NOT STARTED**

**Estimated Time:** 12-15 hours

**Frontend Pages:**
- [ ] Create `/frontend/src/routes/_layout/experiments/` directory (3-4 hours)
  - [ ] Create `index.tsx` - Experiments list page
  - [ ] Create `create.tsx` - Create experiment form
  - [ ] Create `[id]/edit.tsx` - Edit experiment form
  - [ ] Add TanStack Query hooks for API calls
  - [ ] Add Chakra UI components (Table, Form, Modal)
  - [ ] Add loading and error states

- [ ] Create `/frontend/src/routes/_layout/devices/` directory (3-4 hours)
  - [ ] Create `index.tsx` - Devices list page
  - [ ] Create `register.tsx` - Register device form
  - [ ] Create `[id]/details.tsx` - Device details page
  - [ ] Add status badges (online/offline/running)
  - [ ] Add last_seen timestamp display
  - [ ] Add TanStack Query hooks for API calls

- [ ] Update `/frontend/src/routes/_layout/index.tsx` (1 hour)
  - [ ] Add dashboard cards for experiments count
  - [ ] Add dashboard cards for devices count
  - [ ] Add quick links to create experiment/device

**MQTT Client:**
- [ ] Install `paho-mqtt` in backend: `pip install paho-mqtt` (5 min)
- [ ] Create `/backend/app/core/mqtt.py` (3-4 hours)
  - [ ] Define `MQTTClient` class
  - [ ] Add `connect()` method
  - [ ] Add `publish(topic, payload)` method
  - [ ] Add `subscribe(topic, callback)` method
  - [ ] Add connection retry logic
  - [ ] Add logging for all MQTT events
  - [ ] Create singleton instance

- [ ] Create `/backend/app/core/mqtt_topics.py` (30 min)
  - [ ] Define constants for all MQTT topics
  - [ ] `DEVICE_COMMAND = "devices/{device_id}/command"`
  - [ ] `DEVICE_STATUS = "devices/{device_id}/status"`
  - [ ] `DEVICE_HEARTBEAT = "devices/{device_id}/heartbeat"`

- [ ] Initialize MQTT client in `/backend/app/main.py` (30 min)
  - [ ] Connect on startup
  - [ ] Disconnect on shutdown
  - [ ] Subscribe to `devices/+/status` wildcard

**Testing:**
- [ ] Test MQTT publish/subscribe locally (1 hour)
  - [ ] Use `mosquitto_pub` and `mosquitto_sub` CLI tools
  - [ ] Verify backend can publish to topics
  - [ ] Verify backend receives messages

**Completion Criteria:**
- [ ] Can view experiments list in browser
- [ ] Can create new experiment via UI
- [ ] Can view devices list in browser
- [ ] MQTT client connects successfully on backend startup
- [ ] Backend logs show successful MQTT connection

---

### **PHASE 2: PsychoPy Builder (Weeks 5-8)** ⏳ **NOT STARTED**

**Dependencies:** Requires Phase 1 completion (Experiments API, MQTT client)

#### Week 5: React Flow Integration ⏳ **NOT STARTED**

**Estimated Time:** 12-15 hours

**Frontend Dependencies:**
- [ ] Install React Flow: `npm install reactflow` (5 min)
- [ ] Install Zustand: `npm install zustand` (5 min)
- [ ] Install React DnD: `npm install react-dnd react-dnd-html5-backend` (5 min)

**Builder Store:**
- [ ] Create `/frontend/src/stores/builderStore.ts` (2-3 hours)
  - [ ] Define `BuilderState` interface
  - [ ] Add `nodes` array state
  - [ ] Add `edges` array state
  - [ ] Add `selectedNode` state
  - [ ] Add actions: `addNode`, `removeNode`, `updateNode`
  - [ ] Add actions: `addEdge`, `removeEdge`
  - [ ] Add action: `loadExperiment(experimentData)`
  - [ ] Add action: `exportExperiment()`

**Builder UI:**
- [ ] Create `/frontend/src/routes/builder/[id].tsx` (4-5 hours)
  - [ ] Import React Flow components
  - [ ] Create canvas area for timeline
  - [ ] Add zoom controls
  - [ ] Add minimap
  - [ ] Connect to Zustand store
  - [ ] Handle node drag and drop
  - [ ] Handle edge creation
  - [ ] Add save button (calls Experiments API)

- [ ] Create `/frontend/src/components/psychopy/ComponentPalette.tsx` (2-3 hours)
  - [ ] Create draggable component list
  - [ ] Add "Text" component icon
  - [ ] Add "Image" component icon
  - [ ] Add "Sound" component icon
  - [ ] Add "Keyboard Response" component icon
  - [ ] Style with Chakra UI

**Custom Node Types:**
- [ ] Create `/frontend/src/components/psychopy/nodes/TextNode.tsx` (1 hour)
- [ ] Create `/frontend/src/components/psychopy/nodes/ImageNode.tsx` (1 hour)
- [ ] Create `/frontend/src/components/psychopy/nodes/SoundNode.tsx` (1 hour)
- [ ] Create `/frontend/src/components/psychopy/nodes/KeyboardNode.tsx` (1 hour)

**Completion Criteria:**
- [ ] Can drag components onto timeline
- [ ] Can connect components with edges
- [ ] Can select and delete nodes
- [ ] Timeline state persists in Zustand store

---

#### Week 6: Properties Panel ⏳ **NOT STARTED**

**Estimated Time:** 10-12 hours

**Properties Panel:**
- [ ] Create `/frontend/src/components/psychopy/PropertiesPanel.tsx` (3-4 hours)
  - [ ] Conditionally render based on `selectedNode.type`
  - [ ] Use React Hook Form for form state
  - [ ] Add real-time updates to Zustand store

**Component Property Forms:**
- [ ] Create `/frontend/src/components/psychopy/properties/TextProperties.tsx` (2 hours)
  - [ ] Text content field
  - [ ] Font size field
  - [ ] Color picker
  - [ ] Position (x, y) fields
  - [ ] Duration field

- [ ] Create `/frontend/src/components/psychopy/properties/ImageProperties.tsx` (2 hours)
  - [ ] File upload field
  - [ ] Position fields
  - [ ] Size fields
  - [ ] Duration field

- [ ] Create `/frontend/src/components/psychopy/properties/SoundProperties.tsx` (1-2 hours)
  - [ ] File upload field
  - [ ] Volume slider
  - [ ] Duration field

- [ ] Create `/frontend/src/components/psychopy/properties/KeyboardProperties.tsx` (2 hours)
  - [ ] Allowed keys multi-select
  - [ ] Store response checkbox
  - [ ] Correct answer field (optional)
  - [ ] Max wait time field

**Validation:**
- [ ] Add Zod schemas for each component type (1 hour)
- [ ] Add validation error display (30 min)

**Completion Criteria:**
- [ ] Selecting a node shows its properties
- [ ] Editing properties updates the node in real-time
- [ ] Invalid inputs show validation errors
- [ ] All fields use appropriate input types

---

#### Week 7: Backend Compiler Foundation ⏳ **NOT STARTED**

**Estimated Time:** 10-12 hours

**Compiler Module:**
- [ ] Create `/backend/app/psychopy/` directory (5 min)
- [ ] Create `/backend/app/psychopy/__init__.py` (5 min)
- [ ] Create `/backend/app/psychopy/compiler.py` (4-5 hours)
  - [ ] Define `compile_experiment(psyexp_data: dict) -> str` function
  - [ ] Parse nodes from React Flow JSON
  - [ ] Sort nodes by timeline position
  - [ ] Validate required fields for each component type
  - [ ] Return Python code as string

- [ ] Create `/backend/app/psychopy/validators.py` (2 hours)
  - [ ] `validate_text_component(node_data)`
  - [ ] `validate_image_component(node_data)`
  - [ ] `validate_sound_component(node_data)`
  - [ ] `validate_keyboard_component(node_data)`
  - [ ] Raise `ValueError` for invalid data

**Jinja2 Templates:**
- [ ] Create `/backend/app/psychopy/templates/` directory (5 min)
- [ ] Create `/backend/app/psychopy/templates/base.py.jinja2` (2-3 hours)
  - [ ] Add PsychoPy imports
  - [ ] Add window initialization code
  - [ ] Add trial loop structure
  - [ ] Add data saving code
  - [ ] Add cleanup code

- [ ] Create `/backend/app/psychopy/templates/components/text.py.jinja2` (1 hour)
- [ ] Create `/backend/app/psychopy/templates/components/image.py.jinja2` (1 hour)
- [ ] Create `/backend/app/psychopy/templates/components/sound.py.jinja2` (1 hour)
- [ ] Create `/backend/app/psychopy/templates/components/keyboard.py.jinja2` (1 hour)

**API Endpoint:**
- [ ] Add `POST /api/experiments/{id}/compile` to experiments route (1 hour)
  - [ ] Load experiment from database
  - [ ] Call `compile_experiment(exp.psyexp_data)`
  - [ ] Save generated code to `exp.python_code`
  - [ ] Return generated code in response

**Testing:**
- [ ] Create `/backend/tests/psychopy/test_compiler.py` (2 hours)
  - [ ] Test simple text component compilation
  - [ ] Test multi-component compilation
  - [ ] Test invalid component data (should raise error)
  - [ ] Test generated code contains PsychoPy imports

**Completion Criteria:**
- [ ] Can compile simple experiment (text + keyboard)
- [ ] Generated code includes all components in order
- [ ] Generated code is valid Python syntax
- [ ] Compilation errors return 400 with clear message

---

#### Week 8: Code Preview & Save ⏳ **NOT STARTED**

**Estimated Time:** 8-10 hours

**Monaco Editor:**
- [ ] Install Monaco: `npm install @monaco-editor/react` (5 min)
- [ ] Create `/frontend/src/components/psychopy/CodePreview.tsx` (2-3 hours)
  - [ ] Import Monaco Editor
  - [ ] Set language to Python
  - [ ] Set theme to VS Dark
  - [ ] Make editor read-only
  - [ ] Add copy button
  - [ ] Add download button

**Builder Integration:**
- [ ] Add "Preview Code" button to builder UI (1 hour)
  - [ ] Call `POST /api/experiments/{id}/compile` on click
  - [ ] Display generated code in Monaco Editor
  - [ ] Show loading spinner during compilation
  - [ ] Show error message if compilation fails

- [ ] Add auto-save functionality (2 hours)
  - [ ] Save to local storage every 30 seconds
  - [ ] Add "Saved" / "Saving..." indicator
  - [ ] Call `PUT /api/experiments/{id}` with `psyexp_data`
  - [ ] Show success/error toast notifications

**Experiment Metadata:**
- [ ] Create `/frontend/src/components/psychopy/ExperimentSettings.tsx` (2-3 hours)
  - [ ] Experiment name field
  - [ ] Description textarea
  - [ ] Window size settings (width, height)
  - [ ] Full screen toggle
  - [ ] Save button

**Testing:**
- [ ] Manual testing of builder workflow (2 hours)
  - [ ] Create experiment with 3-4 components
  - [ ] Verify code preview generates correctly
  - [ ] Verify auto-save works
  - [ ] Verify can reload and continue editing

**Completion Criteria:**
- [ ] Can build experiment with multiple components
- [ ] Can preview generated Python code
- [ ] Can save experiment and reload later
- [ ] Code preview shows valid PsychoPy script
- [ ] **Phase 2 Demo:** User can build simple experiment (text + keyboard), save, compile, and see Python code

---

### **PHASE 3: Edge Integration (Weeks 9-10)** ⏳ **NOT STARTED**

**Dependencies:** Requires Phase 1-2 completion (Experiments API, Compiler)

#### Week 9: Edge Agent Development ⏳ **NOT STARTED**

**Estimated Time:** 12-15 hours

**Edge Agent Directory:**
- [ ] Create `/edge/` directory (5 min)
- [ ] Create `/edge/requirements.txt` (15 min)
  - [ ] Add `paho-mqtt`
  - [ ] Add `psychopy`
  - [ ] Add `requests`
  - [ ] Add `python-dotenv`
  - [ ] Add `sqlalchemy` (for local SQLite cache)

**Edge Agent Core:**
- [ ] Create `/edge/agent.py` (5-6 hours)
  - [ ] Load config from `.env`
  - [ ] Connect to MQTT broker
  - [ ] Implement `register_device()` - POST to `/api/devices/register`
  - [ ] Implement `send_heartbeat()` - runs every 30 seconds
  - [ ] Implement `handle_command(topic, payload)` callback
  - [ ] Parse command: `deploy_experiment`, `stop_experiment`, `restart`
  - [ ] Add logging to console and file

- [ ] Create `/edge/executor.py` (3-4 hours)
  - [ ] Define `execute_experiment(script_path)` function
  - [ ] Run PsychoPy script as subprocess
  - [ ] Capture stdout/stderr
  - [ ] Send trial data via MQTT to `devices/{device_id}/data`
  - [ ] Send logs via MQTT to `devices/{device_id}/logs`
  - [ ] Handle script errors gracefully

- [ ] Create `/edge/hardware.py` (2-3 hours)
  - [ ] Check for GPIO availability (`RPi.GPIO` or mock)
  - [ ] Implement `get_capabilities()` - returns hardware info
  - [ ] Mock GPIO for development on non-Pi machines

**Local SQLite Cache:**
- [ ] Create `/edge/cache.py` (2 hours)
  - [ ] Define SQLite schema for `trial_results` table
  - [ ] Implement `cache_result(trial_data)`
  - [ ] Implement `get_unsynced_results()`
  - [ ] Implement `mark_synced(result_id)`
  - [ ] Auto-sync every 5 minutes if online

**Edge Setup Script:**
- [ ] Create `/edge/setup.sh` (1 hour)
  - [ ] Install Python dependencies
  - [ ] Create systemd service file
  - [ ] Enable auto-start on boot
  - [ ] Add usage instructions

**Completion Criteria:**
- [ ] Agent runs on development machine (with mock GPIO)
- [ ] Agent connects to MQTT broker successfully
- [ ] Agent registers device via API
- [ ] Agent sends heartbeat every 30 seconds

---

#### Week 10: Deployment Pipeline ⏳ **NOT STARTED**

**Estimated Time:** 10-12 hours

**Database Models:**
- [ ] Create `/backend/app/models/experiment_deployment.py` (1-2 hours)
  - [ ] Define `ExperimentDeployment` SQLModel
  - [ ] Fields: `id`, `experiment_id`, `device_id`, `deployed_at`, `status`
  - [ ] Status enum: `pending`, `running`, `completed`, `failed`
  - [ ] Add relationships to `Experiment` and `Device`

- [ ] Create migration for `experiment_deployments` table (30 min)
- [ ] Apply migration and verify table (15 min)

**Deployment API:**
- [ ] Create `/backend/app/crud/crud_deployment.py` (1-2 hours)
  - [ ] `create_deployment(db, experiment_id, device_id)`
  - [ ] `get_deployment(db, deployment_id)`
  - [ ] `get_deployments(db, skip, limit)`
  - [ ] `update_deployment_status(db, deployment_id, status)`

- [ ] Add deployment routes to `/backend/app/api/routes/experiments.py` (2-3 hours)
  - [ ] `POST /api/experiments/{id}/deploy` - Deploy to device
    - [ ] Verify device is online (check `last_seen` < 60 seconds ago)
    - [ ] Create `ExperimentDeployment` record
    - [ ] Publish MQTT message to `devices/{device_id}/command`
    - [ ] Payload: `{"command": "deploy", "script": python_code}`
  - [ ] `GET /api/experiments/{id}/deployments` - List deployments
  - [ ] `GET /api/deployments/{id}/status` - Get deployment status

**MQTT Command Handling:**
- [ ] Update `/edge/agent.py` to handle `deploy_experiment` command (2 hours)
  - [ ] Receive script via MQTT payload
  - [ ] Save script to `/tmp/experiment.py`
  - [ ] Call `executor.execute_experiment("/tmp/experiment.py")`
  - [ ] Publish status update to `devices/{device_id}/status`
  - [ ] Payload: `{"status": "running", "deployment_id": id}`

- [ ] Update backend MQTT client to subscribe to status updates (1-2 hours)
  - [ ] Subscribe to `devices/+/status`
  - [ ] Parse status messages
  - [ ] Update `ExperimentDeployment.status` in database

**Frontend Deployment UI:**
- [ ] Add "Deploy" button to experiment details page (2-3 hours)
  - [ ] Show modal with device selection dropdown
  - [ ] Filter to show only online devices
  - [ ] Call `POST /api/experiments/{id}/deploy`
  - [ ] Show deployment status (pending → running)
  - [ ] Add status badge with color coding

**Testing:**
- [ ] End-to-end deployment test (2 hours)
  - [ ] Create simple experiment in builder
  - [ ] Compile experiment
  - [ ] Start edge agent on local machine
  - [ ] Deploy experiment to local device
  - [ ] Verify script executes
  - [ ] Verify status updates appear in UI

**Completion Criteria:**
- [ ] Can deploy experiment from UI to edge device
- [ ] Edge device receives and executes script
- [ ] Status updates show in real-time in UI
- [ ] **Phase 3 Demo:** Complete flow from design → compile → deploy → execute

---

### **PHASE 4: Data & Deployment (Weeks 11-12)** ⏳ **NOT STARTED**

**Dependencies:** Requires Phase 1-3 completion (Deployment pipeline)

#### Week 11: Trial Data Collection ⏳ **NOT STARTED**

**Estimated Time:** 10-12 hours

**Database Models:**
- [ ] Create `/backend/app/models/trial_result.py` (1-2 hours)
  - [ ] Define `TrialResult` SQLModel
  - [ ] Fields: `id`, `deployment_id`, `trial_number`, `timestamp`
  - [ ] `stimulus` (JSONB) - what was shown
  - [ ] `response` (JSONB) - participant response
  - [ ] `reaction_time` (float)
  - [ ] `correct` (boolean, nullable)
  - [ ] `custom_data` (JSONB) - additional trial data

- [ ] Create `/backend/app/models/device_log.py` (1 hour)
  - [ ] Define `DeviceLog` SQLModel
  - [ ] Fields: `id`, `device_id`, `level`, `message`, `timestamp`
  - [ ] Level enum: `info`, `warning`, `error`

- [ ] Create migration for new tables (30 min)
- [ ] Apply migration and verify (15 min)

**Data Ingestion Pipeline:**
- [ ] Create `/backend/app/core/mqtt_handlers.py` (3-4 hours)
  - [ ] Define `handle_trial_data(device_id, payload)`
    - [ ] Parse trial data from MQTT payload
    - [ ] Create `TrialResult` record in database
    - [ ] Broadcast to WebSocket clients
  - [ ] Define `handle_device_log(device_id, payload)`
    - [ ] Parse log message
    - [ ] Create `DeviceLog` record
    - [ ] Broadcast to WebSocket if level is `error`

- [ ] Update `/backend/app/core/mqtt.py` (1 hour)
  - [ ] Subscribe to `devices/+/data`
  - [ ] Subscribe to `devices/+/logs`
  - [ ] Route messages to handlers

**Edge Agent Updates:**
- [ ] Update `/edge/executor.py` to send trial data (2-3 hours)
  - [ ] Modify PsychoPy template to save trial data as JSON
  - [ ] After each trial, read JSON file
  - [ ] Publish to `devices/{device_id}/data`
  - [ ] Cache locally if MQTT publish fails
  - [ ] Mark as synced after successful publish

**API Endpoints:**
- [ ] Create `/backend/app/api/routes/results.py` (2-3 hours)
  - [ ] `GET /api/deployments/{id}/results` - List trial results
  - [ ] `GET /api/results/{id}` - Get single result
  - [ ] Add filtering: by date range, trial number, correct/incorrect
  - [ ] Add pagination

**Testing:**
- [ ] Run experiment end-to-end and verify data (2 hours)
  - [ ] Deploy simple experiment
  - [ ] Complete 5-10 trials on edge device
  - [ ] Verify all trial results appear in database
  - [ ] Verify timestamps are correct

**Completion Criteria:**
- [ ] Trial data flows from edge → MQTT → database
- [ ] Can view trial results via API
- [ ] Device logs are captured and stored
- [ ] Offline caching works (test by stopping MQTT broker)

---

#### Week 12: WebSocket & Export ⏳ **NOT STARTED**

**Estimated Time:** 10-12 hours

**WebSocket Implementation:**
- [ ] Create `/backend/app/api/routes/websocket.py` (3-4 hours)
  - [ ] Define WebSocket endpoint: `WS /ws`
  - [ ] Implement connection manager (track active connections)
  - [ ] Implement `broadcast(message)` function
  - [ ] Send heartbeat every 30 seconds to keep connection alive
  - [ ] Handle client disconnections

- [ ] Integrate WebSocket with MQTT handlers (1-2 hours)
  - [ ] Broadcast device status changes
  - [ ] Broadcast trial results in real-time
  - [ ] Broadcast deployment status changes
  - [ ] Format messages as `{"type": "...", "data": {...}}`

**Frontend WebSocket Client:**
- [ ] Create `/frontend/src/lib/websocket.ts` (2-3 hours)
  - [ ] Connect to `ws://localhost:8000/ws`
  - [ ] Auto-reconnect on disconnect
  - [ ] Emit events for different message types
  - [ ] Add TypeScript types for message formats

- [ ] Update deployment page with real-time updates (1-2 hours)
  - [ ] Subscribe to WebSocket on page load
  - [ ] Update deployment status badge in real-time
  - [ ] Show trial counter incrementing live
  - [ ] Add connection status indicator

**Data Export:**
- [ ] Create `/backend/app/api/routes/exports.py` (3-4 hours)
  - [ ] `GET /api/deployments/{id}/export/csv` - Export as CSV
    - [ ] Include all trial data columns
    - [ ] Include experiment metadata header
    - [ ] Set proper Content-Disposition header
  - [ ] `GET /api/deployments/{id}/export/json` - Export as JSON
    - [ ] Full trial results with metadata
    - [ ] Pretty-printed JSON
  - [ ] Add summary statistics to export

- [ ] Install export dependencies: `pip install openpyxl` (5 min)
- [ ] Add Excel export: `GET /api/deployments/{id}/export/xlsx` (1-2 hours)

**Frontend Export UI:**
- [ ] Add export buttons to deployment details page (1 hour)
  - [ ] CSV download button
  - [ ] Excel download button
  - [ ] JSON download button
  - [ ] Trigger file download on click

**Completion Criteria:**
- [ ] WebSocket connection works from frontend
- [ ] Trial data appears in real-time without page refresh
- [ ] Can export data to CSV, Excel, and JSON
- [ ] Exported files contain all trial data
- [ ] **Phase 4 Demo:** Complete flow from deploy → collect data → see live updates → export

---

### **PHASE 5: Polish & Launch (Weeks 13-14)** ⏳ **NOT STARTED**

**Dependencies:** Requires Phase 1-4 completion

#### Week 13: Analytics & UI Polish ⏳ **NOT STARTED**

**Estimated Time:** 10-12 hours

**Analytics API:**
- [ ] Create `/backend/app/api/routes/analytics.py` (3-4 hours)
  - [ ] `GET /api/analytics/summary` - Overall stats
    - [ ] Total experiments
    - [ ] Total devices
    - [ ] Total trials collected
    - [ ] Trials this week
  - [ ] `GET /api/analytics/experiment/{id}` - Experiment-specific stats
    - [ ] Total deployments
    - [ ] Total trials
    - [ ] Average reaction time
    - [ ] Accuracy percentage (if applicable)

**Analytics Dashboard:**
- [ ] Install Recharts: `npm install recharts` (5 min)
- [ ] Create `/frontend/src/routes/_layout/analytics.tsx` (4-5 hours)
  - [ ] Summary cards (experiments, devices, trials)
  - [ ] Line chart: trials per day (last 30 days)
  - [ ] Bar chart: trials by experiment
  - [ ] Pie chart: device status distribution

**UI Polish:**
- [ ] Add loading states to all pages (2 hours)
  - [ ] Skeleton loaders for lists
  - [ ] Spinner for buttons during API calls
- [ ] Add empty states (1-2 hours)
  - [ ] "No experiments yet" with CTA button
  - [ ] "No devices registered" with instructions
  - [ ] "No data collected yet"
- [ ] Add error boundaries (1 hour)
  - [ ] Catch and display React errors gracefully
- [ ] Improve form validation messages (1 hour)
  - [ ] Clear, actionable error messages
  - [ ] Field-specific validation feedback

**Completion Criteria:**
- [ ] Analytics dashboard shows meaningful data
- [ ] All pages have proper loading states
- [ ] Empty states guide users to next actions
- [ ] Error handling is graceful

---

#### Week 14: Testing & Documentation ⏳ **NOT STARTED**

**Estimated Time:** 10-12 hours

**E2E Testing:**
- [ ] Setup Playwright for E2E tests (1 hour)
- [ ] Create `/frontend/tests/e2e/auth.spec.ts` (1 hour)
  - [ ] Test login flow
  - [ ] Test logout flow
- [ ] Create `/frontend/tests/e2e/experiments.spec.ts` (2 hours)
  - [ ] Test create experiment
  - [ ] Test open builder
  - [ ] Test save experiment
- [ ] Create `/frontend/tests/e2e/deployment.spec.ts` (2 hours)
  - [ ] Test deploy experiment
  - [ ] Test view results
  - [ ] Test export data

**Documentation:**
- [ ] Create `/docs/USER_GUIDE.md` (2-3 hours)
  - [ ] Getting started
  - [ ] Creating experiments
  - [ ] Using the builder
  - [ ] Deploying to devices
  - [ ] Viewing and exporting data
  - [ ] Add screenshots

- [ ] Create `/docs/SETUP.md` (1-2 hours)
  - [ ] Installation instructions
  - [ ] Environment setup
  - [ ] Running locally
  - [ ] Deploying to production

- [ ] Create `/edge/README.md` (1 hour)
  - [ ] Raspberry Pi setup
  - [ ] Installing the agent
  - [ ] Registering devices
  - [ ] Troubleshooting

**Bug Fixes & Polish:**
- [ ] Fix any known bugs from issue tracker (2-3 hours)
- [ ] Performance optimization review (1 hour)
  - [ ] Check for N+1 queries
  - [ ] Add database indexes if needed
  - [ ] Optimize large data exports

**Production Deployment:**
- [ ] Create production `.env.example` (30 min)
- [ ] Document deployment process (1 hour)
- [ ] Test production build (1 hour)

**Completion Criteria:**
- [ ] E2E tests cover critical user paths
- [ ] User documentation is complete and clear
- [ ] All known bugs are fixed
- [ ] System is ready for production use
- [ ] **🎉 PHASE 5 COMPLETE: Project ready for launch!**

---

## 🗂️ Component Status Matrix

### Database Tables

| Table | Status | Migration | Phase | Week |
|-------|--------|-----------|-------|------|
| `user` | ✅ Complete | ✅ `e2412789c190` | Template | - |
| `item` | ✅ Complete (template) | ✅ `e2412789c190` | Template | - |
| `experiments` | ❌ Missing | ⏳ Pending | Phase 1 | Week 2 |
| `devices` | ❌ Missing | ⏳ Pending | Phase 1 | Week 2 |
| `experiment_deployments` | ❌ Missing | ⏳ Pending | Phase 3 | Week 9 |
| `trial_results` | ❌ Missing | ⏳ Pending | Phase 4 | Week 11 |
| `device_logs` | ❌ Missing | ⏳ Pending | Phase 4 | Week 11 |

### Backend Models

| Model | File Path | Status | Phase | Week |
|-------|-----------|--------|-------|------|
| `User` | `/backend/app/models.py` | ✅ Complete | Template | - |
| `Item` | `/backend/app/models.py` | ✅ Complete | Template | - |
| `Experiment` | `/backend/app/models/experiment.py` | ❌ Missing | Phase 1 | Week 2 |
| `Device` | `/backend/app/models/device.py` | ❌ Missing | Phase 1 | Week 2 |
| `ExperimentDeployment` | `/backend/app/models/experiment_deployment.py` | ❌ Missing | Phase 3 | Week 9 |
| `TrialResult` | `/backend/app/models/trial_result.py` | ❌ Missing | Phase 4 | Week 11 |
| `DeviceLog` | `/backend/app/models/device_log.py` | ❌ Missing | Phase 4 | Week 11 |

### Backend API Routes

| Endpoint | File | Status | Phase | Week |
|----------|------|--------|-------|------|
| `POST /api/v1/login/access-token` | `/backend/app/api/routes/login.py` | ✅ Complete | Template | - |
| `GET /api/v1/users/me` | `/backend/app/api/routes/users.py` | ✅ Complete | Template | - |
| `GET /api/experiments` | `/backend/app/api/routes/experiments.py` | ❌ Missing | Phase 1 | Week 3 |
| `POST /api/experiments` | `/backend/app/api/routes/experiments.py` | ❌ Missing | Phase 1 | Week 3 |
| `GET /api/experiments/{id}` | `/backend/app/api/routes/experiments.py` | ❌ Missing | Phase 1 | Week 3 |
| `PUT /api/experiments/{id}` | `/backend/app/api/routes/experiments.py` | ❌ Missing | Phase 1 | Week 3 |
| `DELETE /api/experiments/{id}` | `/backend/app/api/routes/experiments.py` | ❌ Missing | Phase 1 | Week 3 |
| `POST /api/experiments/{id}/compile` | `/backend/app/api/routes/experiments.py` | ❌ Missing | Phase 2 | Week 7 |
| `POST /api/experiments/{id}/deploy` | `/backend/app/api/routes/experiments.py` | ❌ Missing | Phase 3 | Week 10 |
| `GET /api/devices` | `/backend/app/api/routes/devices.py` | ❌ Missing | Phase 1 | Week 3 |
| `POST /api/devices/register` | `/backend/app/api/routes/devices.py` | ❌ Missing | Phase 1 | Week 3 |
| `GET /api/deployments/{id}/results` | `/backend/app/api/routes/results.py` | ❌ Missing | Phase 4 | Week 11 |
| `GET /api/deployments/{id}/export/csv` | `/backend/app/api/routes/exports.py` | ❌ Missing | Phase 4 | Week 12 |
| `WS /ws` | `/backend/app/api/routes/websocket.py` | ❌ Missing | Phase 4 | Week 12 |
| `GET /api/analytics/summary` | `/backend/app/api/routes/analytics.py` | ❌ Missing | Phase 5 | Week 13 |

### Frontend Pages

| Page | Route | Status | Phase | Week |
|------|-------|--------|-------|------|
| Login | `/routes/login.tsx` | ✅ Complete | Template | - |
| Dashboard | `/routes/_layout/index.tsx` | ✅ Shell only | Template | - |
| User Settings | `/routes/_layout/settings.tsx` | ✅ Complete | Template | - |
| Admin Panel | `/routes/_layout/admin.tsx` | ✅ Complete | Template | - |
| Experiments List | `/routes/_layout/experiments/index.tsx` | ❌ Missing | Phase 1 | Week 4 |
| Create Experiment | `/routes/_layout/experiments/create.tsx` | ❌ Missing | Phase 1 | Week 4 |
| Experiment Builder | `/routes/builder/[id].tsx` | ❌ Missing | Phase 2 | Week 5 |
| Devices List | `/routes/_layout/devices/index.tsx` | ❌ Missing | Phase 1 | Week 4 |
| Device Details | `/routes/_layout/devices/[id]/details.tsx` | ❌ Missing | Phase 1 | Week 4 |
| Analytics Dashboard | `/routes/_layout/analytics.tsx` | ❌ Missing | Phase 5 | Week 13 |

### Frontend Components

| Component | Path | Status | Phase | Week |
|-----------|------|--------|-------|------|
| Component Palette | `/components/psychopy/ComponentPalette.tsx` | ❌ Missing | Phase 2 | Week 5 |
| Properties Panel | `/components/psychopy/PropertiesPanel.tsx` | ❌ Missing | Phase 2 | Week 6 |
| Code Preview | `/components/psychopy/CodePreview.tsx` | ❌ Missing | Phase 2 | Week 8 |
| Text Node | `/components/psychopy/nodes/TextNode.tsx` | ❌ Missing | Phase 2 | Week 5 |
| Image Node | `/components/psychopy/nodes/ImageNode.tsx` | ❌ Missing | Phase 2 | Week 5 |
| Sound Node | `/components/psychopy/nodes/SoundNode.tsx` | ❌ Missing | Phase 2 | Week 5 |
| Keyboard Node | `/components/psychopy/nodes/KeyboardNode.tsx` | ❌ Missing | Phase 2 | Week 5 |

### Infrastructure Components

| Component | Status | Details |
|-----------|--------|---------|
| PostgreSQL 17 | ✅ Running | Port 5432, 2 tables (user, item) |
| FastAPI Backend | ✅ Running | Port 8000, template endpoints only |
| Vite Frontend | ✅ Running | Port 5173, React 19 + Chakra UI |
| MQTT Broker (Mosquitto) | ✅ Running | Ports 1883 (MQTT), 9001 (WebSocket) |
| MQTT Client (Backend) | ❌ Not Implemented | Need to create `/backend/app/core/mqtt.py` |
| Adminer | ✅ Running | Port 8080, database admin UI |
| Traefik Proxy | ✅ Running | Reverse proxy |
| Mailcatcher | ✅ Running | Email testing |

---

## 🔧 Technology Stack Tracker

### Current vs Target Architecture

| Component | Current | Target | Migration Status | Migration Phase |
|-----------|---------|--------|------------------|-----------------|
| **Framework** | React 19 + Vite 7 | Next.js 14 | ⚠️ **MISMATCH** | Between Phase 1-2 |
| **Routing** | TanStack Router | Next.js App Router | ⚠️ **MISMATCH** | Between Phase 1-2 |
| **Styling** | Chakra UI v3 | Tailwind CSS | ⚠️ **MISMATCH** | Between Phase 1-2 |
| **State** | TanStack Query | TanStack Query + Zustand | 🚧 Partial | Phase 2, Week 5 |
| **Build Tool** | Vite | Next.js (webpack) | ⚠️ **MISMATCH** | Between Phase 1-2 |
| **Linter** | Biome | ESLint | ⚠️ **MISMATCH** | Between Phase 1-2 |
| **Backend** | FastAPI ✅ | FastAPI | ✅ Match | - |
| **Database** | PostgreSQL 17 ✅ | PostgreSQL 15+ | ✅ Match | - |
| **ORM** | SQLModel ✅ | SQLModel | ✅ Match | - |

### Frontend Migration Decision

**Recommendation from CLAUDE.md:**
> Complete Phase 1 core features (Experiments, Devices, MQTT) using current stack, then migrate before Phase 2 (PsychoPy Builder UI) to avoid migrating complex React Flow components twice.

**Migration Window:** Between Phase 1 completion and Phase 2 start (after Week 4)

**Migration Checklist (Future):**
- [ ] Create new Next.js 14 app with App Router
- [ ] Set up Tailwind CSS configuration
- [ ] Migrate authentication flow
- [ ] Convert Chakra UI components to Tailwind
- [ ] Migrate routes from TanStack Router to App Router
- [ ] Update data fetching patterns
- [ ] Test feature parity
- [ ] Switch deployment
- [ ] Remove Vite/Chakra dependencies

---

## 🚧 Critical Path & Blockers

### Current Blockers (Phase 1, Week 2)

**MUST COMPLETE BEFORE PROCEEDING:**

1. **No LICS Database Tables** 🔴 **CRITICAL**
   - **Issue:** Only template tables exist (`user`, `item`)
   - **Impact:** Cannot start building LICS features
   - **Action:** Create `experiments` and `devices` models + migration
   - **Estimated Time:** 7-10 hours
   - **Blocking:** All of Week 3-4 work

2. **Backend Structure Not Modular** 🟡 **HIGH**
   - **Issue:** Still using flat `models.py` and `crud.py` files
   - **Impact:** Doesn't follow target architecture
   - **Action:** Restructure to modular directories during Week 3
   - **Estimated Time:** 2 hours
   - **Blocking:** Maintainability, not immediate features

3. **No MQTT Client Implementation** 🟡 **HIGH**
   - **Issue:** MQTT broker running but no application code connects
   - **Impact:** Cannot communicate with edge devices
   - **Action:** Implement `core/mqtt.py` in Week 4
   - **Estimated Time:** 3-4 hours
   - **Blocking:** Phase 3 (Edge Integration)

### Upcoming Risks

**Phase 2 Risks:**
- **Frontend Stack Mismatch** ⚠️ - May delay Phase 2 start by 1-2 weeks if migration needed
- **PsychoPy Code Generation Security** ⚠️ - Jinja2 template injection risk (requires review)
- **React Flow Complexity** ⚠️ - Learning curve for timeline UI

**Phase 3 Risks:**
- **No Physical Raspberry Pi Yet** ⚠️ - Need hardware for testing
- **MQTT Network Debugging** ⚠️ - Can be time-consuming
- **Offline Sync Complexity** ⚠️ - SQLite cache + sync logic

**Phase 4 Risks:**
- **WebSocket Scale** ⚠️ - May need Redis for multiple backend instances (future concern)
- **Large Data Exports** ⚠️ - Need to handle 10,000+ trial results efficiently

---

## 📋 File Inventory

### Existing Files (Template + LICS Config)

**Backend:**
```
✅ /backend/app/main.py                    - FastAPI app initialization
✅ /backend/app/models.py                  - User, Item models (template)
✅ /backend/app/crud.py                    - Flat CRUD file (template)
✅ /backend/app/core/config.py             - Settings
✅ /backend/app/core/db.py                 - Database connection
✅ /backend/app/core/security.py           - JWT, password hashing
✅ /backend/app/api/routes/login.py        - Authentication
✅ /backend/app/api/routes/users.py        - User management
✅ /backend/app/api/routes/items.py        - Template placeholder
✅ /backend/app/api/routes/utils.py        - Health check
✅ /backend/tests/                         - Template tests
✅ /backend/alembic/                       - Migrations
```

**Frontend:**
```
✅ /frontend/src/main.tsx                  - App entry point
✅ /frontend/src/routes/login.tsx          - Login page
✅ /frontend/src/routes/_layout/index.tsx  - Dashboard shell
✅ /frontend/src/routes/_layout/items.tsx  - Template page
✅ /frontend/src/routes/_layout/admin.tsx  - Admin panel
✅ /frontend/src/routes/_layout/settings.tsx - User settings
✅ /frontend/src/components/Common/        - Common UI components
✅ /frontend/src/components/UserSettings/  - Settings components
✅ /frontend/src/lib/                      - Utilities
```

**Infrastructure:**
```
✅ /docker-compose.yml                     - All services
✅ /mosquitto.conf                         - MQTT broker config
✅ /.env                                   - Environment variables
✅ /docs/LICS_Simplified_Documentation.md  - Architecture docs
✅ /docs/implemenation_plan/               - Phase plans
✅ /CLAUDE.md                              - Project instructions
```

### Missing Files (Required for LICS)

**Backend Models (7 files):**
```
❌ /backend/app/models/experiment.py
❌ /backend/app/models/device.py
❌ /backend/app/models/experiment_deployment.py
❌ /backend/app/models/trial_result.py
❌ /backend/app/models/device_log.py
❌ /backend/app/models/__init__.py
```

**Backend Schemas (6 files):**
```
❌ /backend/app/schemas/experiment.py
❌ /backend/app/schemas/device.py
❌ /backend/app/schemas/deployment.py
❌ /backend/app/schemas/result.py
❌ /backend/app/schemas/__init__.py
```

**Backend CRUD (6 files):**
```
❌ /backend/app/crud/crud_experiment.py
❌ /backend/app/crud/crud_device.py
❌ /backend/app/crud/crud_deployment.py
❌ /backend/app/crud/crud_result.py
❌ /backend/app/crud/__init__.py
```

**Backend API Routes (4 files):**
```
❌ /backend/app/api/routes/experiments.py
❌ /backend/app/api/routes/devices.py
❌ /backend/app/api/routes/results.py
❌ /backend/app/api/routes/exports.py
❌ /backend/app/api/routes/websocket.py
❌ /backend/app/api/routes/analytics.py
```

**Backend MQTT (3 files):**
```
❌ /backend/app/core/mqtt.py
❌ /backend/app/core/mqtt_topics.py
❌ /backend/app/core/mqtt_handlers.py
```

**Backend PsychoPy (10+ files):**
```
❌ /backend/app/psychopy/__init__.py
❌ /backend/app/psychopy/compiler.py
❌ /backend/app/psychopy/validators.py
❌ /backend/app/psychopy/templates/base.py.jinja2
❌ /backend/app/psychopy/templates/components/text.py.jinja2
❌ /backend/app/psychopy/templates/components/image.py.jinja2
❌ /backend/app/psychopy/templates/components/sound.py.jinja2
❌ /backend/app/psychopy/templates/components/keyboard.py.jinja2
```

**Frontend Pages (10+ files):**
```
❌ /frontend/src/routes/_layout/experiments/index.tsx
❌ /frontend/src/routes/_layout/experiments/create.tsx
❌ /frontend/src/routes/_layout/experiments/[id]/edit.tsx
❌ /frontend/src/routes/_layout/devices/index.tsx
❌ /frontend/src/routes/_layout/devices/register.tsx
❌ /frontend/src/routes/_layout/devices/[id]/details.tsx
❌ /frontend/src/routes/builder/[id].tsx
❌ /frontend/src/routes/_layout/analytics.tsx
```

**Frontend Components (20+ files):**
```
❌ /frontend/src/stores/builderStore.ts
❌ /frontend/src/components/psychopy/ComponentPalette.tsx
❌ /frontend/src/components/psychopy/PropertiesPanel.tsx
❌ /frontend/src/components/psychopy/CodePreview.tsx
❌ /frontend/src/components/psychopy/ExperimentSettings.tsx
❌ /frontend/src/components/psychopy/nodes/TextNode.tsx
❌ /frontend/src/components/psychopy/nodes/ImageNode.tsx
❌ /frontend/src/components/psychopy/nodes/SoundNode.tsx
❌ /frontend/src/components/psychopy/nodes/KeyboardNode.tsx
❌ /frontend/src/components/psychopy/properties/TextProperties.tsx
❌ /frontend/src/components/psychopy/properties/ImageProperties.tsx
❌ /frontend/src/components/psychopy/properties/SoundProperties.tsx
❌ /frontend/src/components/psychopy/properties/KeyboardProperties.tsx
❌ /frontend/src/lib/websocket.ts
```

**Edge Device (10+ files):**
```
❌ /edge/agent.py
❌ /edge/executor.py
❌ /edge/hardware.py
❌ /edge/cache.py
❌ /edge/setup.sh
❌ /edge/requirements.txt
❌ /edge/README.md
❌ /edge/.env.example
```

**Documentation (4 files):**
```
❌ /docs/USER_GUIDE.md
❌ /docs/SETUP.md
❌ /docs/API.md
```

**Total Missing Files:** ~95 files

---

## 🎯 Quick Reference: Next Actions

### Immediate Next Steps (Week 2)

**Priority 1: Database Models (MUST DO FIRST)**
1. Create `/backend/app/models/experiment.py` (2-3 hours)
2. Create `/backend/app/models/device.py` (1-2 hours)
3. Create schemas directory and schemas (2 hours)
4. Generate and apply migration (1 hour)
5. Verify tables in PostgreSQL (30 min)

**Estimated Total Time:** 7-10 hours

**How to Verify Completion:**
```bash
# Connect to PostgreSQL
docker exec -it lics-db-1 psql -U lics_user -d lics

# Check tables exist
\dt

# Should see:
# experiments
# devices
# (plus existing user, item tables)

# Check experiments table structure
\d experiments

# Try inserting test data
INSERT INTO experiments (name, created_by) VALUES ('Test Exp', '...');
```

### Week 3 Preview

After Week 2 completion:
1. Restructure backend to modular (move crud.py → crud/)
2. Create CRUD modules for experiments and devices
3. Create API routes
4. Write tests

### Week 4 Preview

After Week 3 completion:
1. Build frontend pages for experiments and devices
2. Implement MQTT client
3. Connect frontend to backend APIs

---

## 📈 Success Metrics

### Phase 1 Success Criteria
- [ ] All services running via `docker-compose up`
- [ ] Superuser can login ✅
- [ ] Experiments CRUD works (API + UI)
- [ ] Devices CRUD works (API + UI)
- [ ] MQTT client connects successfully
- [ ] Backend logs show MQTT connection

### Phase 2 Success Criteria
- [ ] Can build simple experiment (text + keyboard)
- [ ] Can preview generated Python code
- [ ] Can save and reload experiment
- [ ] Code preview shows valid PsychoPy script

### Phase 3 Success Criteria
- [ ] Can deploy experiment to edge device
- [ ] Edge device executes script successfully
- [ ] Status updates show in UI
- [ ] Complete flow: design → compile → deploy → execute

### Phase 4 Success Criteria
- [ ] Trial data flows from edge → database
- [ ] Real-time updates appear without page refresh
- [ ] Can export data to CSV/Excel/JSON
- [ ] Offline caching works on edge device

### Phase 5 Success Criteria
- [ ] Analytics dashboard shows meaningful data
- [ ] All critical paths covered by E2E tests
- [ ] User documentation complete
- [ ] System ready for production use

---

## 🔄 How to Update This Tracker

**When you complete a task:**
1. Change `[ ]` to `[x]` for the completed checkbox
2. Update the phase/week percentage at the top
3. Update "Last Updated" date
4. Update overall progress percentage
5. Move items from "Missing Files" to "Existing Files" if applicable

**When you discover new tasks:**
1. Add them to the appropriate phase/week section
2. Add time estimate
3. Add to file inventory if new file
4. Update total file count

**When priorities change:**
1. Update "Critical Path & Blockers" section
2. Adjust time estimates if needed
3. Update risk assessment

---

## 📝 Notes & Gotchas

### Known Issues
- Frontend stack mismatch (React+Vite vs Next.js) - Decision needed before Phase 2
- No physical Raspberry Pi for testing yet - Need for Phase 3
- MQTT broker allows anonymous auth (development mode) - Must disable in production

### Development Tips
- Run `docker-compose logs -f backend` to watch backend logs
- Run `docker-compose logs -f mqtt` to watch MQTT broker logs
- Use Adminer at `http://localhost:8080` to inspect database
- Use `pytest -v` for verbose test output
- Use `alembic history` to see all migrations

### Time Tracking
- Phase 1 estimated: 37-47 hours
- Phase 2 estimated: 40-49 hours
- Phase 3 estimated: 22-27 hours
- Phase 4 estimated: 20-24 hours
- Phase 5 estimated: 20-24 hours
- **Total estimated: 139-171 hours (14 weeks at 10-12 hours/week)**

---

**End of Progress Tracker**

> **Remember:** This is a living document. Update it frequently as you make progress!
