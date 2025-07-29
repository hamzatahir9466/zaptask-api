
from openai import AsyncOpenAI
from dotenv import load_dotenv
import os


load_dotenv()
openai = AsyncOpenAI(
 # This is the default and can be omitted
    api_key=os.getenv("OPENAI_API_KEY")
    )
#openai.api_key = os.getenv("OPENAI_API_KEY")



async def get_task_suggestion(task_request) -> str:
    """
    Fetch a task suggestion from OpenAI based on the provided task request.

    Args:
        task_request (TaskRequest): The request containing task details.

    Returns:
        str: The suggested task.
    """
    user_input=task_request.input.strip()
    system_prompt = load_prompt_template()
    prompt = f"Suggest a concise, professional task name based on this description:\n\n'{user_input}'\n\nTask Name:"

    response = await openai.chat.completions.create(
        
        model="gpt-4o",  
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_input}
            ],
        max_tokens=20,
        temperature=0.7
    )
    
    
    #if not response.choices or len(response.choices) == 0:
    #    raise ValueError("No response received from OpenAI API.")
    #if not response.choices[0].message or not response.choices[0].message.content:
    #    raise ValueError("No content in the response from OpenAI API.")
      
    
    return response.choices[0].message.content.strip()


def load_prompt_template() -> str:
    file_path = os.path.join(os.path.dirname(__file__), '..', 'prompts', 'task_prompt.txt')
    with open(file_path, 'r') as file:
        return file.read()