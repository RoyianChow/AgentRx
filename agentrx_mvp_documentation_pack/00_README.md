# AgentRx MVP Documentation Pack

## Project Working Name
**AgentRx — Agent-Native Pharmacy Operating System**

## One-Line Description
AgentRx is a sandboxed AI pharmacy operating system where specialized AI agents handle prescription intake, prescriber identity checks, medication normalization, safety screening, inventory routing, and simulated dispensing-task creation while a pharmacist/human supervisor reviews exceptions and final approvals.

## Important Framing
This MVP is **not** a public pharmacy, not a real dispensing system, and not a medical device. It is a **sandboxed proof-of-concept** for an agent-native pharmacy workflow.

The first product should prove that AI agents can replace much of the manual pharmacy-assistant workflow while keeping a licensed pharmacist or human reviewer as the final authority.

## What This Documentation Includes
1. Product vision
2. Product requirements document
3. MVP scope
4. System architecture
5. Agent architecture
6. Data sources and integrations
7. Database design
8. Backend API specification
9. UI/UX screen specification
10. User stories and workflows
11. Human-in-the-loop safety design
12. Security and privacy plan
13. Testing and evaluation plan
14. 4-month roadmap
15. Demo script
16. YC pitch notes
17. Repo structure
18. First 14-day execution checklist

## Suggested Build Stack
- **Frontend:** Next.js, TypeScript, Tailwind, shadcn/ui
- **Backend:** Next.js API routes or FastAPI
- **Database:** PostgreSQL + Prisma
- **Storage:** S3-compatible object storage
- **OCR:** AWS Textract, Azure Document Intelligence, Google Document AI, or Tesseract for early prototyping
- **Agent orchestration:** Python service or TypeScript service with tool-calling
- **Queues:** Redis + BullMQ or Celery
- **Drug data:** RxNorm/RxNav, openFDA, FDA NDC, DailyMed
- **Prescriber identity data:** NPPES NPI Registry API

## MVP Outcome
By the end of 4 months, the demo should show:

1. A synthetic prescription is uploaded.
2. AI extracts the prescription details.
3. Prescriber identity is checked through NPI lookup.
4. Medication is normalized to structured drug data.
5. Basic safety checks run.
6. Inventory is checked.
7. A dispense task is generated.
8. A pharmacist supervisor reviews the AI-generated package.
9. A simulated dispensing/digital twin workflow is triggered.
10. Every agent action is logged in an audit trail.

## Key Principle
Do not pitch the MVP as “AI replacing pharmacists.”

Pitch it as:

> AI replacing repetitive pharmacy-assistant workflows so pharmacists become high-leverage supervisors focused on judgment, safety, and exceptions.
