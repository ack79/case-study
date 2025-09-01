import { LitElement, html, css } from 'lit';

export class AppButton extends LitElement {
  static properties = {
    variant: { type: String }, // primary, secondary, danger, outlined, cancel, icon-only, icon-only-outlined, icon-only-primary
    size: { type: String }, // small, medium, large
    icon: { type: String }, // Material icon name
    iconPosition: { type: String }, // left, right
    disabled: { type: Boolean },
    loading: { type: Boolean },
    fullWidth: { type: Boolean }
  };

  static styles = css`    
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border: none;
      border-radius: 8px;
      font-family: inherit;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      outline: none;
      position: relative;
      overflow: hidden;
      margin: 4px;
      min-height: 44px;
      padding: 12px 20px;
    }

    .btn:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .btn:focus-visible {
      box-shadow: 0 0 0 3px rgba(255, 98, 11, 0.3);
    }

    /* Size variants */
    .btn--small {
      padding: 8px 16px;
      font-size: 14px;
      min-height: 36px;
      min-width: 36px;
    }

    .btn--medium {
      padding: 12px 20px;
      font-size: 16px;
      min-height: 44px;
      min-width: 44px;
    }

    .btn--large {
      padding: 16px 24px;
      font-size: 18px;
      min-height: 52px;
      min-width: 52px;
    }

    /* Icon-only specific sizes - Daha küçük */
    .btn--icon-only.btn--small {
      padding: 6px;
      min-width: 32px;
      width: 32px;
      height: 32px;
    }

    .btn--icon-only.btn--medium {
      padding: 8px;
      min-width: 40px;
      width: 40px;
      height: 40px;
    }

    .btn--icon-only.btn--large {
      padding: 12px;
      min-width: 48px;
      width: 48px;
      height: 48px;
    }

    /* Color variants */
    .btn--primary {
      background-color: #FF620B;
      color: white;
    }

    .btn--primary:hover:not(:disabled) {
      background-color: #E55A2B;
    }

    .btn--secondary {
      background-color: #FF7527;
      color: white;
    }

    .btn--secondary:hover:not(:disabled) {
      background-color: #E56A23;
    }

    .btn--danger {
      background-color: #EF4444;
      color: white;
    }

    .btn--danger:hover:not(:disabled) {
      background-color: #DC2626;
    }

    .btn--outlined {
      background-color: transparent;
      color: #FF620B;
      border: 2px solid #FF620B;
    }

    .btn--outlined:hover:not(:disabled) {
      background-color: #FF620B;
      color: white;
    }

    .btn--outlined.btn--secondary {
      color: #FF7527;
      border-color: #FF7527;
    }

    .btn--outlined.btn--secondary:hover:not(:disabled) {
      background-color: #FF7527;
      color: white;
    }

    .btn--outlined.btn--danger {
      color: #EF4444;
      border-color: #EF4444;
    }

    .btn--outlined.btn--danger:hover:not(:disabled) {
      background-color: #EF4444;
      color: white;
    }

    /* Cancel variant */
    .btn--cancel {
      background-color: transparent;
      color: #6A5ACD;
      border: 2px solid #6A5ACD;
    }

    .btn--cancel:hover:not(:disabled) {
      background-color: #6A5ACD;
      color: white;
    }

    /* Purple variant */
    .btn--purple {
      background-color: #6A5ACD;
      color: white;
    }

    .btn--purple:hover:not(:disabled) {
      background-color: #5B4DB8;
    }

    /* Purple outlined variant */
    .btn--outlined.btn--purple {
      background-color: transparent;
      color: #6A5ACD;
      border-color: #6A5ACD;
    }

    .btn--outlined.btn--purple:hover:not(:disabled) {
      background-color: #6A5ACD;
      color: white;
    }

    /* Icon-only variants */
    .btn--icon-only {
      background-color: transparent;
      color: #FF620B;
      border: none;
      border-radius: 50%;
    }

    .btn--icon-only:hover:not(:disabled) {
      background-color: rgba(255, 98, 11, 0.1);
    }

    /* Icon-only outlined variant */
    .btn--icon-only-outlined {
      background-color: transparent;
      color: #FF620B;
      border: 2px solid #FF620B;
      border-radius: 50%;
    }

    .btn--icon-only-outlined:hover:not(:disabled) {
      background-color: #FF620B;
      color: white;
    }

    .btn--icon-only.btn--primary {
      color: #FF620B;
    }

    .btn--icon-only.btn--secondary {
      color: #FF7527;
    }

    .btn--icon-only.btn--secondary:hover:not(:disabled) {
      background-color: rgba(255, 117, 39, 0.1);
    }

    .btn--icon-only.btn--danger {
      color: #EF4444;
    }

    .btn--icon-only.btn--danger:hover:not(:disabled) {
      background-color: rgba(239, 68, 68, 0.1);
    }

    /* Full width */
    .btn--full-width {
      width: 100%;
      margin: 4px 0;
    }

    /* Icon styles */
    .btn__icon {
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      font-size: 18px;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
      flex-shrink: 0;
    }

    .btn__icon--left {
      order: -1;
    }

    .btn__icon--right {
      order: 1;
    }

    /* Icon-only specific icon size - Daha küçük */
    .btn--icon-only .btn__icon {
      font-size: 16px;
    }

    .btn--icon-only.btn--small .btn__icon {
      font-size: 14px;
    }

    .btn--icon-only.btn--large .btn__icon {
      font-size: 20px;
    }

    /* Button content wrapper */
    .btn__content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
    }

    /* Loading state */
    .btn__loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }

    .btn--loading .btn__content {
      opacity: 0;
    }

    /* Mobil responsive */
    @media (max-width: 768px) {
      .btn--icon-only.btn--small {
        padding: 4px;
        min-width: 28px;
        width: 28px;
        height: 28px;
      }

      .btn--icon-only.btn--medium {
        padding: 6px;
        min-width: 36px;
        width: 36px;
        height: 36px;
      }

      .btn--icon-only.btn--large {
        padding: 8px;
        min-width: 44px;
        width: 44px;
        height: 44px;
      }

      .btn--icon-only .btn__icon {
        font-size: 14px;
      }

      .btn--icon-only.btn--small .btn__icon {
        font-size: 12px;
      }

      .btn--icon-only.btn--large .btn__icon {
        font-size: 18px;
      }
    }
  `;

  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'medium';
    this.iconPosition = 'left';
    this.disabled = false;
    this.loading = false;
    this.fullWidth = false;
  }

  render() {
    const variants = this.variant.split(' ');
    const buttonClasses = [
      'btn',
      ...variants.map(v => `btn--${v}`),
      `btn--${this.size}`,
      (this.variant.includes('icon-only')) ? 'btn--icon-only' : '',
      this.fullWidth ? 'btn--full-width' : '',
      this.loading ? 'btn--loading' : ''
    ].filter(Boolean).join(' ');

    return html`
      <button 
        class="${buttonClasses}"
        ?disabled="${this.disabled || this.loading}"
        @click="${this._handleClick}"
        title="${this.variant.includes('icon-only') ? this.getAttribute('title') || '' : ''}"
      >
        ${this.loading ? html`<div class="btn__loading"></div>` : ''}
        
        <div class="btn__content">
          ${this.variant.includes('icon-only') ? 
            html`<span class="btn__icon">${this.icon}</span>` : 
            html`
              ${this.icon && this.iconPosition === 'left' ? 
                html`<span class="btn__icon btn__icon--left">${this.icon}</span>` : ''}
              
              <slot></slot>
              
              ${this.icon && this.iconPosition === 'right' ? 
                html`<span class="btn__icon btn__icon--right">${this.icon}</span>` : ''}
            `
          }
        </div>
      </button>
    `;
  }

  _handleClick(event) {
    if (this.disabled || this.loading) {
      event.preventDefault();
      return;
    }
    
    this.dispatchEvent(new CustomEvent('button-click', {
      detail: { variant: this.variant, disabled: this.disabled },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('app-button', AppButton);