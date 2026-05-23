# Backend API Specification

## API Style
Use REST endpoints for the MVP. Keep APIs simple and predictable.

## Auth Endpoints

### POST /api/auth/login
Login user.

Request:
```json
{
  "email": "pharmacist@example.com",
  "password": "password"
}
```

Response:
```json
{
  "user": {
    "id": "user_id",
    "email": "pharmacist@example.com",
    "role": "PHARMACIST"
  }
}
```

### POST /api/auth/logout
Logs user out.

## Prescription Endpoints

### POST /api/prescriptions/upload
Upload prescription file.

Form data:
- file
- patientId optional
- demoMode boolean

Response:
```json
{
  "prescriptionId": "rx_123",
  "status": "UPLOADED",
  "fileKey": "prescriptions/rx_123.png"
}
```

### GET /api/prescriptions
List prescriptions.

Query params:
- status
- riskLevel
- page
- limit

Response:
```json
{
  "items": [],
  "page": 1,
  "total": 25
}
```

### GET /api/prescriptions/:id
Get prescription detail.

Response includes:
- Prescription record
- Extracted fields
- Prescriber verification
- Medication normalization
- Safety checks
- Inventory match
- Dispense task
- Agent runs
- Audit logs

### POST /api/prescriptions/:id/process
Start or restart workflow.

Request:
```json
{
  "steps": ["ocr", "agents"],
  "force": false
}
```

### PATCH /api/prescriptions/:id/fields/:fieldId
Correct extracted field.

Request:
```json
{
  "correctedValue": "Metformin 500 mg tablet",
  "reason": "OCR misread medication name"
}
```

### POST /api/prescriptions/:id/approve
Pharmacist approval.

Request:
```json
{
  "note": "Approved after reviewing ambiguous SIG."
}
```

### POST /api/prescriptions/:id/reject
Reject prescription.

Request:
```json
{
  "reason": "Prescriber identity mismatch."
}
```

### POST /api/prescriptions/:id/escalate
Escalate prescription.

Request:
```json
{
  "reason": "Medication could not be normalized confidently."
}
```

## Agent Endpoints

### GET /api/prescriptions/:id/agent-runs
List agent runs for prescription.

### GET /api/agent-runs/:id
Get detailed agent run.

### POST /api/prescriptions/:id/run-agent
Manually run a specific agent.

Request:
```json
{
  "agentName": "DrugNormalizationAgent"
}
```

## Data Source Endpoints

### GET /api/tools/npi?number=:npi
Lookup NPI.

### GET /api/tools/rxnorm/search?q=:query
Search RxNorm candidate.

### GET /api/tools/openfda/ndc?q=:query
Search NDC.

### GET /api/tools/dailymed/label?q=:query
Get label summary.

These endpoints should be protected for internal app use only.

## Inventory Endpoints

### GET /api/inventory
List inventory.

Query params:
- q
- ndc
- rxCui
- lowStock
- expired

### POST /api/inventory
Create inventory item.

### PATCH /api/inventory/:id
Update inventory item.

### DELETE /api/inventory/:id
Soft delete or deactivate inventory item.

## Dispense Task Endpoints

### GET /api/dispense-tasks
List dispense tasks.

### GET /api/dispense-tasks/:id
Get task detail.

### POST /api/dispense-tasks/:id/advance
Advance task status.

Request:
```json
{
  "status": "COUNTING",
  "note": "Simulated robot started count."
}
```

### POST /api/dispense-tasks/:id/complete
Complete simulated dispense task.

## Audit Endpoints

### GET /api/audit-logs
List audit logs.

Query params:
- prescriptionId
- actorType
- eventType
- from
- to

### GET /api/prescriptions/:id/audit-logs
Get prescription audit trail.

## Demo Endpoints

### POST /api/demo/reset
Reset demo database.

### POST /api/demo/seed
Seed demo prescriptions and inventory.

### POST /api/demo/run/:scenarioId
Run demo scenario.

Example scenarios:
- clean_prescription
- missing_npi
- allergy_conflict
- ambiguous_drug
- out_of_stock
- expired_inventory

## API Error Format
All errors should follow this shape:

```json
{
  "error": {
    "code": "PRESCRIPTION_NOT_FOUND",
    "message": "Prescription could not be found.",
    "details": {}
  }
}
```

## Common Error Codes
- UNAUTHORIZED
- FORBIDDEN
- VALIDATION_ERROR
- PRESCRIPTION_NOT_FOUND
- AGENT_FAILED
- OCR_FAILED
- EXTERNAL_API_FAILED
- INVENTORY_NOT_FOUND
- REVIEW_REQUIRED

## API Security Requirements
- All write endpoints require auth.
- Role checks required for approval/rejection.
- Pharmacist-only for final approval.
- Audit endpoints restricted to Admin, Pharmacist, Auditor.
- Demo reset restricted to Admin.

## Backend Rule
No endpoint should allow bypassing pharmacist approval for final completion.
