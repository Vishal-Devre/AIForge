# AIForge Backend

The production-grade AI Infrastructure backend for AIForge.

## Tech Stack
- Python 3.13
- FastAPI
- PostgreSQL
- SQLAlchemy
- Supabase

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Setup environment variables:
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

5. Access documentation:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc
