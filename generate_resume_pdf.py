import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Draw a line above footer
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 40, letter[0]-54, 40)
        
        # Text
        text = f"Saurav Kumar  |  MERN Stack Developer  |  Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0]-54, 25, text)
        self.restoreState()

def create_resume(output_filename):
    # Setup document
    # Left, right, top, bottom margins
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=55
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    primary_color = colors.HexColor("#0f172a") # Slate 900
    secondary_color = colors.HexColor("#0284c7") # Sky 600
    text_color = colors.HexColor("#334155") # Slate 700
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        textColor=primary_color,
        leading=28,
        alignment=0 # Left
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=secondary_color,
        leading=16,
        alignment=0
    )
    
    contact_style = ParagraphStyle(
        'ContactText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=colors.HexColor("#475569"),
        leading=12,
        alignment=0
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=primary_color,
        leading=16,
        spaceAfter=4,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=text_color,
        leading=12
    )
    
    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=text_color,
        leading=12,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3
    )
    
    bold_body_style = ParagraphStyle(
        'BoldBodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        textColor=text_color,
        leading=12
    )
    
    story = []
    
    # --- HEADER SECTION ---
    header_data = [
        [
            Paragraph("SAURAV KUMAR", title_style),
            Paragraph("sauravkumardp62@gmail.com<br/>+91-6206525733<br/>Gurugram, India", contact_style)
        ]
    ]
    header_table = Table(header_data, colWidths=[330, 202])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (1,0), (1,0), 'RIGHT'),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 4))
    story.append(Paragraph("MERN Stack Developer", subtitle_style))
    story.append(Spacer(1, 10))
    
    # Decorative line
    line_table = Table([[""]], colWidths=[532], rowHeights=[2])
    line_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), secondary_color),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(line_table)
    story.append(Spacer(1, 10))
    
    # --- SUMMARY ---
    story.append(Paragraph("SUMMARY", section_heading))
    summary_text = (
        "MERN Stack Developer with hands-on experience in building dynamic and responsive web "
        "applications using MongoDB, Express.js, React.js, and Node.js. Experienced in developing "
        "user-centric interfaces, backend integration, and database-driven features. Seeking MERN "
        "Stack Developer internship or junior-level role to contribute to real-world projects and grow professionally."
    )
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 10))
    
    # --- SKILLS ---
    story.append(Paragraph("TECHNICAL SKILLS", section_heading))
    skills_data = [
        [Paragraph("<b>Frontend:</b>", bold_body_style), Paragraph("HTML5, CSS3, JavaScript (ES6+), React.js, Next.js", body_style)],
        [Paragraph("<b>Backend:</b>", bold_body_style), Paragraph("Node.js, Express.js", body_style)],
        [Paragraph("<b>Database:</b>", bold_body_style), Paragraph("MongoDB", body_style)],
        [Paragraph("<b>Tools & Tech:</b>", bold_body_style), Paragraph("Git, GitHub, VS Code", body_style)],
    ]
    skills_table = Table(skills_data, colWidths=[90, 442])
    skills_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(skills_table)
    story.append(Spacer(1, 10))
    
    # --- PROJECTS ---
    story.append(Paragraph("PROJECTS", section_heading))
    
    # Project 1
    proj1_title = "<b>Stay Vo Student Accommodation Platform</b> | <font color='#0284c7'>MERN Stack</font>"
    story.append(Paragraph(proj1_title, bold_body_style))
    story.append(Paragraph("&bull; Developed a MERN-based web platform to assist students and newcomers in finding accommodation.", bullet_style))
    story.append(Paragraph("&bull; Designed responsive interfaces using React.js for seamless desktop and mobile viewports.", bullet_style))
    story.append(Paragraph("&bull; Implemented robust backend functionality using Node.js and Express.js.", bullet_style))
    story.append(Paragraph("&bull; Integrated MongoDB for managing housing listings, user bookings, and application data.", bullet_style))
    story.append(Spacer(1, 6))
    
    # Project 2
    proj2_title = "<b>MultiCart E-commerce Platform</b> | <font color='#0284c7'>MERN Stack</font>"
    story.append(Paragraph(proj2_title, bold_body_style))
    story.append(Paragraph("&bull; Developed a fully functional full-stack e-commerce application allowing users to browse products, manage a shopping cart, and place orders securely.", bullet_style))
    story.append(Paragraph("&bull; Built dynamic and responsive frontend user interfaces using React.js and Next.js, managing application state efficiently.", bullet_style))
    story.append(Paragraph("&bull; Created robust RESTful APIs using Node.js and Express.js to handle product catalogs, user authentication, and order processing logic.", bullet_style))
    story.append(Paragraph("&bull; Designed and optimized database schemas in MongoDB for fast and scalable storage of product and user data.", bullet_style))
    story.append(Spacer(1, 6))
    
    # Project 3
    proj3_title = "<b>Loadgo Transportation Platform</b> | <font color='#0284c7'>MERN Stack</font>"
    story.append(Paragraph(proj3_title, bold_body_style))
    story.append(Paragraph("&bull; Developed a logistics and intra-city transportation application, operating on a model similar to Porter, connecting users with reliable delivery vehicles.", bullet_style))
    story.append(Paragraph("&bull; Designed an intuitive frontend using React.js and Next.js for seamless ride booking, vehicle category selection, and order management.", bullet_style))
    story.append(Paragraph("&bull; Engineered backend architecture with Node.js and Express.js to manage driver allocation, distance-based fare calculation, and secure API routing.", bullet_style))
    story.append(Paragraph("&bull; Utilized MongoDB to efficiently store and scale user profiles, driver details, fleet information, and ride histories.", bullet_style))
    story.append(Spacer(1, 10))
    
    # --- INTERNSHIPS ---
    story.append(Paragraph("WORK EXPERIENCE / INTERNSHIPS", section_heading))
    
    # Intern 1
    intern1_title = "<b>Apna College</b> | MERN Stack Developer Intern (Online)"
    story.append(Paragraph(intern1_title, bold_body_style))
    story.append(Paragraph("&bull; Developed MERN stack applications with focus on frontend-backend coordination.", bullet_style))
    story.append(Paragraph("&bull; Worked on real-world project structure and collaborative development practices.", bullet_style))
    story.append(Spacer(1, 6))
    
    # Intern 2
    intern2_title = "<b>INFOWIZ Software Solutions</b> | Python Programming Intern (Offline, Jul 2022 - Aug 2022)"
    story.append(Paragraph(intern2_title, bold_body_style))
    story.append(Paragraph("&bull; Worked on Python programming fundamentals and algorithmic problem-solving exercises.", bullet_style))
    story.append(Paragraph("&bull; Assisted in developing training materials and hands-on practice tasks for student batches.", bullet_style))
    story.append(Paragraph("&bull; Gained experience in writing clean, structured, and modular Python code.", bullet_style))
    story.append(Spacer(1, 10))
    
    # --- EDUCATION & CERTIFICATIONS ---
    edu_content = [
        Paragraph("EDUCATION", section_heading),
        Paragraph("<b>B.Tech in Computer Science and Engineering</b> (2023 - Present)<br/>Global Institute of Technology and Management, Gurugram", body_style),
        Spacer(1, 4),
        Paragraph("<b>Diploma in Computer Science</b><br/>Government Polytechnic, Adampur", body_style)
    ]
    
    cert_content = [
        Paragraph("CERTIFICATIONS", section_heading),
        Paragraph("&bull; MERN Stack Developer Certification", bullet_style),
        Paragraph("&bull; Python Programming Certification", bullet_style)
    ]
    
    layout_data = [
        [edu_content, cert_content]
    ]
    layout_table = Table(layout_data, colWidths=[266, 266])
    layout_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    
    story.append(layout_table)
    
    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)

if __name__ == "__main__":
    create_resume("/Users/sauravkumar/Desktop/load Go/portfolio/saurav_kumar_resume.pdf")
    print("Resume generated successfully!")
