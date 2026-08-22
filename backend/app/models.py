import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON, ForeignKey
from app.database import Base

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    handle = Column(String(50), default="ansh")
    hostname = Column(String(50), default="macbook-pro")
    title = Column(String(150), default="Software Engineer & Creative Technologist")
    tagline = Column(String(255), default="Building high-performance distributed systems, elegant frontends & intelligent tools.")
    bio = Column(Text, nullable=True)
    location = Column(String(100), default="Bengaluru / San Francisco")
    email = Column(String(100), default="anshkashyap@example.com")
    github = Column(String(100), default="https://github.com/anshkashyap")
    linkedin = Column(String(100), default="https://linkedin.com/in/anshkashyap")
    twitter = Column(String(100), default="https://x.com/anshkashyap")
    website = Column(String(100), default="https://anshkashyap.dev")
    avatar_url = Column(String(255), nullable=True)
    resume_url = Column(String(255), nullable=True)
    
    # Fastfetch / Neofetch specs & ASCII logo
    fastfetch_ascii = Column(Text, nullable=True)
    fastfetch_specs = Column(JSON, default=dict)
    
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(150), nullable=False)
    tagline = Column(String(255), nullable=True)
    description = Column(Text, nullable=False)
    tech_stack = Column(JSON, default=list) # e.g. ["Svelte", "FastAPI", "PostgreSQL", "Docker"]
    tags = Column(JSON, default=list)       # e.g. ["Fullstack", "Open Source", "CLI"]
    github_url = Column(String(255), nullable=True)
    demo_url = Column(String(255), nullable=True)
    image_url = Column(String(255), nullable=True)
    featured = Column(Boolean, default=False)
    stars = Column(Integer, default=0)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), nullable=False) # e.g. "Languages", "Frontend", "Backend", "DevOps & Cloud", "AI & Data"
    name = Column(String(50), nullable=False)
    icon = Column(String(50), nullable=True)     # Lucide icon name or emoji
    proficiency = Column(Integer, default=90)    # 0 - 100
    level = Column(String(30), default="Advanced") # "Expert", "Advanced", "Proficient"
    sort_order = Column(Integer, default=0)

class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(100), nullable=False)
    company = Column(String(100), nullable=False)
    company_url = Column(String(255), nullable=True)
    location = Column(String(100), default="Remote / Hybrid")
    start_date = Column(String(50), nullable=False) # e.g. "2024 - Present"
    end_date = Column(String(50), nullable=True)
    is_current = Column(Boolean, default=False)
    description = Column(Text, nullable=False)
    achievements = Column(JSON, default=list) # list of bullet points
    technologies = Column(JSON, default=list)
    sort_order = Column(Integer, default=0)

class VirtualFile(Base):
    __tablename__ = "virtual_files"

    id = Column(Integer, primary_key=True, index=True)
    path = Column(String(255), unique=True, index=True, nullable=False) # e.g. "~/about.md", "~/projects/pfolio.json"
    filename = Column(String(100), nullable=False)
    parent_dir = Column(String(255), default="~")
    is_directory = Column(Boolean, default=False)
    content = Column(Text, default="")
    file_type = Column(String(30), default="text") # "text", "markdown", "json", "executable", "symlink"
    permissions = Column(String(10), default="-rw-r--r--")
    size_bytes = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    subject = Column(String(150), default="Terminal Contact Inquiry")
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
