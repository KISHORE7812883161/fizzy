import sys
import os
from fastapi import FastAPI

# Add the root directory to sys.path so 'backend' is discoverable
root_dir = os.path.dirname(os.path.dirname(__file__))
sys.path.append(root_dir)
sys.path.append(os.path.join(root_dir, "backend"))

try:
    from backend.app.main import app
except ImportError as e:
    # Fallback/Diagnostic app if imports fail
    app = FastAPI()
    @app.get("/api/health")
    def health():
        return {"status": "error", "message": f"Import failed: {str(e)}", "path": sys.path}

# Vercel looks for 'app' or 'handler'
handler = app
