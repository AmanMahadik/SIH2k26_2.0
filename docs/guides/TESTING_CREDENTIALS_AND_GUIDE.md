# 🏛️ NirikshAI – Comprehensive Testing & Credentials Guide
**AICTE Automated Application Validation, Document Scrutiny & Regulatory Verification**  
**Smart India Hackathon 2026 | Problem Statement ID: 26261**

---

## 🌐 1. Live Deployment & Access URLs

* **Production Web App (Vercel)**: [https://sih-2k26-2-0.vercel.app](https://sih-2k26-2-0.vercel.app)
* **Login Portal**: [https://sih-2k26-2-0.vercel.app/login](https://sih-2k26-2-0.vercel.app/login)
* **Cloud Database**: Azure Database for PostgreSQL (Central India Flexible Server, TLS 1.3 enforced)
* **GitHub Repository**: [https://github.com/AmanMahadik/SIH2k26_2.0](https://github.com/AmanMahadik/SIH2k26_2.0)

---

## 🔑 2. Testing Credentials Matrix (All 5 Roles)

Every role is pre-configured with distinct clearance levels, permissions, and specialized dashboards.

| Role | User Persona | Login Email / User ID | Password | Destination Dashboard | Clearance Level |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Institution** | Pune Institute of Computer Technology (PICT) | `inst@demo.ai` | `demo123` | [`/institution`](https://sih-2k26-2-0.vercel.app/institution) | Level 1 (Applicant) |
| **Scrutiny Officer** | Dr. Priya Sharma | `officer@demo.ai` | `demo123` | [`/officer`](https://sih-2k26-2-0.vercel.app/officer) | Level 2 (Field Scrutiny) |
| **Senior Officer** | Prof. R. Kumar | `senior@demo.ai` | `demo123` | [`/senior`](https://sih-2k26-2-0.vercel.app/senior) | Level 3 (Committee Review) |
| **Administrator** | AICTE HQ Admin User | `admin@demo.ai` | `demo123` | [`/admin`](https://sih-2k26-2-0.vercel.app/admin) | Level 4 (Super Admin) |
| **Vigilance / Auditor** | Central Audit Cell User | `auditor@demo.ai` | `demo123` | [`/auditor`](https://sih-2k26-2-0.vercel.app/auditor) | Level 3 (Read-Only Audit) |

> 💡 **Quick Login Tip**: On the [`/login`](https://sih-2k26-2-0.vercel.app/login) screen, you can click on any role icon card at the top to auto-populate the email, then enter the 4-letter CAPTCHA shown on screen and click **"Sign In to Portal"**. You can also click **"Auto-Fill Demo Credentials"** to populate everything in one click!

---

## 📋 3. Step-by-Step Test Scenarios for QA Team

---

### Scenario A: Role 1 – Technical Institution (`/institution`)
* **Goal**: Test applicant document submission, progress tracking, and deficiency rectification.
* **Test Checklist**:
  - [ ] **Welcome Banner**: Confirm it displays the live Azure DB college legal title: *`Welcome, Pune Institute of Computer Technology!`*.
  - [ ] **Manage Profile Modal**: Click **"Manage Profile"** &rarr; verify established year, affiliating university, and land area appear in modal &rarr; edit a field and click **"Save Changes"**.
  - [ ] **Deficiencies Modal**: Click **"View Details &rarr;"** on the red *Deficiencies to Fix* card &rarr; verify the clause citation and upload corrective document option.
  - [ ] **Continue Application**: Click **"Continue Application"** &rarr; verifies navigation to the pre-scrutiny report view.
  - [ ] **Document Upload with SHA-256**: Navigate to the upload section &rarr; choose any test PDF &rarr; confirm client-side SHA-256 hash calculation badge appears (e.g. `SHA-256: 9a6b12a843...`).
  - [ ] **Live Azure Alerts**: Verify recent alerts are rendered directly from the Azure PostgreSQL `alerts` table.

---

### Scenario B: Role 2 – Scrutiny Officer (`/officer`)
* **Goal**: Test AI perception, cross-document verification, OCR extraction, and human-in-the-loop review.
* **Test Checklist**:
  - [ ] **Live Azure DB Counts**: Check top KPI cards (**Pending: 4**, **Verified: 1**, **Needs Review: 3**, **Rejected: 0**). Verify the green badge: `Azure Database for PostgreSQL (Central India): aicte-nirikshai-db.postgres.database.azure.com`.
  - [ ] **Sync with Azure**: Click the **"Sync with Azure"** button &rarr; spinner animates and syncs with live database.
  - [ ] **Search & Filter**: Click the **"Applications"** tab &rarr; search for `"Apex"` or `"Delhi"` &rarr; filter by status dropdown (*Needs Clarification*, *Under Review*, *Verified*).
  - [ ] **Side-by-Side Dossier Review**: Click **"Review"** on `EA-2026-0451` (or visit [`/officer/app-2`](https://sih-2k26-2-0.vercel.app/officer/app-2)):
    - [ ] Split-screen view: Left is original document with normalized bounding boxes `(x, y, w, h)`; right is extracted OCR data table with confidence percentages (98%, 95%).
    - [ ] Scroll to **Deficiencies Detected**: Verify exact statutory clause citations:
      - `APH 2024-27 §4.3.1` (Expired State NOC)
      - `APH 2024-27 §4.4.2` (Title Mismatch)
  - [ ] **Official Letterhead Report with QR**: Click **"View Reports"** or visit [`/officer/app-1/report`](https://sih-2k26-2-0.vercel.app/officer/app-1/report):
    - [ ] Verify AICTE official emblem, letterhead format, and dynamic QR verification code.

---

### Scenario C: Role 3 – Senior Scrutiny Committee (`/senior`)
* **Goal**: Test high-risk escalation triage and macro-level decision distribution.
* **Test Checklist**:
  - [ ] **Escalation Queue**: Verify high-risk applications (`Apex Technical Campus`, `Delhi College of Engineering & Technology`) appear with priority tags.
  - [ ] **Analytics Donut Chart**: Verify interactive Recharts distribution donut (**Approved: 25%**, **Flagged Issues: 75%**) rendered from actual Azure database rows.
  - [ ] **Tab Navigation**: Switch between **Home**, **Review Applications Queue**, and **Regional Analytics** tabs.

---

### Scenario D: Role 4 – Administrator Portal (`/admin`)
* **Goal**: Test dynamic onboarding of colleges and scrutiny officers into Azure PostgreSQL + declarative handbook rules.
* **Test Checklist**:
  - [ ] **Live System Overview**: Verify row counts matching Azure DB (Institutions: 4, Applications: 4, Scrutiny Officers: 3, Documents: 7).
  - [ ] **"+ Add New Technical Institution" Modal**:
    1. Click the top button **`+ Add Institution`**.
    2. Enter:
       - Name: `Veermata Jijabai Technological Institute (VJTI)`
       - AICTE ID: `1-5098129031`
       - State: `Maharashtra`
       - University: `University of Mumbai`
       - Intake Quota: `540`
    3. Click **"Save Institution"**.
    4. Confirm success notification appears and the new college is inserted into Azure PostgreSQL and immediately listed in the directory!
  - [ ] **"+ Add New Scrutiny Officer" Modal**:
    1. Click the top button **`+ Add Scrutiny Officer`**.
    2. Enter:
       - Name: `Dr. Vikram Sarabhai`
       - Email: `vikram.s@aicte-india.org`
       - Regional Office: `Western Regional Office (Mumbai)`
       - Clearance: `L2 - Senior Scrutiny`
    3. Click **"Onboard Officer"**.
    4. Confirm the officer is inserted into Azure DB table `scrutiny_officers` and visible in directory.
  - [ ] **Declarative Rule Engine**: Click **"Configure Handbook Rules"** tab &rarr; view rules mapped to APH 2024-27 &rarr; click **"Publish New Version (v2)"** &rarr; confirm new declarative rule set snapshot is created without code deployment.

---

### Scenario E: Role 5 – Vigilance & Central Auditor (`/auditor`)
* **Goal**: Test cryptographic SHA-256 hash-chain validation and live tamper simulation.
* **Test Checklist**:
  - [ ] **Total Audits Count**: Confirm count is dynamic (`{logs.length}` matching Azure DB `audit_log`).
  - [ ] **Verify Ledger Integrity**: Click **"Verify Chain Integrity"** &rarr; verify green banner:
    > *`Chain Integrity Intact: All SHA-256 cryptographic hashes match root state.`*
  - [ ] **Simulate Tamper (Key SIH Demo Feature)**:
    1. Click **"Simulate Tamper"**.
    2. System intentionally modifies an event payload in memory.
    3. Verify red security alert:
       > *`Tamper Alert Detected: Cryptographic hash mismatch at Event #2. Chain validation failed.`*
    4. Click **"Reset Ledger"** &rarr; restores clean cryptographic chain.

---

### Scenario F: Universal Feature – User Profile Customization
* **Goal**: Test user identity and photo upload in the top-right navigation bar on ANY page.
* **Test Checklist**:
  - [ ] In the top header, hover over the profile icon (`Prof. R. Kumar` or user icon) &rarr; notice the camera badge.
  - [ ] Click on the user profile name/avatar &rarr; the **"Edit Profile & Contact Credentials"** modal opens.
  - [ ] Click **"Upload Photo"** &rarr; choose any `.png` or `.jpg` photo &rarr; preview updates immediately.
  - [ ] Edit **Mobile Number** (e.g. `+91 98765 43210`) and **Official Email**.
  - [ ] Click **"Save Profile"** &rarr; green success toast appears and your uploaded photo appears in the top-right header across all pages!

---

## 🗄️ 4. Direct Azure PostgreSQL Backend Credentials (For Technical QA)

If your QA engineers want to verify data directly using **pgAdmin 4**, **DBeaver**, or **VS Code Database Client**:

| Parameter | Connection Value |
| :--- | :--- |
| **Host / Server** | `aicte-nirikshai-db.postgres.database.azure.com` |
| **Port** | `5432` |
| **Database** | `nirikshai` |
| **Username** | `nirikshai_admin` |
| **Password** | `Aicte@2006` |
| **SSL Mode** | `Require` (Reject unauthorized: `false`) |
| **Region** | Microsoft Azure Central India |

### Quick QA Sanity Check SQL:
```sql
-- Run in pgAdmin to verify all 12 tables and row counts:
SELECT 
  table_name AS "Table",
  (xpath('/row/cnt/text()', xml_count))[1]::text::int AS "Row Count"
FROM (
  SELECT table_name, query_to_xml(format('SELECT count(*) AS cnt FROM %I', table_name), false, true, '') AS xml_count
  FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
) sub
ORDER BY table_name;
```

---

## 🐞 5. Defect / Bug Reporting Template

If your testing team encounters any issue, please report using this format:

```markdown
**Role Tested**: [e.g. Officer / Admin / Institution]
**URL / Page**: [e.g. /officer/app-2]
**Browser & OS**: [e.g. Chrome 129 on Windows 11 / Android]
**Steps to Reproduce**:
1. Logged in as officer@demo.ai
2. Clicked on Review Case
3. Observed...
**Expected Result**:
**Actual Result**:
**Screenshot / Console Error**:
```
