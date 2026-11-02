# NirikshAI 2.0 — EVC Field Inspection Operational Manual

**Statutory Framework:** AICTE Approval Process Handbook (APH 2024-27 §4.2.3)  
**Legal Attestation:** Indian Evidence Act Section 65B (Electronic Evidence Certificate)  
**Target User:** AICTE Expert Visiting Committee (EVC) Field Officers & Auditors  
**Primary Pilot Campus:** MIT Academy of Engineering (MITAOE), Alandi, Pune  

---

## 1. Campus Statutory Centroids (MITAOE Campus)

| Target Laboratory / Facility | Lab Code | Centroid Coordinates | Statutory Radius | Statutory Mandate |
|---|---|---|---|---|
| **Computer Center (540 PCs)** | `LAB-CC-03` | `18.675620° N, 73.896710° E` | **35 meters** | APH §4.4.1 (1:4 Student-PC Ratio) |
| **Robotics & AI Center of Excellence** | `LAB-AI-01` | `18.675810° N, 73.896920° E` | **30 meters** | APH §4.4.3 (Emerging Tech Labs) |
| **Barrier-Free Wheelchair Ramp** | `RAMP-PORTAL-01` | `18.675380° N, 73.896620° E` | **20 meters** | APH §4.2.2 (RPwD Act 2016) |
| **VLSI Design Cleanroom** | `LAB-VLSI-02` | `18.676010° N, 73.896350° E` | **25 meters** | APH §4.4.2 (Specialized Labs) |

---

## 2. On-Site Inspection Workflow (Step-by-Step)

### Step 1: Login & Identity Attestation
1. Launch the NirikshAI EVC app on your Android device.
2. Sign in with your official AICTE credentials (`priya.sharma@aicte-india.org` for EVC Lead).
3. The app confirms your assigned campus: **MIT Academy of Engineering (MITAOE)**.

### Step 2: Location Authorization & GPS Warm-Up
1. Upon entering the **EVC Geo** tab, the app automatically requests high-precision GPS permissions (`ACCESS_FINE_LOCATION`).
2. Allow permissions. Ensure your device's Location services (GPS) are turned ON with High Accuracy / Google Location Accuracy enabled.
3. Observe the top HUD Geofence pill. The app locks onto the RTK/satellite fix (accuracy must be $\le 30\text{ m}$).

### Step 3: Physical Laboratory Verification
1. Walk to the designated facility (e.g. Computer Center Wing A).
2. As you approach within the statutory perimeter (35 meters of `18.675620° N, 73.896710° E`):
   - The HUD pill turns **🟢 INSIDE PERIMETER · <distance> m**.
   - Haptic vibration confirms transition into the geofence.
   - The shutter button unlocks.
3. If you step outside the perimeter:
   - The HUD pill turns **🔴 OUTSIDE · +<delta> m BREACH**.
   - Shutter button is locked under APH §4.2.3 to eliminate recycled photo fraud.

### Step 4: Full-Screen Capture & Watermark Burn-in
1. Tap **Full-Screen Capture (HUD Overlay)** for immersive viewfinder mode.
2. The live camera frame displays:
   - Real-time satellite radar thumbnail.
   - Exact college name (**MIT Academy of Engineering**).
   - Live GPS coordinates ($\pm \text{accuracy}$).
   - Date, timestamp, altitude, heading, and sensor telemetry (wind, humidity, magnetic flux).
3. Tap the Shutter button to take the photo:
   - The watermark is burned permanently into the image bytes via `react-native-view-shot`.
   - On-device SHA-256 digest is computed across the raw image bytes.
   - Digital cryptographic seal is attached.

### Step 5: Offline-First Queue & Cloud Synchronization
1. If cellular coverage is weak inside the laboratory, captures are saved to the on-device SQLite database (`inspection_captures`).
2. As soon as network connectivity is restored, the background sync engine uploads the watermarked photo to Azure Blob Storage and registers the metadata with the Azure PostgreSQL ledger.
3. Check sync status in the **Officer** profile tab anytime.

---

## 3. Troubleshooting & FAQ

- **Q: App displays "Weak GPS signal (>30m limit)"?**  
  *A:* You may be deep inside a thick concrete building or basement. Step near a window or doorway momentarily to let the GPS receiver establish a 3D satellite lock ($\le 30\text{ m}$), then re-enter the lab.

- **Q: App displays "Mock GPS Detected"?**  
  *A:* Android developer options "Select mock location app" is active. Disable mock location in Android Settings -> Developer Options -> Mock Locations -> None.

- **Q: Auditor Centroid Calibration?**  
  *A:* Authorized senior auditors can recalibrate a lab's stored centroid by tapping "Match Lab Centroid to Here" in case of architectural renovations. Every calibration writes an immutable record to the audit log.
