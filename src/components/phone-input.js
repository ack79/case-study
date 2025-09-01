import { LitElement, html, css } from 'lit';

export class PhoneInput extends LitElement {
  static properties = {
    value: { type: String },
    label: { type: String },
    required: { type: Boolean },
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    size: { type: String }, // small, medium, large
    variant: { type: String }, // default, outlined, filled
    error: { type: String },
    helperText: { type: String }
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
      left: 12px;
    }

    .input:focus + .input-icon {
      color: #FF620B;
    }

    /* Icon padding adjustments */
    .input--has-icon {
      padding-left: 44px;
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
  `;

  constructor() {
    super();
    this.size = 'medium';
    this.variant = 'default';
    this.required = false;
    this.disabled = false;
    this.readonly = false;
    this.value = '';
    this._userDigits = '';
    this._isInitialized = false;
  }

  render() {
    const inputClasses = [
      'input',
      `input--${this.size}`,
      this.variant !== 'default' ? `input--${this.variant}` : '',
      'input--has-icon',
      this.error ? 'input--error' : ''
    ].filter(Boolean).join(' ');

    const labelClasses = [
      'input-label',
      this.required ? 'input-label--required' : ''
    ].filter(Boolean).join(' ');

    const displayValue = this._getDisplayValue();

    return html`
      <div class="input-container">
        ${this.label ? html`
          <label class="${labelClasses}" for="phone-${this._generateId()}">
            ${this.label}
          </label>
        ` : ''}
        
        <div class="input-wrapper">
          <span class="input-icon">phone</span>
          
          <input
            id="phone-${this._generateId()}"
            class="${inputClasses}"
            type="tel"
            placeholder="+(90) 5XX XXX XX XX"
            .value="${displayValue}"
            ?required="${this.required}"
            ?disabled="${this.disabled}"
            ?readonly="${this.readonly}"
            @input="${this._handleInput}"
            @change="${this._handleChange}"
            @focus="${this._handleFocus}"
            @blur="${this._handleBlur}"
            @keydown="${this._handleKeydown}"
          />
        </div>
        
        ${this.error ? html`
          <div class="input-error">${this.error}</div>
        ` : this.helperText ? html`
          <div class="input-helper">${this.helperText}</div>
        ` : ''}
      </div>
    `;
  }

  _generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  _getDisplayValue() {
    if (!this._isInitialized) {
      return '';
    }
    
    const prefix = '+(90) ';
    const formattedDigits = this._formatDigits(this._userDigits);
    return prefix + formattedDigits;
  }

  _formatDigits(digits) {
    if (!digits) return '';
    
    let formatted = '';
    for (let i = 0; i < Math.min(digits.length, 10); i++) {
      if (i === 3 || i === 6 || i === 8) {
        formatted += ' ';
      }
      formatted += digits[i];
    }
    return formatted;
  }

  _handleInput(event) {
    const rawValue = event.target.value;
    
    // Remove the prefix if it exists
    let digitsOnly = rawValue.replace('+(90) ', '').replace(/\D/g, '');
    
    // If user tries to delete everything, keep at least '5'
    if (digitsOnly.length === 0) {
      digitsOnly = '5';
    }
    
    // Limit to 10 digits
    if (digitsOnly.length <= 10) {
      this._userDigits = digitsOnly;
      this.value = digitsOnly;
      
      // Update display
      const newDisplayValue = this._getDisplayValue();
      event.target.value = newDisplayValue;
      
      // Set cursor position
      const cursorPos = '+(90) '.length + this._formatDigits(digitsOnly).length;
      setTimeout(() => {
        event.target.setSelectionRange(cursorPos, cursorPos);
      }, 0);
      
      this.dispatchEvent(new CustomEvent('phone-change', {
        detail: { 
          value: this.value, 
          formatted: newDisplayValue,
          event 
        },
        bubbles: true,
        composed: true
      }));
    }
  }

  _handleChange(event) {
    this.dispatchEvent(new CustomEvent('phone-change', {
      detail: { 
        value: this.value, 
        formatted: this._getDisplayValue(),
        event 
      },
      bubbles: true,
      composed: true
    }));
  }

  _handleFocus(event) {
    if (!this._isInitialized) {
      this._isInitialized = true;
      this._userDigits = '5';
      this.value = '5';
      
      const displayValue = this._getDisplayValue();
      event.target.value = displayValue;
      
      // Set cursor position after the 5
      setTimeout(() => {
        event.target.setSelectionRange(displayValue.length, displayValue.length);
      }, 0);
    }
    
    this.dispatchEvent(new CustomEvent('phone-focus', {
      detail: { event },
      bubbles: true,
      composed: true
    }));
  }

  _handleBlur(event) {
    this.dispatchEvent(new CustomEvent('phone-blur', {
      detail: { event },
      bubbles: true,
      composed: true
    }));
  }

  _handleKeydown(event) {
    // Handle backspace specially
    if (event.keyCode === 8) {
      // If we only have '5' left, prevent deletion
      if (this._userDigits === '5') {
        event.preventDefault();
        return;
      }
      return;
    }
    
    // Allow: delete, tab, escape, enter, and navigation keys
    if ([9, 27, 13, 46, 37, 39].indexOf(event.keyCode) !== -1 ||
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (event.keyCode === 65 && event.ctrlKey === true) ||
        (event.keyCode === 67 && event.ctrlKey === true) ||
        (event.keyCode === 86 && event.ctrlKey === true) ||
        (event.keyCode === 88 && event.ctrlKey === true)) {
      return;
    }
    
    // Allow only numbers (0-9)
    if ((event.keyCode >= 48 && event.keyCode <= 57) || 
        (event.keyCode >= 96 && event.keyCode <= 105)) {
      // Check if we're at max length
      if (this._userDigits && this._userDigits.length >= 10) {
        event.preventDefault();
        return;
      }
      return;
    }
    
    event.preventDefault();
  }
}

customElements.define('phone-input', PhoneInput);
