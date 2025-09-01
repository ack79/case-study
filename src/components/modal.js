import { LitElement, html, css } from 'lit';
import './button.js';
import { t, addLanguageChangeListener } from '../utils/i18n.js';

export class Modal extends LitElement {
  static properties = {
    isOpen: { type: Boolean },
    type: { type: String }, // 'confirm', 'alert', 'info'
    title: { type: String },
    message: { type: String },
    confirmText: { type: String },
    cancelText: { type: String },
    confirmVariant: { type: String },
    showCloseIcon: { type: Boolean }
  };

  static styles = css`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;
      display: flex;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: all 0.2s ease;
    }

    :host([is-open]) {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }

    .modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      box-sizing: border-box;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      max-width: 400px;
      width: 100%;
      max-height: 90vh;
      overflow: hidden;
      position: relative;
      animation: slideIn 0.2s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(-10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .modal-header {
      padding: 20px 20px 0 20px;
      position: relative;
    }

    .modal-title {
      font-size: 18px;
      font-weight: 600;
      color: #FF620B;
      margin: 0;
      padding-right: 30px;
    }

    .close-button {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      cursor: pointer;
      color: #9CA3AF;
      font-size: 20px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .close-button:hover {
      background: #F3F4F6;
      color: #374151;
    }

    .close-button .material-icons {
      font-family: 'Material Icons';
      font-size: 20px;
    }

    .modal-body {
      padding: 16px 20px 20px 20px;
    }

    .modal-message {
      font-size: 14px;
      color: #6B7280;
      line-height: 1.5;
      margin: 0;
    }

    .modal-actions {
      padding: 0 20px 20px 20px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    .modal-actions app-button {
      min-width: 80px;
    }

    /* Mobile responsive */
    @media (max-width: 480px) {
      .modal-backdrop {
        padding: 12px;
      }

      .modal-container {
        max-width: none;
        width: 100%;
        border-radius: 8px;
      }

      .modal-header {
        padding: 16px 16px 0 16px;
      }

      .modal-title {
        font-size: 16px;
        padding-right: 24px;
      }

      .close-button {
        top: 12px;
        right: 12px;
        width: 20px;
        height: 20px;
      }

      .close-button .material-icons {
        font-size: 18px;
      }

      .modal-body {
        padding: 12px 16px 16px 16px;
      }

      .modal-actions {
        padding: 0 16px 16px 16px;
        flex-direction: column-reverse;
      }

      .modal-actions app-button {
        width: 100%;
        min-width: auto;
      }
    }
  `;

  constructor() {
    super();
    this.isOpen = false;
    this.type = 'confirm';
    this.title = '';
    this.message = '';
    this.confirmText = '';
    this.cancelText = '';
    this.confirmVariant = 'primary';
    this.showCloseIcon = true;

    // Add language change listener
    addLanguageChangeListener(this);

    // Handle escape key
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this._handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._handleKeyDown);
  }

  updated(changedProperties) {
    if (changedProperties.has('isOpen')) {
      console.log('Modal isOpen changed:', this.isOpen);
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
        this.setAttribute('is-open', '');
        console.log('Modal opened, attribute set');
      } else {
        document.body.style.overflow = '';
        this.removeAttribute('is-open');
        console.log('Modal closed, attribute removed');
      }
    }
  }

  render() {
    const confirmText = this.confirmText || t('common.confirm');
    const cancelText = this.cancelText || t('common.cancel');

    return html`
      <div class="modal-backdrop" @click="${this._handleBackdropClick}">
        <div class="modal-container" @click="${this._handleContainerClick}">
          <div class="modal-header">
            <h2 class="modal-title">${this.title}</h2>
            ${this.showCloseIcon ? html`
              <button class="close-button" @click="${this._handleClose}">
                <span class="material-icons">close</span>
              </button>
            ` : ''}
          </div>

          <div class="modal-body">
            <p class="modal-message">${this.message}</p>
          </div>

          ${this.type === 'confirm' ? html`
            <div class="modal-actions">
              <app-button
                variant="outlined"
                size="medium"
                @button-click="${this._handleCancel}"
              >
                ${cancelText}
              </app-button>
              
              <app-button
                variant="${this.confirmVariant}"
                size="medium"
                @button-click="${this._handleConfirm}"
              >
                ${confirmText}
              </app-button>
            </div>
          ` : html`
            <div class="modal-actions">
              <app-button
                variant="primary"
                size="medium"
                @button-click="${this._handleClose}"
              >
                ${t('common.close')}
              </app-button>
            </div>
          `}
        </div>
      </div>
    `;
  }

  _handleKeyDown(event) {
    if (event.key === 'Escape' && this.isOpen) {
      this._handleClose();
    }
  }

  _handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      this._handleClose();
    }
  }

  _handleContainerClick(event) {
    event.stopPropagation();
  }

  _handleConfirm() {
    this.dispatchEvent(new CustomEvent('modal-confirm', {
      bubbles: true,
      composed: true
    }));
  }

  _handleCancel() {
    this.dispatchEvent(new CustomEvent('modal-cancel', {
      bubbles: true,
      composed: true
    }));
  }

  _handleClose() {
    this.dispatchEvent(new CustomEvent('modal-close', {
      bubbles: true,
      composed: true
    }));
  }

  // Public methods
  show() {
    this.isOpen = true;
  }

  hide() {
    this.isOpen = false;
  }
}

customElements.define('app-modal', Modal);
