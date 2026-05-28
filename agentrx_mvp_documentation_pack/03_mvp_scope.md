# MVP Scope

## MVP Goal
Build a sandboxed AI pharmacy command center that demonstrates how agents can automate the prescription-processing workflow before human/pharmacist approval.

## MVP Tagline
**From prescription upload to pharmacist-ready dispense task in one AI-run workflow.**

## What the MVP Must Prove
The MVP must prove five things:

1. AI can read and structure prescription documents.
2. AI can verify prescriber identity using public data.
3. AI can normalize messy medication names to structured drug data.
4. AI can run basic safety and completeness checks.
5. AI can create a dispense task that a pharmacist can approve.

## MVP Modules

### Module 1: Auth and Roles
Must include:
- Login
- Role-based dashboard access
- Admin user seed

### Module 2: Prescription Intake
Must include:
- Upload file
- Store original file
- Display image/PDF preview
- Show processing status

### Module 3: OCR and Parsing
Must include:
- OCR text extraction
- Structured field extraction
- Per-field confidence
- Ability for pharmacist to correct fields

### Module 4: Prescriber Identity
Must include:
- NPI lookup
- Name matching
- Taxonomy/specialty display
- Warning if mismatch or missing information

### Module 5: Drug Normalization
Must include:
- Search medication name
- Return RxNorm/RxCUI candidate
- Return generic/brand candidates
- Return dosage form/route if available
- Return NDC candidates if available

### Module 6: Safety Checks
Must include:
- Completeness check
- Allergy conflict against synthetic profile
- Duplicate therapy placeholder
- Ambiguous instructions check
- Label warning summary

### Module 7: Inventory
Must include:
- Seeded inventory table
- Search inventory
- Match medication to available stock
- Lot/expiry display
- Reorder flag

### Module 8: Dispense Task
Must include:
- Task creation after successful triage
- Task status board
- Label preview
- Bin/shelf location
- Simulated robot/fulfillment state

### Module 9: Pharmacist Supervisor Dashboard
Must include:
- Review queue
- Risk color coding
- Original prescription preview
- Agent outputs
- Safety results
- Approve/reject/escalate buttons
- Notes and overrides

### Module 10: Audit Log
Must include:
- Agent run history
- Human actions
- Tool calls
- Time stamps
- Decision summary

## MVP Status Flow

Prescription statuses:

1. Uploaded
2. OCR Processing
3. Parsed
4. Prescriber Check Running
5. Drug Normalization Running
6. Safety Check Running
7. Inventory Matching
8. Ready for Pharmacist Review
9. Approved
10. Rejected
11. Escalated
12. Dispense Task Created
13. Simulated Dispensed

## Risk Levels

### Green
Routine, complete, high confidence.

### Yellow
Incomplete or ambiguous field, requires pharmacist review.

### Red
Potential safety issue, prescriber mismatch, unknown drug, severe warning, or failed verification.

## Demo Dataset
Seed at least:

- 10 synthetic prescriptions
- 10 synthetic patients
- 20 synthetic inventory items
- 50 common medication records cached from public data
- 5 prescriber profiles from public NPI examples or mock data

## Common Medications for Demo Dataset
Suggested safe/common demo medications:

- Amoxicillin
- Atorvastatin
- Lisinopril
- Metformin
- Levothyroxine
- Amlodipine
- Omeprazole
- Losartan
- Sertraline
- Albuterol inhaler
- Hydrochlorothiazide
- Gabapentin
- Simvastatin
- Escitalopram
- Azithromycin

Avoid in demo:
- Controlled substances
- Opioids
- Benzodiazepines
- Stimulants
- Complex biologics
- Chemotherapy drugs
- Insulin titration

## MVP Boundaries
The MVP should not allow:

- Real patient onboarding
- Real prescriptions
- Real dispensing
- Real claims processing
- Unsupervised final approvals
- Direct medical advice
- Controlled-substance workflow

## Success Criteria
The MVP succeeds if a viewer understands within 3 minutes:

1. The pharmacy has AI agents instead of manual assistants.
2. The pharmacist is still in control.
3. Every AI action is auditable.
4. The workflow could scale to real pharmacy operations later.

## Ideal YC Demo Story
“Here is a prescription. Today, multiple pharmacy staff would manually read, enter, verify, check, and prepare it. In AgentRx, the agents do that work in seconds. The pharmacist only reviews the exception summary and approves.”
