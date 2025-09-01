import { createStore } from 'zustand/vanilla';

export const useUIStore = createStore(
  (set, get) => ({
      // State
      language: 'tr', // 'tr' or 'en'
      sidebarOpen: false,
      notifications: [],
      modal: {
        isOpen: false,
        type: null, // 'confirm', 'alert', 'form'
        title: '',
        message: '',
        data: null
      },

      // Actions
      setLanguage: (language) => {
        set({ language });
        
        // Update HTML lang attribute
        document.documentElement.lang = language;
        
        // Load translations and dispatch language change event
        import('../utils/i18n.js').then(({ loadTranslations }) => {
          return loadTranslations(language);
        }).then(() => {
          document.dispatchEvent(new CustomEvent('language-changed', {
            detail: { language }
          }));
        }).catch(error => {
          console.error('Translation loading error:', error);
        });
      },



      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      openSidebar: () => {
        set({ sidebarOpen: true });
      },

      closeSidebar: () => {
        set({ sidebarOpen: false });
      },

      // Modal actions
      openModal: (type, title, message, data = null) => {
        set({
          modal: {
            isOpen: true,
            type,
            title,
            message,
            data
          }
        });
      },

      closeModal: () => {
        set({
          modal: {
            isOpen: false,
            type: null,
            title: '',
            message: '',
            data: null
          }
        });
      },

      // Notification actions
      addNotification: (notification) => {
        const id = Date.now().toString();
        const newNotification = {
          id,
          type: 'info', // 'success', 'error', 'warning', 'info'
          title: '',
          message: '',
          duration: 5000,
          ...notification
        };

        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }));

        // Auto remove notification after duration
        setTimeout(() => {
          get().removeNotification(id);
        }, newNotification.duration);

        return id;
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(notification => notification.id !== id)
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      // Success notification helper
      showSuccess: (message, title = 'Başarılı') => {
        return get().addNotification({
          type: 'success',
          title,
          message
        });
      },

      // Error notification helper
      showError: (message, title = 'Hata') => {
        return get().addNotification({
          type: 'error',
          title,
          message
        });
      },

      // Warning notification helper
      showWarning: (message, title = 'Uyarı') => {
        return get().addNotification({
          type: 'warning',
          title,
          message
        });
      },

      // Info notification helper
      showInfo: (message, title = 'Bilgi') => {
        return get().addNotification({
          type: 'info',
          title,
          message
        });
      }
    })
  );
