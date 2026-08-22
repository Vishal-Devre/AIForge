from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logging import logger
from app.api.v1.router import api_router
from app.middleware.logging_middleware import RequestLoggingMiddleware
from app.middleware.exceptions import ExceptionHandlingMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logging
    logger.info(f"Starting {settings.APP_NAME} in {settings.APP_ENV} mode.")
    yield
    # Shutdown logging
    logger.info(f"Shutting down {settings.APP_NAME}.")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Global Middlewares
app.add_middleware(ExceptionHandlingMiddleware)
app.add_middleware(RequestLoggingMiddleware)

# CORS configuration
# Development allows any origin; every other environment is restricted to the
# configured frontend origin so the SPA can actually call the API.
if settings.APP_ENV == "development":
    cors_allow_origins = ["*"]
else:
    cors_allow_origins = [origin.strip() for origin in settings.FRONTEND_URL.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_allow_origins,
    allow_credentials=cors_allow_origins != ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": f"Welcome to {settings.APP_NAME} API"}
