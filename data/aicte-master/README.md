# AICTE Central Master Institution Data Registry

This directory contains reference schemas and master registry seeds for AICTE approved institutions across India.

## Data Schema
Each institution record provides the ground truth reference values:
- `permanent_id`: Unique AICTE Permanent ID (e.g., `1-10492817`).
- `legal_name`: Full registered name of the institution under university charter or state gazette.
- `address`: Campus physical address, state, and regional council.
- `approved_intake`: Sanctioned seat intake for the active approval cycle.
- `programmes`: Approved degree / diploma disciplines.
- `eoa_history_years`: Historical Extension of Approval records.
- `deficiency_status`: Status of previous deficiencies (`none`, `cleared`, `active`).

## Master Data Synchronization
In production, this data is ingested from the AICTE Central Portal or National Academic Depository (NAD) via secure mTLS endpoints with periodic differential sync.
