import { LitElement, html, css } from 'lit';
import './button.js';
import { useEmployeeStore } from '../store/index.js';
import { t, addLanguageChangeListener } from '../utils/i18n.js';

export class Pagination extends LitElement {
  static properties = {
    currentPage: { type: Number },
    totalPages: { type: Number },
    totalItems: { type: Number },
    itemsPerPage: { type: Number },
    showItemsPerPageSelector: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      padding: 16px 0;
    }

    .pagination-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    .pagination-info {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #6B7280;
      font-size: 14px;
    }

    .items-per-page {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .items-per-page select {
      padding: 6px 12px;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      background: white;
      font-size: 14px;
      color: #374151;
      cursor: pointer;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .items-per-page select:focus {
      border-color: #FF620B;
      box-shadow: 0 0 0 3px rgba(255, 98, 11, 0.1);
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .page-numbers {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .page-button {
      min-width: 28px;
      height: 28px;
      border: none;
      background: transparent;
      color: #9CA3AF;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 400;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .page-button:hover:not(:disabled) {
      background-color: #F3F4F6;
      color: #374151;
    }

    .page-button--active {
      background-color: #FF620B;
      color: white;
      border-radius: 4px;
    }

    .page-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-ellipsis {
      padding: 0 4px;
      color: #9CA3AF;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      min-width: 28px;
    }

    .nav-button {
      min-width: 28px;
      height: 28px;
    }

    .nav-button .material-icons {
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      font-size: 16px;
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

    /* Responsive */
    @media (max-width: 768px) {
      .pagination-container {
        flex-direction: column;
        gap: 12px;
      }

      .pagination-info {
        order: 2;
        font-size: 12px;
      }

      .pagination-controls {
        order: 1;
      }

      .page-numbers {
        gap: 1px;
      }

      .page-button {
        min-width: 24px;
        height: 24px;
        font-size: 11px;
      }

      .nav-button {
        min-width: 24px;
        height: 24px;
      }

      .nav-button .material-icons {
        font-size: 14px;
      }

      .page-ellipsis {
        height: 24px;
        min-width: 24px;
        font-size: 11px;
      }
    }

    @media (max-width: 480px) {
      :host {
        padding: 12px 0;
      }

      .pagination-info {
        text-align: center;
      }

      .items-per-page {
        flex-direction: column;
        gap: 4px;
        text-align: center;
      }
    }
  `;

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
    this.totalItems = 0;
    this.itemsPerPage = 10;
    this.showItemsPerPageSelector = true;

    // Subscribe to store changes
    this._unsubscribe = useEmployeeStore.subscribe((state) => {
      this.currentPage = state.pagination.currentPage;
      this.totalPages = state.pagination.totalPages;
      this.totalItems = state.pagination.totalItems;
      this.itemsPerPage = state.pagination.itemsPerPage;
      this.requestUpdate();
    });

    // Add language change listener
    addLanguageChangeListener(this);

    // Initial load
    this._loadPaginationData();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  render() {
    const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);

    return html`
      <div class="pagination-container">
        <div class="pagination-info">
          ${this.showItemsPerPageSelector ? html`
            <div class="items-per-page">
              <span>${t('pagination.itemsPerPage')}</span>
              <select @change="${this._handleItemsPerPageChange}" .value="${this.itemsPerPage}">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          ` : ''}
          
          <span>
            ${t('pagination.showing')} ${startItem}-${endItem} ${t('pagination.of')} ${this.totalItems}
          </span>
        </div>

        <div class="pagination-controls">
          ${this._renderPaginationButtons()}
        </div>
      </div>
    `;
  }

  _renderPaginationButtons() {
    if (this.totalPages <= 1) return '';

    const buttons = [];
    const maxVisible = 7; // Maximum visible page numbers

    // Previous button
    buttons.push(html`
      <button 
        class="page-button nav-button"
        ?disabled="${this.currentPage === 1}"
        @click="${() => this._goToPage(this.currentPage - 1)}"
        title="${t('pagination.previous')}"
      >
        <span class="material-icons">chevron_left</span>
      </button>
    `);

    // Page numbers
    if (this.totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        buttons.push(this._renderPageButton(i));
      }
    } else {
      // Show with ellipsis
      const showFirst = this.currentPage > 3;
      const showLast = this.currentPage < this.totalPages - 2;

      if (showFirst) {
        buttons.push(this._renderPageButton(1));
        if (this.currentPage > 4) {
          buttons.push(html`<span class="page-ellipsis">...</span>`);
        }
      }

      // Current page and neighbors
      const start = Math.max(1, this.currentPage - 1);
      const end = Math.min(this.totalPages, this.currentPage + 1);

      for (let i = start; i <= end; i++) {
        buttons.push(this._renderPageButton(i));
      }

      if (showLast) {
        if (this.currentPage < this.totalPages - 3) {
          buttons.push(html`<span class="page-ellipsis">...</span>`);
        }
        buttons.push(this._renderPageButton(this.totalPages));
      }
    }

    // Next button
    buttons.push(html`
      <button 
        class="page-button nav-button"
        ?disabled="${this.currentPage === this.totalPages}"
        @click="${() => this._goToPage(this.currentPage + 1)}"
        title="${t('pagination.next')}"
      >
        <span class="material-icons">chevron_right</span>
      </button>
    `);

    return html`<div class="page-numbers">${buttons}</div>`;
  }

  _renderPageButton(pageNumber) {
    return html`
      <button 
        class="page-button ${pageNumber === this.currentPage ? 'page-button--active' : ''}"
        @click="${() => this._goToPage(pageNumber)}"
      >
        ${pageNumber}
      </button>
    `;
  }

  _goToPage(page) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    const store = useEmployeeStore.getState();
    store.setCurrentPage(page);

    // Dispatch event for parent components
    this.dispatchEvent(new CustomEvent('page-change', {
      detail: { page, totalPages: this.totalPages },
      bubbles: true,
      composed: true
    }));
  }

  _handleItemsPerPageChange(event) {
    const newItemsPerPage = parseInt(event.target.value);
    const store = useEmployeeStore.getState();
    store.setItemsPerPage(newItemsPerPage);

    // Dispatch event for parent components
    this.dispatchEvent(new CustomEvent('items-per-page-change', {
      detail: { itemsPerPage: newItemsPerPage },
      bubbles: true,
      composed: true
    }));
  }

  _loadPaginationData() {
    const store = useEmployeeStore.getState();
    this.currentPage = store.pagination.currentPage;
    this.totalPages = store.pagination.totalPages;
    this.totalItems = store.pagination.totalItems;
    this.itemsPerPage = store.pagination.itemsPerPage;
  }
}

customElements.define('app-pagination', Pagination);
