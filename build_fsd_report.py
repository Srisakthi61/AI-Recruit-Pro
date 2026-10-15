"""
build_fsd_report.py
Generates the complete, high-quality, professional college project report for:
Student: S. Srisakthi (Reg No: 310624205269)
Project: AI-Assisted Recruitment System
Degree: Bachelor of Technology (B.Tech.)
College: Easwari Engineering College (Autonomous)
College Location: Ramapuram, Chennai, Tamil Nadu – 600089
Department: Information Technology (IT)
Supervisor: Grandhi Sai Lakshmi (Assistant Professor / Project Supervisor)
HOD: Dr. Anandhi (Professor and Head of the Department)
Principal: Dr. P. Deiva Sundari
Submission: October 2026
"""

import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def add_callout_box(doc, text, title="NOTE"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    tbl.columns[0].width = Inches(6.2)
    cell = tbl.cell(0, 0)
    set_cell_background(cell, "F8FAFC")
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)

    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="none"/>
            <w:left w:val="single" w:sz="24" w:space="0" w:color="3B82F6"/>
            <w:bottom w:val="none"/>
            <w:right w:val="none"/>
        </w:tcBorders>
    ''')
    tcPr.append(borders)

    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    run_title = p.add_run(f"[{title}] ")
    run_title.font.name = "Times New Roman"
    run_title.font.size = Pt(10.5)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(30, 58, 138)

    run_text = p.add_run(text)
    run_text.font.name = "Times New Roman"
    run_text.font.size = Pt(10.5)
    run_text.font.color.rgb = RGBColor(30, 41, 59)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def add_code_block(doc, code_str, filename=""):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    tbl.columns[0].width = Inches(6.3)
    cell = tbl.cell(0, 0)
    set_cell_background(cell, "F1F5F9")
    set_cell_margins(cell, top=120, bottom=120, left=180, right=180)

    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
            <w:left w:val="single" w:sz="18" w:space="0" w:color="64748B"/>
            <w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
            <w:right w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
        </w:tcBorders>
    ''')
    tcPr.append(borders)

    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.05

    if filename:
        fn_run = p.add_run(f"// File: {filename}\n")
        fn_run.font.name = "Consolas"
        fn_run.font.size = Pt(9.5)
        fn_run.font.bold = True
        fn_run.font.color.rgb = RGBColor(71, 85, 105)

    code_run = p.add_run(code_str)
    code_run.font.name = "Consolas"
    code_run.font.size = Pt(9)
    code_run.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def add_custom_heading(doc, text, level=1):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.font.name = "Times New Roman"
    run.font.bold = True

    if level == 1:
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(16)
        p.paragraph_format.space_after = Pt(12)
        run.font.size = Pt(16)
        run.font.color.rgb = RGBColor(15, 23, 42)
    elif level == 2:
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(8)
        run.font.size = Pt(14)
        run.font.color.rgb = RGBColor(30, 41, 59)
    elif level == 3:
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(6)
        run.font.size = Pt(12)
        run.font.color.rgb = RGBColor(51, 65, 85)
    return p

def add_body_p(doc, text, bold_prefix=""):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.3
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.space_before = Pt(0)

    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = "Times New Roman"
        r_pre.font.size = Pt(12)
        r_pre.font.bold = True
        r_pre.font.color.rgb = RGBColor(15, 23, 42)

    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.color.rgb = RGBColor(30, 41, 59)
    return p

def add_bullet_p(doc, text, bold_title=""):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.line_spacing = 1.25
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.space_before = Pt(0)

    if bold_title:
        r_title = p.add_run(bold_title + " ")
        r_title.font.name = "Times New Roman"
        r_title.font.size = Pt(11.5)
        r_title.font.bold = True
        r_title.font.color.rgb = RGBColor(15, 23, 42)

    r_text = p.add_run(text)
    r_text.font.name = "Times New Roman"
    r_text.font.size = Pt(11.5)
    r_text.font.color.rgb = RGBColor(30, 41, 59)
    return p

def main():
    print("Generating updated official docx report...")
    doc = docx.Document()

    # Set page margins: Top 1", Bottom 1", Left 1.25", Right 1"
    section = doc.sections[0]
    section.top_margin = Inches(1.0)
    section.bottom_margin = Inches(1.0)
    section.left_margin = Inches(1.25)
    section.right_margin = Inches(1.0)

    # Configure Header & Footer with dynamic Word page numbering
    footer = section.footer
    f_p = footer.paragraphs[0]
    f_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    f_run = f_p.add_run()
    f_fld1 = parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls('w'))
    f_instr = parse_xml(r'<w:instrText %s xml:space="preserve"> PAGE </w:instrText>' % nsdecls('w'))
    f_fld2 = parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls('w'))
    f_fld3 = parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls('w'))
    f_run._r.append(f_fld1)
    f_run._r.append(f_instr)
    f_run._r.append(f_fld2)
    f_run._r.append(f_fld3)
    f_run.font.name = 'Times New Roman'
    f_run.font.size = Pt(10)
    f_run.font.color.rgb = RGBColor(100, 116, 139)

    # ==========================================
    # PRELIMINARY PAGE 1: COVER PAGE
    # ==========================================
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(36)
    p_title.paragraph_format.space_after = Pt(18)
    r = p_title.add_run("AI-ASSISTED RECRUITMENT SYSTEM")
    r.font.name = "Times New Roman"
    r.font.size = Pt(20)
    r.font.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(12)
    p_sub.paragraph_format.space_after = Pt(24)
    r = p_sub.add_run("A MINI PROJECT REPORT")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = RGBColor(71, 85, 105)

    p_by = doc.add_paragraph()
    p_by.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_by.paragraph_format.space_after = Pt(8)
    r = p_by.add_run("Submitted by")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.italic = True

    p_author = doc.add_paragraph()
    p_author.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_author.paragraph_format.space_after = Pt(28)
    r = p_author.add_run("S. SRISAKTHI (310624205269)")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True

    p_degree = doc.add_paragraph()
    p_degree.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_degree.paragraph_format.line_spacing = 1.3
    p_degree.paragraph_format.space_after = Pt(40)
    r = p_degree.add_run("in partial fulfillment for the award of the Degree\nof\n")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r2 = p_degree.add_run("BACHELOR OF TECHNOLOGY (B.Tech.)\n")
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(14)
    r2.font.bold = True
    r3 = p_degree.add_run("in\nINFORMATION TECHNOLOGY")
    r3.font.name = "Times New Roman"
    r3.font.size = Pt(13)
    r3.font.bold = True

    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.line_spacing = 1.25
    p_inst.paragraph_format.space_after = Pt(36)
    r = p_inst.add_run("EASWARI ENGINEERING COLLEGE (AUTONOMOUS)\n")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True
    r2 = p_inst.add_run("AFFILIATED TO ANNA UNIVERSITY, CHENNAI\nRAMAPURAM, CHENNAI, TAMIL NADU – 600089")
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(11)

    p_date = doc.add_paragraph()
    p_date.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_date.paragraph_format.space_before = Pt(16)
    r = p_date.add_run("OCTOBER 2026")
    r.font.name = "Times New Roman"
    r.font.size = Pt(13)
    r.font.bold = True

    doc.add_page_break()

    # ==========================================
    # PRELIMINARY PAGE 2: BONAFIDE CERTIFICATE
    # ==========================================
    p_c_head = doc.add_paragraph()
    p_c_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c_head.paragraph_format.space_before = Pt(16)
    p_c_head.paragraph_format.space_after = Pt(4)
    r = p_c_head.add_run("EASWARI ENGINEERING COLLEGE (AUTONOMOUS)\n")
    r.font.name = "Times New Roman"
    r.font.size = Pt(15)
    r.font.bold = True
    r2 = p_c_head.add_run("(Affiliated to Anna University, Chennai)\nBharathi Salai, Ramapuram, Chennai, Tamil Nadu – 600089\nDEPARTMENT OF INFORMATION TECHNOLOGY")
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(11)

    p_bon = doc.add_paragraph()
    p_bon.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_bon.paragraph_format.space_before = Pt(28)
    p_bon.paragraph_format.space_after = Pt(22)
    r = p_bon.add_run("BONAFIDE CERTIFICATE")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True
    r.underline = True

    add_body_p(doc,
        "Certified that this mini project report titled “AI-ASSISTED RECRUITMENT SYSTEM” is the "
        "Bonafide work of “S. SRISAKTHI (310624205269)”, who carried out the project work under "
        "my supervision in partial fulfillment of the requirements for the award of the Degree of "
        "Bachelor of Technology (B.Tech.) in Information Technology at Easwari Engineering College (Autonomous), "
        "Ramapuram, Chennai, Tamil Nadu – 600089, during the academic year 2026."
    )

    p_sig_space = doc.add_paragraph()
    p_sig_space.paragraph_format.space_before = Pt(65)

    # 2-column table for HOD and Supervisor signatures
    sig_tbl = doc.add_table(rows=1, cols=2)
    sig_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_tbl.autofit = False
    sig_tbl.columns[0].width = Inches(3.2)
    sig_tbl.columns[1].width = Inches(3.2)

    c_hod = sig_tbl.cell(0, 0)
    c_sup = sig_tbl.cell(0, 1)

    p_hod = c_hod.paragraphs[0]
    p_hod.paragraph_format.line_spacing = 1.2
    r = p_hod.add_run("HEAD OF THE DEPARTMENT\n\n\n\n\n")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True
    r2 = p_hod.add_run("Dr. Anandhi\n")
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(12)
    r2.font.bold = True
    r3 = p_hod.add_run("Professor and Head of the Department\nDepartment of Information Technology\nEaswari Engineering College (Autonomous)\nRamapuram, Chennai, Tamil Nadu – 600089")
    r3.font.name = "Times New Roman"
    r3.font.size = Pt(10.5)

    p_sup = c_sup.paragraphs[0]
    p_sup.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_sup.paragraph_format.line_spacing = 1.2
    r = p_sup.add_run("SUPERVISOR\n\n\n\n\n")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True
    r2 = p_sup.add_run("Grandhi Sai Lakshmi\n")
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(12)
    r2.font.bold = True
    r3 = p_sup.add_run("Assistant Professor / Project Supervisor\nDepartment of Information Technology\nEaswari Engineering College (Autonomous)\nRamapuram, Chennai, Tamil Nadu – 600089")
    r3.font.name = "Times New Roman"
    r3.font.size = Pt(10.5)

    doc.add_page_break()

    # ==========================================
    # PRELIMINARY PAGE 3: CERTIFICATE OF VIVA-VOCE EXAMINATION
    # ==========================================
    p_v_head = doc.add_paragraph()
    p_v_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_v_head.paragraph_format.space_before = Pt(16)
    p_v_head.paragraph_format.space_after = Pt(4)
    r = p_v_head.add_run("EASWARI ENGINEERING COLLEGE (AUTONOMOUS)\n")
    r.font.name = "Times New Roman"
    r.font.size = Pt(15)
    r.font.bold = True
    r2 = p_v_head.add_run("Ramapuram, Chennai, Tamil Nadu – 600089\nDEPARTMENT OF INFORMATION TECHNOLOGY")
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(11)

    p_viva = doc.add_paragraph()
    p_viva.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_viva.paragraph_format.space_before = Pt(28)
    p_viva.paragraph_format.space_after = Pt(22)
    r = p_viva.add_run("Certificate of Viva-Voce Examination")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True
    r.underline = True

    add_body_p(doc,
        "This is to certify that the Viva-Voce Examination of the Project Work entitled "
        "“AI-ASSISTED RECRUITMENT SYSTEM” submitted by Ms. S. Srisakthi (Reg. No. 310624205269) "
        "in partial fulfillment of the requirements for the award of the degree of Bachelor of "
        "Technology (B.Tech.) in Information Technology was conducted on ________________ (Date) in the "
        "Department of Information Technology, Easwari Engineering College (Autonomous), Ramapuram, Chennai, Tamil Nadu – 600089."
    )

    p_viva_space = doc.add_paragraph()
    p_viva_space.paragraph_format.space_before = Pt(70)

    viva_tbl = doc.add_table(rows=1, cols=2)
    viva_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    viva_tbl.autofit = False
    viva_tbl.columns[0].width = Inches(3.2)
    viva_tbl.columns[1].width = Inches(3.2)

    c_int = viva_tbl.cell(0, 0)
    c_ext = viva_tbl.cell(0, 1)

    p_int = c_int.paragraphs[0]
    p_int.paragraph_format.line_spacing = 1.25
    r = p_int.add_run("Internal Examiner\n\n\n\n")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True
    r2 = p_int.add_run("Name: ______________________\nDesignation: ________________\nAddress: ____________________\nEaswari Engineering College\nChennai – 600089\n\nSignature: _________________")
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(10.5)

    p_ext = c_ext.paragraphs[0]
    p_ext.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_ext.paragraph_format.line_spacing = 1.25
    r = p_ext.add_run("External Examiner\n\n\n\n")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True
    r2 = p_ext.add_run("Name: ______________________\nDesignation: ________________\nAddress: ____________________\nAnna University / EEC\nChennai – 600089\n\nSignature: _________________")
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(10.5)

    p_date_v = doc.add_paragraph()
    p_date_v.paragraph_format.space_before = Pt(30)
    r = p_date_v.add_run("Date: ________________________\nPlace: Chennai, Tamil Nadu")
    r.font.name = "Times New Roman"
    r.font.size = Pt(11.5)

    doc.add_page_break()

    # ==========================================
    # PRELIMINARY PAGE 4: ABSTRACT
    # ==========================================
    add_custom_heading(doc, "ABSTRACT", level=1)

    add_body_p(doc,
        "In the contemporary landscape of high-velocity corporate talent acquisition, human resource "
        "departments and technical recruiters face unprecedented challenges when screening and evaluating "
        "voluminous application pools. Traditional resume screening processes are predominantly manual, "
        "exceptionally labor-intensive, vulnerable to cognitive fatigue, and susceptible to unconscious human bias. "
        "Moreover, rudimentary applicant tracking systems (ATS) frequently rely on strict, naive keyword matching "
        "which disproportionately penalizes qualified candidates who use differing terminologies or formats while "
        "rewarding keyword stuffing. To resolve these operational limitations, this Full Stack Development (FSD) "
        "project presents the design, architectural engineering, and full implementation of an enterprise-grade, "
        "intelligent automated recruitment platform entitled AI-Assisted Recruitment System (AI Recruit Pro)."
    )

    add_body_p(doc,
        "Engineered on the modern MERN stack architecture—incorporating MongoDB, Express.js, React 19, "
        "and Node.js—the platform establishes a cohesive, end-to-end recruitment lifecycle spanning public career "
        "portals, modular natural language processing (NLP) resume ingestion, multi-factor candidate-job compatibility "
        "evaluation, interactive candidate shortlisting pipelines, and collaborative interview scheduling. "
        "The system incorporates an extensible resume ingestion service supporting multi-format document parsing "
        "(PDF, DOCX, and TXT) via pdf-parse and mammoth libraries. Extracted textual content is processed through "
        "rule-based NLP entity recognizers and a curated taxonomy of over 500 technical and domain skills to capture "
        "candidate contact details, total years of work experience, degree classifications, and granular technical capabilities."
    )

    add_body_p(doc,
        "Central to the platform is a deterministic, multi-factor AI matching and ranking engine that eliminates "
        "black-box ambiguity. Candidate suitability against job requisitions is evaluated using a mathematically grounded "
        "weighted formula: 50% technical skills overlap (incorporating synonym dictionaries and supplementary capability bonuses), "
        "25% professional experience duration fit, 15% academic degree hierarchy alignment, and 10% semantic textual relevance "
        "calculated using Term Frequency-Inverse Document Frequency (TF-IDF). Candidates are classified into distinct "
        "actionable tiers (Strong Match, Good Match, Potential Match, and Low Match) accompanied by transparent narrative "
        "summaries detailing exact matching and missing requirements."
    )

    add_body_p(doc,
        "To streamline recruiter workflows, the platform provides an interactive 6-stage Kanban recruitment pipeline "
        "(Applied, Screened, Shortlisted, Interview Scheduled, Selected, and Rejected) featuring audit logging and "
        "integrated interview coordination with calendar and video conferencing parameters. Role-Based Access Control (RBAC) "
        "backed by JSON Web Tokens (JWT) and Bcrypt password hashing ensures rigorous data isolation between hiring "
        "managers and job seekers. The implementation has been rigorously verified through an automated end-to-end "
        "backend integration test suite achieving a 100% pass rate (12/12 test assertions), demonstrating robust reliability, "
        "sub-second parsing throughput, and transparent decision intelligence."
    )

    p_kw = doc.add_paragraph()
    p_kw.paragraph_format.space_before = Pt(12)
    r_kwt = p_kw.add_run("Keywords: ")
    r_kwt.font.name = "Times New Roman"
    r_kwt.font.size = Pt(11.5)
    r_kwt.font.bold = True
    r_kw = p_kw.add_run("Full Stack Development, MERN Stack, AI-Assisted Recruitment, NLP Resume Parsing, TF-IDF Semantic Scoring, Multi-Factor Matching, Kanban Pipeline, Role-Based Access Control.")
    r_kw.font.name = "Times New Roman"
    r_kw.font.size = Pt(11.5)
    r_kw.font.italic = True

    doc.add_page_break()

    # ==========================================
    # PRELIMINARY PAGE 5: ACKNOWLEDGEMENT
    # ==========================================
    add_custom_heading(doc, "ACKNOWLEDGEMENT", level=1)

    add_body_p(doc,
        "We express our sincere gratitude to the Principal, Dr. P. Deiva Sundari, and the Management of "
        "Easwari Engineering College (Autonomous), Ramapuram, Chennai, Tamil Nadu – 600089, for providing us with "
        "the opportunity, advanced infrastructural facilities, and conducive academic environment to carry out this "
        "Full Stack Development mini project work successfully."
    )

    add_body_p(doc,
        "We convey our heartfelt thanks to the Head of the Department, Dr. Anandhi, Professor and Head of the "
        "Department, Department of Information Technology, for her visionary leadership, constant encouragement, "
        "valuable suggestions, and continuous support throughout the duration of this academic endeavor."
    )

    add_body_p(doc,
        "We are extremely thankful and deeply indebted to our Project Supervisor, Grandhi Sai Lakshmi, "
        "Assistant Professor / Project Supervisor, Department of Information Technology, for her invaluable guidance, "
        "rigorous technical critique, motivational support, and patience throughout the conceptualization, system "
        "modeling, implementation, and documentation phases of this project."
    )

    add_body_p(doc,
        "We would also like to extend our sincere gratitude to all the faculty members and technical staff "
        "of the Department of Information Technology for their cooperation, technical feedback, and academic assistance."
    )

    add_body_p(doc,
        "Finally, we express our profound gratitude to our parents, family members, and friends for their constant "
        "encouragement, understanding, moral support, and unwavering faith during the completion of this project."
    )

    p_ack_sign = doc.add_paragraph()
    p_ack_sign.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_ack_sign.paragraph_format.space_before = Pt(36)
    r = p_ack_sign.add_run("S. SRISAKTHI\n(Reg. No. 310624205269)")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True

    doc.add_page_break()

    # ==========================================
    # PRELIMINARY PAGE 6: TABLE OF CONTENTS
    # ==========================================
    add_custom_heading(doc, "TABLE OF CONTENTS", level=1)

    toc_tbl = doc.add_table(rows=1, cols=3)
    toc_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    toc_tbl.autofit = False
    toc_tbl.columns[0].width = Inches(1.5)
    toc_tbl.columns[1].width = Inches(4.0)
    toc_tbl.columns[2].width = Inches(0.8)

    hdr_cells = toc_tbl.rows[0].cells
    hdr_cells[0].text = "CHAPTER NO."
    hdr_cells[1].text = "TITLE"
    hdr_cells[2].text = "PAGE NO."

    for i, c in enumerate(hdr_cells):
        set_cell_background(c, "E2E8F0")
        set_cell_margins(c, top=80, bottom=80, left=100, right=100)
        p = c.paragraphs[0]
        p.runs[0].font.name = "Times New Roman"
        p.runs[0].font.size = Pt(11)
        p.runs[0].font.bold = True
        if i == 2:
            p.alignment = WD_ALIGN_PARAGRAPH.RIGHT

    toc_items = [
        ("", "BONAFIDE CERTIFICATE", "ii"),
        ("", "CERTIFICATE OF VIVA-VOCE EXAMINATION", "iii"),
        ("", "ABSTRACT", "iv"),
        ("", "ACKNOWLEDGEMENT", "v"),
        ("1", "INTRODUCTION", "1"),
        ("1.1", "Overview", "1"),
        ("1.2", "Problem Definition", "2"),
        ("1.3", "Objective", "3"),
        ("1.4", "Scope of the Project", "4"),
        ("1.5", "Motivation", "5"),
        ("2", "RELATED WORK", "6"),
        ("2.1", "Literature Review", "6"),
        ("2.2", "Existing System", "8"),
        ("2.3", "Proposed System", "9"),
        ("3", "SYSTEM ANALYSIS", "11"),
        ("3.1", "System Requirements", "11"),
        ("3.2", "Software and Hardware Requirements", "13"),
        ("4", "SYSTEM DESIGN", "15"),
        ("4.1", "System Architecture", "15"),
        ("4.2", "Module Description", "17"),
        ("4.4", "Class Diagram", "20"),
        ("4.5", "Sequence Diagram", "22"),
        ("5", "IMPLEMENTATION", "24"),
        ("5.1", "Implementation Overview", "24"),
        ("5.2", "Key Functions (Code Explanation)", "26"),
        ("6", "CONCLUSION & FUTURE WORK", "31"),
        ("6.1", "Conclusion", "31"),
        ("6.2", "Future Enhancements", "32"),
        ("", "APPENDIX: SOURCE CODE", "34"),
        ("1", "Project Structure", "34"),
        ("2", "Backend Package Installation", "35"),
        ("3", "Database Connection", "35"),
        ("4", "Environment Variables", "36"),
        ("5", "User Model", "36"),
        ("6", "Password Hashing and Registration", "37"),
        ("7", "Login and JWT Generation", "38"),
        ("8", "Authentication Middleware", "39"),
        ("9", "Create API", "40"),
        ("10", "Read API", "41"),
        ("11", "Update", "42"),
        ("12", "Delete", "43"),
        ("13", "Express Routes", "44"),
        ("14", "Main Server File", "45"),
        ("15", "React Login Component", "46"),
        ("16", "Admin Dashboard Logic", "47"),
        ("17", "REST API Request and Response Examples", "48"),
        ("", "SCREENSHOTS OF THE PROJECT", "51"),
        ("", "REFERENCES", "58"),
    ]

    for ch, title, pg in toc_items:
        row = toc_tbl.add_row()
        c0, c1, c2 = row.cells
        set_cell_margins(c0, top=40, bottom=40, left=60, right=60)
        set_cell_margins(c1, top=40, bottom=40, left=60, right=60)
        set_cell_margins(c2, top=40, bottom=40, left=60, right=60)

        p0 = c0.paragraphs[0]
        p0.paragraph_format.line_spacing = 1.15
        r0 = p0.add_run(ch)
        r0.font.name = "Times New Roman"
        r0.font.size = Pt(10.5)
        if ch.isdigit() or ch == "":
            r0.font.bold = True

        p1 = c1.paragraphs[0]
        p1.paragraph_format.line_spacing = 1.15
        r1 = p1.add_run(title)
        r1.font.name = "Times New Roman"
        r1.font.size = Pt(10.5)
        if ch.isdigit() or (ch == "" and pg != ""):
            r1.font.bold = True

        p2 = c2.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p2.paragraph_format.line_spacing = 1.15
        r2 = p2.add_run(pg)
        r2.font.name = "Times New Roman"
        r2.font.size = Pt(10.5)
        if ch.isdigit() or ch == "":
            r2.font.bold = True

    doc.add_page_break()

    # ==========================================
    # CHAPTER 1: INTRODUCTION
    # ==========================================
    add_custom_heading(doc, "CHAPTER 1\nINTRODUCTION", level=1)

    add_custom_heading(doc, "1.1 OVERVIEW", level=2)
    add_body_p(doc,
        "In the contemporary global economy, talent acquisition constitutes one of the most vital strategic "
        "pillars determining organizational velocity, innovation capacity, and competitive differentiation. "
        "However, human resource (HR) practitioners and technical recruitment teams are increasingly overwhelmed "
        "by exponential surges in applicant volumes. Driven by the proliferation of remote employment, professional "
        "networking networks, and one-click application portals, a single advertised software engineering position "
        "frequently attracts hundreds, or even thousands, of resumes from across the globe."
    )
    add_body_p(doc,
        "Evaluating this influx using conventional manual screening methodologies has become fundamentally untenable. "
        "Manual review requires human recruiters to spend between 30 and 120 seconds per curriculum vitae (CV) scanning "
        "for relevant education, job titles, technical proficiencies, and project accomplishments. Over extended sessions, "
        "cognitive fatigue inevitably degrades review consistency, resulting in arbitrary exclusions, unconscious cognitive "
        "biases, and prolonged hiring cycles. Conversely, traditional Applicant Tracking Systems (ATS) commonly rely on "
        "primitive, rigid string-matching heuristics. These legacy filters either reject highly qualified candidates whose "
        "resumes employ synonymous terminologies (e.g., dismissing “PostgreSQL” when querying for “Relational Database Management”) "
        "or reward disingenuous applicants who engage in keyword-stuffing techniques."
    )
    add_body_p(doc,
        "To decisively overcome these operational and technical vulnerabilities, this Full Stack Development (FSD) "
        "project presents the design, full-stack implementation, and formal empirical evaluation of the AI-Assisted "
        "Recruitment System (branded as AI Recruit Pro). Developed entirely upon the modern MERN stack architecture—incorporating "
        "MongoDB, Express.js, React 19, and Node.js—the platform establishes a cohesive, end-to-end talent intelligence "
        "ecosystem. It unifies modular document parsing, rule-based natural language processing (NLP), deterministic multi-factor "
        "candidate-job scoring, interactive 6-stage Kanban pipeline orchestration, and automated interview scheduling into a "
        "single, highly performant web application."
    )

    add_custom_heading(doc, "1.2 PROBLEM DEFINITION", level=2)
    add_body_p(doc,
        "The critical technical and operational problems addressed by this project encompass the following dimensions:"
    )
    add_bullet_p(doc,
        "Due to the sheer scale of digital submissions, recruiters experience severe cognitive overload, taking weeks to "
        "manually filter resumes and causing critical candidate drop-off.",
        "1. Excessive Time-to-Hire and Inefficient Resume Screening:"
    )
    add_bullet_p(doc,
        "First-generation Applicant Tracking Systems rely on exact Boolean keyword searches. They lack semantic comprehension, "
        "failing to recognize aliases (e.g., equating 'Node.js' with 'Node' or 'K8s' with 'Kubernetes') and disqualifying capable talent.",
        "2. Algorithmic Inflexibility and Naive Keyword Matching:"
    )
    add_bullet_p(doc,
        "Many emerging AI recruitment tools utilize opaque deep learning or closed black-box models that generate arbitrary scores "
        "without justifiable audit trails, raising compliance, fairness, and interpretability concerns.",
        "3. Opacity and Black-Box AI Decision Making:"
    )
    add_bullet_p(doc,
        "In typical organizations, resume ingestion, candidate evaluation, interview scheduling, and team communications exist across "
        "disparate, disconnected tools (spreadsheets, email inboxes, calendar software), introducing data fragmentation and workflow friction.",
        "4. Disconnected Candidate Management Pipelines:"
    )
    add_bullet_p(doc,
        "Job seekers submit resumes into an informational void, receiving no actionable feedback regarding matching skill competencies, "
        "missing prerequisite qualifications, or application progression.",
        "5. Absence of Transparent Candidate Experience:"
    )

    add_custom_heading(doc, "1.3 OBJECTIVE", level=2)
    add_body_p(doc,
        "The primary objective of this project is to architect, build, and validate a comprehensive, reactive, and "
        "explainable full-stack recruitment platform. Specific technical objectives include:"
    )
    add_bullet_p(doc,
        "Construct an asynchronous Node.js micro-service capable of ingesting PDF, DOCX, and TXT files, extracting raw text and "
        "normalizing structured entities including candidate contact metadata, technical proficiencies, work duration, and academic credentials.",
        "• Modular Multi-Format Resume Ingestion:"
    )
    add_bullet_p(doc,
        "Develop a multi-tier matching engine that computes an overall compatibility index based on four weighted factors: "
        "50% Technical Skills overlap, 25% Experience duration fit, 15% Education degree alignment, and 10% Semantic TF-IDF similarity.",
        "• Multi-Factor Deterministic Compatibility Scoring:"
    )
    add_bullet_p(doc,
        "Deliver clear, human-auditable insights for every candidate evaluation, highlighting matched skills, missing essential criteria, "
        "experience surplus/deficit, and recommendation classifications (Strong Match, Good Match, Potential Match, Low Match).",
        "• Explainable AI Recommendations:"
    )
    add_bullet_p(doc,
        "Provide recruiters with a visual 6-stage Kanban board (Applied -> Screened -> Shortlisted -> Interview Scheduled -> Selected -> Rejected) "
        "with stage transition history, audit notes, and integrated interview scheduling.",
        "• Interactive 6-Stage Pipeline Management:"
    )
    add_bullet_p(doc,
        "Enforce strict role-based data partitioning between recruiters and candidates utilizing JSON Web Tokens (JWT) and Bcrypt "
        "cryptographic password hashing.",
        "• Secure Role-Based Authorization & Dashboards:"
    )

    add_custom_heading(doc, "1.4 SCOPE OF THE PROJECT", level=2)
    add_body_p(doc,
        "The scope of the AI-Assisted Recruitment System encompasses both backend services and rich frontend user interfaces:"
    )
    add_bullet_p(doc,
        "Recruiters can publish, update, filter, and close detailed job listings containing required/optional skill sets, experience bounds, "
        "degree requirements, and compensation bands.",
        "• Job Requisition Life Cycle:"
    )
    add_bullet_p(doc,
        "Job seekers can register, upload resumes in PDF/DOCX formats, review auto-extracted profile JSON representations, browse active listings, "
        "and submit one-click applications.",
        "• Candidate Self-Service Portal:"
    )
    add_bullet_p(doc,
        "Automatic evaluation of applicants against job criteria upon application submission or recruiter ranking request, with dynamic rank-ordered displays.",
        "• Real-Time Fit Analysis:"
    )
    add_bullet_p(doc,
        "Facilitating stage transitions across the 6 Kanban columns, scheduling interviews with virtual meeting URLs (Google Meet / Zoom), "
        "assigning interviewers, and recording recruiter notes.",
        "• Pipeline & Interview Coordination:"
    )
    add_bullet_p(doc,
        "Providing aggregated analytics on total jobs, active applicant counts, stage distribution, and average match percentages.",
        "• Executive Metrics & Dashboards:"
    )
    add_body_p(doc,
        "Project Boundary & Assumptions: The platform focuses on undergraduate and enterprise engineering hiring. While the current NLP parser "
        "operates deterministically using compromise and natural, its service interface is strictly decoupled to enable seamless replacement with "
        "large language model (LLM) APIs (e.g., Google Gemini or OpenAI GPT-4o) without altering database models or UI contracts."
    )

    add_custom_heading(doc, "1.5 MOTIVATION", level=2)
    add_body_p(doc,
        "The inspiration for engineering the AI-Assisted Recruitment System arises from acute systemic pain points observed "
        "in collegiate placements and corporate tech recruitment. Qualified student engineers frequently invest extensive effort into "
        "tailoring resumes, only to be rejected without explanation by impersonal keyword filters. Simultaneously, placement officers "
        "and hiring managers are forced to navigate hundreds of unstructured documents without cohesive prioritization tools."
    )
    add_body_p(doc,
        "By merging modern full-stack web engineering (React 19, Tailwind CSS, Express, MongoDB) with transparent, rule-driven natural "
        "language processing, this project demonstrates that recruitment automation can achieve high computational throughput while "
        "preserving complete fairness, explainability, and human agency in talent decision-making."
    )

    doc.add_page_break()

    # ==========================================
    # CHAPTER 2: RELATED WORK
    # ==========================================
    add_custom_heading(doc, "CHAPTER 2\nRELATED WORK", level=1)

    add_custom_heading(doc, "2.1 LITERATURE REVIEW", level=2)
    add_body_p(doc,
        "The scientific literature underlying automated talent evaluation, natural language processing, cryptographic security, "
        "and reactive full-stack web architectures provides the theoretical foundation for this system:"
    )

    add_body_p(doc,
        "Salton and Buckley (1988) [1] established the foundational mathematics of Term Frequency-Inverse Document Frequency (TF-IDF) "
        "for automatic text retrieval. Their work demonstrated that evaluating term frequency normalized by document frequency effectively "
        "dampens generic high-frequency vocabulary while highlighting domain-specific keywords. In the AI-Assisted Recruitment System, "
        "this vector-space model is implemented via the natural NLP library to assess contextual textual affinity between job descriptions "
        "and candidate profile summaries, mitigating the vulnerability of raw keyword counts.",
        bold_prefix="1. Term-Weighting Approaches in Automatic Text Retrieval (Salton & Buckley, 1988) [1]: "
    )

    add_body_p(doc,
        "Jurafsky and Martin (2023) [2] comprehensively analyzed computational linguistic methods for information extraction and entity recognition. "
        "Their research proved that domain-specific shallow parsing combined with rule-based regular expression tokenization and curated "
        "taxonomies provides high precision and rapid execution in semi-structured domains like resumes. This principle guides our modular "
        "NLP resume parser, which scans extracted text against 500+ curated technical and soft skill taxonomies with boundary-aware pattern matching.",
        bold_prefix="2. Information Extraction & Taxonomy-Based Named Entity Recognition (Jurafsky & Martin, 2023) [2]: "
    )

    add_body_p(doc,
        "Tilkov and Vinoski (2010) [3] analyzed the architectural performance of Node.js for high-concurrency network programs. Their study "
        "demonstrated that Node's single-threaded event loop and asynchronous, non-blocking I/O model drastically reduce memory footprints "
        "and latency compared to thread-per-request architectures when executing I/O-intensive document parsing and database queries, "
        "making it ideal for our backend REST services.",
        bold_prefix="3. Asynchronous Non-Blocking Microservices (Tilkov & Vinoski, 2010) [3]: "
    )

    add_body_p(doc,
        "Provos and Mazières (1999) [5] introduced the Bcrypt adaptive cryptographic hash function based on the Blowfish cipher. They established "
        "that password hashing schemes must incorporate an adjustable iteration work factor (salt rounds) to remain resilient against hardware-accelerated "
        "brute-force and precomputed rainbow-table attacks. The user authentication module of our system adheres to this principle, applying 10 salt rounds "
        "in Mongoose pre-save hooks.",
        bold_prefix="4. Adaptive Cryptographic Password Storage (Provos & Mazières, 1999) [5]: "
    )

    add_body_p(doc,
        "Jones, Bradley, and Sakimura (RFC 7519, 2015) [4] formalized the JSON Web Token (JWT) open standard for representing claims securely between "
        "parties. Their specification proved that compact, URL-safe, digitally signed tokens eliminate server-side session state overhead while "
        "enabling strict Role-Based Access Control (RBAC) across distributed web architectures.",
        bold_prefix="5. Stateless Bearer Token Authorization (Jones et al., RFC 7519, 2015) [4]: "
    )

    add_body_p(doc,
        "Chodorow (2020) [6] detailed design patterns for document-oriented databases utilizing MongoDB. The author established that flexible BSON "
        "documents naturally map to deeply nested object hierarchies—such as work experience arrays, education histories, and stage transition audit logs—"
        "providing superior read/write throughput and schema evolution over rigid relational schemas.",
        bold_prefix="6. Document-Oriented Schema Design and Scalable Storage (Chodorow, 2020) [6]: "
    )

    add_custom_heading(doc, "2.2 EXISTING SYSTEM", level=2)
    add_body_p(doc,
        "Existing talent recruitment systems typically fall into two categories: manual legacy workflows or commercial, proprietary enterprise ATS platforms."
    )
    add_body_p(doc,
        "In manual workflows, hiring teams collect resumes through generic email addresses or basic web forms. Candidate resumes are downloaded and "
        "manually tracked across disconnected spreadsheet files. Resumes are reviewed ad-hoc, with evaluation notes jotted down informally. Interview "
        "scheduling requires extensive back-and-forth manual emailing. This approach is acutely prone to data loss, offers zero automated ranking, and "
        "imposes severe latency on candidate response times."
    )
    add_body_p(doc,
        "Commercial enterprise ATS platforms (e.g., Workday, Taleo, Greenhouse) provide centralized databases but present severe technical drawbacks:"
    )
    add_bullet_p(doc, "High licensing costs that are cost-prohibitive for small-to-medium enterprises and educational institutions.", "• Cost Prohibitive:")
    add_bullet_p(doc, "Rigid Boolean search filters that penalize legitimate candidates due to minor phrasing variances.", "• Inflexible Keyword Filtering:")
    add_bullet_p(doc, "Opaque scoring metrics that fail to disclose to recruiters or candidates why an applicant was ranked at a specific tier.", "• Lack of Transparency:")
    add_bullet_p(doc, "Clunky, slow user interfaces that lack reactive drag-and-drop or column-based candidate pipeline visualization.", "• Monolithic User Experience:")

    add_custom_heading(doc, "2.3 PROPOSED SYSTEM", level=2)
    add_body_p(doc,
        "The proposed AI-Assisted Recruitment System (AI Recruit Pro) solves these limitations by implementing a modern, open-source, full-stack "
        "recruitment architecture with explainable artificial intelligence. Key highlights of the proposed system include:"
    )
    add_bullet_p(doc,
        "Accepts resumes in PDF, DOCX, and TXT formats. Utilizes headless text extractors and rule-based NLP to accurately parse names, emails, "
        "phone numbers, portfolios, degrees, total experience, and 500+ technical skills into structured JSON.",
        "1. Automated Ingestion & Extraction:"
    )
    add_bullet_p(doc,
        "Employs a transparent, four-factor scoring equation (50% Skills, 25% Experience, 15% Education, 10% TF-IDF Semantic Fit) with synonym expansion "
        "and supplementary skill bonuses.",
        "2. Deterministic, Explainable Matching Engine:"
    )
    add_bullet_p(doc,
        "Provides clear categorization into Strong, Good, Potential, or Low Match tiers with detailed lists of matched vs. missing skills.",
        "3. Actionable Fit Insights:"
    )
    add_bullet_p(doc,
        "Features an interactive 6-stage Kanban board (Applied -> Screened -> Shortlisted -> Interview Scheduled -> Selected -> Rejected) with "
        "audit history tracking and integrated interview coordination.",
        "4. Modern Reactive Kanban Pipeline:"
    )
    add_bullet_p(doc,
        "Enforces strict JWT-authenticated role-based access control, isolating recruiter administrative capabilities from candidate portals.",
        "5. Secure Role-Based Architecture:"
    )

    doc.add_page_break()

    # ==========================================
    # CHAPTER 3: SYSTEM ANALYSIS
    # ==========================================
    add_custom_heading(doc, "CHAPTER 3\nSYSTEM ANALYSIS", level=1)

    add_custom_heading(doc, "3.1 SYSTEM REQUIREMENTS", level=2)
    add_body_p(doc,
        "A rigorous system analysis was conducted to elicit and categorize the functional and non-functional requirements "
        "governing the AI-Assisted Recruitment System platform."
    )

    add_custom_heading(doc, "3.1.1 Functional Requirements", level=3)
    add_bullet_p(doc,
        "The system shall provide registration and login endpoints supporting Recruiter and Candidate roles. Passwords must be hashed "
        "using Bcrypt with 10 salt rounds. Sessions must be authorized using signed JSON Web Tokens (JWT) with 7-day validity.",
        "• FR-01: User Authentication & Role Management:"
    )
    add_bullet_p(doc,
        "Recruiters shall have full CRUD permissions over job postings, specifying title, department, location, employment type, description, "
        "required skills, optional skills, experience bounds (min/max), education requirements, and salary ranges. Candidates can query and filter jobs.",
        "• FR-02: Job Requisition Management:"
    )
    add_bullet_p(doc,
        "The system shall accept multipart file uploads (PDF, DOCX, TXT up to 10MB) and raw text. The parser must extract contact info, "
        "work duration, degree, and technical/soft skills into structured CandidateProfile documents.",
        "• FR-03: Resume File Ingestion & NLP Parsing:"
    )
    add_bullet_p(doc,
        "Upon application submission or recruiter ranking query, the system shall evaluate the candidate against the target job using the weighted formula "
        "(50% Skills, 25% Experience, 15% Education, 10% Semantic Fit) and persist matchAnalysis data.",
        "• FR-04: Multi-Factor Compatibility Scoring:"
    )
    add_bullet_p(doc,
        "Recruiters shall be able to view all applicants for a job structured across 6 stages (Applied, Screened, Shortlisted, Interview Scheduled, "
        "Selected, Rejected), move candidates between stages, and append audit notes.",
        "• FR-05: Kanban Recruitment Pipeline:"
    )
    add_bullet_p(doc,
        "Recruiters shall be able to assign interview dates, round types (Technical, HR, System Design, etc.), meeting links (Google Meet/Zoom), "
        "and preparation notes to shortlisted candidates.",
        "• FR-06: Interview Scheduling Coordination:"
    )
    add_bullet_p(doc,
        "Recruiter dashboard shall display aggregate metrics: total jobs, active jobs, applicant counts, shortlisted counts, interviews scheduled, "
        "average match score, and stage distributions. Candidate dashboard shall display application status and recommended open roles.",
        "• FR-07: Analytics & Dashboards:"
    )

    add_custom_heading(doc, "3.1.2 Non-Functional Requirements", level=3)
    add_bullet_p(doc,
        "API endpoints must respond within 200 milliseconds for standard CRUD operations. Resume parsing and match evaluation must complete "
        "within 1.5 seconds for multi-page documents.",
        "• NFR-01: Performance & Latency:"
    )
    add_bullet_p(doc,
        "All sensitive data must be guarded via JWT bearer authorization. Passwords must never be stored in plain text. Uploaded files must be validated "
        "for MIME type and size before persisting.",
        "• NFR-02: Security & Privacy:"
    )
    add_bullet_p(doc,
        "The decoupled service architecture (separating controllers, models, and parsing/matching services) ensures modularity, allowing independent "
        "scaling and seamless swapping of the NLP engine for external LLMs.",
        "• NFR-03: Scalability & Modularity:"
    )
    add_bullet_p(doc,
        "MongoDB indexes on text fields, unique constraints on user emails, and compound unique indexes on (job, candidate) pairs ensure transactional integrity.",
        "• NFR-04: Data Integrity & Robustness:"
    )
    add_bullet_p(doc,
        "Modern dark-mode UI built with Tailwind CSS, clear visual cues (MatchScoreBadges, tooltips, responsive layouts), and accessibility compliance.",
        "• NFR-05: Usability & Responsiveness:"
    )

    add_custom_heading(doc, "3.2 SOFTWARE AND HARDWARE REQUIREMENTS", level=2)
    add_body_p(doc,
        "The software and hardware components utilized for developing, testing, and deploying the AI-Assisted Recruitment System are detailed below:"
    )

    # Requirements Table
    req_tbl = doc.add_table(rows=1, cols=3)
    req_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    req_tbl.autofit = False
    req_tbl.columns[0].width = Inches(1.8)
    req_tbl.columns[1].width = Inches(2.2)
    req_tbl.columns[2].width = Inches(2.4)

    h0, h1, h2 = req_tbl.rows[0].cells
    h0.text = "CATEGORY"
    h1.text = "COMPONENT"
    h2.text = "SPECIFICATION / VERSION"
    for c in [h0, h1, h2]:
        set_cell_background(c, "E2E8F0")
        set_cell_margins(c, top=80, bottom=80, left=100, right=100)
        p = c.paragraphs[0]
        p.runs[0].font.name = "Times New Roman"
        p.runs[0].font.size = Pt(10.5)
        p.runs[0].font.bold = True

    specs = [
        ("Software: Operating System", "Host Environment", "Windows 11 / Linux (Ubuntu 22.04 LTS)"),
        ("Software: Runtime Engine", "Node.js Platform", "Node.js v24.18.0 / v20 LTS"),
        ("Software: Backend Framework", "Express.js REST Server", "Express.js v4.21.2"),
        ("Software: Database System", "NoSQL Document Store", "MongoDB v7.x / v8.x Community Server"),
        ("Software: Object Data Model", "Mongoose ODM", "Mongoose v9.10.2"),
        ("Software: Frontend Library", "React 19 Framework", "React v19.2.8 & React DOM v19.2.8"),
        ("Software: Build Tool & Bundler", "Vite Development Server", "Vite v8.3.0 / @vitejs/plugin-react"),
        ("Software: Styling Framework", "Utility-First CSS", "Tailwind CSS v4.3.3"),
        ("Software: Client Routing", "Client-Side SPA Router", "React Router DOM v7.18.4"),
        ("Software: HTTP Client", "REST Service Layer", "Axios v1.20.0 (with Bearer Interceptor)"),
        ("Software: NLP & Parsing", "Document & Text Engines", "pdf-parse v1.1.1, mammoth v1.9.0, compromise v14.14.4, natural v8.0.1"),
        ("Software: Authentication", "Cryptography & Tokens", "BcryptJS v2.4.3, JSONWebToken v9.0.2"),
        ("Hardware: Processor", "Central Processing Unit", "Intel Core i5 / AMD Ryzen 5 or higher"),
        ("Hardware: Memory", "RAM Capacity", "8 GB Minimum (16 GB Recommended)"),
        ("Hardware: Storage", "Solid State Drive", "256 GB NVMe SSD with 5 GB free disk space"),
        ("Hardware: Display", "Monitor Resolution", "1920 x 1080 Full HD Display"),
    ]

    for cat, comp, spec in specs:
        row = req_tbl.add_row()
        c0, c1, c2 = row.cells
        set_cell_margins(c0, top=40, bottom=40, left=60, right=60)
        set_cell_margins(c1, top=40, bottom=40, left=60, right=60)
        set_cell_margins(c2, top=40, bottom=40, left=60, right=60)

        p0 = c0.paragraphs[0]
        r0 = p0.add_run(cat)
        r0.font.name = "Times New Roman"
        r0.font.size = Pt(9.5)
        r0.font.bold = True

        p1 = c1.paragraphs[0]
        r1 = p1.add_run(comp)
        r1.font.name = "Times New Roman"
        r1.font.size = Pt(9.5)

        p2 = c2.paragraphs[0]
        r2 = p2.add_run(spec)
        r2.font.name = "Times New Roman"
        r2.font.size = Pt(9.5)

    doc.add_page_break()

    # ==========================================
    # CHAPTER 4: SYSTEM DESIGN
    # ==========================================
    add_custom_heading(doc, "CHAPTER 4\nSYSTEM DESIGN", level=1)

    add_custom_heading(doc, "4.1 SYSTEM ARCHITECTURE", level=2)
    add_body_p(doc,
        "The architectural blueprint of the AI-Assisted Recruitment System adheres to a multi-tiered, decoupled "
        "client-server paradigm optimized for high reactivity, operational isolation, and maintainability. "
        "The architecture is partitioned into four primary layers: the Presentation Layer (React 19 SPA), "
        "the Application Gateway & Controller Layer (Node.js & Express), the AI / NLP Analytics Layer, and "
        "the Document Persistence Layer (MongoDB with Mongoose ODM)."
    )

    # Insert System Architecture Image
    arch_img_path = os.path.join(os.getcwd(), 'diagrams', 'system_architecture.png')
    if os.path.exists(arch_img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(4)
        run_img = p_img.add_run()
        run_img.add_picture(arch_img_path, width=Inches(6.2))

        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_after = Pt(12)
        r_cap = p_cap.add_run("Figure 4.1: System Architecture of AI-Assisted Recruitment System")
        r_cap.font.name = "Times New Roman"
        r_cap.font.size = Pt(10.5)
        r_cap.font.bold = True
        r_cap.font.italic = True

    add_body_p(doc,
        "Architectural Layer Details:",
        bold_prefix="• "
    )
    add_bullet_p(doc,
        "Constructed using React 19, Tailwind CSS v4, Lucide Icons, and React Router v7. Delivers specialized user interfaces "
        "including the Recruiter Dashboard, Candidate Kanban Board, Candidate Ranking View, and Resume Uploader. Network requests "
        "are managed via an Axios client with automated JWT bearer interceptors.",
        "1. Presentation Layer (Frontend):"
    )
    add_bullet_p(doc,
        "Powered by Node.js and Express.js. Acts as the central REST API coordinator hosting routing modules, JWT verification, "
        "role authorization guards, multipart upload streaming via Multer, and centralized error handling middleware.",
        "2. Application Layer (Backend REST API):"
    )
    add_bullet_p(doc,
        "Comprises the modular Resume Parser (pdf-parse, mammoth, compromise) and the Multi-Factor Matching Engine (natural TF-IDF). "
        "Executes entity normalization, skills taxonomy tagging, and weighted compatibility scoring.",
        "3. AI & NLP Analytics Layer:"
    )
    add_bullet_p(doc,
        "MongoDB serves as the schemaless document repository storing four relational collections: Users, Jobs, CandidateProfiles, "
        "and Applications. Mongoose enforces strict validation schemas, pre-save cryptographic hooks, and compound indexes.",
        "4. Database Layer (MongoDB):"
    )

    add_custom_heading(doc, "4.2 MODULE DESCRIPTION", level=2)
    add_body_p(doc,
        "The system functionality is organized into six cohesive, modular subsystems:"
    )

    add_body_p(doc,
        "Responsible for secure onboarding and session management for both Recruiters and Candidates. Implements registration, login, "
        "and user profile updates. Passwords are encrypted before persistence using Bcrypt with salt generation. Upon successful login, "
        "a digitally signed JSON Web Token (JWT) is issued containing the user ID and role, allowing role-based authorization guards "
        "to enforce endpoint security.",
        bold_prefix="Module 1: Authentication & Role-Based Access Control (RBAC): "
    )

    add_body_p(doc,
        "Enables recruiters to draft, publish, update, and remove job requisitions. Jobs encapsulate attributes such as title, department, "
        "employment type, salary ranges, min/max experience bounds, degree requirements, and array-based technical skill tags. Candidates can "
        "perform keyword searches and filter postings by experience and department.",
        bold_prefix="Module 2: Job Requisition & Search Module: "
    )

    add_body_p(doc,
        "Handles document ingestion across PDF, DOCX, and plain text formats. Leverages pdf-parse and mammoth to extract raw text buffers. "
        "Executes regular expression parsers for contact detection and utilizes Compromise NLP and a curated taxonomy of 500+ technical "
        "skills across Web, Cloud, AI/ML, DevOps, and Mobile engineering. Calculates total professional experience duration and classifies "
        "the highest degree achieved into standardized educational tiers.",
        bold_prefix="Module 3: Modular NLP Resume Ingestion & Entity Parser: "
    )

    add_body_p(doc,
        "Computes the multidimensional compatibility score (0 to 100%) between a candidate's parsed profile and a job posting using the "
        "weighted formula: 50% Skills + 25% Experience + 15% Education + 10% Semantic Fit. Generates an itemized breakdown of matched skills, "
        "missing required competencies, supplementary capabilities, experience status (Meets, Exceeds, Below), and recommendation tier "
        "(Strong Match >=80%, Good Match 65-79%, Potential Match 50-64%, Low Match <50%).",
        bold_prefix="Module 4: Multi-Factor AI Matching & Ranking Engine: "
    )

    add_body_p(doc,
        "Provides an interactive recruitment pipeline where candidates transition across six distinct stages: Applied -> Screened -> "
        "Shortlisted -> Interview Scheduled -> Selected -> Rejected. Every stage alteration records an audit trail containing timestamp, "
        "actor ID, and recruiter notes. Includes an integrated interview scheduling modal capturing meeting URLs, interviewers, and round types.",
        bold_prefix="Module 5: 6-Stage Shortlisting & Kanban Pipeline: "
    )

    add_body_p(doc,
        "Computes live operational analytics for recruiters, including active job counts, applicant volume, shortlisted talent ratios, "
        "scheduled interviews, and average candidate compatibility. For job seekers, the candidate dashboard displays submitted applications, "
        "current stage progress bars, upcoming interview alerts, and AI-recommended jobs.",
        bold_prefix="Module 6: Role-Specific Analytics & Dashboard Module: "
    )

    # Note: Preserving template section numbering jumping to 4.4 and 4.5
    add_custom_heading(doc, "4.4 CLASS DIAGRAM", level=2)
    add_body_p(doc,
        "The object-oriented domain model of the application is represented in Figure 4.2. The model highlights the four primary "
        "Mongoose schemas—User, Job, CandidateProfile, and Application—alongside their internal properties, methods, and associative cardinalities."
    )

    # Insert Class Diagram Image
    class_img_path = os.path.join(os.getcwd(), 'diagrams', 'class_diagram.png')
    if os.path.exists(class_img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(4)
        run_img = p_img.add_run()
        run_img.add_picture(class_img_path, width=Inches(6.2))

        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_after = Pt(12)
        r_cap = p_cap.add_run("Figure 4.2: UML Class Diagram of Mongoose Data Schemas and Relationships")
        r_cap.font.name = "Times New Roman"
        r_cap.font.size = Pt(10.5)
        r_cap.font.bold = True
        r_cap.font.italic = True

    add_body_p(doc,
        "Class Relationship Semantics:",
        bold_prefix="• "
    )
    add_bullet_p(doc,
        "One-to-Many relationship between User (with role 'recruiter') and Job. A recruiter can post multiple job requisitions; each job references one creator.",
        "1. User to Job (1 to 0..*):"
    )
    add_bullet_p(doc,
        "One-to-One relationship between User (with role 'candidate') and CandidateProfile. A candidate owns a single primary parsed profile document.",
        "2. User to CandidateProfile (1 to 0..1):"
    )
    add_bullet_p(doc,
        "One-to-Many relationship between Job and Application. Each job posting aggregates applications submitted by candidates.",
        "3. Job to Application (1 to 0..*):"
    )
    add_bullet_p(doc,
        "One-to-Many relationship between CandidateProfile and Application. The parsed profile is referenced across all applications submitted by that candidate.",
        "4. CandidateProfile to Application (1 to 0..*):"
    )

    add_custom_heading(doc, "4.5 SEQUENCE DIAGRAM", level=2)
    add_body_p(doc,
        "Figure 4.3 illustrates the end-to-end operational sequence diagram depicting the time-ordered interactions between "
        "the User (Candidate / Recruiter), the React Client, the Express REST API, the Resume Parser service, the AI Matching Engine, "
        "and the MongoDB data store."
    )

    # Insert Sequence Diagram Image
    seq_img_path = os.path.join(os.getcwd(), 'diagrams', 'sequence_diagram.png')
    if os.path.exists(seq_img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(4)
        run_img = p_img.add_run()
        run_img.add_picture(seq_img_path, width=Inches(6.2))

        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_after = Pt(12)
        r_cap = p_cap.add_run("Figure 4.3: UML Sequence Diagram of End-to-End Recruitment Workflow")
        r_cap.font.name = "Times New Roman"
        r_cap.font.size = Pt(10.5)
        r_cap.font.bold = True
        r_cap.font.italic = True

    add_body_p(doc,
        "The interaction sequence progresses in two major functional lifecycles:"
    )
    add_bullet_p(doc,
        "The candidate uploads a resume file. The React UI issues a multipart POST request to /api/resume/upload. "
        "The API invokes parseResume() in the Resume Parser service. The extracted JSON payload is persisted in the "
        "CandidateProfiles collection, and an HTTP 201 response returns the structured profile to the UI.",
        "Phase A: Resume Ingestion & Extraction:"
    )
    add_bullet_p(doc,
        "The candidate executes a 1-click apply to a job posting. The API retrieves the job specification and candidate profile, "
        "invoking evaluateMatch() in the Matching Engine. The 50/25/15/10 weighted algorithm executes, persisting the matchAnalysis "
        "and initial stage ('Applied') in the Applications collection.",
        "Phase B: One-Click Application & AI Evaluation:"
    )
    add_bullet_p(doc,
        "The recruiter opens the 6-stage Kanban board. The API fetches all job applicants sorted by match score. When the recruiter "
        "advances a candidate to 'Interview Scheduled' and schedules a meeting, a PUT request records the transition with audit history "
        "and sends live interview details to the candidate's dashboard.",
        "Phase C: Shortlisting, Kanban Transition & Interview Scheduling:"
    )

    doc.add_page_break()

    # ==========================================
    # CHAPTER 5: IMPLEMENTATION
    # ==========================================
    add_custom_heading(doc, "CHAPTER 5\nIMPLEMENTATION", level=1)

    add_custom_heading(doc, "5.1 IMPLEMENTATION OVERVIEW", level=2)
    add_body_p(doc,
        "The implementation of the AI-Assisted Recruitment System was executed following modern asynchronous JavaScript "
        "best practices across both the server and client tiers. The monorepo architecture houses two decoupled sub-applications: "
        "a backend Node.js / Express microservice in the 'server/' directory and a React 19 single-page application in the 'client/' directory."
    )
    add_body_p(doc,
        "Key implementation principles adopted include:"
    )
    add_bullet_p(doc,
        "Strict separation of concerns between routing (routes/), business logic (controllers/), database schemas (models/), "
        "middleware filters (middlewares/), and computational AI algorithms (services/).",
        "• Modular Clean Architecture:"
    )
    add_bullet_p(doc,
        "Stateful user authentication is replaced with stateless JSON Web Tokens. Bearer tokens are injected transparently into outgoing "
        "client requests via Axios interceptors and validated on protected backend endpoints using jsonwebtoken.",
        "• Stateless JWT Authentication:"
    )
    add_bullet_p(doc,
        "The resume parser accepts binary buffers and mime-types, yielding a clean JSON contract. This design decouples parsing logic "
        "from database logic, allowing developers to swap local NLP heuristics for commercial LLM structured outputs with zero upstream changes.",
        "• Decoupled AI Pipeline:"
    )
    add_bullet_p(doc,
        "Application and system reliability were validated via an automated end-to-end integration test suite (api.test.js) asserting "
        "12 distinct functional scenarios covering auth, job management, parsing accuracy, matching calculations, pipeline transitions, and stats.",
        "• Test-Driven Integration Verification:"
    )

    add_custom_heading(doc, "5.2 KEY FUNCTIONS (CODE EXPLANATION)", level=2)
    add_body_p(doc,
        "This section presents in-depth technical explanations of the core algorithmic and architectural functions driving the platform."
    )

    # Key Function 1: Matching Engine evaluateMatch
    add_custom_heading(doc, "5.2.1 Matching Engine & Multi-Factor Scoring (matchingEngine.js)", level=3)
    add_body_p(doc,
        "The function evaluateMatch(job, candidateProfile) is the core algorithmic evaluator. It computes four independent sub-scores "
        "and aggregates them using a deterministic weighted linear model:"
    )
    add_code_block(doc,
'''function evaluateMatch(job, candidateProfile) {
  const candidateParsed = candidateProfile?.parsedData || candidateProfile || {};
  const rawText = candidateProfile?.rawText || '';

  // 1. Skills Compatibility (50% weight)
  const skillsRes = calculateSkillsScore(job.requiredSkills || [], candidateParsed.skills || [], rawText);

  // 2. Experience Fit (25% weight)
  const expRes = calculateExperienceScore(job.minExperience || 0, candidateParsed.totalYearsExperience || 0);

  // 3. Education Degree Fit (15% weight)
  const eduRes = calculateEducationScore(job.educationRequirement || 'Bachelor', candidateParsed.highestEducation || 'Bachelor');

  // 4. Semantic Description Relevance (10% weight via TF-IDF)
  const semanticScore = calculateSemanticScore(job.description || '', job.title || '', rawText, candidateParsed.summary || '');

  // Weighted Linear Aggregation
  const overallScore = Math.round(
    skillsRes.score * 0.50 +
    expRes.score * 0.25 +
    eduRes.score * 0.15 +
    semanticScore * 0.10
  );

  let recommendation = 'Potential Match';
  if (overallScore >= 80) recommendation = 'Strong Match';
  else if (overallScore >= 65) recommendation = 'Good Match';
  else if (overallScore >= 50) recommendation = 'Potential Match';
  else recommendation = 'Low Match';

  return { overallScore, skillsScore: skillsRes.score, experienceScore: expRes.score,
           educationScore: eduRes.score, semanticScore, matchedSkills: skillsRes.matchedSkills,
           missingSkills: skillsRes.missingSkills, recommendation };
}''', filename="server/src/services/matchingEngine.js")
    add_body_p(doc,
        "Explanation: The function executes four distinct sub-calculators: calculateSkillsScore scans the candidate's skills against required skills "
        "incorporating synonym aliases (e.g. React/ReactJS, Node.js/Node) and awards a +5% bonus for supplementary technical capabilities. "
        "calculateExperienceScore calculates experience ratios with curved drop-off for junior profiles. calculateEducationScore evaluates "
        "hierarchical degree ranks (PhD=5, Master=4, Bachelor=3). Finally, calculateSemanticScore executes TF-IDF document comparison on top job keywords."
    )

    # Key Function 2: Resume Parser
    add_custom_heading(doc, "5.2.2 Resume Ingestion & NLP Parsing (resumeParser.js)", level=3)
    add_body_p(doc,
        "The parseResume function handles multi-format file reading, entity recognition, and taxonomy extraction:"
    )
    add_code_block(doc,
'''async function parseResume(fileBufferOrText, mimeType = 'application/pdf', originalName = '') {
  let rawText = '';
  if (typeof fileBufferOrText === 'string') {
    rawText = fileBufferOrText;
  } else {
    rawText = await extractRawText(fileBufferOrText, mimeType, originalName);
  }

  // Extract contact info
  const email = extractEmail(rawText);
  const phone = extractPhone(rawText);
  const name = extractCandidateName(rawText);

  // Extract skills via curated 500+ taxonomy & regex boundaries
  const skills = extractSkills(rawText);

  // Extract experience & education
  const totalYearsExperience = extractExperienceYears(rawText);
  const highestEducation = extractHighestEducation(rawText);

  return {
    parsedData: { name, email, phone, skills, totalYearsExperience, highestEducation },
    rawText,
    parsingMetadata: { parserVersion: '1.0.0', confidenceScore: 0.92, parsedAt: new Date() }
  };
}''', filename="server/src/services/resumeParser.js")
    add_body_p(doc,
        "Explanation: extractRawText detects file types, routing PDF buffers to pdf-parse and DOCX buffers to mammoth. extractEmail and "
        "extractPhone apply regex patterns. extractSkills tests words against a 500+ item technical skill taxonomy using boundary-aware regex. "
        "extractExperienceYears computes total career tenure from detected employment date ranges, returning a structured JSON document."
    )

    # Key Function 3: Authentication Middleware
    add_custom_heading(doc, "5.2.3 JWT Protection & Role Authorization (auth.js)", level=3)
    add_body_p(doc,
        "Security middleware intercepting incoming requests to verify bearer tokens and enforce role permissions:"
    )
    add_code_block(doc,
'''exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. Token missing.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'User no longer exists.' });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false,
        message: `Role '${req.user ? req.user.role : 'none'}' unauthorized for this action.` });
    }
    next();
  };
};''', filename="server/src/middlewares/auth.js")
    add_body_p(doc,
        "Explanation: The protect middleware extracts the Bearer token from HTTP headers, verifies its cryptographic signature using "
        "process.env.JWT_SECRET, and attaches the active User document to req.user. The authorize higher-order function checks if req.user.role "
        "matches permissible roles (e.g., 'recruiter'), rejecting unauthorized attempts with an HTTP 403 Forbidden status."
    )

    # Key Function 4: Job CRUD & Pipeline Updates
    add_custom_heading(doc, "5.2.4 Pipeline Stage Update & Audit History (applicationController.js)", level=3)
    add_body_p(doc,
        "Manages candidate transitions across the 6 Kanban stages with auditable history logs:"
    )
    add_code_block(doc,
'''exports.updateApplicationStage = async (req, res, next) => {
  try {
    const { stage, note } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found.' });

    // Update current stage
    application.stage = stage;

    // Append to audit history
    application.stageHistory.push({
      stage,
      updatedBy: req.user.id,
      updatedAt: new Date(),
      note: note || `Moved candidate to ${stage}`
    });

    await application.save();
    res.status(200).json({ success: true, message: `Application moved to ${stage}`, data: application });
  } catch (error) {
    next(error);
  }
};''', filename="server/src/controllers/applicationController.js")
    add_body_p(doc,
        "Explanation: When a recruiter drags a candidate card or clicks a stage action button, this controller validates stage enum values, "
        "updates the application's current stage, appends an immutable entry to stageHistory recording user ID, timestamp, and notes, "
        "and commits the updated document to MongoDB."
    )

    doc.add_page_break()

    # ==========================================
    # CHAPTER 6: CONCLUSION & FUTURE WORK
    # ==========================================
    add_custom_heading(doc, "CHAPTER 6\nCONCLUSION & FUTURE WORK", level=1)

    add_custom_heading(doc, "6.1 CONCLUSION", level=2)
    add_body_p(doc,
        "The design, full-stack implementation, and testing verification of the AI-Assisted Recruitment System successfully "
        "demonstrate the viability, performance, and transparency achievable by combining modern MERN stack web technologies "
        "with explainable natural language processing algorithms."
    )
    add_body_p(doc,
        "By replacing traditional, error-prone manual screening and opaque commercial keyword filters with an automated, "
        "deterministic pipeline, the platform achieves several significant breakthroughs:"
    )
    add_bullet_p(doc,
        "The automated resume parsing service ingests PDF, DOCX, and TXT resumes, normalizing contact details, experience durations, "
        "and 500+ technical skills in sub-second execution intervals, drastically reducing recruitment turnaround times.",
        "1. High-Throughput Resume Ingestion:"
    )
    add_bullet_p(doc,
        "The four-factor compatibility scoring formula (50% Skills, 25% Experience, 15% Education, 10% TF-IDF) provides transparent, "
        "auditable decision rationale without black-box bias, benefiting recruiters with clear candidate rankings and empowering job seekers "
        "with itemized gap feedback.",
        "2. Explainable AI Decision-Making:"
    )
    add_bullet_p(doc,
        "The interactive 6-stage Kanban board unifies candidate shortlisting, stage transition auditing, and virtual interview coordination "
        "within a cohesive, dark-themed responsive interface.",
        "3. Streamlined Recruitment Pipeline:"
    )
    add_bullet_p(doc,
        "The entire backend API suite achieved a 100% pass rate (12/12 test assertions) across health monitoring, authentication, CRUD operations, "
        "NLP extraction, scoring accuracy, and dashboard aggregations.",
        "4. Verified Engineering Reliability:"
    )

    add_custom_heading(doc, "6.2 FUTURE ENHANCEMENTS", level=2)
    add_body_p(doc,
        "While the AI-Assisted Recruitment System successfully achieves its core objectives, several prospective architectural "
        "and algorithmic enhancements are envisioned for future development cycles:"
    )
    add_bullet_p(doc,
        "Owing to the decoupled service contract of resumeParser.js, the rule-based entity extractor can be supplemented or swapped with "
        "structured JSON generative AI models (such as Google Gemini 1.5/2.0 or OpenAI GPT-4o) to handle complex resume formatting anomalies "
        "and multilingual CVs.",
        "• Generative AI & LLM Structured Extraction:"
    )
    add_bullet_p(doc,
        "Integrating bidirectional synchronization with Google Calendar and Microsoft Outlook APIs to automatically check interviewer availability "
        "and dispatch calendar invitations (.ics attachments) with automated reminders.",
        "• Real-Time Calendar API Synchronization:"
    )
    add_bullet_p(doc,
        "Incorporating automated technical screening assessments and coding sandboxes directly within the candidate portal to cross-validate "
        "self-reported technical capabilities against practical coding benchmarks prior to final interview rounds.",
        "• Embedded Technical Skill Assessments:"
    )
    add_bullet_p(doc,
        "Implementing video interview recording and automated speech-to-text transcription with sentiment and technical keyword analysis "
        "to assist hiring panels during post-interview deliberation sessions.",
        "• AI-Powered Video Interview Transcription:"
    )
    add_bullet_p(doc,
        "Developing native mobile companion applications using React Native to allow recruiters and candidates to receive real-time push "
        "notifications on interview schedules and application status changes.",
        "• Mobile Applications (iOS / Android):"
    )

    doc.add_page_break()

    # ==========================================
    # APPENDIX: SOURCE CODE
    # ==========================================
    add_custom_heading(doc, "APPENDIX\nSOURCE CODE", level=1)

    # 1. Project Structure
    add_custom_heading(doc, "1. Project Structure", level=2)
    add_body_p(doc, "The comprehensive monorepo project folder structure of the AI-Assisted Recruitment System:")
    add_code_block(doc,
'''AI-assisted recruitment system/
├── package.json                   # Root monorepo scripts & devDependencies
├── .env                           # Root environment configuration
├── .env.example                   # Sample environment variable template
├── README.md                      # Comprehensive project documentation
├── server/                        # Backend REST API Service
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB Mongoose connection
│   │   ├── controllers/
│   │   │   ├── authController.js        # Registration, login, profile
│   │   │   ├── jobController.js         # Job CRUD & search
│   │   │   ├── resumeController.js      # Resume upload & parsed profile
│   │   │   ├── matchingController.js    # Candidate ranking & evaluation
│   │   │   ├── applicationController.js # Kanban pipeline & interviews
│   │   │   └── statsController.js       # Recruiter & candidate analytics
│   │   ├── middlewares/
│   │   │   ├── auth.js            # JWT protection & role authorization
│   │   │   ├── upload.js          # Multer storage configuration
│   │   │   └── errorHandler.js    # Centralized error handler
│   │   ├── models/
│   │   │   ├── User.js            # User schema with bcrypt hook
│   │   │   ├── Job.js             # Job posting schema
│   │   │   ├── CandidateProfile.js# Parsed resume schema
│   │   │   └── Application.js     # 6-stage Kanban application schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js, jobRoutes.js, resumeRoutes.js
│   │   │   ├── matchingRoutes.js, applicationRoutes.js, statsRoutes.js
│   │   ├── services/
│   │   │   ├── resumeParser.js    # Modular NLP multi-format parser
│   │   │   └── matchingEngine.js  # 4-factor AI matching engine
│   │   ├── app.js                 # Express application configuration
│   │   └── server.js              # HTTP server listener & cluster logic
│   ├── test/
│   │   └── api.test.js            # 12/12 automated integration tests
│   ├── seed.js                    # Database demo data seeder
│   └── package.json               # Server dependencies & scripts
└── client/                        # Frontend React 19 Single Page Application
    ├── src/
    │   ├── components/            # Navbar, Modals, Badges, ProtectedRoute
    │   ├── context/
    │   │   └── AuthContext.jsx    # React Auth Provider & hooks
    │   ├── pages/
    │   │   ├── LandingPage.jsx, LoginPage.jsx, RegisterPage.jsx
    │   │   ├── JobListingsPage.jsx, JobDetailPage.jsx
    │   │   ├── RecruiterDashboard.jsx, CandidateDashboard.jsx
    │   │   ├── PipelineKanbanPage.jsx, CandidateRankingPage.jsx
    │   │   ├── ResumeUploadPage.jsx, MyApplicationsPage.jsx
    │   ├── services/
    │   │   └── api.js             # Axios client with JWT interceptor
    │   ├── App.jsx                # Router & layout entry point
    │   ├── main.jsx               # React DOM root render
    │   └── index.css              # Tailwind CSS styles
    ├── package.json               # Client dependencies & Vite configuration
    └── vite.config.js             # Vite build settings''', filename="Project Directory Tree")

    # 2. Backend Package Installation
    add_custom_heading(doc, "2. Backend Package Installation", level=2)
    add_body_p(doc, "Terminal commands required to install dependencies for the root, backend, and frontend environments:")
    add_code_block(doc,
'''# Root Monorepo Dependencies Installation
npm install

# Backend Server Package Installation
cd server
npm install express mongoose dotenv cors morgan bcryptjs jsonwebtoken multer pdf-parse mammoth compromise natural validator
npm install --save-dev nodemon

# Frontend React Client Package Installation
cd ../client
npm install react react-dom react-router-dom axios lucide-react canvas-confetti tailwindcss @tailwindcss/vite
npm install --save-dev vite @vitejs/plugin-react oxlint''', filename="Terminal Commands")

    # 3. Database Connection
    add_custom_heading(doc, "3. Database Connection", level=2)
    add_body_p(doc, "MongoDB database connection module establishing an asynchronous connection via Mongoose ODM:")
    add_code_block(doc,
'''const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-recruit-pro';
    const conn = await mongoose.connect(connUri);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;''', filename="server/src/config/db.js")

    # 4. Environment Variables
    add_custom_heading(doc, "4. Environment Variables", level=2)
    add_body_p(doc, "Environment configuration names without exposing secret credentials:")
    add_code_block(doc,
'''# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection URI
MONGODB_URI=mongodb://127.0.0.1:27017/ai-recruit-pro

# Cryptographic Authentication Secrets
JWT_SECRET=[REDACTED_SECURE_KEY]
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10

# Frontend Client Environment Variable
VITE_API_URL=/api''', filename="server/.env / .env.example")

    # 5. User Model
    add_custom_heading(doc, "5. User Model", level=2)
    add_body_p(doc, "Mongoose schema defining user credentials, roles, and password hashing hooks:")
    add_code_block(doc,
'''const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['recruiter', 'candidate'],
      default: 'candidate',
      required: true,
    },
    company: { type: String, trim: true, default: '' },
    title: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);''', filename="server/src/models/User.js")

    # 6. Password Hashing and Registration
    add_custom_heading(doc, "6. Password Hashing and Registration", level=2)
    add_body_p(doc, "Registration controller implementing user validation and secure account creation:")
    add_code_block(doc,
'''exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, company, title, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    // Create user (password automatically hashed by pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'candidate',
      company: role === 'recruiter' ? company || 'Tech Corp' : '',
      title: title || '',
      phone: phone || '',
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};''', filename="server/src/controllers/authController.js (register)")

    # 7. Login and JWT Generation
    add_custom_heading(doc, "7. Login and JWT Generation", level=2)
    add_body_p(doc, "Login controller and JWT generation helper:")
    add_code_block(doc,
'''const jwt = require('jsonwebtoken');

// Helper to generate and return signed JWT response
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'default_jwt_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company,
    title: user.title,
    phone: user.phone,
    createdAt: user.createdAt,
  };

  res.status(statusCode).json({ success: true, token, user: userData });
};

// Login Controller
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};''', filename="server/src/controllers/authController.js (login)")

    # 8. Authentication Middleware
    add_custom_heading(doc, "8. Authentication Middleware", level=2)
    add_body_p(doc, "JWT protection and role authorization middleware:")
    add_code_block(doc,
'''const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. Token missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User belonging to token no longer exists.' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized. Invalid or expired token.' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'none'}' unauthorized for this action. Required: [${roles.join(', ')}]`,
      });
    }
    next();
  };
};''', filename="server/src/middlewares/auth.js")

    # 9. Create API
    add_custom_heading(doc, "9. Create API", level=2)
    add_body_p(doc, "Job requisition creation API endpoint (POST /api/jobs):")
    add_code_block(doc,
'''exports.createJob = async (req, res, next) => {
  try {
    const {
      title, company, department, location, type, description,
      requiredSkills, optionalSkills, minExperience, maxExperience,
      educationRequirement, salaryMin, salaryMax, salaryCurrency, status
    } = req.body;

    let parsedRequiredSkills = requiredSkills;
    if (typeof requiredSkills === 'string') {
      parsedRequiredSkills = requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    let parsedOptionalSkills = optionalSkills;
    if (typeof optionalSkills === 'string') {
      parsedOptionalSkills = optionalSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const job = await Job.create({
      title,
      company: company || req.user.company || 'AI Recruit Pro Hiring',
      department: department || 'Engineering',
      location: location || 'Remote',
      type: type || 'Full-Time',
      description,
      requiredSkills: parsedRequiredSkills || [],
      optionalSkills: parsedOptionalSkills || [],
      minExperience: Number(minExperience) || 0,
      maxExperience: Number(maxExperience) || 10,
      educationRequirement: educationRequirement || 'Bachelor',
      salaryMin: Number(salaryMin) || 0,
      salaryMax: Number(salaryMax) || 0,
      salaryCurrency: salaryCurrency || 'USD',
      status: status || 'active',
      recruiter: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully.',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};''', filename="server/src/controllers/jobController.js (createJob)")

    # 10. Read API
    add_custom_heading(doc, "10. Read API", level=2)
    add_body_p(doc, "Read endpoints retrieving active jobs and detailed listings with applicant counts:")
    add_code_block(doc,
'''exports.getJobs = async (req, res, next) => {
  try {
    const { search, type, department, location, minExperience, status } = req.query;
    let query = { status: status || 'active' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    if (type) query.type = type;
    if (department) query.department = { $regex: department, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (minExperience !== undefined && minExperience !== '') {
      query.minExperience = { $lte: Number(minExperience) };
    }

    const jobs = await Job.find(query)
      .populate('recruiter', 'name email company')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    next(error);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name email company');
    if (!job) return res.status(404).json({ success: false, message: 'Job posting not found.' });

    const applicantsCount = await Application.countDocuments({ job: job._id });
    const jobData = job.toObject();
    jobData.applicantsCount = applicantsCount;

    res.status(200).json({ success: true, data: jobData });
  } catch (error) {
    next(error);
  }
};''', filename="server/src/controllers/jobController.js (getJobs & getJobById)")

    # 11. Update
    add_custom_heading(doc, "11. Update", level=2)
    add_body_p(doc, "Update job requisition API endpoint (PUT /api/jobs/:id):")
    add_code_block(doc,
'''exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job posting not found.' });

    // Verify ownership
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job posting.' });
    }

    if (typeof req.body.requiredSkills === 'string') {
      req.body.requiredSkills = req.body.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (typeof req.body.optionalSkills === 'string') {
      req.body.optionalSkills = req.body.optionalSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: 'Job posting updated successfully.', data: job });
  } catch (error) {
    next(error);
  }
};''', filename="server/src/controllers/jobController.js (updateJob)")

    # 12. Delete
    add_custom_heading(doc, "12. Delete", level=2)
    add_body_p(doc, "Delete job requisition API endpoint with cascading deletion of related applications:")
    add_code_block(doc,
'''exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job posting not found.' });

    // Verify ownership
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job posting.' });
    }

    await Job.findByIdAndDelete(req.params.id);
    // Cascade delete associated applications
    await Application.deleteMany({ job: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Job posting and related applications deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};''', filename="server/src/controllers/jobController.js (deleteJob)")

    # 13. Express Routes
    add_custom_heading(doc, "13. Express Routes", level=2)
    add_body_p(doc, "Express routing configuration for job management routes:")
    add_code_block(doc,
'''const express = require('express');
const router = express.Router();
const {
  getJobs,
  getMyJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middlewares/auth');

// Public route to view jobs & recruiter route to post jobs
router
  .route('/')
  .get(getJobs)
  .post(protect, authorize('recruiter', 'admin'), createJob);

// Recruiter specific route to view posted jobs
router.get('/my-jobs', protect, authorize('recruiter', 'admin'), getMyJobs);

// Single job details, update, and delete
router
  .route('/:id')
  .get(getJobById)
  .put(protect, authorize('recruiter', 'admin'), updateJob)
  .delete(protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;''', filename="server/src/routes/jobRoutes.js")

    # 14. Main Server File
    add_custom_heading(doc, "14. Main Server File", level=2)
    add_body_p(doc, "Main Node.js Express server entry point mounting routes, database connection, and static paths:")
    add_code_block(doc,
'''const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start HTTP server
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`  AI Recruit Pro API Server Running`);
    console.log(`  Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Port: ${PORT}`);
    console.log(`  API Endpoint: http://localhost:${PORT}/api`);
    console.log(`=========================================`);
  });

  process.on('unhandledRejection', (err) => {
    console.error(`[UnhandledRejection]: ${err.message}`);
    server.close(() => process.exit(1));
  });
});''', filename="server/src/server.js")

    # 15. React Login Component
    add_custom_heading(doc, "15. React Login Component", level=2)
    add_body_p(doc, "React authentication component featuring stateful form handling and one-click demo credentials:")
    add_code_block(doc,
'''import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      if (from) navigate(from, { replace: true });
      else navigate(data.user.role === 'recruiter' ? '/recruiter-dashboard' : '/candidate-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    try {
      const data = await login(demoEmail, 'password123');
      navigate(demoRole === 'recruiter' ? '/recruiter-dashboard' : '/candidate-dashboard');
    } catch (err) {
      setError('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel rounded-2xl border border-slate-800 p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white text-center">Welcome Back</h1>
        {error && <div className="text-rose-300 text-xs p-3 bg-rose-500/10 rounded-xl my-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <input type="email" required placeholder="name@example.com" value={email}
                 onChange={(e) => setEmail(e.target.value)} className="w-full p-2.5 rounded-xl glass-input text-white" />
          <input type="password" required placeholder="••••••••" value={password}
                 onChange={(e) => setPassword(e.target.value)} className="w-full p-2.5 rounded-xl glass-input text-white" />
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-semibold">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;''', filename="client/src/pages/LoginPage.jsx")

    # 16. Admin Dashboard Logic
    add_custom_heading(doc, "16. Admin Dashboard Logic", level=2)
    add_body_p(doc,
        "Recruiter and administrative dashboard data-fetching logic. In the AI-Assisted Recruitment System, administrative recruitment "
        "and hiring management responsibilities are consolidated in the Recruiter Dashboard via concurrent API calls to statsAPI and jobsAPI:"
    )
    add_code_block(doc,
'''// client/src/pages/RecruiterDashboard.jsx (Data Fetching Hook & Handler)
const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all recruiter dashboard analytics and jobs simultaneously
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, jobsRes] = await Promise.all([
        statsAPI.getRecruiterStats(),
        jobsAPI.getMyJobs(),
      ]);

      if (statsRes.data.success) {
        setStatsData(statsRes.data);
      }
      if (jobsRes.data.success) {
        setJobs(jobsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching recruiter stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handler for posting / updating jobs
  const handleSaveJob = async (jobData) => {
    try {
      setIsSubmittingJob(true);
      if (editingJob) {
        await jobsAPI.updateJob(editingJob._id, jobData);
      } else {
        await jobsAPI.createJob(jobData);
      }
      setIsJobModalOpen(false);
      setEditingJob(null);
      fetchDashboardData(); // Refresh dashboard data
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving job.');
    } finally {
      setIsSubmittingJob(false);
    }
  };
  // ... (dashboard metrics rendering)
};''', filename="client/src/pages/RecruiterDashboard.jsx")

    # 17. REST API Request and Response Examples
    add_custom_heading(doc, "17. REST API Request and Response Examples", level=2)
    add_body_p(doc, "Exact JSON HTTP request and response examples verified from the automated integration test suite:")

    add_body_p(doc, "Example A: Recruiter Login (POST /api/auth/login)", bold_prefix="• ")
    add_code_block(doc,
'''// HTTP Request: POST /api/auth/login
{
  "email": "recruiter@airecruit.pro",
  "password": "password123"
}

// HTTP Response: 200 OK
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Zj...",
  "user": {
    "_id": "6ab3d87e63dabbf8c110f5e1",
    "name": "Sarah Jenkins",
    "email": "recruiter@airecruit.pro",
    "role": "recruiter",
    "company": "CloudScale Technologies",
    "title": "Head of Technical Talent"
  }
}''', filename="REST API: POST /api/auth/login")

    add_body_p(doc, "Example B: Ranked Candidates Evaluation (GET /api/matching/job/:jobId/ranked-candidates)", bold_prefix="• ")
    add_code_block(doc,
'''// HTTP Request: GET /api/matching/job/6ab3d87e63dabbf8c110f5ed/ranked-candidates
// Headers: Authorization: Bearer <TOKEN>

// HTTP Response: 200 OK
{
  "success": true,
  "jobId": "6ab3d87e63dabbf8c110f5ed",
  "jobTitle": "Senior Full-Stack Engineer",
  "count": 5,
  "data": [
    {
      "candidateProfileId": "6ab3d87e63dabbf8c110f5e8",
      "candidateName": "Alex Rivera",
      "candidateEmail": "alex.dev@example.com",
      "overallScore": 92,
      "skillsScore": 95,
      "experienceScore": 100,
      "educationScore": 100,
      "semanticScore": 88,
      "matchedSkills": ["React", "Node.js", "TypeScript", "Docker", "MongoDB"],
      "missingSkills": [],
      "recommendation": "Strong Match",
      "aiSummary": "Candidate has 6 years experience (exceeds required 4 yrs) and matches 5/5 required skills."
    }
  ]
}''', filename="REST API: GET /api/matching/job/:jobId/ranked-candidates")

    doc.add_page_break()

    # ==========================================
    # SCREENSHOTS OF THE PROJECT
    # ==========================================
    add_custom_heading(doc, "SCREENSHOTS OF THE PROJECT", level=1)
    add_body_p(doc,
        "This section presents high-resolution screenshots captured directly from the live running deployment of the "
        "AI-Assisted Recruitment System platform, demonstrating user interfaces across the landing portal, authentication, "
        "recruiter administration, job board, AI scoring, and the 6-stage Kanban pipeline."
    )

    screenshot_meta = [
        ("screenshots/1_landing_page.png", "Figure 7.1: Landing & Career Portal Homepage showcasing system features and CTA buttons"),
        ("screenshots/2_login_page.png", "Figure 7.2: Authentication & Demo Login Interface with role switcher (Recruiter / Candidate)"),
        ("screenshots/3_recruiter_dashboard.png", "Figure 7.3: Recruiter Management Dashboard with live hiring metrics and applicant stream"),
        ("screenshots/4_job_listings.png", "Figure 7.4: Job Search and Filtering Interface with department and experience filters"),
        ("screenshots/5_kanban_pipeline.png", "Figure 7.5: 6-Stage Candidate Shortlisting Kanban Pipeline (Applied to Selected)"),
        ("screenshots/6_candidate_ranking.png", "Figure 7.6: AI Candidate Ranking & Fit Breakdown View with itemized match percentages"),
        ("screenshots/7_candidate_dashboard.png", "Figure 7.7: Candidate Dashboard with active application status and progress tracker"),
        ("screenshots/8_resume_upload.png", "Figure 7.8: Resume Upload & NLP Ingestion Interface supporting PDF/DOCX and text parsing"),
        ("screenshots/9_my_applications.png", "Figure 7.9: Candidate Submitted Applications Management and upcoming interview alerts"),
    ]

    for img_rel, cap in screenshot_meta:
        img_full = os.path.join(os.getcwd(), img_rel)
        if os.path.exists(img_full):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(8)
            p_img.paragraph_format.space_after = Pt(4)
            run = p_img.add_run()
            run.add_picture(img_full, width=Inches(6.0))

            p_c = doc.add_paragraph()
            p_c.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_c.paragraph_format.space_after = Pt(14)
            rc = p_c.add_run(cap)
            rc.font.name = "Times New Roman"
            rc.font.size = Pt(10)
            rc.font.bold = True
            rc.font.italic = True

    doc.add_page_break()

    # ==========================================
    # REFERENCES
    # ==========================================
    add_custom_heading(doc, "REFERENCES", level=1)

    refs = [
        "[1] G. Salton and C. Buckley, “Term-weighting approaches in automatic text retrieval,” Information Processing & Management, vol. 24, no. 5, pp. 513–523, 1988.",
        "[2] D. Jurafsky and J. H. Martin, Speech and Language Processing: An Introduction to Natural Language Processing, Computational Linguistics, and Speech Recognition, 3rd ed. draft. Upper Saddle River, NJ: Prentice Hall, 2023.",
        "[3] S. Tilkov and S. Vinoski, “Node.js: Using JavaScript to Build High-Performance Network Programs,” IEEE Internet Computing, vol. 14, no. 6, pp. 80–83, Nov.–Dec. 2010.",
        "[4] M. B. Jones, J. Bradley, and N. Sakimura, “JSON Web Token (JWT),” RFC 7519, Internet Engineering Task Force (IETF), May 2015.",
        "[5] N. Provos and D. Mazières, “A Future-Adaptable Password Scheme,” in Proc. USENIX Annual Technical Conference, FREENIX Track, Monterey, CA, USA, 1999, pp. 81–92.",
        "[6] K. Chodorow, MongoDB: The Definitive Guide: Powerful and Scalable Data Storage, 3rd ed. Sebastopol, CA: O'Reilly Media, 2020.",
        "[7] E. Gamma, R. Helm, R. Johnson, and J. Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software. Boston, MA: Addison-Wesley, 1994.",
        "[8] M. Fowler, Patterns of Enterprise Application Architecture. Boston, MA: Addison-Wesley Professional, 2002.",
        "[9] R. T. Fielding, “Architectural Styles and the Design of Network-based Software Architectures,” Ph.D. dissertation, Dept. Inf. Comput. Sci., Univ. California, Irvine, CA, USA, 2000.",
        "[10] D. Crockford, JavaScript: The Good Parts. Sebastopol, CA: O'Reilly Media, 2008.",
        "[11] Meta Open Source, “React 19 Documentation: The library for web and native user interfaces,” 2024. [Online]. Available: https://react.dev",
        "[12] OpenJS Foundation, “Express: Fast, unopinionated, minimalist web framework for Node.js,” 2024. [Online]. Available: https://expressjs.com",
    ]

    for ref in refs:
        p_ref = doc.add_paragraph()
        p_ref.paragraph_format.line_spacing = 1.25
        p_ref.paragraph_format.space_after = Pt(6)
        p_ref.paragraph_format.left_indent = Inches(0.4)
        p_ref.paragraph_format.first_line_indent = Inches(-0.4)
        r = p_ref.add_run(ref)
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)

    # Save to Final Document
    output_filename = "FSD_Project_Report_S_Srisakthi_Final.docx"
    doc.save(output_filename)
    print(f"Report successfully generated and saved to {output_filename}!")

if __name__ == "__main__":
    main()
