/**
 * Modern HTML/CSS/JS Editor with Live Preview
 * 2025 Edition - Refactored with ES6+ features
 */

class CodeEditor {
  constructor() {
    this.livePreviewEnabled = false;
    this.elements = {};
    this.init();
  }

  // Initialize the editor
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.cacheElements();
      this.bindEvents();
      this.setupInitialState();
    });
  }

  // Cache DOM elements
  cacheElements() {
    this.elements = {
      codeArea: document.getElementById('editor-codearea'),
      preview: document.getElementById('editor-preview'),
      liveToggle: document.getElementById('live-checkbox'),
      fontSizeInput: document.getElementById('editor-font-size'),
      fontUpBtn: document.querySelector('button[aria-label="Increase font size"]'),
      fontDownBtn: document.querySelector('button[aria-label="Decrease font size"]'),
      sampleBtn: document.querySelector('button[aria-label="Load sample page"]'),
      saveBtn: document.querySelector('button[aria-label="Save code as HTML file"]')
    };
  }

  // Bind event listeners
  bindEvents() {
    const { codeArea, liveToggle, fontSizeInput, fontUpBtn, fontDownBtn, sampleBtn, saveBtn } = this.elements;

    // Code editor events
    codeArea.addEventListener('input', () => this.handleCodeChange());
    codeArea.addEventListener('keydown', (e) => this.handleTabKey(e));

    // Font size controls
    fontUpBtn.addEventListener('click', () => this.adjustFontSize(1));
    fontDownBtn.addEventListener('click', () => this.adjustFontSize(-1));
    fontSizeInput.addEventListener('blur', () => this.setFontSize());
    fontSizeInput.addEventListener('change', () => this.setFontSize());

    // Control buttons
    liveToggle.addEventListener('click', () => this.toggleLivePreview());
    sampleBtn.addEventListener('click', () => this.loadSamplePage());
    saveBtn.addEventListener('click', () => this.saveCode());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
  }

  // Setup initial state
  setupInitialState() {
    this.setFontSize();
    this.showPreviewDisabledMessage();
  }

  // Handle code changes
  handleCodeChange() {
    if (this.livePreviewEnabled) {
      this.updatePreview();
    }
  }

  // Handle tab key in textarea
  handleTabKey(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      
      const { selectionStart, selectionEnd, value } = event.target;
      const newValue = value.substring(0, selectionStart) + '\t' + value.substring(selectionEnd);
      
      event.target.value = newValue;
      event.target.selectionStart = event.target.selectionEnd = selectionStart + 1;
      
      // Trigger live update if enabled
      this.handleCodeChange();
    }
  }

  // Handle keyboard shortcuts
  handleKeyboardShortcuts(event) {
    if (event.ctrlKey || event.metaKey) {
      switch(event.key) {
        case 's':
          event.preventDefault();
          this.saveCode();
          break;
        case 'Enter':
          event.preventDefault();
          this.toggleLivePreview();
          break;
        case '=':
        case '+':
          event.preventDefault();
          this.adjustFontSize(1);
          break;
        case '-':
          event.preventDefault();
          this.adjustFontSize(-1);
          break;
      }
    }
  }

  // Toggle live preview
  toggleLivePreview() {
    this.livePreviewEnabled = !this.livePreviewEnabled;
    const { liveToggle } = this.elements;
    
    if (this.livePreviewEnabled) {
      liveToggle.innerHTML = '✓';
      liveToggle.style.color = '#4ade80';
      liveToggle.setAttribute('aria-pressed', 'true');
      this.updatePreview();
    } else {
      liveToggle.innerHTML = '✗';
      liveToggle.style.color = '#ef4444';
      liveToggle.setAttribute('aria-pressed', 'false');
      this.showPreviewDisabledMessage();
    }
  }

  // Update preview iframe
  updatePreview() {
    const { codeArea, preview } = this.elements;
    const code = codeArea.value;
    
    try {
      preview.srcdoc = code;
    } catch (error) {
      console.warn('Preview update failed:', error);
      preview.srcdoc = this.getErrorHTML('Preview update failed');
    }
  }

  // Show preview disabled message
  showPreviewDisabledMessage() {
    const { preview } = this.elements;
    const message = `
      <style>
        body {
          margin: 0;
          padding: 20px;
          background: #1f2937;
          color: #f3f4f6;
          font-family: system-ui, -apple-system, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
        }
        h1 {
          font-size: 1.5rem;
          margin: 0;
          opacity: 0.7;
        }
      </style>
      <body>
        <h1>Live preview is disabled</h1>
      </body>
    `;
    preview.srcdoc = message;
  }

  // Get error HTML template
  getErrorHTML(message) {
    return `
      <style>
        body {
          margin: 0;
          padding: 20px;
          background: #fef2f2;
          color: #dc2626;
          font-family: system-ui, -apple-system, sans-serif;
          text-align: center;
        }
      </style>
      <body>
        <h1>Error: ${message}</h1>
      </body>
    `;
  }

  // Validate font size
  isValidFontSize(size) {
    const num = parseInt(size);
    return !isNaN(num) && num >= 8 && num <= 72;
  }

  // Adjust font size by delta
  adjustFontSize(delta) {
    const { fontSizeInput } = this.elements;
    const currentSize = parseInt(fontSizeInput.value) || 20;
    const newSize = Math.max(8, Math.min(72, currentSize + delta));
    
    fontSizeInput.value = newSize;
    this.applyFontSize(newSize);
  }

  // Set font size from input
  setFontSize() {
    const { fontSizeInput } = this.elements;
    const size = fontSizeInput.value;
    
    if (this.isValidFontSize(size)) {
      this.applyFontSize(parseInt(size));
    } else {
      fontSizeInput.value = '20';
      this.applyFontSize(20);
    }
  }

  // Apply font size to code area
  applyFontSize(size) {
    const { codeArea } = this.elements;
    codeArea.style.fontSize = `${size}px`;
  }

  // Load sample page
  loadSamplePage() {
    const { codeArea } = this.elements;
    const sampleCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.6;
        }
        h1 {
            color: #2563eb;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 0.5rem;
        }
        .highlight {
            background: #fef3c7;
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
        }
    </style>
</head>
<body>
    <h1>Welcome to My Page</h1>
    <p>This is a <span class="highlight">sample page</span> to get you started.</p>
    <p>Edit this code and see the changes live!</p>
</body>
</html>`;
    
    codeArea.value = sampleCode;
    if (this.livePreviewEnabled) {
      this.updatePreview();
    }
    
    // Focus back to the code area
    codeArea.focus();
  }

  // Generate random filename
  generateFilename() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 8;
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return `code_${result}.html`;
  }

  // Download file
  downloadFile(content, filename, mimeType = 'text/html') {
    try {
      const blob = new Blob([content], { type: mimeType });
      
      if (navigator.msSaveOrOpenBlob) {
        // IE10+
        navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        // Modern browsers
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      }
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: copy to clipboard
      this.copyToClipboard(content);
    }
  }

  // Copy content to clipboard as fallback
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      alert('Code copied to clipboard!');
    } catch (error) {
      console.error('Clipboard operation failed:', error);
    }
  }

  // Save code as HTML file
  saveCode() {
    const { codeArea } = this.elements;
    const code = codeArea.value.trim();
    
    if (!code) {
      alert('Please write some code before saving!');
      return;
    }
    
    const filename = this.generateFilename();
    this.downloadFile(code, filename);
  }
}

// Initialize the editor
const editor = new CodeEditor();