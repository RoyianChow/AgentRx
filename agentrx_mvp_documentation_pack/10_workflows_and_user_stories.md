# Workflows and User Stories

## Workflow 1: Clean Prescription

### Scenario
A synthetic patient uploads a clean typed prescription for a common medication.

### Steps
1. User uploads prescription.
2. OCR extracts text with high confidence.
3. Parser Agent extracts all required fields.
4. Prescriber Agent finds matching NPI.
5. Drug Agent normalizes medication.
6. Safety Agent finds no major warnings.
7. Inventory Agent finds stock.
8. Dispensing Agent creates task.
9. Pharmacist approves.
10. Simulated dispensing completes.

### Expected Outcome
Status: Approved / Simulated Dispensed
Risk: Green

## Workflow 2: Missing NPI

### Scenario
Prescription has prescriber name but no NPI.

### Expected Behavior
- Parser Agent marks NPI as missing.
- Prescriber Agent tries name search if enabled.
- System flags yellow risk.
- Pharmacist review required.

### Expected Outcome
Status: Ready for Review or Escalated
Risk: Yellow

## Workflow 3: Ambiguous Medication

### Scenario
Medication name could match multiple drugs.

### Expected Behavior
- Drug Agent returns multiple candidates.
- Confidence below threshold.
- Safety Agent skips final medication-specific checks.
- Pharmacist must select correct medication.

### Expected Outcome
Status: Escalated
Risk: Yellow or Red

## Workflow 4: Allergy Conflict

### Scenario
Synthetic patient has allergy to penicillin. Prescription is amoxicillin.

### Expected Behavior
- Safety Agent detects possible allergy conflict.
- Workflow escalates.
- Dispense task should not proceed without explicit pharmacist override.

### Expected Outcome
Status: Escalated
Risk: Red

## Workflow 5: Out of Stock

### Scenario
Medication is normalized but no inventory item is available.

### Expected Behavior
- Inventory Agent returns no match.
- System creates inventory warning.
- Dispense task not created or created as blocked.

### Expected Outcome
Status: Ready for Review / Inventory Blocked
Risk: Yellow

## Workflow 6: Expired Inventory

### Scenario
Only matching inventory item is expired.

### Expected Behavior
- Inventory Agent detects expired lot.
- Safety Agent or inventory safety check flags red.
- Dispense task blocked.

### Expected Outcome
Status: Escalated
Risk: Red

## Workflow 7: Low Confidence OCR

### Scenario
Prescription image is blurry.

### Expected Behavior
- OCR confidence is low.
- Parser Agent marks critical fields as uncertain.
- System requests human correction.

### Expected Outcome
Status: Needs Review
Risk: Yellow

## User Stories

### Admin Stories

#### US-A1
As an admin, I want to create demo users so that I can present the system with different roles.

Acceptance criteria:
- Admin can seed demo users.
- Admin can assign roles.
- Admin can reset demo data.

#### US-A2
As an admin, I want to view all prescriptions so that I can monitor workflow health.

Acceptance criteria:
- Admin can filter by status and risk.
- Admin can view audit logs.

### Pharmacist Stories

#### US-P1
As a pharmacist, I want to review AI-extracted prescription fields beside the original prescription so that I can verify accuracy.

Acceptance criteria:
- Original prescription is visible.
- Extracted fields are editable.
- Corrections are logged.

#### US-P2
As a pharmacist, I want to see why the AI flagged a prescription so that I can quickly make a decision.

Acceptance criteria:
- Risk summary is visible.
- Safety checks are listed.
- Agent confidence is visible.

#### US-P3
As a pharmacist, I want to approve, reject, or escalate prescriptions so that I remain the final authority.

Acceptance criteria:
- Actions are role-restricted.
- Notes can be added.
- Action appears in audit log.

### Operator Stories

#### US-O1
As an operator, I want to see dispense tasks so that I can simulate fulfillment.

Acceptance criteria:
- Tasks appear after approval.
- Task status can be advanced.
- Completion is logged.

### Auditor Stories

#### US-AUD1
As an auditor, I want to view every AI and human action so that I can inspect system behavior.

Acceptance criteria:
- Audit log is append-only.
- Agent input/output is visible.
- Human overrides are visible.

### Patient Simulation Stories

#### US-PS1
As a patient simulation user, I want to upload a prescription so that I can see the AI pharmacy workflow process it.

Acceptance criteria:
- Upload works.
- Status updates are visible.
- No real medication advice is given.

## Workflow Status Rules

### Approval Rule
A prescription cannot become approved unless a pharmacist user performs the approval action.

### Escalation Rule
Any red warning automatically marks the prescription as requiring human review.

### Correction Rule
Any human correction creates an audit log and updates the review package.

### Dispense Task Rule
A dispense task can be generated before approval as a draft, but cannot be marked complete without approval.

## Demo Story Arc
1. Start with old pharmacy problem.
2. Upload prescription.
3. Show agents running.
4. Show green/yellow/red risk output.
5. Show pharmacist approves in seconds.
6. Show simulated dispense task.
7. Show audit trail.
8. Close with time/labor savings.
