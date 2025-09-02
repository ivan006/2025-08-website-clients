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
            path: '/home/:rId/:rName',
            name: '/home/:rId/:rName',
            // path: '/home/:rId',
            // name: '/home/:rId',
            component: () => import('src/controllers/Home_Page_Items_Single_Controller.vue'),
            meta: {
              breadcrumbName: ':rId',
              breadcrumbParentName: '/',
              requiresAuth: false,
            },
          },
          {
            path: '/portfolio',
            name: '/portfolio',
            component: () => import('src/controllers/Secondary_Page_Controller.vue'),
            meta: {
              breadcrumbName: 'Portfolio',
              breadcrumbParentName: '',
              requiresAuth: false,
            },
          },
          {
            path: '/pool-chem-and-equip',
            name: '/pool-chem-and-equip',
            component: () => import('src/controllers/Tertiary_Page_Controller.vue'),
            meta: {
              breadcrumbName: 'Pool Chem & Equip',
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
