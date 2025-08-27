const routes = [
  {
    path: '/',
    component: () => import('src/controllers/EmptyLayout.vue'),
    meta: { requiresAuth: false },
    children: [
      {
        path: '/',
        component: () => import('src/controllers/GlobalController.vue'),
        // redirect: to => { return '/home' },
        children: [
          {
            path: '/',
            name: '/',
            component: () => import('src/controllers/HomeController.vue'),
            meta: {
              breadcrumbName: 'Home',
              breadcrumbParentName: '',
              requiresAuth: false,
            },
          },
          {
            path: '/services',
            name: '/services',
            component: () => import('src/controllers/Services_Page_Controller.vue'),
            meta: {
              breadcrumbName: 'Services',
              breadcrumbParentName: '',
              requiresAuth: false,
            },
          },
          {
            path: '/lists/TestEntity',
            name: '/lists/TestEntity',
            component: () => import('src/controllers/lists/test-entity/TestEntityListController.vue'),
            meta: {
              breadcrumbName: 'TestEntity',
              breadcrumbParentName: '',
              requiresAuth: false,
            },
          },
          {
            path: '/lists/TestEntity/:rId/:rName',
            name: '/lists/TestEntity/:rId/:rName',
            component: () => import('src/controllers/lists/test-entity/TestEntityReadController.vue'),
            meta: {
              breadcrumbName: ':rName',
              breadcrumbParentName: '/lists/brands',
              requiresAuth: false,
            },
          }
        ],
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/controllers/ErrorNotFound.vue'),
    meta: { requiresAuth: false }
  }
];

export default routes;
