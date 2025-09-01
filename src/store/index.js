// Export all stores
export { useEmployeeStore } from './employeeStore.js';
export { useUIStore } from './uiStore.js';

// Store initialization
export const initializeStores = () => {
  // Initialize UI store with current language
  const uiStore = useUIStore.getState();
  
  // Set initial language from HTML lang attribute
  const htmlLang = document.documentElement.lang || 'tr';
  if (htmlLang !== uiStore.language) {
    uiStore.setLanguage(htmlLang);
  }
  
  // Initialize employee store
  const employeeStore = useEmployeeStore.getState();
  
  // Update filtered employees on initialization
  employeeStore.updateFilteredEmployees();
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
