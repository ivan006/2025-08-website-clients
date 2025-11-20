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
            path: '/artists',
            name: '/artists',
            component: () => import('src/controllers/ArtistsPageComp.vue'),
            meta: {
              breadcrumbName: '',
              breadcrumbParentName: '',
              requiresAuth: false,
            },
          },
          {
            path: '/artists/:rId/:rName',
            name: '/artists/:rId/:rName',
            component: () => import('src/controllers/ArtworkComp.vue'),
            meta: {
              breadcrumbName: ':rId',
              breadcrumbParentName: '/artworks',
              requiresAuth: false,
            },
          },
          {
            path: '/artworks',
            name: '/artworks',
            component: () => import('src/controllers/ArtworksPageComp.vue'),
            meta: {
              breadcrumbName: 'Artworks',
              breadcrumbParentName: '',
              requiresAuth: false,
            },
          },
          {
            path: '/artworks/:rId/:rName',
            name: '/artworks/:rId/:rName',
            // path: '/home/:rId',
            // name: '/home/:rId',
            component: () => import('src/controllers/ArtworkComp.vue'),
            meta: {
              breadcrumbName: ':rId',
              breadcrumbParentName: '/artworks',
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
