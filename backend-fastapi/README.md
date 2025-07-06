# FastAPI Backend

A FastAPI backend application with PostgreSQL database integration.

## Project Structure
```
backend-fastapi/
├── app/
│   ├── main.py
│   ├── models/
│   ├── routes/
│   └── utils/
├── requirements.txt
└── README.md
```

## Environment Variables
Create a `.env` file in the root directory:
```
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Setup and Installation

### Create Virtual Environment
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.\.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

## Running the Application

### Using Uvicorn
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Using FastAPI CLI
```bash
fastapi dev app/main.py
```

### Using Docker
Create a `Dockerfile`:
```dockerfile
FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t fastapi-backend .
docker run -p 8000:8000 --env-file .env fastapi-backend
```

## Access
- API: http://localhost:8000
- Docs: http://localhost:8000/docs (Use this for testing)