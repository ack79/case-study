import { LitElement, html, css } from 'lit';

export class Toast extends LitElement {
  static properties = {
    message: { type: String },
    type: { type: String }, // 'success', 'error', 'warning', 'info'
    duration: { type: Number },
    isVisible: { type: Boolean },
    position: { type: String } // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
  };

  static styles = css`
    :host {
      position: fixed;
      z-index: 10001;
      pointer-events: none;
    }

    :host([position="top-right"]) {
      top: 20px;
      right: 20px;
    }

    :host([position="top-left"]) {
      top: 20px;
      left: 20px;
    }

    :host([position="bottom-right"]) {
      bottom: 20px;
      right: 20px;
    }

    :host([position="bottom-left"]) {
      bottom: 20px;
      left: 20px;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      border-left: 4px solid;
      min-width: 300px;
      max-width: 400px;
      pointer-events: auto;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    }

    :host([position*="left"]) .toast {
      transform: translateX(-100%);
    }

    .toast--visible {
      opacity: 1;
      transform: translateX(0);
    }

    .toast--success {
      border-left-color: #10B981;
    }

    .toast--error {
      border-left-color: #EF4444;
    }

    .toast--warning {
      border-left-color: #F59E0B;
    }

    .toast--info {
      border-left-color: #3B82F6;
    }

    .toast-icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toast-icon .material-icons {
      font-family: 'Material Icons';
      font-size: 20px;
    }

    .toast--success .toast-icon {
      color: #10B981;
    }

    .toast--error .toast-icon {
      color: #EF4444;
    }

    .toast--warning .toast-icon {
      color: #F59E0B;
    }

    .toast--info .toast-icon {
      color: #3B82F6;
    }

    .toast-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .toast-message {
      font-size: 14px;
      font-weight: 500;
      color: #1F2937;
      line-height: 1.4;
      margin: 0;
    }

    .toast-close {
      flex-shrink: 0;
      background: none;
      border: none;
      cursor: pointer;
      color: #9CA3AF;
      padding: 0;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 2px;
      transition: all 0.2s ease;
    }

    .toast-close:hover {
      background: #F3F4F6;
      color: #374151;
    }

    .toast-close .material-icons {
      font-family: 'Material Icons';
      font-size: 16px;
    }

    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      background: currentColor;
      opacity: 0.3;
      transition: width linear;
    }

    .toast--success .toast-progress {
      color: #10B981;
    }

    .toast--error .toast-progress {
      color: #EF4444;
    }

    .toast--warning .toast-progress {
      color: #F59E0B;
    }

    .toast--info .toast-progress {
      color: #3B82F6;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      :host([position="top-right"]) {
        top: auto;
        bottom: 100px;
        right: 50%;
        left: auto;
        transform: translateX(50%);
      }

      :host([position="top-left"]) {
        top: auto;
        bottom: 100px;
        right: 50%;
        left: auto;
        transform: translateX(50%);
      }

      :host([position="bottom-right"]) {
        top: auto;
        bottom: 100px;
        right: 50%;
        left: auto;
        transform: translateX(50%);
      }

      :host([position="bottom-left"]) {
        top: auto;
        bottom: 100px;
        right: 50%;
        left: auto;
        transform: translateX(50%);
      }

      .toast {
        min-width: 300px;
        max-width: 400px;
        width: auto;
        padding: 16px;
      }

      .toast-message {
        font-size: 15px;
      }

      :host([position*="left"]) .toast,
      :host([position*="right"]) .toast {
        transform: translateY(-50%) translateY(100%);
      }

      :host([position*="bottom"]) .toast {
        transform: translateY(-50%) translateY(100%);
      }
    }
  `;

  constructor() {
    super();
    this.message = '';
    this.type = 'info';
    this.duration = 4000;
    this.isVisible = false;
    this.position = 'top-right';
    this._progressTimer = null;
    this._hideTimer = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('position', this.position);
  }

  updated(changedProperties) {
    if (changedProperties.has('isVisible')) {
      if (this.isVisible) {
        this._startProgress();
      } else {
        this._clearTimers();
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearTimers();
  }

  render() {
    const iconMap = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };

    return html`
      <div class="toast toast--${this.type} ${this.isVisible ? 'toast--visible' : ''}">
        <div class="toast-icon">
          <span class="material-icons">${iconMap[this.type] || 'info'}</span>
        </div>
        
        <div class="toast-content">
          <p class="toast-message">${this.message}</p>
        </div>
        
        <button class="toast-close" @click="${this._handleClose}">
          <span class="material-icons">close</span>
        </button>
        
        <div class="toast-progress" style="width: 100%"></div>
      </div>
    `;
  }

  _startProgress() {
    if (this.duration <= 0) return;

    const progressBar = this.shadowRoot?.querySelector('.toast-progress');
    if (progressBar) {
      progressBar.style.width = '100%';
      progressBar.style.transition = `width ${this.duration}ms linear`;
      
      // Start progress animation
      requestAnimationFrame(() => {
        progressBar.style.width = '0%';
      });
    }

    // Auto hide after duration
    this._hideTimer = setTimeout(() => {
      this.hide();
    }, this.duration);
  }

  _clearTimers() {
    if (this._progressTimer) {
      clearTimeout(this._progressTimer);
      this._progressTimer = null;
    }
    if (this._hideTimer) {
      clearTimeout(this._hideTimer);
      this._hideTimer = null;
    }
  }

  _handleClose() {
    this.hide();
  }

  // Public methods
  show(message, type = 'info', duration = 4000) {
    this.message = message;
    this.type = type;
    this.duration = duration;
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
    this.dispatchEvent(new CustomEvent('toast-close', {
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('app-toast', Toast);
