const fs = require('fs');

let content = fs.readFileSync('app/officer/[id]/page.tsx', 'utf8');

if (!content.includes("import GovLayout")) {
  content = content.replace(
    "import React, { useState, useEffect } from 'react';",
    "import React, { useState, useEffect } from 'react';\nimport GovLayout from '@/components/gov/GovLayout';"
  );
}

const targetOpen = '<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">';
if (content.includes(targetOpen)) {
  content = content.replace(
    targetOpen,
    '<GovLayout role="officer" activeTab="applications">\n      <div className="space-y-6">'
  );
}

const targetEnd = '    </div>\n  );\n}';
if (content.includes(targetEnd)) {
  content = content.replace(
    targetEnd,
    '      </div>\n    </GovLayout>\n  );\n}'
  );
}

fs.writeFileSync('app/officer/[id]/page.tsx', content, 'utf8');
console.log('Successfully updated app/officer/[id]/page.tsx');
