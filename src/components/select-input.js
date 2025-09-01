import { LitElement, html, css } from 'lit';

export class SelectInput extends LitElement {
  static properties = {
    value: { type: String },
    label: { type: String },
    placeholder: { type: String },
    options: { type: Array },
    required: { type: Boolean },
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    size: { type: String }, // small, medium, large
    variant: { type: String }, // default, outlined, filled
    error: { type: String },
    helperText: { type: String },
    searchable: { type: Boolean }
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
      cursor: pointer;
      text-align: left;
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

    /* Dropdown icon */
    .dropdown-icon {
      position: absolute;
      right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6B7280;
      font-family: 'Material Icons';
      font-size: 20px;
      pointer-events: none;
      transition: all 0.2s ease;
    }

    .input:focus + .dropdown-icon {
      color: #FF620B;
      transform: rotate(180deg);
    }

    .input--has-icon {
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

    /* Dropdown Container */
    .dropdown-container {
      position: relative;
    }

    /* Dropdown (Desktop) */
    .dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: white;
      border: 2px solid #E5E7EB;
      border-top: none;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease;
      max-height: 300px;
      overflow: hidden;
      margin-top: 4px;
      min-width: 100%;
      box-sizing: border-box;
    }

    .dropdown--open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    /* Search Input */
    .search-container {
      padding: 12px 16px;
      border-bottom: 1px solid #E5E7EB;
      background-color: #F9FAFB;
      box-sizing: border-box;
    }

    .search-input {
      width: 100%;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s ease;
      box-sizing: border-box;
    }

    .search-input:focus {
      border-color: #FF620B;
    }

    /* Options List */
    .options-list {
      max-height: 200px;
      overflow-y: auto;
    }

    .option {
      padding: 12px 16px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      font-size: 14px;
      color: #374151;
    }

    .option:hover {
      background-color: #F3F4F6;
    }

    .option--selected {
      background-color: #FF620B;
      color: white;
    }

    .option--selected:hover {
      background-color: #E55A2B;
    }

    .option--disabled {
      color: #9CA3AF;
      cursor: not-allowed;
    }

    .option--disabled:hover {
      background-color: transparent;
    }

    /* No Results */
    .no-results {
      padding: 16px;
      text-align: center;
      color: #6B7280;
      font-size: 14px;
    }

    /* Mobile Modal */
    .select-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .select-modal--open {
      opacity: 1;
      visibility: visible;
    }

    .select-content {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      max-width: 400px;
      width: 90%;
      max-height: 90vh;
      overflow: hidden;
      transform: translateY(20px);
      transition: transform 0.3s ease;
    }

    .select-modal--open .select-content {
      transform: translateY(0);
    }

    /* Mobile Bottom Sheet */
    @media (max-width: 768px) {
      .dropdown {
        display: none;
      }

      .select-content {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        max-width: none;
        border-radius: 12px 12px 0 0;
        transform: translateY(100%);
        max-height: 70vh;
      }

      .select-modal--open .select-content {
        transform: translateY(0);
      }
    }

    /* Desktop - Hide Modal */
    @media (min-width: 769px) {
      .select-modal {
        display: none;
      }
    }

    /* Modal Header */
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid #E5E7EB;
      background-color: #F9FAFB;
    }

    .modal-title {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
    }

    .modal-close {
      background: none;
      border: none;
      color: #6B7280;
      font-family: 'Material Icons';
      font-size: 20px;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .modal-close:hover {
      background-color: #E5E7EB;
      color: #374151;
    }

    /* Modal Body */
    .modal-body {
      padding: 0;
    }

    /* Modal Footer */
    .modal-footer {
      display: flex;
      gap: 12px;
      padding: 16px 20px;
      border-top: 1px solid #E5E7EB;
      background-color: #F9FAFB;
    }

    .modal-btn {
      flex: 1;
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .modal-btn--cancel {
      background-color: #F3F4F6;
      color: #374151;
    }

    .modal-btn--cancel:hover {
      background-color: #E5E7EB;
    }

    .modal-btn--confirm {
      background-color: #FF620B;
      color: white;
    }

    .modal-btn--confirm:hover {
      background-color: #E55A2B;
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
    this.options = [];
    this.searchable = true;
    this._isOpen = false;
    this._searchTerm = '';
    this._tempSelectedValue = '';
    this._isMobile = false;
    this._isToggling = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._checkMobile();
    window.addEventListener('resize', this._checkMobile.bind(this));
    document.addEventListener('click', this._handleOutsideClick.bind(this));
    
    // Force initial mobile check
    setTimeout(() => {
      this._checkMobile();
    }, 100);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._checkMobile.bind(this));
    document.removeEventListener('click', this._handleOutsideClick.bind(this));
  }

  _checkMobile() {
    const wasMobile = this._isMobile;
    this._isMobile = window.innerWidth <= 768;
    
    // If mobile state changed, close dropdown
    if (wasMobile !== this._isMobile && this._isOpen) {
      this._closeDropdown();
    }
  }

  _handleOutsideClick(event) {
    if (!this._isOpen) return;
    
    // Check if click is inside the component
    const isClickInside = this.shadowRoot.contains(event.target);
    
    // Don't close if clicking inside the dropdown or modal
    if (isClickInside) {
      return;
    }
    
    // Close dropdown if clicking outside
    setTimeout(() => {
      this._closeDropdown();
    }, 0);
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
    const filteredOptions = this._getFilteredOptions();

    return html`
      <div class="input-container">
        ${this.label ? html`
          <label class="${labelClasses}" for="select-${this._generateId()}">
            ${this.label}
          </label>
        ` : ''}
        
        <div class="dropdown-container">
          <div class="input-wrapper">
            <input
              id="select-${this._generateId()}"
              class="${inputClasses}"
              type="text"
              placeholder="${this.placeholder || 'Seçiniz'}"
              .value="${displayValue}"
              ?required="${this.required}"
              ?disabled="${this.disabled}"
              ?readonly="${this.readonly}"
              @click="${this._handleInputClick}"
              @focus="${this._handleFocus}"
              readonly
            />
            <span class="dropdown-icon">expand_more</span>
          </div>
          
          <!-- Desktop Dropdown -->
          ${!this._isMobile ? html`
            <div class="dropdown ${this._isOpen ? 'dropdown--open' : ''}" @click="${this._handleDropdownClick}">
              ${this.searchable ? html`
                <div class="search-container">
                  <input
                    class="search-input"
                    type="text"
                    placeholder="Ara..."
                    .value="${this._searchTerm}"
                    @input="${this._handleSearchInput}"
                    @click="${this._handleSearchClick}"
                  />
                </div>
              ` : ''}
              
              <div class="options-list">
                ${filteredOptions.length > 0 ? filteredOptions.map(option => html`
                  <button 
                    class="option ${option.value === this._tempSelectedValue ? 'option--selected' : ''}"
                    @click="${() => this._selectOption(option.value)}"
                  >
                    ${option.label}
                  </button>
                `) : html`
                  <div class="no-results">Sonuç bulunamadı</div>
                `}
              </div>
            </div>
          ` : ''}
        </div>
        
        ${this.error ? html`
          <div class="input-error">${this.error}</div>
        ` : this.helperText ? html`
          <div class="input-helper">${this.helperText}</div>
        ` : ''}
      </div>

      <!-- Mobile Modal -->
      ${this._isMobile ? html`
        <div class="select-modal ${this._isOpen ? 'select-modal--open' : ''}" @click="${this._handleModalClick}">
          <div class="select-content" @click="${this._handleContentClick}">
            <div class="modal-header">
              <div class="modal-title">${this.label || 'Seçiniz'}</div>
              <button class="modal-close" @click="${this._closeDropdown}">close</button>
            </div>
            
            <div class="modal-body">
              ${this.searchable ? html`
                <div class="search-container">
                  <input
                    class="search-input"
                    type="text"
                    placeholder="Ara..."
                    .value="${this._searchTerm}"
                    @input="${this._handleSearchInput}"
                    @click="${this._handleSearchClick}"
                  />
                </div>
              ` : ''}
              
              <div class="options-list">
                ${filteredOptions.length > 0 ? filteredOptions.map(option => html`
                  <button 
                    class="option ${option.value === this._tempSelectedValue ? 'option--selected' : ''}"
                    @click="${() => this._selectOption(option.value)}"
                  >
                    ${option.label}
                  </button>
                `) : html`
                  <div class="no-results">Sonuç bulunamadı</div>
                `}
              </div>
            </div>
            
            <div class="modal-footer">
              <button class="modal-btn modal-btn--cancel" @click="${this._closeDropdown}">
                İptal
              </button>
              <button class="modal-btn modal-btn--confirm" @click="${() => this._confirmSelection()}">
                Seç
              </button>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }

  _generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  _getDisplayValue() {
    if (!this.value) return '';
    const selectedOption = this.options.find(option => option.value === this.value);
    return selectedOption ? selectedOption.label : this.value;
  }

  _getFilteredOptions() {
    if (!this._searchTerm) return this.options;
    
    return this.options.filter(option => 
      option.label.toLowerCase().includes(this._searchTerm.toLowerCase())
    );
  }

  _handleInputClick(event) {
    if (this.disabled || this.readonly) return;
    event.stopPropagation();
    this._toggleDropdown();
  }

  _handleFocus(event) {
    // Don't handle focus event to prevent double triggering
    // Focus will be handled by click event
  }

  _handleDropdownClick(event) {
    // Prevent closing when clicking inside dropdown
    event.stopPropagation();
  }

  _handleModalClick(event) {
    if (event.target.classList.contains('select-modal')) {
      this._closeDropdown();
    }
  }

  _handleContentClick(event) {
    event.stopPropagation();
  }

  _handleSearchInput(event) {
    this._searchTerm = event.target.value;
    this.requestUpdate();
  }

  _handleSearchClick(event) {
    event.stopPropagation();
  }

  _toggleDropdown() {
    // Prevent rapid toggling
    if (this._isToggling) {
      return;
    }
    
    this._isToggling = true;
    
    if (this._isOpen) {
      this._closeDropdown();
    } else {
      this._openDropdown();
    }
    
    // Reset toggle flag after a short delay
    setTimeout(() => {
      this._isToggling = false;
    }, 100);
  }

  _openDropdown() {
    this._isOpen = true;
    this._tempSelectedValue = this.value;
    this._searchTerm = '';
    this.requestUpdate();
  }

  _closeDropdown() {
    this._isOpen = false;
    this._tempSelectedValue = '';
    this._searchTerm = '';
    this.requestUpdate();
  }

  _selectOption(value) {
    if (this._isMobile) {
      this._tempSelectedValue = value;
      this.requestUpdate();
      // Mobile'da kullanıcı "Seç" butonuna tıklayacak
    } else {
      // Desktop'ta seçim sonrası otomatik kapanma
      this._confirmSelection(value);
    }
  }

  _confirmSelection(value = null) {
    const selectedValue = value || this._tempSelectedValue;
    if (selectedValue) {
      this.value = selectedValue;
      
      this.dispatchEvent(new CustomEvent('select-change', {
        detail: { 
          value: this.value,
          label: this._getDisplayValue(),
          option: this.options.find(option => option.value === this.value)
        },
        bubbles: true,
        composed: true
      }));
    }
    
    this._closeDropdown();
  }
}

customElements.define('select-input', SelectInput);
