// Store import'u lazy loading ile yapılacak

let translations = {};

/**
 * Dil dosyalarını yükler
 */
export async function loadTranslations(language = 'tr') {
  try {
    const response = await fetch(`/src/locales/${language}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${language} translations`);
    }
    translations = await response.json();
    return translations;
  } catch (error) {
    console.error('Translation loading error:', error);
    // Fallback olarak Türkçe yükle
    if (language !== 'tr') {
      return loadTranslations('tr');
    }
    return {};
  }
}

/**
 * Çeviri anahtarını çözümler (nested key support)
 * @param {string} key - Çeviri anahtarı (örn: "common.save" veya "employeeList.title")
 * @param {object} params - Değiştirilecek parametreler
 * @returns {string} Çevrilmiş metin
 */
export function t(key, params = {}) {
  const keys = key.split('.');
  let value = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key; // Anahtarı geri döndür
    }
  }
  
  if (typeof value !== 'string') {
    console.warn(`Translation value is not a string: ${key}`);
    return key;
  }
  
  // Parametreleri değiştir
  return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
    return params[paramKey] || match;
  });
}

/**
 * Mevcut dili döndürür
 */
export async function getCurrentLanguage() {
  const { useUIStore } = await import('../store/index.js');
  return useUIStore.getState().language || 'tr';
}

/**
 * Dil değiştirir ve çevirileri yeniden yükler
 */
export async function changeLanguage(language) {
  const { useUIStore } = await import('../store/index.js');
  const uiStore = useUIStore.getState();
  uiStore.setLanguage(language);
  await loadTranslations(language);
  
  // Tüm componentleri yeniden render etmek için custom event gönder
  document.dispatchEvent(new CustomEvent('language-changed', {
    detail: { language }
  }));
}

/**
 * HTML lang attribute'unu günceller
 */
export function updateDocumentLanguage(language) {
  document.documentElement.lang = language;
}

/**
 * Sayfa yüklendiğinde dil ayarlarını başlatır
 */
export async function initializeI18n() {
  // HTML'den dil ayarını oku
  const htmlLang = document.documentElement.lang || 'tr';
  const validLanguages = ['tr', 'en'];
  const language = validLanguages.includes(htmlLang) ? htmlLang : 'tr';
  
  // Çevirileri yükle
  await loadTranslations(language);
  
  // HTML lang attribute'unu güncelle
  updateDocumentLanguage(language);
  
  return language;
}

/**
 * LitElement component'leri için reactive property oluşturur
 */
export function createI18nProperty() {
  return {
    type: String,
    attribute: false,
    state: true
  };
}

/**
 * LitElement component'leri için dil değişikliği listener'ı ekler
 */
export function addLanguageChangeListener(component) {
  const handleLanguageChange = (event) => {
    // Navigation component için özel güncelleme
    if (component._updateLanguageFromStore) {
      component._updateLanguageFromStore();
    }
    component.requestUpdate();
  };
  
  document.addEventListener('language-changed', handleLanguageChange);
  
  // Component destroy edildiğinde listener'ı kaldır
  const originalDisconnectedCallback = component.disconnectedCallback;
  component.disconnectedCallback = function() {
    document.removeEventListener('language-changed', handleLanguageChange);
    if (originalDisconnectedCallback) {
      originalDisconnectedCallback.call(this);
    }
  };
}
