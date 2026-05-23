# YC-Style Demo Script

## Demo Goal
Show that AgentRx can process a prescription through an AI-run pharmacy workflow while keeping a pharmacist in control.

## Demo Length
Target: 2.5 to 3 minutes

## Demo Setup
Before recording or presenting:
- Seed demo data
- Use synthetic prescription
- Login as pharmacist
- Open dashboard
- Ensure external API cache is warmed
- Have one clean scenario and one warning scenario ready

## Opening Line
“Pharmacies still run like manual assembly lines. A prescription moves through several people for intake, data entry, verification, inventory, and fulfillment. AgentRx turns that into an AI-agent workflow where pharmacists supervise instead of manually processing everything.”

## Step 1: Show Dashboard
Say:
“This is the AI pharmacy command center. It shows prescriptions moving through agents, review queues, inventory warnings, and dispense tasks.”

Show:
- Prescriptions today
- Ready for review
- Agent success rate
- Inventory warning card

## Step 2: Upload Prescription
Say:
“I’ll upload a synthetic prescription. In a traditional pharmacy, a person would read this, type it into software, check the prescriber, identify the drug, check inventory, and prepare it for pharmacist review.”

Action:
- Upload sample prescription
- Click process

## Step 3: Agents Run
Say:
“AgentRx breaks that work into specialized agents instead of one black-box model.”

Show agent timeline:
- OCR/Parsing Agent
- Prescriber Verification Agent
- Drug Normalization Agent
- Safety Agent
- Inventory Agent
- Dispensing Orchestration Agent

## Step 4: Review Extracted Prescription
Say:
“The parser extracted the patient, prescriber, medication, quantity, directions, and refills. Every field has confidence and can be corrected by the pharmacist.”

Show:
- Original prescription beside extracted fields
- Confidence values

## Step 5: Prescriber and Drug Intelligence
Say:
“The prescriber identity is checked against public NPI data, and the medication is normalized to structured drug data instead of relying on messy free text.”

Show:
- NPI result card
- Drug normalization card
- RxCUI or NDC candidate

## Step 6: Safety and Inventory
Say:
“The safety agent screens for missing fields, allergy conflicts, duplicate therapy placeholders, ambiguous instructions, and label warnings. The inventory agent then finds the matching product and lot.”

Show:
- Safety card
- Inventory match card

## Step 7: Pharmacist Review
Say:
“The important part is that the AI does not replace the pharmacist. It creates a pharmacist-ready package. The pharmacist sees the risk summary and approves, rejects, or escalates.”

Action:
- Click approve

## Step 8: Simulated Dispensing
Say:
“After approval, AgentRx creates a simulated dispense task: pick location, quantity, label, package, and robot command. This is where the system can later connect to real pharmacy automation hardware.”

Show:
- Dispense task board
- Digital twin animation

## Step 9: Audit Trail
Say:
“Every agent action and every human override is logged. This is critical for trust, supervision, and future compliance.”

Show:
- Audit log
- Agent run details

## Closing Line
“AgentRx replaces repetitive pharmacy-assistant workflows with auditable AI agents, allowing one pharmacist to supervise much more work safely. The MVP is sandboxed, but the workflow is the foundation for autonomous pharmacy operations.”

## Optional Warning Scenario
Run allergy conflict scenario.

Say:
“Here’s what happens when the AI should not proceed. The patient profile has a penicillin allergy and the prescription is for amoxicillin. The system escalates it instead of treating it as routine.”

Show:
- Red risk
- Safety warning
- Dispense task blocked

## Demo Do’s
- Keep it fast
- Show visual workflow
- Emphasize pharmacist oversight
- Show auditability
- Show one successful case and one safety case

## Demo Don’ts
- Do not say it dispenses real medication
- Do not say it is legally compliant
- Do not claim the AI replaces pharmacists
- Do not use real patient prescriptions

## 30-Second Version
“AgentRx is an AI operating system for pharmacies. I upload a synthetic prescription, agents extract the fields, verify prescriber identity, normalize the drug, run safety checks, match inventory, and create a dispense task. The pharmacist reviews a concise package and approves or escalates. Every step is logged. The goal is to replace repetitive pharmacy-assistant work, not pharmacist judgment.”
