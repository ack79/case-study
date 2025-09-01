import { LitElement, html, css } from 'lit';
import './button.js';
import { useEmployeeStore } from '../store/index.js';
import { t, addLanguageChangeListener } from '../utils/i18n.js';

export class EmployeeListHeader extends LitElement {
  static properties = {
    viewMode: { type: String }, // 'table' | 'list' | 'card'
    selectedEmployees: { type: Array }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
      padding: 12px 16px;
      background: transparent;
    }

    .title-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      width: 100%;
    }

    .title {
      color: #FF620B;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.2px;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .bulk-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-left: 16px;
    }

    .selected-count {
      font-size: 14px;
      color: #6B7280;
      font-weight: 500;
    }

    .bulk-delete-btn {
      background: #EF4444;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }

    .bulk-delete-btn:hover {
      background: #DC2626;
    }

    .bulk-delete-btn .material-icons {
      font-family: 'Material Icons';
      font-size: 16px;
    }

    .mode-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: none;
      color: #FF620B;
      cursor: pointer;
      transition: opacity 0.2s ease;
      opacity: 0.4;
    }

    .mode-btn.active {
      opacity: 1;
    }

    .mode-btn .material-icons {
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      font-size: 20px;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
    }

    @media (max-width: 768px) {
      :host {
        padding: 10px 12px;
      }
      .title { font-size: 18px; }
    }
  `;

  constructor() {
    super();
    this.viewMode = useEmployeeStore.getState().viewMode || 'table';
    this.selectedEmployees = [];
    
    // subscribe to store changes to reactively update selected state
    this._unsubscribe = useEmployeeStore.subscribe((state) => {
      if (state.viewMode !== this.viewMode) {
        this.viewMode = state.viewMode;
      }
      if (state.selectedEmployees !== this.selectedEmployees) {
        this.selectedEmployees = state.selectedEmployees || [];
      }
    });
    
    // Add language change listener
    addLanguageChangeListener(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) this._unsubscribe();
  }

  render() {
    const hasSelectedEmployees = this.selectedEmployees && this.selectedEmployees.length > 0;
    const isTableView = this.viewMode === 'table';
    
    return html`
      <div class="title-bar">
        <div class="title">
          ${t('employeeList.title')}
          ${hasSelectedEmployees && isTableView ? html`
            <div class="bulk-actions">
              <span class="selected-count">
                ${this.selectedEmployees.length} ${t('employeeList.selectedEmployees')}
              </span>
              <button 
                class="bulk-delete-btn"
                @click="${this._handleBulkDelete}"
                title="${t('employeeList.deleteSelected')}"
              >
                <span class="material-icons">delete</span>
                <span>${t('common.delete')}</span>
              </button>
            </div>
          ` : ''}
        </div>
        <div class="actions">
          ${this._renderModeButton('table', 'density_medium', t('employeeList.viewMode.table'))}
          ${this._renderModeButton('card', 'view_module', t('employeeList.viewMode.card'))}
        </div>
      </div>
    `;
  }

  _renderModeButton(mode, icon, ariaLabel) {
    const active = this.viewMode === mode;
    return html`
      <button 
        class="mode-btn ${active ? 'active' : ''}"
        title="${ariaLabel}"
        @click="${() => this._setMode(mode)}"
      >
        <span class="material-icons">${icon}</span>
      </button>
    `;
  }

  _setMode(mode) {
    const store = useEmployeeStore.getState();
    if (store.setViewMode) {
      store.setViewMode(mode);
    }
    this.dispatchEvent(new CustomEvent('view-mode-change', {
      detail: { viewMode: mode },
      bubbles: true,
      composed: true,
    }));
  }

  _handleBulkDelete() {
    if (!this.selectedEmployees || this.selectedEmployees.length === 0) return;
    
    this.dispatchEvent(new CustomEvent('bulk-delete', {
      detail: { 
        selectedEmployees: this.selectedEmployees,
        count: this.selectedEmployees.length 
      },
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define('employee-list-header', EmployeeListHeader);


