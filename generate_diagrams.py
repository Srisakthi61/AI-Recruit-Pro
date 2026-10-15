import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

os.makedirs('diagrams', exist_ok=True)

# Set high-res font settings
plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['font.size'] = 9

# ==========================================
# 1. SYSTEM ARCHITECTURE DIAGRAM
# ==========================================
def create_system_architecture():
    fig, ax = plt.subplots(figsize=(11, 7.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 7.5)
    ax.axis('off')

    # Background canvas
    fig.patch.set_facecolor('#ffffff')
    ax.set_facecolor('#ffffff')

    # Title
    ax.text(5.5, 7.15, 'AI-Assisted Recruitment System Architecture', ha='center', va='center',
            fontsize=15, fontweight='bold', color='#1e293b')
    ax.text(5.5, 6.85, 'MERN Stack & NLP-Driven Multi-Factor Matching Pipeline', ha='center', va='center',
            fontsize=10.5, fontstyle='italic', color='#64748b')

    # Section Boxes (Subgraphs)
    # Layer 1: Client
    p_client = patches.FancyBboxPatch((0.5, 4.4), 3.0, 2.1, boxstyle="round,pad=0.1,rounding_size=0.15",
                                     linewidth=1.5, edgecolor='#3b82f6', facecolor='#eff6ff')
    ax.add_patch(p_client)
    ax.text(2.0, 6.25, 'Presentation Layer (React 19 Frontend)', ha='center', va='center',
            fontsize=10.5, fontweight='bold', color='#1d4ed8')

    client_items = [
        "Landing & Career Portal",
        "Recruiter Dashboard & Kanban Board",
        "Candidate Dashboard & Applications",
        "Resume Uploader & Profile View",
        "Axios HTTP Client + JWT Interceptors"
    ]
    for i, item in enumerate(client_items):
        ax.text(0.7, 5.9 - (i * 0.32), f"•  {item}", fontsize=8.5, color='#1e3a8a')

    # Layer 2: API Gateway / Routing
    p_gw = patches.FancyBboxPatch((4.0, 4.4), 3.0, 2.1, boxstyle="round,pad=0.1,rounding_size=0.15",
                                 linewidth=1.5, edgecolor='#6366f1', facecolor='#eef2ff')
    ax.add_patch(p_gw)
    ax.text(5.5, 6.25, 'Application Layer (Node.js / Express)', ha='center', va='center',
            fontsize=10.5, fontweight='bold', color='#4338ca')

    gw_items = [
        "Express REST Routing & Controllers",
        "JWT Authentication & RBAC Middleware",
        "Multer Resume File Storage Handler",
        "Centralized Error Handler",
        "Job CRUD & Analytics Services"
    ]
    for i, item in enumerate(gw_items):
        ax.text(4.2, 5.9 - (i * 0.32), f"•  {item}", fontsize=8.5, color='#312e81')

    # Layer 3: AI / NLP Engine
    p_ai = patches.FancyBboxPatch((7.5, 4.4), 3.0, 2.1, boxstyle="round,pad=0.1,rounding_size=0.15",
                                 linewidth=1.5, edgecolor='#059669', facecolor='#ecfdf5')
    ax.add_patch(p_ai)
    ax.text(9.0, 6.25, 'AI / NLP Matching Services', ha='center', va='center',
            fontsize=10.5, fontweight='bold', color='#047857')

    ai_items = [
        "Resume Parser (pdf-parse / mammoth)",
        "Compromise NLP Entity & Skill Extractor",
        "Natural Library TF-IDF Semantic Fit",
        "Multi-Factor Scoring Engine (50/25/15/10)",
        "Recommendation Classification Engine"
    ]
    for i, item in enumerate(ai_items):
        ax.text(7.7, 5.9 - (i * 0.32), f"•  {item}", fontsize=8.5, color='#064e3b')

    # Connecting Arrows Layer 1 <-> Layer 2 <-> Layer 3
    ax.annotate('', xy=(4.0, 5.45), xytext=(3.5, 5.45),
                arrowprops=dict(arrowstyle='<->', lw=2, color='#475569'))
    ax.text(3.75, 5.65, 'REST API\n(JWT)', ha='center', va='center', fontsize=7.5, color='#475569')

    ax.annotate('', xy=(7.5, 5.45), xytext=(7.0, 5.45),
                arrowprops=dict(arrowstyle='<->', lw=2, color='#475569'))
    ax.text(7.25, 5.65, 'Service\nCalls', ha='center', va='center', fontsize=7.5, color='#475569')

    # Layer 4: Data Layer (MongoDB)
    p_db = patches.FancyBboxPatch((1.5, 0.8), 8.0, 2.6, boxstyle="round,pad=0.1,rounding_size=0.15",
                                 linewidth=1.5, edgecolor='#0d9488', facecolor='#f0fdfa')
    ax.add_patch(p_db)
    ax.text(5.5, 3.1, 'Database Layer (MongoDB + Mongoose ODM)', ha='center', va='center',
            fontsize=11, fontweight='bold', color='#0f766e')

    # 4 Collections in DB
    cols = [
        ("Users Collection", ["_id, name, email", "password (bcrypt)", "role: recruiter/candidate", "company, title, phone"], 1.8),
        ("Jobs Collection", ["_id, title, company", "requiredSkills: [String]", "min/maxExperience", "educationRequirement, status"], 3.8),
        ("CandidateProfiles", ["_id, user, fileUrl", "parsedData (skills, exp)", "rawText, parsingMetadata", "confidenceScore"], 5.8),
        ("Applications", ["_id, job, candidate", "stage (6-stage Kanban)", "matchAnalysis (scores)", "interviewDetails, stageHistory"], 7.8),
    ]

    for title, fields, x_pos in cols:
        p_c = patches.FancyBboxPatch((x_pos, 1.05), 1.8, 1.8, boxstyle="round,pad=0.08,rounding_size=0.08",
                                     linewidth=1, edgecolor='#99f6e4', facecolor='#ffffff')
        ax.add_patch(p_c)
        ax.text(x_pos + 0.9, 2.65, title, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#115e59')
        for idx, f in enumerate(fields):
            ax.text(x_pos + 0.1, 2.35 - (idx * 0.32), f"• {f}", fontsize=7.5, color='#134e4a')

    # Arrow from App Layer down to DB Layer
    ax.annotate('', xy=(5.5, 3.4), xytext=(5.5, 4.4),
                arrowprops=dict(arrowstyle='<->', lw=2.2, color='#0f766e'))
    ax.text(5.85, 3.9, 'Mongoose Schemas & Indexing\n(BSON Documents)', ha='left', va='center', fontsize=8, color='#0f766e')

    plt.tight_layout()
    plt.savefig('diagrams/system_architecture.png', dpi=300, bbox_inches='tight')
    plt.close()
    print('System architecture diagram generated.')

# ==========================================
# 2. CLASS DIAGRAM
# ==========================================
def create_class_diagram():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 8.5)
    ax.axis('off')

    fig.patch.set_facecolor('#ffffff')
    ax.set_facecolor('#ffffff')

    ax.text(5.5, 8.15, 'AI-Assisted Recruitment System - UML Class Diagram', ha='center', va='center',
            fontsize=15, fontweight='bold', color='#1e293b')
    ax.text(5.5, 7.85, 'Entity Relationships and Mongoose Domain Model', ha='center', va='center',
            fontsize=10.5, fontstyle='italic', color='#64748b')

    # Helper function for UML Class Box
    def draw_class(x, y, w, h, name, attributes, methods, color_hdr='#2563eb', color_bg='#eff6ff'):
        # Outer box
        p_box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.05,rounding_size=0.08",
                                      linewidth=1.2, edgecolor='#1e293b', facecolor='#ffffff')
        ax.add_patch(p_box)
        # Header box
        hdr_h = 0.55
        p_hdr = patches.Rectangle((x, y + h - hdr_h), w, hdr_h, linewidth=1.2, edgecolor='#1e293b', facecolor=color_hdr)
        ax.add_patch(p_hdr)
        ax.text(x + w/2, y + h - hdr_h/2, name, ha='center', va='center', fontsize=10, fontweight='bold', color='#ffffff')

        # Attributes section
        cur_y = y + h - hdr_h - 0.25
        for attr in attributes:
            ax.text(x + 0.15, cur_y, attr, fontsize=7.8, color='#0f172a')
            cur_y -= 0.24

        # Divider line
        div_y = y + 0.8
        ax.plot([x, x + w], [div_y, div_y], color='#94a3b8', lw=0.8)

        # Methods section
        m_y = div_y - 0.22
        for m in methods:
            ax.text(x + 0.15, m_y, m, fontsize=7.8, color='#0369a1', fontstyle='italic')
            m_y -= 0.24

    # 1. User Class
    u_attrs = [
        "- _id: ObjectId",
        "- name: String",
        "- email: String [unique]",
        "- password: String [hashed]",
        "- role: Enum ('recruiter', 'candidate')",
        "- company: String",
        "- title: String",
        "- phone: String",
        "- createdAt: Date"
    ]
    u_methods = [
        "+ pre('save'): hashPassword()",
        "+ matchPassword(pwd): Boolean"
    ]
    draw_class(0.6, 4.3, 3.0, 3.2, "User", u_attrs, u_methods, '#1d4ed8')

    # 2. Job Class
    j_attrs = [
        "- _id: ObjectId",
        "- title: String",
        "- company: String",
        "- department: String",
        "- location: String",
        "- type: Enum ('Full-Time', ...)",
        "- description: String",
        "- requiredSkills: [String]",
        "- optionalSkills: [String]",
        "- minExperience: Number",
        "- maxExperience: Number",
        "- educationRequirement: Enum",
        "- recruiter: ObjectId -> User",
        "- applicantsCount: Number"
    ]
    j_methods = [
        "+ textIndex(title, desc, skills)"
    ]
    draw_class(7.4, 4.0, 3.0, 3.5, "Job", j_attrs, j_methods, '#0284c7')

    # 3. CandidateProfile Class
    cp_attrs = [
        "- _id: ObjectId",
        "- user: ObjectId -> User",
        "- originalFileName: String",
        "- fileUrl: String",
        "- mimeType: String",
        "- parsedData: Object",
        "    • name, email, phone",
        "    • skills: [String]",
        "    • totalYearsExperience: Number",
        "    • highestEducation: String",
        "    • experience: [Experience]",
        "    • education: [Education]",
        "- rawText: String",
        "- parsingMetadata: Object"
    ]
    cp_methods = [
        "+ parseResume(buffer, mime)"
    ]
    draw_class(0.6, 0.5, 3.0, 3.4, "CandidateProfile", cp_attrs, cp_methods, '#059669')

    # 4. Application Class
    app_attrs = [
        "- _id: ObjectId",
        "- job: ObjectId -> Job",
        "- candidate: ObjectId -> User",
        "- candidateProfile: ObjectId -> CandidateProfile",
        "- stage: Enum ('Applied', 'Screened', ...)",
        "- stageHistory: [StageHistory]",
        "- matchAnalysis: Object",
        "    • overallScore: Number",
        "    • skillsScore, expScore, eduScore",
        "    • recommendation: Enum",
        "- interviewDetails: Object",
        "- recruiterNotes: String"
    ]
    app_methods = [
        "+ compoundIndex(job, candidate)"
    ]
    draw_class(7.4, 0.3, 3.0, 3.4, "Application", app_attrs, app_methods, '#7c3aed')

    # Draw Relationship Lines & Cardinalities
    # User (Recruiter) to Job: 1 to 0..*
    ax.annotate('', xy=(7.4, 5.9), xytext=(3.6, 5.9),
                arrowprops=dict(arrowstyle='->', lw=1.5, color='#334155'))
    ax.text(3.8, 6.05, "1 (recruiter)", fontsize=8, color='#334155')
    ax.text(7.1, 6.05, "0..* posts", fontsize=8, color='#334155', ha='right')

    # User (Candidate) to CandidateProfile: 1 to 0..1
    ax.annotate('', xy=(2.1, 3.9), xytext=(2.1, 4.3),
                arrowprops=dict(arrowstyle='->', lw=1.5, color='#334155'))
    ax.text(2.2, 4.15, "1", fontsize=8, color='#334155')
    ax.text(2.2, 3.95, "0..1 owns", fontsize=8, color='#334155')

    # Job to Application: 1 to 0..*
    ax.annotate('', xy=(8.9, 3.7), xytext=(8.9, 4.0),
                arrowprops=dict(arrowstyle='->', lw=1.5, color='#334155'))
    ax.text(9.0, 3.85, "1", fontsize=8, color='#334155')
    ax.text(9.0, 3.65, "0..* has", fontsize=8, color='#334155')

    # CandidateProfile to Application: 1 to 0..*
    ax.annotate('', xy=(7.4, 2.0), xytext=(3.6, 2.0),
                arrowprops=dict(arrowstyle='->', lw=1.5, color='#334155'))
    ax.text(3.8, 2.15, "1", fontsize=8, color='#334155')
    ax.text(7.1, 2.15, "0..* evaluated", fontsize=8, color='#334155', ha='right')

    plt.tight_layout()
    plt.savefig('diagrams/class_diagram.png', dpi=300, bbox_inches='tight')
    plt.close()
    print('Class diagram generated.')

# ==========================================
# 3. SEQUENCE DIAGRAM
# ==========================================
def create_sequence_diagram():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 8.5)
    ax.axis('off')

    fig.patch.set_facecolor('#ffffff')
    ax.set_facecolor('#ffffff')

    ax.text(5.5, 8.15, 'AI-Assisted Recruitment System - Sequence Diagram', ha='center', va='center',
            fontsize=15, fontweight='bold', color='#1e293b')
    ax.text(5.5, 7.85, 'End-to-End Workflow: Ingestion, Multi-Factor Scoring, and Shortlisting', ha='center', va='center',
            fontsize=10.5, fontstyle='italic', color='#64748b')

    # Participants
    actors = [
        ("Candidate / Recruiter", 1.2),
        ("React UI (Client)", 3.1),
        ("Express REST API", 5.0),
        ("Resume Parser / NLP", 6.9),
        ("Matching Engine", 8.6),
        ("MongoDB Store", 10.1)
    ]

    top_y = 7.3
    bot_y = 0.6

    for name, x in actors:
        # Box header
        p = patches.FancyBboxPatch((x - 0.75, top_y - 0.2), 1.5, 0.45,
                                  boxstyle="round,pad=0.04,rounding_size=0.06",
                                  linewidth=1, edgecolor='#1e293b', facecolor='#e0e7ff')
        ax.add_patch(p)
        ax.text(x, top_y, name, ha='center', va='center', fontsize=8, fontweight='bold', color='#1e1b4b')
        # Lifeline
        ax.plot([x, x], [top_y - 0.2, bot_y], color='#94a3b8', linestyle='--', lw=1)

    # Sequence Messages
    steps = [
        # (y, from_x, to_x, label, is_return, color)
        (6.7, 1.2, 3.1, "1. Upload Resume File (PDF/DOCX)", False, '#2563eb'),
        (6.4, 3.1, 5.0, "2. POST /api/resume/upload (FormData)", False, '#2563eb'),
        (6.1, 5.0, 6.9, "3. parseResume(buffer, mime)", False, '#059669'),
        (5.8, 6.9, 6.9, "   NLP Entity & Skill Extraction", False, '#059669'), # self
        (5.5, 6.9, 5.0, "4. Return Extracted Profile JSON", True, '#059669'),
        (5.2, 5.0, 10.1, "5. Save CandidateProfile Document", False, '#0d9488'),
        (4.9, 5.0, 3.1, "6. HTTP 201: CandidateProfile Created", True, '#2563eb'),
        (4.5, 1.2, 3.1, "7. One-Click Apply to Open Job", False, '#2563eb'),
        (4.2, 3.1, 5.0, "8. POST /api/applications/apply/:jobId", False, '#2563eb'),
        (3.9, 5.0, 10.1, "9. Fetch Job Specs & CandidateProfile", False, '#0d9488'),
        (3.6, 5.0, 8.6, "10. evaluateMatch(job, candidateProfile)", False, '#7c3aed'),
        (3.3, 8.6, 8.6, "    Weighted Scoring: 50/25/15/10", False, '#7c3aed'), # self
        (3.0, 8.6, 5.0, "11. Return OverallScore & Breakdown", True, '#7c3aed'),
        (2.7, 5.0, 10.1, "12. Save Application (Stage='Applied')", False, '#0d9488'),
        (2.4, 5.0, 3.1, "13. HTTP 201: Instant AI Fit Feedback", True, '#2563eb'),
        (2.0, 1.2, 3.1, "14. Recruiter views 6-Stage Kanban Board", False, '#d97706'),
        (1.7, 3.1, 5.0, "15. PUT /applications/:id/stage ('Interview Scheduled')", False, '#d97706'),
        (1.4, 5.0, 10.1, "16. Update Stage & Audit History Note", False, '#0d9488'),
        (1.1, 5.0, 3.1, "17. HTTP 200: Live Board Updated", True, '#d97706'),
        (0.8, 3.1, 1.2, "18. Display Scheduled Interview Alert & Meet Link", True, '#d97706'),
    ]

    for y, x1, x2, label, is_ret, col in steps:
        if x1 == x2: # self call
            ax.annotate('', xy=(x1, y - 0.15), xytext=(x1 + 0.5, y),
                        arrowprops=dict(arrowstyle='->', lw=1.2, color=col))
            ax.plot([x1, x1 + 0.5], [y, y], color=col, lw=1.2)
            ax.plot([x1 + 0.5, x1 + 0.5], [y, y - 0.15], color=col, lw=1.2)
            ax.text(x1 + 0.55, y - 0.08, label, fontsize=7.5, color=col, va='center')
        else:
            style = '<-' if is_ret and x1 < x2 else '->'
            line_style = ':' if is_ret else '-'
            ax.annotate('', xy=(x2, y), xytext=(x1, y),
                        arrowprops=dict(arrowstyle=style, lw=1.2, color=col, linestyle=line_style))
            mid_x = (x1 + x2) / 2
            ax.text(mid_x, y + 0.09, label, ha='center', va='bottom', fontsize=7.5, color=col, fontweight='bold' if not is_ret else 'normal')

    plt.tight_layout()
    plt.savefig('diagrams/sequence_diagram.png', dpi=300, bbox_inches='tight')
    plt.close()
    print('Sequence diagram generated.')

if __name__ == '__main__':
    create_system_architecture()
    create_class_diagram()
    create_sequence_diagram()
