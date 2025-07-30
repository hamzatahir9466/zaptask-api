from fastapi import APIRouter, HTTPException, Request
from app.models.task_model import TaskRequest, TaskResponse
from app.services.openai_service import get_task_suggestion
import logging


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

router=APIRouter()


@router.post("/", response_model=TaskResponse)
async def suggest_task(task_request: TaskRequest, request: Request) -> TaskResponse:
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
        trace_id = request.state.trace_id
        logger.info("Trace %s: Received input: %s", trace_id, task_request.input)
        suggestion = await get_task_suggestion(task_request)
        logger.info("Trace %s: AI response: %s", trace_id, suggestion)
        return TaskResponse(
            suggested_task=suggestion["suggested_task"],
            category=suggestion["category"]
        )
    except Exception as e:
        logger.error("OpenAI call failed: %s", str(e), exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))