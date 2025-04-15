from fastapi import FastAPI, Request,HTTPException
import os
import google.generativeai as genai
from dotenv import load_dotenv
import json
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Load .env
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Optional: validate
if not GEMINI_API_KEY:
    raise RuntimeError("Missing GEMINI_API_KEY in environment")

genai.configure(api_key=GEMINI_API_KEY)


app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load dummy data
with open("dummyData.json", "r") as f:
    DUMMY_DATA = json.load(f)

@app.get("/api/data", tags=["Sales Data"], summary="Get dummy sales data")
def get_data():
    """
    Retrieve a list of sales representatives and their related data.
    """
    return DUMMY_DATA

@app.post("/api/ai", tags=["Ai direction"], summary="Ask AI Question")
async def ai_endpoint(request: Request):
    """
    Receive a user question and return a Gemini-generated AI response.
    """
    try:
        body = await request.json()
        question = body.get("question", "")
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(question)
        return {"answer": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
