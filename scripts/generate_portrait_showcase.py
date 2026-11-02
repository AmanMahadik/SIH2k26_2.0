import os
from PIL import Image, ImageDraw, ImageFont

def get_fonts():
    try:
        font_title = ImageFont.truetype("segoeuib.ttf", 32)
        font_sub = ImageFont.truetype("segoeui.ttf", 18)
        font_pill = ImageFont.truetype("segoeuib.ttf", 15)
        font_pill_sub = ImageFont.truetype("segoeui.ttf", 13)
        font_card_num = ImageFont.truetype("segoeuib.ttf", 16)
        font_card_title = ImageFont.truetype("segoeuib.ttf", 19)
        font_card_tag = ImageFont.truetype("segoeuib.ttf", 14)
        font_card_desc = ImageFont.truetype("segoeui.ttf", 14)
    except:
        font_title = ImageFont.truetype("arialbd.ttf", 32)
        font_sub = ImageFont.truetype("arial.ttf", 18)
        font_pill = ImageFont.truetype("arialbd.ttf", 15)
        font_pill_sub = ImageFont.truetype("arial.ttf", 13)
        font_card_num = ImageFont.truetype("arialbd.ttf", 16)
        font_card_title = ImageFont.truetype("arialbd.ttf", 19)
        font_card_tag = ImageFont.truetype("arialbd.ttf", 14)
        font_card_desc = ImageFont.truetype("arial.ttf", 14)
    return {
        "title": font_title,
        "sub": font_sub,
        "pill": font_pill,
        "pill_sub": font_pill_sub,
        "card_num": font_card_num,
        "card_title": font_card_title,
        "card_tag": font_card_tag,
        "card_desc": font_card_desc
    }

def draw_header(canvas, draw, fonts, W, title_text, sub_text):
    # Tricolour bar
    draw.rectangle([0, 0, W, 5], fill=(255, 153, 51))
    draw.rectangle([0, 5, W, 10], fill=(255, 255, 255))
    draw.rectangle([0, 10, W, 15], fill=(19, 136, 8))

    # Header Card
    hdr_h = 105
    draw.rectangle([0, 15, W, hdr_h], fill=(255, 255, 255))
    draw.line([0, hdr_h, W, hdr_h], fill=(226, 232, 240), width=2)

    # Title & Subtitle (Pure ASCII English to prevent any font box glitches)
    draw.text((25, 26), title_text, fill=(15, 23, 42), font=fonts["title"])
    draw.text((26, 68), sub_text, fill=(71, 85, 105), font=fonts["sub"])

    # Live Demo Pill on top right
    pill_w = 260
    pill_h = 52
    pill_x = W - pill_w - 25
    pill_y = 28
    draw.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h], radius=8, fill=(16, 185, 129), outline=(5, 150, 105), width=2)
    draw.ellipse([pill_x + 12, pill_y + 19, pill_x + 24, pill_y + 31], fill=(255, 255, 255))
    draw.text((pill_x + 32, pill_y + 9), "LIVE PROD DEMO", fill=(255, 255, 255), font=fonts["pill"])
    draw.text((pill_x + 32, pill_y + 27), "sih-2k26-2-0.vercel.app", fill=(236, 253, 245), font=fonts["pill_sub"])

def draw_card(canvas, draw, fonts, x, y, w, h, img_path, card_num, title, ps_tag, desc, is_hero=False):
    border_col = (37, 99, 235) if is_hero else (203, 213, 225)
    border_w = 2 if is_hero else 1
    draw.rounded_rectangle([x, y, x + w, y + h], radius=10, fill=(255, 255, 255), outline=border_col, width=border_w)

    hdr_h = 46
    hdr_bg = (239, 246, 255) if is_hero else (248, 250, 252)
    draw.rounded_rectangle([x + 1, y + 1, x + w - 1, y + hdr_h], radius=9, fill=hdr_bg)
    draw.rectangle([x + 1, y + hdr_h - 8, x + w - 1, y + hdr_h], fill=hdr_bg)
    draw.line([x + 1, y + hdr_h, x + w - 1, y + hdr_h], fill=(226, 232, 240), width=1)

    # Number
    badge_bg = (37, 99, 235) if is_hero else (71, 85, 105)
    draw.rounded_rectangle([x + 10, y + 10, x + 34, y + 34], radius=5, fill=badge_bg)
    draw.text((x + 17, y + 13), str(card_num), fill=(255, 255, 255), font=fonts["card_num"])

    # Title
    draw.text((x + 42, y + 12), title, fill=(15, 23, 42), font=fonts["card_title"])

    # Tag
    if ps_tag:
        tag_bbox = draw.textbbox((0, 0), ps_tag, font=fonts["card_tag"])
        tag_w = tag_bbox[2] - tag_bbox[0] + 16
        tag_x = x + w - tag_w - 12
        draw.rounded_rectangle([tag_x, y + 10, tag_x + tag_w, y + 34], radius=5, fill=(241, 245, 249), outline=(203, 213, 225), width=1)
        draw.text((tag_x + 8, y + 14), ps_tag, fill=(30, 41, 59), font=fonts["card_tag"])

    # Footer
    footer_h = 32
    footer_y = y + h - footer_h
    draw.rounded_rectangle([x + 1, footer_y, x + w - 1, y + h - 1], radius=9, fill=(248, 250, 252))
    draw.rectangle([x + 1, footer_y, x + w - 1, footer_y + 8], fill=(248, 250, 252))
    draw.line([x + 1, footer_y, x + w - 1, footer_y], fill=(226, 232, 240), width=1)
    draw.text((x + 12, footer_y + 7), desc, fill=(71, 85, 105), font=fonts["card_desc"])

    # Screenshot
    img_avail_w = w - 12
    img_avail_h = h - hdr_h - footer_h - 8
    img_x = x + 6
    img_y = y + hdr_h + 4

    if os.path.exists(img_path):
        img = Image.open(img_path).convert("RGBA")
        img_ratio = img.width / img.height
        avail_ratio = img_avail_w / img_avail_h

        if img_ratio > avail_ratio:
            target_w = img_avail_w
            target_h = int(target_w / img_ratio)
        else:
            target_h = img_avail_h
            target_w = int(target_h * img_ratio)

        img_resized = img.resize((target_w, target_h), Image.LANCZOS)
        pos_x = img_x + (img_avail_w - target_w) // 2
        pos_y = img_y + (img_avail_h - target_h) // 2
        draw.rectangle([pos_x - 1, pos_y - 1, pos_x + target_w + 1, pos_y + target_h + 1], outline=(203, 213, 225), width=1)
        canvas.paste(img_resized, (pos_x, pos_y), img_resized)

# Paths
p_officer = r"C:/Users/PC/.gemini/antigravity/brain/d9aff015-221e-41d3-a913-1f1f2fdabad4/.user_uploaded/media_1793201433787_27b4f607.png"
p_inst    = r"C:/Users/PC/.gemini/antigravity/brain/d9aff015-221e-41d3-a913-1f1f2fdabad4/.user_uploaded/media_1793200969061_85cc9297.png"
p_audit   = r"C:/Users/PC/.gemini/antigravity/brain/d9aff015-221e-41d3-a913-1f1f2fdabad4/.user_uploaded/media_1793201257380_294b5d31.png"
p_rules   = r"C:/Users/PC/.gemini/antigravity/brain/d9aff015-221e-41d3-a913-1f1f2fdabad4/.user_uploaded/media_1793201183478_79a8de48.png"
p_telem   = r"C:/Users/PC/.gemini/antigravity/brain/d9aff015-221e-41d3-a913-1f1f2fdabad4/.user_uploaded/media_1793201213814_b320d47a.png"

# =========================================================================
# 1. GENERATE ALL-IN-ONE PORTRAIT (1200 x 2100) - Complete Vertical Showcase
# =========================================================================
def build_all_in_one_portrait():
    W, H = 1200, 2150
    bg = (245, 247, 250)
    canvas = Image.new("RGB", (W, H), bg)
    draw = ImageDraw.Draw(canvas)
    fonts = get_fonts()

    draw_header(canvas, draw, fonts, W, 
                "NIRIKSHAI 2.0 — Production Application Suite", 
                "Smart India Hackathon 2026 • AICTE PS 26261 • Team Code4Bharat")

    margin = 25
    cw = W - 2 * margin
    
    # 1. Officer Console
    h1 = 460
    draw_card(canvas, draw, fonts, margin, 125, cw, h1, p_officer, 1, 
              "Scrutiny Console & Evidence Canvas", "CORE INNOVATION", 
              "Direct OCR Bounding Boxes • 7-State Engine • Human-in-the-Loop Decision", is_hero=True)

    # 2. Audit Trail
    h2 = 410
    draw_card(canvas, draw, fonts, margin, 125 + h1 + 18, cw, h2, p_audit, 2, 
              "Auditor Portal: SHA-256 Audit Trail", "TAMPER-EVIDENT", 
              "Cryptographic hash chain • Sec 65B Indian Evidence Act • Verify Chain")

    # 3. Institution Portal
    h3 = 360
    draw_card(canvas, draw, fonts, margin, 125 + h1 + 18 + h2 + 18, cw, h3, p_inst, 3, 
              "Institution Portal: Pre-Submission Fix-It", "PRE-SCRUTINY", 
              "Deficiency alerts (Expired NOC, Built-up area) • 85% Readiness Score")

    # 4. Rules as Data
    h4 = 360
    draw_card(canvas, draw, fonts, margin, 125 + h1 + 18 + h2 + 18 + h3 + 18, cw, h4, p_rules, 4, 
              "Statutory Rule Engine: Rules as Versioned Data", "APH 2024-27", 
              "Versioned JSON rules (EOA_EXISTING.v1.json) mapped to APH clauses (§4.1.2, §4.3.1)")

    # 5. Cloud Telemetry
    h5 = 330
    draw_card(canvas, draw, fonts, margin, 125 + h1 + 18 + h2 + 18 + h3 + 18 + h4 + 18, cw, h5, p_telem, 5, 
              "Azure Central India Infrastructure Telemetry", "DEPLOYMENT", 
              "Live Azure PostgreSQL Flexible Server • TLS 1.3 cryptographic transport • 22 sealed blocks")

    out_p = r"C:\SIH2k26_2.0\public\nirikshai_portrait_all5.png"
    canvas.save(out_p, "PNG", quality=95)
    canvas.save(r"C:\Users\PC\.gemini\antigravity\brain\d9aff015-221e-41d3-a913-1f1f2fdabad4\nirikshai_portrait_all5.png", "PNG", quality=95)
    print("Saved all-in-one portrait to:", out_p)

# =========================================================================
# 2. GENERATE PORTRAIT SLIDE PANEL 1 (1000 x 1350) - Best for Slide 2 or 3!
# Focus: Scrutiny Console + Institution Fix-It (The Front-End / User Flow)
# =========================================================================
def build_portrait_slide2_3():
    W, H = 1050, 1380
    bg = (245, 247, 250)
    canvas = Image.new("RGB", (W, H), bg)
    draw = ImageDraw.Draw(canvas)
    fonts = get_fonts()

    draw_header(canvas, draw, fonts, W, 
                "NIRIKSHAI 2.0 — Scrutiny & Verification", 
                "AICTE PS 26261 • Live Pre-Scrutiny & Evidence Workspace")

    margin = 25
    cw = W - 2 * margin

    # Card 1: Scrutiny Evidence Viewer (Large & clear)
    h1 = 610
    draw_card(canvas, draw, fonts, margin, 125, cw, h1, p_officer, 1, 
              "Officer Console & Direct-Anchored Evidence Canvas", "CORE (PS Obj 1, 4, 6)", 
              "Exact OCR Bounding Boxes (Page+Line) • Seven-State Machine • Officer Decision Actions", is_hero=True)

    # Card 2: Institution Portal
    h2 = 590
    draw_card(canvas, draw, fonts, margin, 125 + h1 + 20, cw, h2, p_inst, 2, 
              "Institution Portal: Pre-Submission Deficiency Fix-It", "PRE-SCRUTINY (Obj 1, 2)", 
              "Instant pre-submission deficiency triage (Expired State NOC & Land Area) • 85% Readiness Score")

    out_p = r"C:\SIH2k26_2.0\public\nirikshai_portrait_slide2_3.png"
    canvas.save(out_p, "PNG", quality=95)
    canvas.save(r"C:\Users\PC\.gemini\antigravity\brain\d9aff015-221e-41d3-a913-1f1f2fdabad4\nirikshai_portrait_slide2_3.png", "PNG", quality=95)
    print("Saved Slide 2/3 portrait to:", out_p)

# =========================================================================
# 3. GENERATE PORTRAIT SLIDE PANEL 2 (1050 x 1380) - Best for Slide 4 or 6!
# Focus: Hash-Chained Audit Ledger + Rules as Data + Azure Telemetry (Trust & Infra)
# =========================================================================
def build_portrait_slide4_6():
    W, H = 1050, 1380
    bg = (245, 247, 250)
    canvas = Image.new("RGB", (W, H), bg)
    draw = ImageDraw.Draw(canvas)
    fonts = get_fonts()

    draw_header(canvas, draw, fonts, W, 
                "NIRIKSHAI 2.0 — Trust & Cloud Verification", 
                "Cryptographic Integrity & APH 2024–27 Compliance Engine")

    margin = 25
    cw = W - 2 * margin

    # Card 1: Audit Trail (Hero)
    h1 = 430
    draw_card(canvas, draw, fonts, margin, 125, cw, h1, p_audit, 1, 
              "Auditor Portal: SHA-256 Hash-Chained Audit Trail", "LEGAL INTEGRITY (Obj 3, 6)", 
              "Immutable SHA-256 chain • Section 65B Indian Evidence Act compliant • Verify Chain Control", is_hero=True)

    # Card 2: Rules Engine
    h2 = 380
    draw_card(canvas, draw, fonts, margin, 125 + h1 + 18, cw, h2, p_rules, 2, 
              "Statutory Rule Engine: Rules as Versioned Data", "APH 2024-27 (Obj 1, 2)", 
              "Versioned JSON rule definitions mapped to APH 2024–27 clauses (§4.1.2, §4.3.1, §4.5.1)")

    # Card 3: Cloud Telemetry
    h3 = 380
    draw_card(canvas, draw, fonts, margin, 125 + h1 + 18 + h2 + 18, cw, h3, p_telem, 3, 
              "Azure Central India Telemetry & Live Vercel Production", "LIVE CLOUD PROOF", 
              "Live Azure PostgreSQL Flexible Server • SSL TLS 1.3 Transport • 22 Cryptographic Blocks Sealed")

    out_p = r"C:\SIH2k26_2.0\public\nirikshai_portrait_slide4_6.png"
    canvas.save(out_p, "PNG", quality=95)
    canvas.save(r"C:\Users\PC\.gemini\antigravity\brain\d9aff015-221e-41d3-a913-1f1f2fdabad4\nirikshai_portrait_slide4_6.png", "PNG", quality=95)
    print("Saved Slide 4/6 portrait to:", out_p)

if __name__ == "__main__":
    build_all_in_one_portrait()
    build_portrait_slide2_3()
    build_portrait_slide4_6()
