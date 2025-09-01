import '../components/toast.js';

class ToastManager {
  constructor() {
    this.toasts = new Map();
    this.container = null;
    this.maxToasts = 5;
    this._initContainer();
  }

  _initContainer() {
    if (typeof document === 'undefined') return;
    
    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      bottom: 20px;
      z-index: 10001;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
      justify-content: flex-start;
      align-items: flex-end;
      max-width: 400px;
    `;
    
    // Add responsive styles for mobile
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
          .toast-container {
            top: auto !important;
            bottom: 0 !important;
            right: 50% !important;
            left: auto !important;
            max-width: 400px !important;
            align-items: stretch !important;
            transform: translateX(50%) !important;
          }
        }
    `;
    document.head.appendChild(style);
    
    // Add class for mobile targeting
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', options = {}) {
    if (!this.container) this._initContainer();
    
    const {
      duration = 4000,
      position = 'top-right',
      closable = true
    } = options;

    // Limit number of toasts
    if (this.toasts.size >= this.maxToasts) {
      const oldestToast = this.toasts.values().next().value;
      this.hide(oldestToast.id);
    }

    const id = Date.now() + Math.random();
    const toast = document.createElement('app-toast');
    
    toast.message = message;
    toast.type = type;
    toast.duration = duration;
    toast.position = position;
    
    // Handle toast close event
    toast.addEventListener('toast-close', () => {
      this.hide(id);
    });

    this.container.appendChild(toast);
    this.toasts.set(id, { toast, id });

    // Show toast with slight delay for animation
    requestAnimationFrame(() => {
      toast.isVisible = true;
    });

    return id;
  }

  hide(id) {
    const toastData = this.toasts.get(id);
    if (!toastData) return;

    const { toast } = toastData;
    toast.isVisible = false;

    // Remove from DOM after animation
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      this.toasts.delete(id);
    }, 300);
  }

  success(message, options = {}) {
    return this.show(message, 'success', options);
  }

  error(message, options = {}) {
    return this.show(message, 'error', options);
  }

  warning(message, options = {}) {
    return this.show(message, 'warning', options);
  }

  info(message, options = {}) {
    return this.show(message, 'info', options);
  }

  clear() {
    this.toasts.forEach((_, id) => {
      this.hide(id);
    });
  }
}

// Create singleton instance
export const toast = new ToastManager();
