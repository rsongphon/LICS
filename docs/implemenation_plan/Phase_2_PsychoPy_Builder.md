## PHASE 2 DOCUMENTATION: Phase 2: PsychoPy Builder (Weeks 5-8)

### 1. Phase Overview

This phase is the core value proposition of the LICS project: creating a web-based, visual experiment builder that mimics the functionality of the PsychoPy desktop application. This phase builds directly on the foundation laid in Phase 1, moving from simple data storage to a complex, interactive application.

The primary goal is to create a Single Page Application (SPA) within our Next.js shell where researchers can visually design an experiment (e.g., "show image," "wait for keypress"), save their design, and compile that visual design into an executable Python script.

#### 1.1 Phase Objectives and Success Criteria

**Objectives:**
* Implement a "Builder" UI using **React Flow** for the visual timeline/canvas.
* Implement a **Component Palette** allowing users to drag-and-drop PsychoPy components (e.g., Text, Image, Keyboard Response) onto the canvas.
* Implement a **Properties Panel** that allows users to configure the parameters of any selected component (e.g., text content, duration, allowed keys).
* Implement a "Save" mechanism that serializes the React Flow state (nodes, edges, and properties) into a JSON object and saves it to the `experiments.psyexp_data` column via the `PUT /api/experiments/{id}` endpoint (built in Phase 1).
* Implement a new backend API endpoint: `POST /api/experiments/{id}/compile`.
* Implement a backend **Python Code Generation** module (e.g., `app/psychopy/compiler.py`) that reads the `psyexp_data` JSON, parses it, and uses **Jinja2** templates to generate a runnable PsychoPy Python script.
* Store the generated script in the `experiments.python_code` column.
* Implement a "Code Preview" UI using the Monaco editor to display the read-only `python_code`.

**Success Criteria:**
* A user can log in, create a new "Experiment," and be redirected to the builder page (`/builder/[experiment-id]`).
* A user can drag a "Text" component and a "Keyboard Response" component onto the canvas.
* A user can set the "Text" content to "Press Space" and the "Keyboard Response" allowed keys to "space".
* A user can save the experiment. The `psyexp_data` column in the database is populated with a JSON structure representing this flow.
* A user can click "Compile." The backend `compiler` service runs, and the `python_code` column is populated with a valid PsychoPy script.
* The "Code Preview" panel automatically updates and displays the generated Python script.

#### 1.2 Why this phase is sequenced at this point in the project
* **Phase 1 (Foundation)** was a prerequisite. We cannot build an experiment *editor* without the underlying `experiments` table, user authentication, and basic CRUD APIs to save our work.
* This phase must come *before* **Phase 3 (Edge Integration)**. Phase 3 is responsible for *deploying and running* the experiment. It cannot do this until Phase 2 *generates the Python script* that needs to be deployed.

#### 1.3 Dependencies on previous phases
* **Phase 1 (`Phase_1_Foundation.md`):**
    * **Authentication:** Relies on the `useAuth` hook and JWT-protected API routes.
    * **Database:** Relies on the `experiments` table schema.
    * **API:** Relies on `GET /api/experiments/{id}` (to load data) and `PUT /api/experiments/{id}` (to save data).

#### 1.4 What must be completed before next phase can begin
* The `POST /api/experiments/{id}/compile` endpoint must be stable and functional.
* The `experiments.python_code` column must be reliably populated with a runnable, self-contained PsychoPy script. Phase 3 will treat this column as its primary "artifact" to be deployed.
* The core component library (MVP: Text, Image, Keyboard, GPIO Output) must be implemented in the builder and compiler.

#### 1.5 Estimated Timeline with Buffer Considerations
* **Total:** 4 Weeks (as per Master Doc 16.2)
* **Week 5:** Builder UI Shell & State Management
* **Week 6:** Builder UI Interaction & Properties Panels
* **Week 7:** Backend Compilation Engine (Jinja2)
* **Week 8:** API Integration & Code Preview
* **Buffer:** 1 Week. The primary risk is the complexity of replicating PsychoPy's logic. A 1-week buffer is allocated for potential refactors of the `compiler.py` module or the `psyexp_data` JSON structure.
* **Total Allotted:** 5 Weeks

#### 1.6 Key deliverables and artifacts
* **Frontend Code:** New Next.js route: `frontend/src/app/(dashboard)/builder/[id]/page.tsx` and all associated components (Canvas, Palette, Properties).
* **Backend Code:** New Python module: `backend/app/psychopy/` (containing `compiler.py`, `builder.py`, `components.py`).
* **Backend API:** New endpoint `POST /api/experiments/{id}/compile` added to `backend/app/api/routes/experiments.py`.
* **Templates:** New `backend/app/psychopy/templates/` directory with Jinja2 templates.
* **Tests:** `pytest` unit tests for the `compiler.py` module. React Testing Library tests for the builder store (`Zustand`).
* **Updated `package.json`** with new dependencies (`react-flow-renderer`, `zustand`, `monaco-editor`).
* **Updated `requirements.txt`** with new dependencies (`jinja2`).

---

### 2. Scope Definition

#### 2.1 What IS included in this phase
* **Frontend Builder UI:**
    * A **React Flow** canvas for visual "routine" and "flow" management.
    * A **Component Palette** (sidebar) with draggable components.
    * **MVP Components:**
        1.  **Stimuli:** `Text`, `Image`
        2.  **Responses:** `Keyboard`
        3.  **Hardware:** `GPIO Output` (for reward/trigger)
    * A **Properties Panel** (sidebar) that is context-aware, showing a form for the currently selected node.
    * A **Zustand** store to manage the complex state of the builder (nodes, edges, component properties).
    * **Save Button:** Triggers `PUT /api/experiments/{id}` with the `psyexp_data` from the Zustand store.
    * **Compile Button:** Triggers `POST /api/experiments/{id}/compile`.
    * **Code Preview Panel:** A `Monaco` editor component in read-only mode, displaying the `experiment.python_code` field.
* **Backend Compilation Logic:**
    * A new API endpoint `POST /api/experiments/{id}/compile` that is auth-protected.
    * A `psychopy.compiler` module that:
        1.  Fetches the `Experiment` from the DB.
        2.  Parses the `experiment.psyexp_data` JSON.
        3.  Uses Jinja2 templates to render a complete Python script.
        4.  Handles basic ordering of components (e.g., stimuli before response).
    * **Jinja2 Templates:** A set of templates that define the structure of a PsychoPy script (e.g., imports, window setup, main loop, component definitions).
* **Testing:**
    * Unit tests for `backend/app/psychopy/compiler.py` (e.g., "given this JSON, assert this Python code is generated").
    * Unit tests for the frontend Zustand store.

#### 2.2 What IS NOT included in this phase
* **PsychoJS Generation (`psychojs_code`):** This is deferred. We are only focused on **Python** for the Raspberry Pi. Generating JavaScript for web-based preview is a significant separate task. The `psychojs_code` column will remain `null`.
* **Full PsychoPy Component Library:** We are *not* implementing all 50+ PsychoPy components. We are starting with the MVP (Text, Image, Keyboard, GPIO). Others (Sound, Movie, Mouse) are deferred to future enhancements.
* **Experiment Execution/Deployment:** Clicking "Compile" *generates* the code; it does *not* run or deploy it. This is **Phase 3**.
* **Live Web Preview:** There will be no "Run" button to preview the experiment in the browser.
* **`.psyexp` XML Compatibility:** The Master Doc (9.2) mentions the `.psyexp` XML format. For simplicity, we are *ignoring* this. Our "source of truth" will be our *own* `psyexp_data` JSON format. We will not support importing/exporting `.psyexp` files in this phase.
* **Data Collection/Results:** The `trial_results` and `device_logs` tables are **Phase 4**. The generated code will *not* yet have data-saving hooks.

---

### 3. Technical Architecture for This Phase

#### 3.1 Component Architecture

**Frontend (`frontend/src/app/(dashboard)/builder/[id]/`)**

* **`page.tsx` (Builder Layout):**
    * Fetches `GET /api/experiments/{id}` on load using TanStack Query.
    * Initializes the Zustand store with `experiment.psyexp_data`.
    * Lays out the three main components: `ComponentPalette`, `BuilderCanvas`, and `PropertiesPanel`.
    * Contains the `Toolbar` with "Save" and "Compile" buttons.
* **`BuilderStore.ts` (Zustand Store):**
    * Manages the entire state of the builder.
    * `nodes: Node[]`, `edges: Edge[]` (for React Flow).
    * `componentProps: { [nodeId: string]: any }` (stores properties like text content, file names, etc.).
    * `selectedNode: Node | null`.
    * `actions: { addNode, setNodeProps, setSelectedNode, ... }`.
    * **This store is the "Single Source of Truth" for the builder.**
* **`ComponentPalette.tsx`:**
    * Sidebar with draggable elements (e.g., using `react-dnd`).
    * `onDragStart` passes component type (e.g., "text", "keyboard").
* **`BuilderCanvas.tsx`:**
    * The main `ReactFlow` component.
    * `onDrop` handler: Catches drops from the palette, creates a new node, and calls `store.addNode()`.
    * `onNodesChange`, `onEdgesChange`: Handlers to update node positions/connections in the store.
    * `onNodeClick`: Calls `store.setSelectedNode()`.
    * `customNodes`: Maps component types to custom React components (e.g., a "Text" node shows a small preview of the text).
* **`PropertiesPanel.tsx`:**
    * Subscribes to `store.selectedNode`.
    * Conditionally renders a specific form based on `selectedNode.type`.
    * Example: `if (selectedNode.type === 'text') return <TextPropertiesForm node={selectedNode} />`.
    * Forms use `react-hook-form` and `onBlur`/`onChange` to update the store via `store.setNodeProps()`.
* **`CodePreview.tsx`:**
    * Wrapper for `@monaco-editor/react`.
    * Receives `code: string` as a prop (from the `useQuery` data).
    * Configured as `readOnly: true`, `language: 'python'`.

**Backend (`backend/app/`)**

* **`api/routes/experiments.py`:**
    * **Modify** to add the new endpoint:
    * `POST /{id}/compile`
        * Depends on `get_current_active_user`.
        * Fetches the experiment.
        * Checks ownership (`experiment.created_by == current_user.id`).
        * Calls `await compiler_service.compile_experiment(experiment)`.
        * Saves the updated experiment (with new `python_code`).
        * Returns the updated `Experiment` schema.
* **`psychopy/` (NEW MODULE):**
    * **`compiler.py`:**
        ```python
        # Simplified structure
        class ExperimentCompiler:
            def __init__(self):
                self.template_env = Jinja2.Environment(
                    loader=Jinja2.FileSystemLoader("app/psychopy/templates")
                )

            async def compile_experiment(self, db: AsyncSession, exp: models.Experiment) -> models.Experiment:
                # 1. Parse the psyexp_data
                builder_data = self.parse_builder_json(exp.psyexp_data)
                
                # 2. Get the main script template
                template = self.template_env.get_template("main_script.py.j2")
                
                # 3. Render the template
                # 'builder_data' will contain parsed routines, components, flow
                python_code = template.render(
                    experiment_name=exp.name,
                    routines=builder_data.routines
                )
                
                # 4. Update the experiment object
                exp.python_code = python_code
                exp.status = "compiled"
                db.add(exp)
                await db.commit()
                await db.refresh(exp)
                return exp

            def parse_builder_json(self, psyexp_data: dict) -> ParsedExperiment:
                # This is the complex logic
                # It transforms the React Flow nodes/edges into a
                # logical structure of "Routines" and "Components"
                # that the Jinja2 template can understand.
                ...
        
        compiler_service = ExperimentCompiler()
        ```
    * **`templates/main_script.py.j2` (NEW):**
        ```jinja2
        # Auto-generated by LICS
        # Experiment: {{ experiment_name }}

        from psychopy import core, visual, event, logging
        from app.psychopy_ext import gpio # Custom GPIO bridge

        # --- Setup ---
        win = visual.Window([800, 600], monitor="testMonitor", units="pix")
        gpio.setup()

        # --- Component Definitions ---
        {% for routine in routines %}
        # == Routine: {{ routine.name }} ==
        {% for component in routine.components %}
        {% if component.type == 'text' %}
        {{ component.name }} = visual.TextStim(win,
            text="{{ component.properties.text }}",
            pos=({{ component.properties.pos_x }}, {{ component.properties.pos_y }})
        )
        {% elif component.type == 'keyboard' %}
        {{ component.name }} = event.BuilderKeyResponse()
        {% endif %}
        {% endfor %}
        {% endfor %}

        # --- Main Loop ---
        try:
            # This 'flow' logic will need to be more complex
            {% for routine in routines %}
            # Start {{ routine.name }}
            {{ routine.name }}_components = [{{ routine.component_names | join(', ') }}]

            # ... (Logic to draw components, check for responses) ...
            
            # End {{ routine.name }}
            {% endfor %}

        finally:
            win.close()
            gpio.cleanup()
            core.quit()
        ```

#### 3.2 Data Architecture

* **Tables to Modify:**
    * `experiments`: No schema change, but we are now *heavily* using `psyexp_data` (write), `python_code` (write), and `psychojs_code` (no-op).
* **`psyexp_data` JSONB Schema (PROPOSED):**
    * This is the "source of truth" generated by the React Flow UI.
    * It must be structured logically for the compiler.
    ```json
    {
      "react_flow": {
        "nodes": [
          {
            "id": "node_1",
            "type": "routine",
            "position": { "x": 100, "y": 100 },
            "data": { "name": "trial" }
          },
          {
            "id": "node_2",
            "type": "loop_start",
            "position": { "x": 50, "y": 100 }
          }
        ],
        "edges": [
          { "id": "e1", "source": "node_2", "target": "node_1" }
        ]
      },
      "routines": {
        "trial": {
          "name": "trial",
          "components": [
            {
              "id": "comp_1",
              "type": "text",
              "name": "stimulus",
              "properties": {
                "text": "Press Space",
                "start_time": 0.0,
                "duration": 5.0,
                "pos_x": 0,
                "pos_y": 0
              }
            },
            {
              "id": "comp_2",
              "type": "keyboard",
              "name": "response",
              "properties": {
                "allowed_keys": ["space"],
                "store": "last",
                "start_time": 0.0,
                "duration": 5.0
              }
            }
          ]
        }
      },
      "flow": [
        { "type": "loop", "name": "trials_loop", "n_reps": 5, "routines": ["trial"] }
      ]
    }
    ```
* **Migration Scripts:**
    * No schema changes are strictly required.
    * However, we should add an index to `experiments.created_by` if not done in Phase 1, as we'll be querying by user.
    * `docker-compose exec backend alembic revision -m "Add index to experiments.created_by"`
    * In migration file: `op.create_index(op.f('ix_experiments_created_by'), 'experiments', ['created_by'], unique=False)`

#### 3.3 Technology Stack
* **Frontend (New):**
    * `react-flow-renderer`: For the builder canvas.
    * `zustand`: For global state management of the builder.
    * `@monaco-editor/react`: For the code preview.
    * `react-hook-form`: For the properties panels.
    * `react-dnd`: For the draggable component palette.
* **Backend (New):**
    * `jinja2`: For Python code template generation.
* **Installation:**
    * `frontend/`: `npm install react-flow-renderer zustand @monaco-editor/react react-hook-form react-dnd react-dnd-html5-backend`
    * `backend/`: Add `jinja2` to `requirements.txt` and rebuild container.

---

### 4. Detailed Implementation Plan

#### 4.1 Week-by-Week Breakdown

* **Week 5 Objectives: Builder UI Shell & State**
    * **Tasks:**
        1.  Create the new route `app/(dashboard)/builder/[id]/page.tsx`.
        2.  Install `react-flow-renderer` and `zustand`.
        3.  Create the `BuilderStore.ts` (Zustand) store. Define the initial state (nodes, edges, props).
        4.  Implement the `BuilderCanvas.tsx` component. Get a basic React Flow canvas rendering with hardcoded nodes.
        5.  Implement the 3-panel layout (Palette, Canvas, Properties) using CSS (e.g., Flexbox/Grid).
        6.  On page load, fetch `GET /api/experiments/{id}` and use the `experiment.psyexp_data` to *initialize* (not subscribe to) the Zustand store.
    * **Outputs:** A non-interactive builder UI that loads data from the API.
    * **Checkpoints:** Can you load the builder page and see the hardcoded (or saved) nodes?

* **Week 6 Objectives: Builder UI Interaction & Properties**
    * **Tasks:**
        1.  Implement `ComponentPalette.tsx` using `react-dnd`.
        2.  Implement the `onDrop` handler in `BuilderCanvas.tsx` to add new nodes to the store.
        3.  Implement `onNodesChange`, `onEdgesChange` to make the canvas interactive (move nodes, connect them).
        4.  Implement `PropertiesPanel.tsx`. On node click, update `store.selectedNode`.
        5.  Create the first property form: `TextPropertiesForm.tsx`. Use `react-hook-form` to edit properties. On change, update the `store.componentProps`.
        6.  Implement the "Save" button to serialize the *entire* Zustand state and `PUT` it to `/api/experiments/{id}`.
    * **Outputs:** An interactive builder where you can add/move nodes, edit text properties, and save the state to the DB.
    * **Checkpoints:** Can you drag a "Text" node, change its text to "Hello," save, refresh, and see "Hello" loaded from the API?

* **Week 7 Objectives: Backend Compilation Engine**
    * **Tasks:**
        1.  Create the `backend/app/psychopy/` module and `templates/` directory.
        2.  Install `jinja2`.
        3.  Create `compiler.py`.
        4.  **Start with a unit test:** Write `tests/backend/app/psychopy/test_compiler.py`.
        5.  Define a sample `psyexp_data` JSON (as in 3.2).
        6.  Write the `parse_builder_json` function to transform this JSON into a Python object.
        7.  Create `main_script.py.j2`. Start simple (just imports and a `print("Hello")`).
        8.  Iterate: Get the test to pass by having `compiler_service.compile_experiment` read the JSON and generate the expected Python string.
        9.  Expand the Jinja2 template to handle `Text` and `Keyboard` components.
    * **Outputs:** A `compiler_service` that can be called and a `pytest` suite that proves it works.
    * **Blockers:** The parsing logic and Jinja2 logic are complex. This week is 100% focused on this backend task.

* **Week 8 Objectives: API Integration & Code Preview**
    * **Tasks:**
        1.  Add the `POST /api/experiments/{id}/compile` endpoint to `experiments.py`.
        2.  Inject `compiler_service` and call it. Add the authorization check (user ownership).
        3.  Install `@monaco-editor/react`.
        4.  Add the `CodePreview.tsx` component to the builder layout.
        5.  Hook up the "Compile" button: Use TanStack Query's `useMutation` to call the `/compile` endpoint.
        6.  On `mutation.onSuccess`, the `useQuery` for the experiment data should be *invalidated* (`queryClient.invalidateQueries(['experiment', id])`).
        7.  This refetch will update the `experiment.python_code` prop, which will automatically feed into the `CodePreview` component.
    * **Outputs:** A fully functional loop. User clicks "Compile," a spinner shows, and then the code preview panel updates with the new Python script.
    * **Checkpoints:** Run the full E2E scenario from Success Criteria (1.1).

---

### 5. API and Interface Specifications

* **Endpoint:** `PUT /api/experiments/{id}` (Modified from Phase 1)
    * **Purpose:** Save the current state of the visual builder.
    * **Auth:** `get_current_active_user`.
    * **Request format:** `application/json` (This now has a defined structure)
        ```json
        {
          "name": "Updated Experiment Name",
          "description": "Updated description",
          "psyexp_data": {
            "react_flow": { "nodes": [...], "edges": [...] },
            "routines": { "trial": { ... } },
            "flow": [ ... ]
          }
        }
        ```
    * **Response format:** `200 OK` with the updated `Experiment` schema.
    * **Error Handling:** `401 Unauthorized`, `403 Forbidden` (if not owner), `404 Not Found`, `422 Unprocessable Entity`.

* **Endpoint:** `POST /api/experiments/{id}/compile` (NEW)
    * **Purpose:** Triggers the backend to generate `python_code` from the *already saved* `psyexp_data`.
    * **Auth:** `get_current_active_user`.
    * **Request format:** `application/json` (Empty body)
        ```json
        {}
        ```
    * **Response format:** `200 OK`
        ```json
        // Returns the *full* experiment schema, now with populated code
        {
          "id": "a1b2c3d4-...",
          "name": "My First Primate Task",
          "psyexp_data": { ... },
          "python_code": "# Auto-generated by LICS...\nfrom psychopy import core...",
          "psychojs_code": null,
          "created_by": "e5f6g7h8-...",
          "status": "compiled",
          ...
        }
        ```
    * **Error Handling:** `401 Unauthorized`, `403 Forbidden` (if not owner), `404 Not Found`, `500 Internal Server Error` (if compilation fails).

---

### 6. User Interface Specifications

* **Component:** `BuilderCanvas.tsx`
    * **Purpose:** The main interactive area for building experiments.
    * **Visual:** A `react-flow-renderer` component filling the main content area.
    * **Interactions:**
        * `onDrop`: Receives data from `ComponentPalette`. Creates a new node (e.g., `{ id: uuid(), type: 'text', ... }`) and adds it to the Zustand store.
        * `onNodeClick`: Gets the node object, calls `store.setSelectedNode(node)`.
        * `onConnect`: Creates a new edge, adds it to the store.
        * `onNodesChange`/`onEdgesChange`: Updates store with new positions/deletions.
    * **State:** All state is derived from the Zustand store (`nodes`, `edges`).
    * **Integration:** Renders `customNodes` based on node type.

* **Component:** `PropertiesPanel.tsx`
    * **Purpose:** Edit the parameters of the selected component.
    * **Visual:** A sidebar. Displays "Select a component to edit" if `selectedNode` is null.
    * **Interactions:** Renders a sub-component (e.g., `TextPropertiesForm`) based on `selectedNode.type`.
    * **State:** Subscribes to `store.selectedNode`.
    * **Integration:** The sub-forms (e.g., `TextPropertiesForm`) use `react-hook-form` and call `store.setNodeProps(nodeId, newProps)` on change.

* **Component:** `TextPropertiesForm.tsx`
    * **Purpose:** Edit properties for a `Text` component.
    * **Visual:** A form with inputs for:
        * `Name` (e.g., "stimulus")
        * `Start Time (s)` (e.g., 0.0)
        * `Duration (s)` (e.g., 5.0)
        * `Text` (e.g., "Hello")
        * `Position (X, Y)`
    * **State:** `react-hook-form` manages form state, a `useEffect` syncs the form with `selectedNode.properties` from the store.
    * **Interactions:** `onChange` on inputs triggers `store.setNodeProps()`.

---

### 7. Database Implementation

#### 7.1 Schema Design
* No new tables. We are modifying the `experiments` table logic.
* **`alembic/versions/..._add_index_to_experiments_created_by.py`** (NEW MIGRATION)
    ```python
    """Add index to experiments.created_by

    Revision ID: <new_revision_id>
    Revises: <phase_1_revision_id>
    Create Date: <timestamp>
    """
    from alembic import op
    import sqlalchemy as sa

    # revision identifiers, used by Alembic.
    revision = '<new_revision_id>'
    down_revision = '<phase_1_revision_id>'
    branch_labels = None
    depends_on = None

    def upgrade():
        op.create_index(op.f('ix_experiments_created_by'), 'experiments', ['created_by'], unique=False)

    def downgrade():
        op.drop_index(op.f('ix_experiments_created_by'), table_name='experiments')
    ```

#### 7.2 Migration Strategy
1.  Run `docker-compose exec backend alembic revision -m "Add index to experiments created_by"`.
2.  Copy the generated DDL from 7.1 into the new migration file.
3.  Run `docker-compose exec backend alembic upgrade head` to apply.
4.  **Rollback:** `docker-compose exec backend alembic downgrade -1`.

#### 7.3 Queries and Operations
* **Load Experiment:** (Handled by Phase 1 `crud.experiment.get`)
* **Save Experiment:** (Handled by Phase 1 `crud.experiment.update`)
* **Compile Experiment:** (New operation, inside `api/routes/experiments.py`)
    ```python
    # In POST /{id}/compile
    
    # 1. Fetch and authorize
    experiment = await crud.experiment.get(db=db, id=id)
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    if experiment.created_by != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not authorized")

    # 2. Call compiler service
    try:
        updated_experiment = await compiler_service.compile_experiment(db=db, exp=experiment)
    except Exception as e:
        logger.error(f"Compilation failed: {e}")
        raise HTTPException(status_code=500, detail="Experiment compilation failed")
    
    # 3. Return
    return updated_experiment
    ```

---

### 8. Testing Strategy for This Phase

#### 8.1 Unit Testing
* **Target (Backend):** `backend/app/psychopy/compiler.py`
    * **Scenarios:**
        * `test_compile_empty_experiment`: Given empty JSON, generates a script with just imports and `core.quit()`.
        * `test_compile_text_stim`: Given JSON with one Text component, generates a script that defines `visual.TextStim` correctly.
        * `test_compile_kbd_response`: Given JSON with `Keyboard`, generates `event.BuilderKeyResponse`.
        * `test_compile_full_routine`: Given Text + Keyboard, generates the full routine logic.
    * **Strategy:** Use `pytest`. Create sample JSON files as fixtures. Call `compiler_service.compile_experiment()` (with a mock DB session) and assert the output `python_code` string contains the expected lines.
* **Target (Frontend):** `frontend/src/stores/BuilderStore.ts`
    * **Scenarios:**
        * `test_add_node`: Call `store.addNode()`, check if `store.nodes` has the new node.
        * `test_set_node_props`: Call `store.setNodeProps()`, check if `store.componentProps` is updated.
        * `test_serialize_state`: Test the selector/function that flattens the store state into the `psyexp_data` JSON for saving.

#### 8.2 Integration Testing
* **Target:** `POST /api/experiments/{id}/compile`
    * **Scenarios:**
        * Test as unauthenticated user (expect 401).
        * Test as authenticated user but *not* owner (expect 403).
        * Test as owner with valid `psyexp_data` (expect 200, check `python_code` is not null).
        * Test as owner with *invalid* `psyexp_data` (expect 500 or 422).
    * **Strategy:** Use `pytest` with the `client` fixture. Create an experiment, `PUT` valid `psyexp_data` to it, then `POST` to the `/compile` endpoint and check the response.

#### 8.3 End-to-End Testing
* **Scenarios:**
    * (Manual) User logs in.
    * Creates new experiment.
    * Drags "Text" component. Clicks it.
    * Properties panel appears. User types "Hello" into the `text` field.
    * Drags "Keyboard" component.
    * Clicks "Save." A "Saved" notification appears.
    * Clicks "Compile." A spinner appears, then the "Code Preview" panel updates with Python code containing `visual.TextStim(win, text="Hello")`.
* **Tools:** Manual testing for Phase 2.

#### 8.4 Performance Testing
* None for this phase. Compilation is assumed to be fast (< 2 seconds).

---

### 9. Security Implementation

* **Authentication:** All Phase 2 endpoints (`/compile`, and the `PUT /experiments/{id}`) **must** be protected by `Depends(deps.get_current_active_user)`.
* **Authorization:** This is the most critical part of this phase.
    * When saving (`PUT /api/experiments/{id}`) or compiling (`POST /api/experiments/{id}/compile`), the backend **must** perform this check:
        ```python
        experiment = await crud.experiment.get(db=db, id=id)
        if experiment.created_by != current_user.id and not current_user.is_superuser:
            raise HTTPException(status_code=403, detail="Not authorized")
        ```
* **Data Validation:**
    * The `compiler.py` service must be robust. It must *not* crash if `psyexp_data` is malformed. It should use Pydantic models to parse the incoming JSON and raise validation errors (which become 500s) if the structure is wrong.
    * **Jinja2 Templating:** We must use `autoescape=True` (or manually escape all inputs) in Jinja2 if we are rendering any user-provided strings into the Python code (e.g., `text="Hello"`). This prevents a user from typing `text="'); import os; os.system('rm -rf /'); #"` into the text field and creating a malicious script. This is a **critical** injection vector.

---

### 10. DevOps and Infrastructure

#### 10.1 Environment Setup
* **`backend/requirements.txt`:**
    * Add `jinja2==<version>`
* **`frontend/package.json`:**
    * Add:
        * `"react-flow-renderer": "^10.x.x"`
        * `"zustand": "^4.x.x"`
        * `"@monaco-editor/react": "^4.x.x"`
        * `"react-hook-form": "^7.x.x"`
        * `"react-dnd": "^16.x.x"`
        * `"react-dnd-html5-backend": "^16.x.x"`
* **Action:** Developers must run `npm install` in `frontend/` and `docker-compose build backend` after pulling.

#### 10.2 CI/CD Pipeline
* The existing GitHub Action (from Phase 1) will automatically run `pytest` for the new `test_compiler.py` tests.
* The `ruff` and `black` checks will also apply.
* We should add a new step to the CI pipeline to run frontend tests: `npm test`.

#### 10.3 Monitoring and Logging
* **Logging:** The `compiler_service` must have detailed logging.
    * `logger.info(f"Starting compilation for experiment {exp.id}")`
    * `logger.error(f"Compilation failed for experiment {exp.id}: {e}")`
* **Alerting:** None.

---

### 11. Code Organization and Standards

#### 11.1 Project Structure
* **New Frontend Directories/Files:**
    ```
    frontend/src/
    ├── app/(dashboard)/
    │   └── builder/
    │       └── [id]/
    │           ├── components/
    │           │   ├── BuilderCanvas.tsx
    │           │   ├── CodePreview.tsx
    │           │   ├── ComponentPalette.tsx
    │           │   ├── PropertiesPanel.tsx
    │           │   └── forms/
    │           │       ├── TextPropertiesForm.tsx
    │           │       └── KeyboardPropertiesForm.tsx
    │           └── page.tsx
    └── stores/
        └── BuilderStore.ts  <-- NEW
    ```
* **New Backend Directories/Files:**
    ```
    backend/app/
    ├── psychopy/              <-- NEW
    │   ├── __init__.py
    │   ├── builder.py
    │   ├── compiler.py       
    │   ├── components.py
    │   └── templates/        
    │       ├── main_script.py.j2
    │       └── _component_snippets.j2
    └── api/routes/
        └── experiments.py     <-- MODIFIED
    ```

#### 11.2 Coding Standards
* **Frontend:** All new components must use TypeScript. All builder state must go through the `Zustand` store; do not use `useState` for global state.
* **Backend:** All `compiler.py` logic must be unit-tested. All user-facing strings in the Jinja2 templates **must be escaped** to prevent code injection.

---

### 12. Dependencies and Prerequisites

#### 12.1 External Dependencies
* `react-flow-renderer`: Core for the UI.
* `jinja2`: Core for the backend.
* `@monaco-editor/react`: For the code preview.

#### 12.2 Internal Dependencies
* Completion of all Phase 1 objectives, especially the `experiments` API and user auth.

---

### 13. Risk Management

* **Technical Risk 1: PsychoPy Replication is Too Complex**
    * **Likelihood:** High. PsychoPy is a mature application.
    * **Mitigation:** **Strict scope control.** We are *not* replicating PsychoPy. We are replicating *4 components*. The `compiler.py` will be simple at first. We will not support complex loops, conditions, or routines-within-routines in this phase.
* **Technical Risk 2: `psyexp_data` JSON Structure is Wrong**
    * **Likelihood:** Medium. We may design it, build the UI, then find the compiler *needs* it in a different format.
    * **Mitigation:** **Design the JSON schema (3.2) *first***. Both the frontend and backend teams must agree on this "contract" *before* writing code. The `compiler.py` unit tests will be written against this contract.
* **Technical Risk 3: Jinja2 Code Injection**
    * **Likelihood:** High, if developers are careless.
    * **Mitigation:** **Mandatory security review** of `compiler.py` and all `.j2` templates. All user-provided strings (e.g., from a Text component's `text` field) must be filtered or escaped before being rendered into the Python script.

* **Timeline Risk:** Week 7 (Backend Compilation) is a bottleneck.
    * **Likelihood:** High. This is the hardest part.
    * **Mitigation:** The developer on this task should *only* do this task. Use the 1-week buffer if needed. De-scope: if the Jinja2 templating is too hard, the first version might just `print()` a hardcoded script, proving the API plumbing works.

---

### 14. Phase Completion Checklist

* [ ] `npm install` and `pip install` commands for new dependencies are documented.
* [ ] Alembic migration for `ix_experiments_created_by` is created and tested.
* [ ] User can load `/builder/[id]` page.
* [ ] User can drag `Text` and `Keyboard` components onto the canvas.
* [ ] User can click a component and edit its properties in the `PropertiesPanel`.
* [ ] User can click "Save," and `psyexp_data` is updated in the DB.
* [ ] User can click "Compile," and `python_code` is generated and saved in the DB.
* [ ] The `CodePreview` panel updates to show the generated code.
* [ ] `pytest` suite for `compiler.py` passes.
* [ ] Authorization checks (non-owner cannot save/compile) are implemented and tested.
* [ ] All new code is merged into the `main` branch.

---

### 15. Known Issues and Technical Debt

* **Issue:** The "Code Preview" (Monaco) is a heavy component and may slow down page load.
    * **Debt:** Deferring optimization (e.g., lazy loading the editor) until performance becomes a problem.
* **Issue:** The `psychojs_code` column is unused.
    * **Debt:** This is documented as "out of scope". We will add a task to the backlog for a "Web Preview" feature.
* **Issue:** The builder only supports 3-4 components.
    * **Debt:** This is intentional. Future work will involve adding more components (e.g., `Sound`, `Mouse`) to the palette, properties panel, and `compiler.py` module.
* **Issue:** The Jinja2 templates are simple and don't support complex loops or branching.
    * **Debt:** The "Flow" logic is hardcoded. This will need a major refactor in a future "Advanced Builder" phase.

---

### 16. Lessons Learned and Retrospective

*(To be filled out upon completion of Phase 2)*

* What went well:
* What could be improved:
* Process adjustments for next phase:

---

### 17. Handoff to Next Phase

* **To: Phase 3 (Edge Integration) Team**
* **What is provided:**
    * The LICS application now has a functional experiment builder.
    * The `experiments` table is now being populated with two critical pieces of data:
        1.  `psyexp_data` (JSON): The "source" of the experiment.
        2.  **`python_code` (Text): The "compiled artifact." This is what you will use.**
* **Setup Instructions for Next Phase:**
    1.  `git pull` the `main` branch.
    2.  Run `docker-compose build --no-cache` to install new Python/NPM dependencies.
    3.  Run `docker-compose exec backend alembic upgrade head` to apply the new DB index.
    4.  You can now log in, create an experiment, and click "Compile" to generate a Python script.
* **Your (Phase 3) Objective:**
    * You will be building the `edge/agent.py` for the Raspberry Pi.
    * You will implement the `POST /api/experiments/{id}/deploy` endpoint.
    * When a user clicks "Deploy" (which you will build), your backend will use **MQTT** to send a command to the device.
    * Your `edge/agent.py` will receive this command, call a *new* API endpoint (e.g., `GET /api/experiments/{id}/script`) to download the `python_code` string, save it to a local `.py` file, and then execute it using `python3`.
    * This "Phase 2" provides the "script" you need to deploy. Your phase is all about the *delivery and execution* of that script.