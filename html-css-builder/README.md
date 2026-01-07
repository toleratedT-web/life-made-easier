# HTML/CSS Builder - Free Wix-like Editor

A Python-based web application for building, previewing, and editing HTML and CSS files with drag-and-drop and resize capabilities - similar to Wix but completely free and open-source.

## Features

- 📄 Upload HTML file
- 🎨 Upload up to 3 CSS files
- 👀 Real-time preview with rendered styling
- 🖱️ Drag elements around to reposition them
- 📏 Resize elements from the corners
- 🎯 Visual feedback for editable elements
- 💾 Simple file management

## Installation

### Requirements
- Python 3.7 or higher
- pip (Python package manager)

### Setup

1. Navigate to the project directory:
```bash
cd html-css-builder
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

1. Start the Flask server:
```bash
python run.py
```

2. Open your web browser and navigate to:
```
http://localhost:5000
```

3. Use the sidebar to:
   - Select your HTML file
   - Select up to 3 CSS files
   - Click "Upload & Preview"

4. In the preview area:
   - **Drag** any element to move it
   - **Resize** elements by dragging from the bottom-right corner
   - Hover over elements to see the editable outline

## How to Use

### Uploading Files

1. **HTML File**: Click the "Click to select HTML" box or drag your HTML file into it
2. **CSS Files**: Add up to 3 CSS files using the CSS file upload areas
3. **Preview**: Click "Upload & Preview" to load your files

### Editing in Preview

- **Move Elements**: Click and drag any HTML element to reposition it
- **Resize Elements**: Hover over an element and drag the green square in the bottom-right corner
- **Visual Feedback**: Elements show a dashed green outline when you hover over them

## Example HTML/CSS

### Example HTML (save as `index.html`):
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <header>
        <h1>Welcome!</h1>
        <p>This is my website</p>
    </header>
    
    <div class="container">
        <section class="content">
            <h2>About</h2>
            <p>Some content here</p>
        </section>
    </div>
</body>
</html>
```

### Example CSS (save as `style.css`):
```css
body {
    font-family: Arial, sans-serif;
    background: #f0f0f0;
    margin: 0;
    padding: 20px;
}

header {
    background: #4CAF50;
    color: white;
    padding: 20px;
    border-radius: 5px;
}

.container {
    max-width: 800px;
    margin: 20px auto;
    background: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.content {
    line-height: 1.6;
}
```

## Project Structure

```
html-css-builder/
├── app/
│   ├── __init__.py          # Flask app initialization
│   ├── routes.py            # API routes
│   ├── static/
│   │   ├── css/             # Static CSS files
│   │   └── js/              # Static JS files
│   └── templates/
│       ├── index.html       # Main editor page
│       └── preview.html     # Preview page
├── uploads/                 # Uploaded files stored here
├── run.py                   # Application entry point
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## Browser Compatibility

- Chrome/Chromium ✅
- Firefox ✅
- Safari ✅
- Edge ✅

## Limitations

- Maximum file size: 16MB
- CSS files only (no SCSS/LESS)
- Drag/resize changes are not persisted (refresh to reset)
- Works best with modern browsers

## Future Enhancements

- [ ] Save projects
- [ ] Undo/Redo functionality
- [ ] Color picker
- [ ] Font selector
- [ ] Layer panel
- [ ] Code editor with syntax highlighting
- [ ] Export project as ZIP
- [ ] Responsive preview modes
- [ ] Element properties panel

## License

Free to use and modify!

## Contributing

Feel free to improve this project and submit pull requests or suggestions!
