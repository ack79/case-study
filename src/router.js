import { Router } from '@vaadin/router';
import './pages/home.js';
import './pages/test-ui.js';
import './pages/not-found.js';

const routes = [
  {
    path: '/',
    component: 'home-page'
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

export function initRouter(outlet) {
  console.log('Router outlet:', outlet);
  console.log('Routes:', routes);
  
  const router = new Router(outlet);
  router.setRoutes(routes);
  
  return router;
}