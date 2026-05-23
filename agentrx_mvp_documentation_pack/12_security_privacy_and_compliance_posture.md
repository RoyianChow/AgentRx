# Security, Privacy, and Compliance Posture

## Purpose
This document defines the MVP’s security and privacy posture.

## MVP Position
AgentRx MVP should be built with healthcare-grade discipline even though it uses synthetic data.

## Data Classification

### Allowed in MVP
- Synthetic patient data
- Synthetic prescription files
- Public NPI records
- Public drug data
- Mock inventory data
- Demo audit logs

### Not Allowed in MVP
- Real patient data
- Real prescriptions
- Real PHI
- Real insurance data
- Real pharmacy dispensing data
- Controlled substance data

## Authentication
Minimum:
- Email/password auth
- Role-based access control
- Protected routes
- Session expiration

Roles:
- Admin
- Pharmacist
- Operator
- Auditor
- Patient Simulation User

## Authorization Rules

### Admin
Can access all areas.

### Pharmacist
Can review, approve, reject, escalate, correct fields.

### Operator
Can view assigned dispense tasks and advance simulated task status.

### Auditor
Can view read-only records and audit logs.

### Patient Simulation User
Can upload demo prescriptions and view own synthetic workflow.

## File Storage Security
- Store files in private bucket.
- Use signed URLs for temporary access.
- Validate file type.
- Limit file size.
- Scan for basic upload abuse if possible.

## API Security
- Require auth for all internal endpoints.
- Validate input schemas.
- Rate-limit upload and workflow endpoints.
- Do not expose external API keys to frontend.
- Log errors without leaking secrets.

## Secret Management
Use environment variables for:
- Database URL
- Auth secret
- S3 credentials
- OCR provider credentials
- LLM API keys
- External API keys if needed

Never commit:
- .env files
- API keys
- Database credentials
- Provider secrets

## Audit Logging
The audit log should be append-only.

Capture:
- Actor
- Event type
- Timestamp
- Before/after where relevant
- Source IP if available
- Prescription ID
- Agent run ID if relevant

## Privacy by Design
Even in sandbox:
- Keep demo data fake.
- Make it obvious when data is synthetic.
- Do not allow arbitrary real prescription upload in public demo.
- Provide reset function for demo environments.

## HIPAA Posture for MVP
Do not claim HIPAA compliance unless you have:
- Signed BAAs with vendors
- Proper access controls
- Security policies
- Audit and monitoring
- PHI handling procedures
- Encryption policies
- Incident response plan

For MVP, say:

> The prototype is designed for synthetic data only. Production healthcare deployment would require HIPAA-ready infrastructure, BAAs, security controls, and legal review.

## Encryption
Recommended:
- TLS for all network traffic
- Database encryption at rest through provider
- Object storage encryption at rest
- Secret manager for production

## Logging Rules
Do not log:
- Raw secrets
- Tokens
- Passwords
- API keys

For future real data, do not log PHI unnecessarily.

## Access Review
Before a demo:
- Disable public registration or restrict demo accounts.
- Use sample data only.
- Reset database after testing.

## Security MVP Checklist
- [ ] Auth implemented
- [ ] Role checks implemented
- [ ] Upload validation implemented
- [ ] Private file storage implemented
- [ ] Audit logs implemented
- [ ] Secrets excluded from Git
- [ ] Demo data clearly synthetic
- [ ] No real prescription disclaimer shown
- [ ] API keys server-side only
- [ ] Error messages sanitized
