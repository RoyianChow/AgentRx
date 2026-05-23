# sturdy-giggle

# AgentRx

AgentRx is an AI-powered pharmacy dashboard designed to help manage medication records, prescription workflows, patient information, and AI-assisted pharmacy support.

The goal of AgentRx is to create a modern pharmacy platform that combines a clean dashboard experience with future AI agent capabilities for medication-related assistance, document processing, and workflow automation.

## Tech Stack

- Next.js
- TypeScript
- Prisma
- NeonDB Postgres
- shadcn/ui
- Tailwind CSS
- Tigris S3-compatible storage, planned for future file uploads
- Python/FastAPI agent service, planned for a later phase

## Core Features

- Pharmacy dashboard
- Patient profile management
- Medication record management
- Prescription tracking
- AI assistant interface
- Admin-friendly UI
- Future support for prescription/document uploads
- Future AI agent service for pharmacy workflow automation

## Project Scope

AgentRx is not intended to replace doctors, pharmacists, or licensed medical professionals. The AI features are designed to support workflow automation, information organization, and user guidance only.

## Development Roadmap

### Phase 1: Full-Stack Dashboard

- Set up Next.js project
- Configure Prisma and NeonDB
- Build dashboard UI with shadcn/ui
- Add patient, medication, and prescription models
- Add basic CRUD workflows

### Phase 2: File Uploads

- Add Tigris S3 storage
- Upload prescription images or PDFs
- Store file metadata in Postgres

### Phase 3: AI Assistant

- Add AI assistant UI
- Create safe prompt templates
- Store agent conversations and activity logs

### Phase 4: Python Agent Service

- Add FastAPI service
- Add document extraction
- Add medication lookup workflow
- Add pharmacy-specific automation tools

## Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/agentrx-ai-pharmacy.git
cd agentrx-ai-pharmacy
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run dev