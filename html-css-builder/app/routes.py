from flask import render_template, request, jsonify, send_file
from app import app
from werkzeug.utils import secure_filename
import os

ALLOWED_EXTENSIONS = {'html', 'css', 'txt'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_files():
    """Handle file uploads"""
    files = {}
    
    # Get HTML file
    if 'html_file' in request.files:
        file = request.files['html_file']
        if file and file.filename and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], 'index.html'))
            files['html'] = 'index.html'
    
    # Get CSS files (up to 3)
    css_count = 0
    for i in range(1, 4):
        key = f'css_file_{i}'
        if key in request.files and css_count < 3:
            file = request.files[key]
            if file and file.filename and allowed_file(file.filename):
                ext = file.filename.rsplit('.', 1)[1].lower()
                filename = secure_filename(f'style_{i}.{ext}')
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                files[f'css_{i}'] = filename
                css_count += 1
    
    return jsonify({'success': True, 'files': files})

@app.route('/preview')
def preview():
    """Serve the preview page"""
    return render_template('preview.html')

@app.route('/api/get-files')
def get_files():
    """Get list of uploaded files"""
    upload_folder = app.config['UPLOAD_FOLDER']
    files = {
        'html': None,
        'css': []
    }
    
    # Check for HTML file
    html_path = os.path.join(upload_folder, 'index.html')
    if os.path.exists(html_path):
        with open(html_path, 'r', encoding='utf-8') as f:
            files['html'] = f.read()
    
    # Check for CSS files
    for i in range(1, 4):
        css_path = os.path.join(upload_folder, f'style_{i}.css')
        if os.path.exists(css_path):
            with open(css_path, 'r', encoding='utf-8') as f:
                files['css'].append(f.read())
    
    return jsonify(files)

@app.route('/api/save-element-position', methods=['POST'])
def save_element_position():
    """Save element position and size (for future persistence)"""
    data = request.get_json()
    # This could be saved to a database or JSON file
    # For now, it's just received and acknowledged
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
