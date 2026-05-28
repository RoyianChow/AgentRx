# Testing and Evaluation Plan

## Testing Goals
The MVP must be reliable enough to demo confidently.

Testing should verify:
- Prescription upload works
- OCR pipeline works
- Agents return valid JSON
- External API integrations work or fail gracefully
- Pharmacist review flow works
- Safety warnings trigger correctly
- Audit logs capture all actions

## Test Categories

### 1. Unit Tests
Test individual functions.

Examples:
- Parse medication strength
- Normalize phone number
- Validate NPI format
- Map risk level
- Create audit event
- Match inventory item

### 2. Integration Tests
Test services together.

Examples:
- Upload → OCR job created
- Parser Agent → extracted fields saved
- Drug Agent → RxNorm service called
- Safety Agent → safety checks saved
- Approval → audit log created

### 3. Agent Contract Tests
Every agent must return valid schema.

Test cases:
- Normal input
- Missing required input
- Ambiguous data
- Tool failure
- Low confidence output

### 4. Workflow Tests
End-to-end prescription scenarios.

Scenarios:
1. Clean prescription
2. Missing NPI
3. Ambiguous medication
4. Allergy conflict
5. Out of stock
6. Expired inventory
7. Blurry prescription

### 5. UI Tests
Test main flows:
- Login
- Upload prescription
- View review queue
- Correct extracted field
- Approve prescription
- Escalate prescription
- View audit logs

### 6. Security Tests
Minimum checks:
- Unauthenticated users cannot access dashboard.
- Operator cannot approve prescriptions.
- Auditor cannot modify prescriptions.
- API keys are not exposed to frontend.
- File upload rejects unsupported file types.

## Evaluation Metrics

### OCR / Parsing Metrics
- Field extraction accuracy
- Medication extraction accuracy
- Critical field missing rate
- Average confidence score

### Agent Workflow Metrics
- Agent success rate
- Average processing time
- External API failure rate
- JSON schema validity rate

### Safety Metrics
- Correct escalation of red scenarios
- Correct yellow flag generation
- False green rate

### UX Metrics
- Time to pharmacist review
- Number of clicks to approve
- Time to run demo
- Clarity of warning explanation

## MVP Target Metrics
- 90%+ extraction accuracy on clean typed prescriptions
- 100% JSON-valid agent outputs in demo scenarios
- Under 60 seconds from upload to review package
- Under 3 minutes full demo time
- 0 cases where red warning is shown as green

## Demo Test Matrix

| Scenario | Expected Risk | Expected Status |
|---|---|---|
| Clean prescription | Green | Ready for Review |
| Missing NPI | Yellow | Needs Review |
| Ambiguous medication | Yellow/Red | Escalated |
| Allergy conflict | Red | Escalated |
| Out of stock | Yellow | Inventory Blocked |
| Expired inventory | Red | Escalated |
| Low OCR confidence | Yellow | Needs Review |

## Manual QA Checklist
Before every demo:

- [ ] Database seeded
- [ ] Demo users login successfully
- [ ] Demo prescriptions available
- [ ] OCR provider working or cached text available
- [ ] External API cache warmed
- [ ] Agent workflow completes
- [ ] Review queue loads
- [ ] Approval action works
- [ ] Audit log visible
- [ ] Digital twin/simulator loads
- [ ] No real patient data present

## Test Data Rules
Use synthetic data only.

Prescription examples should include:
- Clean typed text
- Bad handwriting simulation
- Missing fields
- Incorrect NPI
- Allergy conflict
- Out-of-stock medication

## Agent Evaluation Rubric
For each agent output, rate:

1. Correctness
2. Completeness
3. Confidence calibration
4. Explanation quality
5. Escalation behavior
6. Schema validity

## Regression Testing
Every time an agent prompt changes, rerun all demo scenarios.

## Fail-Safe Requirement
If any critical agent fails, the workflow must move to needs review, not green.
