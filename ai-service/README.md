# AI Suggestion Microservice (FastAPI + OpenAI GPT-4)

This Python microservice is part of the **ZapTask** system. It leverages the OpenAI GPT-4 API to generate intelligent task suggestions and categorize task descriptions. Built with **FastAPI**, it exposes a single endpoint `/suggest` that receives task input and returns an AI-generated suggestion along with a relevant category.

---

##  Purpose

Designed to integrate with the Node.js-based ZapTask backend, this service enhances task automation workflows by adding natural language intelligence.

---

##  Tech Stack

| Component             | Technology                   |
|----------------------|------------------------------|
| Web Framework        | FastAPI                      |
| Language Model       | OpenAI GPT-4 (Chat API)      |
| Data Modeling        | Pydantic                     |
| HTTP Client          | `httpx` (async)              |
| Logging              | Python `logging` module      |
| Environment Config   | `python-dotenv`              |

---

##  API Endpoint

### `POST /suggest`

Accepts a JSON payload describing a task and returns an AI-generated title and category.

**Request body:**

```json
{
  "description": "Set up database schema and migrations"
}

```
**Response body:**
```json
{
  "suggested_task": "Design Database Schema",
  "category": "Backend Setup"
}
```
---

## Project Structure

```bash
ai-service/
└── app/
    ├── api/
    │   └── suggest.py       # API route definition
    ├── services/
    │   └── openai_service.py # GPT-4 logic
    ├── models/
    │   └── task_model.py          # Pydantic request/response schemas
    ├── prompts/
    │   └── task_prompt.txt  # Prompt template (modularized)
    └── main.py              # FastAPI app entrypoint
.env
requirements.txt

```

---

##  Setup Instructions
### 1. Clone the repository

```bash
git clone https://github.com/hamzatahir9466/zaptask-api.git
cd zaptask-project/ai-service

```

### 2. Create and activate a virtual environment

```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a .env file and add:

```bash
OPENAI_API_KEY=sk-xxxxxx
```

---

##  Run the Service
```bash
uvicorn app.api.app:app --reload --port 8001
```

Server will run at:
  http://localhost:8001/suggest

---
##  Features

```markdown
- Async architecture with httpx and FastAPI
- Modular prompt loading from external .txt file
- Structured request/response models via Pydantic
- OpenAI error handling
- Compatible with both standalone and inter-service use
```
---

## Future Enhancements

```markdown

- Support batch task suggestions
- Multi-language prompt localization
- Add input validation / length handling
- Connect to vector store for embedding search
```
---

##  License
This project is licensed for educational and portfolio use. All OpenAI usage must comply with their API terms (https://openai.com/policies/usage-policies/).


