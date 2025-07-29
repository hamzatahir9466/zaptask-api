
from fastapi import FastAPI
from app.api.suggest import router as suggest_router
from prometheus_fastapi_instrumentator import Instrumentator


app= FastAPI(
    title="ZapTask AI suggestion service",
    version="1.0.0"
)

app.include_router(suggest_router, prefix="/suggest", tags=["suggest"])

# Add Prometheus metrics at /metrics
Instrumentator().instrument(app).expose(app, include_in_schema=False)