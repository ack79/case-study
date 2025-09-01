import { Router } from '@vaadin/router';
import './pages/home.js';
import './pages/add-employee.js';
import './pages/test-ui.js';
import './pages/not-found.js';
import { initializeStores } from './store/index.js';

const routes = [
  {
    path: '/',
    component: 'home-page'
  },
  {
    path: '/add-employee',
    component: 'add-employee-page'
  },
  {
    path: '/edit-employee/:id',
    component: 'add-employee-page'
  },
  {
    path: '/test-ui',
    component: 'test-ui-page'
  },
  {
    path: '/:path*',
    component: 'not-found-page'
  }
];

export async function initRouter(outlet) {
  
  // Initialize stores and i18n
  await initializeStores();
  
  const router = new Router(outlet);
  router.setRoutes(routes);
  
  return router;
}