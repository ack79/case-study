import { LitElement, html, css } from 'lit';
import '../components/navigation.js';
import '../components/employee-list-header.js';
import '../components/search-filter.js';
import '../components/employee-list.js';

export class HomePage extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    /* Global container styles inside shadow */
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
      box-sizing: border-box;
    }
    @media (min-width: 1440px) {
      .container { max-width: 1280px; }
    }

    .employee-content {
      margin-top: 20px;
    }
  `;

  render() {
          return html`
        <app-navigation current-page="home" language="tr"></app-navigation>
        <div class="container">
          <employee-list-header @bulk-delete="${this._handleBulkDelete}"></employee-list-header>
          <search-filter></search-filter>
          <div class="employee-content">
            <employee-list @employee-edit="${this._handleEmployeeEdit}"></employee-list>
          </div>
        </div>
      `;
  }

  _handleEmployeeEdit(event) {
    const { employee } = event.detail;
    // Navigate to edit employee page
    window.history.pushState({}, '', `/edit-employee/${employee.id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  _handleBulkDelete(event) {
    const { selectedEmployees, count } = event.detail;
    
    // Dispatch event to employee-list for modal handling
    const employeeList = this.shadowRoot.querySelector('employee-list');
    if (employeeList) {
      employeeList.handleBulkDelete(selectedEmployees, count);
    }
  }
}

customElements.define('home-page', HomePage);