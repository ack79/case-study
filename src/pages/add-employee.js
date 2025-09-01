import { LitElement, html, css } from 'lit';
import '../components/navigation.js';
import '../components/text-input.js';
import '../components/phone-input.js';
import '../components/date-input.js';
import '../components/select-input.js';
import '../components/button.js';
import '../components/modal.js';
import { useEmployeeStore } from '../store/index.js';
import { t, addLanguageChangeListener } from '../utils/i18n.js';
import { toast } from '../utils/toast-manager.js';

export class AddEmployeePage extends LitElement {
  static properties = {
    formData: { type: Object },
    errors: { type: Object },
    isSubmitting: { type: Boolean },
    isEditMode: { type: Boolean },
    employeeId: { type: String },
    originalEmployee: { type: Object },
    showConfirmModal: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: #F9FAFB;
    }

    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
      box-sizing: border-box;
    }
    
    @media (min-width: 1440px) {
      .container { 
        max-width: 1280px; 
      }
    }

    .page-header {
      padding: 12px 0 24px 0;
      margin-bottom: 32px;
    }

    .page-title {
      color: #FF620B;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.2px;
      margin: 0;
    }

    .form-container {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 32px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 32px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      padding-top: 24px;
      border-top: 1px solid #F3F4F6;
    }

    .form-actions app-button {
      min-width: 160px;
      font-weight: 600;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .container {
        padding: 0 12px;
      }

      .page-header {
        padding: 12px 0 20px 0;
        margin-bottom: 24px;
      }

      .page-title {
        font-size: 18px;
      }

      .form-container {
        padding: 24px 16px;
        border-radius: 8px;
        margin-bottom: 24px;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 16px;
        margin-bottom: 24px;
      }

      .form-actions {
        flex-direction: column;
        gap: 12px;
        width: 100%;
      }

      .form-actions app-button {
        --button-width: 100%;
        min-width: auto;
        box-sizing: border-box;
      }
    }

    @media (max-width: 1024px) and (min-width: 769px) {
      .form-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `;

  constructor() {
    super();
    this.formData = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phoneNumber: '',
      email: '',
      department: '',
      position: ''
    };
    this.errors = {};
    this.isSubmitting = false;
    this.isEditMode = false;
    this.employeeId = null;
    this.originalEmployee = null;
    this.showConfirmModal = false;
    this._forceRenderCount = 0;

    // Add language change listener
    addLanguageChangeListener(this);
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Check if this is edit mode based on URL
    const currentPath = window.location.pathname;
    const editMatch = currentPath.match(/\/edit-employee\/(.+)/);
    
    if (editMatch) {
      this.isEditMode = true;
      this.employeeId = editMatch[1];
      this._loadEmployeeData();
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    
    // Update input components with current errors (including clearing them)
    const inputs = this.shadowRoot.querySelectorAll('text-input, phone-input, date-input, select-input');
    
    inputs.forEach((input) => {
      const field = input.getAttribute('data-field');
      
      if (field) {
        const currentError = this.errors[field] || '';
        // Always update the error property to current state
        if (input.error !== currentError) {
          input.error = currentError;
          input.requestUpdate();
        }
      }
    });
  }

  _loadEmployeeData() {
    const store = useEmployeeStore.getState();
    const employee = store.employees.find(emp => emp.id.toString() === this.employeeId);
    
    if (employee) {
      this.originalEmployee = { ...employee };
      this.formData = {
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        dateOfEmployment: employee.dateOfEmployment || '',
        dateOfBirth: employee.dateOfBirth || '',
        phoneNumber: employee.phoneNumber || '',
        email: employee.email || '',
        department: employee.department || '',
        position: employee.position || ''
      };
      this.requestUpdate();
    } else {
      // Employee not found, redirect to home
      toast.error(t('messages.employeeNotFound'));
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  render() {
    const departmentOptions = [
      { value: '', label: t('employeeForm.fields.department') },
      { value: 'Analytics', label: t('employeeList.departments.analytics') },
      { value: 'Tech', label: t('employeeList.departments.tech') }
    ];

    const positionOptions = [
      { value: '', label: 'Please Select' },
      { value: 'Junior', label: t('employeeList.positions.junior') },
      { value: 'Medior', label: t('employeeList.positions.medior') },
      { value: 'Senior', label: t('employeeList.positions.senior') }
    ];

    return html`
      <app-navigation current-page="add-employee"></app-navigation>
      
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">
            ${this.isEditMode ? t('employeeForm.title.edit') : t('employeeForm.title.add')}
          </h1>
        </div>

        <div class="form-container">
          <form @submit="${this._handleSubmit}" novalidate>
            <div class="form-grid">
              <!-- First Name -->
              <text-input
                data-field="firstName"
                label="${t('employeeForm.fields.firstName')}"
                .value="${this.formData.firstName}"
                error="${this.errors.firstName || ''}"
                required
                maxlength="50"
                @input-change="${(e) => this._handleInputChange('firstName', e.detail.value)}"
                @input-blur="${() => this._validateField('firstName')}"
              ></text-input>

              <!-- Last Name -->
              <text-input
                data-field="lastName"
                label="${t('employeeForm.fields.lastName')}"
                .value="${this.formData.lastName}"
                error="${this.errors.lastName || ''}"
                required
                maxlength="50"
                @input-change="${(e) => this._handleInputChange('lastName', e.detail.value)}"
                @input-blur="${() => this._validateField('lastName')}"
              ></text-input>

              <!-- Date of Employment -->
              <date-input
                data-field="dateOfEmployment"
                label="${t('employeeForm.fields.dateOfEmployment')}"
                .value="${this.formData.dateOfEmployment}"
                error="${this.errors.dateOfEmployment || ''}"
                required
                icon="calendar_today"
                @date-change="${(e) => this._handleInputChange('dateOfEmployment', e.detail.value)}"
                @input-blur="${() => this._validateField('dateOfEmployment')}"
              ></date-input>

              <!-- Date of Birth -->
              <date-input
                data-field="dateOfBirth"
                label="${t('employeeForm.fields.dateOfBirth')}"
                .value="${this.formData.dateOfBirth}"
                error="${this.errors.dateOfBirth || ''}"
                required
                max-date="${this._getTodayDate()}"
                icon="calendar_today"
                @date-change="${(e) => this._handleInputChange('dateOfBirth', e.detail.value)}"
                @input-blur="${() => this._validateField('dateOfBirth')}"
              ></date-input>

              <!-- Phone -->
              <phone-input
                data-field="phoneNumber"
                label="${t('employeeForm.fields.phoneNumber')}"
                .value="${this.formData.phoneNumber}"
                error="${this.errors.phoneNumber || ''}"
                required
                @phone-change="${(e) => this._handleInputChange('phoneNumber', e.detail.formatted)}"
                @input-blur="${() => this._validateField('phoneNumber')}"
              ></phone-input>

              <!-- Email -->
              <text-input
                data-field="email"
                label="${t('employeeForm.fields.email')}"
                type="email"
                .value="${this.formData.email}"
                error="${this.errors.email || ''}"
                required
                maxlength="100"
                @input-change="${(e) => this._handleInputChange('email', e.detail.value)}"
                @input-blur="${() => this._validateField('email')}"
              ></text-input>

              <!-- Department -->
              <select-input
                data-field="department"
                label="${t('employeeForm.fields.department')}"
                .options="${departmentOptions}"
                .value="${this.formData.department}"
                error="${this.errors.department || ''}"
                required
                @select-change="${(e) => this._handleInputChange('department', e.detail.value)}"
                @input-blur="${() => this._validateField('department')}"
              ></select-input>

              <!-- Position -->
              <select-input
                data-field="position"
                label="${t('employeeForm.fields.position')}"
                .options="${positionOptions}"
                .value="${this.formData.position}"
                error="${this.errors.position || ''}"
                required
                @select-change="${(e) => this._handleInputChange('position', e.detail.value)}"
                @input-blur="${() => this._validateField('position')}"
              ></select-input>
            </div>

            <div class="form-actions">
              <app-button
                type="submit"
                variant="primary"
                size="large"
                .loading="${this.isSubmitting}"
                ?disabled="${this.isSubmitting}"
                class="save-button"
                @button-click="${this._handleSubmit}"
              >
                Save
              </app-button>

              <app-button
                type="button"
                variant="cancel"
                size="large"
                @button-click="${this._handleCancel}"
                ?disabled="${this.isSubmitting}"
                class="cancel-button"
              >
                Cancel
              </app-button>
            </div>
          </form>
        </div>
      </div>

      <app-modal
        ?is-open="${this.showConfirmModal}"
        type="confirm"
        title="${t('messages.confirmUpdate')}"
        message="${t('messages.confirmUpdateMessage')}"
        confirm-text="${t('common.save')}"
        cancel-text="${t('common.cancel')}"
        confirm-variant="primary"
        @modal-confirm="${this._confirmUpdate}"
        @modal-cancel="${this._cancelUpdate}"
        @modal-close="${this._cancelUpdate}"
      ></app-modal>
    `;
  }

  _handleInputChange(field, value) {
    this.formData = { ...this.formData, [field]: value };
    
    // If there's an error showing, re-validate the field in real-time
    if (this.errors[field]) {
      // Get the current validation result
      const error = this._getFieldError(field);
      
      // Update error state
      this.errors = { ...this.errors, [field]: error };
      this.requestUpdate();
      
      // Also update the input component directly
      const input = this.shadowRoot.querySelector(`[data-field="${field}"]`);
      if (input) {
        input.error = error;
        input.requestUpdate();
      }
    }
  }

  _fieldHasValue(field, value) {
    // Handle different field types
    switch (field) {
      case 'dateOfEmployment':
      case 'dateOfBirth':
        // Date fields: check if value is a valid date string
        return value && value.length > 0 && value !== '';
      
      case 'phoneNumber':
        // Phone field: check if value has meaningful content
        return value && value.length > 0 && value !== '' && value !== '+(90) 5';
      
      case 'department':
      case 'position':
        // Select fields: check if a value is selected
        return value && value !== '';
      
      default:
        // Text fields: check if value is not empty after trim
        return value && value.trim();
    }
  }

  _validateField(field) {
    // Only validate on blur if there's already an error showing
    // This prevents showing errors before user submits
    if (this.errors[field]) {
      const error = this._getFieldError(field);
      this.errors = { ...this.errors, [field]: error };
      this.requestUpdate();
      return !error;
    }
    
    // If no error is showing, don't validate yet
    return true;
  }

  _validateName(value, field) {
    if (!value || !value.trim()) {
      return t('employeeForm.validation.required');
    }

    // XSS prevention - no HTML tags allowed
    if (/<[^>]*>/g.test(value)) {
      return t('employeeForm.validation.invalidCharacters');
    }

    // Only letters, spaces, hyphens, apostrophes allowed
    if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s\-']+$/u.test(value.trim())) {
      return t('employeeForm.validation.invalidName');
    }

    if (value.trim().length < 2) {
      return t('employeeForm.validation.nameTooShort');
    }

    if (value.trim().length > 50) {
      return t('employeeForm.validation.nameTooLong');
    }

    return '';
  }

  _validateEmail(value) {
    if (!value || !value.trim()) {
      return t('employeeForm.validation.required');
    }

    // XSS prevention
    if (/<[^>]*>/g.test(value)) {
      return t('employeeForm.validation.invalidCharacters');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return t('employeeForm.validation.invalidEmail');
    }

    // Check uniqueness (exclude current employee in edit mode)
    const store = useEmployeeStore.getState();
    const existingEmployee = store.employees.find(emp => 
      emp.email.toLowerCase() === value.toLowerCase() &&
      (!this.isEditMode || emp.id.toString() !== this.employeeId)
    );
    
    if (existingEmployee) {
      return t('employeeForm.validation.uniqueEmail');
    }

    return '';
  }

  _validatePhone(value) {
    if (!value || !value.trim()) {
      return t('employeeForm.validation.required');
    }

    // Phone should be in format +(90) 5XX XXX XX XX
    const phoneRegex = /^\+\(90\)\s5\d{2}\s\d{3}\s\d{2}\s\d{2}$/;
    if (!phoneRegex.test(value)) {
      return t('employeeForm.validation.invalidPhone');
    }

    // Check for unique phone number
    const store = useEmployeeStore.getState();
    const existingEmployee = store.employees.find(emp => 
      emp.phoneNumber === value &&
      (!this.isEditMode || emp.id.toString() !== this.employeeId)
    );
    if (existingEmployee) {
      return t('employeeForm.validation.uniquePhone');
    }

    return '';
  }

  _validateEmploymentDate(value) {
    if (!value) {
      return t('employeeForm.validation.required');
    }

    return '';
  }

  _validateBirthDate(value) {
    if (!value) {
      return t('employeeForm.validation.required');
    }

    const birthDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (birthDate > today) {
      return t('employeeForm.validation.futureDate');
    }

    return '';
  }

  _validateRequired(value, field) {
    if (!value || !value.trim()) {
      return t('employeeForm.validation.required');
    }
    return '';
  }

  _validateForm() {
    let isValid = true;
    const fields = Object.keys(this.formData);
    
    // Clear existing errors first
    this.errors = {};
    
    fields.forEach(field => {
      const error = this._getFieldError(field);
      if (error) {
        this.errors[field] = error;
        isValid = false;
      }
    });
    
    // Force component update
    this._forceRenderCount++;
    this.requestUpdate();
    
    // Also force update after a tick
    setTimeout(() => {
      this.requestUpdate();
    }, 0);
    
    return isValid;
  }

  _getFieldError(field) {
    const value = this.formData[field];
    
    switch (field) {
      case 'firstName':
      case 'lastName':
        return this._validateName(value, field);
      case 'email':
        return this._validateEmail(value);
      case 'phoneNumber':
        return this._validatePhone(value);
      case 'dateOfEmployment':
        return this._validateEmploymentDate(value);
      case 'dateOfBirth':
        return this._validateBirthDate(value);
      case 'department':
      case 'position':
        return this._validateRequired(value, field);
      default:
        return '';
    }
  }

  async _handleSubmit(event) {
    event.preventDefault();
    
    if (this.isSubmitting) return;

    // Validate all fields
    const isFormValid = this._validateForm();
    
    if (!isFormValid) {
      toast.error(t('employeeForm.validation.formErrors'));
      
      // Focus on first error field
      this._focusFirstErrorField();
      return;
    }

    // Show confirmation modal for edit mode
    if (this.isEditMode) {
      this.showConfirmModal = true;
      return;
    }

    this._performSave();
  }

  _performSave() {
    this.isSubmitting = true;

    try {
      // Prepare employee data
      const employeeData = {
        ...this.formData,
        firstName: this.formData.firstName.trim(),
        lastName: this.formData.lastName.trim(),
        email: this.formData.email.trim().toLowerCase(),
        phoneNumber: this.formData.phoneNumber.trim()
      };

      const store = useEmployeeStore.getState();

      if (this.isEditMode) {
        // Update existing employee
        const employeeId = this.originalEmployee.id; // Use original ID
        store.updateEmployee(employeeId, employeeData);
        toast.success(t('messages.employeeUpdated'));
      } else {
        // Add new employee
        store.addEmployee(employeeData);
        toast.success(t('messages.employeeAdded'));
      }

      // Navigate back to employee list
      setTimeout(() => {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, 1000);

    } catch (error) {
      console.error('Error saving employee:', error);
      const errorMessage = this.isEditMode 
        ? t('messages.updateEmployeeError')
        : t('messages.addEmployeeError');
      toast.error(errorMessage);
    } finally {
      this.isSubmitting = false;
    }
  }

  _confirmUpdate() {
    this.showConfirmModal = false;
    this._performSave();
  }

  _cancelUpdate() {
    this.showConfirmModal = false;
  }

  _handleCancel() {
    // Navigate back to employee list
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  _focusFirstErrorField() {
    // Field order for focusing
    const fieldOrder = [
      'firstName', 
      'lastName', 
      'dateOfEmployment', 
      'dateOfBirth', 
      'phoneNumber', 
      'email', 
      'department', 
      'position'
    ];

    for (const field of fieldOrder) {
      if (this.errors[field]) {
        // Find the input element and focus it
        setTimeout(() => {
          const input = this.shadowRoot.querySelector(`[data-field="${field}"]`) ||
                        this.shadowRoot.querySelector(`text-input[data-field="${field}"]`) ||
                        this.shadowRoot.querySelector(`phone-input[data-field="${field}"]`) ||
                        this.shadowRoot.querySelector(`date-input[data-field="${field}"]`) ||
                        this.shadowRoot.querySelector(`select-input[data-field="${field}"]`);
          
          if (input && typeof input.focus === 'function') {
            input.focus();
          }
        }, 100);
        break;
      }
    }
  }

  // Helper methods for date constraints
  _getTodayDate() {
    return new Date().toISOString().split('T')[0];
  }




}

customElements.define('add-employee-page', AddEmployeePage);
