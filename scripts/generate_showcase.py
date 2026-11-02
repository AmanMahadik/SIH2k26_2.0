import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_showcase():
    W, H = 2560, 1440
    # Background: clean modern tech backdrop
    bg_color = (245, 247, 250)
    canvas = Image.new("RGB", (W, H), bg_color)
    draw = ImageDraw.Draw(canvas)

    # Fonts
    font_bold_title = ImageFont.truetype("segoeuib.ttf", 40)
    font_sub_title = ImageFont.truetype("segoeui.ttf", 20)
    font_pill = ImageFont.truetype("segoeuib.ttf", 17)
    font_card_num = ImageFont.truetype("segoeuib.ttf", 18)
    font_card_title = ImageFont.truetype("segoeuib.ttf", 21)
    font_card_tag = ImageFont.truetype("segoeuib.ttf", 15)
    font_card_sub = ImageFont.truetype("segoeui.ttf", 15)

    # 1. Top Tricolour Accent Bar
    draw.rectangle([0, 0, W, 7], fill=(255, 153, 51))    # Saffron
    draw.rectangle([0, 7, W, 14], fill=(255, 255, 255))  # White
    draw.rectangle([0, 14, W, 21], fill=(19, 136, 8))    # Green

    # 2. Header Bar (White card with subtle bottom border)
    draw.rectangle([0, 21, W, 130], fill=(255, 255, 255))
    draw.line([0, 130, W, 130], fill=(225, 230, 238), width=2)

    # Title & Subtitle
    draw.text((45, 34), "NIRIKSHAI 2.0 (निरीक्षAI) — Production Application Suite", fill=(15, 23, 42), font=font_bold_title)
    draw.text((47, 85), "AICTE Problem Statement 26261  •  Extension of Approval (EoA) Scrutiny & Document Intelligence  •  Team Code4Bharat", fill=(71, 85, 105), font=font_sub_title)

    # Top Right Badges / Live Demo Pill
    pill_w = 420
    pill_x = W - pill_w - 45
    draw.rounded_rectangle([pill_x, 42, pill_x + pill_w, 88], radius=8, fill=(16, 185, 129), outline=(5, 150, 105), width=2)
    draw.ellipse([pill_x + 18, 57, pill_x + 32, 71], fill=(255, 255, 255))
    draw.text((pill_x + 42, 53), "LIVE PRODUCTION DEMO", fill=(255, 255, 255), font=font_pill)
    draw.text((pill_x + 42, 70), "sih-2k26-2-0.vercel.app", fill=(240, 253, 244), font=font_card_sub)

    # Function to draw a card container with screenshot
    def place_card(x, y, w, h, img_path, card_num, title, ps_tag, desc, is_hero=False):
        # Card background & border
        border_col = (59, 130, 246) if is_hero else (226, 232, 240)
        border_w = 3 if is_hero else 2
        draw.rounded_rectangle([x, y, x + w, y + h], radius=14, fill=(255, 255, 255), outline=border_col, width=border_w)

        # Card Header
        header_h = 56
        hdr_bg = (239, 246, 255) if is_hero else (248, 250, 252)
        draw.rounded_rectangle([x + 2, y + 2, x + w - 2, y + header_h], radius=12, fill=hdr_bg)
        # Flatten bottom corners of header
        draw.rectangle([x + 2, y + header_h - 10, x + w - 2, y + header_h], fill=hdr_bg)
        draw.line([x + 2, y + header_h, x + w - 2, y + header_h], fill=(226, 232, 240), width=1)

        # Number badge
        badge_bg = (37, 99, 235) if is_hero else (71, 85, 105)
        draw.rounded_rectangle([x + 14, y + 12, x + 44, y + 42], radius=6, fill=badge_bg)
        draw.text((x + 23, y + 16), str(card_num), fill=(255, 255, 255), font=font_card_num)

        # Card Title
        draw.text((x + 54, y + 15), title, fill=(15, 23, 42), font=font_card_title)

        # PS Tag on the right
        tag_bbox = draw.textbbox((0, 0), ps_tag, font=font_card_tag)
        tag_w = tag_bbox[2] - tag_bbox[0] + 18
        tag_x = x + w - tag_w - 14
        draw.rounded_rectangle([tag_x, y + 14, tag_x + tag_w, y + 40], radius=6, fill=(241, 245, 249), outline=(203, 213, 225), width=1)
        draw.text((tag_x + 9, y + 18), ps_tag, fill=(30, 41, 59), font=font_card_tag)

        # Footer / Description Banner
        footer_h = 36
        footer_y = y + h - footer_h
        draw.rounded_rectangle([x + 2, footer_y, x + w - 2, y + h - 2], radius=12, fill=(248, 250, 252))
        draw.rectangle([x + 2, footer_y, x + w - 2, footer_y + 10], fill=(248, 250, 252))
        draw.line([x + 2, footer_y, x + w - 2, footer_y], fill=(226, 232, 240), width=1)
        draw.text((x + 16, footer_y + 8), desc, fill=(71, 85, 105), font=font_card_sub)

        # Screenshot image placement
        img_avail_w = w - 16
        img_avail_h = h - header_h - footer_h - 12
        img_x = x + 8
        img_y = y + header_h + 6

        if os.path.exists(img_path):
            img = Image.open(img_path).convert("RGBA")
            # Fit image within img_avail_w, img_avail_h
            img_ratio = img.width / img.height
            avail_ratio = img_avail_w / img_avail_h

            if img_ratio > avail_ratio:
                # scale by width
                target_w = img_avail_w
                target_h = int(target_w / img_ratio)
            else:
                target_h = img_avail_h
                target_w = int(target_h * img_ratio)

            img_resized = img.resize((target_w, target_h), Image.LANCZOS)
            
            # Center inside image box
            pos_x = img_x + (img_avail_w - target_w) // 2
            pos_y = img_y + (img_avail_h - target_h) // 2
            
            # Subtle frame around screenshot
            draw.rectangle([pos_x - 1, pos_y - 1, pos_x + target_w + 1, pos_y + target_h + 1], outline=(203, 213, 225), width=1)
            canvas.paste(img_resized, (pos_x, pos_y), img_resized)

    # Layout Coordinates
    # Left Column: Hero (Officer Evidence Canvas) + Audit Ledger
    # Right Column: 3 cards (Institution Portal, Rule Engine Config, Azure Infrastructure Telemetry)
    
    col_gap = 25
    left_x = 45
    left_w = 1275
    
    right_x = left_x + left_w + col_gap
    right_w = W - right_x - 45

    # 1. Hero: Officer Console (Img 5)
    hero_h = 675
    place_card(
        x=left_x, y=150, w=left_w, h=hero_h,
        img_path=r"C:/Users/PC/.gemini/antigravity/brain/d9aff015-221e-41d3-a913-1f1f2fdabad4/.user_uploaded/media_1793201433787_27b4f607.png",
        card_num=1,
        title="Scrutiny Officer Console & Direct-Anchored Evidence Canvas",
        ps_tag="★ CORE INNOVATION (Obj 1, 4, 6)",
        desc="✓ Exact OCR Bounding Box Anchors  •  ✓ Seven-State Fail-Safe Engine  •  ✓ Human Decision (Recommend / Deficiency / Inspect)",
        is_hero=True
    )

    # 2. Audit Trail (Img 4)
    audit_h = 560
    place_card(
        x=left_x, y=150 + hero_h + 20, w=left_w, h=audit_h,
        img_path=r"C:/Users/PC/.gemini/antigravity/brain/d9aff015-221e-41d3-a913-1f1f2fdabad4/.user_uploaded/media_1793201257380_294b5d31.png",
        card_num=2,
        title="Auditor Portal: Cryptographic Hash-Chained Audit Trail",
        ps_tag="TAMPER-EVIDENT (Obj 3, 6)",
        desc="✓ SHA-256(prev_hash + canonical_event)  •  ✓ Section 65B Indian Evidence Act  •  ✓ Verify Chain & DB Tamper Simulation"
    )

    # Right Column: 3 Cards
    right_card_h = 390
    card_gap = 20

    # 3. Institution Portal (Img 1)
    place_card(
        x=right_x, y=150, w=right_w, h=right_card_h,
        img_path=r"C:/Users/PC/.gemini/antigravity/brain/d9aff015-221e-41d3-a913-1f1f2fdabad4/.user_uploaded/media_1793200969061_85cc9297.png",
        card_num=3,
        title="Institution Portal: Pre-Submission Fix-It Dashboard",
        ps_tag="PRE-SUBMISSION (Obj 1, 2)",
        desc="✓ Instant deficiency triage (Expired State NOC & Built-Up Area)  •  ✓ 85% Readiness Score before submission"
    )

    # 4. Rules Engine (Img 2)
    place_card(
        x=right_x, y=150 + right_card_h + card_gap, w=right_w, h=right_card_h,
        img_path=r"C:/Users/PC/.gemini/antigravity/brain/d9aff015-221e-41d3-a913-1f1f2fdabad4/.user_uploaded/media_1793201183478_79a8de48.png",
        card_num=4,
        title="Statutory Compliance Engine: Rules as Versioned Data",
        ps_tag="REGULATORY RULES (Obj 1, 2)",
        desc="✓ APH 2024–27 Clause-Mapped JSON Rulesets (§4.1.2, §4.3.1, §4.5.1)  •  ✓ Zero-code handbook updates"
    )

    # 5. Azure Telemetry (Img 3)
    place_card(
        x=right_x, y=150 + (right_card_h + card_gap) * 2, w=right_w, h=right_card_h + 15,
        img_path=r"C:/Users/PC/.gemini/antigravity/brain/d9aff015-221e-41d3-a913-1f1f2fdabad4/.user_uploaded/media_1793201213814_b320d47a.png",
        card_num=5,
        title="Cloud Deployment & Live Telemetry Verification",
        ps_tag="ENTERPRISE INFRA (Obj 6)",
        desc="✓ Live Vercel Edge + Azure PostgreSQL (Central India)  •  ✓ SSL TLS 1.3 Transport  •  ✓ 22 Cryptographic Blocks Sealed"
    )

    # Save to workspace and artifact directory
    out_paths = [
        r"C:\SIH2k26_2.0\public\nirikshai_platform_showcase.png",
        r"C:\Users\PC\.gemini\antigravity\brain\d9aff015-221e-41d3-a913-1f1f2fdabad4\nirikshai_platform_showcase.png"
    ]
    
    for op in out_paths:
        os.makedirs(os.path.dirname(op), exist_ok=True)
        canvas.save(op, "PNG", quality=95)
        print(f"Saved showcase image to: {op}")

if __name__ == "__main__":
    create_showcase()
