# 🎙️ NirikshAI 2.0 — Complete Demo Video Script (With Mobile App)
**Smart India Hackathon 2026 | Problem Statement 26261 (AICTE)**  
**Team Code4Bharat** | **Target Video Duration: Exactly 4:00 Minutes**

---

## 🎬 Section 1: Introduction & Problem Context (0:00 – 0:35)

| Timestamp | [ON-SCREEN ACTION] | [SPOKEN VOICEOVER SCRIPT] |
|:---:|:---|:---|
| **0:00 – 0:10** | Open browser at [`https://sih-2k26-2-0.vercel.app/login`](https://sih-2k26-2-0.vercel.app/login). Slow zoom on official Government of India header, tricolour bar, and AICTE emblem. | *"Namaste evaluators. We are **Team Code4Bharat**, presenting **NirikshAI 2.0** for Smart India Hackathon Problem Statement **26261** under the All India Council for Technical Education, Ministry of Education."* |
| **0:10 – 0:25** | Point cursor to the 5 role badges on top (*Institution, Scrutiny, Senior, Admin, Auditor*). | *"Every year, over 4,700 technical colleges apply for Extension of Approval. AICTE scrutiny officers spend **45 to 60 minutes** per file manually cross-checking state NOCs, land deeds, and physical infrastructure. It is slow, prone to fatigue, and lacks a tamper-evident audit trail."* |
| **0:25 – 0:35** | Click on the **Institution** role card &rarr; click **"Auto-Fill Demo Credentials"** &rarr; click **"Sign In to Portal"**. | *"NirikshAI solves this with an integrated web and mobile ecosystem built on one principle: **'Check early. Prove everything. Humans decide.'**"* |

---

## 🏛️ Section 2: Applicant Experience — Institution Portal (0:35 – 1:10)

| Timestamp | [ON-SCREEN ACTION] | [SPOKEN VOICEOVER SCRIPT] |
|:---:|:---|:---|
| **0:35 – 0:50** | Portal opens at [`/institution`](https://sih-2k26-2-0.vercel.app/institution). Circle cursor over *"MIT ACADEMY OF ENGINEERING"* and the **85% Profile Complete** ring. | *"We begin at the **Institution Portal**. Before submitting blind, colleges run a pre-submission self-scrutiny. Here, MIT Academy of Engineering sees an **85% readiness score** before officially filing."* |
| **0:50 – 1:05** | Hover over the red card showing **"2 Deficiencies to Fix"** (*Expired State NOC & Land Built-Up Area Clarification*). | *"NirikshAI instantly flags that their State Government NOC has expired for the 2026–27 cycle, and their land built-up area needs clarification. Colleges can resolve these **before** submission, eliminating repeated deficiency rounds."* |
| **1:05 – 1:10** | Scroll down to document upload; hover over client-side SHA-256 hash badge. | *"Every uploaded file is cryptographically hashed with SHA-256 right in the browser, guaranteeing non-repudiation."* |

---

## 🔍 Section 3: The Hero Feature — Scrutiny Officer Console (1:10 – 2:10)

| Timestamp | [ON-SCREEN ACTION] | [SPOKEN VOICEOVER SCRIPT] |
|:---:|:---|:---|
| **1:10 – 1:25** | Click top **"SWITCH PERSONA"** &rarr; select **"Scrutiny"** ([`/officer`](https://sih-2k26-2-0.vercel.app/officer)). Show top KPIs (*Pending: 4, Verified: 1, Needs Review: 3*). | *"Next, the **Scrutiny Officer Console**, connected live to our **Azure Central India PostgreSQL database** indexing 4,788 institutions across India with zero manual data entry."* |
| **1:25 – 1:45** | Click **"Review Case"** on Application `EA-2026-0453`. Split-screen Evidence Viewer opens. | *"Look at this **Direct-Anchored Evidence Canvas**. On the left is the raw document; on the right are extracted fields. Notice the **pinpoint bounding boxes** highlighting the exact text for `INSTITUTION_NAME` and `VALID TO` with a 96% OCR confidence score."* |
| **1:45 – 2:00** | Point out the amber box citing **`APH 2024-27 §4.9`** and the badge **`MANUAL REVIEW REQUIRED`**. | *"Our deterministic statutory engine cross-checks every field against versioned rules. When a state issuer API times out, our **Seven-State Verification Machine** automatically routes it to **'MANUAL REVIEW REQUIRED'** — never a silent pass."* |
| **2:00 – 2:10** | Point cursor at the 3 decision buttons (**Recommend EoA**, **Deficiency Notice**, **Physical Inspect**). Click **"Physical Inspect"**! | *"AI is strictly decision-support; humans always decide. If physical infrastructure requires on-site verification, the officer clicks **'Physical Inspect'**."* |

---

## 📱 Section 4: Mobile App — EVC Field Inspection & Geotagging (2:10 – 2:50)

| Timestamp | [ON-SCREEN ACTION] | [SPOKEN VOICEOVER SCRIPT] |
|:---:|:---|:---|
| **2:10 – 2:20** | Click **"Mobile App"** in the top navigation bar (or open [`/mobile`](https://sih-2k26-2-0.vercel.app/mobile)). Smartphone device frame appears with dynamic status bar. | *"This routes directly to our **NirikshAI EVC Mobile Companion App**, built specifically for Expert Visit Committee officers conducting on-site physical inspections under PS Objective 5."* |
| **2:20 – 2:35** | Click on **"1. Field Inspection & Geotagging"** tab. Live camera simulation opens showing real GPS coordinates (*`18.4575° N, 73.8508° E`*), UTC timestamp, and campus category. | *"To stop recycled, fraudulent photos, the mobile app uses the device's camera with real-time **GPS coordinate watermarking** and timestamping. Notice the live GPS lock for the Computer Center."* |
| **2:35 – 2:50** | Click **"Capture Geotagged Photo Evidence"** button &rarr; Watch the new sealed evidence block appear below with instant SHA-256 hash. | *"When the officer taps capture, NirikshAI hashes the photo on-device and commits a cryptographic inspection seal directly into our Azure PostgreSQL audit ledger in real time."* |

---

## 🛡️ Section 5: Security, Trust & Live Tamper Demo (2:50 – 3:35)

| Timestamp | [ON-SCREEN ACTION] | [SPOKEN VOICEOVER SCRIPT] |
|:---:|:---|:---|
| **2:50 – 3:05** | Switch Persona to **"Auditor"** ([`/auditor`](https://sih-2k26-2-0.vercel.app/auditor)). Show the cryptographic table (*Actor, Action, Current Hash, Prev Hash*). | *"All web and mobile actions feed into our **Auditor Portal**. Every inspection, document view, and officer decision is recorded in an immutable, **SHA-256 hash-chained audit ledger** compliant with Section 65B of the Indian Evidence Act."* |
| **3:05 – 3:15** | Click the green button **"Verify Chain"**. Green checkmark toast appears: *"Chain Integrity Intact"*. | *"Clicking **'Verify Chain'** mathematically validates the entire chain from the genesis block."* |
| **3:15 – 3:25** | Click the red button **"Simulate DB Tampering"**. Watch a red security alert instantly trigger! | *"Now, if an attacker attempts to modify a record directly inside the database — **watch this: an immediate tamper alert triggers!** The cryptographic chain breaks, pinpointing the exact compromised block."* |
| **3:25 – 3:35** | Switch Persona to **"Admin"** ([`/admin`](https://sih-2k26-2-0.vercel.app/admin)) &rarr; show **Rule Engine Config** (`EOA_EXISTING.v1.json`). | *"Handbook regulations are defined as **Rules as Versioned Data**, allowing AICTE policy cells to update compliance clauses in JSON without redeploying code."* |

---

## ☁️ Section 6: Cloud Deployment & Closing (3:35 – 4:00)

| Timestamp | [ON-SCREEN ACTION] | [SPOKEN VOICEOVER SCRIPT] |
|:---:|:---|:---|
| **3:35 – 3:50** | Click **"System Analytics"** tab on Admin. Highlight green text: `Host: aicte-nirikshai-db.postgres.database.azure.com`, `Central India`, `SSL TLS 1.3 ENFORCED`, `22 Blocks Sealed`. | *"NirikshAI is live in production on Vercel Edge, backed by an **Azure PostgreSQL Flexible Server in Central India** with strict TLS 1.3 transport encryption, meeting all DPDP Act 2023 data sovereignty mandates."* |
| **3:50 – 4:00** | Switch to the final slide showing the live URL [`sih-2k26-2-0.vercel.app`](https://sih-2k26-2-0.vercel.app) and GitHub link. | *"By slashing scrutiny time from **60 minutes to under 15 seconds** across web and mobile, NirikshAI delivers a faster, transparent, and fraud-proof future for Indian technical education.*  
*Thank you! Jai Hind."* |
