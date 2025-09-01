// Export all stores
export { useEmployeeStore } from './employeeStore.js';
export { useUIStore } from './uiStore.js';

// Import stores for internal use
import { useEmployeeStore } from './employeeStore.js';
import { useUIStore } from './uiStore.js';

// Store initialization
export const initializeStores = async () => {
  // Initialize i18n first
  const { initializeI18n } = await import('../utils/i18n.js');
  const language = await initializeI18n();
  
  // Initialize UI store with current language
  const uiStoreState = useUIStore.getState();
  if (language !== uiStoreState.language) {
    uiStoreState.setLanguage(language);
  }
  
  // Initialize employee store
  const employeeStoreState = useEmployeeStore.getState();
  
  // Update filtered employees on initialization
  employeeStoreState.updateFilteredEmployees();
};

// Store utilities
export const resetAllStores = () => {
  // Reset employee store
  useEmployeeStore.setState({
    employees: useEmployeeStore.getState().employees, // Keep default data
    filteredEmployees: [],
    selectedEmployees: [],
    viewMode: 'table',
    searchTerm: '',
    filters: {
      department: '',
      position: '',
      dateRange: { start: '', end: '' }
    },
    sortConfig: { field: 'firstName', direction: 'asc' },
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0
    },
    loading: false,
    error: null
  });
  
  // Reset UI store
  useUIStore.setState({
    language: 'tr',
    sidebarOpen: false,
    notifications: [],
    modal: {
      isOpen: false,
      type: null,
      title: '',
      message: '',
      data: null
    }
  });
  
  // Reinitialize
  initializeStores();
};
