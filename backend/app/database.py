import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

logger = logging.getLogger(__name__)

def get_engine():
    db_url = settings.DATABASE_URL.strip()
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    
    # Strip channel_binding if present for libpq compatibility
    if "channel_binding=" in db_url:
        db_url = db_url.replace("&channel_binding=require", "").replace("?channel_binding=require", "")
        if "?" not in db_url and "&" in db_url:
            db_url = db_url.replace("&", "?", 1)
        
    if "postgresql" in db_url:
        try:
            test_engine = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_recycle=300
            )
            # Test direct connection
            with test_engine.connect() as conn:
                pass
            logger.info("✓ Connected to PostgreSQL / Neon database successfully!")
            return test_engine
        except Exception as e:
            logger.warning(f"Could not connect to PostgreSQL ({e}). Falling back to SQLite.")

    # SQLite fallback
    return create_engine(
        settings.SQLITE_FALLBACK_URL, 
        connect_args={"check_same_thread": False}
    )

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
