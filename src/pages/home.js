import { LitElement, html } from 'lit';

export class HomePage extends LitElement {
  render() {
    return html`
      <div>
        <h1>Employee Management Application</h1>
      </div>
    `;
  }
}

customElements.define('home-page', HomePage);