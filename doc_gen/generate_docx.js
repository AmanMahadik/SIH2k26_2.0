// doc_gen/generate_docx.js
// Master script: assembles all sections and writes nirikshai_report.docx
'use strict';

const path = require('path');
const fs   = require('fs');
const { D, numConfigs, FONT, BLUE } = require('./lib');
const {
  Document, Packer, Paragraph, TextRun, PageBreak,
  Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, BorderStyle,
  TableOfContents, StyleLevel,
} = D;

const OUT_PATH = path.join(__dirname, '..', 'nirikshai_report.docx');

// ── Content sections ──────────────────────────────────────────────────────────
const sec0_3  = require('./sec_0_3');
const sec4_8  = require('./sec_4_8');
const sec9_12 = require('./sec_9_12');
const sec13_19 = require('./sec_13_19');

// ── Cover page ────────────────────────────────────────────────────────────────
const coverPage = [
  new Paragraph({ spacing: { before: 1200, after: 240 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'NirikshAI', font: FONT, size: 72, bold: true, color: BLUE })] }),
  new Paragraph({ spacing: { after: 160 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'AI-Powered Application Validation, Document Authentication', font: FONT, size: 28, color: '444444' })] }),
  new Paragraph({ spacing: { after: 160 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'and Regulatory Compliance Verification', font: FONT, size: 28, color: '444444' })] }),
  new Paragraph({ spacing: { after: 400 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: '"Check early. Prove everything. Humans decide."', font: FONT, size: 24, italics: true, color: '595959' })] }),
  new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE, space: 8 } }, spacing: { after: 400 }, children: [] }),
  new Paragraph({ spacing: { after: 120 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'SIH 2026 — Problem Statement 26261', font: FONT, size: 24, bold: true, color: BLUE })] }),
  new Paragraph({ spacing: { after: 60 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Organization: AICTE, Regulation Bureau, Ministry of Education, Government of India', font: FONT, size: 20 })] }),
  new Paragraph({ spacing: { after: 60 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Category: Software  |  Theme: Smart Automation', font: FONT, size: 20 })] }),
  new Paragraph({ spacing: { after: 600 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Prepared: 20 October 2026  |  Deadline: 28 October 2026', font: FONT, size: 20 })] }),
  new Paragraph({ children: [new TextRun({ break: 1 }), new PageBreak()] }),
];

// ── Disclaimer ────────────────────────────────────────────────────────────────
const disclaimer = [
  new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: false, children: [new TextRun({ text: 'Disclaimer', font: FONT })] }),
  new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'This document is a planning and design report prepared for the Smart India Hackathon 2026 (SIH 2026). It describes proposed system architecture, features and evaluation plans. All code, metrics and prototypes described are plans as of 20 October 2026 and have not been deployed or tested against real AICTE data. Synthetic documents used in the prototype are clearly labelled "SYNTHETIC" and are not real institutional documents. All rule-clause references are illustrative placeholders; the actual AICTE Approval Process Handbook 2024-27 must be read to fill in real clause numbers.', font: FONT, size: 18 })] }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ── Numbering (bullets + numbered lists) ─────────────────────────────────────
const numbering = {
  config: [
    {
      reference: 'bul',
      levels: [{
        level: 0,
        format: 'bullet',
        text: '\u2022',
        alignment: AlignmentType.LEFT,
        style: {
          paragraph: { indent: { left: 540, hanging: 360 } },
          run: { font: 'Symbol' },
        },
      }],
    },
    ...numConfigs(),
  ],
};

// ── Heading styles ────────────────────────────────────────────────────────────
const styles = {
  default: {
    document: { run: { font: FONT, size: 20 } },
  },
  paragraphStyles: [
    {
      id: 'Heading1',
      name: 'Heading 1',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: { font: FONT, size: 32, bold: true, color: BLUE },
      paragraph: {
        spacing: { before: 480, after: 180 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE, space: 8 } },
      },
    },
    {
      id: 'Heading2',
      name: 'Heading 2',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: { font: FONT, size: 26, bold: true, color: BLUE },
      paragraph: { spacing: { before: 320, after: 120 } },
    },
    {
      id: 'Heading3',
      name: 'Heading 3',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: { font: FONT, size: 22, bold: true, color: '2E75B6' },
      paragraph: { spacing: { before: 220, after: 80 } },
    },
  ],
};

// ── Header / Footer ───────────────────────────────────────────────────────────
const header = new Header({
  children: [new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BLUE, space: 4 } },
    children: [
      new TextRun({ text: 'NirikshAI  —  SIH 2026 PS 26261', font: FONT, size: 16, color: BLUE }),
      new TextRun({ text: '  |  AICTE Regulation Bureau  |  20 October 2026', font: FONT, size: 16, color: '595959' }),
    ],
  })],
});

const footer = new Footer({
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: BLUE, space: 4 } },
    children: [
      new TextRun({ text: 'Page ', font: FONT, size: 16, color: '595959' }),
      new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: '595959' }),
      new TextRun({ text: ' of ', font: FONT, size: 16, color: '595959' }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 16, color: '595959' }),
      new TextRun({ text: '  |  Confidential — SIH 2026 Team Submission', font: FONT, size: 16, color: '595959' }),
    ],
  })],
});

// ── Assemble document ────────────────────────────────────────────────────────
const allChildren = [
  ...coverPage,
  ...disclaimer,
  ...sec0_3,
  ...sec4_8,
  ...sec9_12,
  ...sec13_19,
];

const doc = new Document({
  numbering,
  styles,
  sections: [{
    properties: {
      page: {
        margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 }, // ~2 cm
      },
    },
    headers: { default: header },
    footers: { default: footer },
    children: allChildren,
  }],
});

// ── Write ─────────────────────────────────────────────────────────────────────
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUT_PATH, buf);
  const kb = Math.round(buf.length / 1024);
  console.log(`\nNirikshAI report written: ${OUT_PATH}`);
  console.log(`File size: ${kb} KB`);
  console.log('Done.');
}).catch((err) => {
  console.error('Error generating DOCX:', err);
  process.exit(1);
});
