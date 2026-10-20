// doc_gen/lib.js
// Shared formatting primitives for the NirikshAI DOCX report generator

const fs = require('fs');
const D = require('docx');
const {
  Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, HeadingLevel,
  AlignmentType, ImageRun, LevelFormat,
} = D;

const W    = 9638;       // content width DXA (A4, 2 cm margins each side)
const BLUE = '1F4E79';
const FONT = 'Calibri';

/** Split text on ** markers and return TextRun array */
function runs(text, base = {}) {
  const parts = String(text).split('**');
  return parts.map((t, i) => new TextRun({
    text: t,
    bold: i % 2 === 1 || !!base.bold,
    font: base.font || FONT,
    size: base.size,
    color: base.color,
    italics: base.italics,
  }));
}

const P  = (t, o = {}) => new Paragraph({
  children: runs(t, o),
  spacing: { after: 100, line: 276 },
  alignment: o.align,
  keepNext: o.keepNext,
});

const H1 = (t) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  pageBreakBefore: true,
  children: [new TextRun({ text: t, font: FONT })],
});

const H2 = (t) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  children: [new TextRun({ text: t, font: FONT })],
});

const H3 = (t) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  children: [new TextRun({ text: t, font: FONT })],
});

/** Bullet list */
const B = (items, ref = 'bul') =>
  items.map((t) => new Paragraph({
    numbering: { reference: ref, level: 0 },
    children: runs(t),
    spacing: { after: 60, line: 264 },
  }));

/** Numbered list — each call gets a fresh numbering definition */
let numCount = 0;
const N = (items) => {
  numCount++;
  return items.map((t) => new Paragraph({
    numbering: { reference: 'num' + numCount, level: 0 },
    children: runs(t),
    spacing: { after: 60, line: 264 },
  }));
};

/** Generate up to 80 numbered-list numbering configs (for docx AbstractNum) */
const numConfigs = () => Array.from({ length: 80 }, (_, i) => ({
  reference: 'num' + (i + 1),
  levels: [{
    level: 0,
    format: LevelFormat.DECIMAL,
    text: '%1.',
    alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 540, hanging: 360 } } },
  }],
}));

// Table border helpers
const thin    = { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' };
const borders = { top: thin, bottom: thin, left: thin, right: thin };

/** Rich table: headers, rows, widths (DXA), opt.size */
function T(headers, rows, widths, opt = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  const fs = opt.size || 17;

  const cell = (txt, w, isHead, shade) => new TableCell({
    width: { size: w, type: WidthType.DXA },
    borders,
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: isHead ? BLUE : (shade || 'FFFFFF') },
    margins: { top: 50, bottom: 50, left: 90, right: 90 },
    children: String(txt).split('\n').map((line) =>
      new Paragraph({
        spacing: { after: 20 },
        children: runs(line, { size: fs, color: isHead ? 'FFFFFF' : undefined, bold: isHead }),
      })
    ),
  });

  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({
        tableHeader: true, cantSplit: true,
        children: headers.map((h, i) => cell(h, widths[i], true)),
      }),
      ...rows.map((r, ri) => new TableRow({
        cantSplit: true,
        children: r.map((c, i) => cell(c, widths[i], false, ri % 2 ? 'F5F8FC' : 'FFFFFF')),
      })),
    ],
  });
}

/** Vertical spacer */
const GAP = () => new Paragraph({ spacing: { after: 120 }, children: [] });

/** Code block (grey box, Consolas) */
function CODE(lines) {
  return lines.map((l, i) => new Paragraph({
    spacing: { after: 0, line: 240 },
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'F2F2F2' },
    indent: { left: 120, right: 120 },
    border: i === 0
      ? { top: { style: BorderStyle.SINGLE, size: 4, color: 'D9D9D9', space: 4 } }
      : i === lines.length - 1
        ? { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D9D9D9', space: 4 } }
        : undefined,
    children: [new TextRun({ text: l === '' ? ' ' : l, font: 'Consolas', size: 16 })],
  })).concat([GAP()]);
}

/** Callout/note box (amber left border) */
function NOTE(label, text, fill = 'FFF8E1') {
  return [
    new Table({
      width: { size: W, type: WidthType.DXA },
      columnWidths: [W],
      rows: [new TableRow({
        cantSplit: true,
        children: [new TableCell({
          width: { size: W, type: WidthType.DXA },
          borders: {
            top: thin, bottom: thin, right: thin,
            left: { style: BorderStyle.SINGLE, size: 24, color: 'C9A227' },
          },
          shading: { type: ShadingType.CLEAR, color: 'auto', fill },
          margins: { top: 80, bottom: 80, left: 140, right: 140 },
          children: [new Paragraph({
            children: [
              new TextRun({ text: label + '  ', bold: true, font: FONT, size: 20 }),
              ...runs(text, { size: 20 }),
            ],
          })],
        })],
      })],
    }),
    GAP(),
  ];
}

/** Embedded image centred */
function IMG(path, wpx, hpx, maxW = 600) {
  if (!fs.existsSync(path)) {
    console.warn('Image not found, skipping:', path);
    return P(`[Image: ${path} not found]`, { align: AlignmentType.CENTER });
  }
  const s = Math.min(1, maxW / wpx);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new ImageRun({
      type: 'png',
      data: fs.readFileSync(path),
      transformation: { width: Math.round(wpx * s), height: Math.round(hpx * s) },
      altText: { title: path, description: path, name: path },
    })],
  });
}

/** Italic caption centred */
const CAP = (t) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 160 },
  children: [new TextRun({ text: t, italics: true, size: 18, font: FONT, color: '595959' })],
});

module.exports = {
  D, P, H1, H2, H3, B, N, T, GAP, CODE, NOTE, IMG, CAP,
  numConfigs, W, BLUE, FONT, runs,
};
