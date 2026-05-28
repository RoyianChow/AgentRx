# System Architecture

## Architecture Overview
AgentRx should be built as a modular system with five major layers:

1. Frontend application
2. Backend API
3. Agent orchestration service
4. Data integrations and tool layer
5. Database, object storage, and queue infrastructure

## High-Level Flow

```text
User Uploads Prescription
        ↓
Frontend Upload UI
        ↓
Backend API stores file and creates Prescription record
        ↓
Queue starts OCR job
        ↓
OCR Provider extracts text
        ↓
Agent Orchestrator starts workflow
        ↓
Parser Agent extracts fields
        ↓
Prescriber Agent checks NPI data
        ↓
Drug Agent normalizes medication
        ↓
Safety Agent runs checks
        ↓
Inventory Agent finds stock
        ↓
Dispensing Agent creates task
        ↓
Supervisor Dashboard displays review package
        ↓
Pharmacist approves/rejects/escalates
```

## Main Services

### 1. Web App
Responsible for:
- Auth UI
- Dashboard
- Upload UI
- Review queue
- Inventory UI
- Dispense task UI
- Audit log UI

Recommended stack:
- Next.js
- TypeScript
- Tailwind
- shadcn/ui
- React Query or server actions

### 2. Backend API
Responsible for:
- User/session auth
- Prescription CRUD
- File upload handling
- Agent job dispatching
- Data persistence
- Review actions
- Inventory and task operations

Recommended stack options:
- Next.js API routes/server actions
- FastAPI service
- Hybrid: Next.js for app + Python FastAPI for agents

### 3. Agent Orchestrator
Responsible for:
- Running agent workflow
- Calling tools/APIs
- Logging agent steps
- Returning structured output
- Handling retries and failures
- Applying escalation rules

Recommended design:
- One orchestrator per prescription
- Each agent has strict JSON input/output schema
- All tool calls are logged
- Agent output never directly changes final status without workflow rules

### 4. External Data Tools
Responsible for:
- NPI lookup
- RxNorm/RxNav lookup
- openFDA lookup
- FDA NDC lookup
- DailyMed label lookup

### 5. Database
Responsible for:
- Users
- Prescriptions
- Extracted fields
- Agent runs
- Safety checks
- Inventory
- Dispense tasks
- Audit logs

Recommended:
- PostgreSQL
- Prisma ORM

### 6. Object Storage
Responsible for:
- Original prescription files
- OCR output files if needed
- Generated labels
- Demo documents

Recommended:
- S3-compatible bucket

### 7. Queue System
Responsible for:
- OCR jobs
- Agent workflows
- Retryable processing tasks

Recommended:
- Redis + BullMQ for TypeScript stack
- Celery + Redis for Python stack

## Suggested Deployment Architecture

### Local Development
```text
Next.js app
Postgres database
Redis queue
Python agent service
Local/S3-compatible storage
```

### MVP Cloud Deployment
```text
Vercel or Render for frontend
Railway/Fly.io/Render for API/agent service
Neon/Supabase Postgres
Upstash Redis
S3/Tigris for storage
```

## Component Breakdown

### Frontend Components
- Login page
- Dashboard home
- Prescription upload page
- Prescription detail page
- Pharmacist review queue
- Agent timeline component
- Safety summary card
- Prescriber verification card
- Drug normalization card
- Inventory match card
- Dispense task board
- Audit log viewer
- Demo runner page

### Backend Modules
- Auth module
- Upload module
- Prescription module
- OCR module
- Agent workflow module
- Data source module
- Inventory module
- Dispensing module
- Audit module

### Agent Modules
- Intake Agent
- OCR Parser Agent
- Prescriber Verification Agent
- Drug Normalization Agent
- Safety Agent
- Inventory Agent
- Dispense Orchestration Agent
- Supervisor Summary Agent

## Agent Communication Pattern
All agents should output structured JSON.

Example:

```json
{
  "agentName": "PrescriberVerificationAgent",
  "status": "completed",
  "confidence": 0.88,
  "riskLevel": "yellow",
  "summary": "NPI found and name is a close match. Address differs from prescription.",
  "data": {},
  "warnings": [],
  "requiresHumanReview": true
}
```

## State Management
Prescription status should be deterministic and controlled by backend workflow logic.

Agents produce recommendations. The backend workflow updates statuses.

## Error Handling Principles
- Every failed step creates an AgentRun with status = failed.
- User sees a readable error.
- Failed OCR can be retried.
- Failed external API lookup should not crash the entire prescription workflow.
- Missing data should escalate, not block the whole demo.

## Auditability Requirement
Every state change must produce an audit log.

Examples:
- Prescription uploaded
- OCR completed
- Parser Agent completed
- NPI lookup completed
- Safety warning generated
- Pharmacist approved
- Dispense task created

## Human-in-the-Loop Rule
The MVP must not mark a prescription as finally complete without a pharmacist/human supervisor action.

## System Design Principle
AI agents are workers. Backend rules are the manager. Pharmacist is the final authority.
