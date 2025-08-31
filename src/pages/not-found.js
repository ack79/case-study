import { LitElement, html } from 'lit';

export class NotFoundPage extends LitElement {
  render() {
    return html`
      <div>
        <h1>404 - Sayfa Bulunamadı</h1>
        <p>Bu sayfa mevcut değil.</p>
        <a href="/">Ana Sayfaya Dön</a>
      </div>
    `;
  }
}

customElements.define('not-found-page', NotFoundPage);