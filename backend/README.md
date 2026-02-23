# Fizzy Manufacturing Backend (Python + FastAPI + MySQL)

## Prerequisites
1. Python 3.8+ installed.
2. MySQL Server running.
3. Create a database named `fizzy_db` in MySQL.

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
3. Configure `.env`:
   Update your database credentials in the `.env` file.

## Run
```bash
python -m app.main
```
The API will be available at `http://localhost:8000`.
Check the docs at `http://localhost:8000/docs`.
