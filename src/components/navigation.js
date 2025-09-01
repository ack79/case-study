import { LitElement, html, css } from 'lit';
import { useUIStore } from '../store/index.js';
import { t, addLanguageChangeListener } from '../utils/i18n.js';

export class Navigation extends LitElement {
  static properties = {
    type: { type: String }, // 'header' or 'footer'
    showAddButton: { type: Boolean },
    currentPage: { type: String },
    language: { type: String }, // 'tr' or 'en'
    isMenuOpen: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .navigation {
      background-color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid #e5e7eb;
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #333;
      text-decoration: none;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-icon img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #FF620B;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .nav-item:hover {
      background-color: rgba(255, 98, 11, 0.1);
      color: #FF620B;
    }

    .nav-item.active {
      background-color: rgba(255, 98, 11, 0.1);
      color: #FF620B;
    }

    .add-button {
      background: none;
      color: #FF620B;
      border: none;
      padding: 0.5rem 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }

    .add-button:hover {
      background-color: rgba(255, 98, 11, 0.1);
      color: #FF7527;
    }

    .language-switcher {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #FF620B;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      transition: all 0.2s ease;
      -webkit-tap-highlight-color: transparent;
    }

    .language-switcher:hover {
      background-color: rgba(255, 98, 11, 0.1);
      color: #FF7527;
    }

    .flag {
      width: 20px;
      height: 15px;
      display: inline-block;
    }

    .flag img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .mobile-menu-btn {
      display: none;
      margin-left: auto;
      color: #FF620B;
      background: none;
      border: none;
      padding: 0.25rem;
      cursor: pointer;
    }

    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.3);
      z-index: 999;
    }

    .sidebar {
      position: fixed;
      top: 0;
      right: 0;
      width: 260px;
      height: 100vh;
      background: #fff;
      box-shadow: -2px 0 8px rgba(0,0,0,0.1);
      z-index: 1000;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .sidebar .nav-item,
    .sidebar .add-button {
      width: 100%;
      justify-content: flex-start;
    }

    .sidebar .language-switcher {
      align-self: stretch;
      padding: 0.5rem 1rem; /* match .nav-item padding */
      background: transparent;
    }

    /* Material Icons */
    .material-icons {
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
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

    /* Turkish Flag */


    /* Responsive */
    @media (max-width: 768px) {
      .navigation {
        padding: 1rem;
      }

      .nav-right { display: none; }
      .mobile-menu-btn { display: inline-flex; }
    }
  `;

  constructor() {
    super();
    this.type = 'header';
    this.showAddButton = true;
    this.currentPage = '';
    this.language = 'tr';
    this.isMenuOpen = false;
    
    // Initialize language from store
    this._updateLanguageFromStore();
    
    // Subscribe to store changes
    this._unsubscribe = useUIStore.subscribe((state) => {
      if (state.language !== this.language) {
        this.language = state.language;
        this.requestUpdate();
      }
    });
    
    // Add language change listener
    addLanguageChangeListener(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  render() {
    return html`
      <nav class="navigation">
        <div class="nav-left">
          <a href="/" class="logo">
            <div class="logo-icon">
              <img src="/src/assets/images/ing-logo.png" alt="ING Logo">
            </div>
            <span>ING</span>
          </a>
        </div>

        <div class="nav-right">
          <a href="/" class="nav-item ${this.currentPage === 'home' ? 'active' : ''}">
            <span class="material-icons">people</span>
            <span>${t('navigation.employees')}</span>
          </a>

          ${this.showAddButton ? html`
            <button class="add-button" @click="${this._handleAddClick}">
              <span class="material-icons">add</span>
              <span>${t('navigation.addNew')}</span>
            </button>
          ` : ''}

          <div class="language-switcher" @click="${this._handleLanguageClick}">
            <div class="flag">
              <img src="/src/assets/images/${this.language === 'tr' ? 'tr.svg' : 'gb.svg'}" alt="${this.language === 'tr' ? 'Turkish' : 'English'} flag">
            </div>
          </div>
        </div>
        <button class="mobile-menu-btn" @click="${this._toggleMenu}">
          <span class="material-icons">menu</span>
        </button>
      </nav>

      ${this.isMenuOpen ? html`
        <div class="backdrop" @click="${this._closeMenu}"></div>
        <div class="sidebar" @click="${(e) => e.stopPropagation()}">
          <a href="/" class="nav-item" @click="${this._closeMenu}">
            <span class="material-icons">people</span>
            <span>${t('navigation.employees')}</span>
          </a>
          ${this.showAddButton ? html`
            <button class="add-button" @click="${() => { this._handleAddClick(); this._closeMenu(); }}">
              <span class="material-icons">add</span>
              <span>${t('navigation.addNew')}</span>
            </button>
          ` : ''}
          <div class="language-switcher" @click="${() => { this._handleLanguageClick(); }}">
            <div class="flag">
              <img src="/src/assets/images/${this.language === 'tr' ? 'tr.svg' : 'gb.svg'}" alt="${this.language === 'tr' ? 'Turkish' : 'English'} flag">
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }

  _handleAddClick() {
    this.dispatchEvent(new CustomEvent('add-employee', {
      bubbles: true,
      composed: true
    }));
  }

  _handleLanguageClick() {
    // Toggle language
    const newLanguage = this.language === 'tr' ? 'en' : 'tr';
    
    // Update store - store subscription will handle the component update
    const ui = useUIStore.getState();
    ui.setLanguage(newLanguage);
  }

  _updateLanguageFromStore() {
    try {
      const ui = useUIStore.getState();
      if (ui?.language) {
        this.language = ui.language;
      }
    } catch (error) {
      console.error('Error updating language from store:', error);
    }
  }

  _toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  _closeMenu() {
    this.isMenuOpen = false;
  }
}

customElements.define('app-navigation', Navigation);
