/**
 * @license
 * Copyright 2024 Employee Management App
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { expect, fixture, elementUpdated } from '@open-wc/testing';
import { html } from 'lit';
import '../../src/pages/add-employee.js';

describe('AddEmployeePage', () => {
  let component;

  beforeEach(() => {
    // Mock i18n function
    window.t = (key) => key;
  });

  afterEach(() => {
    // Test sonrası temizlik
    if (component) {
      component.remove();
    }
  });

  describe('Component Rendering', () => {
    it('should render the component', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      expect(component).to.exist;
      expect(component.shadowRoot).to.exist;
    });

    it('should render all form fields', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      // Check if all input components are rendered
      expect(component.shadowRoot.querySelector('text-input[data-field="firstName"]')).to.exist;
      expect(component.shadowRoot.querySelector('text-input[data-field="lastName"]')).to.exist;
      expect(component.shadowRoot.querySelector('date-input[data-field="dateOfEmployment"]')).to.exist;
      expect(component.shadowRoot.querySelector('date-input[data-field="dateOfBirth"]')).to.exist;
      expect(component.shadowRoot.querySelector('phone-input[data-field="phoneNumber"]')).to.exist;
      expect(component.shadowRoot.querySelector('text-input[data-field="email"]')).to.exist;
      expect(component.shadowRoot.querySelector('select-input[data-field="department"]')).to.exist;
      expect(component.shadowRoot.querySelector('select-input[data-field="position"]')).to.exist;
    });

    it('should render save and cancel buttons', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      const saveButton = component.shadowRoot.querySelector('.save-button');
      const cancelButton = component.shadowRoot.querySelector('.cancel-button');
      
      expect(saveButton).to.exist;
      expect(cancelButton).to.exist;
      expect(saveButton.textContent.trim()).to.equal('Save');
      expect(cancelButton.textContent.trim()).to.equal('Cancel');
    });

    it('should render navigation component', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      const navigation = component.shadowRoot.querySelector('app-navigation');
      expect(navigation).to.exist;
    });

    it('should render modal component', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      const modal = component.shadowRoot.querySelector('app-modal');
      expect(modal).to.exist;
    });
  });

  describe('Form Data Handling', () => {
    it('should have initial empty form data', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      expect(component.formData).to.deep.equal({
        firstName: '',
        lastName: '',
        dateOfEmployment: '',
        dateOfBirth: '',
        phoneNumber: '',
        email: '',
        department: '',
        position: ''
      });
    });

    it('should update form data when input changes', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      // Simulate input change
      component._handleInputChange('firstName', 'Ahmet');
      
      expect(component.formData.firstName).to.equal('Ahmet');
    });

    it('should clear errors when input changes', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      // Set an error first
      component.errors = { firstName: 'Required field' };
      
      // Change input
      component._handleInputChange('firstName', 'Ahmet');
      
      // Error should be cleared
      expect(component.errors.firstName).to.equal('');
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      const isValid = component._validateForm();
      
      expect(isValid).to.be.false;
      expect(component.errors.firstName).to.exist;
      expect(component.errors.lastName).to.exist;
      expect(component.errors.email).to.exist;
      expect(component.errors.phoneNumber).to.exist;
      expect(component.errors.department).to.exist;
      expect(component.errors.position).to.exist;
    });

    it('should validate name fields', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      // Test empty name
      let error = component._validateName('', 'firstName');
      expect(error).to.exist;
      
      // Test valid name
      error = component._validateName('Ahmet', 'firstName');
      expect(error).to.equal('');
      
      // Test name with invalid characters
      error = component._validateName('Ahmet<script>', 'firstName');
      expect(error).to.exist;
      
      // Test name too short
      error = component._validateName('A', 'firstName');
      expect(error).to.exist;
      
      // Test name too long
      error = component._validateName('A'.repeat(51), 'firstName');
      expect(error).to.exist;
    });

    it('should validate email field', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      // Test empty email
      let error = component._validateEmail('');
      expect(error).to.exist;
      
      // Test invalid email format
      error = component._validateEmail('invalid-email');
      expect(error).to.exist;
      
      // Test valid email
      error = component._validateEmail('ahmet@ing.com');
      expect(error).to.equal('');
    });

    it('should validate phone field', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      // Test empty phone
      let error = component._validatePhone('');
      expect(error).to.exist;
      
      // Test invalid phone format
      error = component._validatePhone('1234567890');
      expect(error).to.exist;
      
      // Test valid phone
      error = component._validatePhone('+(90) 555 123 45 67');
      expect(error).to.equal('');
    });

    it('should validate birth date', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      // Test empty date
      let error = component._validateBirthDate('');
      expect(error).to.exist;
      
      // Test future date
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      error = component._validateBirthDate(futureDate.toISOString().split('T')[0]);
      expect(error).to.exist;
      
      // Test valid past date
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 25);
      error = component._validateBirthDate(pastDate.toISOString().split('T')[0]);
      expect(error).to.equal('');
    });
  });

  describe('Form Submission', () => {
    it('should prevent submission with invalid data', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      const form = component.shadowRoot.querySelector('form');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      
      form.dispatchEvent(submitEvent);
      await elementUpdated(component);
      
      // Form should have errors
      expect(component.errors).to.not.be.empty;
    });

    it('should submit with valid data', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      // Fill form with valid data
      component.formData = {
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        dateOfEmployment: '2023-01-15',
        dateOfBirth: '1990-05-20',
        phoneNumber: '+(90) 555 123 45 67',
        email: 'ahmet.yilmaz@ing.com',
        department: 'Tech',
        position: 'Senior'
      };
      
      const form = component.shadowRoot.querySelector('form');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      
      form.dispatchEvent(submitEvent);
      await elementUpdated(component);
      
      // Should not have errors
      expect(component.errors).to.be.empty;
    });
  });

  describe('Modal Integration', () => {
    it('should show confirmation modal in edit mode', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      // Set edit mode
      component.isEditMode = true;
      
      // Fill form with valid data
      component.formData = {
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        dateOfEmployment: '2023-01-15',
        dateOfBirth: '1990-05-20',
        phoneNumber: '+(90) 555 123 45 67',
        email: 'ahmet.yilmaz@ing.com',
        department: 'Tech',
        position: 'Senior'
      };
      
      // Mock the validation to return true
      component._validateForm = () => true;
      
      // Submit form
      component._handleSubmit(new Event('submit'));
      
      expect(component.showConfirmModal).to.be.true;
    });

    it('should confirm update when modal is confirmed', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      // Set edit mode
      component.isEditMode = true;
      component.showConfirmModal = true;
      
      // Confirm update
      component._confirmUpdate();
      
      expect(component.showConfirmModal).to.be.false;
    });

    it('should cancel update when modal is cancelled', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      // Set edit mode
      component.isEditMode = true;
      component.showConfirmModal = true;
      
      // Cancel update
      component._cancelUpdate();
      
      expect(component.showConfirmModal).to.be.false;
    });
  });

  describe('Helper Methods', () => {
    it('should check if field has value', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      // Test text field
      expect(component._fieldHasValue('firstName', 'Ahmet')).to.be.true;
      expect(component._fieldHasValue('firstName', '')).to.be.false;
      
      // Test date field
      expect(component._fieldHasValue('dateOfEmployment', '2023-01-15')).to.be.true;
      expect(component._fieldHasValue('dateOfEmployment', '')).to.be.false;
      
      // Test phone field
      expect(component._fieldHasValue('phoneNumber', '+(90) 555 123 45 67')).to.be.true;
      expect(component._fieldHasValue('phoneNumber', '+(90) 5')).to.be.false;
      
      // Test select field
      expect(component._fieldHasValue('department', 'Tech')).to.be.true;
      expect(component._fieldHasValue('department', '')).to.be.false;
    });

    it('should get today date', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      const today = component._getTodayDate();
      const expectedToday = new Date().toISOString().split('T')[0];
      
      expect(today).to.equal(expectedToday);
    });
  });

  describe('Component Properties', () => {
    it('should have correct initial properties', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      expect(component.isEditMode).to.be.false;
      expect(component.employeeId).to.be.null;
      expect(component.originalEmployee).to.be.null;
      expect(component.showConfirmModal).to.be.false;
      expect(component.isSubmitting).to.be.false;
      expect(component.errors).to.deep.equal({});
    });

    it('should update properties correctly', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      component.isEditMode = true;
      component.employeeId = '123';
      component.showConfirmModal = true;
      component.isSubmitting = true;
      
      expect(component.isEditMode).to.be.true;
      expect(component.employeeId).to.equal('123');
      expect(component.showConfirmModal).to.be.true;
      expect(component.isSubmitting).to.be.true;
    });
  });

  describe('Form Field Validation', () => {
    it('should validate employment date', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      // Test empty date
      let error = component._validateEmploymentDate('');
      expect(error).to.exist;
      
      // Test valid date
      error = component._validateEmploymentDate('2023-01-15');
      expect(error).to.equal('');
    });

    it('should validate required fields', async () => {
      component = await fixture(html`<add-employee-page></add-employee-page>`);
      
      // Test empty value
      let error = component._validateRequired('', 'department');
      expect(error).to.exist;
      
      // Test valid value
      error = component._validateRequired('Tech', 'department');
      expect(error).to.equal('');
    });
  });
});