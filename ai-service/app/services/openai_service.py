
from openai import AsyncOpenAI
from dotenv import load_dotenv
import os
import json
import re

import logging


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

load_dotenv()
openai = AsyncOpenAI(
 # This is the default and can be omitted
    api_key=os.getenv("OPENAI_API_KEY")
    )
#openai.api_key = os.getenv("OPENAI_API_KEY")



# Clean GPT response before parsing
def clean_json_text(text: str) -> str:
    # Remove code block formatting like ```json ... ```
    text = re.sub(r"^```json|```$", "", text.strip(), flags=re.IGNORECASE)
    return text.strip()


async def get_task_suggestion(task_request) -> dict:
    """
    Fetch a task suggestion from OpenAI based on the provided task request.

    Args:
        task_request (TaskRequest): The request containing task details.

    Returns:
        str: The suggested task.
    """
    user_input=task_request.input.strip()
    logger.info("Calling OpenAI with input: %s", user_input)
    system_prompt = load_prompt_template()
    system_prompt = system_prompt.replace("{{user_input}}", user_input)
    print(f"System Prompt: {system_prompt}")
   
    response = await openai.chat.completions.create(
        
        model="gpt-4o",  
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_input}
            ],
        max_tokens=80,
        temperature=0.7
    )
    
    
    #if not response.choices or len(response.choices) == 0:
    #    raise ValueError("No response received from OpenAI API.")
    #if not response.choices[0].message or not response.choices[0].message.content:
    #    raise ValueError("No content in the response from OpenAI API.")
      
    content = response.choices[0].message.content.strip()
    cleaned = clean_json_text(content)
    logger.info("AI response: %s", content)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        logger.error("JSON DECODE ERROR: %s", str(e), exc_info=True)
        return {
            "suggested_task": "Unknown",
            "category": "Uncategorized"
        }


def load_prompt_template() -> str:
    file_path = os.path.join(os.path.dirname(__file__), '..', 'prompts', 'task_prompt.txt')
    with open(file_path, 'r') as file:
        return file.read()