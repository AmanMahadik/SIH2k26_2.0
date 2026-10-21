const fs = require('fs');

function wrapPage(file, role, activeTab) {
  let c = fs.readFileSync(file, 'utf8');
  if (c.includes('import GovLayout')) {
    console.log(file, 'already imported GovLayout');
    return;
  }
  c = c.replace(/import React[^;]*;/, (m) => `${m}\nimport GovLayout from '@/components/gov/GovLayout';`);
  c = c.replace(/return \(\s*<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">/, 
    `return (\n    <GovLayout role="${role}" activeTab="${activeTab}">\n      <div className="space-y-6">`
  );
  c = c.replace(/<\/div>\s*\);\s*}\s*$/, '      </div>\n    </GovLayout>\n  );\n}\n');
  fs.writeFileSync(file, c, 'utf8');
  console.log('Wrapped', file);
}

wrapPage('app/rules/page.tsx', 'admin', 'config');
wrapPage('app/audit/page.tsx', 'auditor', 'audit');
wrapPage('app/metrics/page.tsx', 'senior', 'reports');
