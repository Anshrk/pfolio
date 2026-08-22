import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed import seed_database
from app.routers import portfolio, auth, admin, contact

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("pfolio")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    logger.info("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    
    # Seed initial portfolio data if empty
    db = SessionLocal()
    try:
        seed_database(db)
        logger.info("Database initialized and verified.")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
    finally:
        db.close()
        
    yield
    logger.info("Shutting down portfolio server.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan
)

# Set up robust CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app|http://localhost:\d+|http://127\.0\.0\.1:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under /api
app.include_router(portfolio.router, prefix=settings.API_V1_STR)
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(contact.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to MacBook Terminal Portfolio API",
        "docs": f"{settings.API_V1_STR}/docs",
        "status": "online",
        "version": settings.VERSION
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
