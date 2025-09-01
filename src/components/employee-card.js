import { LitElement, html, css } from 'lit';
import './button.js';
import { t, addLanguageChangeListener } from '../utils/i18n.js';

export class EmployeeCard extends LitElement {
  static properties = {
    employee: { type: Object }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .card {
      background: white;
      border-radius: 4px;
      border: 1px solid #E5E7EB;
      padding: 16px;
      transition: all 0.2s ease;
    }

    .card:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }



    .card-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 12px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .info-label {
      font-size: 11px;
      font-weight: 500;
      color: #9CA3AF;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 13px;
      color: #1F2937;
      font-weight: 500;
    }

    .info-value--email {
      color: #FF620B;
      text-decoration: none;
    }

    .info-value--email:hover {
      text-decoration: underline;
    }



    .card-footer {
      display: flex;
      gap: 8px;
      padding-top: 12px;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .card {
        padding: 12px;
      }

      .card-body {
        grid-template-columns: 1fr;
        gap: 10px;
      }
    }
  `;

  constructor() {
    super();
    this.employee = null;

    // Add language change listener
    addLanguageChangeListener(this);
  }

  render() {
    if (!this.employee) {
      return html`<div class="card">${t('common.loading')}</div>`;
    }

    return html`
      <div class="card">


        <div class="card-body">
          <div class="info-item">
            <span class="info-label">${t('employeeList.fields.firstName')}:</span>
            <span class="info-value">${this.employee.firstName}</span>
          </div>

          <div class="info-item">
            <span class="info-label">${t('employeeList.fields.lastName')}</span>
            <span class="info-value">${this.employee.lastName}</span>
          </div>

          <div class="info-item">
            <span class="info-label">${t('employeeList.fields.dateOfEmployment')}</span>
            <span class="info-value">${this._formatDate(this.employee.dateOfEmployment)}</span>
          </div>

          <div class="info-item">
            <span class="info-label">${t('employeeList.fields.dateOfBirth')}</span>
            <span class="info-value">${this._formatDate(this.employee.dateOfBirth)}</span>
          </div>

          <div class="info-item">
            <span class="info-label">${t('employeeList.fields.phone')}</span>
            <span class="info-value">${this.employee.phoneNumber}</span>
          </div>

          <div class="info-item">
            <span class="info-label">${t('employeeList.fields.email')}</span>
            <span class="info-value info-value--email">${this.employee.email}</span>
          </div>

          <div class="info-item">
            <span class="info-label">${t('employeeList.fields.department')}</span>
            <span class="info-value">${this.employee.department}</span>
          </div>

          <div class="info-item">
            <span class="info-label">${t('employeeList.fields.position')}</span>
            <span class="info-value">${this.employee.position}</span>
          </div>
        </div>

        <div class="card-footer">
          <app-button 
            variant="purple" 
            size="small"
            icon="edit"
            @button-click="${this._handleEdit}"
          >
            Edit
          </app-button>
          
          <app-button 
            variant="danger" 
            size="small"
            icon="delete"
            @button-click="${this._handleDelete}"
          >
            Delete
          </app-button>
        </div>
      </div>
    `;
  }



  _formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }



  _handleEdit() {
    this.dispatchEvent(new CustomEvent('employee-edit', {
      detail: { employee: this.employee },
      bubbles: true,
      composed: true
    }));
  }

  _handleDelete() {
    this.dispatchEvent(new CustomEvent('employee-delete', {
      detail: { employee: this.employee },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('employee-card', EmployeeCard);

