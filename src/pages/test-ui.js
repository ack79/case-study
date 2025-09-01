import { LitElement, html, css } from 'lit';
import '../components/button.js';
import '../components/text-input.js';
import '../components/phone-input.js';
import '../components/date-input.js';
import '../components/select-input.js';

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
            <h4>Cancel Buttons (İptal İşlemleri)</h4>
            <div class="button-grid">
              <app-button variant="cancel" size="medium">İptal</app-button>
              <app-button variant="cancel" size="medium" icon="close">İptal</app-button>
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
          
          <div class="button-example">
            <h4>Basic Text Inputs</h4>
            <div class="button-grid">
              <text-input 
                label="Ad" 
                placeholder="Adınızı girin"
                size="medium"
                required
              ></text-input>
              
              <text-input 
                label="Soyad" 
                placeholder="Soyadınızı girin"
                size="medium"
                required
              ></text-input>
            </div>
          </div>
          
          <div class="button-example">
            <h4>Input Sizes</h4>
            <div class="button-grid">
              <text-input 
                label="Küçük Input" 
                placeholder="Küçük boyut"
                size="small"
              ></text-input>
              
              <text-input 
                label="Orta Input" 
                placeholder="Orta boyut"
                size="medium"
              ></text-input>
              
              <text-input 
                label="Büyük Input" 
                placeholder="Büyük boyut"
                size="large"
              ></text-input>
            </div>
          </div>
          
          <div class="button-example">
            <h4>Input Variants</h4>
            <div class="button-grid">
              <text-input 
                label="Default Input" 
                placeholder="Varsayılan stil"
                variant="default"
              ></text-input>
              
              <text-input 
                label="Outlined Input" 
                placeholder="Çerçeveli stil"
                variant="outlined"
              ></text-input>
              
              <text-input 
                label="Filled Input" 
                placeholder="Dolu stil"
                variant="filled"
              ></text-input>
            </div>
          </div>
          
          <div class="button-example">
            <h4>Input with Icons</h4>
            <div class="button-grid">
              <text-input 
                label="Arama" 
                placeholder="Arama yapın..."
                icon="search"
                icon-position="left"
              ></text-input>
              
              <text-input 
                label="E-posta" 
                placeholder="E-posta adresiniz"
                type="email"
                icon="email"
                icon-position="left"
              ></text-input>
              
              <phone-input 
                label="Telefon" 
                placeholder="Telefon numarası"
                helper-text="+(90) 5XX XXX XX XX formatında girin"
              ></phone-input>
            </div>
          </div>
          
          <div class="button-example">
            <h4>Input States</h4>
            <div class="button-grid">
              <text-input 
                label="Normal Input" 
                placeholder="Normal durum"
              ></text-input>
              
              <text-input 
                label="Disabled Input" 
                placeholder="Devre dışı"
                disabled
              ></text-input>
              
              <text-input 
                label="Readonly Input" 
                value="Salt okunur değer"
                readonly
              ></text-input>
            </div>
          </div>
          
          <div class="button-example">
            <h4>Input with Validation</h4>
            <div class="button-grid">
              <text-input 
                label="E-posta" 
                placeholder="E-posta adresiniz"
                type="email"
                required
                helper-text="Geçerli bir e-posta adresi girin"
              ></text-input>
              
              <text-input 
                label="Şifre" 
                placeholder="Şifrenizi girin"
                type="password"
                required
                min-length="8"
                helper-text="En az 8 karakter olmalı"
              ></text-input>
              
              <text-input 
                label="Kullanıcı Adı" 
                placeholder="Kullanıcı adınız"
                max-length="20"
                helper-text="Maksimum 20 karakter"
              ></text-input>
            </div>
          </div>
          
          <div class="button-example">
            <h4>Phone Input Examples</h4>
            <div class="button-grid">
              <phone-input 
                label="Cep Telefonu" 
                required
                helper-text="Mobil numara girin"
              ></phone-input>
              
              <phone-input 
                label="İş Telefonu" 
                variant="outlined"
                helper-text="İş numarası girin"
              ></phone-input>
              
              <phone-input 
                label="Ev Telefonu" 
                variant="filled"
                helper-text="Ev numarası girin"
              ></phone-input>
            </div>
          </div>
          
          <div class="button-example">
            <h4>Date Input Examples</h4>
            <div class="button-grid">
              <date-input 
                label="İşe Başlama Tarihi" 
                placeholder="GG/AA/YYYY"
                required
                helper-text="İşe başlama tarihini seçin"
              ></date-input>
              
              <date-input 
                label="Doğum Tarihi" 
                placeholder="GG/AA/YYYY"
                variant="outlined"
                max-date="2024-12-31"
                helper-text="Doğum tarihini seçin"
              ></date-input>
              
              <date-input 
                label="Son Kullanma Tarihi" 
                placeholder="GG/AA/YYYY"
                variant="filled"
                min-date="2024-01-01"
                helper-text="Son kullanma tarihini seçin"
              ></date-input>
            </div>
          </div>
          
          <div class="button-example">
            <h4>Select Input Examples</h4>
            <div class="button-grid">
              <select-input 
                label="Pozisyon" 
                placeholder="Pozisyon seçin"
                .options="${[
                  { value: 'junior', label: 'Junior' },
                  { value: 'medior', label: 'Medior' },
                  { value: 'senior', label: 'Senior' }
                ]}"
                required
                helper-text="Çalışan pozisyonunu seçin"
              ></select-input>
              
              <select-input 
                label="Departman" 
                placeholder="Departman seçin"
                .options="${[
                  { value: 'analytics', label: 'Analytics' },
                  { value: 'tech', label: 'Tech' },
                  { value: 'hr', label: 'İnsan Kaynakları' },
                  { value: 'finance', label: 'Finans' },
                  { value: 'marketing', label: 'Pazarlama' }
                ]}"
                variant="outlined"
                helper-text="Çalışan departmanını seçin"
              ></select-input>
              
              <select-input 
                label="Şehir" 
                placeholder="Şehir seçin"
                .options="${[
                  { value: 'istanbul', label: 'İstanbul' },
                  { value: 'ankara', label: 'Ankara' },
                  { value: 'izmir', label: 'İzmir' },
                  { value: 'bursa', label: 'Bursa' },
                  { value: 'antalya', label: 'Antalya' },
                  { value: 'adana', label: 'Adana' },
                  { value: 'konya', label: 'Konya' },
                  { value: 'gaziantep', label: 'Gaziantep' }
                ]}"
                variant="filled"
                helper-text="Çalışan şehrini seçin"
              ></select-input>
            </div>
          </div>
          
          <div class="button-example">
            <h4>Input with Error</h4>
            <div class="button-grid">
              <text-input 
                label="Hatalı Input" 
                placeholder="Bu input hatalı"
                error="Bu alan zorunludur"
              ></text-input>
              
              <text-input 
                label="Geçersiz E-posta" 
                placeholder="E-posta adresiniz"
                type="email"
                error="Geçerli bir e-posta adresi girin"
              ></text-input>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('test-ui-page', TestUIPage);