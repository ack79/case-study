import { createStore } from 'zustand/vanilla';

// Employee data structure
const generateDefaultEmployees = () => {
  const departments = ['Analytics', 'Tech'];
  const positions = ['Junior', 'Medior', 'Senior'];
  const firstNames = [
    'Ahmet', 'Mehmet', 'Ali', 'Ayşe', 'Fatma', 'Zeynep', 'Mustafa', 'Hasan', 
    'Hüseyin', 'İbrahim', 'Emine', 'Hatice', 'Elif', 'Meryem', 'Yusuf', 'Ömer',
    'Osman', 'Murat', 'Kemal', 'Cemal', 'Selim', 'Burak', 'Can', 'Deniz',
    'Ege', 'Fırat', 'Gökhan', 'Hakan', 'İlker', 'Jale', 'Kaan', 'Levent',
    'Mert', 'Nur', 'Onur', 'Pınar', 'Rıza', 'Selin', 'Tolga', 'Uğur',
    'Veli', 'Yasin', 'Zehra', 'Arda', 'Berk', 'Ceren', 'Derya'
  ];
  const lastNames = [
    'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Yıldırım', 'Özkan',
    'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Erdoğan',
    'Koç', 'Kurt', 'Özkan', 'Şen', 'Erkan', 'Güneş', 'Tekin', 'Yalçın',
    'Sarı', 'Korkmaz', 'Polat', 'Özer', 'Şahin', 'Keskin', 'Bilgin', 'Uçar',
    'Aktaş', 'Özkan', 'Güler', 'Yavuz', 'Kara', 'Özkan', 'Kaya', 'Demir',
    'Yılmaz', 'Çelik', 'Şahin', 'Yıldız', 'Kurt', 'Arslan', 'Doğan'
  ];

  const employees = [];
  
  for (let i = 0; i < 50; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    
    // Generate realistic dates
    const employmentDate = new Date();
    employmentDate.setDate(employmentDate.getDate() - Math.floor(Math.random() * 1000));
    
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - (25 + Math.floor(Math.random() * 35)));
    birthDate.setDate(Math.floor(Math.random() * 28) + 1);
    birthDate.setMonth(Math.floor(Math.random() * 12));
    
    // Generate phone number
    const phonePrefix = '+(90) 5';
    const phoneSuffix = Math.floor(Math.random() * 90000000) + 10000000;
    const phone = `${phonePrefix}${phoneSuffix.toString().slice(0, 2)} ${phoneSuffix.toString().slice(2, 5)} ${phoneSuffix.toString().slice(5, 7)} ${phoneSuffix.toString().slice(7, 9)}`;
    
    // Generate email
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@ing.com`;
    
    employees.push({
      id: `emp_${i + 1}`,
      firstName,
      lastName,
      dateOfEmployment: employmentDate.toISOString().split('T')[0],
      dateOfBirth: birthDate.toISOString().split('T')[0],
      phone,
      email,
      department,
      position,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  return employees;
};

export const useEmployeeStore = createStore(
  (set, get) => ({
      // State
      employees: generateDefaultEmployees(),
      filteredEmployees: [],
      selectedEmployees: [],
      viewMode: 'table', // 'table' or 'list'
      searchTerm: '',
      filters: {
        department: '',
        position: '',
        dateRange: {
          start: '',
          end: ''
        }
      },
      sortConfig: {
        field: 'firstName',
        direction: 'asc'
      },
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0
      },
      loading: false,
      error: null,

      // Actions
      // CRUD Operations
      addEmployee: (employee) => {
        const newEmployee = {
          ...employee,
          id: `emp_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set((state) => ({
          employees: [...state.employees, newEmployee],
          error: null
        }));
        
        get().updateFilteredEmployees();
      },

      updateEmployee: (id, updates) => {
        set((state) => ({
          employees: state.employees.map(emp => 
            emp.id === id 
              ? { ...emp, ...updates, updatedAt: new Date().toISOString() }
              : emp
          ),
          error: null
        }));
        
        get().updateFilteredEmployees();
      },

      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter(emp => emp.id !== id),
          selectedEmployees: state.selectedEmployees.filter(selectedId => selectedId !== id),
          error: null
        }));
        
        get().updateFilteredEmployees();
      },

      deleteMultipleEmployees: (ids) => {
        set((state) => ({
          employees: state.employees.filter(emp => !ids.includes(emp.id)),
          selectedEmployees: state.selectedEmployees.filter(selectedId => !ids.includes(selectedId)),
          error: null
        }));
        
        get().updateFilteredEmployees();
      },

      // Search and Filter
      setSearchTerm: (term) => {
        set({ searchTerm: term, pagination: { ...get().pagination, currentPage: 1 } });
        get().updateFilteredEmployees();
      },

      setFilter: (filterType, value) => {
        set((state) => ({
          filters: { ...state.filters, [filterType]: value },
          pagination: { ...state.pagination, currentPage: 1 }
        }));
        get().updateFilteredEmployees();
      },

      clearFilters: () => {
        set({
          searchTerm: '',
          filters: {
            department: '',
            position: '',
            dateRange: { start: '', end: '' }
          },
          pagination: { ...get().pagination, currentPage: 1 }
        });
        get().updateFilteredEmployees();
      },

      // Sorting
      setSortConfig: (field) => {
        const currentSort = get().sortConfig;
        const direction = currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc';
        
        set({ sortConfig: { field, direction } });
        get().updateFilteredEmployees();
      },

      // Pagination
      setCurrentPage: (page) => {
        set({ pagination: { ...get().pagination, currentPage: page } });
      },

      setItemsPerPage: (itemsPerPage) => {
        set({ 
          pagination: { 
            ...get().pagination, 
            itemsPerPage, 
            currentPage: 1 
          } 
        });
        get().updateFilteredEmployees();
      },

      // View Mode
      setViewMode: (mode) => {
        set({ viewMode: mode });
      },

      // Selection
      toggleEmployeeSelection: (id) => {
        set((state) => ({
          selectedEmployees: state.selectedEmployees.includes(id)
            ? state.selectedEmployees.filter(selectedId => selectedId !== id)
            : [...state.selectedEmployees, id]
        }));
      },

      selectAllEmployees: () => {
        const currentEmployees = get().getCurrentPageEmployees();
        set({ selectedEmployees: currentEmployees.map(emp => emp.id) });
      },

      clearSelection: () => {
        set({ selectedEmployees: [] });
      },

      // Helper Functions
      updateFilteredEmployees: () => {
        const { employees, searchTerm, filters, sortConfig } = get();
        
        let filtered = [...employees];

        // Search
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(emp => 
            emp.firstName.toLowerCase().includes(term) ||
            emp.lastName.toLowerCase().includes(term) ||
            emp.email.toLowerCase().includes(term) ||
            emp.phone.includes(term) ||
            emp.department.toLowerCase().includes(term) ||
            emp.position.toLowerCase().includes(term)
          );
        }

        // Filters
        if (filters.department) {
          filtered = filtered.filter(emp => emp.department === filters.department);
        }

        if (filters.position) {
          filtered = filtered.filter(emp => emp.position === filters.position);
        }

        if (filters.dateRange.start) {
          filtered = filtered.filter(emp => emp.dateOfEmployment >= filters.dateRange.start);
        }

        if (filters.dateRange.end) {
          filtered = filtered.filter(emp => emp.dateOfEmployment <= filters.dateRange.end);
        }

        // Sorting
        filtered.sort((a, b) => {
          const aValue = a[sortConfig.field];
          const bValue = b[sortConfig.field];
          
          if (sortConfig.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });

        // Update pagination
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / get().pagination.itemsPerPage);
        
        set({
          filteredEmployees: filtered,
          pagination: {
            ...get().pagination,
            totalItems,
            totalPages
          }
        });
      },

      getCurrentPageEmployees: () => {
        const { filteredEmployees, pagination } = get();
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
        const endIndex = startIndex + pagination.itemsPerPage;
        return filteredEmployees.slice(startIndex, endIndex);
      },

      // Loading and Error
      setLoading: (loading) => {
        set({ loading });
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      }
    })
  );
