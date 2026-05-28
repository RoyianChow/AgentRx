# Agent Architecture

## Agent-Native Design Philosophy
AgentRx should not be built as one giant AI prompt. It should be built as a network of narrow, auditable agents.

Each agent should:

- Have a single responsibility
- Accept structured input
- Return structured output
- Produce confidence scores
- Log tool calls
- Escalate uncertainty
- Avoid making final clinical decisions

## Agent List

### 1. Intake Agent
Purpose:
Classify the uploaded document and prepare it for OCR/parsing.

Inputs:
- File metadata
- File type
- Uploader role
- Prescription ID

Outputs:
- Document type
- Processing recommendation
- Whether OCR is required
- Initial risk flags

Example flags:
- Unsupported file type
- Image too blurry
- Multiple prescriptions detected
- Possible non-prescription document

### 2. OCR/Parsing Agent
Purpose:
Convert raw OCR text into structured prescription data.

Inputs:
- OCR text
- Prescription image reference
- Optional OCR bounding boxes

Outputs:
- Patient name
- DOB
- Prescriber name
- NPI
- Medication
- Strength
- Quantity
- SIG/directions
- Refills
- Written date
- Notes
- Field confidence scores

Escalation triggers:
- Missing medication
- Missing quantity
- Missing directions
- Low confidence medication field
- Conflicting OCR text

### 3. Prescriber Verification Agent
Purpose:
Check whether the prescriber identity appears consistent with public NPI data.

Inputs:
- Extracted prescriber name
- NPI
- Address if available
- Phone if available
- State if available

Tools:
- NPI Registry lookup

Outputs:
- NPI found / not found
- Matched name
- Taxonomy/specialty
- Address comparison
- Confidence score
- Warning flags

Important wording:
This agent checks identity consistency. It does not guarantee legal prescription validity.

### 4. Drug Normalization Agent
Purpose:
Convert messy prescription medication text into structured drug concepts.

Inputs:
- Medication name
- Strength
- Dosage form
- Route

Tools:
- RxNorm/RxNav
- openFDA NDC
- DailyMed label lookup

Outputs:
- RxCUI candidates
- Generic name
- Brand name
- Strength
- Dosage form
- Route
- NDC candidates
- Confidence score

Escalation triggers:
- Multiple possible drug matches
- Unknown medication
- Strength mismatch
- Route mismatch

### 5. Safety Agent
Purpose:
Run basic safety and completeness checks.

Inputs:
- Parsed prescription
- Normalized drug
- Synthetic patient profile
- Patient allergies
- Patient active medications
- Label warnings

Outputs:
- Completeness results
- Allergy conflict result
- Duplicate therapy result
- Dose/SIG ambiguity result
- Warning summary
- Risk level
- Human review recommendation

MVP rule:
The Safety Agent does not make final clinical judgments. It creates warnings for pharmacist review.

### 6. Inventory Agent
Purpose:
Find a matching inventory item and check availability.

Inputs:
- Normalized drug
- Quantity requested
- NDC candidates

Outputs:
- Inventory match
- Quantity available
- Lot number
- Expiry date
- Storage location
- Reorder warning
- Substitute candidates if no match

Escalation triggers:
- No stock
- Expired stock
- Near-expiry stock
- NDC mismatch
- Insufficient quantity

### 7. Dispensing Orchestration Agent
Purpose:
Create a simulated pick/pack/count task.

Inputs:
- Prescription
- Inventory match
- Safety status
- Pharmacist review requirement

Outputs:
- Dispense task
- Pick instructions
- Count quantity
- Label preview
- Packaging instructions
- Robot/digital twin command payload

Escalation triggers:
- Safety warning exists
- Inventory mismatch
- Missing pharmacist approval

### 8. Supervisor Summary Agent
Purpose:
Create a concise review package for the pharmacist.

Inputs:
- All prior agent outputs
- Audit logs
- Risk flags

Outputs:
- One-page summary
- Green/yellow/red risk score
- Recommended action
- Required human review points

Example summary:
“Prescription was parsed with high confidence. Prescriber NPI found. Medication normalized to Metformin 500 mg tablet. Allergy check passed. Directions are ambiguous because frequency is missing. Recommend pharmacist review before approval.”

## Agent Output Contract
All agents should return:

```json
{
  "agentName": "string",
  "version": "string",
  "status": "completed | failed | skipped | needs_review",
  "confidence": 0.0,
  "riskLevel": "green | yellow | red",
  "summary": "string",
  "data": {},
  "warnings": [],
  "errors": [],
  "requiresHumanReview": true,
  "toolCalls": []
}
```

## Agent Risk Rules

### Green
- High confidence
- No safety warnings
- Data sources agree
- Inventory matched

### Yellow
- Missing non-critical field
- Minor mismatch
- Low confidence field
- Ambiguous directions
- External data unavailable

### Red
- Unknown medication
- Major prescriber mismatch
- Possible allergy conflict
- Expired stock
- Missing critical prescription field
- Severe safety warning

## Agent Orchestration Sequence

```text
Intake Agent
  ↓
OCR/Parsing Agent
  ↓
Prescriber Verification Agent
  ↓
Drug Normalization Agent
  ↓
Safety Agent
  ↓
Inventory Agent
  ↓
Dispensing Orchestration Agent
  ↓
Supervisor Summary Agent
```

## Parallelization
Some agents can run in parallel after parsing:

- Prescriber Verification Agent
- Drug Normalization Agent

Safety Agent should wait for Drug Normalization Agent.

Inventory Agent should wait for Drug Normalization Agent.

Supervisor Summary Agent should run last.

## Agent Memory
For MVP, keep memory simple:

- Prescription-specific context only
- No long-term patient memory
- No real patient profiles
- Synthetic demo profiles only

## Prompting Guidelines
Agents should never say:
- “This prescription is legally valid.”
- “This medication is safe for the patient.”
- “The patient should take this.”

Agents may say:
- “No obvious issue was detected in the available synthetic data.”
- “This requires pharmacist review.”
- “The extracted directions appear incomplete.”
- “The medication was normalized to the following candidates.”

## Human Override Design
Every field should allow human correction.

Correction must log:
- Previous value
- New value
- User ID
- Timestamp
- Reason note if provided

## Future Agent Extensions
Later agents could include:
- Insurance Adjudication Agent
- Refill Management Agent
- Patient Counseling Agent
- Delivery Logistics Agent
- Prior Authorization Agent
- Drug Shortage Agent
- Supplier Ordering Agent
- Claims Reconciliation Agent
