const htmlInput = document.getElementById('htmlFile');
const cssInputs = [document.getElementById('cssFile1'), document.getElementById('cssFile2'), document.getElementById('cssFile3')];
const uploadBtn = document.getElementById('uploadBtn');
const previewFrame = document.getElementById('previewFrame');

let selectedFiles = {
    html: null,
    css: [null, null, null]
};

// File input handling
document.getElementById('htmlDropZone').addEventListener('click', () => htmlInput.click());
htmlInput.addEventListener('change', (e) => {
    selectedFiles.html = e.target.files[0];
    updateFileDisplay('html', 0);
});

cssInputs.forEach((input, index) => {
    document.getElementById(`css${index + 1}DropZone`).addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => {
        selectedFiles.css[index] = e.target.files[0];
        updateFileDisplay('css', index);
    });
});

// Drag and drop
['htmlDropZone', 'css1DropZone', 'css2DropZone', 'css3DropZone'].forEach((id, index) => {
    const zone = document.getElementById(id);
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('active');
    });
    zone.addEventListener('dragleave', () => {
        zone.classList.remove('active');
    });
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('active');
        const files = e.dataTransfer.files;
        if (index === 0) {
            htmlInput.files = files;
            selectedFiles.html = files[0];
            updateFileDisplay('html', 0);
        } else {
            cssInputs[index - 1].files = files;
            selectedFiles.css[index - 1] = files[0];
            updateFileDisplay('css', index - 1);
        }
    });
});

function updateFileDisplay(type, index) {
    if (type === 'html' && selectedFiles.html) {
        document.getElementById('htmlFileName').textContent = `✓ ${selectedFiles.html.name}`;
    } else if (type === 'css' && selectedFiles.css[index]) {
        document.getElementById(`cssFileName${index + 1}`).textContent = `✓ ${selectedFiles.css[index].name}`;
    }
}

uploadBtn.addEventListener('click', uploadFiles);

async function uploadFiles() {
    if (!selectedFiles.html) {
        showMessage('Please select an HTML file', true);
        return;
    }

    const formData = new FormData();
    formData.append('html_file', selectedFiles.html);
    
    selectedFiles.css.forEach((file, index) => {
        if (file) {
            formData.append(`css_file_${index + 1}`, file);
        }
    });

    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Uploading...';

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            showMessage('Files uploaded successfully!');
            loadPreview();
        } else {
            showMessage('Upload failed', true);
        }
    } catch (error) {
        showMessage('Error uploading files: ' + error.message, true);
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload & Preview';
    }
}

async function loadPreview() {
    try {
        const response = await fetch('/api/get-files');
        const files = await response.json();

        if (files.html) {
            // Create HTML with CSS
            let html = files.html;
            
            // Inject CSS
            let cssContent = '';
            files.css.forEach(css => {
                if (css) {
                    cssContent += `<style>${css}</style>\n`;
                }
            });

            // Inject editable styles and scripts
            const fullHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${cssContent}
    <style>
        * {
            outline: 1px solid transparent;
        }
        body {
            margin: 0;
            padding: 10px;
        }
        .editable-element {
            position: relative;
            outline: 1px dashed rgba(76, 175, 80, 0.3) !important;
        }
        .editable-element:hover {
            outline: 2px dashed #4CAF50 !important;
            box-shadow: inset 0 0 0 2px rgba(76, 175, 80, 0.1);
        }
        .resize-handle {
            position: absolute;
            width: 10px;
            height: 10px;
            background: #4CAF50;
            border: 2px solid white;
            border-radius: 2px;
            cursor: se-resize;
            bottom: -5px;
            right: -5px;
            display: none;
        }
        .editable-element:hover .resize-handle {
            display: block;
        }
    </style>
</head>
<body>
    ${html.replace(/<body[^>]*>/i, '<body>').replace(/<\/body>/i, '')}
    <script>
        // Make elements draggable and resizable
        const elements = document.querySelectorAll('div, p, h1, h2, h3, h4, h5, h6, span, a, button, img, section, article, nav, header, footer');
        
        elements.forEach(el => {
            if (!el.querySelector('*')) return; // Skip nested elements
            
            el.classList.add('editable-element');
            el.style.position = el.style.position || 'relative';
            
            // Add resize handle
            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'resize-handle';
            el.appendChild(resizeHandle);
            
            // Drag functionality
            let isDragging = false;
            let offsetX = 0;
            let offsetY = 0;
            
            el.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('resize-handle')) return;
                isDragging = true;
                offsetX = e.clientX - el.offsetLeft;
                offsetY = e.clientY - el.offsetTop;
                el.style.zIndex = 1000;
            });
            
            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    el.style.left = (e.clientX - offsetX) + 'px';
                    el.style.top = (e.clientY - offsetY) + 'px';
                }
            });
            
            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
            
            // Resize functionality
            let isResizing = false;
            let startX, startY, startWidth, startHeight;
            
            resizeHandle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = el.offsetWidth;
                startHeight = el.offsetHeight;
                el.style.zIndex = 1000;
            });
            
            document.addEventListener('mousemove', (e) => {
                if (isResizing) {
                    const newWidth = startWidth + (e.clientX - startX);
                    const newHeight = startHeight + (e.clientY - startY);
                    
                    if (newWidth > 50) el.style.width = newWidth + 'px';
                    if (newHeight > 50) el.style.height = newHeight + 'px';
                }
            });
            
            document.addEventListener('mouseup', () => {
                isResizing = false;
            });
        });
    </script>
</body>
</html>`;

            const blob = new Blob([fullHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            previewFrame.src = url;
        }
    } catch (error) {
        showMessage('Error loading preview: ' + error.message, true);
    }
}

function showMessage(text, isError = false) {
    const msg = document.getElementById('statusMessage');
    msg.textContent = text;
    msg.classList.toggle('error', isError);
    msg.classList.add('show');
    setTimeout(() => {
        msg.classList.remove('show');
    }, 3000);
}

// ---------------- Inspector / Editing Tools ----------------
let selectedElement = null;
const selectedInfo = document.getElementById('selectedInfo');
const inspectorText = document.getElementById('inspectorText');
const inspectorHTML = document.getElementById('inspectorHTML');
const inspectorColor = document.getElementById('inspectorColor');
const inspectorBg = document.getElementById('inspectorBg');
const applyBtn = document.getElementById('applyBtn');
const injectBtn = document.getElementById('injectBtn');
const injectJs = document.getElementById('injectJs');
const exportBtn = document.getElementById('exportBtn');

function attachInspectorToPreview() {
    try {
        const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        if (!doc) return;

        // Click inside preview selects an element
        doc.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            selectedElement = e.target;
            updateInspectorFromElement(selectedElement);
        }, true);
    } catch (err) {
        console.warn('Inspector attach failed:', err);
    }
}

function updateInspectorFromElement(el) {
    if (!el) return;
    selectedInfo.textContent = `<${el.tagName.toLowerCase()}${el.id ? ' #' + el.id : ''}${el.className ? ' .' + el.className.split(' ').join('.') : ''}>`;
    inspectorText.value = el.innerText || '';
    inspectorHTML.value = el.innerHTML || '';
    const cs = (previewFrame.contentWindow || previewFrame.contentDocument.defaultView).getComputedStyle(el);
    inspectorColor.value = rgbToHex(cs.color) || '#000000';
    inspectorBg.value = rgbToHex(cs.backgroundColor) || '#ffffff';
}

function rgbToHex(rgb) {
    if (!rgb) return null;
    const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return null;
    return '#' + [1,2,3].map(i => parseInt(m[i]).toString(16).padStart(2,'0')).join('');
}

applyBtn.addEventListener('click', () => {
    if (!selectedElement) { showMessage('No element selected', true); return; }
    try {
        // Apply inner HTML and styles
        selectedElement.innerHTML = inspectorHTML.value;
        selectedElement.style.color = inspectorColor.value;
        selectedElement.style.backgroundColor = inspectorBg.value;
        showMessage('Applied changes');
    } catch (err) {
        showMessage('Apply failed: ' + err.message, true);
    }
});

injectBtn.addEventListener('click', () => {
    try {
        const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        const script = doc.createElement('script');
        script.type = 'text/javascript';
        script.textContent = injectJs.value;
        // mark as editor-injected so exports can ignore it
        script.dataset.editor = 'true';
        doc.body.appendChild(script);
        showMessage('Injected JS executed (preview only)');
    } catch (err) {
        showMessage('JS inject failed: ' + err.message, true);
    }
});

exportBtn.addEventListener('click', () => {
    try {
        const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;

        // Work on a cloned copy so we can clean editor artifacts without affecting preview
        const clone = doc.documentElement.cloneNode(true);

        // Remove editor style/script markers
        const editorStyle = clone.querySelector('#__editor_styles');
        if (editorStyle) editorStyle.remove();
        const editorScript = clone.querySelector('#__editor_script');
        if (editorScript) editorScript.remove();

        // Remove any script tags that were added by the editor (marked with data-editor)
        Array.from(clone.querySelectorAll('script')).forEach(s => {
            if (s.dataset && s.dataset.editor === 'true') s.remove();
        });

        // Remove resize handles and editor classes
        Array.from(clone.querySelectorAll('.resize-handle')).forEach(n => n.remove());
        Array.from(clone.querySelectorAll('.editable-element')).forEach(el => {
            el.classList.remove('editable-element');
        });

        // Build a minimal export document
        // Extract head and body
        const headClone = clone.querySelector('head');
        const bodyClone = clone.querySelector('body');

        // Collect inline styles (excluding editor styles already removed)
        let styles = '';
        Array.from(headClone.querySelectorAll('style')).forEach(s => { styles += s.textContent + '\n\n'; s.remove(); });

        // Keep <link rel="stylesheet"> tags as-is (external CSS)
        const linkTags = Array.from(headClone.querySelectorAll('link[rel="stylesheet"]')).map(l => l.outerHTML).join('\n');

        // Collect inline scripts (without src) to script.js, leave external scripts (with src) in-place
        let scripts = '';
        Array.from(bodyClone.querySelectorAll('script')).forEach(s => {
            if (!s.src) { scripts += s.textContent + '\n\n'; s.remove(); }
        });

        // Remove any editor-specific attributes (data-editor)
        Array.from(clone.querySelectorAll('[data-editor]')).forEach(n => n.removeAttribute('data-editor'));

        // Construct export HTML
        let exportHtml = '<!DOCTYPE html>\n<html>\n';
        exportHtml += '<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n';
        exportHtml += linkTags + '\n';
        if (styles.trim()) exportHtml += '<link rel="stylesheet" href="styles.css">\n';
        exportHtml += '</head>\n';
        exportHtml += '<body>\n' + bodyClone.innerHTML + '\n';

        // Re-insert external scripts that were kept
        const externalScripts = Array.from(clone.querySelectorAll('script[src]')).map(s => s.outerHTML).join('\n');
        exportHtml += externalScripts + '\n';

        if (scripts.trim()) exportHtml += '<script src="script.js"></script>\n';
        exportHtml += '</body>\n</html>';

        // Download files
        downloadBlob(exportHtml, 'index.html', 'text/html');
        if (styles.trim()) downloadBlob(styles, 'styles.css', 'text/css');
        if (scripts.trim()) downloadBlob(scripts, 'script.js', 'application/javascript');

        showMessage('Exported cleaned site files (downloads should start)');
    } catch (err) {
        showMessage('Export failed: ' + err.message, true);
    }
});

function downloadBlob(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// When preview frame loads, attach inspector hooks
previewFrame.addEventListener('load', () => {
    attachInspectorToPreview();
});
