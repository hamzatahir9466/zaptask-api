
from fastapi import FastAPI, Request
from app.api.suggest import router as suggest_router
from prometheus_fastapi_instrumentator import Instrumentator
import uuid
from starlette.middleware.base import BaseHTTPMiddleware




app= FastAPI(
    title="ZapTask AI suggestion service",
    version="1.0.0"
)

app.include_router(suggest_router, prefix="/suggest", tags=["suggest"])

# Add Prometheus metrics at /metrics
Instrumentator().instrument(app).expose(app, include_in_schema=False)

class TraceIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Check for existing trace ID (future Node integration)
        trace_id = request.headers.get("X-Trace-ID") or str(uuid.uuid4())
        request.state.trace_id = trace_id

        response = await call_next(request)
        response.headers["X-Trace-ID"] = trace_id  # Optional: visible to clients
        return response

app.add_middleware(TraceIDMiddleware)