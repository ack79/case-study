import { LitElement, html, css } from 'lit';
import '../components/navigation.js';
import '../components/employee-list-header.js';
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
        <employee-list-header></employee-list-header>
        <div class="employee-content">
          <employee-list @employee-edit="${this._handleEmployeeEdit}"></employee-list>
        </div>
      </div>
    `;
  }

  _handleEmployeeEdit(event) {
    const { employee } = event.detail;
    console.log('Edit employee:', employee);
    // TODO: Navigate to edit page or open edit modal
    alert(`Edit functionality will be implemented for: ${employee.firstName} ${employee.lastName}`);
  }
}

customElements.define('home-page', HomePage);