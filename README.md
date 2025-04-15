# Coding Challenge: Sales Dashboard with Next.js & FastAPI

## Requirement

1. Node js installed version 20
2. Python installed version 3

## Getting Started

1. **Clone or Download** this repository (or fork it, as described above).
2. **Backend Setup**
   - Navigate to the `backend` directory.
   - Create a virtual environment (optional but recommended).
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```  
   - Run the server:
     ```bash
     uvicorn main:app --host 0.0.0.0 --port 8000 --reload
     ```  
   - Confirm the API works by visiting `http://localhost:8000/docs`.

3. place your gemini api key in the .env. Visit this site https://aistudio.google.com/app/apikey to generate the API Key
4. **Frontend Setup**
   - Navigate to the `frontend` directory.
   - Install dependencies:
     ```bash
     npm install
     ```  
   - Start the development server:
     ```bash
     npm run dev
     ```  
   - Open `http://localhost:3000` to view the sales dashboard.

## Feature implemented

1. Display list of sales data from dummy data json
2. Style the list using tailwind css
3. Implement filter by region to see the desired sales list
4. Implement open AI integration using Gemini

