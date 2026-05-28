# UI/UX Screen Specification

## Design Style
The interface should feel like a modern command center:

- Clean cards
- Soft shadows
- High trust
- Minimal clutter
- Medical-grade seriousness
- Clear risk colors
- Timeline-based agent activity
- Side-by-side document and extracted data

## Core Navigation
Sidebar items:

1. Dashboard
2. Prescriptions
3. Review Queue
4. Dispense Tasks
5. Inventory
6. Agents
7. Audit Logs
8. Demo Runner
9. Settings

## Screen 1: Login
Purpose:
Allow users to access role-based dashboard.

Fields:
- Email
- Password

Demo helper:
- “Login as Pharmacist”
- “Login as Admin”
- “Login as Operator”

## Screen 2: Main Dashboard
Purpose:
Show pharmacy operating status.

Cards:
- Prescriptions today
- Ready for review
- Escalated
- AI processed steps
- Avg processing time
- Inventory warnings

Charts:
- Prescription status distribution
- Agent success rate
- Time saved estimate

Recent activity:
- Last 10 audit log events

## Screen 3: Prescription Upload
Purpose:
Upload a synthetic prescription.

Components:
- Drag-and-drop file uploader
- Patient profile selector
- Demo scenario selector
- Upload button
- Processing status indicator

After upload:
- Redirect to prescription detail page

## Screen 4: Prescription Detail
Purpose:
Main command view for one prescription.

Layout:

Left panel:
- Original prescription image/PDF viewer
- Zoom controls
- OCR text tab

Right panel:
- Status header
- Risk badge
- Extracted fields form
- Agent timeline
- Prescriber card
- Drug normalization card
- Safety card
- Inventory card
- Dispense task card
- Pharmacist actions

Actions:
- Run workflow
- Re-run OCR
- Correct field
- Approve
- Reject
- Escalate
- Add note

## Screen 5: Review Queue
Purpose:
Allow pharmacist to triage prescriptions.

Table columns:
- Prescription ID
- Patient
- Medication
- Status
- Risk level
- Confidence
- Warnings
- Created time
- Actions

Filters:
- Green/yellow/red
- Ready for review
- Escalated
- Failed
- Medication name

## Screen 6: Agent Timeline
Purpose:
Show all agent steps visually.

Each step card:
- Agent name
- Status
- Confidence
- Risk level
- Duration
- Summary
- View details button

Timeline states:
- Pending
- Running
- Complete
- Failed
- Needs review

## Screen 7: Agent Run Detail
Purpose:
Debug and audit agent output.

Tabs:
- Summary
- Input JSON
- Output JSON
- Tool calls
- Errors
- Timing

## Screen 8: Inventory
Purpose:
Manage simulated medication inventory.

Table columns:
- Medication name
- Generic name
- NDC
- Strength
- Dosage form
- Quantity
- Lot
- Expiry
- Location
- Status

Badges:
- In stock
- Low stock
- Expired
- Near expiry

Actions:
- Add item
- Edit item
- Deactivate item
- Import seed data

## Screen 9: Dispense Task Board
Purpose:
Show simulated fulfillment tasks.

Board columns:
- Created
- Waiting for approval
- Approved
- Picking
- Counting
- Packaging
- Complete

Task card:
- Prescription ID
- Medication
- Quantity
- Location
- Risk level
- Status

## Screen 10: Simulated Robot/Digital Twin
Purpose:
Create the YC demo wow moment.

Visual elements:
- Pharmacy shelf map
- Medication bins
- Active robot task
- Pick progress
- Count progress
- Label generation
- Packaging state

This can be a frontend animation only for MVP.

## Screen 11: Audit Logs
Purpose:
Show trust and traceability.

Table columns:
- Timestamp
- Actor
- Event type
- Prescription ID
- Summary
- View details

Filters:
- Actor type
- Event type
- Prescription
- Date range

## Screen 12: Demo Runner
Purpose:
Let you run controlled demo scenarios.

Scenarios:
1. Clean prescription
2. Missing NPI
3. Ambiguous drug name
4. Allergy conflict
5. Out of stock
6. Expired inventory
7. Low confidence OCR

Each scenario button should:
- Load synthetic patient
- Load synthetic prescription
- Run workflow
- Show outcome

## Screen 13: Settings
Purpose:
Configure demo app.

Sections:
- API keys
- OCR provider
- Agent model provider
- Risk threshold settings
- Demo mode toggle
- Source cache controls

## UX Principles

### Always show why
Do not only show “warning.” Show the reason.

### Keep pharmacist in control
Primary actions should be review/approve/reject/escalate.

### Make AI inspectable
Every AI output should have “View agent details.”

### Make risk obvious
Use green/yellow/red status consistently.

### Show original source
Always allow the reviewer to compare extracted fields with the original prescription.

## Visual Copy Examples

### Green Summary
“No major issues detected in the available synthetic data. Prescription is ready for pharmacist review.”

### Yellow Summary
“Prescription requires review because the SIG instructions appear incomplete.”

### Red Summary
“Prescription escalated because the patient profile contains an allergy conflict.”

## Main Demo Screen Layout
For the YC demo, use this split layout:

```text
Original Prescription | AI Review Package
                     | Agent Timeline
                     | Safety Summary
                     | Pharmacist Approval
```

## Design Priority
The most important screen is the prescription detail/review screen. Build that first.
