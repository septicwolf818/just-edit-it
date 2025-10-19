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
    this.handlePWAActions();
  }

  // Handle PWA actions from URL parameters
  handlePWAActions() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action) {
      this.executePWAAction(action);
      // Clean up URL without reloading
      const cleanUrl = new URL(window.location);
      cleanUrl.searchParams.delete('action');
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }

  // Execute specific PWA action
  executePWAAction(action) {
    switch (action) {
      case 'new':
        this.loadSamplePage();
        this.showActionNotification('New project loaded!', 'success');
        break;
      case 'blank':
        this.clearEditor();
        this.showActionNotification('Blank editor ready!', 'info');
        break;
      case 'preview':
        this.clearEditor();
        if (!this.livePreviewEnabled) {
          this.toggleLivePreview();
        }
        this.showActionNotification('Live preview enabled!', 'success');
        break;
      default:
        console.log('Unknown PWA action:', action);
    }
  }

  // Clear editor content
  clearEditor() {
    const { codeArea } = this.elements;
    codeArea.value = '';
    codeArea.focus();
    if (this.livePreviewEnabled) {
      this.updatePreview();
    }
    this.showActionNotification('Editor cleared', 'info');
  }



  // Show temporary notification for actions
  showActionNotification(message, type = 'info') {
    const notification = document.createElement('div');
    
    // Define notification colors based on type
    const notificationStyles = {
      success: '#4ade80',
      warning: '#fbbf24',
      error: '#ef4444',
      info: '#2563eb'
    };
    
    const backgroundColor = notificationStyles[type] || notificationStyles.info;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${backgroundColor};
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 1000;
      opacity: 0;
      transform: translateY(-20px);
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      max-width: 300px;
      word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    });
    
    // Auto-remove after delay (longer for warnings/errors)
    const delay = type === 'warning' || type === 'error' ? 4000 : 3000;
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, delay);
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
      liveToggle.textContent = '✓';
      liveToggle.setAttribute('aria-pressed', 'true');
      this.updatePreview();
      this.showActionNotification('Live preview enabled!', 'success');
    } else {
      liveToggle.textContent = '✕';
      liveToggle.setAttribute('aria-pressed', 'false');
      this.showPreviewDisabledMessage();
      this.showActionNotification('Live preview disabled', 'info');
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
    
    // Show notification for font size change
    this.showActionNotification(`Font size: ${newSize}px`, 'info');
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
    
    // Show notification
    this.showActionNotification('Sample code loaded!', 'success');
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

  // Download file with best available feedback
  downloadFile(content, filename, mimeType = 'text/html') {
    try {
      const blob = new Blob([content], { type: mimeType });
      
      if (navigator.msSaveOrOpenBlob) {
        // IE10+ - this method provides synchronous feedback
        try {
          navigator.msSaveOrOpenBlob(blob, filename);
          this.showActionNotification(`File saved: ${filename}`, 'success');
        } catch (ieError) {
          throw ieError;
        }
      } else {
        // Modern browsers - use File System Access API if available (Chrome 86+)
        if ('showSaveFilePicker' in window) {
          this.downloadWithFileSystemAPI(content, filename, mimeType);
        } else {
          // Fallback to traditional download with enhanced detection
          this.downloadWithLinkMethod(content, filename, mimeType);
        }
      }
    } catch (error) {
      console.error('Download failed:', error);
      this.showActionNotification('Download failed', 'error');
    }
  }

  // Modern File System Access API (Chrome 86+, Edge 86+)
  async downloadWithFileSystemAPI(content, filename, mimeType) {
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'HTML files',
          accept: { 'text/html': ['.html', '.htm'] }
        }]
      });
      
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      
      // Get the actual filename chosen by the user
      const actualFilename = fileHandle.name;
      this.showActionNotification(`File saved: ${actualFilename}`, 'success');
    } catch (error) {
      if (error.name === 'AbortError') {
        this.showActionNotification('Save cancelled by user', 'info');
      } else {
        throw error; // Re-throw to be caught by outer try-catch
      }
    }
  }

  // Traditional link download method with enhanced user feedback
  downloadWithLinkMethod(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    // Add focus/blur detection to improve feedback timing
    let downloadStarted = false;
    
    const handleWindowBlur = () => {
      if (!downloadStarted) {
        downloadStarted = true;
        setTimeout(() => {
          this.showActionNotification(`Download starting: ${filename}`, 'success');
        }, 200);
      }
    };
    
    const handleWindowFocus = () => {
      if (downloadStarted) {
        setTimeout(() => {
          this.showActionNotification('Check your Downloads folder', 'info');
        }, 500);
      }
    };
    
    // Listen for window events that might indicate download dialog
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      
      // Fallback notification if no other feedback was given
      if (!downloadStarted) {
        this.showActionNotification(`Download initiated: ${filename}`, 'success');
      }
    }, 1000);
  }

  // Save code as HTML file
  saveCode() {
    const { codeArea } = this.elements;
    const code = codeArea.value.trim();
    
    if (!code) {
      this.showActionNotification('Please write some code before saving!', 'warning');
      return;
    }
    
    const filename = this.generateFilename();
    this.downloadFile(code, filename);
  }
}

// Initialize the editor
const editor = new CodeEditor();