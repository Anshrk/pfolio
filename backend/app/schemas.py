from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str

class LoginRequest(BaseModel):
    username: str
    password: str

# --- Profile Schemas ---
class ProfileBase(BaseModel):
    name: str
    handle: str = "ansh"
    hostname: str = "macbook-pro"
    title: str
    tagline: str
    bio: Optional[str] = None
    location: str
    email: str
    github: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    website: Optional[str] = None
    avatar_url: Optional[str] = None
    resume_url: Optional[str] = None
    fastfetch_ascii: Optional[str] = None
    fastfetch_specs: Optional[Dict[str, Any]] = None

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    handle: Optional[str] = None
    hostname: Optional[str] = None
    title: Optional[str] = None
    tagline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    website: Optional[str] = None
    avatar_url: Optional[str] = None
    resume_url: Optional[str] = None
    fastfetch_ascii: Optional[str] = None
    fastfetch_specs: Optional[Dict[str, Any]] = None

class ProfileOut(ProfileBase):
    id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Project Schemas ---
class ProjectBase(BaseModel):
    slug: str
    title: str
    tagline: Optional[str] = None
    description: str
    tech_stack: List[str] = []
    tags: List[str] = []
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    image_url: Optional[str] = None
    featured: bool = False
    stars: int = 0
    sort_order: int = 0

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    slug: Optional[str] = None
    title: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    image_url: Optional[str] = None
    featured: Optional[bool] = None
    stars: Optional[int] = None
    sort_order: Optional[int] = None

class ProjectOut(ProjectBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Skill Schemas ---
class SkillBase(BaseModel):
    category: str
    name: str
    icon: Optional[str] = None
    proficiency: int = 90
    level: str = "Advanced"
    sort_order: int = 0

class SkillCreate(SkillBase):
    pass

class SkillUpdate(BaseModel):
    category: Optional[str] = None
    name: Optional[str] = None
    icon: Optional[str] = None
    proficiency: Optional[int] = None
    level: Optional[str] = None
    sort_order: Optional[int] = None

class SkillOut(SkillBase):
    id: int

    class Config:
        from_attributes = True

# --- Experience Schemas ---
class ExperienceBase(BaseModel):
    role: str
    company: str
    company_url: Optional[str] = None
    location: str = "Remote"
    start_date: str
    end_date: Optional[str] = None
    is_current: bool = False
    description: str
    achievements: List[str] = []
    technologies: List[str] = []
    sort_order: int = 0

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(BaseModel):
    role: Optional[str] = None
    company: Optional[str] = None
    company_url: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    achievements: Optional[List[str]] = None
    technologies: Optional[List[str]] = None
    sort_order: Optional[int] = None

class ExperienceOut(ExperienceBase):
    id: int

    class Config:
        from_attributes = True

# --- Virtual File System Schemas ---
class VirtualFileBase(BaseModel):
    path: str
    filename: str
    parent_dir: str = "~"
    is_directory: bool = False
    content: str = ""
    file_type: str = "text"
    permissions: str = "-rw-r--r--"
    size_bytes: int = 0

class VirtualFileCreate(VirtualFileBase):
    pass

class VirtualFileUpdate(BaseModel):
    content: Optional[str] = None
    permissions: Optional[str] = None
    file_type: Optional[str] = None

class VirtualFileOut(VirtualFileBase):
    id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Contact Schemas ---
class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    subject: Optional[str] = Field("Terminal Portfolio Inquiry", max_length=150)
    message: str = Field(..., min_length=2, max_length=5000)

class ContactOut(BaseModel):
    id: int
    name: str
    email: str
    subject: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Full Aggregate Portfolio Payload ---
class PortfolioPayload(BaseModel):
    profile: ProfileOut
    projects: List[ProjectOut]
    skills: List[SkillOut]
    experiences: List[ExperienceOut]
    virtual_files: List[VirtualFileOut]
