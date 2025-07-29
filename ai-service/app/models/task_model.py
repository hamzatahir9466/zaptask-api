
from pydantic import BaseModel

class TaskRequest(BaseModel):
    input: str

class TaskResponse(BaseModel):
    suggested_task: str