## PHASE 5 DOCUMENTATION: Phase 5: Polish & Launch (Weeks 13-14)

### 1. Phase Overview

This is the final phase of the LICS v1.0 development, transitioning the project from a "feature-complete" state to a "launch-ready" product. The focus shifts from building new core functionality to hardening, polishing, and documenting the system to ensure it is stable, usable, and reliable for researchers.

This phase addresses technical debt accumulated in Phases 1-4, smooths out the user experience (UX), and adds a basic analytics feature to demonstrate the value of the collected data.

#### 1.1 Phase Objectives and Success Criteria

**Objectives:**
* **Implement an Analytics Dashboard:** Create a new page and API endpoint to provide researchers with basic, high-level analytics (e.g., avg. reaction time, % correct) from their `trial_results`.
* **Harden Backend Services:**
    * Implement a "smart" CSV export that correctly flattens nested JSON data (addressing debt from Phase 4).
    * Implement a background scheduler task to sweep for and mark "orphaned" or "stale" devices as offline (addressing risk from Phase 3).
* **Polish Frontend UI/UX:**
    * Address "jank" and perceived slowness by adding loading spinners and skeletons to data-heavy components (e.g., device lists, result tables).
    * Implement "empty state" components to guide users (e.g., "No experiments found. Create one!").
    * Optimize the Builder (Phase 2) by lazy-loading the heavy Monaco code editor.
* **Conduct E2E Testing:** Perform a full, manual end-to-end test of the entire user flow (from login to data analysis) to find and fix bugs.
* **Create User Documentation:** Write a `USER_GUIDE.md` for the end-user (researcher) explaining how to use the system.
* **Create Operational Runbooks:** Write a "Maintenance & Operations" guide for the system administrator (e.g., graduate student) covering backup, log rotation, and disk monitoring.

**Success Criteria:**
* A user can load the new `/analytics` page and see a chart summarizing their experiment data.
* The "Export CSV" button generates a file with columns for all nested keys in `response` and `custom_data`.
* A Raspberry Pi that stops sending heartbeats for 5+ minutes automatically transitions from "online" to "offline" in the UI without manual intervention.
* A Raspberry Pi that stops sending heartbeats for 5+ minutes automatically transitions from "online" to "offline" in the UI without manual intervention.
* **UI Polish Acceptance:**
    * All data lists (Experiments, Devices, Deployments) display a "Loading..." spinner while fetching data.
    * All data lists display a helpful "Empty State" component (icon + text + action button) when no data is present.
    * The Builder page loads the Monaco editor asynchronously, showing a skeleton loader initially.
* A new developer can follow the E2E test script and successfully complete the entire workflow.
* A researcher can read `USER_GUIDE.md` and understand how to provision a Pi and run an experiment.
* An administrator can read the "Maintenance & Operations" section and perform a database backup and restore.

#### 1.2 Why this phase is sequenced at this point in the project
Phases 1-4 were about "making it work." This phase is about "making it *good*." It is the final "quality gate" before handing the system over to users. It logically follows Phase 4 because it relies on the `trial_results` data to build analytics and has a complete system to test and polish.

#### 1.3 Dependencies on previous phases
This phase is dependent on **all** previous phases:
* **Phase 1:** Uses the `devices` table (for the sweeper) and `users` (for auth).
* **Phase 2:** Polishes the Builder UI.
* **Phase 3:** Polishes the device status logic (`orphaned device sweeper`).
* **Phase 4:** Consumes `trial_results` for analytics and polishes the CSV export.

#### 1.4 What must be completed before next phase can begin
This is the final phase of LICS v1.0. Completion of this phase signifies the "launch" of the product. All success criteria must be met. The next "phase" would be v1.1 Maintenance or a v2.0 feature (e.g., video streaming).

#### 1.5 Estimated timeline with buffer considerations
* **Total:** 2 Weeks (as per Master Doc 16.5)
* **Week 13:** Backend (Analytics API, Smart CSV, Device Sweeper) & Analytics UI
* **Week 14:** Frontend Polish (Spinners, Empty States, Lazy Loading), E2E Testing, Bug Fixing, and Documentation.
* **Buffer:** 0.5 Weeks. E2E testing and bug fixing can be unpredictable. The buffer is allocated to Week 14 to ensure all show-stopping bugs are resolved before launch.
* **Total Allotted:** 2.5 Weeks

#### 1.6 Key deliverables and artifacts
* **Backend Code:**
    * New `backend/app/api/routes/analytics.py`
    * New `backend/app/core/tasks.py`
    * Modified `backend/app/crud/crud_trial_result.py`
    * Modified `backend/app/api/routes/results.py`
    * Modified `backend/app/main.py` (to add scheduler)
* **Frontend Code:**
    * New `frontend/src/app/(dashboard)/analytics/page.tsx`
    * New `frontend/src/components/ui/LoadingSpinner.tsx`
    * New `frontend/src/components/ui/EmptyState.tsx`
    * Modified `frontend/src/app/(dashboard)/builder/[id]/page.tsx` (for lazy loading)
    * Various modifications to add loading/empty states.
* **Documentation:**
    * `USER_GUIDE.md` (new file in repository root).
* **Testing:**
    * `E2E_TEST_PLAN.md` (a manual testing script).

---

### 2. Scope Definition

#### 2.1 What IS included in this phase
* **Backend:**
    * **Analytics API:** A new endpoint `GET /api/analytics/summary` that returns aggregated statistics (avg RT, % correct, total trials) for all experiments owned by the user.
    * **"Smart" CSV Export:** Modify the `GET /api/deployments/{id}/export/csv` (from P4) to scan all `trial_results` first, build a *union* of all keys from the `response` and `custom_data` JSON, and use this union as the header.
    * **Orphaned Device Sweeper:** Add `fastapi-apscheduler` to the backend. Create a background job that runs every 5 minutes, finds devices with `status == 'online'` and `last_seen < (now - 5 minutes)`, and updates their `status` to `'offline'`.
* **Frontend:**
    * **Analytics Page:** A new page at `/analytics` that uses `recharts` to display a `BarChart` of the data from the new analytics API. **Scope restricted to SQL aggregations (AVG, COUNT) only.**
    * **UI Polish (Loaders):** Add `LoadingSpinner` components to `DeploymentsList`, `DeviceList`, `DeploymentResultsPage`, and `AnalyticsPage` that display while `useQuery` is `isLoading`.
    * **UI Polish (Empty States):** Create an `EmptyState` component and add it to `ExperimentList`, `DeviceList`, etc., to display when `data.length === 0`.
    * **UI Polish (Optimization):** Use `next/dynamic` to lazy-load the `CodePreview` (Monaco editor) component on the Builder page to improve its initial load time.
* **Documentation:**
    * A top-level `USER_GUIDE.md` written for non-technical researchers.
    * **Operational Runbooks:** A new section in the documentation (or `OPERATIONS.md`) covering:
        1.  **Database Backup:** How to use `pg_dump` to back up the `lics` database.
        2.  **Log Rotation:** How to configure `docker` logging drivers or manually rotate logs to prevent disk fill-up.
        3.  **Disk Monitoring:** Simple commands (`df -h`) to check disk space on the server and Pi.
* **Testing:**
    * A full, manual E2E test-a-thon covering the "golden path" (Login -> Create Exp -> Compile -> Deploy -> Run -> See Live Data -> See Analytics -> Export CSV).
    * Unit tests for the new `get_analytics` CRUD function and the smart CSV export logic.
* **Documentation:**
    * A top-level `USER_GUIDE.md` written for non-technical researchers. It must cover:
        1.  How to provision a new Raspberry Pi (running `edge/setup.sh`).
        2.  How to build a simple experiment.
        3.  How to deploy and run an experiment.
        4.  How to view and export data.

#### 2.2 What IS NOT included in this phase
* **Video Streaming:** This is a v2.0 feature.
* **PsychoJS Web Preview:** This is a major feature, not a polish item (Phase 2 debt).
* **Advanced Analytics:** The analytics page will be simple summaries (AVG, COUNT). No complex charts, graphs, time-series analysis, or statistical analysis (ANOVA, t-tests).
* **Agent Auto-Update:** This is a complex DevOps task deferred to v2.0 (Phase 3 debt).
* **Redis-based WebSockets:** The in-memory `ConnectionManager` is "good enough" for v1.0 (Phase 4 debt).

---

### 3. Technical Architecture for This Phase

#### 3.1 Component Architecture

* **Backend: Analytics Service**
    * **`api/routes/analytics.py` (NEW):**
        * `GET /api/analytics/summary`
        * Auth: `Depends(deps.get_current_active_user)`.
        * Calls `crud.trial_result.get_analytics_summary(db, user_id=current_user.id)`.
        * Returns `list[AnalyticsSummary]` schema.
    * **`crud/crud_trial_result.py` (MODIFY):**
        * `def get_analytics_summary(db: Session, user_id: UUID)`:
            * This function performs a complex SQLAlchemy query.
            * It joins `Experiment` -> `ExperimentDeployment` -> `TrialResult`.
            * Filters by `Experiment.created_by == user_id`.
            * Groups by `Experiment.id`.
            * Selects `Experiment.name`, `func.count(TrialResult.id).label("total_trials")`, `func.avg(TrialResult.reaction_time).label("avg_rt")`, `func.avg(case((TrialResult.correct == True, 1), else_=0)).label("percent_correct")`.
* **Backend: Orphaned Device Sweeper**
    * **`requirements.txt` (MODIFY):** Add `fastapi-apscheduler`.
    * **`main.py` (MODIFY):**
        ```python
        from fastapi_apscheduler import AsyncIOScheduler
        from app.core.tasks import sweep_orphaned_devices
        
        scheduler = AsyncIOScheduler()
        
        @app.on_event("startup")
        async def start_scheduler():
            scheduler.add_job(sweep_orphaned_devices, "interval", minutes=5)
            scheduler.start()
        ```
    * **`core/tasks.py` (NEW):**
        ```python
        from app.db.session import SessionLocal
        from app.crud import crud_device
        
        async def sweep_orphaned_devices():
            """Finds devices that are 'online' but haven't sent a heartbeat in 5 minutes."""
            db = SessionLocal()
            try:
                orphaned_devices = await crud_device.get_orphaned(db)
                for device in orphaned_devices:
                    device.status = "offline"
                    db.add(device)
                await db.commit()
                # logger.info(f"Orphaned device sweep found {len(orphaned_devices)} devices.")
            finally:
                db.close()
        ```
    * **`crud/crud_device.py` (MODIFY):**
        * `def get_orphaned(db: Session)`:
            * `return db.query(Device).filter(Device.status == "online", Device.last_seen < (datetime.utcnow() - timedelta(minutes=5))).all()`
            * 7. `all_headers = base_headers + resp_headers + custom_headers`
            * 8. `yield csv.writer.writerow(all_headers)`
            * 9. Loop through results again. For each `trial`:
                * Build a `row` list.
                * `row.append(trial.trial_number)`...
                * `for k in sorted(response_keys): row.append(trial.response.get(k, "") if trial.response else "")`
                * `for k in sorted(custom_data_keys): row.append(trial.custom_data.get(k, "") if trial.custom_data else "")`
                * `yield csv.writer.writerow(row)`
* **Frontend: Analytics Page**
    * **`package.json` (MODIFY):** Add `"recharts": "^2.x.x"`.
    * **`app/(dashboard)/analytics/page.tsx` (NEW):**
        ```tsx
        "use client";
        import { useQuery } from "@tanstack/react-query";
        import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
        import { api } from "@/lib/api"; // Your API client
        
        const fetchAnalytics = async () => api.get("/analytics/summary").then(res => res.data);
        
        export default function AnalyticsPage() {
          const { data, isLoading } = useQuery({ queryKey: ["analyticsSummary"], queryFn: fetchAnalytics });
        
          if (isLoading) return <LoadingSpinner />;
          if (!data || data.length === 0) return <EmptyState title="No Data" message="Run experiments to see analytics." />;
        
          return (
            <BarChart width={800} height={400} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="experiment_name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percent_correct" fill="#8884d8" />
              <Bar dataKey="avg_rt" fill="#82ca9d" />
            </BarChart>
          );
        }
        ```
* **Frontend: Lazy Loading Monaco**
    * **`app/(dashboard)/builder/[id]/page.tsx` (MODIFY):**
        ```tsx
        import dynamic from 'next/dynamic';
        
        // Lazy load the CodePreview component
        const DynamicCodePreview = dynamic(
          () => import('@/components/builder/CodePreview'), // Adjust path
          { 
            ssr: false, 
            loading: () => <div className="p-4">Loading Code Editor...</div> 
          }
        );
        
        export default function BuilderPage() {
          // ... rest of page logic
          return (
            // ... layout
            <DynamicCodePreview code={experiment.python_code} />
            // ...
          );
        }
        ```

#### 3.2 Data Architecture
* **Database Schemas:** No new tables or columns.
* **Data Models:** No changes.
* **Migration Scripts:** None required for this phase.
* **Data Flow:**
    1.  A new read-only data flow is created: `TrialResult` table -> `crud.get_analytics_summary` -> `GET /api/analytics/summary` -> `AnalyticsPage` -> `Recharts` Bar Chart.
    2.  A new background data flow is created: `fastapi-apscheduler` -> `core.tasks.sweep_orphaned_devices` -> `crud.get_orphaned` -> `UPDATE devices SET status='offline'`.

#### 3.3 Technology Stack
* **Backend (New):**
    * `fastapi-apscheduler`: For the background task. Justification: Lightweight, integrates well with FastAPI's async/startup events.
* **Frontend (New):**
    * `recharts`: For analytics charts. Justification: Popular, simple, and sufficient for bar charts.
    * `next/dynamic`: For lazy loading. Justification: Built-in to Next.js, standard practice for optimizing.
* **Installation:**
    * `backend/`: Add `fastapi-apscheduler` to `requirements.txt`.
    * `frontend/`: Run `npm install recharts`.
    * Rebuild Docker containers: `docker-compose build`.

---

### 4. Detailed Implementation Plan

#### 4.1 Week-by-Week Breakdown

* **Week 13 Objectives: Analytics & Backend Hardening**
    * **Tasks:**
        1.  **DB:** Implement `crud.trial_result.get_analytics_summary`. Write unit tests.
        2.  **Backend:** Implement `GET /api/analytics/summary` endpoint. Write integration test.
        3.  **Frontend:** Build the `app/(dashboard)/analytics/page.tsx` with `recharts` to consume the new endpoint.
        4.  **Backend:** Add `fastapi-apscheduler` and implement the `sweep_orphaned_devices` task.
        5.  **Backend:** Rewrite the `GET .../export/csv` endpoint with the "smart" JSON flattening logic.
    * **Expected Outputs:** A functional `/analytics` page. A background task that (provably) works. A CSV export that handles nested JSON.
    * **Checkpoints:**
        * Can you load `/analytics` and see a chart?
        * Manually set a device's `last_seen` to 10 minutes ago. Does it go "offline" on the next interval?
        * Export a CSV from an experiment with custom data. Are the headers and data correct?

* **Week 14 Objectives: Frontend Polish, E2E Testing, & Docs**
    * **Tasks:**
        1.  **Frontend:** Create `LoadingSpinner.tsx` and `EmptyState.tsx`.
        2.  **Frontend:** Integrate these components into `ExperimentList`, `DeviceList`, `DeploymentResultsPage`, and `AnalyticsPage`.
        3.  **Frontend:** Refactor the Builder page to use `next/dynamic` for the `CodePreview`.
        4.  **Testing:** Write the `E2E_TEST_PLAN.md` manual script.
        5.  **Testing:** Execute the E2E test plan ("test-a-thon"). Find, log, and fix all bugs.
        6.  **Documentation:** Write the `USER_GUIDE.md` and `OPERATIONS.md` (Runbooks).
    * **Expected Outputs:** A smooth, responsive UI. A bug-free E2E test run. A complete user guide.
    * **Checkpoints:** Does the Builder page load faster? Does the UI show spinners? Is the `USER_GUIDE.md` clear enough for a new user?

#### 4.2 Task Breakdown

* **Task:** Implement Analytics API & CRUD Function
    * **Description:** Create the backend components to aggregate `trial_results` for the analytics page.
    * **Prerequisites:** Phase 4 `trial_results` data.
    * **Implementation approach:**
        1.  In `crud/crud_trial_result.py`, add `get_analytics_summary`.
        2.  Use `db.query(...)` with `func.avg`, `func.count`, `case`, `join`, `filter`, and `group_by` as described in 3.1.
        3.  In `api/routes/analytics.py`, create the `GET /api/analytics/summary` endpoint, protect it, and have it call the CRUD function.
    * **Technical considerations:** This query could be slow on millions of trials. For v1.0, this is acceptable. v2.0 might require a materialized view.
    * **Acceptance criteria:** Endpoint returns `200 OK` with correct JSON, filtered by the logged-in user.

* **Task:** Implement "Smart" CSV Export
    * **Description:** Fix the Phase 4 CSV export to correctly handle arbitrary nested JSON.
    * **Prerequisites:** Phase 4 `GET .../export/csv` endpoint.
    * **Implementation approach:**
        1.  Modify the endpoint as described in 3.1.
        2.  The key is the "two-pass" logic: first pass to build headers, second pass to build rows.
        3.  Use a `StreamingResponse` to avoid loading the entire CSV into memory.
    * **Technical considerations:** Ensure all keys are sanitized (e.g., remove commas) if used in headers.
    * **Acceptance criteria:** Exported CSV opens correctly in Excel/Google Sheets. All custom data (e.g., `custom_data.stimulus_name`) appears in its own column.

* **Task:** Implement E2E Test Plan
    * **Description:** Manually test the full, "golden path" user flow to catch integration bugs.
    * **Prerequisites:** A complete, running system.
    * **Implementation approach:**
        1.  Create `E2E_TEST_PLAN.md`.
        2.  Write a script: "Step 1: Open browser, go to `/login`. Step 2: Enter credentials... Step 10: Verify CSV data is correct."
        3.  This test should be run by a developer (or ideally, another team member) who did not build the features.
    * **Acceptance criteria:** The test plan is clear. A run-through of the test plan results in zero "show-stopper" bugs.

---

### 5. API and Interface Specifications

* **Endpoint:** `GET /api/analytics/summary` (NEW)
    * **Purpose:** Get aggregated statistics for all experiments owned by the user.
    * **Auth:** `Depends(deps.get_current_active_user)`.
    * **Request format:** None.
    * **Response format (200 OK):**
        ```json
        [
          {
            "experiment_id": "a1b2c3d4-...",
            "experiment_name": "My First Task",
            "total_trials": 150,
            "avg_rt": 432.8,
            "percent_correct": 0.88
          },
          {
            "experiment_id": "e5f6g7h8-...",
            "experiment_name": "Complex Task",
            "total_trials": 520,
            "avg_rt": 512.2,
            "percent_correct": 0.76
          }
        ]
        ```
    * **Error handling:** `401 Unauthorized`.

* **Endpoint:** `GET /api/deployments/{id}/export/csv` (MODIFIED)
    * **Purpose:** Download trial data, now with flattened JSON columns.
    * **Auth:** `Depends(deps.get_current_active_user)`.
    * **Response format (200 OK):**
        * `Content-Type: text/csv`
        * `Content-Disposition: attachment; filename="deployment_{id}_results.csv"`
        * **Body (Example):**
            ```csv
            trial_number,started_at,reaction_time,correct,response_key_pressed,custom_stimulus
            1,2025-11-28T10:00:01Z,345.0,true,space,image_A.png
            2,2025-11-28T10:00:05Z,450.0,false,j,image_B.png
            ```

---

### 6. User Interface Specifications

* **Component:** `AnalyticsPage` (`app/(dashboard)/analytics/page.tsx`)
    * **Purpose:** Display summary charts for user's data.
    * **Visual Mockup:** A page title "Analytics". A `LoadingSpinner` while `isLoading`. An `EmptyState` if no data. A `recharts` `BarChart` component.
    * **Interactions:** User hovers over bars to see tooltips.
    * **State management:** Manages `useQuery` state (`data`, `isLoading`, `error`).
    * **Integration points:** Calls `GET /api/analytics/summary`.

* **Component:** `LoadingSpinner` (`components/ui/LoadingSpinner.tsx`)
    * **Purpose:** A reusable, centered spinner.
    * **Visual mockup description:** A simple CSS-based or icon-based spinning animation.
    * **Props/inputs:** `size` (optional).

* **Component:** `EmptyState` (`components/ui/EmptyState.tsx`)
    * **Purpose:** A reusable component for when lists are empty.
    * **Visual mockup description:** An icon, a `title` (e.g., "No Experiments Found"), and a `message` (e.g., "Click 'New Experiment' to get started.").
    * **Props/inputs:** `title: string`, `message: string`, `icon?: React.ReactNode`.

* **Component:** `ExperimentList`, `DeviceList`, `DeploymentResultsPage` (MODIFIED)
    * **User interactions:** All components will be modified to use the new UI components.
    * **State management:**
        ```tsx
        const { data, isLoading } = useQuery(...);
        
        if (isLoading) return <LoadingSpinner />;
        if (!data || data.length === 0) return <EmptyState title="No Experiments" ... />;
        
        return (
          // ... list rendering logic ...
        );
        ```

---

### 7. Database Implementation

#### 7.1 Schema Design
* No schema changes.

#### 7.2 Migration Strategy
* No migration script needed.

#### 7.3 Queries and Operations
* **Analytics Summary Query (SQLAlchemy):**
    ```python
    # In crud/crud_trial_result.py
    from sqlalchemy import func, case
    from app.models import Experiment, ExperimentDeployment, TrialResult
    
    def get_analytics_summary(db: Session, user_id: UUID):
        return (
            db.query(
                Experiment.id.label("experiment_id"),
                Experiment.name.label("experiment_name"),
                func.count(TrialResult.id).label("total_trials"),
                func.avg(TrialResult.reaction_time).label("avg_rt"),
                func.avg(
                    case((TrialResult.correct == True, 1), (TrialResult.correct == False, 0), else_=None)
                ).label("percent_correct")
            )
            .join(ExperimentDeployment, Experiment.id == ExperimentDeployment.experiment_id)
            .join(TrialResult, ExperimentDeployment.id == TrialResult.deployment_id)
            .filter(Experiment.created_by == user_id)
            .group_by(Experiment.id, Experiment.name)
            .all()
        )
    ```

---

### 8. Testing Strategy for This Phase

#### 8.1 Unit Testing
* **Target:** `crud.trial_result.get_analytics_summary`
    * **Test cases and scenarios:** Create 2 experiments for User A, 1 for User B. Add trials with different RTs and correct/incorrect responses. Call function for User A. Assert returned data has 2 items and the calculated averages are correct.
* **Target:** `api.routes.results` (Smart CSV)
    * **Test cases and scenarios:** Mock `trial_results` with inconsistent nested JSON. Call the export function. Assert the generated CSV headers and rows are correct.
* **Target:** `core.tasks.sweep_orphaned_devices`
    * **Test cases and scenarios:** Mock `crud.device.get_orphaned` to return 2 devices. Assert that `db.commit` is called and the devices' statuses are updated.

#### 8.2 Integration Testing
* **Target:** `GET /api/analytics/summary`
    * **Test scenarios and flows:** Use `pytest` client. Create user, experiments, and trials. Log in as user. Call endpoint. Assert 200 OK and response body matches expected calculations.
* **Target:** Orphaned Device Sweeper
    * **Test scenarios and flows:** (Manual or complex `pytest`) Add a device. Set its `status` to `online` and `last_seen` to 10 minutes ago. Trigger the `sweep_orphaned_devices` function. Query the DB to assert its status is now `offline`.

#### 8.3 End-to-End Testing
* **Scenario:** "The Golden Path"
    1.  **Login:** Open browser to `/login`, enter `admin@lab.local` credentials.
    2.  **Create:** Go to `/experiments`. See "Empty State". Click "New Experiment". Create "E2E Test".
    3.  **Compile:** Go to Builder. Drag Text + Keyboard. Click Save. Click Compile. See code in lazy-loaded editor.
    4.  **Provision:** (Manually) Run `edge/setup.sh` on a Pi. Start `agent.py`.
    5.  **Check Device:** Go to `/devices`. See "E2E-Pi" status is "online".
    6.  **Deploy:** Go to `/experiments`, click "Deploy" on "E2E Test". Select "E2E-Pi".
    7.  **Run:** (Pi) Agent receives command, runs script. (Manually) Mock 3 trials (2 correct, 1 incorrect) with data.
    8.  **Live Data:** Go to `/deployments/[id]`. See the 3 trials appear *live*. See status change to "completed".
    9.  **Analytics:** Go to `/analytics`. See "E2E Test" bar with `total_trials=3`, `percent_correct=0.66`.
    10. **Export:** Go back to results, click "Export CSV". Open file. Verify all custom data is present in columns.
    11. **Orphan:** (Manually) Stop the `agent.py` on the Pi. Wait 5-6 minutes.
    12. **Check Orphan:** Go to `/devices`. Verify "E2E-Pi" status is now "offline".

#### 8.4 Performance Testing
* **Target:** Builder page load.
    * **Performance metrics to measure:** Chrome DevTools Lighthouse score / Time to Interactive.
    * **Acceptance thresholds:** Must be noticeably faster than before lazy-loading.
* **Target:** `GET /api/analytics/summary`
    * **Performance metrics to measure:** Response time.
    * **Load testing scenarios:** Seed DB with 10,000 `trial_results`.
    * **Acceptance thresholds:** Response time should be < 2 seconds.

---

### 9. Security Implementation

* **Authentication:** The new `GET /api/analytics/summary` endpoint **must** be protected by `Depends(deps.get_current_active_user)`.
* **Authorization:** The `get_analytics_summary` CRUD function **must** filter by `user_id`. This is the critical security boundary to prevent one user from seeing another user's private research data.
* **Data Validation:** Not applicable as new endpoints are read-only.
* **Secure Coding:** The "Smart" CSV export must sanitize headers (e.g., strip special characters) to prevent CSV injection attacks, though this is a low risk.

---

### 10. DevOps and Infrastructure

#### 10.1 Environment Setup
* **Backend:** Add `fastapi-apscheduler` to `backend/requirements.txt`.
* **Frontend:** Run `npm install recharts` in `frontend/`.
* **Action:** All developers must run `docker-compose build` to rebuild their backend container and install new NPM packages.

#### 10.2 CI/CD Pipeline
* The existing CI pipeline (Pytest, Ruff, Black) will cover the new backend unit tests. No changes are required.

#### 10.3 Monitoring and Logging
* **CRITICAL:** The `sweep_orphaned_devices` task in `core/tasks.py` **must** include logging.
    ```python
    import logging
    logger = logging.getLogger(__name__)
    
    async def sweep_orphaned_devices():
        # ...
        if orphaned_devices:
            logger.info(f"Orphaned device sweep: Marked {len(orphaned_devices)} devices as offline.")
        else:
            logger.info("Orphaned device sweep: No devices found.")
    ```
* This is the *only* way to confirm the background task is running and working correctly.
    
#### 10.4 Maintenance & Operations (Runbooks)
* **Database Backup:**
    * Command: `docker-compose exec db pg_dump -U lics_user lics > backup_$(date +%F).sql`
    * Restore: `cat backup.sql | docker-compose exec -T db psql -U lics_user lics`
* **Log Management:**
    * Docker logs can grow indefinitely.
    * Mitigation: Configure `daemon.json` or `docker-compose.yml` with `logging: driver: "json-file", options: { "max-size": "10m", "max-file": "3" }`.
* **Disk Space:**
    * Alerting is out of scope, but the `OPERATIONS.md` should advise checking `df -h` monthly.

---

### 11. Code Organization and Standards

#### 11.1 Project Structure
* **New Files:**
    ```
    lics/
    ├── backend/app/
    │   ├── api/routes/
    │   │   └── analytics.py      <-- NEW
    │   └── core/
    │       └── tasks.py          <-- NEW
    ├── frontend/src/
    │   ├── app/(dashboard)/
    │   │   └── analytics/
    │   │       └── page.tsx      <-- NEW
    │   └── components/ui/
    │       ├── LoadingSpinner.tsx  <-- NEW
    │       └── EmptyState.tsx      <-- NEW
    ├── E2E_TEST_PLAN.md            <-- NEW
    └── USER_GUIDE.md               <-- NEW
    ```
* **Modified Files:**
    * `backend/app/main.py` (add scheduler)
    * `backend/app/crud/crud_trial_result.py` (add analytics query)
    * `backend/app/crud/crud_device.py` (add orphan query)
    * `backend/app/api/routes/results.py` (smart CSV)
    * `frontend/src/app/(dashboard)/builder/[id]/page.tsx` (lazy load)
    * `frontend/src/app/(dashboard)/experiments/page.tsx` (add polish)
    * `frontend/src/app/(dashboard)/devices/page.tsx` (add polish)
    * `frontend/src/app/(dashboard)/deployments/[id]/page.tsx` (add polish)

#### 11.2 Coding Standards
* All new UI components must be responsive.
* All new backend logic must have corresponding unit tests.
* `USER_GUIDE.md` should be written for a non-technical audience.

---

### 12. Dependencies and Prerequisites

#### 12.1 External Dependencies
* `fastapi-apscheduler` (PyPI): For background tasks.
* `recharts` (NPM): For analytics charts.

#### 12.2 Internal Dependencies
* A fully functional Phase 1-4 system.
* `trial_results` data must exist in the database for the analytics page to be meaningful.

---

### 13. Risk Management

* **Technical Risk 1: Analytics Query is Too Slow**
    * **Likelihood:** Medium.
    * **Mitigation:** We already added indexes in Phase 4 (`trial_results.deployment_id`). We will add another on `Experiment.created_by` (from P2). This should be sufficient for v1.0. If not, we will have to defer analytics to v1.1.
* **Technical Risk 2: Background Scheduler Has Bugs**
    * **Likelihood:** Medium. Background tasks can be tricky.
    * **Mitigation:** Heavy logging (see 10.3) and thorough integration testing (see 8.2).
* **Timeline Risk: "UI Polish" becomes a "time sink"**
    * **Likelihood:** High. Polish is subjective.
    * **Mitigation:** **Strict time-boxing.** The polish tasks (spinners, empty states) are allocated 2-3 days max. "Good enough" is the goal, not "pixel perfect."
* **Timeline Risk: E2E Testing reveals major bugs**
    * **Likelihood:** High. This is the *purpose* of E2E testing.
    * **Mitigation:** The 0.5-week buffer is allocated *specifically* for fixing bugs found in this step.

---

### 14. Phase Completion Checklist

* [ ] `GET /api/analytics/summary` endpoint is functional and secure.
* [ ] `/analytics` page loads and displays a chart.
* [ ] `GET .../export/csv` correctly flattens and exports nested JSON.
* [ ] `fastapi-apscheduler` is integrated and `sweep_orphaned_devices` runs.
* [ ] Devices are correctly marked "offline" after 5 minutes of no heartbeat.
* [ ] Builder page lazy-loads the Monaco editor.
* [ ] `LoadingSpinner` and `EmptyState` components are integrated into all data lists.
* [ ] `E2E_TEST_PLAN.md` is written and has been executed successfully.
* [ ] All "show-stopper" bugs from E2E testing are fixed.
* [ ] `USER_GUIDE.md` is written and reviewed for clarity.
* [ ] `OPERATIONS.md` (Runbooks) is written, covering Backup, Logs, and Disk Space.
* [ ] All code is reviewed, merged to `main`, and deployed.

---

### 15. Known Issues and Technical Debt

* **Known Issue:** The `ConnectionManager` for WebSockets is in-memory (Phase 4 debt). A server restart will disconnect all clients. This is acceptable for v1.0 but should be fixed with Redis in v2.0.
* **Known Issue:** The `edge/agent.py` must be updated manually on each Pi (Phase 3 debt). An auto-update mechanism is a v2.0 feature.
* **Known Issue:** The PsychoPy builder only supports a minimal set of components (Phase 2 debt). Expanding the component library is the next major feature for v2.0.
* **Technical Debt:** Analytics are limited to a single summary query. A more robust system would allow date-range filtering and time-series analysis. This is deferred.

---

### 16. Lessons Learned and Retrospective

*(To be filled out upon completion of Phase 5)*

* What went well:
* What could be improved:
* Process adjustments for next phase:

---

### 17. Handoff to Next Phase

* **To:** End Users (Researchers) and Operations/Maintenance Team
* **What is provided:** A complete, stable, and documented LICS v1.0 application. The system is considered "launched" and ready for use.
* **Setup Instructions:**
    1.  For Researchers: Follow `USER_GUIDE.md` to set up your Raspberry Pi devices and start using the application.
    2.  For Operations: Follow `README.md` for production deployment (see Master Doc 13.2). Monitor backend logs (`docker-compose logs -f backend`) especially for `Orphaned device sweep` messages.
* **Next Steps:** Future work will be prioritized in a v1.1 or v2.0 backlog, focusing on known issues (e.g., video streaming, agent auto-update, advanced analytics).