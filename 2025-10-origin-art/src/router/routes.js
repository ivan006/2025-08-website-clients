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
            path: '/gas-prices',
            name: '/gas-prices',
            component: () => import('src/controllers/Secondary_Page_Controller.vue'),
            meta: {
              breadcrumbName: 'Gas Prices',
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
            path: '/firewood',
            name: '/firewood',
            component: () => import('src/controllers/ArtworksPageComp.vue'),
            meta: {
              breadcrumbName: '',
              breadcrumbParentName: '',
              requiresAuth: false,
            },
          },
          {
            path: '/firewood/:rId/:rName',
            name: '/firewood/:rId/:rName',
            // path: '/home/:rId',
            // name: '/home/:rId',
            component: () => import('src/controllers/ArtworkComp.vue'),
            meta: {
              breadcrumbName: ':rId',
              breadcrumbParentName: '/',
              requiresAuth: false,
            },
          },
          {
            path: '/contact',
            name: '/contact',
            component: () => import('src/controllers/Contact_Controller.vue'),
            meta: {
              breadcrumbName: '',
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
