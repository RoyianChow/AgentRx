# Data Sources and Integrations

## Purpose
This document defines the external data sources AgentRx can use during the MVP.

## Principle
For the MVP, use public/open datasets only. Do not ingest real patient data or real pharmacy records.

## Integration 1: NPPES NPI Registry

### Purpose
Check prescriber identity using public NPI records.

### Use Cases
- Search prescriber by NPI
- Search prescriber by name
- Retrieve provider taxonomy
- Retrieve practice address if available
- Check whether input prescriber details appear consistent

### MVP Fields to Use
- NPI number
- Provider first name
- Provider last name
- Organization name if applicable
- Taxonomy description
- Address
- Enumeration date
- Last updated date
- Deactivation date if available

### Important Limitation
NPI lookup is not full legal validation of a prescription. NPI existence does not by itself prove licensing, prescribing authority, credentialing, or current authorization.

### MVP Output Language
Use:
- “Prescriber identity appears consistent.”
- “NPI found.”
- “NPI/name mismatch.”
- “Requires pharmacist review.”

Avoid:
- “Prescription is authentic.”
- “Prescription is legally valid.”

## Integration 2: RxNorm / RxNav

### Purpose
Normalize drug names into standard drug concepts.

### Use Cases
- Convert free-text medication names to RxCUI
- Find generic/brand relationships
- Retrieve dosage forms
- Retrieve related NDCs if available
- Map drug names to normalized terminology

### MVP Fields to Use
- RxCUI
- Name
- Term type
- Synonyms
- Ingredient
- Brand/generic relationship
- Dose form
- NDCs where available

### MVP Drug Normalization Flow
1. Take extracted medication text.
2. Search approximate drug match.
3. Get candidate RxCUI records.
4. Compare strength/dosage form from prescription.
5. Select best candidate or escalate if ambiguous.

## Integration 3: openFDA Drug APIs

### Purpose
Retrieve public FDA drug data for labels, NDC, recalls, adverse events, shortages, and Drugs@FDA information.

### MVP Use Cases
- Drug label lookup
- NDC candidate lookup
- Warning/contraindication text retrieval
- Drug product details
- Basic shortage/recall signals as future extension

### MVP Endpoints of Interest
- Drug Labeling
- NDC Directory
- Drugs@FDA
- Drug Shortages
- Recall Enforcement Reports
- Adverse Events as a later non-decision-support reference

### Important Limitation
openFDA should not be used as the sole basis for medical-care decisions.

### MVP Output Language
Use:
- “Label warning summary found.”
- “Public label data includes the following warning sections.”
- “No label result found for this query.”

Avoid:
- “This drug is safe.”
- “This warning does not apply.”

## Integration 4: FDA NDC Directory

### Purpose
Retrieve public drug product listing information by NDC.

### Use Cases
- Check product NDC candidates
- Retrieve labeler/manufacturer
- Retrieve dosage form
- Retrieve route
- Retrieve package information
- Support inventory matching

### Important Limitation
Inclusion in the NDC Directory does not automatically mean the FDA has approved the product for a given use. Treat NDC as a product identifier/listing source, not a full clinical validation source.

## Integration 5: DailyMed

### Purpose
Retrieve drug labels and structured product labeling information.

### Use Cases
- Pull patient/provider label sections
- Retrieve contraindications
- Retrieve warnings and precautions
- Retrieve adverse reactions
- Retrieve dosage and administration sections
- Retrieve package inserts

### MVP Use
Use DailyMed content to support pharmacist review summaries and patient counseling chatbot in demo mode.

## Integration 6: OCR Provider

### Options
- AWS Textract
- Azure Document Intelligence
- Google Document AI
- Tesseract

### MVP Recommendation
Start with the fastest provider to implement. You can begin with Tesseract for rough local testing, then move to AWS Textract or Azure Document Intelligence for cleaner extraction.

### OCR Output to Store
- Raw text
- Confidence if available
- Bounding boxes if available
- Provider name
- Processing time

## Internal Demo Data

### Synthetic Patients
Each synthetic patient should have:
- Name
- DOB
- Allergies
- Active medications
- Conditions placeholder
- Preferred language

### Synthetic Prescriptions
Create clean and messy examples:
- Clean typed prescription
- Handwritten-looking prescription
- Missing NPI
- Drug name ambiguity
- Allergy conflict
- Inventory out of stock
- Expired stock case

### Seed Inventory
Each item should include:
- NDC
- Medication name
- Generic name
- Strength
- Dosage form
- Quantity
- Lot number
- Expiry date
- Storage location
- Reorder threshold

## Integration Safety Rules
1. Cache external lookup results for demo reliability.
2. Log every external API call.
3. Never hide missing data.
4. Always distinguish between source data and AI interpretation.
5. Never treat external data as complete legal validation.

## Suggested Source Abstraction
Create a service layer:

```text
/services
  /npi
  /rxnorm
  /openfda
  /dailymed
  /ocr
```

Each service should expose clean functions.

Example:

```ts
lookupPrescriberByNpi(npi: string)
normalizeDrugName(query: string)
lookupNdc(query: string)
getDrugLabelByName(name: string)
extractTextFromPrescription(fileKey: string)
```
