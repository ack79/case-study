# Employee Management App - Architecture Diagram

```mermaid
graph LR
    %% Main Flow
    A[Router] --> B[Home Page]
    A --> C[Add/Edit Page]
    
    %% Home Page Components
    B --> D[Employee List]
    B --> E[Search & Filter]
    B --> F[Navigation]
    
    %% Add/Edit Page Components
    C --> G[Form Components]
    C --> H[Modal & Toast]
    
    %% State Management
    D -.-> I[Employee Store]
    E -.-> I
    G -.-> I
    I -.-> J[LocalStorage]
    
    %% Utilities
    A -.-> K[I18n Manager]
    H -.-> L[Toast Manager]

    %% Styling
    classDef page fill:#FF620B,stroke:#333,stroke-width:2px,color:#fff
    classDef component fill:#FF7527,stroke:#333,stroke-width:2px,color:#fff
    classDef store fill:#4CAF50,stroke:#333,stroke-width:2px,color:#fff
    classDef utility fill:#2196F3,stroke:#333,stroke-width:2px,color:#fff

    class B,C page
    class D,E,F,G,H component
    class I,J store
    class K,L utility
```

## Architecture Overview

### 🏗️ **Architecture:**
- **Pages** - Home (Employee List) & Add/Edit Employee
- **Components** - Reusable UI elements (Forms, Navigation, etc.)
- **State Management** - Zustand store with LocalStorage persistence
- **Utilities** - I18n & Toast management

### 🔄 **Data Flow:**
- **Solid arrows** → Component relationships
- **Dotted arrows** → Data flow
- **Color coding** → Different layers

### ✨ **Key Features:**
- **SPA Routing** - Vaadin Router for navigation
- **State Management** - Zustand with LocalStorage persistence
- **Internationalization** - Multi-language support (TR/EN)
- **Responsive Design** - Mobile-first approach
- **Component Architecture** - Modular, reusable components

### 🎨 **Brand Colors:**
- **Primary**: #FF620B (Orange)
- **Secondary**: #FF7527 (Light Orange)
- **Success**: #4CAF50 (Green)
- **Info**: #2196F3 (Blue)
