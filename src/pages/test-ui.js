import { LitElement, html, css } from 'lit';
import '../components/button.js';

export class TestUIPage extends LitElement {
  static styles = css`
    .test-ui {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      box-sizing: border-box;
      overflow-x: hidden;
      width: 100%;
    }
    
    .page-title {
      font-size: 2rem;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 20px;
      text-align: center;
    }
    
    .section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background-color: white;
      box-sizing: border-box;
      overflow-x: hidden;
      width: 100%;
    }
    
    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 15px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 8px;
    }
    
    .button-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
    }
    
    .button-example {
      margin-bottom: 20px;
      width: 100%;
      box-sizing: border-box;
    }
    
    .button-example h4 {
      margin-bottom: 8px;
      color: #6b7280;
      font-size: 14px;
    }
  `;

  render() {
    return html`
      <div class="test-ui">
        <h1 class="page-title"> Test UI Sayfası</h1>
        
        <div class="section">
          <h2 class="section-title">Button Components</h2>
          
          <div class="button-example">
            <h4>Primary Buttons (Ana Marka Rengi: #FF620B)</h4>
            <div class="button-grid">
              <app-button variant="primary" size="small">Küçük</app-button>
              <app-button variant="primary" size="medium">Orta</app-button>
              <app-button variant="primary" size="large">Büyük</app-button>
            </div>
          </div>
          
          <div class="button-example">
            <h4>Secondary Buttons (İkincil Marka Rengi: #FF7527)</h4>
            <div class="button-grid">
              <app-button variant="secondary" size="medium">İkincil</app-button>
              <app-button variant="secondary" size="medium" icon="settings">Ayarlar</app-button>
            </div>
          </div>
          
          <div class="button-example">
            <h4>Danger Buttons (Silme İşlemleri)</h4>
            <div class="button-grid">
              <app-button variant="danger" size="medium">Sil</app-button>
              <app-button variant="danger" size="medium" icon="delete">Sil</app-button>
            </div>
          </div>
          
          <div class="button-example">
            <h4>Outlined Buttons (Düzenleme İşlemleri)</h4>
            <div class="button-grid">
              <app-button variant="outlined" size="medium">Düzenle</app-button>
              <app-button variant="outlined" size="medium" icon="edit">Düzenle</app-button>
            </div>
          </div>
          
          <div class="button-example">
            <h4>Icon Buttons (Farklı Pozisyonlar)</h4>
            <div class="button-grid">
              <app-button variant="primary" size="medium" icon="add" icon-position="left">Yeni Ekle</app-button>
              <app-button variant="primary" size="medium" icon="arrow_forward" icon-position="right">İleri</app-button>
              <app-button variant="secondary" size="medium" icon="search">Ara</app-button>
              <app-button variant="outlined" size="medium" icon="save">Kaydet</app-button>
            </div>
          </div>
          
          <div class="button-example">
            <h4>Icon-Only Buttons (Sadece İkon - Transparent)</h4>
            <div class="button-grid">
              <app-button variant="icon-only" size="small" icon="edit" title="Düzenle"></app-button>
              <app-button variant="icon-only" size="medium" icon="edit" title="Düzenle"></app-button>
              <app-button variant="icon-only" size="large" icon="edit" title="Düzenle"></app-button>
              
              <app-button variant="icon-only" size="small" icon="delete" title="Sil"></app-button>
              <app-button variant="icon-only" size="medium" icon="delete" title="Sil"></app-button>
              <app-button variant="icon-only" size="large" icon="delete" title="Sil"></app-button>
              
              <app-button variant="icon-only" size="medium" icon="add" title="Ekle"></app-button>
              <app-button variant="icon-only" size="medium" icon="search" title="Ara"></app-button>
              <app-button variant="icon-only" size="medium" icon="settings" title="Ayarlar"></app-button>
              <app-button variant="icon-only" size="medium" icon="save" title="Kaydet"></app-button>
            </div>
          </div>
          
          <div class="button-example">
            <h4>Icon-Only Buttons (Sadece İkon - Outlined)</h4>
            <div class="button-grid">
              <app-button variant="icon-only-outlined" size="small" icon="edit" title="Düzenle"></app-button>
              <app-button variant="icon-only-outlined" size="medium" icon="edit" title="Düzenle"></app-button>
              <app-button variant="icon-only-outlined" size="large" icon="edit" title="Düzenle"></app-button>
              
              <app-button variant="icon-only-outlined" size="small" icon="delete" title="Sil"></app-button>
              <app-button variant="icon-only-outlined" size="medium" icon="delete" title="Sil"></app-button>
              <app-button variant="icon-only-outlined" size="large" icon="delete" title="Sil"></app-button>
              
              <app-button variant="icon-only-outlined" size="medium" icon="add" title="Ekle"></app-button>
              <app-button variant="icon-only-outlined" size="medium" icon="search" title="Ara"></app-button>
              <app-button variant="icon-only-outlined" size="medium" icon="settings" title="Ayarlar"></app-button>
              <app-button variant="icon-only-outlined" size="medium" icon="save" title="Kaydet"></app-button>
            </div>
          </div>
          
          <div class="button-example">
            <h4>Icon-Only Buttons (Sadece İkon - Primary)</h4>
            <div class="button-grid">
              <app-button variant="icon-only-primary" size="small" icon="edit" title="Düzenle"></app-button>
              <app-button variant="icon-only-primary" size="medium" icon="edit" title="Düzenle"></app-button>
              <app-button variant="icon-only-primary" size="large" icon="edit" title="Düzenle"></app-button>
              
              <app-button variant="icon-only-primary" size="small" icon="delete" title="Sil"></app-button>
              <app-button variant="icon-only-primary" size="medium" icon="delete" title="Sil"></app-button>
              <app-button variant="icon-only-primary" size="large" icon="delete" title="Sil"></app-button>
              
              <app-button variant="icon-only-primary" size="medium" icon="add" title="Ekle"></app-button>
              <app-button variant="icon-only-primary" size="medium" icon="search" title="Ara"></app-button>
              <app-button variant="icon-only-primary" size="medium" icon="settings" title="Ayarlar"></app-button>
              <app-button variant="icon-only-primary" size="medium" icon="save" title="Kaydet"></app-button>
            </div>
          </div>
          
          <div class="button-example">
            <h4>Loading & Disabled States</h4>
            <div class="button-grid">
              <app-button variant="primary" size="medium" loading>Yükleniyor...</app-button>
              <app-button variant="primary" size="medium" disabled>Devre Dışı</app-button>
              <app-button variant="icon-only" size="medium" icon="edit" disabled title="Düzenle"></app-button>
            </div>
          </div>
          
          <div class="button-example">
            <h4>Full Width Button</h4>
            <app-button variant="primary" size="medium" full-width>Tam Genişlik Buton</app-button>
          </div>
        </div>
        
        <div class="section">
          <h2 class="section-title">Input Components</h2>
          <p>Burada input component'leri test edilecek</p>
        </div>
        
        <div class="section">
          <h2 class="section-title">Form Components</h2>
          <p>Burada form component'leri test edilecek</p>
        </div>
        
        <div class="section">
          <h2 class="section-title">Navigation</h2>
          <p>Burada navigation component'leri test edilecek</p>
        </div>
      </div>
    `;
  }
}

customElements.define('test-ui-page', TestUIPage);