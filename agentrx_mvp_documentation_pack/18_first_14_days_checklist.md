# AgentRx / AgentShefa Multi-Sprint Roadmap

## Product Goal

Build an AI-assisted pharmacy workflow app where a pharmacist can log in, upload a synthetic prescription, view the original document, run OCR, see extracted prescription fields, correct mistakes, and view an audit trail.

---

# Sprint 1: Foundation, Auth, Database, and Dashboard

## Sprint 1 Goal

Set up the core app foundation: stack, database, authentication, protected dashboard structure, and first enterprise-style UI components.

## Completed

### Project Scope

- [x] Project name selected: **AgentRx / AgentShefa**
- [x] Stack selected: **Next.js + TypeScript + Prisma + NeonDB Postgres**
- [x] Decided to delay Python agent service until core dashboard is working
- [x] Decided not to use Hermes/OpenClaw as the main production backend
- [x] Decided to use Tigris S3 later for prescription/document uploads
- [x] Added healthcare safety direction: AI supports workflow, does not replace pharmacists or medical professionals

### App Setup

- [x] Created Next.js app
- [x] Installed Tailwind CSS
- [x] Installed shadcn/ui
- [x] Installed Prisma
- [x] Connected Prisma to NeonDB
- [x] Added T3-style env validation
- [x] Added `.env.example`
- [x] Created base project folder structure
- [x] Created route groups for auth and dashboard
- [x] Created sidebar navigation structure

### Database

- [x] Added User model
- [x] Added Better Auth models: Session, Account, Verification
- [x] Added Patient model
- [x] Added Medication model
- [x] Added Prescription model
- [x] Added PrescriptionMedication join model
- [x] Added AgentMessage model
- [x] Added role enum: USER, PHARMACIST, ADMIN
- [x] Ran Prisma format/generate/db push
- [x] Confirmed NeonDB connection works

### Authentication

- [x] Installed Better Auth
- [x] Added Better Auth server config
- [x] Added Better Auth API route
- [x] Added auth client
- [x] Created login page
- [x] Created forgot password page
- [x] Created reset password page
- [x] Connected Resend for password reset email
- [x] Added enterprise-grade password reset email template
- [x] Added role field to user
- [x] Added `requireUser`
- [x] Added `requireAdmin`
- [~] Protected dashboard layout started
- [~] Route protection started

### Dashboard UI

- [x] Created dashboard shell
- [x] Created dashboard sidebar
- [x] Created dashboard header
- [x] Created dashboard stats cards
- [x] Created prescription queue card
- [x] Created AI review progress card
- [x] Created AI assistant placeholder
- [x] Created recent activity component
- [x] Upgraded recent activity component to enterprise style
- [x] Created empty state component
- [x] Created placeholder pages for:
  - [x] Patients
  - [x] Prescriptions
  - [x] Medications
  - [x] Assistant
  - [x] Admin

## Sprint 1 Carryover / Fixes

- [ ] Fix `/dashboard/layout` default export issue
- [ ] Confirm protected dashboard loads correctly
- [ ] Confirm unauthenticated users redirect to `/login`
- [ ] Confirm login works with Better Auth
- [ ] Confirm forgot password works with Resend test sender
- [ ] Confirm reset password works
- [ ] Push working code to GitHub
- [ ] Add README.md
- [ ] Add seed script for admin/pharmacist users

---

# Sprint 2: Auth Stabilization, Roles, Seeds, and Audit Foundation

## Sprint 2 Goal

Make authentication production-ready and prepare the system for auditable pharmacy workflows.

## Checklist

### Auth Stabilization

- [ ] Fix dashboard layout error
- [ ] Test login flow end-to-end
- [ ] Test logout flow
- [ ] Test forgot password flow
- [ ] Test reset password flow
- [ ] Test invalid password reset token state
- [ ] Test expired password reset token state
- [ ] Add loading states to protected dashboard
- [ ] Add better unauthorized/forbidden page
- [ ] Add redirect handling after login

### Roles and Permissions

- [ ] Confirm role is stored correctly in database
- [ ] Add role helper utilities
- [ ] Protect `/admin` route with `requireAdmin`
- [ ] Protect dashboard routes with `requireUser`
- [ ] Add role-based UI visibility
- [ ] Add Pharmacist role access
- [ ] Add Admin role access

### Seeds

- [ ] Create seed script
- [ ] Seed admin user
- [ ] Seed pharmacist user
- [ ] Seed synthetic patient
- [ ] Seed sample medication records
- [ ] Seed sample prescription records
- [ ] Document test credentials in local-only notes

### Audit Foundation

- [ ] Add `AuditLog` model
- [ ] Add audit action enum
- [ ] Add audit target type enum
- [ ] Create audit logging helper
- [ ] Log login-related security events where appropriate
- [ ] Log prescription create/update events later
- [ ] Add recent audit log query

### Agent Foundation

- [ ] Add `AgentRun` model
- [ ] Add agent status enum
- [ ] Add agent run type enum
- [ ] Add relation between AgentRun and Prescription
- [ ] Add relation between AgentRun and User
- [ ] Add placeholder agent run records for demo

## Sprint 2 Deliverable

By the end of Sprint 2, you should be able to show:

1. Admin/pharmacist login.
2. Protected dashboard access.
3. Role-based route protection.
4. Seeded synthetic records.
5. Audit log foundation.
6. Agent run foundation.

---

# Sprint 3: File Upload Backend

## Sprint 3 Goal

Allow pharmacists to upload a synthetic prescription file and store it securely.

## Checklist

### Storage Decision

- [ ] Confirm Tigris S3 as storage provider
- [ ] Add Tigris env variables
- [ ] Create S3/Tigris client
- [ ] Create upload key generator
- [ ] Create file validation utility
- [ ] Decide allowed file types:
  - [ ] PNG
  - [ ] JPG/JPEG
  - [ ] PDF

### Upload Backend

- [ ] Create upload server action or API route
- [ ] Validate file size
- [ ] Validate MIME type
- [ ] Validate file extension
- [ ] Upload file to Tigris
- [ ] Store file key in database
- [ ] Store original file name
- [ ] Store file size
- [ ] Store file type
- [ ] Create Prescription record after upload
- [ ] Connect uploaded prescription to pharmacist user
- [ ] Add upload audit log

### Prescription Schema Upgrade

- [ ] Add fileName to Prescription
- [ ] Add fileType to Prescription
- [ ] Add fileSize to Prescription
- [ ] Add fileUrl or fileKey to Prescription
- [ ] Add uploadStatus
- [ ] Add uploadedById relation
- [ ] Run Prisma migration/db push

## Sprint 3 Deliverable

By the end of Sprint 3, you should be able to upload a synthetic prescription and create a prescription record in the database.

---

# Sprint 4: Upload UI and Prescription List

## Sprint 4 Goal

Build the user-facing upload experience and prescription management list.

## Checklist

### Upload UI

- [ ] Create upload page
- [ ] Build drag-and-drop uploader
- [ ] Add file picker fallback
- [ ] Add file preview
- [ ] Add upload progress state
- [ ] Add validation error messages
- [ ] Add success state
- [ ] Redirect to prescription detail page after upload
- [ ] Test PNG upload
- [ ] Test JPG upload
- [ ] Test PDF upload
- [ ] Test invalid file type
- [ ] Test oversized file

### Prescription List

- [ ] Create prescriptions list page
- [ ] Add table layout
- [ ] Add status badges
- [ ] Add uploaded date
- [ ] Add uploaded by
- [ ] Add patient name placeholder
- [ ] Add search input
- [ ] Add status filter
- [ ] Add file type filter
- [ ] Add link to detail page

### Dashboard Integration

- [ ] Connect dashboard cards to real prescription counts
- [ ] Show pending prescription count
- [ ] Show uploaded prescription count
- [ ] Show recent prescription activity
- [ ] Replace static prescription queue with real records

## Sprint 4 Deliverable

By the end of Sprint 4, a pharmacist should be able to upload a prescription and view it in a searchable prescription list.

---

# Sprint 5: Prescription Detail and Document Viewer

## Sprint 5 Goal

Create a detail page where users can view the original uploaded prescription and placeholder extracted data.

## Checklist

### Prescription Detail Route

- [ ] Create `/dashboard/prescriptions/[prescriptionId]`
- [ ] Fetch prescription by ID
- [ ] Validate user access
- [ ] Add not-found state
- [ ] Add loading skeleton
- [ ] Add error state

### Document Viewer

- [ ] Add left-side document viewer
- [ ] Support image preview
- [ ] Support PDF preview
- [ ] Add open-in-new-tab button
- [ ] Add download button if safe
- [ ] Add file metadata panel

### Info Panel

- [ ] Add right-side prescription info panel
- [ ] Add prescription status header
- [ ] Add patient placeholder section
- [ ] Add prescriber placeholder section
- [ ] Add medication placeholder section
- [ ] Add notes section
- [ ] Add audit timeline placeholder

### Status Flow

- [ ] Add status enum states:
  - [ ] UPLOADED
  - [ ] OCR_PENDING
  - [ ] OCR_COMPLETE
  - [ ] EXTRACTION_PENDING
  - [ ] EXTRACTION_COMPLETE
  - [ ] NEEDS_REVIEW
  - [ ] REVIEWED
- [ ] Add status badge UI
- [ ] Add status update helper

## Sprint 5 Deliverable

By the end of Sprint 5, users can open an uploaded prescription, view the original document, and see structured placeholder fields.

---

# Sprint 6: OCR Provider and OCR UI

## Sprint 6 Goal

Run OCR on uploaded synthetic prescription files and store raw OCR output.

## Checklist

### OCR Provider Decision

- [ ] Test Tesseract.js
- [ ] Test server-side Tesseract option
- [ ] Compare with external OCR options
- [ ] Decide OCR provider for MVP
- [ ] Document why provider was chosen

### OCR Backend

- [ ] Create OCR service wrapper
- [ ] Create `runOcrForPrescription` server action
- [ ] Fetch file from storage
- [ ] Run OCR
- [ ] Store raw OCR text
- [ ] Store OCR status
- [ ] Store OCR error if failed
- [ ] Add OCR started audit log
- [ ] Add OCR completed audit log
- [ ] Add OCR failed audit log

### OCR Schema Upgrade

- [ ] Add `ocrStatus`
- [ ] Add `ocrText`
- [ ] Add `ocrError`
- [ ] Add `ocrCompletedAt`
- [ ] Add `ocrProvider`
- [ ] Run Prisma migration/db push

### OCR UI

- [ ] Add “Run OCR” button
- [ ] Add OCR loading state
- [ ] Add OCR success state
- [ ] Add OCR error state
- [ ] Add raw OCR text tab
- [ ] Add copy raw text button
- [ ] Disable OCR button while running

## Sprint 6 Deliverable

By the end of Sprint 6, a pharmacist can upload a synthetic prescription, open it, run OCR, and view the raw OCR text.

---

# Sprint 7: Parser Agent v0 and Extracted Fields

## Sprint 7 Goal

Convert raw OCR text into structured prescription fields with confidence values.

## Checklist

### Parser Function

- [ ] Create parser function
- [ ] Create parser prompt
- [ ] Define strict JSON output schema
- [ ] Add Zod validation for parser output
- [ ] Extract patient name
- [ ] Extract patient DOB if present
- [ ] Extract prescriber name
- [ ] Extract medication name
- [ ] Extract dosage
- [ ] Extract quantity
- [ ] Extract instructions
- [ ] Extract refill count if present
- [ ] Add confidence values

### Parser Storage

- [ ] Add `extractedPatientName`
- [ ] Add `extractedPrescriberName`
- [ ] Add `extractedMedicationName`
- [ ] Add `extractedDosage`
- [ ] Add `extractedQuantity`
- [ ] Add `extractedInstructions`
- [ ] Add `extractionConfidence`
- [ ] Add `extractionJson`
- [ ] Add `extractionStatus`
- [ ] Run Prisma migration/db push

### Agent Run Logging

- [ ] Create AgentRun when parser starts
- [ ] Mark AgentRun complete on success
- [ ] Mark AgentRun failed on error
- [ ] Store input/output summary
- [ ] Store parser model/provider used
- [ ] Add parser audit logs

### Extracted Fields UI

- [ ] Display extracted fields
- [ ] Add confidence badges
- [ ] Highlight low-confidence fields
- [ ] Add empty states
- [ ] Add parser error state
- [ ] Add “Run Extraction” button

## Sprint 7 Deliverable

By the end of Sprint 7, a user can run extraction and see structured prescription fields generated from OCR text.

---

# Sprint 8: Human Review, Corrections, and Audit Trail

## Sprint 8 Goal

Allow pharmacists to correct extracted fields and log every change.

## Checklist

### Editable Fields

- [ ] Make extracted patient name editable
- [ ] Make prescriber name editable
- [ ] Make medication name editable
- [ ] Make dosage editable
- [ ] Make quantity editable
- [ ] Make instructions editable
- [ ] Add save corrections action
- [ ] Add validation
- [ ] Add dirty state
- [ ] Add unsaved changes warning

### Audit Logging

- [ ] Log every corrected field
- [ ] Store old value
- [ ] Store new value
- [ ] Store corrected by user
- [ ] Store correction timestamp
- [ ] Show correction history
- [ ] Show audit log on prescription detail page

### Review Status

- [ ] Add “Mark as Needs Review”
- [ ] Add “Mark as Reviewed”
- [ ] Add reviewer ID
- [ ] Add reviewedAt
- [ ] Add review notes
- [ ] Add audit log for review completion

## Sprint 8 Deliverable

By the end of Sprint 8, a pharmacist can correct extracted fields and see audit log entries for each correction.

---

# Sprint 9: Demo Scenario and Polish

## Sprint 9 Goal

Create a complete demo scenario for Riipen, portfolio, YC-style updates, and investor storytelling.

## Checklist

### Demo Data

- [ ] Create one synthetic prescription image/PDF
- [ ] Seed one synthetic patient
- [ ] Seed one pharmacist account
- [ ] Seed one admin account
- [ ] Seed medication examples
- [ ] Add sample OCR text
- [ ] Add sample extracted fields
- [ ] Add sample audit logs

### Demo Flow

- [ ] Login as pharmacist
- [ ] Upload synthetic prescription
- [ ] View original document
- [ ] Run OCR
- [ ] See raw OCR text
- [ ] Run extraction
- [ ] See extracted fields
- [ ] Correct one field
- [ ] Mark as reviewed
- [ ] View audit log

### Polish

- [ ] Fix responsive UI
- [ ] Add loading skeletons
- [ ] Add better empty states
- [ ] Add error boundaries
- [ ] Add toast notifications
- [ ] Add README screenshots
- [ ] Add architecture diagram
- [ ] Add known limitations section

### Demo Assets

- [ ] Record 2-minute demo video
- [ ] Write sprint summary
- [ ] Write what failed
- [ ] Write what changed
- [ ] Write next sprint goals

## Sprint 9 Deliverable

By the end of Sprint 9, you should have a working demo that shows the full MVP workflow.

---

# Sprint 10: Production Hardening

## Sprint 10 Goal

Make the project feel enterprise-grade and ready for public portfolio/demo review.

## Checklist

- [ ] Add rate limiting
- [ ] Add request validation
- [ ] Add server-side permissions for every action
- [ ] Add environment validation for all services
- [ ] Add structured logging
- [ ] Add error monitoring plan
- [ ] Add secure file access flow
- [ ] Add signed file URLs
- [ ] Add file deletion flow
- [ ] Add audit log filters
- [ ] Add admin user management
- [ ] Add role management
- [ ] Add database indexes
- [ ] Add pagination
- [ ] Add optimistic UI where safe
- [ ] Add production deployment checklist

---

# Sprint 11: Agent Service v1

## Sprint 11 Goal

Introduce a separate Python/FastAPI agent service only after the core app is stable.

## Checklist

- [ ] Create Python FastAPI service
- [ ] Add `/health` endpoint
- [ ] Add `/parse-prescription` endpoint
- [ ] Add service API key authentication
- [ ] Connect Next.js to Python service
- [ ] Move parser logic to service
- [ ] Add request/response schema
- [ ] Add timeout handling
- [ ] Add retry handling
- [ ] Add service error handling
- [ ] Log agent calls in AgentRun
- [ ] Document local dev setup

---

# Sprint 12: Deployment and Portfolio Launch

## Sprint 12 Goal

Deploy the app and prepare it as a polished project for Riipen, portfolio, and future startup applications.

## Checklist

- [ ] Deploy Next.js app to Vercel
- [ ] Configure Neon production database
- [ ] Configure Resend production sender
- [ ] Verify email domain
- [ ] Configure Tigris production bucket
- [ ] Add production environment variables
- [ ] Test production login
- [ ] Test production upload
- [ ] Test production OCR
- [ ] Test production extraction
- [ ] Add live demo link to README
- [ ] Add screenshots to README
- [ ] Add architecture section
- [ ] Add security notes
- [ ] Add roadmap section
- [ ] Create portfolio case study

---

# Current Sprint Status

You are currently at the end of **Sprint 1**.

## Sprint 1 Completion Summary

- Foundation: mostly complete
- Database: mostly complete
- Auth: partially complete, needs testing
- Dashboard UI: mostly complete
- File uploads: not started
- OCR: not started
- Parser agent: not started
- Audit logging: not started

## Recommended Next Sprint

Start **Sprint 2: Auth Stabilization, Roles, Seeds, and Audit Foundation**.

Do not start file upload until these are done:

- [ ] Dashboard layout error fixed
- [ ] Login tested
- [ ] Protected dashboard tested
- [ ] Admin/pharmacist seed users created
- [ ] AuditLog model added
- [ ] AgentRun model added

---

# Do Not Work On Yet

- Hardware
- Insurance
- Payment
- Real patients
- Advanced safety logic
- Full drug interaction engine
- Mobile app
- Complex clinical decision support
- Real prescription processing
- Production patient data

---

# Founder Rule

At the end of every sprint, record a **2-minute demo video**.

The video should answer:

1. What did we build?
2. What works now?
3. What broke or failed?
4. What did we learn?
5. What are we building next?

This will help with:

- Riipen updates
- Portfolio proof
- YC-style progress tracking
- Investor storytelling
- Personal accountability