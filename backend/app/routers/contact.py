from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ContactMessage
from app.schemas import ContactCreate, ContactOut
from app.limiter import contact_limiter

router = APIRouter(prefix="/contact", tags=["Contact Inquiries"])

@router.post("", response_model=ContactOut, status_code=status.HTTP_201_CREATED)
def submit_contact_message(request: Request, contact_in: ContactCreate, db: Session = Depends(get_db)):
    contact_limiter.check(request, custom_key="contact")
    msg = ContactMessage(
        name=contact_in.name,
        email=contact_in.email,
        subject=contact_in.subject or "Terminal Portfolio Inquiry",
        message=contact_in.message
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
