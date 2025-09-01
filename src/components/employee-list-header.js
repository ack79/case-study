import { LitElement, html, css } from 'lit';
import './button.js';
import { useEmployeeStore } from '../store/index.js';
import { t, addLanguageChangeListener } from '../utils/i18n.js';

export class EmployeeListHeader extends LitElement {
  static properties = {
    viewMode: { type: String }, // 'table' | 'list' | 'card'
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
    // subscribe to store changes to reactively update selected state
    this._unsubscribe = useEmployeeStore.subscribe((state) => {
      if (state.viewMode !== this.viewMode) {
        this.viewMode = state.viewMode;
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
    return html`
      <div class="title-bar">
        <div class="title">${t('employeeList.title')}</div>
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
}

customElements.define('employee-list-header', EmployeeListHeader);


