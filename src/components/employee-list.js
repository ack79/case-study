import { LitElement, html, css } from 'lit';
import './employee-card.js';
import './button.js';
import './pagination.js';
import './modal.js';
import { useEmployeeStore } from '../store/index.js';
import { t, addLanguageChangeListener } from '../utils/i18n.js';
import { toast } from '../utils/toast-manager.js';

export class EmployeeList extends LitElement {
  static properties = {
    viewMode: { type: String }, // 'card' or 'table'
    employees: { type: Array },
    loading: { type: Boolean },
    selectedEmployees: { type: Array },
    modalOpen: { type: Boolean },
    employeeToDelete: { type: Object },
    bulkDeleteMode: { type: Boolean },
    employeesToDelete: { type: Array }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .employee-list {
      width: 100%;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px;
      color: #6B7280;
      font-size: 16px;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 40px;
      color: #6B7280;
      text-align: center;
    }

    .no-data-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .no-data-message {
      font-size: 16px;
      margin-bottom: 8px;
    }

    .no-data-submessage {
      font-size: 14px;
      opacity: 0.7;
    }

    /* Card Grid Layout */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
      padding: 0;
    }

    /* Table Layout */
    .table-layout {
      width: 100%;
      background: white;
      border-radius: 8px;
      border: none;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .employee-table {
      width: 100%;
      border-collapse: collapse;
      border: none;
    }

    .table-header {
      background: white;
    }

    .table-header th {
      padding: 12px 16px;
      text-align: left;
      font-size: 13px;
      font-weight: 500;
      color: #FF620B;
      border-bottom: 2px solid #F3F4F6;
      border-right: none;
      vertical-align: middle;
    }

    .table-header th:last-child {
      border-right: none;
    }

    .table-header th:first-child {
      width: 40px;
      text-align: center;
    }

    .table-row {
      border-bottom: 2px solid #F3F4F6;
      transition: background-color 0.2s ease;
    }

    .table-row:hover {
      background-color: #F9FAFB;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .table-cell {
      padding: 16px;
      font-size: 13px;
      color: #374151;
      border-right: none;
      vertical-align: middle;
    }

    .table-cell:last-child {
      border-right: none;
    }

    .table-cell:first-child {
      text-align: center;
      width: 40px;
    }

    .table-cell--email {
      color: #FF620B;
      text-decoration: none;
    }

    .table-cell--email:hover {
      text-decoration: underline;
    }

    .table-actions {
      display: flex;
      gap: 4px;
      justify-content: center;
    }

    .checkbox {
      width: 16px;
      height: 16px;
      border: 1px solid #D1D5DB;
      border-radius: 3px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: white;
      position: relative;
    }

    .checkbox:hover {
      border-color: #FF620B;
    }

    .checkbox--checked {
      background-color: #FF620B;
      border-color: #FF620B;
    }

    .checkbox--checked::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 10px;
      font-weight: bold;
    }

    /* Responsive Table */
    @media (max-width: 1024px) {
      .table-layout {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      .employee-table {
        min-width: 900px;
      }
    }

    @media (max-width: 768px) {
      .table-header th,
      .table-cell {
        padding: 12px 8px;
        font-size: 12px;
      }

      .table-header th:first-child,
      .table-cell:first-child {
        width: 32px;
      }

      .table-actions {
        gap: 2px;
      }

      .checkbox {
        width: 14px;
        height: 14px;
      }
    }

    @media (max-width: 480px) {
      .table-header th,
      .table-cell {
        padding: 8px 6px;
        font-size: 11px;
      }

      .employee-table {
        min-width: 800px;
      }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .card-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }

    @media (max-width: 480px) {
      .card-grid {
        gap: 12px;
      }
    }

    /* Animation for cards */
    employee-card {
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.3s ease forwards;
    }

    employee-card:nth-child(1) { animation-delay: 0.1s; }
    employee-card:nth-child(2) { animation-delay: 0.2s; }
    employee-card:nth-child(3) { animation-delay: 0.3s; }
    employee-card:nth-child(4) { animation-delay: 0.4s; }
    employee-card:nth-child(5) { animation-delay: 0.5s; }
    employee-card:nth-child(6) { animation-delay: 0.6s; }

    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  constructor() {
    super();
    this.viewMode = 'card';
    this.employees = [];
    this.loading = false;
    this.selectedEmployees = [];
    this.modalOpen = false;
    this.employeeToDelete = null;
    this.bulkDeleteMode = false;
    this.employeesToDelete = [];

    // Subscribe to store changes
    this._unsubscribe = useEmployeeStore.subscribe((state) => {
      // Get current page employees for display
      const store = useEmployeeStore.getState();
      this.employees = store.getCurrentPageEmployees() || [];
      this.loading = state.loading;
      this.viewMode = state.viewMode;
      this.selectedEmployees = state.selectedEmployees || [];
      this.requestUpdate();
    });

    // Add language change listener
    addLanguageChangeListener(this);

    // Initial load
    this._loadEmployees();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  render() {
    if (this.loading) {
      return this._renderLoading();
    }

    if (!this.employees || this.employees.length === 0) {
      return this._renderNoData();
    }

    return html`
      <div class="employee-list">
        ${this.viewMode === 'card' ? this._renderCardGrid() : this._renderTable()}
        <app-pagination 
          @page-change="${this._handlePageChange}"
          @items-per-page-change="${this._handleItemsPerPageChange}"
        ></app-pagination>
      </div>

      <app-modal
        ?is-open="${this.modalOpen}"
        type="confirm"
        title="Are you sure?"
        message="${this._getDeleteMessage()}"
        confirm-text="Proceed"
        cancel-text="Cancel"
        confirm-variant="danger"
        @modal-confirm="${this._confirmDelete}"
        @modal-cancel="${this._cancelDelete}"
        @modal-close="${this._cancelDelete}"
      ></app-modal>
    `;
  }

  _renderLoading() {
    return html`
      <div class="loading">
        <span class="material-icons" style="margin-right: 8px; animation: spin 1s linear infinite;">refresh</span>
        ${t('common.loading')}
      </div>
    `;
  }

  _renderNoData() {
    return html`
      <div class="no-data">
        <div class="no-data-icon">👥</div>
        <div class="no-data-message">${t('common.noData')}</div>
        <div class="no-data-submessage">No employees found matching your criteria</div>
      </div>
    `;
  }

  _renderCardGrid() {
    return html`
      <div class="card-grid">
        ${this.employees.map(employee => html`
          <employee-card 
            .employee="${employee}"
            @employee-edit="${this._handleEmployeeEdit}"
            @employee-delete="${this._handleEmployeeDelete}"
          ></employee-card>
        `)}
      </div>
    `;
  }

  _renderTable() {
    return html`
      <div class="table-layout">
        <table class="employee-table">
          <thead class="table-header">
            <tr>
              <th>
                <div 
                  class="checkbox ${this._areAllEmployeesSelected() ? 'checkbox--checked' : ''}"
                  @click="${this._toggleSelectAll}"
                ></div>
              </th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Date of Employment</th>
              <th>Date of Birth</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.employees.map(employee => html`
              <tr class="table-row">
                <td class="table-cell">
                  <div 
                    class="checkbox ${this._isEmployeeSelected(employee) ? 'checkbox--checked' : ''}"
                    @click="${() => this._toggleEmployeeSelection(employee)}"
                  ></div>
                </td>
                <td class="table-cell">${employee.firstName}</td>
                <td class="table-cell">${employee.lastName}</td>
                <td class="table-cell">${this._formatDate(employee.dateOfEmployment)}</td>
                <td class="table-cell">${this._formatDate(employee.dateOfBirth)}</td>
                <td class="table-cell">${employee.phoneNumber}</td>
                <td class="table-cell">
                  <span class="table-cell--email">${employee.email}</span>
                </td>
                <td class="table-cell">${employee.department}</td>
                <td class="table-cell">${employee.position}</td>
                <td class="table-cell">
                  <div class="table-actions">
                    <app-button 
                      variant="icon-only" 
                      size="small"
                      icon="edit"
                      title="Edit"
                      @button-click="${() => this._handleEmployeeEdit({detail: {employee}})}"
                    ></app-button>
                    
                    <app-button 
                      variant="icon-only danger" 
                      size="small"
                      icon="delete"
                      title="Delete"
                      @button-click="${() => this._handleEmployeeDelete({detail: {employee}})}"
                    ></app-button>
                  </div>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `;
  }

  async _loadEmployees() {
    const store = useEmployeeStore.getState();
    
    // Always update filtered employees to ensure they're loaded
    store.updateFilteredEmployees();
  }

  _handleEmployeeEdit(event) {
    const { employee } = event.detail;
    
    // Dispatch custom event for parent components to handle
    this.dispatchEvent(new CustomEvent('employee-edit', {
      detail: { employee },
      bubbles: true,
      composed: true
    }));
  }

  _handleEmployeeDelete(event) {
    const { employee } = event.detail;
    this.employeeToDelete = employee;
    this.modalOpen = true;
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

  _isEmployeeSelected(employee) {
    const store = useEmployeeStore.getState();
    return store.selectedEmployees?.includes(employee.id) || false;
  }

  _toggleEmployeeSelection(employee) {
    const store = useEmployeeStore.getState();
    store.toggleEmployeeSelection(employee.id);
  }

  _areAllEmployeesSelected() {
    const store = useEmployeeStore.getState();
    const allFilteredEmployees = store.filteredEmployees || [];
    
    if (allFilteredEmployees.length === 0) return false;
    
    return allFilteredEmployees.every(employee => 
      store.selectedEmployees?.includes(employee.id)
    );
  }

  _toggleSelectAll() {
    const store = useEmployeeStore.getState();
    const allSelected = this._areAllEmployeesSelected();
    
    if (allSelected) {
      // Deselect all employees (clear selection completely)
      store.clearSelection();
    } else {
      // Select all filtered employees (all pages)
      const allFilteredEmployees = store.filteredEmployees || [];
      const allEmployeeIds = allFilteredEmployees.map(emp => emp.id);
      store.selectAllEmployees(allEmployeeIds);
    }
  }

  _handlePageChange(event) {
    const { page } = event.detail;
    // Store already handles the page change via pagination component
  }

  _handleItemsPerPageChange(event) {
    const { itemsPerPage } = event.detail;
    // Store already handles the items per page change via pagination component
  }

  _getDeleteMessage() {
    if (this.bulkDeleteMode) {
      const count = this.employeesToDelete.length;
      return `${count} selected employee${count > 1 ? 's' : ''} will be deleted`;
    }
    
    if (!this.employeeToDelete) return '';
    return `Selected Employee record of ${this.employeeToDelete.firstName} ${this.employeeToDelete.lastName} will be deleted`;
  }

  _confirmDelete() {
    const store = useEmployeeStore.getState();
    
    if (this.bulkDeleteMode && this.employeesToDelete.length > 0) {
      // Bulk delete
      store.deleteMultipleEmployees(this.employeesToDelete);
      
      // Show success toast
      toast.success(`${this.employeesToDelete.length} ${t('messages.employeesDeleted')}`);
      
      // Close modal and reset bulk mode
      this.modalOpen = false;
      this.bulkDeleteMode = false;
      this.employeesToDelete = [];
    } else if (this.employeeToDelete) {
      // Single delete
      store.deleteEmployee(this.employeeToDelete.id);
      
      // Show success toast
      toast.success(t('messages.employeeDeleted'));
      
      // Close modal
      this.modalOpen = false;
      this.employeeToDelete = null;
    }
  }

  _cancelDelete() {
    this.modalOpen = false;
    this.employeeToDelete = null;
    this.bulkDeleteMode = false;
    this.employeesToDelete = [];
  }

  // Public method for bulk delete
  handleBulkDelete(selectedEmployeeIds, count) {
    this.bulkDeleteMode = true;
    this.employeesToDelete = selectedEmployeeIds;
    this.modalOpen = true;
  }

  _showNotification(type, message) {
    // Use toast system instead of alert
    toast[type](message);
  }
}

customElements.define('employee-list', EmployeeList);
