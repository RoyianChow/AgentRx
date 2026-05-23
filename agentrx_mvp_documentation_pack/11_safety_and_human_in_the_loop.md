# Safety and Human-in-the-Loop Design

## Core Safety Position
AgentRx MVP is a sandboxed workflow automation demo. It must not claim to make final clinical, legal, or dispensing decisions.

The system should be designed so that:

- AI agents generate structured recommendations.
- Backend rules control workflow state.
- Human/pharmacist reviewer makes final approval.
- Every action is auditable.

## Human Final Authority Rule
No prescription can be marked approved without a pharmacist/human supervisor action.

## Safety Language Rules

### Approved Wording
Use:
- “Requires pharmacist review.”
- “No issue detected in available synthetic data.”
- “Potential warning found.”
- “Prescriber identity appears consistent with public NPI data.”
- “Medication normalized to candidate records.”
- “This is a sandbox demonstration.”

### Avoid Wording
Do not use:
- “This prescription is valid.”
- “This prescription is authentic.”
- “This medication is safe.”
- “The patient should take this medication.”
- “AI approved this prescription.”
- “Pharmacist not required.”

## Risk Classification

### Green
Definition:
The system found complete fields, high-confidence extraction, no major warning, and inventory match.

Action:
Ready for pharmacist review.

### Yellow
Definition:
The system found incomplete data, low confidence, ambiguous instructions, or minor mismatch.

Action:
Pharmacist review required.

### Red
Definition:
The system found possible safety issue, major mismatch, unknown medication, expired inventory, or severe uncertainty.

Action:
Escalation required. Do not proceed to simulated dispensing unless human override is explicitly recorded.

## Required Review Triggers

Always require pharmacist review if:
- Medication name confidence is low.
- Quantity is missing.
- SIG/directions are missing or ambiguous.
- NPI is missing or mismatched.
- Drug normalization is ambiguous.
- Allergy conflict exists.
- Patient age warning exists.
- Inventory is expired.
- External API lookup fails for critical fields.
- Any agent returns riskLevel = red.

## Human Override Rules
A human override must capture:
- User ID
- Timestamp
- Field/action overridden
- Original value
- New value
- Reason note

## Audit Requirements
Log all of the following:
- File upload
- OCR run
- Agent run start and completion
- External API lookup
- Safety warning
- Field correction
- Approval
- Rejection
- Escalation
- Dispense task creation
- Dispense task completion

## Safety Agent Limitations
The Safety Agent should only perform basic screening in MVP.

It should not:
- Determine clinical appropriateness
- Adjust doses
- Recommend therapy
- Replace medication counseling
- Handle complex contraindications independently
- Handle controlled substances

## Patient Counseling Bot Guardrails
If you build a counseling chatbot, it should:

- Use retrieved label/monograph content only
- Say it is for demo/educational purposes
- Tell users to consult a pharmacist/clinician for medical advice
- Avoid individualized dosing changes
- Avoid diagnosis
- Avoid telling a patient to stop/start medication

## Data Safety
Use only:
- Synthetic patients
- Synthetic prescriptions
- Public drug data
- Public prescriber identity data
- Mock inventory

Do not use:
- Real patient data
- Real prescriptions
- Real insurance data
- Real controlled-substance data
- Real pharmacy records

## Failure Handling
When something fails:

- Show readable error
- Store failed agent run
- Do not silently continue as green
- Move prescription to needs review if failure affects safety

## Safety UX Requirements
Every prescription detail page must show:
- Risk badge
- Safety summary
- Agent confidence
- Human review requirements
- Original prescription preview
- Audit trail access

## Safe Demo Disclaimer
Suggested demo disclaimer:

> This is a sandboxed prototype using synthetic prescriptions and public drug/prescriber data. It does not dispense medication, provide medical advice, or replace a licensed pharmacist.

## Principle
The safer the MVP looks, the more credible the automation vision becomes.
