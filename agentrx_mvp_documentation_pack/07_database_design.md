# Database Design

## Database Choice
Use PostgreSQL with Prisma.

## Design Principles
- Every prescription has a traceable lifecycle.
- Every AI action is logged.
- Every human override is logged.
- Agent outputs are stored as structured JSON.
- External lookup results can be cached.
- Synthetic data is separated from real-world data.

## Core Entities

### User
Represents a system user.

Fields:
- id
- name
- email
- passwordHash or auth provider ID
- role
- createdAt
- updatedAt

Roles:
- ADMIN
- PHARMACIST
- OPERATOR
- AUDITOR
- PATIENT_SIM

### Prescription
Represents one prescription workflow.

Fields:
- id
- patientId
- uploadedById
- status
- riskLevel
- originalFileKey
- originalFileName
- originalFileType
- rawOcrText
- ocrProvider
- ocrConfidence
- parsedSummaryJson
- createdAt
- updatedAt

Statuses:
- UPLOADED
- OCR_PROCESSING
- PARSED
- VERIFYING_PRESCRIBER
- NORMALIZING_DRUG
- RUNNING_SAFETY_CHECKS
- MATCHING_INVENTORY
- READY_FOR_REVIEW
- APPROVED
- REJECTED
- ESCALATED
- DISPENSE_TASK_CREATED
- SIMULATED_DISPENSED
- FAILED

### PatientProfile
Synthetic patient profile for MVP.

Fields:
- id
- fullName
- dob
- sex
- allergiesJson
- activeMedicationsJson
- conditionsJson
- preferredLanguage
- isSynthetic
- createdAt
- updatedAt

### ExtractedPrescriptionField
Stores extracted fields with confidence.

Fields:
- id
- prescriptionId
- fieldName
- extractedValue
- correctedValue
- confidence
- sourceText
- sourceBoundingBoxJson
- correctedById
- correctionReason
- createdAt
- updatedAt

Field names:
- patient_name
- patient_dob
- prescriber_name
- prescriber_npi
- medication_name
- strength
- dosage_form
- quantity
- sig
- refills
- written_date
- notes

### PrescriberVerification
Stores NPI lookup result.

Fields:
- id
- prescriptionId
- npi
- queryName
- matchedName
- taxonomy
- addressJson
- status
- confidence
- warningsJson
- rawResultJson
- createdAt

Statuses:
- NOT_RUN
- FOUND_MATCH
- FOUND_MISMATCH
- NOT_FOUND
- MISSING_NPI
- API_ERROR
- NEEDS_REVIEW

### MedicationNormalization
Stores normalized drug result.

Fields:
- id
- prescriptionId
- originalText
- selectedRxCui
- selectedName
- genericName
- brandName
- strength
- dosageForm
- route
- ndcCandidatesJson
- confidence
- status
- warningsJson
- rawResultJson
- createdAt

Statuses:
- MATCHED
- AMBIGUOUS
- NOT_FOUND
- API_ERROR
- NEEDS_REVIEW

### SafetyCheck
Stores each safety result.

Fields:
- id
- prescriptionId
- checkType
- status
- riskLevel
- message
- evidenceJson
- createdAt

Check types:
- COMPLETENESS
- ALLERGY
- DUPLICATE_THERAPY
- DOSE_RANGE_PLACEHOLDER
- AMBIGUOUS_SIG
- AGE_WARNING_PLACEHOLDER
- LABEL_WARNING
- INVENTORY_SAFETY

Statuses:
- PASS
- WARNING
- FAIL
- NEEDS_REVIEW
- SKIPPED

### InventoryItem
Represents stock.

Fields:
- id
- ndc
- rxCui
- medicationName
- genericName
- brandName
- strength
- dosageForm
- quantityOnHand
- lotNumber
- expiryDate
- storageLocation
- reorderThreshold
- isActive
- createdAt
- updatedAt

### DispenseTask
Represents a simulated dispensing task.

Fields:
- id
- prescriptionId
- inventoryItemId
- status
- quantityToDispense
- pickLocation
- labelText
- robotCommandJson
- assignedToId
- approvedById
- createdAt
- updatedAt

Statuses:
- CREATED
- WAITING_FOR_APPROVAL
- APPROVED
- PICKING
- COUNTING
- PACKAGING
- LABELING
- COMPLETE
- CANCELLED
- FAILED

### AgentRun
Stores one agent execution.

Fields:
- id
- prescriptionId
- agentName
- agentVersion
- status
- inputJson
- outputJson
- confidence
- riskLevel
- summary
- errorMessage
- startedAt
- completedAt
- createdAt

Statuses:
- STARTED
- COMPLETED
- FAILED
- SKIPPED
- NEEDS_REVIEW

### AgentToolCall
Stores external/internal tool calls made by an agent.

Fields:
- id
- agentRunId
- toolName
- inputJson
- outputJson
- status
- errorMessage
- startedAt
- completedAt

### AuditLog
Append-only event log.

Fields:
- id
- actorUserId
- actorType
- prescriptionId
- eventType
- eventSummary
- beforeJson
- afterJson
- metadataJson
- createdAt

Actor types:
- USER
- AGENT
- SYSTEM

Event examples:
- PRESCRIPTION_UPLOADED
- OCR_COMPLETED
- FIELD_EXTRACTED
- FIELD_CORRECTED
- PRESCRIBER_VERIFIED
- DRUG_NORMALIZED
- SAFETY_CHECK_COMPLETED
- INVENTORY_MATCHED
- DISPENSE_TASK_CREATED
- PHARMACIST_APPROVED
- PHARMACIST_REJECTED
- ESCALATED

### ExternalLookupCache
Caches public API results.

Fields:
- id
- source
- queryKey
- responseJson
- expiresAt
- createdAt
- updatedAt

Sources:
- NPI_REGISTRY
- RXNORM
- OPENFDA
- DAILYMED
- FDA_NDC

## Suggested Prisma Enum Sketch

```prisma
enum UserRole {
  ADMIN
  PHARMACIST
  OPERATOR
  AUDITOR
  PATIENT_SIM
}

enum PrescriptionStatus {
  UPLOADED
  OCR_PROCESSING
  PARSED
  VERIFYING_PRESCRIBER
  NORMALIZING_DRUG
  RUNNING_SAFETY_CHECKS
  MATCHING_INVENTORY
  READY_FOR_REVIEW
  APPROVED
  REJECTED
  ESCALATED
  DISPENSE_TASK_CREATED
  SIMULATED_DISPENSED
  FAILED
}

enum RiskLevel {
  GREEN
  YELLOW
  RED
}
```

## Data Retention for MVP
Because the MVP should only use synthetic data:

- Demo prescriptions can be reset.
- Audit logs should remain for demo storytelling.
- External lookup cache can be refreshed.
- No real patient data should be accepted.

## Indexing Recommendations
Add indexes on:
- Prescription.status
- Prescription.riskLevel
- Prescription.createdAt
- AgentRun.prescriptionId
- AuditLog.prescriptionId
- InventoryItem.ndc
- InventoryItem.rxCui
- InventoryItem.medicationName

## MVP Seed Data
Create seed scripts for:
- Admin user
- Pharmacist user
- Operator user
- Synthetic patients
- Inventory items
- Demo prescriptions

## Database Rule
Never delete audit logs in normal app flows. Use soft delete for user-facing records if necessary.
