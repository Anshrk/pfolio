from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models import Profile, Project, Skill, Experience, VirtualFile, ContactMessage, AdminUser
from app.schemas import (
    ProfileOut, ProfileUpdate,
    ProjectOut, ProjectCreate, ProjectUpdate,
    SkillOut, SkillCreate, SkillUpdate,
    ExperienceOut, ExperienceCreate, ExperienceUpdate,
    VirtualFileOut, VirtualFileCreate, VirtualFileUpdate,
    ContactOut
)
from app.auth import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin Mutations"], dependencies=[Depends(get_current_admin)])

# --- Profile Updates ---
@router.put("/profile", response_model=ProfileOut)
def update_profile(profile_in: ProfileUpdate, db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        profile = Profile(name="Portfolio Owner")
        db.add(profile)
    
    update_data = profile_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)
    
    db.commit()
    db.refresh(profile)
    return profile

# --- Project CRUD ---
@router.post("/projects", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(project_in: ProjectCreate, db: Session = Depends(get_db)):
    existing = db.query(Project).filter(Project.slug == project_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Project with slug '{project_in.slug}' already exists")
    
    project = Project(**project_in.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.put("/projects/{project_id}", response_model=ProjectOut)
def update_project(project_id: int, project_in: ProjectUpdate, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)
    
    db.commit()
    db.refresh(project)
    return project

@router.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully", "id": project_id}

# --- Skill CRUD ---
@router.post("/skills", response_model=SkillOut, status_code=status.HTTP_201_CREATED)
def create_skill(skill_in: SkillCreate, db: Session = Depends(get_db)):
    skill = Skill(**skill_in.model_dump())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill

@router.put("/skills/{skill_id}", response_model=SkillOut)
def update_skill(skill_id: int, skill_in: SkillUpdate, db: Session = Depends(get_db)):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    update_data = skill_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(skill, field, value)
    
    db.commit()
    db.refresh(skill)
    return skill

@router.delete("/skills/{skill_id}")
def delete_skill(skill_id: int, db: Session = Depends(get_db)):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    db.delete(skill)
    db.commit()
    return {"message": "Skill deleted successfully", "id": skill_id}

# --- Experience CRUD ---
@router.post("/experiences", response_model=ExperienceOut, status_code=status.HTTP_201_CREATED)
def create_experience(exp_in: ExperienceCreate, db: Session = Depends(get_db)):
    exp = Experience(**exp_in.model_dump())
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return exp

@router.put("/experiences/{exp_id}", response_model=ExperienceOut)
def update_experience(exp_id: int, exp_in: ExperienceUpdate, db: Session = Depends(get_db)):
    exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    update_data = exp_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(exp, field, value)
    
    db.commit()
    db.refresh(exp)
    return exp

@router.delete("/experiences/{exp_id}")
def delete_experience(exp_id: int, db: Session = Depends(get_db)):
    exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    db.delete(exp)
    db.commit()
    return {"message": "Experience deleted successfully", "id": exp_id}

# --- Virtual File System Mutations (used by nano/edit command & GUI) ---
@router.post("/files", response_model=VirtualFileOut, status_code=status.HTTP_201_CREATED)
def create_or_upsert_file(file_in: VirtualFileCreate, db: Session = Depends(get_db)):
    file_obj = db.query(VirtualFile).filter(VirtualFile.path == file_in.path).first()
    if file_obj:
        file_obj.content = file_in.content
        file_obj.size_bytes = len(file_in.content.encode('utf-8'))
        file_obj.permissions = file_in.permissions
        file_obj.file_type = file_in.file_type
    else:
        file_obj = VirtualFile(**file_in.model_dump())
        file_obj.size_bytes = len(file_in.content.encode('utf-8'))
        db.add(file_obj)
    
    db.commit()
    db.refresh(file_obj)
    return file_obj

@router.put("/files/{file_id}", response_model=VirtualFileOut)
def update_file(file_id: int, file_in: VirtualFileUpdate, db: Session = Depends(get_db)):
    file_obj = db.query(VirtualFile).filter(VirtualFile.id == file_id).first()
    if not file_obj:
        raise HTTPException(status_code=404, detail="Virtual file not found")
    
    if file_in.content is not None:
        file_obj.content = file_in.content
        file_obj.size_bytes = len(file_in.content.encode('utf-8'))
    if file_in.permissions is not None:
        file_obj.permissions = file_in.permissions
    if file_in.file_type is not None:
        file_obj.file_type = file_in.file_type
        
    db.commit()
    db.refresh(file_obj)
    return file_obj

@router.delete("/files/{file_id}")
def delete_file(file_id: int, db: Session = Depends(get_db)):
    file_obj = db.query(VirtualFile).filter(VirtualFile.id == file_id).first()
    if not file_obj:
        raise HTTPException(status_code=404, detail="Virtual file not found")
    
    db.delete(file_obj)
    db.commit()
    return {"message": "Virtual file deleted successfully", "id": file_id}

# --- Contact Inquiries View ---
@router.get("/messages", response_model=List[ContactOut])
def get_contact_messages(db: Session = Depends(get_db)):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()

@router.delete("/messages/{message_id}")
def delete_message(message_id: int, db: Session = Depends(get_db)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
    return {"message": "Message deleted successfully", "id": message_id}
