# LICS Manual Testing Guide (Phases 1-2)

## Overview

This document provides comprehensive manual testing procedures for all features implemented in **Phase 1** (Foundation) and **Phase 2** (PsychoPy Builder) of the LICS (Lighthouse Integrated Control System) project.

**Testing Environment:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

**Prerequisites:**
- All Docker services running (`docker-compose up`)
- Database migrations applied
- Superuser account created (`admin@lics.com`)

---

## Phase 1: Foundation - Manual Testing

### 1.1 Authentication & Authorization

#### Test 1.1.1: User Login
**Steps:**
1. Navigate to `http://localhost:5173`
2. Enter credentials:
   - Email: `admin@lics.com`
   - Password: `admin_password`
3. Click "Log In"

**Expected Results:**
- ✅ Redirected to dashboard (`/`)
- ✅ Navigation bar shows "Dashboard", "Experiments", "Devices"
- ✅ User menu shows email and "Sign out" option

**Pass/Fail:** ✅ Pass

---

#### Test 1.1.2: User Logout
**Steps:**
1. From logged-in state, click user menu (email in top-right)
2. Click "Sign out"

**Expected Results:**
- ✅ Redirected to login page
- ✅ Cannot access protected routes (e.g., `/experiments`)
- ✅ Session cleared

**Pass/Fail:** ✅ Pass (Fixed: Enabled beforeLoad guard in _layout.tsx and enhanced logout to clear cache)

**Notes:**
- Route protection guard now active in `/frontend/src/routes/_layout.tsx`
- Logout function clears React Query cache via `queryClient.clear()`
- Frontend rebuild required: `docker-compose build frontend && docker-compose up -d frontend`

---

#### Test 1.1.3: Unauthorized Access Protection
**Steps:**
1. Log out completely
2. Manually navigate to `http://localhost:5173/experiments`

**Expected Results:**
- ✅ Redirected to login page
- ✅ Cannot view experiments without authentication

**Pass/Fail:** ✅ Pass (Fixed: beforeLoad guard prevents unauthenticated route access)

**Notes:** Same fix as Test 1.1.2 - route guard now prevents access before rendering protected content

---

### 1.2 Dashboard

#### Test 1.2.1: Dashboard Display
**Steps:**
1. Log in as admin
2. Navigate to Dashboard (click "Dashboard" or go to `/`)

**Expected Results:**
- ✅ Page title: "Welcome to LICS"
- ✅ Quick stats cards visible (Experiments, Devices counts)
- ✅ Navigation links to Experiments and Devices

**Pass/Fail:** ✅ Pass

---

### 1.3 Experiments Management

#### Test 1.3.1: View Experiments List
**Steps:**
1. Log in
2. Click "Experiments" in navigation
3. Navigate to `/experiments`

**Expected Results:**
- ✅ Page title: "Experiments"
- ✅ "Add Experiment" button visible
- ✅ Table shows existing experiments (if any)
- ✅ Columns: Name, Created At, Actions

**Pass/Fail:** ✅ Pass

---

#### Test 1.3.2: Create New Experiment
**Steps:**
1. From Experiments page, click "Add Experiment"
2. Fill in form:
   - Name: `Test Experiment 001`
   - Description: `Manual testing experiment`
3. Click "Create"

**Expected Results:**
- ✅ Redirected to experiments list
- ✅ Success notification appears
- ✅ New experiment appears in table
- ✅ Experiment shows current timestamp

**Pass/Fail:** ✅ Pass

**Notes:** Experiment ID: No experiment id shown in the table. 

---

#### Test 1.3.3: View Experiment Details
**Steps:**
1. From Experiments list, locate the experiment created in Test 1.3.2
2. Click "View" button

**Expected Results:**
- ✅ Details page shows:
  - Experiment name
  - Description
  - Created timestamp
  - "Edit" and "Delete" buttons
  - "Open Builder" or "Edit in Builder" option

**Pass/Fail:** ✅ Pass (View button added, details page implemented)

**Notes:** Details page is accessible at `/experiments/{id}` and displays all experiment information.

---

#### Test 1.3.4: Edit Experiment
**Steps:**
1. From experiment details or list, click "Edit"
2. Modify:
   - Name: `Test Experiment 001 - Updated`
   - Description: `Updated description`
3. Click "Update"

**Expected Results:**
- ✅ Redirected to experiments list or details
- ✅ Success notification
- ✅ Changes reflected in list/details

**Pass/Fail:** ✅ Pass

---

#### Test 1.3.5: Delete Experiment
**Steps:**
1. From Experiments list, find a test experiment
2. Click "Delete" button
3. Confirm deletion in modal/dialog

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ After confirming, experiment removed from list
- ✅ Success notification

**Pass/Fail:** ✅ Pass

---

### 1.4 Devices Management

#### Test 1.4.1: View Devices List
**Steps:**
1. Click "Devices" in navigation
2. Navigate to `/devices`

**Expected Results:**
- ✅ Page title: "Devices"
- ✅ "Register Device" button visible
- ✅ Table shows devices (if any)
- ✅ Columns: Device ID, Name, Status, Last Seen, Actions

**Pass/Fail:** ✅ Pass

---

#### Test 1.4.2: Register New Device
**Steps:**
1. From Devices page, click "Register Device"
2. Fill in form:
   - Device ID: `RPI-TEST-001`
   - Name: `Test Raspberry Pi`
   - Description: `Manual testing device`
3. Click "Register"

**Expected Results:**
- ✅ Redirected to devices list
- ✅ Success notification
- ✅ New device appears in table
- ✅ Status shows "offline" or "unknown"

**Pass/Fail:** ✅ Pass

**Notes:** 
- Device ID: `RPI-TEST-001`
- API Key generation is currently not implemented in the backend response.

---

#### Test 1.4.3: View Device Details
**Steps:**
1. From Devices list, click device name or "View"
2. Navigate to device details page

**Expected Results:**
- ✅ Device information displayed:
  - Device ID
  - Name
  - Description
  - Status badge (online/offline/running)
  - Last Seen timestamp
  - Configuration (if any)
  - Capabilities (if any)

**Pass/Fail:** ✅ Pass

---

#### Test 1.4.4: Edit Device
**Steps:**
1. From device details, click "Edit"
2. Modify:
   - Name: `Test Raspberry Pi - Updated`
   - Description: `Updated device description`
3. Click "Update"

**Expected Results:**
- ✅ Success notification
- ✅ Changes saved and displayed

**Pass/Fail:** ✅ Pass

---

#### Test 1.4.5: Delete Device
**Steps:**
1. From Devices list, click "Delete" on a test device
2. Confirm deletion

**Expected Results:**
- ✅ Confirmation dialog
- ✅ Device removed from list after confirmation
- ✅ Success notification

**Pass/Fail:** ✅ Pass

---

### 1.5 MQTT Integration (Backend)

#### Test 1.5.1: MQTT Client Status
**Steps:**
1. Check backend logs:
   ```bash
   docker-compose logs backend | grep -i mqtt
   ```

**Expected Results:**
- ✅ Log entry: "MQTT client initialized successfully" or similar
- ✅ Log entry: "Connected to MQTT broker" or similar
- ✅ No MQTT connection errors

**Pass/Fail:** ✅ Pass

---

#### Test 1.5.2: MQTT Broker Accessibility
**Steps:**
1. Check Mosquitto broker is running:
   ```bash
   docker-compose ps | grep mosquitto
   ```
2. Test connection with CLI:
   ```bash
   docker-compose exec mqtt mosquitto_sub -h localhost -t test/# -v
   ```

**Expected Results:**
- ✅ Mosquitto container running
- ✅ Can connect to broker
- ✅ Listening for messages

**Pass/Fail:** ✅ Pass

---

## Phase 2: PsychoPy Builder - Manual Testing

### 2.1 Builder UI Access

#### Test 2.1.1: Navigate to Builder
**Steps:**
1. Log in
2. Go to Experiments list
3. Create or select an experiment
4. Click "Edit in Builder" or navigate to `/builder/{experiment-id}`

**Expected Results:**
- ✅ Builder page loads
- ✅ Page title shows experiment name
- ✅ Three-panel layout visible:
  - Left: Component Palette
  - Center: Canvas (React Flow)
  - Right: Properties Panel (initially empty)
- ✅ Top toolbar with "Save" and "Compile" buttons
- ✅ Two tabs: "Builder" and "Code Preview"

**Pass/Fail:** ✅ Pass 
---

### 2.2 Component Palette

#### Test 2.2.1: View Available Components
**Steps:**
1. In Builder, look at left sidebar (Component Palette)

**Expected Results:**
- ✅ Four component types visible:
  1. **Text Stimulus**
  2. **Image Stimulus**
  3. **Keyboard Response**
  4. **GPIO Output**
- ✅ Each component has icon/label
- ✅ Components are draggable

**Pass/Fail:** ✅ Pass (Fixed: Resolved module loading error by correcting ExperimentsService import)

---

### 2.3 Canvas Operations

#### Test 2.3.1: Add Text Component
**Steps:**
1. Drag "Text Stimulus" from palette onto canvas
2. Drop it in center area

**Expected Results:**
- ✅ New node appears on canvas
- ✅ Node labeled "Text" or similar
- ✅ Node is movable
- ✅ Node is selectable (click to select)

**Pass/Fail:** ✅ Pass 

---

#### Test 2.3.2: Add Keyboard Component
**Steps:**
1. Drag "Keyboard Response" from palette onto canvas
2. Drop it below/next to the Text component

**Expected Results:**
- ✅ New keyboard node appears
- ✅ Node labeled "Keyboard" or similar
- ✅ Both nodes visible on canvas

**Pass/Fail:** ✅ Pass 

---

#### Test 2.3.3: Add Image Component
**Steps:**
1. Drag "Image Stimulus" onto canvas

**Expected Results:**
- ✅ Image node appears
- ✅ Labeled appropriately

**Pass/Fail:** ✅ Pass 

---

#### Test 2.3.4: Add GPIO Component
**Steps:**
1. Drag "GPIO Output" onto canvas

**Expected Results:**
- ✅ GPIO node appears
- ✅ Labeled appropriately

**Pass/Fail:** ✅ Pass 

---

#### Test 2.3.5: Move Nodes
**Steps:**
1. Click and drag any node to a new position
2. Release mouse

**Expected Results:**
- ✅ Node moves smoothly
- ✅ Position updates
- ✅ Node stays where dropped

**Pass/Fail:** ✅ Pass 

---

#### Test 2.3.6: Connect Nodes (Edges)
**Steps:**
1. Hover over a node's edge handle
2. Click and drag to another node
3. Release on target node

**Expected Results:**
- ✅ Edge/connection line appears between nodes
- ✅ Connection stored in state
- ✅ Visual line drawn on canvas

**Pass/Fail:** ✅ Pass 

**Note:** Edge functionality may be limited in current MVP version.

---

#### Test 2.3.7: Delete Node
**Steps:**
1. Select a node (click it)
2. Press `Delete` or `Backspace` key

**Expected Results:**
- ✅ Node removed from canvas
- ✅ Connected edges also removed

**Pass/Fail:** ✅ Pass

---

### 2.4 Properties Panel

#### Test 2.4.1: Select Text Component
**Steps:**
1. Click on Text component node in canvas

**Expected Results:**
- ✅ Properties panel (right sidebar) updates
- ✅ Form shows Text-specific properties:
  - **Text Content** (input field)
  - **Duration (s)** (number input)
  - **Position X** (number input)
  - **Position Y** (number input)

**Pass/Fail:** ✅ Pass (Fixed: Position X/Y now update in real-time when dragging nodes)

**Notes:** Position synchronization was fixed by adding a `useEffect` hook in `TextPropertiesForm.tsx` that watches for node position changes and updates the form fields accordingly.
---

#### Test 2.4.2: Edit Text Properties
**Steps:**
1. With Text component selected, edit properties:
   - Text Content: `Press the spacebar`
   - Duration: `3.0`
   - Position X: `0`
   - Position Y: `100`
2. Click outside or press Tab to confirm changes

**Expected Results:**
- ✅ Values update in form
- ✅ Changes saved to component state
- ✅ No errors in console

**Pass/Fail:** ✅ Pass

---

#### Test 2.4.3: Select Keyboard Component
**Steps:**
1. Click on Keyboard component node

**Expected Results:**
- ✅ Properties panel updates
- ✅ Form shows Keyboard-specific properties:
  - **Allowed Keys** (text input, comma-separated)
  - **Duration (s)** (number, 0 = infinite)
  - **Store Correct** (checkbox)
  - **Correct Answer** (text, conditional visibility)

**Pass/Fail:** ✅ Pass

---

#### Test 2.4.4: Edit Keyboard Properties
**Steps:**
1. With Keyboard selected, edit:
   - Allowed Keys: `space, return`
   - Duration: `5.0`
   - Store Correct: Check ✓
   - Correct Answer: `space`

**Expected Results:**
- ✅ All fields update
- ✅ Correct Answer field appears when Store Correct is checked
- ✅ Changes persist in state

**Pass/Fail:** ✅ Pass

---

#### Test 2.4.5: Deselect Component
**Steps:**
1. Click on empty canvas area (not on a node)

**Expected Results:**
- ✅ Properties panel shows "Select a component to edit properties" message
- ✅ Form is hidden
- ✅ No node highlighted on canvas

**Pass/Fail:** ✅ Pass (Fixed: Added onPaneClick handler to clear selection)

**Notes:** Canvas deselection was fixed by adding an `onPaneClick` callback in `BuilderCanvas.tsx` that sets the selected node to null when clicking on empty canvas area.

---

### 2.5 Save Functionality

#### Test 2.5.1: Save Experiment Design
**Steps:**
1. After adding and configuring components, click "Save" button in toolbar

**Expected Results:**
- ✅ "Saving..." indicator appears (button shows loading state)
- ✅ Success toast notification: "Experiment saved."
- ✅ Button returns to normal state

**Pass/Fail:** ___________

---

#### Test 2.5.2: Verify Data Persistence
**Steps:**
1. After saving, refresh the browser page (F5)
2. Builder loads again

**Expected Results:**
- ✅ All components reappear in same positions
- ✅ All property values preserved
- ✅ Edges/connections preserved

**Pass/Fail:** ___________

---

### 2.6 Compile Functionality

#### Test 2.6.1: Compile Experiment
**Steps:**
1. With components added and saved, click "Compile" button

**Expected Results:**
- ✅ "Compiling..." indicator appears
- ✅ Success toast notification: "Experiment compiled."
- ✅ No error messages

**Pass/Fail:** ___________

---

#### Test 2.6.2: Compile Empty Experiment
**Steps:**
1. Create new experiment or remove all components
2. Save (empty canvas)
3. Click "Compile"

**Expected Results:**
- ✅ Compilation succeeds (base skeleton code generated)
- ✅ Success notification
- ✅ No errors

**Pass/Fail:** ___________

---

### 2.7 Code Preview

#### Test 2.7.1: View Generated Code
**Steps:**
1. After compiling (Test 2.6.1), click "Code Preview" tab

**Expected Results:**
- ✅ Tab switches to Code Preview
- ✅ Monaco Editor displays Python code
- ✅ Syntax highlighting active
- ✅ Code is read-only (cannot edit)

**Pass/Fail:** ___________

---

#### Test 2.7.2: Verify Code Contents - Imports
**Steps:**
1. In Code Preview, scroll to top of code

**Expected Results:**
- ✅ Code contains: `#!/usr/bin/env python3`
- ✅ Code contains: `from psychopy import locale_setup`
- ✅ Code contains: `from psychopy import prefs`
- ✅ Code contains: `from psychopy import sound, gui, visual, core, data, event, logging, clock, colors, layout`
- ✅ Code contains: `import numpy as np`

**Pass/Fail:** ___________

---

#### Test 2.7.3: Verify Code Contents - Window Setup
**Steps:**
1. Find window initialization in code

**Expected Results:**
- ✅ Code contains: `win = visual.Window(`
- ✅ Window size: `size=[1024, 768]`
- ✅ Fullscreen: `fullscr=True`

**Pass/Fail:** ___________

---

#### Test 2.7.4: Verify Code Contents - Text Component
**Steps:**
1. Search for Text component initialization in code

**Expected Results:**
- ✅ Code contains: `visual.TextStim(win=win, ...)`
- ✅ Text property: `text="Press the spacebar"` (from Test 2.4.2)
- ✅ Position: `pos=(0, 100)` or similar

**Pass/Fail:** ___________

---

#### Test 2.7.5: Verify Code Contents - Keyboard Component
**Steps:**
1. Search for Keyboard component in code

**Expected Results:**
- ✅ Code contains: `event.BuilderKeyResponse()`
- ✅ Component initialized correctly

**Pass/Fail:** ___________

---

#### Test 2.7.6: Verify Code Contents - Main Loop
**Steps:**
1. Scroll to main loop section

**Expected Results:**
- ✅ Code contains: `defaultKeyboard = event.Keyboard(backend='ptb')`
- ✅ Code contains: `running = True`
- ✅ Code contains: `while running:`
- ✅ Code contains: `if defaultKeyboard.getKeys(keyList=["escape"]):`
- ✅ Code contains: `core.quit()`
- ✅ Code contains: `win.flip()`

**Pass/Fail:** ___________

---

#### Test 2.7.7: Verify Code Contents - Cleanup
**Steps:**
1. Scroll to bottom of code

**Expected Results:**
- ✅ Code contains: `win.close()`
- ✅ Code contains: `core.quit()`

**Pass/Fail:** ___________

---

#### Test 2.7.8: Code Preview - No Code State
**Steps:**
1. Create new experiment
2. Navigate to Builder
3. Click "Code Preview" tab WITHOUT compiling

**Expected Results:**
- ✅ Message displayed: "No code generated yet. Click 'Compile' to generate Python code."
- ✅ No editor shown
- ✅ No errors

**Pass/Fail:** ___________

---

### 2.8 Complete Workflow Test

#### Test 2.8.1: End-to-End Builder Workflow
**Steps:**
1. Create new experiment: "E2E Test Experiment"
2. Navigate to Builder
3. Add Text component:
   - Text: "Welcome to the experiment"
   - Duration: 2.0
4. Add Keyboard component:
   - Allowed Keys: "space"
   - Duration: 0 (infinite wait)
5. Add Image component:
   - (Leave default properties)
6. Save experiment
7. Compile experiment
8. View Code Preview
9. Verify code contains all three components

**Expected Results:**
- ✅ All steps complete without errors
- ✅ All components visible in code
- ✅ Code is syntactically valid Python
- ✅ All toast notifications appear correctly

**Pass/Fail:** ___________

---

## Backend API Testing (Swagger UI)

### 3.1 API Documentation Access

#### Test 3.1.1: Access Swagger UI
**Steps:**
1. Navigate to `http://localhost:8000/docs`

**Expected Results:**
- ✅ Swagger UI loads
- ✅ API endpoints listed:
  - `/api/login/access-token`
  - `/api/users/`
  - `/api/experiments/`
  - `/api/experiments/{id}/compile`
  - `/api/devices/`
- ✅ Schemas visible

**Pass/Fail:** ___________

---

### 3.2 API Authentication

#### Test 3.2.1: Get Access Token
**Steps:**
1. In Swagger UI, expand `POST /api/login/access-token`
2. Click "Try it out"
3. Enter:
   - `username`: `admin@lics.com`
   - `password`: `changethis`
4. Click "Execute"

**Expected Results:**
- ✅ Response code: `200 OK`
- ✅ Response body contains `access_token`
- ✅ Token type: `bearer`

**Pass/Fail:** ___________

**Notes:** Access Token: ___________

---

#### Test 3.2.2: Authorize Swagger
**Steps:**
1. Click "Authorize" button (top-right in Swagger)
2. Enter: `Bearer {access_token}` from Test 3.2.1
3. Click "Authorize", then "Close"

**Expected Results:**
- ✅ Lock icons turn locked
- ✅ Now authorized to call protected endpoints

**Pass/Fail:** ___________

---

### 3.3 Experiments API

#### Test 3.3.1: List Experiments (GET /api/experiments/)
**Steps:**
1. Expand `GET /api/experiments/`
2. Click "Try it out"
3. Click "Execute"

**Expected Results:**
- ✅ Response code: `200 OK`
- ✅ Response body contains `data` array
- ✅ Each experiment has: `id`, `name`, `description`, `created_at`, `created_by`

**Pass/Fail:** ___________

---

#### Test 3.3.2: Get Single Experiment (GET /api/experiments/{id})
**Steps:**
1. Copy an experiment ID from Test 3.3.1
2. Expand `GET /api/experiments/{id}`
3. Enter the ID
4. Execute

**Expected Results:**
- ✅ Response code: `200 OK`
- ✅ Experiment details returned
- ✅ Fields include: `psyexp_data`, `python_code`, `psychojs_code`

**Pass/Fail:** ___________

---

#### Test 3.3.3: Compile Experiment (POST /api/experiments/{id}/compile)
**Steps:**
1. Use experiment ID with components
2. Expand `POST /api/experiments/{id}/compile`
3. Enter ID
4. Execute

**Expected Results:**
- ✅ Response code: `200 OK`
- ✅ Response includes updated `python_code` field
- ✅ `python_code` is non-null and contains Python script

**Pass/Fail:** ___________

---

### 3.4 Devices API

#### Test 3.4.1: List Devices (GET /api/devices/)
**Steps:**
1. Expand `GET /api/devices/`
2. Execute

**Expected Results:**
- ✅ Response code: `200 OK`
- ✅ Response contains devices array
- ✅ Each device has: `id`, `device_id`, `name`, `status`, `last_seen`

**Pass/Fail:** ___________

---

#### Test 3.4.2: Register Device (POST /api/devices/register)
**Steps:**
1. Expand `POST /api/devices/register`
2. Enter request body:
   ```json
   {
     "device_id": "API-TEST-001",
     "name": "API Test Device",
     "description": "Testing via Swagger"
   }
   ```
3. Execute

**Expected Results:**
- ✅ Response code: `200 OK`
- ✅ Device created
- ✅ Response includes `api_key` (one-time display)

**Pass/Fail:** ___________

---

## Database Verification

### 4.1 Direct Database Inspection

#### Test 4.1.1: Access Adminer
**Steps:**
1. Navigate to `http://localhost:8080`
2. Login:
   - System: PostgreSQL
   - Server: db
   - Username: postgres
   - Password: changethis
   - Database: app

**Expected Results:**
- ✅ Adminer UI loads
- ✅ Successfully connected to database

**Pass/Fail:** ___________

---

#### Test 4.1.2: Verify Tables
**Steps:**
1. In Adminer, view list of tables

**Expected Results:**
- ✅ Table: `user`
- ✅ Table: `experiments`
- ✅ Table: `devices`
- ✅ Table: `alembic_version`
- ✅ Table: `item` (from template, not used)

**Pass/Fail:** ___________

---

#### Test 4.1.3: Inspect Experiments Table
**Steps:**
1. Click on `experiments` table
2. View structure and data

**Expected Results:**
- ✅ Columns: `id`, `name`, `description`, `created_by`, `created_at`, `updated_at`, `psyexp_data`, `python_code`, `psychojs_code`, `is_active`
- ✅ `psyexp_data` type: JSONB
- ✅ `python_code` type: TEXT
- ✅ Data shows experiments created during testing

**Pass/Fail:** ___________

---

#### Test 4.1.4: Inspect psyexp_data Content
**Steps:**
1. Find an experiment with saved builder data
2. Click "show" on `psyexp_data` column

**Expected Results:**
- ✅ JSON structure visible
- ✅ Contains: `react_flow` object
- ✅ Contains: `react_flow.nodes` array
- ✅ Contains: `react_flow.edges` array
- ✅ Contains: `component_props` object

**Pass/Fail:** ___________

---

#### Test 4.1.5: Inspect python_code Content
**Steps:**
1. Find a compiled experiment
2. View `python_code` column

**Expected Results:**
- ✅ Python script stored as text
- ✅ Contains PsychoPy imports
- ✅ Contains component definitions

**Pass/Fail:** ___________

---

## Error Handling & Edge Cases

### 5.1 Builder Error Handling

#### Test 5.1.1: Save Without Changes
**Steps:**
1. In Builder, don't make any changes
2. Click "Save"

**Expected Results:**
- ✅ Save succeeds
- ✅ Success notification shown
- ✅ No errors

**Pass/Fail:** ___________

---

#### Test 5.1.2: Compile Without Saving
**Steps:**
1. Make changes to experiment
2. Click "Compile" WITHOUT clicking Save first

**Expected Results:**
- ✅ Auto-saves before compiling, OR
- ✅ Warning to save first
- ✅ Compilation succeeds

**Pass/Fail:** ___________

---

#### Test 5.1.3: Network Error Simulation
**Steps:**
1. Stop backend: `docker-compose stop backend`
2. In Builder, try to Save

**Expected Results:**
- ✅ Error notification shown
- ✅ User-friendly error message
- ✅ No app crash

**Pass/Fail:** ___________

**Cleanup:** Restart backend: `docker-compose start backend`

---

### 5.2 Authorization Tests

#### Test 5.2.1: Non-Owner Cannot Edit
**Steps:**
1. Create a second user account (if available)
2. Log in as User A, create experiment
3. Log out, log in as User B
4. Try to access User A's experiment via API or direct URL

**Expected Results:**
- ✅ Access denied or not visible in list
- ✅ API returns 403 Forbidden
- ✅ Proper error handling

**Pass/Fail:** ___________

**Note:** If only one user exists, this test can be skipped.

---

## Performance & UX

### 6.1 Response Times

#### Test 6.1.1: Builder Load Time
**Steps:**
1. Note time, navigate to Builder
2. Measure time until fully interactive

**Expected Results:**
- ✅ Page loads in < 3 seconds
- ✅ No lag when dragging components

**Pass/Fail:** ___________

**Time:** _________ seconds

---

#### Test 6.1.2: Compile Time
**Steps:**
1. Create experiment with 10+ components
2. Click Compile
3. Measure time to completion

**Expected Results:**
- ✅ Compilation completes in < 5 seconds
- ✅ No timeout errors

**Pass/Fail:** ___________

**Time:** _________ seconds

---

## Browser Compatibility

### 7.1 Chrome/Chromium
**Status:** ✅ Pass / ❌ Fail

**Notes:** ___________

---

### 7.2 Firefox
**Status:** ✅ Pass / ❌ Fail

**Notes:** ___________

---

### 7.3 Safari
**Status:** ✅ Pass / ❌ Fail

**Notes:** ___________

---

## Test Summary

**Date:** ___________

**Tester:** ___________

**Environment:** ___________

**Overall Status:**
- Phase 1 Tests Passed: _____ / _____
- Phase 2 Tests Passed: _____ / _____
- Total Tests Passed: _____ / _____

**Critical Issues Found:**
1. ___________
2. ___________
3. ___________

**Minor Issues Found:**
1. ___________
2. ___________

**Recommendations:**
___________

---

## Appendix: Sample Test Data

### Sample Experiment Configuration
```json
{
  "name": "Basic Reaction Time Task",
  "description": "Simple RT test with visual stimulus and keyboard response"
}
```

### Sample Component Setup
**Text Component:**
- Text: "Press SPACE when you see the stimulus"
- Duration: 2.0
- Position: (0, 0)

**Keyboard Component:**
- Allowed Keys: "space"
- Duration: 5.0
- Store Correct: true
- Correct Answer: "space"

---

**End of Manual Testing Guide**
