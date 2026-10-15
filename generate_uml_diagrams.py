"""
generate_uml_diagrams.py
Generates presentation-ready high-resolution UML Use Case Diagram and ER Diagram
for the AI-Assisted Recruitment System.
"""

import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

os.makedirs('diagrams', exist_ok=True)
plt.rcParams['font.family'] = 'DejaVu Sans'

# ==========================================
# 1. USE CASE DIAGRAM (Slide 5)
# ==========================================
def create_use_case_diagram():
    fig, ax = plt.subplots(figsize=(11.5, 7.5), dpi=300)
    ax.set_xlim(0, 11.5)
    ax.set_ylim(0, 7.5)
    ax.axis('off')

    fig.patch.set_facecolor('#ffffff')
    ax.set_facecolor('#ffffff')

    # Title header
    ax.text(5.75, 7.15, 'AI-Assisted Recruitment System — UML Use Case Diagram',
            ha='center', va='center', fontsize=14, fontweight='bold', color='#1b2a2e')
    ax.text(5.75, 6.85, 'Functional Boundary, Primary Actors & Automated AI Subsystems',
            ha='center', va='center', fontsize=9.5, fontstyle='italic', color='#7a8f8c')

    # System boundary box
    sys_box = patches.FancyBboxPatch((2.6, 0.4), 6.3, 6.2, boxstyle="round,pad=0.1,rounding_size=0.15",
                                     linewidth=1.8, edgecolor='#00a896', facecolor='#f4faf9')
    ax.add_patch(sys_box)
    ax.text(5.75, 6.35, 'SYSTEM BOUNDARY: AI-Assisted Recruitment System (AI Recruit Pro)',
            ha='center', va='center', fontsize=9, fontweight='bold', color='#028090')

    # Helper function to draw stick figure actor
    def draw_actor(x, y, label, role_color='#028090'):
        # Head
        head = patches.Circle((x, y + 0.5), 0.18, edgecolor=role_color, facecolor='#ffffff', linewidth=1.5)
        ax.add_patch(head)
        # Body
        ax.plot([x, x], [y + 0.32, y - 0.1], color=role_color, lw=1.6)
        # Arms
        ax.plot([x - 0.28, x + 0.28], [y + 0.18, y + 0.18], color=role_color, lw=1.6)
        # Legs
        ax.plot([x, x - 0.22], [y - 0.1, y - 0.45], color=role_color, lw=1.6)
        ax.plot([x, x + 0.22], [y - 0.1, y - 0.45], color=role_color, lw=1.6)
        # Label
        ax.text(x, y - 0.65, label, ha='center', va='top', fontsize=9.5, fontweight='bold', color='#1b2a2e')

    # Draw Primary Actors
    draw_actor(1.2, 3.8, 'Candidate\n(Job Seeker)', '#028090')
    draw_actor(10.3, 3.8, 'Recruiter\n(Hiring Manager)', '#00a896')

    # Use Cases (Ellipses inside boundary)
    use_cases = [
        # (id, name, x, y, width, height, actors_connected, category)
        ('uc1', 'User Registration &\nJWT Authentication', 5.75, 5.7, 2.6, 0.75, ['cand', 'rec'], '#ffffff'),
        ('uc2', 'Upload & Parse Resume\n(PDF / DOCX / TXT)', 4.2, 4.6, 2.5, 0.72, ['cand'], '#ffffff'),
        ('uc3', 'Browse & Filter\nJob Requisitions', 4.2, 3.55, 2.5, 0.68, ['cand'], '#ffffff'),
        ('uc4', 'Submit 1-Click Application\nwith Instant AI Fit Score', 4.2, 2.5, 2.6, 0.72, ['cand'], '#ffffff'),
        ('uc5', 'Track Pipeline Stage &\nInterview Meeting Links', 4.2, 1.45, 2.6, 0.72, ['cand'], '#ffffff'),
        
        ('uc6', 'Create & Manage\nJob Postings (CRUD)', 7.3, 4.6, 2.5, 0.72, ['rec'], '#ffffff'),
        ('uc7', 'View AI Ranked Candidates\n(50/25/15/10 Score Breakdown)', 7.3, 3.55, 2.6, 0.72, ['rec'], '#ffffff'),
        ('uc8', '6-Stage Kanban Shortlisting\n(Applied -> Selected/Rejected)', 7.3, 2.5, 2.6, 0.72, ['rec'], '#ffffff'),
        ('uc9', 'Schedule Interviews &\nRecruitment Analytics', 7.3, 1.45, 2.6, 0.72, ['rec'], '#ffffff'),
    ]

    uc_dict = {}
    for ucid, label, cx, cy, w, h, connected, bg_col in use_cases:
        ellipse = patches.Ellipse((cx, cy), w, h, edgecolor='#00a896', facecolor=bg_col, linewidth=1.2)
        ax.add_patch(ellipse)
        ax.text(cx, cy, label, ha='center', va='center', fontsize=7.6, color='#1b2a2e', multialignment='center')
        uc_dict[ucid] = (cx, cy, w, h)

    # Actor association lines
    cand_pos = (1.45, 3.8)
    rec_pos = (10.05, 3.8)

    # Connect Candidate
    cand_targets = [('uc1', 4.5, 5.7), ('uc2', 3.0, 4.6), ('uc3', 3.0, 3.55), ('uc4', 3.0, 2.5), ('uc5', 3.0, 1.45)]
    for ucid, tx, ty in cand_targets:
        ax.plot([cand_pos[0], tx], [cand_pos[1], ty], color='#028090', lw=1.2, alpha=0.85)

    # Connect Recruiter
    rec_targets = [('uc1', 7.0, 5.7), ('uc6', 8.55, 4.6), ('uc7', 8.6, 3.55), ('uc8', 8.6, 2.5), ('uc9', 8.6, 1.45)]
    for ucid, tx, ty in rec_targets:
        ax.plot([rec_pos[0], tx], [rec_pos[1], ty], color='#00a896', lw=1.2, alpha=0.85)

    # Include dependencies (Dashed arrows between use cases)
    # uc2 -> uc4 (include resume in apply)
    # uc7 includes matching engine
    ax.annotate('', xy=(5.5, 4.4), xytext=(6.0, 3.8),
                arrowprops=dict(arrowstyle='->', lw=1, color='#7a8f8c', linestyle='--'))
    ax.text(5.75, 4.05, '<<include>>\nProfile Data', fontsize=6.5, color='#7a8f8c', ha='center')

    ax.annotate('', xy=(6.0, 2.7), xytext=(5.5, 2.7),
                arrowprops=dict(arrowstyle='->', lw=1, color='#7a8f8c', linestyle='--'))
    ax.text(5.75, 2.85, '<<include>>\nFit Score', fontsize=6.5, color='#7a8f8c', ha='center')

    plt.tight_layout()
    plt.savefig('diagrams/use_case_diagram.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Use Case diagram generated at diagrams/use_case_diagram.png")


# ==========================================
# 2. ER DIAGRAM / DATABASE DESIGN (Slide 6)
# ==========================================
def create_er_diagram():
    fig, ax = plt.subplots(figsize=(12, 7.5), dpi=300)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 7.5)
    ax.axis('off')

    fig.patch.set_facecolor('#ffffff')
    ax.set_facecolor('#ffffff')

    ax.text(6.0, 7.15, 'AI-Assisted Recruitment System — Entity-Relationship / Database Schema',
            ha='center', va='center', fontsize=14, fontweight='bold', color='#1b2a2e')
    ax.text(6.0, 6.85, 'MongoDB Document Collections, References, and Embedded Structures',
            ha='center', va='center', fontsize=9.5, fontstyle='italic', color='#7a8f8c')

    # Helper function to draw an Entity table box
    def draw_entity(x, y, w, h, title, fields, border_col='#00a896', hdr_bg='#00a896'):
        # Outer box
        p_box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.04,rounding_size=0.08",
                                      linewidth=1.4, edgecolor=border_col, facecolor='#ffffff')
        ax.add_patch(p_box)
        # Header box
        hdr_h = 0.52
        p_hdr = patches.Rectangle((x, y + h - hdr_h), w, hdr_h, linewidth=1.4, edgecolor=border_col, facecolor=hdr_bg)
        ax.add_patch(p_hdr)
        ax.text(x + w/2, y + h - hdr_h/2, title, ha='center', va='center', fontsize=9.5, fontweight='bold', color='#ffffff')

        # Fields
        cur_y = y + h - hdr_h - 0.24
        for field, is_pk, is_fk in fields:
            prefix = "[PK] " if is_pk else ("[FK] " if is_fk else " •  ")
            col = '#00a896' if is_pk else ('#028090' if is_fk else '#1b2a2e')
            fontw = 'bold' if (is_pk or is_fk) else 'normal'
            ax.text(x + 0.12, cur_y, f"{prefix}{field}", fontsize=7.2, color=col, fontweight=fontw)
            cur_y -= 0.21

    # 1. USER Entity
    u_fields = [
        ("_id: ObjectId", True, False),
        ("name: String", False, False),
        ("email: String [Unique]", False, False),
        ("password: String [Bcrypt]", False, False),
        ("role: Enum('recruiter','candidate')", False, False),
        ("company: String", False, False),
        ("title: String", False, False),
        ("phone: String", False, False),
        ("avatar: String", False, False),
        ("createdAt, updatedAt: Date", False, False),
    ]
    draw_entity(0.5, 3.8, 2.7, 2.8, "USERS (users)", u_fields, '#1b2a2e', '#1b2a2e')

    # 2. JOB Entity
    j_fields = [
        ("_id: ObjectId", True, False),
        ("recruiter: ObjectId -> Users", False, True),
        ("title: String", False, False),
        ("company: String", False, False),
        ("department: String", False, False),
        ("location: String", False, False),
        ("type: Enum('Full-Time',...)", False, False),
        ("requiredSkills: [String]", False, False),
        ("optionalSkills: [String]", False, False),
        ("minExperience, maxExp: Number", False, False),
        ("educationRequirement: Enum", False, False),
        ("applicantsCount: Number", False, False),
    ]
    draw_entity(8.8, 3.7, 2.7, 2.9, "JOBS (jobs)", j_fields, '#028090', '#028090')

    # 3. CANDIDATE PROFILE Entity
    cp_fields = [
        ("_id: ObjectId", True, False),
        ("user: ObjectId -> Users", False, True),
        ("originalFileName: String", False, False),
        ("fileUrl: String, mimeType: String", False, False),
        ("parsedData: Subdocument", False, False),
        ("  - name, email, phone: String", False, False),
        ("  - skills: [String] (500+ Taxonomy)", False, False),
        ("  - totalYearsExperience: Number", False, False),
        ("  - highestEducation: Enum", False, False),
        ("  - experience: [Subdocument]", False, False),
        ("  - education: [Subdocument]", False, False),
        ("rawText, parsingMetadata", False, False),
    ]
    draw_entity(0.5, 0.5, 2.7, 2.95, "CANDIDATE_PROFILES", cp_fields, '#00a896', '#00a896')

    # 4. APPLICATION Entity
    app_fields = [
        ("_id: ObjectId", True, False),
        ("job: ObjectId -> Jobs", False, True),
        ("candidate: ObjectId -> Users", False, True),
        ("candidateProfile: ObjectId -> CP", False, True),
        ("stage: Enum('Applied',...6 Stages)", False, False),
        ("stageHistory: [Subdocument]", False, False),
        ("matchAnalysis: Subdocument", False, False),
        ("  - overallScore: Number (0-100%)", False, False),
        ("  - skills, exp, edu, semanticScore", False, False),
        ("  - matchedSkills, missingSkills", False, False),
        ("  - recommendation: Enum", False, False),
        ("interviewDetails: Subdocument", False, False),
        ("recruiterNotes: String", False, False),
    ]
    draw_entity(4.7, 0.4, 3.7, 3.15, "APPLICATIONS (applications)", app_fields, '#02c39a', '#028090')

    # Relationship connectors
    # User (Recruiter) -> Jobs: 1 to N
    ax.annotate('', xy=(8.8, 5.2), xytext=(3.2, 5.2),
                arrowprops=dict(arrowstyle='->', lw=1.6, color='#1b2a2e'))
    ax.text(3.35, 5.35, "1 (Recruiter)", fontsize=8, fontweight='bold', color='#1b2a2e')
    ax.text(8.65, 5.35, "0..* Posts", fontsize=8, fontweight='bold', color='#028090', ha='right')

    # User (Candidate) -> CandidateProfile: 1 to 0..1
    ax.annotate('', xy=(1.8, 3.45), xytext=(1.8, 3.8),
                arrowprops=dict(arrowstyle='->', lw=1.6, color='#00a896'))
    ax.text(1.9, 3.65, "1 to 0..1 Owns", fontsize=7.8, fontweight='bold', color='#00a896')

    # CandidateProfile -> Applications: 1 to N
    ax.annotate('', xy=(4.7, 1.8), xytext=(3.2, 1.8),
                arrowprops=dict(arrowstyle='->', lw=1.6, color='#00a896'))
    ax.text(3.35, 1.95, "1", fontsize=8, fontweight='bold', color='#00a896')
    ax.text(4.55, 1.95, "0..* Used", fontsize=8, fontweight='bold', color='#00a896', ha='right')

    # Jobs -> Applications: 1 to N
    ax.annotate('', xy=(8.4, 1.8), xytext=(9.8, 3.7),
                arrowprops=dict(arrowstyle='->', lw=1.6, color='#028090'))
    ax.text(9.9, 3.5, "1", fontsize=8, fontweight='bold', color='#028090')
    ax.text(8.5, 2.1, "0..* Receives", fontsize=8, fontweight='bold', color='#028090', ha='right')

    # User (Candidate) -> Applications: 1 to N
    ax.annotate('', xy=(5.2, 3.55), xytext=(3.2, 4.4),
                arrowprops=dict(arrowstyle='->', lw=1.6, color='#1b2a2e'))
    ax.text(3.4, 4.5, "1 (Candidate)", fontsize=7.8, fontweight='bold', color='#1b2a2e')
    ax.text(5.0, 3.7, "0..* Submits", fontsize=7.8, fontweight='bold', color='#1b2a2e')

    # Indexing notice box
    info_box = patches.FancyBboxPatch((4.7, 4.2), 3.7, 2.2, boxstyle="round,pad=0.08,rounding_size=0.08",
                                      linewidth=1, edgecolor='#d7e7e5', facecolor='#f4faf9')
    ax.add_patch(info_box)
    ax.text(6.55, 6.15, 'Database Integrity & Schema Optimizations', ha='center', va='center',
            fontsize=8.5, fontweight='bold', color='#1b2a2e')
    notes = [
        "• Unique Index: users.email",
        "• Compound Unique Index: applications(job, candidate)",
        "• Text Search Index: jobs(title, description, skills)",
        "• Foreign Key Referencing: Mongoose ObjectId refs",
        "• Embedded Subdocuments for high-read performance",
        "• Audit Logging: stageHistory array preserves state history"
    ]
    for i, n in enumerate(notes):
        ax.text(4.9, 5.8 - (i * 0.28), n, fontsize=7.2, color='#3e5c58')

    plt.tight_layout()
    plt.savefig('diagrams/er_diagram.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("ER diagram generated at diagrams/er_diagram.png")

if __name__ == '__main__':
    create_use_case_diagram()
    create_er_diagram()
