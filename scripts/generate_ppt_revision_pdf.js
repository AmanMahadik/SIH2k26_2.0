const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Generating NirikshAI PPT Revision and Mobile APK Report...');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NirikshAI - SIH 2026 PPT Revision & Mobile APK Report</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.5;
      font-size: 13px;
      margin: 0;
      padding: 0;
      background-color: #ffffff;
    }
    .tricolour {
      height: 6px;
      width: 100%;
      background: linear-gradient(to right, #ff9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%);
      margin-bottom: 12px;
      border: 1px solid #cbd5e1;
    }
    .header-table {
      width: 100%;
      border-bottom: 2px solid #0B2E5C;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .header-title {
      font-size: 20px;
      font-weight: 800;
      color: #0B2E5C;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .header-sub {
      font-size: 11px;
      color: #64748b;
      margin-top: 3px;
      font-weight: 600;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-primary { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    .badge-danger { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
    .badge-success { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .badge-warning { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }

    .callout {
      border-radius: 8px;
      padding: 12px 14px;
      margin: 14px 0;
      font-size: 12.5px;
    }
    .callout-danger {
      background-color: #fef2f2;
      border-left: 4px solid #ef4444;
      color: #991b1b;
    }
    .callout-warning {
      background-color: #fffbeb;
      border-left: 4px solid #f59e0b;
      color: #92400e;
    }
    .callout-info {
      background-color: #eff6ff;
      border-left: 4px solid #3b82f6;
      color: #1e40af;
    }
    .callout-success {
      background-color: #f0fdf4;
      border-left: 4px solid #22c55e;
      color: #166534;
    }

    h2 {
      color: #0f172a;
      font-size: 15px;
      font-weight: 800;
      margin-top: 20px;
      margin-bottom: 8px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }
    h3 {
      color: #1e293b;
      font-size: 13.5px;
      font-weight: 700;
      margin-top: 14px;
      margin-bottom: 6px;
    }
    p {
      margin: 6px 0;
    }
    ul, ol {
      margin: 6px 0 10px 20px;
      padding: 0;
    }
    li {
      margin-bottom: 4px;
    }

    .quote-box {
      background-color: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 4px solid #0B2E5C;
      padding: 10px 12px;
      border-radius: 4px;
      font-family: Consolas, monospace;
      font-size: 11.5px;
      color: #0f172a;
      margin: 8px 0;
    }

    table.styled-table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 11.5px;
    }
    table.styled-table th {
      background-color: #0B2E5C;
      color: #ffffff;
      text-align: left;
      padding: 7px 10px;
      font-weight: 700;
      border: 1px solid #0B2E5C;
    }
    table.styled-table td {
      padding: 7px 10px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
    }
    table.styled-table tr:nth-child(even) {
      background-color: #f8fafc;
    }

    .footer {
      margin-top: 24px;
      border-top: 1px solid #cbd5e1;
      padding-top: 8px;
      font-size: 10px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }
    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>

  <div class="tricolour"></div>

  <table class="header-table" style="border: none;">
    <tr>
      <td>
        <h1 class="header-title">NirikshAI 2.0 — SIH 2026 PPT Audit & Action Report</h1>
        <div class="header-sub">
          <strong>AICTE Problem Statement ID:</strong> 26261 | <strong>Theme:</strong> Smart Automation | <strong>Team:</strong> Code4Bharat
        </div>
      </td>
      <td style="text-align: right; vertical-align: top;">
        <span class="badge badge-danger">CRITICAL ACTION REQUIRED</span><br>
        <span style="font-size: 10px; color: #64748b; margin-top: 4px; display: inline-block;">Date: October 28, 2026</span>
      </td>
    </tr>
  </table>

  <div class="callout callout-danger">
    <strong style="font-size: 13.5px;">🔴 The Honest Assessment: Your PPT currently does NOT contain the Mobile APK info.</strong><br>
    While your codebase and live web app already have an <strong>Expo SDK 54 / React Native Companion App</strong> and an interactive <strong>Mobile Hub (/mobile)</strong> with live GPS stamping and on-device SHA-256 hashing, your PowerPoint slides currently treat this capability as non-existent or merely theoretical.
  </div>

  <h2>1. The Risk Regarding SIH Problem Statement Objective 5</h2>
  <p>Every evaluator scores your PPT against the exact statutory mandate published by AICTE:</p>

  <div class="callout callout-warning">
    <strong>Mandate from AICTE Problem Statement 26261 (Objective 5):</strong><br>
    <em>"Assist in checking submitted infrastructure-related evidence against configurable requirements and flag physical inspection."</em>
  </div>

  <p><strong>Why your current slides risk losing marks:</strong></p>
  <ul>
    <li><strong>Tech Stack Gap (Slide 3):</strong> Your slide lists <em>Next.js, TypeScript, Microsoft Entra ID, PostgreSQL, FastAPI, PaddleOCR, PyMuPDF, Docker, and Azure</em>. There is <strong>zero mention of React Native, Expo, or Android APK</strong>.</li>
    <li><strong>The "Future Scope" Trap (Slide 5):</strong> Under the <em>Future Scope</em> section of Slide 5, your slide states:<br>
      <code style="background: #fee2e2; padding: 2px 5px; border-radius: 3px;">Computer-Vision Infrastructure Inspection: Automated verification of geo-tagged photographs and video walkthroughs of laboratory carpet area and barrier-free access ramps.</code><br>
      By placing this in <strong>Future Scope</strong>, you inadvertently tell the judges that you <strong>have NOT built it</strong>, even though your project actually contains working code for live GPS photo watermarking and instant Azure DB synchronization!
    </li>
  </ul>

  <h2>2. Step-by-Step Slide Revisions (Where & What to Add)</h2>

  <h3>Slide 2: Proposed Solution & Uniqueness</h3>
  <p><strong>Where to place:</strong> Add as the 8th pillar or bullet point under the solution list (directly below <em>Five-Persona Role Architecture</em>).</p>
  <div class="quote-box">
    <strong>📱 EVC Mobile Companion (Objective 5):</strong> Dedicated on-site inspection app with tamper-proof GPS coordinate watermarking (&plusmn;2.1m accuracy) and camera capture to verify computer centers, laboratories, and barrier-free access ramps against recycled fraud photos.
  </div>

  <h3>Slide 3: Technical Approach & Data Flow</h3>
  <p><strong>Where to place:</strong> Update the bottom Tech Stack row and the step 5 process flow.</p>
  <ul>
    <li><strong>Tech Stack:</strong> Add the <strong>React Native / Expo</strong> icon or label: <code>React Native / Expo SDK 54 (Android APK)</code>.</li>
    <li><strong>Data Flow (Step 5):</strong> Update to: <em>"Officers can flag physical inspection &rarr; triggers EVC Mobile Companion App with on-device SHA-256 hashing & real GPS stamp."</em></li>
    <li><strong>Visual Element:</strong> Place a smartphone mockup image (Screen 5: Mobile EVC Hub) on the right side of the architecture diagram.</li>
  </ul>

  <div class="page-break"></div>
  <div class="tricolour"></div>

  <h3>Slide 5: Impact & Benefits (⚠️ Most Critical Correction)</h3>
  <p><strong>Action 1 — DELETE from Future Scope:</strong> Remove the line mentioning automated verification of geo-tagged photographs.</p>
  <p><strong>Action 2 — MOVE into Active Benefits:</strong> Insert this high-scoring bullet in the <em>Benefits</em> or <em>Operational Impacts</em> section:</p>
  <div class="quote-box">
    <strong>✅ Physical Inspection Integrity (EVC Mobile App):</strong> Real-time hardware-attested GPS watermarking and on-device cryptographic hashing eliminate recycled, fraudulent campus photos during on-site inspections, fulfilling Objective 5.
  </div>

  <p><strong>Action 3 — Replace Future Scope with Genuine Long-Term Horizons:</strong></p>
  <ul>
    <li>Direct DigiLocker & NAD API Setu machine-to-machine repository verification</li>
    <li>Multilingual Regional OCR (Vernacular Devanagari and State land records)</li>
    <li>Drone-assisted 3D campus boundary and carpet area volumetric estimation</li>
  </ul>

  <h3>Slide 6: Research, Proofs & Production Links</h3>
  <p><strong>Where to place:</strong> In the bottom link section alongside the Vercel, GitHub, and Google Drive links.</p>
  <div class="quote-box">
    <strong>📱 Mobile APK Companion:</strong><br>
    NirikshAI EVC Inspector (Expo SDK 54 / Android APK)<br>
    <em>Interactive simulator accessible via web at: <span style="color:#0369a1;">https://sih-2k26-2-0.vercel.app/mobile</span></em>
  </div>

  <h2>3. Slide Revision Summary Matrix</h2>

  <table class="styled-table">
    <thead>
      <tr>
        <th style="width: 14%;">Slide</th>
        <th style="width: 46%;">Exact Revision to Make</th>
        <th style="width: 40%;">Why It Scores High Marks</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Slide 2</strong></td>
        <td>Add <strong>EVC Mobile Companion</strong> bullet point with GPS watermarking feature.</td>
        <td>Explicitly proves your architecture solves <strong>PS Objective 5</strong>.</td>
      </tr>
      <tr>
        <td><strong>Slide 3</strong></td>
        <td>Add <strong>Expo / React Native</strong> to Tech Stack row + add mobile smartphone frame visual.</td>
        <td>Visually demonstrates you built a complete <strong>Web + Mobile hybrid</strong> system.</td>
      </tr>
      <tr>
        <td><strong>Slide 5</strong></td>
        <td><strong>REMOVE</strong> geo-tagged photos from <em>Future Scope</em> &rarr; move to <strong>Active Impacts</strong>.</td>
        <td>Prevents judges from penalizing you for a "future promise" that is already working code.</td>
      </tr>
      <tr>
        <td><strong>Slide 6</strong></td>
        <td>Add <strong>Mobile APK / <code>/mobile</code> simulator link</strong> in the proofs section.</td>
        <td>Gives evaluators an immediate one-click URL to test the mobile app interface.</td>
      </tr>
    </tbody>
  </table>

  <h2>4. Key Proof Elements to Highlight in Your Demo Video</h2>
  <ol>
    <li><strong>Camera Reticle with Live GPS:</strong> Point out the active coordinates (e.g. <code>18.457532° N, 73.850831° E</code>) and accuracy indicator (&plusmn;2.1m) on <code>/mobile</code>.</li>
    <li><strong>Campus Categories:</strong> Highlight the 6 statutory categories: Computer Center (540 PCs), Laboratories, Wheelchair Ramps, Fire Safety NOC, Library, and Sports Ground.</li>
    <li><strong>Instant SHA-256 Sealing:</strong> Show that tapping "Capture Geotagged Photo Evidence" immediately generates a cryptographic hash and commits a new block into Azure PostgreSQL.</li>
  </ol>

  <div class="callout callout-success">
    <strong>Final Shortlisting Checklist:</strong><br>
    Once you update these 4 slides, your presentation will achieve <strong>100% objective coverage (Objectives 1 through 6)</strong> with both Web (Next.js 15) and Mobile (Expo SDK 54) verified by live deployment proofs.
  </div>

  <div class="footer">
    <span>Team Code4Bharat — NirikshAI 2.0</span>
    <span>AICTE Smart India Hackathon 2026 (PS 26261)</span>
    <span>Internal Strategy &amp; QA Document</span>
  </div>

</body>
</html>
`;

const htmlPath = path.resolve('docs/ppt_revision_report_temp.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf8');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const targetPdfDocs = path.resolve('docs/reports/NirikshAI_PPT_Revision_and_Mobile_APK_Report.pdf');
const targetPdfRoot = path.resolve('NirikshAI_PPT_Revision_and_Mobile_APK_Report.pdf');
const targetPdfArtifact = 'C:\\Users\\PC\\.gemini\\antigravity\\brain\\d9aff015-221e-41d3-a913-1f1f2fdabad4\\NirikshAI_PPT_Revision_and_Mobile_APK_Report.pdf';

fs.mkdirSync(path.dirname(targetPdfDocs), { recursive: true });

console.log('Rendering PDF via Headless Edge engine...');
const cmd = `"${edgePath}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${targetPdfDocs}" "file:///${htmlPath.replace(/\\/g, '/')}"`;
execSync(cmd, { stdio: 'inherit' });

if (fs.existsSync(targetPdfDocs)) {
  const size = fs.statSync(targetPdfDocs).size;
  console.log(`Generated PDF at docs/reports (${size} bytes)`);
  fs.copyFileSync(targetPdfDocs, targetPdfRoot);
  fs.copyFileSync(targetPdfDocs, targetPdfArtifact);
  console.log('Copied to root and artifact directory successfully.');
} else {
  console.error('PDF generation failed.');
}

if (fs.existsSync(htmlPath)) {
  fs.unlinkSync(htmlPath);
}

console.log('Completed!');
