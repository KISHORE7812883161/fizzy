import sys
import os

# Add root and backend directories to sys.path
# This allows imports like 'from backend.app.main' and 'from app.core'
root_dir = os.path.dirname(os.path.dirname(__file__))
sys.path.append(root_dir)
sys.path.append(os.path.join(root_dir, "backend"))

from backend.app.main import app

# This is required for Vercel to find the app instance
handler = app
