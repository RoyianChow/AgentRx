# Recommended Repo Structure

## Option A: Single Next.js Monorepo
Best if you want speed and simplicity.

```text
agentrx/
  app/
    (auth)/
    dashboard/
    prescriptions/
    review-queue/
    inventory/
    dispense-tasks/
    audit-logs/
    demo/
    api/
  components/
    ui/
    prescriptions/
    agents/
    inventory/
    dashboard/
  lib/
    auth/
    db/
    storage/
    queue/
    audit/
    validators/
  services/
    ocr/
    npi/
    rxnorm/
    openfda/
    dailymed/
    agents/
  prisma/
    schema.prisma
    seed.ts
  public/
  docs/
  tests/
  .env.example
  README.md
```

## Option B: Next.js + Python Agent Service
Best if you want stronger AI/agent flexibility.

```text
agentrx/
  apps/
    web/
      app/
      components/
      lib/
      services/
      prisma/
    agent-service/
      app.py
      agents/
      tools/
      schemas/
      workflows/
      tests/
  packages/
    shared-types/
    config/
  docs/
  docker-compose.yml
  README.md
```

## Recommended for You
Use Option B if you want this to become serious and scalable:

- Next.js for UI and core app
- Python FastAPI for agent orchestration
- Postgres shared database
- Redis queue

## Web App Folder Details

```text
apps/web/app/dashboard/page.tsx
apps/web/app/prescriptions/page.tsx
apps/web/app/prescriptions/[id]/page.tsx
apps/web/app/review-queue/page.tsx
apps/web/app/inventory/page.tsx
apps/web/app/dispense-tasks/page.tsx
apps/web/app/audit-logs/page.tsx
apps/web/app/demo/page.tsx
```

## Component Structure

```text
components/prescriptions/
  PrescriptionUploader.tsx
  PrescriptionViewer.tsx
  ExtractedFieldsPanel.tsx
  PrescriptionStatusBadge.tsx

components/agents/
  AgentTimeline.tsx
  AgentRunCard.tsx
  AgentRunDetailDialog.tsx
  RiskSummaryCard.tsx

components/review/
  ReviewQueueTable.tsx
  PharmacistActionPanel.tsx
  SafetyCheckList.tsx

components/inventory/
  InventoryTable.tsx
  InventoryMatchCard.tsx
  InventoryForm.tsx

components/dispensing/
  DispenseTaskBoard.tsx
  DispenseTaskCard.tsx
  DigitalTwinView.tsx
```

## Python Agent Service Structure

```text
apps/agent-service/
  main.py
  agents/
    base.py
    intake_agent.py
    parser_agent.py
    prescriber_verification_agent.py
    drug_normalization_agent.py
    safety_agent.py
    inventory_agent.py
    dispensing_agent.py
    supervisor_summary_agent.py
  tools/
    npi_tool.py
    rxnorm_tool.py
    openfda_tool.py
    dailymed_tool.py
    ocr_tool.py
  schemas/
    prescription.py
    agent_output.py
    safety.py
    inventory.py
  workflows/
    prescription_workflow.py
  services/
    audit_service.py
    database.py
    cache.py
  tests/
```

## Environment Variables

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
S3_ENDPOINT="..."
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."
S3_BUCKET="agentrx-demo"
REDIS_URL="redis://..."
OPENAI_API_KEY="..."
OCR_PROVIDER="textract"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
```

## Development Commands

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

For Python service:

```bash
cd apps/agent-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Docker Compose Services

Recommended local services:
- Postgres
- Redis
- MinIO for S3-compatible storage
- Web app
- Agent service

## Git Branch Strategy

Branches:
- main
- dev
- feature/prescription-upload
- feature/agent-workflow
- feature/review-dashboard

## Commit Style

Examples:
- feat: add prescription upload flow
- feat: add parser agent schema
- fix: handle failed npi lookup
- ui: improve review queue layout
- docs: add demo script

## First Repo Milestone
A clean repo with:
- Auth
- Database schema
- Prescription upload
- OCR placeholder
- AgentRun model
- Seed data
