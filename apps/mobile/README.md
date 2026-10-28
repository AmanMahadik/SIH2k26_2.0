# 📱 NirikshAI Mobile - AICTE EVC & Scrutiny Companion (SIH 2026)

**AI-Powered Application Validation, Document Authentication & Regulatory Compliance Verification**  
**Problem Statement ID: 26261 | Team Code4Bharat**

---

## 🎯 3 High-Impact Features Built (As Evaluated by Government Judges)

| # | High-Impact Use Case | User Persona | Mobile Capability |
| :--- | :--- | :--- | :--- |
| **1** | **Field Inspection & Geotagging** *(Highest Marks)* | AICTE Expert Visiting Committee (EVC) | Phone camera and GPS captures **geotagged & timestamped photos** of labs, computer centers, and wheelchair ramps. App computes **SHA-256 hash on-device** so colleges cannot submit fake or recycled photos. |
| **2** | **Document Fast-Scan & Hash** | College Registrars / Principals | Mobile camera acts as a scanner with auto-cropping & edge-detection. The app calculates the **SHA-256 hash on device** before uploading to private cloud storage. |
| **3** | **Instant Deficiency Push Alerts** | Institutions & Officers | Push notifications when an application has an expired State NOC or clause mismatch, allowing **instant mobile resubmission** with camera rectification. |

---

## 🚀 How to Run & Build the Mobile APK

### Option 1: Live Web Mobile Simulator (Zero Setup)
You can test the entire mobile app interactively directly in your browser:
* Local: `http://localhost:3000/mobile`
* Production: `https://sih-2k26-2-0.vercel.app/mobile`

---

### Option 2: Test on Real Mobile Phone via Expo Go
1. Open terminal in the `mobile-app` folder:
   ```bash
   cd mobile-app
   npm install
   npx expo start
   ```
2. Download the free **Expo Go** app from Google Play Store on your Android phone.
3. Scan the terminal QR code with your phone camera or the Expo Go app. The app opens instantly on your physical phone!

---

### Option 3: Generate Standalone Android `.apk` File (EAS Build)
To produce an installable `.apk` file for Android devices:

1. Install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your free Expo account:
   ```bash
   eas login
   ```
3. Run the automated preview APK build command:
   ```bash
   eas build -p android --profile preview
   ```
4. EAS cloud builds the APK and returns a direct download link (e.g. `https://expo.dev/artifacts/eas/...apk`).
5. Download the `.apk` directly to your Android phone and install it!

---

## 📂 Project Structure

```
mobile-app/
├── app.json                      # Expo app configuration (Permissions for Camera & GPS)
├── eas.json                      # Android standalone APK build configuration
├── package.json                  # Dependencies (Expo Camera, Location, Crypto)
├── src/
│   ├── components/
│   │   ├── Header.tsx            # Jan-Sahayak / NirikshAI top bar with language switch
│   │   └── BottomNav.tsx         # Floating pill nav bar with center orange Fast-Scan FAB
│   ├── constants/
│   │   ├── theme.ts              # Exact color palette (#0B2E5C navy, #FF8C00 orange)
│   │   └── mockData.ts           # EVC officer credentials & AICTE database fixtures
│   └── screens/
│       ├── HomeScreen.tsx        # Overview & 3 feature launchpads
│       ├── FieldInspectionScreen.tsx   # Feature 1: Geotagged Camera + GPS + SHA-256
│       ├── DocumentScannerScreen.tsx   # Feature 2: Document Fast-Scan & Pre-Upload Hash
│       ├── DeficiencyAlertsScreen.tsx  # Feature 3: Instant Push Alerts & 1-Click Fix
│       └── OfficerProfileScreen.tsx    # Officer credentials & Azure Evidence Vault
└── App.tsx                       # Master mobile application entry point
```
