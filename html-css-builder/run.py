import sys
import os
from app import app

if __name__ == '__main__':
    # Ensure the uploads folder exists
    upload_folder = os.path.join(os.path.dirname(__file__), 'uploads')
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    print("🚀 Starting HTML/CSS Builder...")
    print("📱 Open your browser and go to: http://localhost:5000")
    app.run(debug=True, port=5000, use_reloader=True)
