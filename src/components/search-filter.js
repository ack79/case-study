import { LitElement, html, css } from 'lit';
import './text-input.js';
import './select-input.js';
import './button.js';
import { useEmployeeStore } from '../store/index.js';
import { t, addLanguageChangeListener } from '../utils/i18n.js';

export class SearchFilter extends LitElement {
  static properties = {
    searchTerm: { type: String },
    departmentFilter: { type: String },
    positionFilter: { type: String },
    sortField: { type: String },
    sortDirection: { type: String },
    isExpanded: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 16px;
    }

    .search-filter-container {
      padding: 16px;
    }

    .search-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .search-input {
      flex: 1;
      min-width: 250px;
    }

    .filter-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toggle-button {
      min-width: auto;
      padding: 8px 12px;
      border: 1px solid #E5E7EB;
      background: white;
      color: #6B7280;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .toggle-button:hover {
      border-color: #FF620B;
      color: #FF620B;
    }

    .toggle-button--active {
      border-color: #FF620B;
      background: #FFF7ED;
      color: #FF620B;
    }

    .toggle-button .material-icons {
      font-family: 'Material Icons';
      font-size: 16px;
      transition: transform 0.2s ease;
    }

    .toggle-button--active .material-icons {
      transform: rotate(180deg);
    }

    .filters-section {
      display: none;
      padding-top: 12px;
      border-top: 1px solid #F3F4F6;
      margin-top: 12px;
    }

    .filters-section--expanded {
      display: block;
      animation: slideDown 0.2s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .sort-section {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .sort-label {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      white-space: nowrap;
    }

    .sort-buttons {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }

    .sort-button {
      min-width: auto;
      padding: 6px 12px;
      border: 1px solid #E5E7EB;
      background: white;
      color: #6B7280;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .sort-button:hover {
      border-color: #FF620B;
      color: #FF620B;
    }

    .sort-button--active {
      border-color: #FF620B;
      background: #FF620B;
      color: white;
    }

    .sort-button .material-icons {
      font-family: 'Material Icons';
      font-size: 14px;
    }

    .actions-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-top: 12px;
      border-top: 1px solid #F3F4F6;
      margin-top: 12px;
    }

    .filter-count {
      font-size: 13px;
      color: #6B7280;
    }

    .filter-count--active {
      color: #FF620B;
      font-weight: 500;
    }

    .clear-button {
      font-size: 12px;
      padding: 4px 8px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .search-row {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
      }

      .search-input {
        min-width: auto;
      }

      .filter-toggle {
        justify-content: center;
      }

      .filters-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .sort-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .sort-buttons {
        width: 100%;
        justify-content: flex-start;
      }

      .actions-section {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
      }
    }

    @media (max-width: 480px) {
      .search-filter-container {
        padding: 12px;
      }

      .sort-buttons {
        flex-direction: column;
      }

      .sort-button {
        justify-content: flex-start;
      }
    }
  `;

  constructor() {
    super();
    this.searchTerm = '';
    this.departmentFilter = '';
    this.positionFilter = '';
    this.sortField = 'firstName';
    this.sortDirection = 'asc';
    this.isExpanded = false;

    // Subscribe to store changes
    this._unsubscribe = useEmployeeStore.subscribe((state) => {
      this.searchTerm = state.searchTerm || '';
      this.departmentFilter = state.filters.department || '';
      this.positionFilter = state.filters.position || '';
      this.sortField = state.sortConfig.field || 'firstName';
      this.sortDirection = state.sortConfig.direction || 'asc';
      this.requestUpdate();
    });

    // Add language change listener
    addLanguageChangeListener(this);

    // Initial load
    this._loadFromStore();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  render() {
    const departmentOptions = [
      { value: '', label: t('employeeList.allDepartments') },
      { value: 'Analytics', label: t('employeeList.departments.analytics') },
      { value: 'Tech', label: t('employeeList.departments.tech') }
    ];

    const positionOptions = [
      { value: '', label: t('employeeList.allPositions') },
      { value: 'Junior', label: t('employeeList.positions.junior') },
      { value: 'Medior', label: t('employeeList.positions.medior') },
      { value: 'Senior', label: t('employeeList.positions.senior') }
    ];

    const activeFiltersCount = this._getActiveFiltersCount();

    return html`
      <div class="search-filter-container">
        <div class="search-row">
          <div class="search-input">
            <text-input
              type="search"
              placeholder="${t('employeeList.searchPlaceholder')}"
              .value="${this.searchTerm}"
              icon="search"
              icon-position="left"
              size="medium"
              @input-change="${this._handleSearchChange}"
            ></text-input>
          </div>
          
          <div class="filter-toggle">
            <button 
              class="toggle-button ${this.isExpanded ? 'toggle-button--active' : ''}"
              @click="${this._toggleFilters}"
            >
              <span class="material-icons">expand_more</span>
              <span>${t('common.filter')}</span>
              ${activeFiltersCount > 0 ? html`<span>(${activeFiltersCount})</span>` : ''}
            </button>
          </div>
        </div>

        <div class="filters-section ${this.isExpanded ? 'filters-section--expanded' : ''}">
          <div class="filters-grid">
            <select-input
              label="${t('employeeList.department')}"
              placeholder="${t('employeeList.allDepartments')}"
              .options="${departmentOptions}"
              .value="${this.departmentFilter}"
              size="medium"
              @select-change="${this._handleDepartmentChange}"
            ></select-input>

            <select-input
              label="${t('employeeList.position')}"
              placeholder="${t('employeeList.allPositions')}"
              .options="${positionOptions}"
              .value="${this.positionFilter}"
              size="medium"
              @select-change="${this._handlePositionChange}"
            ></select-input>
          </div>

          <div class="sort-section">
            <span class="sort-label">${t('common.sortBy')}:</span>
            <div class="sort-buttons">
              ${this._renderSortButton('firstName', 'person', t('employeeForm.fields.firstName'))}
              ${this._renderSortButton('lastName', 'person', t('employeeForm.fields.lastName'))}
              ${this._renderSortButton('dateOfEmployment', 'date_range', t('employeeForm.fields.dateOfEmployment'))}
              ${this._renderSortButton('department', 'business', t('employeeForm.fields.department'))}
              ${this._renderSortButton('position', 'work', t('employeeForm.fields.position'))}
            </div>
          </div>

          <div class="actions-section">
            <span class="filter-count ${activeFiltersCount > 0 ? 'filter-count--active' : ''}">
              ${this._getTotalEmployeesText()}
            </span>
            
            ${activeFiltersCount > 0 ? html`
              <app-button
                variant="outlined"
                size="small"
                class="clear-button"
                @button-click="${this._clearAllFilters}"
              >
                ${t('common.clear')}
              </app-button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  _renderSortButton(field, icon, label) {
    const isActive = this.sortField === field;
    const direction = isActive ? this.sortDirection : 'asc';
    
    return html`
      <button
        class="sort-button ${isActive ? 'sort-button--active' : ''}"
        @click="${() => this._handleSort(field)}"
        title="${label} ${direction === 'asc' ? '↑' : '↓'}"
      >
        <span class="material-icons">${icon}</span>
        <span>${label}</span>
        ${isActive ? html`
          <span class="material-icons">${direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>
        ` : ''}
      </button>
    `;
  }

  _handleSearchChange(event) {
    const { value } = event.detail;
    this.searchTerm = value;
    
    const store = useEmployeeStore.getState();
    store.setSearchTerm(value);
  }

  _handleDepartmentChange(event) {
    const { value } = event.detail;
    this.departmentFilter = value;
    
    const store = useEmployeeStore.getState();
    store.setFilter('department', value);
  }

  _handlePositionChange(event) {
    const { value } = event.detail;
    this.positionFilter = value;
    
    const store = useEmployeeStore.getState();
    store.setFilter('position', value);
  }

  _handleSort(field) {
    const newDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    
    this.sortField = field;
    this.sortDirection = newDirection;
    
    const store = useEmployeeStore.getState();
    store.setSortConfig(field, newDirection);
  }

  _toggleFilters() {
    this.isExpanded = !this.isExpanded;
  }

  _clearAllFilters() {
    this.searchTerm = '';
    this.departmentFilter = '';
    this.positionFilter = '';
    
    const store = useEmployeeStore.getState();
    store.clearFilters();
    store.setSearchTerm('');
  }

  _getActiveFiltersCount() {
    let count = 0;
    if (this.searchTerm) count++;
    if (this.departmentFilter) count++;
    if (this.positionFilter) count++;
    return count;
  }

  _getTotalEmployeesText() {
    const store = useEmployeeStore.getState();
    const total = store.employees?.length || 0;
    const filtered = store.filteredEmployees?.length || 0;
    
    if (filtered === total) {
      return `${total} ${t('employeeList.totalEmployees')}`;
    } else {
      return `${filtered} / ${total} ${t('employeeList.totalEmployees')}`;
    }
  }

  _loadFromStore() {
    const store = useEmployeeStore.getState();
    this.searchTerm = store.searchTerm || '';
    this.departmentFilter = store.filters.department || '';
    this.positionFilter = store.filters.position || '';
    this.sortField = store.sortConfig.field || 'firstName';
    this.sortDirection = store.sortConfig.direction || 'asc';
  }
}

customElements.define('search-filter', SearchFilter);
