import { LitElement, html, css } from 'lit';

export class TextInput extends LitElement {
  static properties = {
    type: { type: String }, // text, email, password, tel, number, search
    placeholder: { type: String },
    value: { type: String },
    label: { type: String },
    required: { type: Boolean },
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    size: { type: String }, // small, medium, large
    variant: { type: String }, // default, outlined, filled
    icon: { type: String }, // Material icon name
    iconPosition: { type: String }, // left, right
    error: { type: String },
    helperText: { type: String },
    maxLength: { type: Number },
    minLength: { type: Number },
    pattern: { type: String },
    autocomplete: { type: String }
  };

  static styles = css`
    .input-container {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin: 8px 0;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input {
      width: 100%;
      border: 2px solid #E5E7EB;
      border-radius: 8px;
      font-family: inherit;
      font-size: 16px;
      padding: 12px 16px;
      background-color: white;
      color: #374151;
      transition: all 0.2s ease;
      outline: none;
      box-sizing: border-box;
    }

    .input:focus {
      border-color: #FF620B;
      box-shadow: 0 0 0 3px rgba(255, 98, 11, 0.1);
    }

    .input:disabled {
      background-color: #F9FAFB;
      color: #9CA3AF;
      cursor: not-allowed;
    }

    .input:read-only {
      background-color: #F9FAFB;
      color: #6B7280;
    }

    /* Size variants */
    .input--small {
      padding: 8px 12px;
      font-size: 14px;
      min-height: 36px;
    }

    .input--medium {
      padding: 12px 16px;
      font-size: 16px;
      min-height: 44px;
    }

    .input--large {
      padding: 16px 20px;
      font-size: 18px;
      min-height: 52px;
    }

    /* Variant styles */
    .input--outlined {
      border: 2px solid #E5E7EB;
      background-color: transparent;
    }

    .input--outlined:focus {
      border-color: #FF620B;
    }

    .input--filled {
      border: none;
      background-color: #F3F4F6;
      border-bottom: 2px solid #E5E7EB;
      border-radius: 8px 8px 0 0;
    }

    .input--filled:focus {
      background-color: white;
      border-bottom-color: #FF620B;
    }

    /* Label styles */
    .input-label {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 4px;
    }

    .input-label--required::after {
      content: ' *';
      color: #EF4444;
    }

    /* Icon styles */
    .input-icon {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9CA3AF;
      font-family: 'Material Icons';
      font-size: 20px;
      pointer-events: none;
      transition: color 0.2s ease;
    }

    .input-icon--left {
      left: 12px;
    }

    .input-icon--right {
      right: 12px;
    }

    .input:focus + .input-icon,
    .input:focus ~ .input-icon {
      color: #FF620B;
    }

    /* Icon padding adjustments */
    .input--has-icon-left {
      padding-left: 44px;
    }

    .input--has-icon-right {
      padding-right: 44px;
    }

    /* Error state */
    .input--error {
      border-color: #EF4444;
    }

    .input--error:focus {
      border-color: #EF4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .input-error {
      font-size: 12px;
      color: #EF4444;
      margin-top: 4px;
    }

    /* Helper text */
    .input-helper {
      font-size: 12px;
      color: #6B7280;
      margin-top: 4px;
    }

    /* Character count */
    .input-count {
      font-size: 12px;
      color: #9CA3AF;
      text-align: right;
      margin-top: 4px;
    }

    .input-count--limit {
      color: #EF4444;
    }

    /* Remove number input arrows */
    .input[type="number"]::-webkit-outer-spin-button,
    .input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .input[type="number"] {
      -moz-appearance: textfield;
    }
  `;

  constructor() {
    super();
    this.type = 'text';
    this.size = 'medium';
    this.variant = 'default';
    this.iconPosition = 'left';
    this.required = false;
    this.disabled = false;
    this.readonly = false;
  }

  render() {
    const inputClasses = [
      'input',
      `input--${this.size}`,
      this.variant !== 'default' ? `input--${this.variant}` : '',
      this.icon && this.iconPosition === 'left' ? 'input--has-icon-left' : '',
      this.icon && this.iconPosition === 'right' ? 'input--has-icon-right' : '',
      this.error ? 'input--error' : ''
    ].filter(Boolean).join(' ');

    const labelClasses = [
      'input-label',
      this.required ? 'input-label--required' : ''
    ].filter(Boolean).join(' ');

    const currentLength = this.value ? this.value.length : 0;
    const showCount = this.maxLength && this.maxLength > 0;

    return html`
      <div class="input-container">
        ${this.label ? html`
          <label class="${labelClasses}" for="input-${this._generateId()}">
            ${this.label}
          </label>
        ` : ''}
        
        <div class="input-wrapper">
          ${this.icon && this.iconPosition === 'left' ? html`
            <span class="input-icon input-icon--left">${this.icon}</span>
          ` : ''}
          
          <input
            id="input-${this._generateId()}"
            class="${inputClasses}"
            type="${this.type}"
            placeholder="${this.placeholder || ''}"
            .value="${this.value || ''}"
            ?required="${this.required}"
            ?disabled="${this.disabled}"
            ?readonly="${this.readonly}"
            maxlength="${this.maxLength || ''}"
            minlength="${this.minLength || ''}"
            pattern="${this.pattern || ''}"
            autocomplete="${this.autocomplete || ''}"
            @input="${this._handleInput}"
            @change="${this._handleChange}"
            @focus="${this._handleFocus}"
            @blur="${this._handleBlur}"
          />
          
          ${this.icon && this.iconPosition === 'right' ? html`
            <span class="input-icon input-icon--right">${this.icon}</span>
          ` : ''}
        </div>
        
        ${this.error ? html`
          <div class="input-error">${this.error}</div>
        ` : this.helperText ? html`
          <div class="input-helper">${this.helperText}</div>
        ` : ''}
        
        ${showCount ? html`
          <div class="input-count ${currentLength >= this.maxLength ? 'input-count--limit' : ''}">
            ${currentLength} / ${this.maxLength}
          </div>
        ` : ''}
      </div>
    `;
  }

  _generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  _handleInput(event) {
    this.value = event.target.value;
    this.dispatchEvent(new CustomEvent('input-change', {
      detail: { value: this.value, event },
      bubbles: true,
      composed: true
    }));
  }

  _handleChange(event) {
    this.dispatchEvent(new CustomEvent('input-change', {
      detail: { value: this.value, event },
      bubbles: true,
      composed: true
    }));
  }

  _handleFocus(event) {
    this.dispatchEvent(new CustomEvent('input-focus', {
      detail: { event },
      bubbles: true,
      composed: true
    }));
  }

  _handleBlur(event) {
    this.dispatchEvent(new CustomEvent('input-blur', {
      detail: { event },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('text-input', TextInput);
