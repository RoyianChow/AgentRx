# Product Requirements Document

## Product Name
AgentRx

## Product Type
Sandboxed agent-native pharmacy operating system MVP

## Primary Objective
Demonstrate that a prescription can be processed through an AI-driven pharmacy workflow from upload to pharmacist-ready approval and simulated dispensing.

## Core Demo Workflow
1. User uploads a synthetic prescription image or PDF.
2. OCR system extracts text.
3. Prescription Parser Agent extracts structured prescription fields.
4. Prescriber Verification Agent checks prescriber identity using NPI data.
5. Drug Normalization Agent maps medication to structured drug identifiers.
6. Safety Agent checks allergy, dose, warning, duplicate therapy, and interaction placeholders.
7. Inventory Agent checks whether the medication is available.
8. Dispensing Orchestration Agent creates a pick/pack/count task.
9. Pharmacist Supervisor reviews the full package.
10. Final output is marked approved, rejected, or escalated.

## User Roles

### Admin
- Manage users
- Configure data sources
- View all prescriptions
- View all audit logs
- Manage inventory
- Manage demo settings

### Pharmacist Supervisor
- Review prescription packages
- Approve/reject/escalate AI outputs
- Override AI decisions
- Add notes
- View agent confidence and audit trails

### Pharmacy Operator / Technician Simulation User
- Upload prescriptions
- View dispense tasks
- Update task status
- Confirm simulated packaging

### Auditor
- Read-only access to prescriptions, agent runs, safety checks, and audit logs

### Patient Simulation User
- Upload prescription in demo mode
- View status
- Ask basic counseling questions based on approved label content

## Functional Requirements

### FR-001: Authentication
The system must support login and role-based access.

Minimum roles:
- Admin
- Pharmacist
- Operator
- Auditor
- Patient Simulation User

### FR-002: Prescription Upload
Users must be able to upload prescription files.

Accepted MVP file types:
- PNG
- JPG/JPEG
- PDF

Each upload must store:
- Original file
- File metadata
- Uploader ID
- Upload timestamp
- Prescription status

### FR-003: OCR Extraction
The system must extract text from prescription documents.

Output must include:
- Raw OCR text
- Confidence score if available
- OCR provider used
- Processing status

### FR-004: Structured Prescription Parsing
The system must extract:
- Patient full name
- Patient DOB
- Prescriber name
- NPI if present
- Medication name
- Strength
- Dosage form
- Quantity
- Directions/SIG
- Refills
- Written date
- Notes

Each extracted field must have:
- Value
- Confidence
- Source text span if possible
- Agent name

### FR-005: Prescriber Identity Check
The system must check the prescriber against NPI data when NPI or prescriber name is available.

The system should flag:
- Missing NPI
- NPI not found
- Name mismatch
- Address mismatch
- Taxonomy/specialty mismatch
- Deactivation if available from source data

Important: In MVP language, this is **identity checking**, not complete legal validation.

### FR-006: Medication Normalization
The system must normalize medication names to structured medication records.

Minimum output:
- Original extracted medication name
- Normalized generic name
- Brand name if available
- RxCUI if available
- Dosage form
- Route
- Possible NDC candidates
- Confidence score

### FR-007: Safety Screening
The system must run basic safety checks.

MVP checks:
- Allergy conflict against synthetic patient profile
- Duplicate medication against synthetic active medication list
- Missing required prescription fields
- Ambiguous SIG
- High-risk medication placeholder flag
- Age-related warning placeholder
- Label warning summary from available drug label data

The system must classify each check as:
- Pass
- Warning
- Fail
- Needs human review

### FR-008: Inventory Matching
The system must match normalized medication to inventory.

Inventory item fields:
- Drug name
- NDC
- Strength
- Dosage form
- Quantity on hand
- Lot number
- Expiry date
- Storage location
- Reorder threshold

### FR-009: Dispense Task Generation
When a prescription is sufficiently complete, the system must generate a dispense task.

Task fields:
- Medication
- Quantity
- NDC candidate
- Bin/shelf location
- Label instructions
- Status
- Assigned operator/robot simulation
- Required pharmacist approval before final release

### FR-010: Pharmacist Review Dashboard
The pharmacist must be able to review:
- Original prescription image
- Extracted fields
- OCR text
- Prescriber check
- Medication normalization
- Safety results
- Inventory match
- Dispense task
- Agent confidence scores
- Audit log

Actions:
- Approve
- Reject
- Request correction
- Escalate
- Add note
- Override extracted field

### FR-011: Agent Audit Trail
Every agent must log:
- Input
- Output
- Tool calls
- Confidence
- Status
- Error messages
- Timestamp
- Model/provider used
- Human override if any

### FR-012: Demo Mode
The system must include synthetic prescriptions and synthetic patients.

Demo mode should let the founder run the entire workflow in under 3 minutes.

## Non-Functional Requirements

### NFR-001: Traceability
Every automated decision must be inspectable.

### NFR-002: Human Oversight
No final prescription should be marked as complete without human/pharmacist supervisor approval in the MVP.

### NFR-003: Safety Language
The system must not claim to provide medical advice or dispense medication.

### NFR-004: Data Isolation
Use synthetic patient data only for MVP.

### NFR-005: Reliability
Failed agent steps must produce useful error states, not silent failures.

### NFR-006: Explainability
Every warning or rejection must include a short explanation.

### NFR-007: Speed
For a demo prescription, total workflow should complete within 60 seconds after upload, excluding manual pharmacist review.

## MVP Acceptance Criteria
The MVP is acceptable when:

1. A synthetic prescription can be uploaded.
2. OCR text is extracted.
3. Prescription fields are parsed into structured data.
4. NPI lookup works for sample prescribers.
5. Drug normalization works for at least 50 common medications.
6. Safety checks generate pass/warning/fail statuses.
7. Inventory matching works against seeded inventory.
8. A dispense task is generated.
9. Pharmacist dashboard supports approve/reject/escalate.
10. Agent audit logs are visible.
11. A full demo can be completed in under 3 minutes.

## Out of Scope for MVP
- Real patient data
- Real dispensing
- Insurance billing
- Payment processing
- DEA/EPCS
- Controlled substance handling
- Full regulatory compliance engine
- Medication therapy management
- Telehealth prescribing
- Live pharmacy integration
- Real robotic dispensing
