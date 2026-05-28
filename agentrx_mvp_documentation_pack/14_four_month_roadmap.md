# Four-Month Roadmap

## Roadmap Goal
Build a YC-ready AgentRx MVP in 4 months.

## Month 1: Foundation and Prescription Intelligence

### Objective
Create the base app and prescription upload/OCR/parsing flow.

### Week 1: Project Setup
Tasks:
- Create repo
- Set up Next.js app
- Set up database
- Set up Prisma schema
- Set up auth
- Create base dashboard layout
- Create roles
- Create seed users

Deliverable:
- Users can log in and see role-based dashboard.

### Week 2: Prescription Upload
Tasks:
- Build upload UI
- Set up file storage
- Create Prescription model
- Store file metadata
- Display uploaded prescription
- Add prescription list page

Deliverable:
- User can upload and view synthetic prescription.

### Week 3: OCR Pipeline
Tasks:
- Integrate OCR provider
- Store raw OCR text
- Add OCR status
- Display OCR text beside original file
- Add retry OCR button

Deliverable:
- Uploaded prescription produces OCR text.

### Week 4: Parser Agent
Tasks:
- Build Parser Agent
- Extract structured fields
- Store extracted fields
- Show confidence per field
- Allow manual correction
- Log corrections

Deliverable:
- Prescription becomes structured data.

## Month 2: Verification and Drug Intelligence

### Objective
Add prescriber identity checking and medication normalization.

### Week 5: NPI Integration
Tasks:
- Build NPI service
- Search by NPI
- Display provider match
- Add mismatch warnings
- Cache results

Deliverable:
- Prescriber identity card works.

### Week 6: Drug Normalization
Tasks:
- Build RxNorm service
- Search medication candidates
- Store selected RxCUI
- Display generic/brand/dosage candidates
- Add ambiguity flag

Deliverable:
- Medication normalization card works.

### Week 7: FDA/openFDA/DailyMed Lookup
Tasks:
- Build openFDA service
- Build label summary service
- Pull NDC/product candidates
- Display warning/label sections
- Cache label lookups

Deliverable:
- Drug knowledge card works.

### Week 8: Agent Orchestrator v1
Tasks:
- Build workflow runner
- Sequence Parser → Prescriber → Drug agents
- Store AgentRuns
- Add agent timeline UI
- Add error handling

Deliverable:
- Agents run as a workflow with audit trail.

## Month 3: Safety, Inventory, and Review Workflow

### Objective
Make it feel like the AI is running pharmacy operations.

### Week 9: Safety Agent
Tasks:
- Build synthetic patient profiles
- Add allergy checks
- Add completeness checks
- Add duplicate therapy placeholder
- Add label warning summary
- Add risk classification

Deliverable:
- Safety card shows pass/warning/fail checks.

### Week 10: Inventory System
Tasks:
- Build inventory model
- Seed inventory
- Inventory search/match service
- Add low stock/expired flags
- Build inventory UI

Deliverable:
- Inventory Agent can match prescriptions to stock.

### Week 11: Pharmacist Review Queue
Tasks:
- Build review queue
- Add filters by risk/status
- Add approve/reject/escalate actions
- Enforce role permissions
- Log all review actions

Deliverable:
- Pharmacist can review and approve/reject prescriptions.

### Week 12: Dispense Task System
Tasks:
- Build DispenseTask model
- Generate task from prescription
- Build task board
- Add task status transitions
- Add label preview

Deliverable:
- Approved prescriptions create simulated dispense tasks.

## Month 4: Demo, Digital Twin, Polish, and Pitch

### Objective
Create a polished YC-ready demo.

### Week 13: Digital Twin / Simulated Robot
Tasks:
- Build pharmacy shelf visual
- Build active dispensing animation
- Connect dispense task state
- Simulate pick/count/package/label

Deliverable:
- Viewer sees automation beyond software forms.

### Week 14: Demo Runner
Tasks:
- Create demo scenarios
- Add one-click scenario runner
- Warm external data cache
- Add reset demo data button
- Add guided demo mode

Deliverable:
- Demo can be run reliably in under 3 minutes.

### Week 15: Metrics and YC Dashboard
Tasks:
- Add time saved metrics
- Add agent success metrics
- Add workflow completion metrics
- Add cost-saving estimate card
- Improve landing/demo page

Deliverable:
- Dashboard clearly communicates business value.

### Week 16: Polish and Pitch Assets
Tasks:
- Fix bugs
- Improve UI copy
- Record demo video
- Create pitch deck
- Write YC application answers
- Prepare technical architecture diagram

Deliverable:
- YC-ready MVP, demo video, and pitch narrative.

## Weekly Rhythm
Each week:
- Monday: define tasks
- Tuesday-Thursday: build
- Friday: test + record progress video
- Weekend: polish + write notes

## Must-Have by End of Month 4
- Working upload
- OCR extraction
- Structured parsing
- NPI lookup
- Drug normalization
- Safety checks
- Inventory matching
- Dispense task generation
- Pharmacist review dashboard
- Agent audit logs
- Demo runner
- YC demo video

## Nice-to-Have
- Physical mini-dispenser
- Voice assistant
- Multilingual counseling demo
- Barcode scanning demo
- Supplier ordering simulation

## Avoid Until Later
- Insurance
- Payments
- Real patients
- Real medication dispensing
- Controlled substances
- State-by-state legal logic

## Roadmap Success Definition
At the end of month 4, someone should be able to watch the demo and say:

> This is clearly the operating system for an AI-run pharmacy, and the founder can actually build it.
