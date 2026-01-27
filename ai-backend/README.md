# AI Visa Success Advisor - Python Backend

## Setup Instructions

### 1. Create Virtual Environment
```bash
python -m venv venv
```

### 2. Activate Virtual Environment
**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Create .env File
Create `.env` file in the `ai-backend` folder:

```env
# Server
DEBUG=True
HOST=0.0.0.0
PORT=8000

# Database
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=visa-advisor

# LLM Configuration (set after deciding on provider)
LLM_PROVIDER=dummy  # Change to: openai, gemini, anthropic, local
LLM_API_KEY=your_api_key_here
LLM_MODEL=gpt-3.5-turbo

# Node.js Backend
NODE_BACKEND_URL=http://localhost:5000

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 5. Run the Server
```bash
python -m uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### API Documentation
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
ai-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry point
│   ├── config/
│   │   └── settings.py         # Configuration and settings
│   ├── models/
│   │   └── chat.py            # Pydantic models for chat
│   ├── services/
│   │   ├── llm_service.py      # LLM interaction service
│   │   └── chat_service.py     # Chat logic and Node backend integration
│   ├── routes/
│   │   └── chat.py            # Chat API endpoints
│   └── utils/
│       └── llm_providers.py    # Modular LLM providers (OpenAI, Gemini, etc.)
├── requirements.txt
└── README.md
```

## Switching LLM Providers

### Using OpenAI
1. Install: `pip install openai`
2. Set in `.env`:
   ```
   LLM_PROVIDER=openai
   LLM_API_KEY=sk-...
   LLM_MODEL=gpt-3.5-turbo
   ```

### Using Google Gemini
1. Install: `pip install google-generativeai`
2. Set in `.env`:
   ```
   LLM_PROVIDER=gemini
   LLM_API_KEY=your_gemini_api_key
   LLM_MODEL=gemini-pro
   ```

### Using Anthropic Claude
1. Install: `pip install anthropic`
2. Set in `.env`:
   ```
   LLM_PROVIDER=anthropic
   LLM_API_KEY=sk-ant-...
   LLM_MODEL=claude-3-sonnet-20240229
   ```

### Using Local LLM (Ollama)
1. Install Ollama from https://ollama.ai
2. Run: `ollama run llama2`
3. Set in `.env`:
   ```
   LLM_PROVIDER=local
   LLM_MODEL=llama2
   ```

### Testing Without API Keys
Set in `.env`:
```
LLM_PROVIDER=dummy
```
This uses a dummy provider that returns pre-defined responses.

## API Endpoints

### Send Message
```
POST /api/chat/message
Headers:
  X-Chat-Id: <chat_id>
  X-User-Id: <user_id>
Body:
  {
    "message": "What documents do I need for a visa?"
  }
Response:
  {
    "success": true,
    "response": "AI response here...",
    "chat_id": "<chat_id>",
    "timestamp": "2024-01-26T10:30:00"
  }
```

### Health Check
```
GET /api/chat/health
Response:
  {
    "status": "healthy",
    "service": "AI Visa Advisor Chat API"
  }
```
