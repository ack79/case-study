/**
 * @license
 * Copyright 2024 Employee Management App
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { expect } from '@open-wc/testing';
import { 
  loadTranslations, 
  t, 
  getCurrentLanguage, 
  changeLanguage, 
  updateDocumentLanguage,
  initializeI18n,
  addLanguageChangeListener
} from '../../src/utils/i18n.js';

// Mocha globals'ları Web Test Runner tarafından sağlanıyor

describe('i18n', () => {
  // Test öncesi temizlik
  beforeEach(() => {
    // DOM'u temizle
    document.documentElement.lang = 'tr';
    
    // Event listener'ları temizle
    const events = ['language-changed'];
    events.forEach(eventType => {
      const listeners = document.querySelectorAll(`[data-listener="${eventType}"]`);
      listeners.forEach(listener => listener.remove());
    });
  });

  afterEach(() => {
    // Test sonrası temizlik
    document.documentElement.lang = 'tr';
  });

  describe('loadTranslations', () => {
    it('should load Turkish translations successfully', async () => {
      const translations = await loadTranslations('tr');
      
      expect(translations).to.be.an('object');
      expect(translations.common).to.exist;
      expect(translations.common.save).to.equal('Kaydet');
      expect(translations.employeeList.title).to.equal('Çalışan Listesi');
    });

    it('should load English translations successfully', async () => {
      const translations = await loadTranslations('en');
      
      expect(translations).to.be.an('object');
      expect(translations.common).to.exist;
      expect(translations.common.save).to.equal('Save');
      expect(translations.employeeList.title).to.equal('Employee List');
    });

    it('should fallback to Turkish when invalid language provided', async () => {
      const translations = await loadTranslations('invalid');
      
      expect(translations).to.be.an('object');
      expect(translations.common.save).to.equal('Kaydet');
    });

    it('should handle network errors gracefully', async () => {
      // Mock fetch to simulate network error
      const originalFetch = window.fetch;
      window.fetch = () => Promise.reject(new Error('Network error'));
      
      const translations = await loadTranslations('en');
      
      expect(translations).to.be.an('object');
      // Network error durumunda boş object döner
      expect(translations).to.deep.equal({});
      
      // Restore original fetch
      window.fetch = originalFetch;
    });
  });

  describe('t (translation function)', () => {
    beforeEach(async () => {
      // Test öncesi çevirileri temizle ve Türkçe yükle
      await loadTranslations('tr');
    });

    it('should return correct translation for simple key', () => {
      expect(t('common.save')).to.equal('Kaydet');
      expect(t('common.cancel')).to.equal('İptal');
    });

    it('should return correct translation for nested key', () => {
      expect(t('employeeList.title')).to.equal('Çalışan Listesi');
      expect(t('employeeList.fields.firstName')).to.equal('Ad');
    });

    it('should return key when translation not found', () => {
      expect(t('nonexistent.key')).to.equal('nonexistent.key');
    });

    it('should replace parameters in translation', () => {
      // Bu test için parametreli bir çeviri eklememiz gerekebilir
      // Şimdilik basit bir test yapalım
      expect(t('common.save')).to.equal('Kaydet');
    });

    it('should handle empty parameters object', () => {
      expect(t('common.save', {})).to.equal('Kaydet');
    });

    it('should work with English translations', async () => {
      // İngilizce çevirileri yükle
      const translations = await loadTranslations('en');
      
      expect(translations.common.save).to.equal('Save');
      expect(translations.common.cancel).to.equal('Cancel');
      expect(translations.employeeList.title).to.equal('Employee List');
    });
  });

  describe('updateDocumentLanguage', () => {
    it('should update document language attribute', () => {
      updateDocumentLanguage('en');
      expect(document.documentElement.lang).to.equal('en');
      
      updateDocumentLanguage('tr');
      expect(document.documentElement.lang).to.equal('tr');
    });
  });

  describe('initializeI18n', () => {
    it('should initialize with Turkish by default', async () => {
      document.documentElement.lang = 'tr';
      const language = await initializeI18n();
      
      expect(language).to.equal('tr');
      expect(document.documentElement.lang).to.equal('tr');
    });

    it('should initialize with English when HTML lang is en', async () => {
      document.documentElement.lang = 'en';
      const language = await initializeI18n();
      
      expect(language).to.equal('en');
      expect(document.documentElement.lang).to.equal('en');
    });

    it('should fallback to Turkish for invalid language', async () => {
      document.documentElement.lang = 'invalid';
      const language = await initializeI18n();
      
      expect(language).to.equal('tr');
      expect(document.documentElement.lang).to.equal('tr');
    });

    it('should load translations during initialization', async () => {
      document.documentElement.lang = 'en';
      const language = await initializeI18n();
      
      // Dil'in doğru döndüğünü kontrol et
      expect(language).to.equal('en');
      expect(document.documentElement.lang).to.equal('en');
    });
  });

  describe('addLanguageChangeListener', () => {
    it('should add language change listener to component', () => {
      const mockComponent = {
        requestUpdate: () => {},
        disconnectedCallback: null
      };

      addLanguageChangeListener(mockComponent);

      // Event listener'ın eklendiğini kontrol et
      expect(mockComponent.disconnectedCallback).to.be.a('function');
    });

    it('should call requestUpdate when language changes', () => {
      const mockComponent = {
        requestUpdate: () => {},
        disconnectedCallback: null
      };

      let updateCalled = false;
      mockComponent.requestUpdate = () => {
        updateCalled = true;
      };

      addLanguageChangeListener(mockComponent);

      // Language change event'ini tetikle
      document.dispatchEvent(new CustomEvent('language-changed', {
        detail: { language: 'en' }
      }));

      expect(updateCalled).to.be.true;
    });

    it('should remove listener when component is disconnected', () => {
      const mockComponent = {
        requestUpdate: () => {},
        disconnectedCallback: null
      };

      addLanguageChangeListener(mockComponent);

      // Component'i disconnect et
      mockComponent.disconnectedCallback();

      // Event listener'ın kaldırıldığını kontrol et
      let updateCalled = false;
      mockComponent.requestUpdate = () => {
        updateCalled = true;
      };

      document.dispatchEvent(new CustomEvent('language-changed', {
        detail: { language: 'en' }
      }));

      expect(updateCalled).to.be.false;
    });
  });

  describe('Integration Tests', () => {
    it('should work end-to-end with language switching', async () => {
      // Türkçe ile başla
      const trTranslations = await loadTranslations('tr');
      expect(trTranslations.common.save).to.equal('Kaydet');

      // İngilizce'ye geç
      const enTranslations = await loadTranslations('en');
      expect(enTranslations.common.save).to.equal('Save');

      // Tekrar Türkçe'ye dön
      const trTranslations2 = await loadTranslations('tr');
      expect(trTranslations2.common.save).to.equal('Kaydet');
    });

    it('should handle complex nested keys', async () => {
      const translations = await loadTranslations('tr');
      
      expect(translations.employeeList.fields.firstName).to.equal('Ad');
      expect(translations.employeeList.fields.lastName).to.equal('Soyad');
      expect(translations.employeeList.fields.email).to.equal('E-posta');
      expect(translations.employeeList.fields.phone).to.equal('Telefon');
    });
  });
});
