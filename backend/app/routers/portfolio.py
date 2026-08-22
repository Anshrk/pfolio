from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Profile, Project, Skill, Experience, VirtualFile
from app.schemas import PortfolioPayload, ProfileOut, ProjectOut, SkillOut, ExperienceOut, VirtualFileOut

router = APIRouter(prefix="", tags=["Public Portfolio"])

@router.get("/portfolio", response_model=PortfolioPayload)
def get_full_portfolio(db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Portfolio profile not found")
    
    projects = db.query(Project).order_by(Project.sort_order.asc(), Project.id.asc()).all()
    skills = db.query(Skill).order_by(Skill.sort_order.asc(), Skill.id.asc()).all()
    experiences = db.query(Experience).order_by(Experience.sort_order.asc(), Experience.id.asc()).all()
    virtual_files = db.query(VirtualFile).order_by(VirtualFile.parent_dir.asc(), VirtualFile.filename.asc()).all()

    return PortfolioPayload(
        profile=profile,
        projects=projects,
        skills=skills,
        experiences=experiences,
        virtual_files=virtual_files
    )

@router.get("/projects", response_model=List[ProjectOut])
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).order_by(Project.sort_order.asc()).all()

@router.get("/projects/{slug}", response_model=ProjectOut)
def get_project_by_slug(slug: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.slug == slug).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.get("/skills", response_model=List[SkillOut])
def get_skills(db: Session = Depends(get_db)):
    return db.query(Skill).order_by(Skill.sort_order.asc()).all()

@router.get("/experiences", response_model=List[ExperienceOut])
def get_experiences(db: Session = Depends(get_db)):
    return db.query(Experience).order_by(Experience.sort_order.asc()).all()

@router.get("/files", response_model=List[VirtualFileOut])
def get_virtual_files(db: Session = Depends(get_db)):
    return db.query(VirtualFile).order_by(VirtualFile.path.asc()).all()
