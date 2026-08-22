import json
from sqlalchemy.orm import Session
from app.models import Profile, Project, Skill, Experience, VirtualFile, AdminUser
from app.auth import get_password_hash
from app.config import settings

FASTFETCH_ASCII_DEFAULT = """
                    'c.
                 ,xNMM.
               .OMMMMo
               OMMM0,
     .;loddo:' loddol;.
   cKMMMMMMMMMMNWMMMMMMK.
 .KMMMMMMMMMMMMMMMMMMMMMK.
 :MMMMMMMMMMMMMMMMMMMMMMM:
 :MMMMMMMMMMMMMMMMMMMMMMM:
 .KMMMMMMMMMMMMMMMMMMMMMK.
   cKMMMMMMMMMMNWMMMMMMK.
     .;loddo:' loddol;.
               OMMM0,
               .OMMMMo
                 ,xNMM.
                    'c.
""".strip()

def seed_database(db: Session, force_reload: bool = False):
    if force_reload:
        db.query(VirtualFile).delete()
        db.query(Experience).delete()
        db.query(Skill).delete()
        db.query(Project).delete()
        db.query(Profile).delete()
        db.commit()

    # 1. Admin User
    admin = db.query(AdminUser).filter(AdminUser.username == settings.ADMIN_USERNAME).first()
    if not admin:
        admin = AdminUser(
            username=settings.ADMIN_USERNAME,
            hashed_password=get_password_hash(settings.ADMIN_PASSWORD)
        )
        db.add(admin)
        db.commit()

    # 2. Profile & Fastfetch Specs
    profile = db.query(Profile).first()
    specs = {
        "Name": "Ansh Ravi Kashyap",
        "Education": "B.E. Computer Science @ R.V. College of Engineering (CGPA: 9.55)",
        "Role": "Student Research Intern @ Samsung PRISM | Ex-SDE Intern @ Spiked.ai",
        "OS": "macOS Sequoia 15.2 (24C101) arm64",
        "Host": "MacBook Pro 16-inch (Apple M3 Max)",
        "Kernel": "Darwin 24.2.0 (xnu-11215.61.5~2)",
        "Uptime": "21 days, 8 hours, 42 mins",
        "Shell": "zsh 5.9 (arm64-apple-darwin24.0)",
        "Terminal": "macOS Terminal (Svelte + FastAPI + Postgres)",
        "Languages": "Python, C, C++, TypeScript, JavaScript, Dart, SQL",
        "Specializations": "Edge AI / NPU Quantization (AIMET), Full-Stack (Svelte, React, FastAPI)",
        "Interests": "Pianist (College Music Club), QuizCorp Trivia, Chess, Football",
        "Location": "Bangalore, Karnataka, India"
    }

    if not profile:
        profile = Profile(
            name="Ansh Ravi Kashyap",
            handle="anshrk",
            hostname="macbook-pro",
            title="Computer Science Engineer @ R.V. College of Engineering (CGPA: 9.55)",
            tagline="Edge AI Research Intern @ Samsung PRISM | Full-Stack Developer & Systems Enthusiast",
            bio=(
                "Computer Science undergraduate at R.V. College of Engineering (CGPA: 9.55). "
                "Researcher in Edge AI model quantization (RepViT, Qualcomm AIMET) at Samsung PRISM "
                "and full-stack engineer experienced in building real-time applications with Svelte, React, FastAPI, "
                "and PostgreSQL. Web Development Head at College Coding Club and classical pianist."
            ),
            location="Bangalore, Karnataka, India",
            email="anshrk.13@gmail.com",
            github="https://github.com/anshrk",
            linkedin="https://linkedin.com/in/anshrk",
            twitter="https://x.com/anshrk",
            website="https://anshrk.github.io",
            fastfetch_ascii=FASTFETCH_ASCII_DEFAULT,
            fastfetch_specs=specs
        )
        db.add(profile)
        db.commit()
    else:
        profile.name = "Ansh Ravi Kashyap"
        profile.handle = "anshrk"
        profile.title = "Computer Science Engineer @ R.V. College of Engineering (CGPA: 9.55)"
        profile.tagline = "Edge AI Research Intern @ Samsung PRISM | Full-Stack Developer & Systems Enthusiast"
        profile.bio = (
            "Computer Science undergraduate at R.V. College of Engineering (CGPA: 9.55). "
            "Researcher in Edge AI model quantization (RepViT, Qualcomm AIMET) at Samsung PRISM "
            "and full-stack engineer experienced in building real-time applications with Svelte, React, FastAPI, "
            "and PostgreSQL. Web Development Head at College Coding Club and classical pianist."
        )
        profile.location = "Bangalore, Karnataka, India"
        profile.email = "anshrk.13@gmail.com"
        profile.github = "https://github.com/anshrk"
        profile.linkedin = "https://linkedin.com/in/anshrk"
        profile.fastfetch_specs = specs
        db.commit()

    # 3. Projects from Resume
    if db.query(Project).count() == 0 or force_reload:
        projects = [
            Project(
                slug="aid-response",
                title="Aid-Response (Disaster Comm. & Mesh Network)",
                tagline="Fault-tolerant emergency communication digital twin & dynamic Dijkstra routing",
                description=(
                    "Built a fault-tolerant emergency communication digital twin featuring a real-time WebSocket "
                    "dashboard and dynamic Dijkstra routing for mission-critical disaster zones. "
                    "Implemented zero-trust encryption using the Web Crypto API and integrated automated emergency "
                    "alerts via Cisco Webex APIs."
                ),
                tech_stack=["React", "Node.js", "PostgreSQL", "Web Crypto API", "WebSockets", "Cisco Webex API"],
                tags=["Emergency Tech", "Mesh Network", "Real-Time", "Security", "Fullstack"],
                github_url="https://github.com/anshrk/aid-response",
                demo_url="https://aid-response.anshrk.dev",
                image_url="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
                featured=True,
                stars=142,
                sort_order=1
            ),
            Project(
                slug="churn-prediction-api",
                title="Customer Churn Prediction & Real-Time Risk API",
                tagline="End-to-end ML pipeline with real-time inference telemetry & Dockerized dashboard",
                description=(
                    "Deployed an end-to-end Machine Learning pipeline to classify customer churn risk in real-time "
                    "using XGBoost and FastAPI alongside a Dockerized Streamlit dashboard for business operators. "
                    "Integrated AWS DynamoDB via boto3 to securely record live inference telemetry and input features "
                    "for automated continuous model retraining."
                ),
                tech_stack=["FastAPI", "XGBoost", "Docker", "Streamlit", "AWS DynamoDB", "boto3", "Python"],
                tags=["Machine Learning", "FastAPI", "MLOps", "AWS Cloud", "Docker"],
                github_url="https://github.com/anshrk/churn-risk-api",
                demo_url="https://churn-api.anshrk.dev",
                image_url="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
                featured=True,
                stars=186,
                sort_order=2
            ),
            Project(
                slug="piano-transcription-app",
                title="Polyphonic Piano Music Transcription Application",
                tagline="Real-time acoustic piano audio to MIDI transcription using ResNet-CRNN & ONNX",
                description=(
                    "Developed a real-time deep learning PyTorch application to transcribe polyphonic acoustic piano "
                    "recordings into accurate MIDI representations. Trained a custom ResNet-CRNN architecture on 200+ hours "
                    "of dataset audio and optimized inference throughput with ONNX runtime. "
                    "Built a multi-threaded desktop GUI in PySide6 supporting live microphone recording, stream buffer "
                    "processing, and dynamic note velocity decoding."
                ),
                tech_stack=["PyTorch", "ONNX", "PySide6", "ResNet-CRNN", "Audio DSP", "Python", "MIDI"],
                tags=["Deep Learning", "Audio DSP", "PyTorch", "Desktop GUI", "Creative AI"],
                github_url="https://github.com/anshrk/piano-transcription",
                demo_url="https://piano-transcription.anshrk.dev",
                image_url="https://images.unsplash.com/photo-1520523839898-507127027bc9?w=800&auto=format&fit=crop&q=80",
                featured=True,
                stars=230,
                sort_order=3
            ),
            Project(
                slug="fork-gen",
                title="Fork Gen — Automated YouTube Thumbnail AI",
                tagline="Computer vision & engagement analytics powered thumbnail generator (2nd Place All-India)",
                description=(
                    "Secured 2nd Place out of 100+ teams across India at Fork Gen Hackathon. "
                    "Developed an automated intelligent system that analyzes video content using computer vision, "
                    "facial expression recognition, and YouTube platform engagement statistics to synthesize high-CTR "
                    "optimized video thumbnails."
                ),
                tech_stack=["Python", "TensorFlow", "OpenCV", "Computer Vision", "FastAPI"],
                tags=["Hackathon Winner", "Computer Vision", "TensorFlow", "AI / ML"],
                github_url="https://github.com/anshrk/fork-gen",
                demo_url="https://fork-gen.anshrk.dev",
                image_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
                featured=False,
                stars=115,
                sort_order=4
            ),
            Project(
                slug="safe-haven-hpcc",
                title="Safe-Haven US Accommodation Finder",
                tagline="Big data tourist safe-haven identification platform (2nd Place HPCC Systems)",
                description=(
                    "Secured 2nd Place out of 30+ teams at the HPCC Systems Hackathon. "
                    "Engineered a distributed big-data safe-haven accommodation identification system for tourists "
                    "traveling across the United States, utilizing ECL, Roxie query clusters on HPCC Systems, "
                    "and a reactive Svelte user interface."
                ),
                tech_stack=["Svelte", "ECL", "HPCC Systems", "Roxie", "TailwindCSS"],
                tags=["Hackathon Winner", "Svelte", "Big Data", "HPCC Systems"],
                github_url="https://github.com/anshrk/safe-haven-hpcc",
                demo_url="https://safe-haven.anshrk.dev",
                image_url="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80",
                featured=False,
                stars=98,
                sort_order=5
            )
        ]
        db.add_all(projects)
        db.commit()

    # 4. Skills from Resume
    if db.query(Skill).count() == 0 or force_reload:
        skills = [
            # Languages
            Skill(category="Languages", name="Python", icon="file-code", proficiency=98, level="Expert", sort_order=1),
            Skill(category="Languages", name="TypeScript & JavaScript", icon="code", proficiency=94, level="Expert", sort_order=2),
            Skill(category="Languages", name="C & C++", icon="cpu", proficiency=90, level="Advanced", sort_order=3),
            Skill(category="Languages", name="SQL (PostgreSQL)", icon="database", proficiency=92, level="Expert", sort_order=4),
            Skill(category="Languages", name="Dart", icon="terminal", proficiency=86, level="Advanced", sort_order=5),
            Skill(category="Languages", name="HTML5 & CSS3", icon="layout", proficiency=95, level="Expert", sort_order=6),
            
            # Frameworks & Frontend
            Skill(category="Frontend", name="Svelte / SvelteKit", icon="layout", proficiency=94, level="Expert", sort_order=7),
            Skill(category="Frontend", name="React.js", icon="box", proficiency=92, level="Expert", sort_order=8),
            Skill(category="Frontend", name="Tailwind CSS & Glassmorphism", icon="palette", proficiency=95, level="Expert", sort_order=9),
            Skill(category="Frontend", name="PySide6 / Streamlit Desktop", icon="monitor", proficiency=88, level="Advanced", sort_order=10),

            # Backend & Systems
            Skill(category="Backend", name="FastAPI & Async Python", icon="zap", proficiency=96, level="Expert", sort_order=11),
            Skill(category="Backend", name="Node.js & Express", icon="server", proficiency=90, level="Advanced", sort_order=12),
            Skill(category="Backend", name="PostgreSQL & SQL", icon="database", proficiency=92, level="Expert", sort_order=13),
            Skill(category="Backend", name="AWS DynamoDB & boto3", icon="layers", proficiency=88, level="Advanced", sort_order=14),
            Skill(category="Backend", name="Django", icon="server", proficiency=85, level="Advanced", sort_order=15),

            # AI / ML & Edge Quantization
            Skill(category="DevOps & Cloud", name="PyTorch & Deep Learning", icon="activity", proficiency=94, level="Expert", sort_order=16),
            Skill(category="DevOps & Cloud", name="Qualcomm AIMET & Quantization", icon="cpu", proficiency=92, level="Expert", sort_order=17),
            Skill(category="DevOps & Cloud", name="ONNX Runtime & RepViT", icon="zap", proficiency=90, level="Advanced", sort_order=18),
            Skill(category="DevOps & Cloud", name="XGBoost & TensorFlow", icon="activity", proficiency=89, level="Advanced", sort_order=19),
            Skill(category="DevOps & Cloud", name="OpenCV & Computer Vision", icon="eye", proficiency=88, level="Advanced", sort_order=20),
            Skill(category="DevOps & Cloud", name="Docker & Containerization", icon="container", proficiency=92, level="Expert", sort_order=21)
        ]
        db.add_all(skills)
        db.commit()

    # 5. Experience from Resume
    if db.query(Experience).count() == 0 or force_reload:
        experiences = [
            Experience(
                role="Student Research Intern",
                company="Samsung PRISM",
                company_url="https://research.samsung.com",
                location="Bangalore, Karnataka",
                start_date="Jan. 2026",
                end_date="Jun. 2026",
                is_current=True,
                description="Conducting cutting-edge research on deep learning model compression and hardware-efficient quantization for next-gen edge NPUs.",
                achievements=[
                    "Optimized RepViT architectures for edge NPUs using Qualcomm AIMET quantization toolkit.",
                    "Mitigated accuracy degradation via structural reparameterization and advanced Knowledge Distillation techniques.",
                    "Achieved near-original baseline accuracy for lower-precision weights (INT8/FP8), yielding significantly higher throughput and a drastically reduced model footprint on device."
                ],
                technologies=["Qualcomm AIMET", "RepViT", "Knowledge Distillation", "Model Quantization", "PyTorch", "Edge NPUs"],
                sort_order=1
            ),
            Experience(
                role="SDE Intern",
                company="Spiked.ai",
                company_url="https://spiked.ai",
                location="Remote, Palo Alto, California",
                start_date="June 2025",
                end_date="Aug. 2025",
                is_current=False,
                description="Developed high-performance frontend interfaces and automated CRM integration pipelines.",
                achievements=[
                    "Developed responsive React.js interfaces and implemented robust on-page SEO best practices to boost search rankings and drive organic user acquisition.",
                    "Integrated ZOHO-CRM with website forms to securely manage and automate incoming client lead workflows."
                ],
                technologies=["React.js", "JavaScript", "SEO Optimization", "ZOHO CRM", "REST APIs"],
                sort_order=2
            )
        ]
        db.add_all(experiences)
        db.commit()

    # 6. Virtual File System (VFS)
    if db.query(VirtualFile).count() == 0 or force_reload:
        files = [
            VirtualFile(
                path="~/about.md",
                filename="about.md",
                parent_dir="~",
                is_directory=False,
                content=(
                    "# About Me — Ansh Ravi Kashyap\n\n"
                    "Hey there! I'm a Computer Science Engineering student at R.V. College of Engineering (CGPA: 9.55), "
                    "Student Research Intern at Samsung PRISM, and full-stack software engineer.\n\n"
                    "### 🎓 Education\n"
                    "- **Institution**: R.V. College of Engineering, Bangalore (Sept. 2023 – Present)\n"
                    "- **Degree**: B.E. Computer Science and Engineering (CGPA: 9.55)\n\n"
                    "### 🔬 Research & Work Focus\n"
                    "- **Edge AI & Quantization**: Optimizing vision models (RepViT) for on-device NPUs using Qualcomm AIMET & Knowledge Distillation.\n"
                    "- **Full-Stack Systems**: FastAPI, Svelte, React, Node.js, and PostgreSQL for real-time applications.\n"
                    "- **Leadership**: Web Development Head @ College Coding Club.\n\n"
                    "### 🎹 Extracurriculars & Passions\n"
                    "- Classical Pianist in the College Music Club\n"
                    "- QuizCorp Trivia & Competitive Quizzing\n"
                    "- Sports: Football, Badminton, Table Tennis, Chess\n\n"
                    "Type `experience`, `projects`, or `skills` in this terminal to explore more!"
                ),
                file_type="markdown",
                permissions="-rw-r--r--",
                size_bytes=890
            ),
            VirtualFile(
                path="~/resume.txt",
                filename="resume.txt",
                parent_dir="~",
                is_directory=False,
                content=(
                    "=======================================================================\n"
                    "                          ANSH RAVI KASHYAP                            \n"
                    "   Phone: +91 8310375023 | Email: anshrk.13@gmail.com | Bangalore, India\n"
                    "   LinkedIn: linkedin.com/in/anshrk | GitHub: github.com/anshrk         \n"
                    "=======================================================================\n\n"
                    "[EDUCATION]\n"
                    "• R.V. College of Engineering, Bangalore (Sept. 2023 – Present)\n"
                    "  Bachelor of Engineering in Computer Science | CGPA: 9.55\n\n"
                    "[EXPERIENCE]\n"
                    "• Samsung PRISM — Student Research Intern (Jan. 2026 – Jun. 2026)\n"
                    "  - Optimized RepViT models for edge NPUs using Qualcomm AIMET quantization.\n"
                    "  - Mitigated accuracy loss via structural reparameterization & Knowledge Distillation.\n"
                    "  - Achieved near-original baseline accuracy for lower-precision weights.\n\n"
                    "• Spiked.ai — SDE Intern (June 2025 – Aug. 2025 | Remote, Palo Alto, CA)\n"
                    "  - Developed responsive React.js interfaces and on-page SEO best practices.\n"
                    "  - Integrated ZOHO-CRM with website forms to automate client data flows.\n\n"
                    "[KEY PROJECTS]\n"
                    "• Aid-Response: Disaster Comm & Mesh Network (React, Node.js, PostgreSQL)\n"
                    "• Customer Churn Prediction & Risk API (FastAPI, XGBoost, Docker, DynamoDB)\n"
                    "• Polyphonic Piano Music Transcription (PyTorch, ONNX, PySide6, ResNet-CRNN)\n\n"
                    "[AWARDS & HACKATHONS]\n"
                    "• 2nd Place: Fork Gen All India Hackathon (100+ teams) — Computer Vision AI\n"
                    "• 2nd Place: HPCC Systems Hackathon (30+ teams) — Svelte & Big Data Platform\n\n"
                    "[SKILLS]\n"
                    "• Languages: Python, C, C++, TypeScript, JavaScript, Dart, HTML/CSS, SQL\n"
                    "• Tools/Frameworks: FastAPI, React.js, Svelte, Node.js, AWS DynamoDB, Docker, PyTorch, OpenCV\n"
                ),
                file_type="text",
                permissions="-rw-r--r--",
                size_bytes=1680
            ),
            VirtualFile(
                path="~/education.txt",
                filename="education.txt",
                parent_dir="~",
                is_directory=False,
                content=(
                    "🎓 R.V. College of Engineering, Bangalore\n"
                    "Degree: Bachelor of Engineering in Computer Science and Engineering\n"
                    "Timeline: Sept. 2023 – Present\n"
                    "Current CGPA: 9.55 / 10.0\n"
                    "Roles: Web Development Head (College Coding Club), Pianist (College Music Club)\n"
                ),
                file_type="text",
                permissions="-rw-r--r--",
                size_bytes=320
            ),
            VirtualFile(
                path="~/achievements.md",
                filename="achievements.md",
                parent_dir="~",
                is_directory=False,
                content=(
                    "# 🏆 Hackathons & Key Achievements\n\n"
                    "1. **Fork Gen (All India Hackathon) — 2nd Place (100+ Teams)**\n"
                    "   - Built an app generating optimized high-CTR YouTube thumbnails using Computer Vision and engagement metrics.\n"
                    "   - Stack: Python, TensorFlow, OpenCV, FastAPI\n\n"
                    "2. **HPCC Systems Hackathon — 2nd Place (30+ Teams)**\n"
                    "   - Developed a safe-haven tourist accommodation identification application for US travelers.\n"
                    "   - Stack: Svelte, ECL, Roxie, HPCC Systems\n\n"
                    "3. **Academic Excellence — R.V. College of Engineering**\n"
                    "   - CGPA: 9.55 across foundational CS & Engineering curricula.\n"
                ),
                file_type="markdown",
                permissions="-rw-r--r--",
                size_bytes=680
            ),
            VirtualFile(
                path="~/skills.json",
                filename="skills.json",
                parent_dir="~",
                is_directory=False,
                content=json.dumps({
                    "languages": ["Python", "C", "C++", "TypeScript", "JavaScript", "Dart", "HTML/CSS", "SQL (PostgreSQL)"],
                    "frameworks": ["FastAPI", "React.js", "Svelte", "Node.js", "Django", "PySide6", "Streamlit"],
                    "ai_ml_edge": ["PyTorch", "Qualcomm AIMET", "ONNX", "XGBoost", "TensorFlow", "OpenCV", "Knowledge Distillation"],
                    "cloud_devops": ["Docker", "AWS DynamoDB", "boto3", "Git", "Linux / Shell Scripting"]
                }, indent=2),
                file_type="json",
                permissions="-rw-r--r--",
                size_bytes=440
            ),
            VirtualFile(
                path="~/contact.sh",
                filename="contact.sh",
                parent_dir="~",
                is_directory=False,
                content=(
                    "#!/usr/bin/env bash\n"
                    "echo '======================================'\n"
                    "echo '    ANSH RAVI KASHYAP — CONTACT INFO   '\n"
                    "echo '======================================'\n"
                    "echo 'Email:    anshrk.13@gmail.com'\n"
                    "echo 'Phone:    +91 8310375023'\n"
                    "echo 'GitHub:   https://github.com/anshrk'\n"
                    "echo 'LinkedIn: https://linkedin.com/in/anshrk'\n"
                    "echo 'Location: Bangalore, Karnataka, India'\n"
                ),
                file_type="executable",
                permissions="-rwxr-xr-x",
                size_bytes=380
            ),
            VirtualFile(
                path="~/projects",
                filename="projects",
                parent_dir="~",
                is_directory=True,
                content="",
                file_type="directory",
                permissions="drwxr-xr-x",
                size_bytes=4096
            ),
            VirtualFile(
                path="~/secrets",
                filename="secrets",
                parent_dir="~",
                is_directory=True,
                content="",
                file_type="directory",
                permissions="drwx------",
                size_bytes=4096
            ),
            # Project markdown files
            VirtualFile(
                path="~/projects/aid_response.md",
                filename="aid_response.md",
                parent_dir="~/projects",
                is_directory=False,
                content=(
                    "# Aid-Response (Disaster Comm. & Mesh Network)\n\n"
                    "Fault-tolerant emergency communication digital twin featuring real-time WebSocket dashboard and dynamic Dijkstra routing.\n"
                    "- Stack: React, Node.js, PostgreSQL, Web Crypto API, Cisco Webex APIs\n"
                    "- Zero-trust encryption with client-side Web Crypto API\n"
                    "- GitHub: https://github.com/anshrk/aid-response"
                ),
                file_type="markdown",
                permissions="-rw-r--r--",
                size_bytes=420
            ),
            VirtualFile(
                path="~/projects/churn_prediction.md",
                filename="churn_prediction.md",
                parent_dir="~/projects",
                is_directory=False,
                content=(
                    "# Customer Churn Prediction & Real-Time Risk API\n\n"
                    "End-to-end ML pipeline classifying customer churn risk in real-time alongside a Dockerized Streamlit console.\n"
                    "- Stack: FastAPI, XGBoost, Docker, Streamlit, AWS DynamoDB (boto3)\n"
                    "- Live inference telemetry logging for automated retraining\n"
                    "- GitHub: https://github.com/anshrk/churn-risk-api"
                ),
                file_type="markdown",
                permissions="-rw-r--r--",
                size_bytes=430
            ),
            VirtualFile(
                path="~/projects/piano_transcription.md",
                filename="piano_transcription.md",
                parent_dir="~/projects",
                is_directory=False,
                content=(
                    "# Polyphonic Piano Music Transcription Application\n\n"
                    "Real-time acoustic piano to MIDI transcription using a deep ResNet-CRNN model trained on 200+ hours of audio.\n"
                    "- Stack: PyTorch, ONNX, PySide6, Audio DSP, Python\n"
                    "- Multi-threaded desktop GUI with live microphone streaming buffer\n"
                    "- GitHub: https://github.com/anshrk/piano-transcription"
                ),
                file_type="markdown",
                permissions="-rw-r--r--",
                size_bytes=450
            ),
            VirtualFile(
                path="~/secrets/easter_egg.txt",
                filename="easter_egg.txt",
                parent_dir="~/secrets",
                is_directory=False,
                content=(
                    "🎉 You found Ansh's secret directory!\n\n"
                    "Fun facts:\n"
                    "• Classical pianist & music lover 🎹\n"
                    "• QuizCorp trivia fanatic & football player ⚽\n"
                    "• Try typing 'theme matrix' or 'cmatrix' in the terminal!\n"
                ),
                file_type="text",
                permissions="-rw-------",
                size_bytes=260
            )
        ]
        db.add_all(files)
        db.commit()
