"""
build_review_presentation.py
Complete 18-Slide PowerPoint Presentation Generator
Output File: AI_Assisted_Recruitment_System_Review.pptx
Project: AI-Assisted Recruitment System
Student: S. Srisakthi (310624205269), B.Tech IT, Easwari Engineering College
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

OUTPUT_FILE = "AI_Assisted_Recruitment_System_Review.pptx"

# Color Palette strictly matching Combined Review.pptx
PRIMARY_DARK = RGBColor(27, 42, 46)      # #1B2A2E (Charcoal / Slate)
PRIMARY_TEAL = RGBColor(0, 168, 150)     # #00A896 (Vibrant Teal)
SECONDARY_TEAL = RGBColor(2, 128, 144)   # #028090 (Ocean Teal)
MINT_ACCENT = RGBColor(2, 195, 154)      # #02C39A (Mint Green / Highlight)
CARD_BG = RGBColor(244, 250, 249)        # #F4FAF9 (Soft Teal Card Fill)
BORDER_COLOR = RGBColor(215, 231, 229)   # #D7E7E5 (Subtle Divider / Border)
TEXT_MUTED = RGBColor(122, 143, 140)     # #7A8F8C (Muted Teal-Gray)
TEXT_DARK = RGBColor(27, 42, 46)         # #1B2A2E (Primary Text)
TEXT_BODY = RGBColor(62, 92, 88)         # #3E5C58 (Body Text)
WHITE = RGBColor(255, 255, 255)          # #FFFFFF

FONT_PRIMARY = "Calibri"

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    return prs

def add_header(slide, badge_num, kicker, title_text):
    """Adds the exact reference header: number badge, kicker, title, divider line."""
    if badge_num:
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.5), Inches(0.5), Inches(0.55), Inches(0.55))
        badge.fill.solid()
        badge.fill.fore_color.rgb = PRIMARY_TEAL
        badge.line.fill.background()
        tf = badge.text_frame
        tf.word_wrap = False
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tf.paragraphs[0]
        p.text = badge_num
        p.font.name = FONT_PRIMARY
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = WHITE
        p.alignment = PP_ALIGN.CENTER

    k_box = slide.shapes.add_textbox(Inches(1.2), Inches(0.5), Inches(8.0), Inches(0.3))
    tf_k = k_box.text_frame
    tf_k.margin_left = tf_k.margin_right = tf_k.margin_top = tf_k.margin_bottom = 0
    p_k = tf_k.paragraphs[0]
    p_k.text = kicker.upper()
    p_k.font.name = FONT_PRIMARY
    p_k.font.size = Pt(10)
    p_k.font.bold = True
    p_k.font.color.rgb = PRIMARY_TEAL

    t_box = slide.shapes.add_textbox(Inches(1.2), Inches(0.78), Inches(11.5), Inches(0.6))
    tf_t = t_box.text_frame
    tf_t.margin_left = tf_t.margin_right = tf_t.margin_top = tf_t.margin_bottom = 0
    p_t = tf_t.paragraphs[0]
    p_t.text = title_text
    p_t.font.name = FONT_PRIMARY
    p_t.font.size = Pt(22)
    p_t.font.bold = True
    p_t.font.color.rgb = PRIMARY_DARK

    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.2), Inches(1.48), Inches(11.6), Inches(0.02))
    line.fill.solid()
    line.fill.fore_color.rgb = BORDER_COLOR
    line.line.fill.background()

def add_footer(slide, section_name):
    """Adds the exact reference footer at y=7.05"."""
    f_left = slide.shapes.add_textbox(Inches(0.5), Inches(7.05), Inches(6.0), Inches(0.3))
    tf_l = f_left.text_frame
    tf_l.margin_left = tf_l.margin_right = tf_l.margin_top = tf_l.margin_bottom = 0
    p_l = tf_l.paragraphs[0]
    p_l.text = section_name
    p_l.font.name = FONT_PRIMARY
    p_l.font.size = Pt(10)
    p_l.font.color.rgb = TEXT_MUTED

    f_right = slide.shapes.add_textbox(Inches(6.83), Inches(7.05), Inches(6.0), Inches(0.3))
    tf_r = f_right.text_frame
    tf_r.margin_left = tf_r.margin_right = tf_r.margin_top = tf_r.margin_bottom = 0
    p_r = tf_r.paragraphs[0]
    p_r.text = "Review 1 & 2  |  MERN Stack Project"
    p_r.font.name = FONT_PRIMARY
    p_r.font.size = Pt(10)
    p_r.font.color.rgb = TEXT_MUTED
    p_r.alignment = PP_ALIGN.RIGHT

def add_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=BORDER_COLOR, line_width=1, is_rounded=True):
    """Creates a styled card container matching reference PPT."""
    shape_type = MSO_SHAPE.ROUNDED_RECTANGLE if is_rounded else MSO_SHAPE.RECTANGLE
    shape = slide.shapes.add_shape(shape_type, Inches(left), Inches(top), Inches(width), Inches(height))
    shape.fill.solid()
    shape.fill.fore_color.rgb = bg_color
    if border_color:
        shape.line.color.rgb = border_color
        shape.line.width = Pt(line_width)
    else:
        shape.line.fill.background()
    return shape

def add_tip_box(slide, left, top, width, height, tip_text):
    """Creates the signature reference tip box at the bottom."""
    card = add_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=BORDER_COLOR)
    tb = slide.shapes.add_textbox(Inches(left + 0.25), Inches(top + 0.12), Inches(width - 0.5), Inches(height - 0.24))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    p = tf.paragraphs[0]
    p.text = tip_text
    p.font.name = FONT_PRIMARY
    p.font.size = Pt(9.5)
    p.font.color.rgb = TEXT_BODY
    p.font.italic = True
    return card

def format_table_headers(table, headers, col_widths, bg_color=PRIMARY_TEAL):
    """Formats table headers with background color, white bold text, and column widths."""
    for idx, width in enumerate(col_widths):
        table.columns[idx].width = Inches(width)
    for col_idx, text in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = bg_color
        cell.vertical_anchor = MSO_ANCHOR.MIDDLE
        tf = cell.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = text
        p.font.name = FONT_PRIMARY
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = WHITE
        p.alignment = PP_ALIGN.CENTER

def format_table_cells(table, rows_data, row_height=0.42):
    """Populates and formats table data rows with alternating shading."""
    for r_idx, row_values in enumerate(rows_data):
        row = table.rows[r_idx + 1]
        row.height = Inches(row_height)
        is_even = (r_idx % 2 == 1)
        bg = CARD_BG if is_even else WHITE
        for c_idx, val in enumerate(row_values):
            cell = table.cell(r_idx + 1, c_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = bg
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            tf = cell.text_frame
            tf.word_wrap = True
            p = tf.paragraphs[0]
            p.text = str(val)
            p.font.name = FONT_PRIMARY
            p.font.size = Pt(9.5)
            p.font.color.rgb = TEXT_DARK
            if c_idx == 0:
                p.font.bold = True


# ==========================================================
# SLIDE BUILDERS (18 SLIDES)
# ==========================================================

def build_slide_1_title(prs):
    """Slide 1: Title Slide (Academic Cover)."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    # Top Teal Accent Bar
    top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.18))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = PRIMARY_TEAL
    top_bar.line.fill.background()

    # Left Container: Project Title & Overview
    add_card(slide, 0.8, 0.7, 7.2, 5.8, bg_color=CARD_BG, border_color=BORDER_COLOR)

    # Kicker Badge
    k_badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.15), Inches(1.05), Inches(4.3), Inches(0.38))
    k_badge.fill.solid()
    k_badge.fill.fore_color.rgb = PRIMARY_TEAL
    k_badge.line.fill.background()
    p_kb = k_badge.text_frame.paragraphs[0]
    p_kb.text = "FULL STACK DEVELOPMENT (FSD) MINI PROJECT"
    p_kb.font.name = FONT_PRIMARY
    p_kb.font.size = Pt(9.5)
    p_kb.font.bold = True
    p_kb.font.color.rgb = WHITE
    p_kb.alignment = PP_ALIGN.CENTER

    # Title
    t_box = slide.shapes.add_textbox(Inches(1.15), Inches(1.65), Inches(6.5), Inches(1.4))
    tf_t = t_box.text_frame
    tf_t.word_wrap = True
    p_t = tf_t.paragraphs[0]
    p_t.text = "AI-ASSISTED RECRUITMENT SYSTEM"
    p_t.font.name = FONT_PRIMARY
    p_t.font.size = Pt(28)
    p_t.font.bold = True
    p_t.font.color.rgb = PRIMARY_DARK

    # Subtitle
    sub_box = slide.shapes.add_textbox(Inches(1.15), Inches(3.05), Inches(6.5), Inches(1.0))
    tf_sub = sub_box.text_frame
    tf_sub.word_wrap = True
    p_sub = tf_sub.paragraphs[0]
    p_sub.text = "An Enterprise Talent Acquisition Platform Featuring Modular NLP Resume Ingestion, Weighted Multi-Factor Fit Scoring, and a 6-Stage Kanban Pipeline."
    p_sub.font.name = FONT_PRIMARY
    p_sub.font.size = Pt(12)
    p_sub.font.color.rgb = TEXT_BODY

    # Tech badges row
    pills = ["MERN Stack", "React 19", "Node.js & Express", "MongoDB & Mongoose", "Modular NLP", "TF-IDF Engine"]
    start_x = 1.15
    start_y = 4.25
    for idx, pill in enumerate(pills):
        col = idx % 3
        row = idx // 3
        px = start_x + (col * 2.1)
        py = start_y + (row * 0.45)
        pb = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(px), Inches(py), Inches(1.95), Inches(0.35))
        pb.fill.solid()
        pb.fill.fore_color.rgb = WHITE
        pb.line.color.rgb = PRIMARY_TEAL
        pb.line.width = Pt(1)
        p_p = pb.text_frame.paragraphs[0]
        p_p.text = pill
        p_p.font.name = FONT_PRIMARY
        p_p.font.size = Pt(9)
        p_p.font.bold = True
        p_p.font.color.rgb = PRIMARY_DARK
        p_p.alignment = PP_ALIGN.CENTER

    # Project Review Badge
    rev_box = slide.shapes.add_textbox(Inches(1.15), Inches(5.5), Inches(6.5), Inches(0.5))
    tf_rev = rev_box.text_frame
    p_rev = tf_rev.paragraphs[0]
    p_rev.text = "Presentation: Project Review 1 & 2  |  Academic Year 2026–2027"
    p_rev.font.name = FONT_PRIMARY
    p_rev.font.size = Pt(10.5)
    p_rev.font.bold = True
    p_rev.font.color.rgb = SECONDARY_TEAL

    # Right Container: Student & Institution Info
    add_card(slide, 8.3, 0.7, 4.2, 5.8, bg_color=WHITE, border_color=BORDER_COLOR)

    # Institution Header Card inside Right Container
    inst_header = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(8.3), Inches(0.7), Inches(4.2), Inches(0.7))
    inst_header.fill.solid()
    inst_header.fill.fore_color.rgb = PRIMARY_DARK
    inst_header.line.fill.background()
    p_ih = inst_header.text_frame.paragraphs[0]
    p_ih.text = "PROJECT CREDENTIALS"
    p_ih.font.name = FONT_PRIMARY
    p_ih.font.size = Pt(11)
    p_ih.font.bold = True
    p_ih.font.color.rgb = WHITE
    p_ih.alignment = PP_ALIGN.CENTER

    # Student Details
    info_box = slide.shapes.add_textbox(Inches(8.55), Inches(1.6), Inches(3.7), Inches(4.6))
    tf_info = info_box.text_frame
    tf_info.word_wrap = True

    details = [
        ("CANDIDATE NAME", "S. Srisakthi"),
        ("REGISTRATION NUMBER", "310624205269"),
        ("DEGREE & BRANCH", "B.Tech. Information Technology"),
        ("INSTITUTION", "Easwari Engineering College (Autonomous)"),
        ("AFFILIATION", "Affiliated to Anna University, Chennai"),
        ("CAMPUS LOCATION", "Ramapuram, Chennai, Tamil Nadu – 600089"),
        ("DEPARTMENT", "Department of Information Technology"),
        ("SUBMISSION DATE", "October 2026")
    ]

    for i, (label, val) in enumerate(details):
        p_lbl = tf_info.add_paragraph() if i > 0 else tf_info.paragraphs[0]
        p_lbl.text = label
        p_lbl.font.name = FONT_PRIMARY
        p_lbl.font.size = Pt(7.5)
        p_lbl.font.bold = True
        p_lbl.font.color.rgb = TEXT_MUTED

        p_val = tf_info.add_paragraph()
        p_val.text = val
        p_val.font.name = FONT_PRIMARY
        p_val.font.size = Pt(10)
        p_val.font.bold = (i in [0, 1, 3])
        p_val.font.color.rgb = PRIMARY_DARK
        p_val.space_after = Pt(4)

    # Footer
    add_footer(slide, "AI-Assisted Recruitment System")


def build_slide_2_agenda(prs):
    """Slide 2: Agenda (Scope of This Review)."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "", "AGENDA", "Scope of This Review")

    # Left Track Card (Ocean Teal - matching Combined Review.pptx)
    left_card = add_card(slide, 1.09, 1.86, 5.4, 4.35, bg_color=SECONDARY_TEAL, border_color=None)
    
    # Left Header
    lh = slide.shapes.add_textbox(Inches(1.4), Inches(2.05), Inches(4.8), Inches(0.4))
    p_lh = lh.text_frame.paragraphs[0]
    p_lh.text = "PART I: ARCHITECTURE & SPECIFICATIONS"
    p_lh.font.name = FONT_PRIMARY
    p_lh.font.size = Pt(11)
    p_lh.font.bold = True
    p_lh.font.color.rgb = MINT_ACCENT

    # Left Agenda Points
    tb_l = slide.shapes.add_textbox(Inches(1.4), Inches(2.55), Inches(4.8), Inches(3.4))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True

    left_items = [
        ("01", "Requirements (Functional & Non-Functional)"),
        ("02", "Detailed System Architecture & Multi-Tier Flow"),
        ("03", "UML Use Case Diagram (Actors & Subsystems)"),
        ("04", "ER Diagram / Database Design & Schema Models"),
        ("05", "Module Description & Core Responsibilities")
    ]

    for i, (num, text) in enumerate(left_items):
        p = tf_l.add_paragraph() if i > 0 else tf_l.paragraphs[0]
        p.text = f"{num}   {text}"
        p.font.name = FONT_PRIMARY
        p.font.size = Pt(11.5)
        p.font.bold = True
        p.font.color.rgb = WHITE
        p.space_after = Pt(12)

    # Right Track Card (Soft Teal - matching Combined Review.pptx)
    right_card = add_card(slide, 6.85, 1.86, 5.4, 4.35, bg_color=CARD_BG, border_color=BORDER_COLOR)

    # Right Header
    rh = slide.shapes.add_textbox(Inches(7.15), Inches(2.05), Inches(4.8), Inches(0.4))
    p_rh = rh.text_frame.paragraphs[0]
    p_rh.text = "PART II: IMPLEMENTATION & VERIFICATION"
    p_rh.font.name = FONT_PRIMARY
    p_rh.font.size = Pt(11)
    p_rh.font.bold = True
    p_rh.font.color.rgb = SECONDARY_TEAL

    # Right Agenda Points
    tb_r = slide.shapes.add_textbox(Inches(7.15), Inches(2.55), Inches(4.8), Inches(3.4))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True

    right_items = [
        ("06", "Technology Stack & Supporting Libraries"),
        ("07", "UI Design / Wireframes & Screen Architecture"),
        ("08", "Frontend & Backend Development Details"),
        ("09", "Database Integration & Verified REST APIs"),
        ("10", "Implementation Status, Screenshots, Challenges & Plan")
    ]

    for i, (num, text) in enumerate(right_items):
        p = tf_r.add_paragraph() if i > 0 else tf_r.paragraphs[0]
        p.text = f"{num}   {text}"
        p.font.name = FONT_PRIMARY
        p.font.size = Pt(11.5)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_DARK
        p.space_after = Pt(12)

    add_footer(slide, "Agenda")


def build_slide_3_requirements(prs):
    """Slide 3: Functional & Non-Functional Requirements."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "01", "REQUIREMENTS", "Functional & Non-Functional Requirements")

    # Left Card: Functional Requirements
    add_card(slide, 1.2, 1.85, 5.3, 4.95, bg_color=CARD_BG, border_color=BORDER_COLOR)
    
    # Left Card Title
    t_l = slide.shapes.add_textbox(Inches(1.45), Inches(2.05), Inches(4.8), Inches(0.35))
    p_tl = t_l.text_frame.paragraphs[0]
    p_tl.text = "Functional Requirements"
    p_tl.font.name = FONT_PRIMARY
    p_tl.font.size = Pt(13)
    p_tl.font.bold = True
    p_tl.font.color.rgb = PRIMARY_TEAL

    # Left Bullets
    b_l = slide.shapes.add_textbox(Inches(1.45), Inches(2.45), Inches(4.8), Inches(4.2))
    tf_bl = b_l.text_frame
    tf_bl.word_wrap = True

    fr_items = [
        ("User Registration & Authentication", "Dual-role authentication (Recruiter & Candidate) with JWT Bearer tokens and role-protected routes."),
        ("Modular NLP Resume Parser", "Ingestion of PDF, DOCX, and TXT resumes with automated extraction of contacts, experience, and 500+ skills taxonomy."),
        ("Job Requisition Management", "Full CRUD operations for vacancies with required skills, experience boundaries, and education thresholds."),
        ("Multi-Factor AI Candidate Matching", "Deterministic candidate-to-job compatibility scoring (50% skills, 25% exp, 15% edu, 10% TF-IDF semantic fit)."),
        ("6-Stage Kanban Shortlisting Pipeline", "Visual applicant progression (Applied to Screened, Shortlisted, Interview Scheduled, Selected, or Rejected)."),
        ("Interview Scheduling & Alerts", "Integrated interview scheduler with Google Meet/Zoom links, round types, and candidate dashboard alerts.")
    ]

    for i, (title, desc) in enumerate(fr_items):
        p = tf_bl.add_paragraph() if i > 0 else tf_bl.paragraphs[0]
        p.text = f"•  {title}: "
        p.font.name = FONT_PRIMARY
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_DARK

        run = p.add_run()
        run.text = desc
        run.font.name = FONT_PRIMARY
        run.font.size = Pt(9.5)
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(6)

    # Right Card: Non-Functional Requirements
    add_card(slide, 6.8, 1.85, 5.3, 4.95, bg_color=CARD_BG, border_color=BORDER_COLOR)

    # Right Card Title
    t_r = slide.shapes.add_textbox(Inches(7.05), Inches(2.05), Inches(4.8), Inches(0.35))
    p_tr = t_r.text_frame.paragraphs[0]
    p_tr.text = "Non-Functional Requirements"
    p_tr.font.name = FONT_PRIMARY
    p_tr.font.size = Pt(13)
    p_tr.font.bold = True
    p_tr.font.color.rgb = SECONDARY_TEAL

    # Right Bullets
    b_r = slide.shapes.add_textbox(Inches(7.05), Inches(2.45), Inches(4.8), Inches(4.2))
    tf_br = b_r.text_frame
    tf_br.word_wrap = True

    nfr_items = [
        ("Security & Data Protection", "Bcrypt password hashing (10 salt rounds), secure HTTP Bearer JWT tokens, and RBAC middleware protecting private routes."),
        ("Performance & Low Latency", "In-memory NLP parsing & TF-IDF scoring executing in < 1.2s; indexed database lookups under 30ms."),
        ("Scalability & Decoupled Services", "Stateless Express REST API services, decoupled NLP engine, and scalable Mongoose domain models."),
        ("Usability & Modern Interface", "Responsive React 19 UI with Tailwind CSS v4 dark mode aesthetics, interactive modals, and confetti celebrations."),
        ("Reliability & Data Consistency", "Compound unique indexing on (job, candidate), transaction audit logging via stageHistory arrays."),
        ("Maintainability & Clean Architecture", "Strict separation of concerns (Routes, Controllers, Services, Models, Context API) for seamless extensibility.")
    ]

    for i, (title, desc) in enumerate(nfr_items):
        p = tf_br.add_paragraph() if i > 0 else tf_br.paragraphs[0]
        p.text = f"•  {title}: "
        p.font.name = FONT_PRIMARY
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_DARK

        run = p.add_run()
        run.text = desc
        run.font.name = FONT_PRIMARY
        run.font.size = Pt(9.5)
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(6)

    add_footer(slide, "Requirements")


def build_slide_4_architecture(prs):
    """Slide 4: Detailed System Architecture."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "02", "ARCHITECTURE", "Detailed System Architecture")

    # 3 Horizontal Tier Cards
    # Tier 1: Client Tier
    add_card(slide, 1.2, 1.8, 3.2, 1.35, bg_color=PRIMARY_TEAL, border_color=None)
    tb1 = slide.shapes.add_textbox(Inches(1.3), Inches(1.9), Inches(3.0), Inches(1.15))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "CLIENT TIER"
    p1.font.name = FONT_PRIMARY
    p1.font.size = Pt(11)
    p1.font.bold = True
    p1.font.color.rgb = WHITE
    p1.alignment = PP_ALIGN.CENTER
    p1_sub = tf1.add_paragraph()
    p1_sub.text = "React 19 SPA, Tailwind CSS v4,\nAxios REST Client, React Router v7"
    p1_sub.font.name = FONT_PRIMARY
    p1_sub.font.size = Pt(9)
    p1_sub.font.color.rgb = WHITE
    p1_sub.alignment = PP_ALIGN.CENTER

    # Arrow 1
    ar1 = slide.shapes.add_textbox(Inches(4.5), Inches(2.2), Inches(0.5), Inches(0.5))
    ar1.text_frame.paragraphs[0].text = "⇄"
    ar1.text_frame.paragraphs[0].font.size = Pt(20)
    ar1.text_frame.paragraphs[0].font.color.rgb = SECONDARY_TEAL
    ar1.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER

    # Tier 2: Application Tier
    add_card(slide, 5.1, 1.8, 3.2, 1.35, bg_color=SECONDARY_TEAL, border_color=None)
    tb2 = slide.shapes.add_textbox(Inches(5.2), Inches(1.9), Inches(3.0), Inches(1.15))
    tf2 = tb2.text_frame
    tf2.word_wrap = True
    p2 = tf2.paragraphs[0]
    p2.text = "APPLICATION TIER"
    p2.font.name = FONT_PRIMARY
    p2.font.size = Pt(11)
    p2.font.bold = True
    p2.font.color.rgb = WHITE
    p2.alignment = PP_ALIGN.CENTER
    p2_sub = tf2.add_paragraph()
    p2_sub.text = "Node.js + Express.js REST API,\nJWT RBAC, Multer, NLP & Scoring Engine"
    p2_sub.font.name = FONT_PRIMARY
    p2_sub.font.size = Pt(9)
    p2_sub.font.color.rgb = WHITE
    p2_sub.alignment = PP_ALIGN.CENTER

    # Arrow 2
    ar2 = slide.shapes.add_textbox(Inches(8.4), Inches(2.2), Inches(0.5), Inches(0.5))
    ar2.text_frame.paragraphs[0].text = "⇄"
    ar2.text_frame.paragraphs[0].font.size = Pt(20)
    ar2.text_frame.paragraphs[0].font.color.rgb = SECONDARY_TEAL
    ar2.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER

    # Tier 3: Data Tier
    add_card(slide, 9.0, 1.8, 3.1, 1.35, bg_color=PRIMARY_DARK, border_color=None)
    tb3 = slide.shapes.add_textbox(Inches(9.1), Inches(1.9), Inches(2.9), Inches(1.15))
    tf3 = tb3.text_frame
    tf3.word_wrap = True
    p3 = tf3.paragraphs[0]
    p3.text = "DATA TIER"
    p3.font.name = FONT_PRIMARY
    p3.font.size = Pt(11)
    p3.font.bold = True
    p3.font.color.rgb = WHITE
    p3.alignment = PP_ALIGN.CENTER
    p3_sub = tf3.add_paragraph()
    p3_sub.text = "MongoDB NoSQL Database,\nMongoose ODM, Compound Indexing"
    p3_sub.font.name = FONT_PRIMARY
    p3_sub.font.size = Pt(9)
    p3_sub.font.color.rgb = WHITE
    p3_sub.alignment = PP_ALIGN.CENTER

    # Architecture Image Container
    arch_img_path = "diagrams/system_architecture.png"
    if os.path.exists(arch_img_path):
        add_card(slide, 1.2, 3.3, 10.9, 2.75, bg_color=WHITE, border_color=BORDER_COLOR, is_rounded=False)
        slide.shapes.add_picture(arch_img_path, Inches(1.22), Inches(3.32), Inches(10.86), Inches(2.71))

    # Bottom Tip Box
    add_tip_box(slide, 1.2, 6.18, 10.9, 0.62,
                "Request Flow: HTTP/HTTPS requests flow from the React client through Express REST routes & NLP matching services to MongoDB, with validated JSON responses returned along the same path.")

    add_footer(slide, "Architecture")


def build_slide_5_use_case(prs):
    """Slide 5: Use Case Diagram."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "03", "USE CASE", "Use Case Diagram")

    # Left Container with Diagram Image
    uc_img_path = "diagrams/use_case_diagram.png"
    if os.path.exists(uc_img_path):
        add_card(slide, 1.2, 1.85, 7.6, 4.95, bg_color=WHITE, border_color=BORDER_COLOR, is_rounded=False)
        slide.shapes.add_picture(uc_img_path, Inches(1.22), Inches(1.87), Inches(7.56), Inches(4.91))

    # Right Card: Description & Actors
    add_card(slide, 9.0, 1.85, 3.1, 4.95, bg_color=CARD_BG, border_color=BORDER_COLOR)
    
    t_rc = slide.shapes.add_textbox(Inches(9.15), Inches(2.05), Inches(2.8), Inches(0.35))
    p_trc = t_rc.text_frame.paragraphs[0]
    p_trc.text = "Actors & Capabilities"
    p_trc.font.name = FONT_PRIMARY
    p_trc.font.size = Pt(12)
    p_trc.font.bold = True
    p_trc.font.color.rgb = SECONDARY_TEAL

    tb_desc = slide.shapes.add_textbox(Inches(9.15), Inches(2.45), Inches(2.8), Inches(4.2))
    tf_desc = tb_desc.text_frame
    tf_desc.word_wrap = True

    uc_points = [
        ("Candidate Actor:", "Registers account, uploads PDF/DOCX resume, parses contact & skills, browses jobs, submits 1-click applications, tracks stages & interview links."),
        ("Recruiter Actor:", "Posts & manages job requisitions, inspects AI ranked candidates with score breakdowns, advances Kanban stages, and schedules interviews."),
        ("NLP & AI Subsystem:", "Automated <<include>> dependencies execute document text extraction, taxonomy mapping, and weighted multi-factor compatibility evaluation."),
        ("Audit Subsystem:", "Automatically captures timestamped stage transitions into the application history.")
    ]

    for i, (title, desc) in enumerate(uc_points):
        p = tf_desc.add_paragraph() if i > 0 else tf_desc.paragraphs[0]
        p.text = f"{title} "
        p.font.name = FONT_PRIMARY
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_DARK

        run = p.add_run()
        run.text = desc
        run.font.name = FONT_PRIMARY
        run.font.size = Pt(8.5)
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(8)

    add_footer(slide, "Use Case")


def build_slide_6_er_diagram(prs):
    """Slide 6: ER Diagram / Database Design."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "04", "ER DIAGRAM", "ER Diagram / Database Design")

    # Left Container with ER Diagram Image
    er_img_path = "diagrams/er_diagram.png"
    if os.path.exists(er_img_path):
        add_card(slide, 1.2, 1.85, 7.6, 4.95, bg_color=WHITE, border_color=BORDER_COLOR, is_rounded=False)
        slide.shapes.add_picture(er_img_path, Inches(1.22), Inches(1.87), Inches(7.56), Inches(4.91))

    # Right Card: Schema Description
    add_card(slide, 9.0, 1.85, 3.1, 4.95, bg_color=CARD_BG, border_color=BORDER_COLOR)

    t_rc = slide.shapes.add_textbox(Inches(9.15), Inches(2.05), Inches(2.8), Inches(0.35))
    p_trc = t_rc.text_frame.paragraphs[0]
    p_trc.text = "Schema Architecture"
    p_trc.font.name = FONT_PRIMARY
    p_trc.font.size = Pt(12)
    p_trc.font.bold = True
    p_trc.font.color.rgb = PRIMARY_TEAL

    tb_desc = slide.shapes.add_textbox(Inches(9.15), Inches(2.45), Inches(2.8), Inches(4.2))
    tf_desc = tb_desc.text_frame
    tf_desc.word_wrap = True

    er_points = [
        ("Users Collection:", "Central identity store with unique email index, bcrypt hash, and role discriminator ('recruiter' vs 'candidate')."),
        ("Jobs Collection:", "Vacancy specifications referencing the recruiter User ID, with requiredSkills arrays, min/max experience, and education levels."),
        ("CandidateProfiles:", "Structured resume data referencing candidate User ID, containing parsed taxonomy skills, experience duration, and file metadata."),
        ("Applications Collection:", "Junction entity referencing Job, Candidate User, and CandidateProfile with compound unique index (job, candidate)."),
        ("Embedded Subdocuments:", "Arrays for stageHistory, experience, and education deliver high read performance without joins.")
    ]

    for i, (title, desc) in enumerate(er_points):
        p = tf_desc.add_paragraph() if i > 0 else tf_desc.paragraphs[0]
        p.text = f"{title} "
        p.font.name = FONT_PRIMARY
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_DARK

        run = p.add_run()
        run.text = desc
        run.font.name = FONT_PRIMARY
        run.font.size = Pt(8.5)
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(6)

    add_footer(slide, "ER Diagram")


def build_slide_7_modules(prs):
    """Slide 7: Module Description (3-column Table)."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "05", "MODULES", "Module Description")

    # Table: 7 rows (1 header + 6 data rows) x 3 columns
    table_shape = slide.shapes.add_table(7, 3, Inches(1.2), Inches(1.85), Inches(10.9), Inches(4.8))
    table = table_shape.table

    headers = ["Module", "Description", "Key Functions"]
    col_widths = [2.4, 4.3, 4.2]
    format_table_headers(table, headers, col_widths, bg_color=PRIMARY_TEAL)

    rows = [
        ["User Authentication & RBAC",
         "Secure identity and session management for Recruiters and Candidates.",
         "Registration, Login, JWT Token Issuance, Bcrypt Password Hashing, RBAC Middleware."],

        ["Job Requisition Management",
         "Complete administration of job postings, criteria, and skill requirements.",
         "Job Creation, Edit, Delete, Skill Tag Filters, Minimum Experience & Education Setting."],

        ["Modular NLP Resume Parser",
         "Automated ingestion and entity extraction from unstructured resume files.",
         "PDF/DOCX/TXT Binary Ingestion, 500+ Skill Taxonomy Extraction, Experience & Degree Calculation."],

        ["Multi-Factor AI Matching",
         "Deterministic mathematical scoring and ranking of candidate-job fit.",
         "50% Skills, 25% Experience, 15% Education, 10% TF-IDF Semantic Relevance, Fit Recommendation Tiers."],

        ["6-Stage Kanban Pipeline",
         "Visual applicant progression tracking through hiring stages.",
         "Stage Advancement (Applied to Selected/Rejected), Stage Audit History Logging, Recruiter Notes."],

        ["Interview Scheduling & Stats",
         "Collaborative interview coordination and high-level talent metrics.",
         "Meeting Link Assignment, Round Type Selection, Recruiter Funnel Metrics, Candidate Tracker."]
    ]

    format_table_cells(table, rows, row_height=0.68)
    add_footer(slide, "Modules")


def build_slide_8_tech_stack(prs):
    """Slide 8: Technology Stack."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "06", "TECH STACK", "Technology Stack")

    # 4 Horizontal Core Cards
    core_techs = [
        ("MongoDB", "NoSQL Database", "Mongoose ODM v9, BSON document collections, compound unique indexes, and schema validations.", PRIMARY_TEAL),
        ("Express.js", "Backend Framework", "Node.js REST API framework with modular controllers, centralized error handling, and CORS.", SECONDARY_TEAL),
        ("React.js", "Frontend Library", "React 19 with Vite, functional components, hooks, React Router v7, and Tailwind CSS v4.", PRIMARY_TEAL),
        ("Node.js", "Runtime Environment", "Asynchronous V8 event-driven JavaScript runtime executing server APIs and local NLP engines.", PRIMARY_DARK)
    ]

    card_w = 2.55
    spacing = 0.23
    for i, (name, role, desc, col) in enumerate(core_techs):
        x = 1.2 + (i * (card_w + spacing))
        add_card(slide, x, 1.85, card_w, 2.15, bg_color=CARD_BG, border_color=col, line_width=1.5)

        tb = slide.shapes.add_textbox(Inches(x + 0.15), Inches(1.95), Inches(card_w - 0.3), Inches(1.95))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = name
        p1.font.name = FONT_PRIMARY
        p1.font.size = Pt(14)
        p1.font.bold = True
        p1.font.color.rgb = col
        p1.alignment = PP_ALIGN.CENTER

        p2 = tf.add_paragraph()
        p2.text = role
        p2.font.name = FONT_PRIMARY
        p2.font.size = Pt(9.5)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_MUTED
        p2.alignment = PP_ALIGN.CENTER
        p2.space_after = Pt(4)

        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.name = FONT_PRIMARY
        p3.font.size = Pt(8.5)
        p3.font.color.rgb = TEXT_BODY
        p3.alignment = PP_ALIGN.CENTER

    # Supporting Tools & Libraries Card (Bottom)
    add_card(slide, 1.2, 4.25, 10.9, 2.5, bg_color=WHITE, border_color=BORDER_COLOR)

    tb_supp = slide.shapes.add_textbox(Inches(1.4), Inches(4.35), Inches(10.5), Inches(2.3))
    tf_supp = tb_supp.text_frame
    tf_supp.word_wrap = True

    p_st = tf_supp.paragraphs[0]
    p_st.text = "Supporting Libraries, AI Tools & Development Ecosystem"
    p_st.font.name = FONT_PRIMARY
    p_st.font.size = Pt(12)
    p_st.font.bold = True
    p_st.font.color.rgb = PRIMARY_DARK
    p_st.space_after = Pt(6)

    tools_categories = [
        ("AI / NLP Processing:", "natural (TF-IDF semantic similarity), compromise (NLP entity & phrase extraction), pdf-parse (PDF extraction), mammoth (DOCX conversion)"),
        ("Authentication & Security:", "jsonwebtoken (JWT signed token authorization), bcryptjs (password hashing with 10 salt rounds), cors (cross-origin middleware)"),
        ("Frontend Ecosystem:", "react-router-dom v7 (client routing), axios (REST client with JWT interceptors), tailwindcss v4, lucide-react (vector icons), canvas-confetti"),
        ("Development & Testing:", "Node.js Native Assert Integration Test Suite (12/12 passing), Postman (API verification), Git & GitHub (version control), VS Code IDE")
    ]

    for cat, desc in tools_categories:
        p = tf_supp.add_paragraph()
        p.text = f"•  {cat} "
        p.font.name = FONT_PRIMARY
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = SECONDARY_TEAL

        run = p.add_run()
        run.text = desc
        run.font.name = FONT_PRIMARY
        run.font.size = Pt(9)
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(3)

    add_footer(slide, "Tech Stack")


def build_slide_9_ui_design(prs):
    """Slide 9: UI Design / Wireframes."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "07", "UI DESIGN", "UI Design / Wireframes")

    # Left Container with 2 Real Screenshots
    shot1 = "screenshots/3_recruiter_dashboard.png"
    shot2 = "screenshots/7_candidate_dashboard.png"

    if os.path.exists(shot1):
        add_card(slide, 1.2, 1.85, 5.2, 2.35, bg_color=WHITE, border_color=BORDER_COLOR, is_rounded=False)
        slide.shapes.add_picture(shot1, Inches(1.22), Inches(1.87), Inches(5.16), Inches(2.31))

    if os.path.exists(shot2):
        add_card(slide, 1.2, 4.4, 5.2, 2.35, bg_color=WHITE, border_color=BORDER_COLOR, is_rounded=False)
        slide.shapes.add_picture(shot2, Inches(1.22), Inches(4.42), Inches(5.16), Inches(2.31))

    # Right Card: UI Architecture & Wireframe Specifications
    add_card(slide, 6.7, 1.85, 5.4, 4.9, bg_color=CARD_BG, border_color=BORDER_COLOR)

    tb_ui = slide.shapes.add_textbox(Inches(6.9), Inches(2.05), Inches(5.0), Inches(4.5))
    tf_ui = tb_ui.text_frame
    tf_ui.word_wrap = True

    p_uit = tf_ui.paragraphs[0]
    p_uit.text = "Design System & UI Architecture"
    p_uit.font.name = FONT_PRIMARY
    p_uit.font.size = Pt(13)
    p_uit.font.bold = True
    p_uit.font.color.rgb = PRIMARY_DARK
    p_uit.space_after = Pt(8)

    ui_points = [
        ("Dual-Role Workspace Ergonomics:", "Distinct user interfaces engineered specifically for Recruiter high-volume screening vs Candidate self-serve application management."),
        ("Modern High-Contrast Dark Theme:", "Styled with Slate-950 background (#020617) and Emerald-500 highlights to minimize eye fatigue during extended candidate review sessions."),
        ("Tailwind CSS v4 Responsive Grids:", "Fluid breakpoint system (sm, md, lg, xl) adapting from mobile handheld screens to ultra-wide desktop monitors."),
        ("Transparent AI Match Indicators:", "Color-coded MatchScoreBadges (Strong 80%+, Good 65-79%, Potential 50-64%, Low <50%) provide immediate visual triage."),
        ("Zero-Page-Reload Modals:", "Overlay modal workflows for Job Creation, Candidate Detail inspection, and Interview Scheduling with Google Meet links."),
        ("Interactive Delight:", "Confetti burst animations (canvas-confetti) on successful application submissions and interactive stage transitions.")
    ]

    for title, desc in ui_points:
        p = tf_ui.add_paragraph()
        p.text = f"•  {title} "
        p.font.name = FONT_PRIMARY
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = SECONDARY_TEAL

        run = p.add_run()
        run.text = desc
        run.font.name = FONT_PRIMARY
        run.font.size = Pt(9)
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(5)

    add_footer(slide, "UI Design")


def build_slide_10_frontend(prs):
    """Slide 10: Frontend Development."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "08", "FRONTEND", "Frontend Development")

    # Main Content Card
    add_card(slide, 1.2, 1.85, 10.9, 4.15, bg_color=CARD_BG, border_color=BORDER_COLOR)

    tb = slide.shapes.add_textbox(Inches(1.4), Inches(2.0), Inches(10.5), Inches(3.85))
    tf = tb.text_frame
    tf.word_wrap = True

    fe_points = [
        ("Modern React 19 Architecture:", "Engineered using functional components and hooks (useState, useEffect, useContext, useParams, useNavigate) for declarative UI rendering."),
        ("Modular Component Decomposition:", "Reusable components including Navbar, ProtectedRoute, JobFormModal, CandidateDetailModal, ScheduleInterviewModal, ScoreBreakdownModal, and MatchScoreBadge."),
        ("Client-Side Routing (React Router v7):", "Configured in App.jsx with public routes (/, /login, /register, /jobs, /jobs/:id) and role-protected routes (/recruiter-dashboard, /pipeline, /candidate-dashboard, /resume-upload, /my-applications)."),
        ("State Management via Context API:", "AuthContext.jsx provides global authentication state, token validation on mount, login/register actions, and synchronized localStorage persistence."),
        ("HTTP Client & Interceptors (Axios):", "Centralized API service in api.js pre-configured with baseURL, timeout limits, and automated Bearer token attachment to request headers."),
        ("Responsive Styling (Tailwind CSS v4):", "Utility-first styling with responsive flex/grid layouts, smooth CSS transitions, dark-mode styling, and Lucide React iconography.")
    ]

    for i, (title, desc) in enumerate(fe_points):
        p = tf.add_paragraph() if i > 0 else tf.paragraphs[0]
        p.text = f"•  {title} "
        p.font.name = FONT_PRIMARY
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_DARK

        run = p.add_run()
        run.text = desc
        run.font.name = FONT_PRIMARY
        run.font.size = Pt(10)
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(6)

    # Signature Tip Box matching reference PPT
    add_tip_box(slide, 1.2, 6.18, 10.9, 0.62,
                "Tip: The frontend implementation includes 10 dedicated view pages, 7 interactive modals, and full client-side RBAC protection with zero external CSS frameworks.")

    add_footer(slide, "Frontend")


def build_slide_11_backend(prs):
    """Slide 11: Backend Development."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "09", "BACKEND", "Backend Development")

    # Main Content Card
    add_card(slide, 1.2, 1.85, 10.9, 4.15, bg_color=CARD_BG, border_color=BORDER_COLOR)

    tb = slide.shapes.add_textbox(Inches(1.4), Inches(2.0), Inches(10.5), Inches(3.85))
    tf = tb.text_frame
    tf.word_wrap = True

    be_points = [
        ("Modular MVC Architecture:", "Strict separation across routes (src/routes/), controllers (src/controllers/), services (src/services/), models (src/models/), and middlewares (src/middlewares/)."),
        ("Node.js & Express.js Server:", "High-throughput REST API runtime in server.js and app.js configured with express.json({ limit: '20mb' }), express.urlencoded, and Morgan request logger."),
        ("Authentication & RBAC Middleware:", "Custom protect middleware decoding Bearer JWT tokens against JWT_SECRET; authorize('recruiter', 'candidate') middleware enforcing role boundaries."),
        ("Resume Ingestion & Multer Pipeline:", "Configured in upload.js with diskStorage, sanitized filenames, and mimeType validation supporting PDF and DOCX files up to 10MB."),
        ("Centralized Error Handling:", "Custom errorHandler middleware intercepting Mongoose CastError, duplicate key error (code 11000), and validation failures with standard JSON errors."),
        ("Environment Configuration & Security:", "Dynamic configuration via dotenv (.env), secure CORS origin allowance, and isolated service contracts for AI swapping.")
    ]

    for i, (title, desc) in enumerate(be_points):
        p = tf.add_paragraph() if i > 0 else tf.paragraphs[0]
        p.text = f"•  {title} "
        p.font.name = FONT_PRIMARY
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_DARK

        run = p.add_run()
        run.text = desc
        run.font.name = FONT_PRIMARY
        run.font.size = Pt(10)
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(6)

    # Signature Tip Box matching reference PPT
    add_tip_box(slide, 1.2, 6.18, 10.9, 0.62,
                "Tip: Backend verified with 100% pass rate (12/12 assertions) in test/api.test.js covering authentication, job CRUD, NLP parsing, and Kanban stage transitions.")

    add_footer(slide, "Backend")


def build_slide_12_database(prs):
    """Slide 12: Database Integration."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "10", "DATABASE", "Database Integration")

    # Main Content Card
    add_card(slide, 1.2, 1.85, 10.9, 4.15, bg_color=CARD_BG, border_color=BORDER_COLOR)

    tb = slide.shapes.add_textbox(Inches(1.4), Inches(2.0), Inches(10.5), Inches(3.85))
    tf = tb.text_frame
    tf.word_wrap = True

    db_points = [
        ("Data Store & Connection:", "MongoDB instance (local mongodb://127.0.0.1:27017/ai-recruit-pro or MongoDB Atlas URI) connected using Mongoose ODM with connection pooling."),
        ("Collection Modeling:", "4 core collections: users (credentials & roles), jobs (requisition parameters), candidateprofiles (parsed resume taxonomy), and applications (pipeline states)."),
        ("Relational Referencing:", "Mongoose ObjectId references (ref: 'User', ref: 'Job', ref: 'CandidateProfile') with populate() queries for candidate names, jobs, and audit users."),
        ("Database Indexing Strategy:", "Unique index on users.email, compound unique index on applications(job, candidate) preventing duplicate applies, and text indexes on jobs."),
        ("Embedded Subdocuments:", "Denormalized subdocuments for experience, education, stageHistory, and interviewDetails provide zero-join sub-millisecond retrieval."),
        ("End-to-End CRUD Persistence:", "Client React actions trigger Axios requests, validated by Express controllers, and persisted via Mongoose pre/post hooks to MongoDB.")
    ]

    for i, (title, desc) in enumerate(db_points):
        p = tf.add_paragraph() if i > 0 else tf.paragraphs[0]
        p.text = f"•  {title} "
        p.font.name = FONT_PRIMARY
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_DARK

        run = p.add_run()
        run.text = desc
        run.font.name = FONT_PRIMARY
        run.font.size = Pt(10)
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(6)

    # Signature Tip Box matching reference PPT
    add_tip_box(slide, 1.2, 6.18, 10.9, 0.62,
                "Tip: Database includes an automated seeder (seed.js) pre-populating verified recruiters, realistic candidate profiles, and live Kanban pipeline applications.")

    add_footer(slide, "Database")


def build_slide_13_api(prs):
    """Slide 13: API Development (Table of Endpoints)."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "11", "API", "API Development")

    # Table: 11 rows (1 header + 10 data rows) x 3 columns
    table_shape = slide.shapes.add_table(11, 3, Inches(1.2), Inches(1.85), Inches(10.9), Inches(4.85))
    table = table_shape.table

    headers = ["Method", "Endpoint", "Purpose"]
    col_widths = [1.3, 4.4, 5.2]
    format_table_headers(table, headers, col_widths, bg_color=PRIMARY_TEAL)

    endpoints = [
        ["POST", "/api/auth/register", "Register new recruiter or candidate account with bcrypt password hashing"],
        ["POST", "/api/auth/login", "Authenticate user credentials and issue signed JWT Bearer token"],
        ["GET", "/api/jobs", "Retrieve active job postings with keyword, type, location, and experience filters"],
        ["POST", "/api/jobs", "(Recruiter) Create a new job requisition with required skills and criteria"],
        ["POST", "/api/resume/upload", "Upload resume file (PDF/DOCX/TXT), execute NLP extraction, and save profile"],
        ["GET", "/api/matching/job/:jobId/ranked-candidates", "(Recruiter) Compute multi-factor fit scores and return ranked candidates"],
        ["POST", "/api/applications/apply/:jobId", "(Candidate) 1-click application submission with instant AI compatibility analysis"],
        ["GET", "/api/applications/job/:jobId", "(Recruiter) Retrieve all applicants for a job categorized by Kanban stage"],
        ["PUT", "/api/applications/:id/stage", "(Recruiter) Advance candidate stage with timestamped transition audit note"],
        ["PUT", "/api/applications/:id/schedule-interview", "(Recruiter) Schedule interview with date, round type, and video meeting URL"]
    ]

    format_table_cells(table, endpoints, row_height=0.38)
    add_footer(slide, "API")


def build_slide_14_status(prs):
    """Slide 14: Module-wise Implementation Status."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "12", "STATUS", "Module-wise Implementation Status")

    # Module progress bars matching Combined Review.pptx layout
    modules_status = [
        ("User Authentication & RBAC", 100),
        ("Job Requisition Management", 100),
        ("Modular NLP Resume Parser", 100),
        ("Multi-Factor AI Matching Engine", 100),
        ("6-Stage Kanban Pipeline", 100),
        ("Interview Scheduling & Alerts", 100),
        ("Role-Specific Dashboards (Recruiter / Candidate)", 100),
        ("Automated Backend Test Suite (12/12 Passing)", 100)
    ]

    start_y = 1.95
    row_height = 0.55
    bar_width = 5.8

    for i, (mod_name, pct) in enumerate(modules_status):
        cy = start_y + (i * row_height)

        # Label
        lbl_box = slide.shapes.add_textbox(Inches(1.2), Inches(cy - 0.05), Inches(4.3), Inches(0.42))
        tf_lbl = lbl_box.text_frame
        p_l = tf_lbl.paragraphs[0]
        p_l.text = mod_name
        p_l.font.name = FONT_PRIMARY
        p_l.font.size = Pt(10)
        p_l.font.bold = True
        p_l.font.color.rgb = PRIMARY_DARK

        # Background Track
        track = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.6), Inches(cy + 0.04), Inches(bar_width), Inches(0.24))
        track.fill.solid()
        track.fill.fore_color.rgb = CARD_BG
        track.line.color.rgb = BORDER_COLOR
        track.line.width = Pt(1)

        # Fill Progress
        fill_w = bar_width * (pct / 100.0)
        prog = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.6), Inches(cy + 0.04), Inches(fill_w), Inches(0.24))
        prog.fill.solid()
        prog.fill.fore_color.rgb = MINT_ACCENT if pct == 100 else PRIMARY_TEAL
        prog.line.fill.background()

        # Percentage Text
        pct_box = slide.shapes.add_textbox(Inches(11.6), Inches(cy - 0.05), Inches(0.9), Inches(0.42))
        tf_pct = pct_box.text_frame
        p_p = tf_pct.paragraphs[0]
        p_p.text = f"{pct}%"
        p_p.font.name = FONT_PRIMARY
        p_p.font.size = Pt(10)
        p_p.font.bold = True
        p_p.font.color.rgb = SECONDARY_TEAL

    # Bottom Summary Badge
    sum_card = add_card(slide, 1.2, 6.35, 10.9, 0.48, bg_color=CARD_BG, border_color=PRIMARY_TEAL)
    tb_sum = slide.shapes.add_textbox(Inches(1.4), Inches(6.4), Inches(10.5), Inches(0.4))
    p_sum = tb_sum.text_frame.paragraphs[0]
    p_sum.text = "Status Summary: All 8 core architectural modules fully implemented, verified, and passing automated integration tests."
    p_sum.font.name = FONT_PRIMARY
    p_sum.font.size = Pt(9.5)
    p_sum.font.bold = True
    p_sum.font.color.rgb = SECONDARY_TEAL
    p_sum.alignment = PP_ALIGN.CENTER

    add_footer(slide, "Status")


def build_slide_15_screenshots(prs):
    """Slide 15: Application Screenshots (2x2 Grid)."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "13", "SCREENSHOTS", "Application Screenshots")

    screens = [
        ("screenshots/3_recruiter_dashboard.png", "Recruiter Dashboard: Real-time talent metrics, job vacancies, and applicant activity stream", 1.2, 1.85),
        ("screenshots/5_kanban_pipeline.png", "6-Stage Kanban Pipeline: Drag-and-drop candidate advancement with integrated interview triggers", 6.85, 1.85),
        ("screenshots/6_candidate_ranking.png", "AI Candidate Ranking: Multi-factor score breakdown (50/25/15/10), match tiers, and skill gaps", 1.2, 4.35),
        ("screenshots/7_candidate_dashboard.png", "Candidate Dashboard: Parsed resume profile, 1-click application tracker, and interview alerts", 6.85, 4.35)
    ]

    card_w = 5.25
    card_h = 2.3

    for img_path, caption, x, y in screens:
        add_card(slide, x, y, card_w, card_h, bg_color=WHITE, border_color=BORDER_COLOR, is_rounded=False)
        if os.path.exists(img_path):
            slide.shapes.add_picture(img_path, Inches(x + 0.04), Inches(y + 0.04), Inches(card_w - 0.08), Inches(card_h - 0.44))

        # Caption
        cap_box = slide.shapes.add_textbox(Inches(x + 0.1), Inches(y + card_h - 0.35), Inches(card_w - 0.2), Inches(0.3))
        p_cap = cap_box.text_frame.paragraphs[0]
        p_cap.text = caption
        p_cap.font.name = FONT_PRIMARY
        p_cap.font.size = Pt(7.5)
        p_cap.font.bold = True
        p_cap.font.color.rgb = PRIMARY_DARK

    add_footer(slide, "Screenshots")


def build_slide_16_challenges(prs):
    """Slide 16: Challenges Faced & Solutions (Table)."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "14", "CHALLENGES", "Challenges Faced & Solutions")

    # Table: 6 rows (1 header + 5 data rows) x 2 columns
    table_shape = slide.shapes.add_table(6, 2, Inches(1.2), Inches(1.85), Inches(10.9), Inches(4.8))
    table = table_shape.table

    headers = ["Challenge Encountered", "Solution Adopted & Engineering Resolution"]
    col_widths = [4.5, 6.4]
    format_table_headers(table, headers, col_widths, bg_color=PRIMARY_TEAL)

    challenges_data = [
        ["Heterogeneous Resume File Formats\nHandling inconsistent PDF, DOCX, and TXT binary layouts with irregular line breaks and tabular data.",
         "Implemented dual binary parsing via pdf-parse and mammoth with fallback plain-text buffer decoding, feeding a unified NLP extraction pipeline."],

        ["Keyword Stuffing & ATS Vulnerabilities\nCandidates inflating scores by repeating required keywords without genuine domain experience.",
         "Engineered a multi-factor formula: 50% skills overlap, 25% verified years of experience, 15% degree level, and 10% TF-IDF semantic relevance."],

        ["Technical Skill Synonym Discrepancies\nVaried terminology in resumes vs job postings (e.g., 'ReactJS' vs 'React', 'K8s' vs 'Kubernetes').",
         "Constructed a curated 500+ skill taxonomy dictionary with bidirectional synonym maps and case-insensitive substring matching."],

        ["Duplicate Application Submissions\nPreventing race conditions and accidental duplicate submissions when candidates click apply rapidly.",
         "Enforced a compound unique database index on (job, candidate) in Mongoose Application schema, returning idempotent HTTP error responses."],

        ["Auditability Across 6 Hiring Stages\nTracking stage transitions, updater identity, and interviewer notes over the multi-week hiring lifecycle.",
         "Engineered an embedded stageHistory subdocument array capturing transition stage, updater User ObjectId, timestamp, and audit notes."]
    ]

    format_table_cells(table, challenges_data, row_height=0.82)
    add_footer(slide, "Challenges")


def build_slide_17_plan(prs):
    """Slide 17: Remaining Work & Plan."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "15", "NEXT STEPS", "Remaining Work & Plan")

    # Main Card
    add_card(slide, 1.2, 1.85, 10.9, 4.85, bg_color=CARD_BG, border_color=BORDER_COLOR)

    tb = slide.shapes.add_textbox(Inches(1.4), Inches(2.05), Inches(10.5), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True

    plan_items = [
        ("Frontend Component Testing:", "Expand automated test coverage from backend API tests (12/12 passing) to React component unit testing using Vitest and React Testing Library."),
        ("Cloud Production Deployment:", "Containerize the Node.js backend using Docker; deploy Express API to Render/AWS, host React SPA on Vercel, and migrate MongoDB to managed MongoDB Atlas."),
        ("LLM Plug-and-Play Swapping:", "Leverage the decoupled parser service architecture to optionally swap local NLP with Google Gemini 1.5 or OpenAI GPT-4o structured JSON outputs for contextual summaries."),
        ("Automated Candidate Email Alerts:", "Integrate Nodemailer or SendGrid webhooks for real-time transactional email notifications upon Kanban stage advancement and interview scheduling."),
        ("Advanced Interview Intelligence:", "Incorporate speech-to-text audio transcription and AI-generated technical interview questions tailored to candidate missing skill gaps."),
        ("Academic Documentation & Viva Voce:", "Finalize viva presentation defense slides, complete formal IEEE-formatted project documentation, and package demonstration sandboxes.")
    ]

    for i, (title, desc) in enumerate(plan_items):
        p = tf.add_paragraph() if i > 0 else tf.paragraphs[0]
        p.text = f"•  {title} "
        p.font.name = FONT_PRIMARY
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_DARK

        run = p.add_run()
        run.text = desc
        run.font.name = FONT_PRIMARY
        run.font.size = Pt(10.5)
        run.font.bold = False
        run.font.color.rgb = TEXT_BODY
        p.space_after = Pt(10)

    add_footer(slide, "Next Steps")


def build_slide_18_references(prs):
    """Slide 18: References (Academic Table)."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide, "16", "REFERENCES", "References")

    # Table: 7 rows (1 header + 6 data rows) x 3 columns
    table_shape = slide.shapes.add_table(7, 3, Inches(1.2), Inches(1.85), Inches(10.9), Inches(4.8))
    table = table_shape.table

    headers = ["#", "Reference Title, Authors & Source Documentation", "Domain / Usage"]
    col_widths = [0.6, 7.8, 2.5]
    format_table_headers(table, headers, col_widths, bg_color=PRIMARY_TEAL)

    refs_data = [
        ["1", "Meta Open Source — 'React 19 Documentation & Hooks Architecture', Meta Platforms Inc., 2026. https://react.dev", "Frontend User Interface"],
        ["2", "OpenJS Foundation — 'Node.js v20/22 LTS Runtime Environment Documentation', 2026. https://nodejs.org", "Server Runtime Environment"],
        ["3", "Express.js Project — 'Express 4.x RESTful Routing, Middleware & API Guide', 2026. https://expressjs.com", "Backend Web Framework"],
        ["4", "MongoDB Inc. — 'Mongoose ODM v9 Guide: Schemas, Middleware, and Aggregation', 2026. https://mongoosejs.com", "NoSQL Document Modeling"],
        ["5", "Natural Node Community — 'Natural: General Natural Language Facilities for NodeJS (TF-IDF & Stemming)', 2026. https://naturalnode.github.io/natural/", "NLP Semantic Relevance"],
        ["6", "Jurafsky, D., & Martin, J. H. — 'Speech and Language Processing: An Introduction to Natural Language Processing', 3rd Ed., Prentice Hall.", "Information Extraction & NLP"]
    ]

    format_table_cells(table, refs_data, row_height=0.68)
    add_footer(slide, "References")


# ==========================================================
# MAIN EXECUTION
# ==========================================================

def main():
    print("Initializing PowerPoint presentation...")
    prs = create_deck()

    print("Building Slide 1: Title Slide...")
    build_slide_1_title(prs)

    print("Building Slide 2: Agenda...")
    build_slide_2_agenda(prs)

    print("Building Slide 3: Functional & Non-Functional Requirements...")
    build_slide_3_requirements(prs)

    print("Building Slide 4: Detailed System Architecture...")
    build_slide_4_architecture(prs)

    print("Building Slide 5: Use Case Diagram...")
    build_slide_5_use_case(prs)

    print("Building Slide 6: ER Diagram / Database Design...")
    build_slide_6_er_diagram(prs)

    print("Building Slide 7: Module Description...")
    build_slide_7_modules(prs)

    print("Building Slide 8: Technology Stack...")
    build_slide_8_tech_stack(prs)

    print("Building Slide 9: UI Design / Wireframes...")
    build_slide_9_ui_design(prs)

    print("Building Slide 10: Frontend Development...")
    build_slide_10_frontend(prs)

    print("Building Slide 11: Backend Development...")
    build_slide_11_backend(prs)

    print("Building Slide 12: Database Integration...")
    build_slide_12_database(prs)

    print("Building Slide 13: API Development...")
    build_slide_13_api(prs)

    print("Building Slide 14: Module-wise Implementation Status...")
    build_slide_14_status(prs)

    print("Building Slide 15: Application Screenshots...")
    build_slide_15_screenshots(prs)

    print("Building Slide 16: Challenges Faced & Solutions...")
    build_slide_16_challenges(prs)

    print("Building Slide 17: Remaining Work & Plan...")
    build_slide_17_plan(prs)

    print("Building Slide 18: References...")
    build_slide_18_references(prs)

    prs.save(OUTPUT_FILE)
    print(f"\nSUCCESS! Presentation successfully saved to {OUTPUT_FILE}")
    print(f"Total Slides: {len(prs.slides)}")

if __name__ == '__main__':
    main()
