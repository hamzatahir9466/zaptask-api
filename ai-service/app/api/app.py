
from fastapi import FastAPI
from app.api.suggest import router as suggest_router

app= FastAPI(
    title="ZapTask AI suggestion service",
    version="1.0.0"
)

app.include_router(suggest_router, prefix="/suggest", tags=["suggest"])