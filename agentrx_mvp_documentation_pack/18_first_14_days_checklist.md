# First 14 Days Checklist

## Goal for First 14 Days
By the end of two weeks, you should have a working app where a user can log in, upload a synthetic prescription, view it, and see an initial extracted/placeholder prescription record.

## Day 1: Finalize Scope
- [ ] Choose project name: AgentRx or alternative
- [ ] Choose stack: Next.js + Prisma + Postgres
- [ ] Decide whether to use Python agent service immediately or later
- [ ] Create GitHub repo
- [ ] Add README
- [ ] Add .env.example

## Day 2: App Setup
- [ ] Create Next.js app
- [ ] Install Tailwind/shadcn/ui
- [ ] Install Prisma
- [ ] Connect Postgres
- [ ] Create base layout
- [ ] Create sidebar navigation

## Day 3: Database Schema v1
- [ ] Add User model
- [ ] Add Prescription model
- [ ] Add PatientProfile model
- [ ] Add AgentRun model
- [ ] Add AuditLog model
- [ ] Run migration
- [ ] Seed admin/pharmacist users

## Day 4: Authentication
- [ ] Add login page
- [ ] Add protected dashboard
- [ ] Add role field
- [ ] Add route protection
- [ ] Test Admin and Pharmacist login

## Day 5: Dashboard UI
- [ ] Create dashboard cards
- [ ] Add prescription status card
- [ ] Add review queue card
- [ ] Add agent activity placeholder
- [ ] Add recent audit log placeholder

## Day 6: File Upload Backend
- [ ] Choose storage provider
- [ ] Create upload endpoint/server action
- [ ] Validate file type
- [ ] Store file
- [ ] Create Prescription record
- [ ] Add upload audit log

## Day 7: Upload UI
- [ ] Build drag-and-drop uploader
- [ ] Add file preview
- [ ] Add upload progress
- [ ] Redirect to prescription detail page
- [ ] Test PNG/JPG/PDF

## Day 8: Prescription List
- [ ] Create prescriptions page
- [ ] Add table
- [ ] Add status badges
- [ ] Add filters
- [ ] Add link to detail page

## Day 9: Prescription Detail Layout
- [ ] Create detail page
- [ ] Add left-side document viewer
- [ ] Add right-side info panel
- [ ] Add status header
- [ ] Add placeholder extracted fields

## Day 10: OCR Provider Decision
- [ ] Test Tesseract or chosen OCR provider
- [ ] Create OCR service wrapper
- [ ] Add OCR result field to Prescription
- [ ] Store raw OCR text

## Day 11: OCR UI
- [ ] Add “Run OCR” button
- [ ] Show OCR status
- [ ] Show raw OCR text tab
- [ ] Add OCR error state

## Day 12: Parser Agent v0
- [ ] Create parser function/prompt
- [ ] Define JSON output schema
- [ ] Extract patient/prescriber/medication fields
- [ ] Store extracted fields
- [ ] Add confidence values

## Day 13: Extracted Fields UI
- [ ] Display extracted fields
- [ ] Add editable corrections
- [ ] Log field correction
- [ ] Show confidence badges

## Day 14: Demo Scenario v0
- [ ] Create one synthetic prescription
- [ ] Seed one synthetic patient
- [ ] Upload and parse successfully
- [ ] Record a short progress demo video
- [ ] Write notes on what failed

## End-of-Week-2 Deliverable
You should be able to show:

1. Login as pharmacist.
2. Upload synthetic prescription.
3. View original document.
4. Run OCR.
5. See extracted fields.
6. Correct a field.
7. See audit log entry.

## Do Not Work On Yet
- Hardware
- Insurance
- Payment
- Real patients
- Advanced safety logic
- Full drug interaction engine
- Mobile app

## Founder Rule
At the end of every week, record a 2-minute demo video. This helps with YC, progress tracking, and investor storytelling.
