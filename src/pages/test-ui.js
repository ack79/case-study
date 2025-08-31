import { LitElement, html } from 'lit';

export class TestUIPage extends LitElement {
  render() {
    return html`
      <div>
        <h1>Test UI Sayfası</h1>
        <p>Bu sayfa component'leri test etmek için kullanılacak.</p>
      </div>
    `;
    // TODO: ADD inputs, buttons
  }
}

customElements.define('test-ui-page', TestUIPage);