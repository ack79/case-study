import { LitElement, html, css } from 'lit';

export class DateInput extends LitElement {
  static properties = {
    value: { type: String },
    label: { type: String },
    placeholder: { type: String },
    required: { type: Boolean },
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    size: { type: String }, // small, medium, large
    variant: { type: String }, // default, outlined, filled
    error: { type: String },
    helperText: { type: String },
    minDate: { type: String },
    maxDate: { type: String }
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

    /* Calendar icon */
    .calendar-icon {
      position: absolute;
      right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FF620B;
      font-family: 'Material Icons';
      font-size: 20px;
      pointer-events: none;
      transition: color 0.2s ease;
    }

    .input:focus + .calendar-icon {
      color: #E55A2B;
    }

    /* Icon padding adjustments */
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

    /* Date Picker Modal */
    .date-picker-modal {
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

    .date-picker-modal--open {
      opacity: 1;
      visibility: visible;
    }

    .date-picker-content {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      max-width: 320px;
      width: 90%;
      max-height: 90vh;
      overflow: hidden;
      transform: translateY(20px);
      transition: transform 0.3s ease;
    }

    .date-picker-modal--open .date-picker-content {
      transform: translateY(0);
    }

    /* Mobile Bottom Sheet */
    @media (max-width: 768px) {
      .date-picker-content {
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

      .date-picker-modal--open .date-picker-content {
        transform: translateY(0);
      }
    }

    /* Date Picker Header */
    .date-picker-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid #E5E7EB;
      background-color: #F9FAFB;
    }

    .date-picker-title {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
    }

    .date-picker-close {
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

    .date-picker-close:hover {
      background-color: #E5E7EB;
      color: #374151;
    }

    /* Date Picker Body */
    .date-picker-body {
      padding: 20px;
    }

    /* Month Navigation */
    .month-navigation {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .month-nav-btn {
      background: none;
      border: none;
      color: #6B7280;
      font-family: 'Material Icons';
      font-size: 18px;
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .month-nav-btn:hover {
      background-color: #F3F4F6;
      color: #374151;
    }

    .month-nav-btn:disabled {
      color: #D1D5DB;
      cursor: not-allowed;
    }

    .current-month {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
    }

    /* Calendar Grid */
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
    }

    .weekday-header {
      text-align: center;
      font-size: 12px;
      font-weight: 500;
      color: #6B7280;
      padding: 8px 4px;
    }

    .calendar-day {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 36px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
      border: none;
      background: none;
    }

    .calendar-day:hover {
      background-color: #F3F4F6;
    }

    .calendar-day--selected {
      background-color: #FF620B;
      color: white;
    }

    .calendar-day--selected:hover {
      background-color: #E55A2B;
    }

    .calendar-day--today {
      border: 2px solid #FF620B;
      font-weight: 600;
    }

    .calendar-day--other-month {
      color: #D1D5DB;
    }

    .calendar-day--disabled {
      color: #D1D5DB;
      cursor: not-allowed;
    }

    .calendar-day--disabled:hover {
      background-color: transparent;
    }

    /* Date Picker Footer */
    .date-picker-footer {
      display: flex;
      gap: 12px;
      padding: 16px 20px;
      border-top: 1px solid #E5E7EB;
      background-color: #F9FAFB;
    }

    .date-picker-btn {
      flex: 1;
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .date-picker-btn--cancel {
      background-color: #F3F4F6;
      color: #374151;
    }

    .date-picker-btn--cancel:hover {
      background-color: #E5E7EB;
    }

    .date-picker-btn--confirm {
      background-color: #FF620B;
      color: white;
    }

    .date-picker-btn--confirm:hover {
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
    this._isOpen = false;
    this._currentDate = new Date();
    this._selectedDate = null;
    this._tempSelectedDate = null;
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

    const displayValue = this.value ? this._formatDateForDisplay(this.value) : '';

    return html`
      <div class="input-container">
        ${this.label ? html`
          <label class="${labelClasses}" for="date-${this._generateId()}">
            ${this.label}
          </label>
        ` : ''}
        
        <div class="input-wrapper">
          <input
            id="date-${this._generateId()}"
            class="${inputClasses}"
            type="text"
            placeholder="${this.placeholder || 'GG/AA/YYYY'}"
            .value="${displayValue}"
            ?required="${this.required}"
            ?disabled="${this.disabled}"
            ?readonly="${this.readonly}"
            @click="${this._handleInputClick}"
            @focus="${this._handleFocus}"
            @blur="${this._handleBlur}"
            readonly
          />
          <span class="calendar-icon">calendar_today</span>
        </div>
        
        ${this.error ? html`
          <div class="input-error">${this.error}</div>
        ` : this.helperText ? html`
          <div class="input-helper">${this.helperText}</div>
        ` : ''}
      </div>

      <!-- Date Picker Modal -->
      <div class="date-picker-modal ${this._isOpen ? 'date-picker-modal--open' : ''}" @click="${this._handleModalClick}">
        <div class="date-picker-content" @click="${this._handleContentClick}">
          <div class="date-picker-header">
            <div class="date-picker-title">Tarih Seçin</div>
            <button class="date-picker-close" @click="${this._closePicker}">close</button>
          </div>
          
          <div class="date-picker-body">
            <div class="month-navigation">
              <button class="month-nav-btn" @click="${this._previousMonth}" ?disabled="${this._isPreviousMonthDisabled()}">
                chevron_left
              </button>
              <div class="current-month">${this._getCurrentMonthText()}</div>
              <button class="month-nav-btn" @click="${this._nextMonth}" ?disabled="${this._isNextMonthDisabled()}">
                chevron_right
              </button>
            </div>
            
            <div class="calendar-grid">
              ${this._renderWeekdayHeaders()}
              ${this._renderCalendarDays()}
            </div>
          </div>
          
          <div class="date-picker-footer">
            <button class="date-picker-btn date-picker-btn--cancel" @click="${this._closePicker}">
              İptal
            </button>
            <button class="date-picker-btn date-picker-btn--confirm" @click="${this._confirmSelection}">
              Seç
            </button>
          </div>
        </div>
      </div>
    `;
  }

  _generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  _formatDateForDisplay(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  }

  _formatDateForInput(date) {
    return date.toISOString().split('T')[0];
  }

  _getCurrentMonthText() {
    return this._currentDate.toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'long' 
    });
  }

  _isPreviousMonthDisabled() {
    if (!this.minDate) return false;
    const minDate = new Date(this.minDate);
    const firstDayOfCurrentMonth = new Date(this._currentDate.getFullYear(), this._currentDate.getMonth(), 1);
    return firstDayOfCurrentMonth <= minDate;
  }

  _isNextMonthDisabled() {
    if (!this.maxDate) return false;
    const maxDate = new Date(this.maxDate);
    const lastDayOfCurrentMonth = new Date(this._currentDate.getFullYear(), this._currentDate.getMonth() + 1, 0);
    return lastDayOfCurrentMonth >= maxDate;
  }

  _renderWeekdayHeaders() {
    const weekdays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    return weekdays.map(day => html`
      <div class="weekday-header">${day}</div>
    `);
  }

  _renderCalendarDays() {
    const year = this._currentDate.getFullYear();
    const month = this._currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    
    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    const dayOfWeek = firstDay.getDay();
    const mondayStart = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - mondayStart);
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = this._isSameDay(currentDate, today);
      const isSelected = this._tempSelectedDate && this._isSameDay(currentDate, this._tempSelectedDate);
      const isDisabled = this._isDateDisabled(currentDate);
      
      const dayClasses = [
        'calendar-day',
        !isCurrentMonth ? 'calendar-day--other-month' : '',
        isToday ? 'calendar-day--today' : '',
        isSelected ? 'calendar-day--selected' : '',
        isDisabled ? 'calendar-day--disabled' : ''
      ].filter(Boolean).join(' ');
      
      days.push(html`
        <button 
          class="${dayClasses}"
          @click="${() => this._selectDate(currentDate)}"
          ?disabled="${isDisabled}"
        >
          ${currentDate.getDate()}
        </button>
      `);
    }
    
    return days;
  }

  _isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  _isDateDisabled(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    // Check min date
    if (this.minDate) {
      const minDate = new Date(this.minDate);
      minDate.setHours(0, 0, 0, 0);
      if (date < minDate) return true;
    }
    
    // Check max date
    if (this.maxDate) {
      const maxDate = new Date(this.maxDate);
      maxDate.setHours(0, 0, 0, 0);
      if (date > maxDate) return true;
    }
    
    // Disable future dates for birth date (if no specific max date is set)
    if (this.label && this.label.toLowerCase().includes('doğum')) {
      if (date > today) return true;
    }
    
    // Disable past dates for future events (if no specific min date is set)
    if (this.label && (
      this.label.toLowerCase().includes('son kullanma') ||
      this.label.toLowerCase().includes('bitiş') ||
      this.label.toLowerCase().includes('süre')
    )) {
      if (date < today) return true;
    }
    
    return false;
  }

  _handleInputClick(event) {
    if (this.disabled || this.readonly) return;
    this._openPicker();
  }

  _handleFocus(event) {
    this._openPicker();
  }

  _handleBlur(event) {
    // Don't close immediately to allow clicking on calendar
    setTimeout(() => {
      if (!this._isOpen) return;
      // Only close if not clicking inside the picker
    }, 100);
  }

  _handleModalClick(event) {
    if (event.target.classList.contains('date-picker-modal')) {
      this._closePicker();
    }
  }

  _handleContentClick(event) {
    // Prevent closing when clicking inside the picker content
    event.stopPropagation();
  }

  _openPicker() {
    this._isOpen = true;
    this._tempSelectedDate = this.value ? new Date(this.value) : null;
    this.requestUpdate();
  }

  _closePicker() {
    this._isOpen = false;
    this._tempSelectedDate = null;
    this.requestUpdate();
  }

  _previousMonth() {
    this._currentDate.setMonth(this._currentDate.getMonth() - 1);
    this.requestUpdate();
  }

  _nextMonth() {
    this._currentDate.setMonth(this._currentDate.getMonth() + 1);
    this.requestUpdate();
  }

  _selectDate(date) {
    if (this._isDateDisabled(date)) return;
    this._tempSelectedDate = date;
    this.requestUpdate();
  }

  _confirmSelection() {
    if (this._tempSelectedDate) {
      this.value = this._formatDateForInput(this._tempSelectedDate);
      this._selectedDate = this._tempSelectedDate;
      
      this.dispatchEvent(new CustomEvent('date-change', {
        detail: { 
          value: this.value, 
          date: this._selectedDate,
          formatted: this._formatDateForDisplay(this.value)
        },
        bubbles: true,
        composed: true
      }));
    }
    
    this._closePicker();
  }
}

customElements.define('date-input', DateInput);
