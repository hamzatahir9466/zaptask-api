from fastapi import APIRouter, HTTPException
from app.models.task_model import TaskRequest, TaskResponse
from app.services.openai_service import get_task_suggestion

router=APIRouter()


@router.post("/", response_model=TaskResponse)
async def suggest_task(task_request: TaskRequest) -> TaskResponse:
    """
    Suggest a task based on the provided request.
    
    Args:
        task_request (TaskRequest): The request containing task details.
    
    Returns:
        TaskResponse: The suggested task response.
    
    Raises:
        HTTPException: If an error occurs while fetching the suggestion.
    """
    try:
        suggestion = await get_task_suggestion(task_request)
        return TaskResponse(suggested_task=suggestion)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))