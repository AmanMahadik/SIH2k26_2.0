"""
Generate all 4 diagrams for NirikshAI SIH 2026 report.
Output: root.png, arch.png, state.png, er.png  (all in the img/ folder)
"""
import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import matplotlib.patheffects as pe
import numpy as np

OUT = os.path.dirname(os.path.abspath(__file__))

# ──────────────────────────────────────────────────────────────────────────────
# COLOURS
# ──────────────────────────────────────────────────────────────────────────────
BLUE_DARK  = '#1F4E79'
BLUE_MED   = '#2E75B6'
BLUE_LIGHT = '#BDD7EE'
ORANGE     = '#C9A227'
GREEN      = '#375623'
GREEN_LITE = '#E2EFDA'
RED_LITE   = '#FCE4D6'
GREY_LITE  = '#F2F2F2'
GREY_DARK  = '#595959'
WHITE      = '#FFFFFF'
AMBER      = '#FFF8E1'

plt.rcParams.update({
    'font.family': 'DejaVu Sans',
    'font.size': 10,
})

# ══════════════════════════════════════════════════════════════════════════════
# 1. ROOT CAUSE TREE
# ══════════════════════════════════════════════════════════════════════════════
def draw_root():
    fig, ax = plt.subplots(figsize=(16, 11))
    ax.set_xlim(0, 16); ax.set_ylim(0, 11)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)

    def box(ax, x, y, w, h, txt, facecolor=BLUE_LIGHT, textcolor='black', fontsize=8.5, bold=False):
        fancy = FancyBboxPatch((x - w/2, y - h/2), w, h,
                               boxstyle="round,pad=0.12", linewidth=1.2,
                               edgecolor=BLUE_MED, facecolor=facecolor, zorder=3)
        ax.add_patch(fancy)
        ax.text(x, y, txt, ha='center', va='center', fontsize=fontsize,
                fontweight='bold' if bold else 'normal', color=textcolor,
                wrap=True, zorder=4,
                multialignment='center')
        return (x, y)

    def arrow(ax, x1, y1, x2, y2):
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle='->', color=BLUE_DARK, lw=1.5), zorder=2)

    # Root
    box(ax, 8, 10.1, 6.5, 0.75, 'Manual, Inconsistent AICTE EoA Scrutiny Process', BLUE_DARK, WHITE, 10, True)

    # Level 1 branches
    lvl1 = [
        (2.0,  8.5, 'A  Redundant re-check\nof AICTE-held records'),
        (6.0,  8.5, 'B  Checklist manually\napplied → late mismatch'),
        (10.5, 8.5, 'C  Authenticity hard\nto confirm'),
        (14.0, 8.5, 'D  Infrastructure\nevidence unstructured'),
    ]
    for x, y, t in lvl1:
        box(ax, x, y, 3.4, 0.85, t, BLUE_MED, WHITE, 8.5)
        arrow(ax, 8, 9.73, x, y+0.43)

    # Level 2 leaves
    leaves = [
        (1.0,  6.8, 'A1 Faculty/intake\nalready in DB',     GREEN_LITE),
        (3.0,  6.8, 'A2 No read-only\nrecords API',         RED_LITE),
        (5.0,  6.8, 'B1 Checklist not\nmachine-readable',   RED_LITE),
        (7.0,  6.8, 'B2 Expiry checks\nmanual',             RED_LITE),
        (9.0,  6.8, 'B3 Cross-doc checks\nmiss numeric err', RED_LITE),
        (10.0, 6.8, 'C1 No issuer API\nfor most docs',      RED_LITE),
        (11.5, 6.8, 'C2 Tamper detection\nno tooling',      RED_LITE),
        (13.0, 6.8, 'C3 QR/Digital sign\nnot mandatory',    AMBER),
        (14.5, 6.8, 'D1 Photos lack\nEXIF/metadata',        AMBER),
    ]
    parent_x = {0: 2.0, 1: 2.0, 2: 6.0, 3: 6.0, 4: 6.0,
                 5: 10.5, 6: 10.5, 7: 14.0, 8: 14.0}
    for i, (x, y, t, c) in enumerate(leaves):
        box(ax, x, y, 1.8, 0.85, t, c, 'black', 7.5)
        arrow(ax, parent_x[i], 8.08, x, y+0.43)

    # Green "solvable" annotation
    solve_boxes = [2, 3, 4, 5, 6]  # B1, B2, B3, C1, C2 are solvable
    for i in solve_boxes:
        x, y, *_ = leaves[i]
        ax.add_patch(FancyBboxPatch((x-0.9, y-0.6), 1.8, 0.22,
                                    boxstyle="round,pad=0.05",
                                    facecolor='#70AD47', edgecolor='none', zorder=5, alpha=0.9))
        ax.text(x, y-0.49, '✓ Prototype solves', ha='center', va='center',
                fontsize=6, color=WHITE, zorder=6)

    # Legend
    leg_items = [
        mpatches.Patch(facecolor=RED_LITE, edgecolor=BLUE_MED, label='Unresolved / structural gap'),
        mpatches.Patch(facecolor=AMBER,    edgecolor=BLUE_MED, label='Partial / external dependency'),
        mpatches.Patch(facecolor='#70AD47', label='✓ Solvable in prototype'),
    ]
    ax.legend(handles=leg_items, loc='lower left', fontsize=8, framealpha=0.9)
    ax.set_title('Figure 1 – NirikshAI Root-Cause Analysis Tree', fontsize=12,
                 fontweight='bold', color=BLUE_DARK, pad=10)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT, 'root.png'), dpi=150, bbox_inches='tight', facecolor=WHITE)
    plt.close(fig)
    print('root.png done')


# ══════════════════════════════════════════════════════════════════════════════
# 2. SYSTEM ARCHITECTURE
# ══════════════════════════════════════════════════════════════════════════════
def draw_arch():
    fig, ax = plt.subplots(figsize=(20, 12))
    ax.set_xlim(0, 20); ax.set_ylim(0, 12)
    ax.axis('off')
    fig.patch.set_facecolor('#F8FAFC')

    def rect(x, y, w, h, label, sub='', fc=BLUE_LIGHT, ec=BLUE_MED, tc='black', fs=8.5, bold=False):
        p = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.15",
                           linewidth=1.5, edgecolor=ec, facecolor=fc, zorder=3)
        ax.add_patch(p)
        yc = y + h/2
        if sub:
            ax.text(x + w/2, yc + 0.15, label, ha='center', va='center',
                    fontsize=fs, fontweight='bold' if bold else 'normal', color=tc, zorder=4)
            ax.text(x + w/2, yc - 0.22, sub, ha='center', va='center',
                    fontsize=fs-1.5, color=tc, zorder=4, style='italic')
        else:
            ax.text(x + w/2, yc, label, ha='center', va='center',
                    fontsize=fs, fontweight='bold' if bold else 'normal', color=tc, zorder=4)

    def arr(x1, y1, x2, y2, color=BLUE_DARK, style='->', lw=1.4, dashed=False):
        ls = '--' if dashed else '-'
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle=style, color=color, lw=lw, linestyle=ls), zorder=2)

    def grp(x, y, w, h, label, fc, ec, alpha=0.18):
        p = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.2",
                           linewidth=1.8, edgecolor=ec,
                           facecolor=fc, alpha=alpha, zorder=1)
        ax.add_patch(p)
        ax.text(x + 0.2, y + h - 0.3, label, fontsize=8, fontweight='bold',
                color=ec, zorder=2)

    # ── groups ──
    grp(0.2, 0.3, 4.8, 11.2, 'Users / Clients', BLUE_MED, BLUE_DARK)
    grp(5.2, 6.0, 9.3, 5.5,  'Next.js App (Vercel)', BLUE_MED, BLUE_DARK)
    grp(5.2, 0.3, 9.3, 5.5,  'AI & Mock Services (Docker / Azure)', '#E76F51', '#C0392B')
    grp(14.7, 0.3, 5.0, 11.2,'Data & Auth', '#27AE60', '#1E8449')

    # Users
    rect(0.4, 9.1, 4.2, 1.0, 'Institution Portal', 'College uploads, fix-it list', BLUE_LIGHT, BLUE_MED)
    rect(0.4, 7.3, 4.2, 1.0, 'Officer Console',    'Queue, evidence, confirm/dismiss', BLUE_LIGHT, BLUE_MED)
    rect(0.4, 5.5, 4.2, 1.0, 'Admin / Rule Mgr',  'Versioned rule sets', BLUE_LIGHT, BLUE_MED)
    rect(0.4, 3.7, 4.2, 1.0, 'Auditor View',       'Read-only audit trail', BLUE_LIGHT, BLUE_MED)

    # Orchestrator
    rect(5.4, 9.5, 3.2, 1.5, 'Orchestrator API',  'Next.js App Router\nRBAC · Enqueue · Assemble', BLUE_DARK, BLUE_DARK, WHITE, 8.5, True)
    rect(8.8, 9.5, 5.3, 1.5, 'Rule Engine (TS)',  'Versioned rules (JSON)\nEvidence-linked findings', '#E67E22', '#D35400', WHITE, 8.5, True)

    rect(5.4, 6.8, 3.2, 1.9, 'Worker / Job Queue','Postgres table\nSELECT…FOR UPDATE', BLUE_MED, BLUE_DARK, WHITE, 8.5)
    rect(8.8, 6.8, 5.3, 1.9, 'Alert Service',     'In-app + Email alerts\n(Resend free tier)', BLUE_MED, BLUE_DARK, WHITE, 8.5)

    rect(5.4, 6.3, 3.2, 0.3, 'Audit Logger', 'SHA-256 hash chain', '#16A085', '#1E8449', WHITE, 7.5)

    # AI Services
    rect(5.4, 3.8, 5.3, 1.5, 'FastAPI AI Service', '/classify  /ocr+extract\n/tamper  /infra-advice', '#E76F51', '#C0392B', WHITE, 8.5, True)
    rect(5.4, 1.5, 3.8, 1.9, 'Mock Issuer',        'Signed JSON\n+ QR endpoint', '#F39C12', '#D68910', WHITE, 8.5)
    rect(9.4, 1.5, 4.7, 1.9, 'Mock AICTE Records', 'EoA history, intake\ndeficiency, TER status', '#F39C12', '#D68910', WHITE, 8.5)

    # Data
    rect(14.9, 9.1, 4.6, 1.5, 'Supabase Postgres',  'RLS on all tables\nJob queue table', '#27AE60', '#1E8449', WHITE, 8.5, True)
    rect(14.9, 7.0, 4.6, 1.7, 'Supabase Storage',   'Private buckets\nSigned URLs', '#27AE60', '#1E8449', WHITE, 8.5)
    rect(14.9, 5.1, 4.6, 1.5, 'Supabase Realtime',  'Live status updates\nto browser', '#27AE60', '#1E8449', WHITE, 8.5)
    rect(14.9, 3.2, 4.6, 1.5, 'Clerk Auth',         'JWTs with role claim\nOrg + public metadata', '#8E44AD', '#6C3483', WHITE, 8.5)
    rect(14.9, 1.5, 4.6, 1.4, 'Azure (optional)',   'Container hosting\n+ Document AI OCR', '#2980B9', '#1F618D', WHITE, 8.5)

    # Arrows: Users → Orchestrator
    for y in [9.6, 7.8, 6.0, 4.2]:
        arr(4.6, y, 5.4, 10.2 if y > 8 else 10.25, BLUE_DARK, lw=1.2)

    arr(8.6, 10.25, 8.8, 10.25)            # Orchestrator → Rule Engine
    arr(6.8, 9.5,  6.8, 8.7)               # Orchestrator → Worker
    arr(10.5, 9.5, 10.5, 8.7)              # Rule Engine → Alerts

    arr(6.8, 6.8, 6.8, 5.3, '#E76F51')    # Worker → AI Service
    arr(8.6, 4.55, 9.4, 4.0, '#E76F51', lw=1.2)   # AI → Mock Issuer area
    arr(8.6, 4.2,  9.4, 2.4, '#E76F51', lw=1.2)   # AI → Mock Records

    arr(14.6, 10.2, 14.9, 9.85)            # → Postgres
    arr(14.6, 7.85, 14.9, 7.85)            # → Storage
    arr(14.6, 5.7,  14.9, 5.7)             # → Realtime
    arr(14.9, 4.0, 14.9, 3.85, '#8E44AD', dashed=True)  # Clerk (auth dotted)
    arr(6.0,  1.5, 6.0,  3.8, '#E76F51', dashed=True, lw=1.0)

    # Legend
    leg = [
        mpatches.Patch(facecolor=BLUE_DARK, label='Orchestrator / Core'),
        mpatches.Patch(facecolor='#E76F51',  label='AI & Mock Services'),
        mpatches.Patch(facecolor='#27AE60',  label='Supabase (Data)'),
        mpatches.Patch(facecolor='#8E44AD',  label='Clerk (Auth)'),
        mpatches.Patch(facecolor='#F39C12',  label='Mock APIs (orange)'),
    ]
    ax.legend(handles=leg, loc='lower right', fontsize=8, framealpha=0.9)
    ax.set_title('Figure 2 – NirikshAI System Architecture (Dotted = Auth flows; Orange = AICTE-side mocks)',
                 fontsize=11, fontweight='bold', color=BLUE_DARK)
    fig.tight_layout()
    fig.savefig(os.path.join(OUT, 'arch.png'), dpi=150, bbox_inches='tight', facecolor='#F8FAFC')
    plt.close(fig)
    print('arch.png done')


# ══════════════════════════════════════════════════════════════════════════════
# 3. SEVEN-STATE VERIFICATION STATE MACHINE
# ══════════════════════════════════════════════════════════════════════════════
def draw_state():
    fig, ax = plt.subplots(figsize=(16, 5))
    ax.set_xlim(0, 16); ax.set_ylim(0, 5)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)

    def state_box(ax, x, y, w, h, label, fc=BLUE_LIGHT, ec=BLUE_MED, tc='black', fs=8.5):
        p = FancyBboxPatch((x - w/2, y - h/2), w, h,
                           boxstyle="round,pad=0.15",
                           linewidth=1.6, edgecolor=ec, facecolor=fc, zorder=3)
        ax.add_patch(p)
        ax.text(x, y, label, ha='center', va='center', fontsize=fs,
                fontweight='bold', color=tc, zorder=4, multialignment='center')

    def edge(ax, x1, y1, x2, y2, label='', color=BLUE_DARK, dashed=False, lw=1.4,
             rad=0.0, labeloff=(0, 0.2)):
        ls = (0, (4, 3)) if dashed else '-'
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle='->', color=color, lw=lw,
                                   linestyle=ls,
                                   connectionstyle=f'arc3,rad={rad}'), zorder=2)
        if label:
            mx = (x1 + x2) / 2 + labeloff[0]
            my = (y1 + y2) / 2 + labeloff[1]
            ax.text(mx, my, label, fontsize=7, color=color, ha='center',
                    va='center', zorder=5,
                    bbox=dict(boxstyle='round,pad=0.15', fc=WHITE, ec='none', alpha=0.85))

    # States
    state_box(ax, 1.3, 2.5, 2.0, 0.9, 'QUEUED\n(initial)', GREY_LITE, GREY_DARK, GREY_DARK)
    state_box(ax, 4.0, 2.5, 2.2, 0.9, 'VERIFICATION\nPENDING', AMBER, ORANGE, ORANGE)
    state_box(ax, 7.2, 4.1, 2.2, 0.9, 'VERIFIED', GREEN_LITE, GREEN, GREEN)
    state_box(ax, 7.2, 2.5, 2.4, 0.9, 'MISMATCH\nDETECTED', RED_LITE, '#C0392B', '#C0392B')
    state_box(ax, 7.2, 0.9, 2.2, 0.9, 'EXPIRED', '#FCE4D6', '#C0392B', '#C0392B')
    state_box(ax, 10.6, 2.5, 2.4, 0.9, 'SOURCE\nUNAVAILABLE', '#FFF3CD', '#856404', '#856404')
    state_box(ax, 14.0, 2.5, 2.4, 0.9, 'MANUAL REVIEW\nREQUIRED', '#D6EAF8', BLUE_DARK, BLUE_DARK)

    # Edges
    edge(ax, 2.3, 2.5, 2.9, 2.5, 'start verify')
    edge(ax, 5.1, 2.9, 6.1, 3.8, 'source OK\nfield match', '#27AE60', labeloff=(0, 0.15))
    edge(ax, 5.1, 2.5, 6.0, 2.5, 'source OK\nmismatch', '#C0392B')
    edge(ax, 5.1, 2.1, 6.1, 1.2, 'doc expired', '#C0392B', labeloff=(0, -0.2))
    edge(ax, 5.1, 2.5, 9.4, 2.5, 'timeout\n/ error', '#856404', rad=0.0, labeloff=(0.4, 0.25))
    edge(ax, 11.8, 2.5, 12.8, 2.5, 'max retries\nexceeded', BLUE_DARK)

    # Back-off retry loop on SOURCE_UNAVAILABLE
    edge(ax, 10.6, 3.0, 10.6, 3.6, '', '#856404', dashed=True, rad=0)
    edge(ax, 10.6, 3.6, 4.0, 3.1, 'retry\n(back-off)', '#856404', dashed=True, rad=0.25)

    # Officer action from MANUAL REVIEW REQUIRED
    ax.annotate('', xy=(14.0, 1.5), xytext=(14.0, 2.0),
                arrowprops=dict(arrowstyle='->', color=BLUE_DARK, lw=1.2, linestyle='--'))
    ax.text(14.0, 1.3, 'Officer confirms\n→ VERIFIED or MISMATCH', ha='center',
            fontsize=7, color=BLUE_DARK, style='italic')

    ax.set_title('Figure 4 – Verification State Machine  (7 states; "Source unavailable" retries with back-off, never silent pass)',
                 fontsize=10, fontweight='bold', color=BLUE_DARK, pad=10)
    fig.tight_layout()
    fig.savefig(os.path.join(OUT, 'state.png'), dpi=150, bbox_inches='tight', facecolor=WHITE)
    plt.close(fig)
    print('state.png done')


# ══════════════════════════════════════════════════════════════════════════════
# 4. ENTITY-RELATIONSHIP DIAGRAM
# ══════════════════════════════════════════════════════════════════════════════
def draw_er():
    fig, ax = plt.subplots(figsize=(16, 8))
    ax.set_xlim(0, 16); ax.set_ylim(0, 8)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)

    def er_box(ax, x, y, w, title, attrs, fc=BLUE_LIGHT, ec=BLUE_MED, tc='black'):
        row_h = 0.35
        hdr_h = 0.50
        total_h = hdr_h + len(attrs) * row_h + 0.1
        # header
        hp = FancyBboxPatch((x, y - total_h + hdr_h + 0.05), w, hdr_h - 0.05,
                            boxstyle="square,pad=0", linewidth=0, facecolor=ec, zorder=3)
        ax.add_patch(hp)
        # body
        bp = FancyBboxPatch((x, y - total_h + 0.05), w, total_h - hdr_h - 0.05,
                            boxstyle="square,pad=0", linewidth=1, edgecolor=ec,
                            facecolor=fc, zorder=3)
        ax.add_patch(bp)
        # border
        outer = plt.Polygon(
            [(x, y), (x+w, y), (x+w, y-total_h), (x, y-total_h)],
            fill=False, edgecolor=ec, linewidth=1.5, zorder=4)
        ax.add_patch(outer)
        ax.text(x + w/2, y - hdr_h/2 + 0.05, title, ha='center', va='center',
                fontsize=8.5, fontweight='bold', color=WHITE, zorder=5)
        for i, (attr, pk) in enumerate(attrs):
            ay = y - hdr_h - i * row_h - row_h/2
            color = ORANGE if pk else tc
            fw = 'bold' if pk else 'normal'
            ax.text(x + 0.15, ay, attr, ha='left', va='center',
                    fontsize=7, fontweight=fw, color=color, zorder=5)
        return (x + w/2, y - total_h/2)   # centre for arrows

    def rel(ax, p1, p2, label='', color=GREY_DARK):
        ax.annotate('', xy=p2, xytext=p1,
                    arrowprops=dict(arrowstyle='->', color=color, lw=1.3), zorder=2)
        if label:
            mx = (p1[0]+p2[0])/2
            my = (p1[1]+p2[1])/2
            ax.text(mx, my, label, fontsize=7, color=color, ha='center',
                    bbox=dict(boxstyle='round,pad=0.1', fc=WHITE, ec='none', alpha=0.9))

    # Table definitions: (name, [(attr, is_pk), ...], x, y)
    tables = [
        ('institutions',
         [('🔑 id (uuid)', True), ('aicte_id (text unique)', False),
          ('name, state, university', False)],
         0.2, 7.8),
        ('applications',
         [('🔑 id (uuid)', True), ('institution_id (fk)', False),
          ('category, academic_year', False), ('status (enum)', False),
          ('priority, created_by', False), ('submitted_at, created_at', False)],
         4.2, 7.8),
        ('documents',
         [('🔑 id (uuid)', True), ('application_id (fk)', False),
          ('doc_type, storage_path', False), ('sha256, phash', False),
          ('analysis_status', False)],
         8.2, 7.8),
        ('extracted_fields',
         [('🔑 id (uuid)', True), ('document_id (fk)', False),
          ('field_key, value', False), ('confidence, page', False),
          ('bbox (jsonb)', False)],
         12.2, 7.8),
        ('rule_sets',
         [('🔑 id (uuid)', True), ('category, version', False),
          ('source_ref, rules (jsonb)', False), ('active (bool)', False)],
         0.2, 3.8),
        ('findings',
         [('🔑 id (uuid)', True), ('application_id (fk)', False),
          ('rule_set_id (fk), rule_id', False), ('kind (enum), severity', False),
          ('message, evidence (jsonb)', False), ('status (open/confirmed/dismissed)', False)],
         4.2, 3.8),
        ('verifications',
         [('🔑 id (uuid)', True), ('document_id (fk)', False),
          ('source, status (enum)', False), ('request_ref, response', False),
          ('checked_at', False)],
         8.2, 3.8),
        ('audit_log',
         [('id (bigserial)', True), ('actor, action, entity', False),
          ('payload (jsonb)', False), ('prev_hash, hash', False),
          ('at (timestamptz)', False)],
         12.2, 3.8),
    ]
    w = 3.7
    centres = {}
    for tname, attrs, x, y in tables:
        cx, cy = er_box(ax, x, y, w, tname, attrs)
        centres[tname] = (cx, cy)

    # Relationships
    rel(ax, (centres['institutions'][0], centres['institutions'][1]+0.3),
            (centres['applications'][0]-w/2, centres['applications'][1]+0.3),
            '1:N')
    rel(ax, (centres['applications'][0]+0.3, centres['applications'][1]-0.4),
            (centres['documents'][0]-w/2, centres['documents'][1]+0.3),
            '1:N')
    rel(ax, (centres['documents'][0]+0.3, centres['documents'][1]+0.0),
            (centres['extracted_fields'][0]-w/2, centres['extracted_fields'][1]+0.0),
            '1:N')
    rel(ax, (centres['applications'][0], centres['applications'][1]-0.9),
            (centres['findings'][0], centres['findings'][1]+0.5),
            '1:N')
    rel(ax, (centres['rule_sets'][0]+0.5, centres['rule_sets'][1]),
            (centres['findings'][0]-0.5, centres['findings'][1]),
            'N:1')
    rel(ax, (centres['documents'][0], centres['documents'][1]-0.9),
            (centres['verifications'][0], centres['verifications'][1]+0.6),
            '1:N')

    ax.set_title('Figure 3 – NirikshAI Entity-Relationship Diagram (Core Tables)',
                 fontsize=11, fontweight='bold', color=BLUE_DARK)
    fig.tight_layout()
    fig.savefig(os.path.join(OUT, 'er.png'), dpi=150, bbox_inches='tight', facecolor=WHITE)
    plt.close(fig)
    print('er.png done')


if __name__ == '__main__':
    draw_root()
    draw_arch()
    draw_state()
    draw_er()
    print('\nAll diagrams generated successfully.')
