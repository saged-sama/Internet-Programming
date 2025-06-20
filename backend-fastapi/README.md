# FastAPI Backend

This project uses [FastAPI](https://fastapi.tiangolo.com/) for building APIs.

## Project Structure

```
.
├── app/
│   └── ...           # Your FastAPI application code
├── requirements.txt  # Python dependencies
└── README.md
```

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/saged-sama/Internet-Programming
    cd Internet-Programming/backend-fastapi
    ```

2. **Create a virtual environment and activate it:**
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # On Windows: .\.venv\Scripts\activate
    ```

3. **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## Running for Development

```bash
uvicorn app.main:app --reload
# or
fastapi dev app/main.py
```
- Replace `app.main:app` with the actual path to your FastAPI app instance.

## Building for Production

Use a production server like [Gunicorn](https://gunicorn.org/) with [Uvicorn workers](https://www.uvicorn.org/deployment/):

```bash
gunicorn app.main:app -k uvicorn.workers.UvicornWorker
```