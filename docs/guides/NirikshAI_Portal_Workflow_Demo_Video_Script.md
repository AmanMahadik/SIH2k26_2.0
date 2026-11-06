# 🎙️ NirikshAI 2.0 — End-to-End Portal Workflow Demo Video Script
**Smart India Hackathon (SIH 2026) | Problem Statement ID: 26261 (AICTE, Ministry of Education)**  
**Team Code4Bharat | Target Video Duration: ~4:30 Minutes**  
**Live Production Link:** [https://sih-2k26-2-0.vercel.app](https://sih-2k26-2-0.vercel.app)

> **Statutory Core Philosophy:** *"Check early. Prove everything. Humans decide."*  
> **Ecosystem:** Zero-Trust 5-Portal Suite (Next.js + Azure PostgreSQL) + EVC Mobile Companion App (React Native/Expo)

---

## 🎬 Section 1: The Hook & AICTE Problem Statement (0:00 – 0:40)

| Timestamp | Visual / On-Screen Action | Spoken Voiceover Script |
| :---: | :--- | :--- |
| **0:00 – 0:15** | • Open web browser at [`https://sih-2k26-2-0.vercel.app/login`](https://sih-2k26-2-0.vercel.app/login).<br>• Camera slowly tracks across official Government of India header, tricolor accent bar, and AICTE emblem.<br>• Hover over the 5 role badges (*Institution, Scrutiny Officer, Senior Committee, Admin, Auditor*). | *"Namaste evaluators. We are **Team Code4Bharat**, presenting **NirikshAI 2.0** under Smart India Hackathon Problem Statement **26261** for the All India Council for Technical Education, Ministry of Education.<br><br>Every year, over 10,000 technical institutions across India apply for Extension of Approval. AICTE scrutiny officers are overwhelmed by millions of submitted pages—sworn affidavits, state NOCs, land titles, and faculty records."* |
| **0:15 – 0:40** | • Click on the **Institution** role card.<br>• Click **"Auto-Fill Demo Credentials"** &rarr; Click **"Sign In to Portal"**.<br>• Transition smoothly to `/institution` dashboard. | *"When humans are buried under that mountain of paperwork, innocent clerical errors delay legitimate colleges for months, while forged intake certificates slip through undetected.<br><br>To solve this national governance bottleneck, we engineered NirikshAI 2.0—an enterprise decision-support ecosystem built around a single statutory principle: **'Check early. Prove everything. Humans decide.'** Let's walk through the live workflow."* |

---

## 🏛️ Section 2: Applicant Experience — Institution Portal & Pre-Scrutiny (0:40 – 1:30)

| Timestamp | Visual / On-Screen Action | Spoken Voiceover Script |
| :---: | :--- | :--- |
| **0:40 – 1:00** | • Portal opens at [`/institution`](https://sih-2k26-2-0.vercel.app/institution).<br>• Circle cursor over **"MIT ACADEMY OF ENGINEERING"** and the **85% Profile Readiness Score** ring.<br>• Point cursor to the red card: **"2 Deficiencies to Fix"** (*Expired State NOC & Approved Intake Mismatch*). | *"We begin at the **Institution Portal**. In traditional systems, colleges submit blindly and wait weeks for rejection notices. In NirikshAI, institutions run a pre-submission self-scrutiny before officially filing.<br><br>Here, MIT Academy of Engineering sees an **85% readiness score**. NirikshAI proactively alerts them to two statutory discrepancies: an expired State Government NOC and an intake mismatch. This allows colleges to rectify mistakes early, completely preventing deficiency backlog cycles."* |
| **1:00 – 1:30** | • Click **"Launch Pre-Scrutiny Filing Wizard"** &rarr; Open Step 2 (Mandatory Document Upload).<br>• Click **"Load Sample AICTE Dossier"** (or upload test PDF).<br>• Zoom in on the client-side **SHA-256 hash badge** calculated instantly in the browser.<br>• Click **"Test OCR & Extraction"** to open the real-time extraction dossier showing bounding boxes pinned to the PDF canvas. | *"Every document uploaded is cryptographically digested using SHA-256 right in the browser, guaranteeing non-repudiation.<br><br>Watch our Document AI Extraction Engine in action: when we upload a certificate, our system performs OCR extraction, pins bounding boxes directly to the PDF canvas, and checks clauses against the AICTE Approval Process Handbook. Nothing is black-box; every claim is visually grounded."* |

---

## 🔍 Section 3: The Hero Feature — Scrutiny Officer Console (1:30 – 2:30)

| Timestamp | Visual / On-Screen Action | Spoken Voiceover Script |
| :---: | :--- | :--- |
| **1:30 – 1:55** | • Switch persona using top nav or URL to Scrutiny Console ([`/officer`](https://sih-2k26-2-0.vercel.app/officer)).<br>• Show scrutiny KPIs (*Pending: 4, Verified: 1, Needs Review: 3*).<br>• Click **"Review Case"** on Application `EA-2026-0453`.<br>• Split-screen Evidence Viewer opens (raw submitted PDF on left, cross-checked Master Registry fields on right). | *"Now let's switch to the **Scrutiny Officer Console**, connected directly to our live Microsoft Azure PostgreSQL database.<br><br>Look at this **Direct-Anchored Evidence Canvas**. On the left is the raw submitted PDF; on the right is our Deterministic Cross-Record Reconciliation Engine. Notice how NirikshAI highlights the exact bounding-box coordinates for the institute name, approval validity, and seat quota with a 96% confidence score."* |
| **1:55 – 2:30** | • Point cursor to the amber alert citing **`APH 2024–27 §4.5.1`**: *"Intake Discrepancy: Claimed 300 seats vs Council Master Registry 240 seats"*.<br>• Point to the status badge: **`MANUAL REVIEW REQUIRED`**.<br>• Hover over the 3 statutory decision buttons: `[Recommend EoA]`, `[Deficiency Notice]`, `[Physical Inspect]`.<br>• Click **`[Physical Inspect]`**! | *"Crucially, NirikshAI never makes automated, reckless decisions. When an institution claims 300 seats but council records show 240, our **Seven-State Verification Automaton** routes the case to **'MANUAL REVIEW REQUIRED'**.<br><br>The officer is equipped with clear visual proof and exact handbook clauses. If physical laboratory capacity needs ground verification, the scrutiny officer simply taps **'Physical Inspect'**—instantly triggering an on-site mandate!"* |

---

## 📱 Section 4: Physical Ground-Truth — EVC Mobile Companion App (2:30 – 3:15)

| Timestamp | Visual / On-Screen Action | Spoken Voiceover Script |
| :---: | :--- | :--- |
| **2:30 – 2:55** | • Open [`/mobile`](https://sih-2k26-2-0.vercel.app/mobile) simulator in browser or hold up Android device running Expo Go.<br>• Display the **Tactical Geodetic Radar**: MITAOE Pune Computer Center centroid, 35m perimeter circle, and live officer blip.<br>• Show status pill: **`GEOFENCE COMPLIANT: SHUTTER UNLOCKED`** (distance <35m). | *"This brings us to our mobile working prototype: the **NirikshAI EVC Mobile Companion App**, built with React Native and Expo for Expert Visiting Committee field officers.<br><br>What prevents a college from uploading fake laboratory pictures or stock photos from the internet? Our **Tactical Geodetic Radar**. Every facility has a registered GPS centroid. The camera shutter physically locks unless the inspection officer is standing within the mandatory 35-meter perimeter. You cannot upload from device gallery, and you cannot inspect from a hotel 5 km away."* |
| **2:55 – 3:15** | • Tap camera viewfinder &rarr; Shutter snaps photo of laboratory.<br>• Show HUD overlay burned into image: Lat/Long coordinates, NTP timestamp, compass heading, and hardware-computed SHA-256 digest.<br>• Show **Offline SQLite Sync Queue** holding evidence blocks safely when signal drops in basement labs. | *"The moment the shutter triggers, live satellite coordinates, heading, and a hardware-computed SHA-256 digest are burned permanently into the image bytes. Even in basement server rooms with zero cellular network, our **offline SQLite sync queue** guarantees every evidence block reaches Azure cloud the instant the officer steps outside."* |

---

## ⚖️ Section 5: Senior Committee Escalation & Governance Desk (3:15 – 3:45)

| Timestamp | Visual / On-Screen Action | Spoken Voiceover Script |
| :---: | :--- | :--- |
| **3:15 – 3:45** | • Switch persona to Senior Committee ([`/senior`](https://sih-2k26-2-0.vercel.app/senior)).<br>• Show Executive Escalation Queue and multi-officer consensus dashboard.<br>• Open Case `EA-2026-0453` &rarr; Review combined scrutiny evidence + EVC geotagged lab photos.<br>• Click **"Approve with Statutory Caveats"** &rarr; Enter remarks and sign digitally. | *"When cases require senior intervention, they appear on the **Senior Committee Portal**. Here, regional directors review the combined dossier: extracted document anomalies alongside geotagged field photos.<br><br>Committee members can concur, request clarification, or approve with statutory caveats. Every decision requires cryptographically signed remarks, eliminating bureaucratic ambiguity."* |

---

## 🛡️ Section 6: Trust, Legal Validity & Live Tamper Simulation (3:45 – 4:15)

| Timestamp | Visual / On-Screen Action | Spoken Voiceover Script |
| :---: | :--- | :--- |
| **3:45 – 4:00** | • Switch persona to Auditor Portal ([`/auditor`](https://sih-2k26-2-0.vercel.app/auditor)).<br>• Show cryptographic ledger table: Actor, Action, Block Timestamp, Current Hash, Previous Hash.<br>• Click green button **"Verify Chain"** &rarr; Toast notification appears: *"Cryptographic Chain Valid (All Blocks Intact)"*. | *"How do we guarantee total legal accountability? Inside our **Auditor Portal**, every single action—from document upload to officer remarks—is hashed using SHA-256 chained directly to the previous block: `Hash(Current Event + Previous Hash)`. This complies strictly with **Section 65B of the Indian Evidence Act** for electronic evidence admissibility."* |
| **4:00 – 4:15** | • Click red button **"Simulate Tamper"**!<br>• Show immediate audible warning and flashing **RED SECURITY ALERT** on screen!<br>• Point cursor to the exact broken block highlighted in crimson. | *"Watch this live security test: if an attacker or rogue administrator tampers with even a single byte or approval status directly inside the Azure PostgreSQL database—we click **'Simulate Tamper'**—**an immediate red security alert triggers!** The cryptographic chain breaks, pinpointing the exact compromised block in milliseconds."* |

---

## 🚀 Section 7: Policy Agility & National Impact Closing (4:15 – 4:35)

| Timestamp | Visual / On-Screen Action | Spoken Voiceover Script |
| :---: | :--- | :--- |
| **4:15 – 4:35** | • Quick switch to Admin Portal ([`/admin`](https://sih-2k26-2-0.vercel.app/admin)) showing **Rules as Versioned Data** (`APH_EOA_EXISTING.v1.json`).<br>• Cut to final screen showing team slide or production deployment link: [`https://sih-2k26-2-0.vercel.app`](https://sih-2k26-2-0.vercel.app).<br>• All team members give a confident professional smile/nod. | *"AICTE policies evolve yearly. In our Admin Portal, handbook regulations are stored as **'Rules as Versioned Data'**, allowing policy cells to update compliance thresholds in JSON without redeploying code.<br><br>By shrinking application scrutiny from three weeks down to under five minutes per institution, NirikshAI 2.0 eliminates backlogs, shuts down fraudulent institutions, and restores speed and trust to Indian technical education governance.<br><br>Visit our live production deployment at **sih-2k26-2-0.vercel.app**. Jai Hind, and thank you!"* |

---

## 🎬 Filming & Recording Checklist for Video Submission

1. **Audio Quality**: Use a lapel / lavalier microphone or clear USB condenser mic. Avoid room echo.
2. **Screen Resolution**: Set display scaling to 100% and screen resolution to 1920 × 1080 (1080p).
3. **Browser Setup**: Use Google Chrome or Microsoft Edge in full-screen (`F11`) with bookmarks bar hidden.
4. **Pacing**: Speak at a steady, conversational pace (~130 words per minute). Allow 1-2 seconds for judges to visually absorb key on-screen actions before switching portals.
5. **Direct Video Link**: Upload your finished video to Google Drive / YouTube as Unlisted, ensuring link sharing is set to *"Anyone with the link can view"*.
