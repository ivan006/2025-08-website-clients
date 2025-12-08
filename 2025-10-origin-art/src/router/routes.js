const routes = [
  {
    path: '/',
    component: () => import('src/controllers/EmptyLayout.vue'),
    meta: { requiresAuth: false },
    children: [
      {
        path: '/sitemap-artworks',
        name: '/sitemap-artworks',
        component: () => import('src/controllers/SitemapArtworks.vue'),
        meta: {
          breadcrumbName: 'Home',
          breadcrumbParentName: '',
          requiresAuth: false,
        },
      },
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
            path: '/home-old',
            name: '/home-old',
            component: () => import('src/controllers/HomeOldComp.vue'),
            meta: {
              breadcrumbName: 'Home',
              breadcrumbParentName: '',
              requiresAuth: false,
            },
          },
          {
            path: '/home-old-2',
            name: '/home-old-2',
            component: () => import('src/controllers/HomeOld2Comp.vue'),
            meta: {
              breadcrumbName: 'Home',
              breadcrumbParentName: '',
              requiresAuth: false,
            },
          },
          {
            path: '/artwork-old',
            name: '/artwork-old',
            component: () => import('src/controllers/Secondary_Page_Controller.vue'),
            meta: {
              breadcrumbName: 'Gas Prices',
              breadcrumbParentName: '',
              requiresAuth: false,
            },
          },
          {
            path: '/all-artworks/:medium/:priceRange',
            name: '/all-artworks/:medium/:priceRange',
            component: () => import('src/controllers/ArtworksPageComp.vue'),
            meta: {
              breadcrumbName: 'Artworks',
              breadcrumbParentName: '',
              requiresAuth: false,
            },
          },
          // {
          //   path: '/artworks',
          //   name: '/artworks',
          //   component: () => import('src/controllers/ArtworksPageComp.vue'),
          //   meta: {
          //     breadcrumbName: 'Artworks',
          //     breadcrumbParentName: '',
          //     requiresAuth: false,
          //   },
          // },
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
            path: '/all-artists/:artistType/:artistLevel',
            name: '/all-artists/:artistType/:artistLevel',
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
            component: () => import('src/controllers/ArtistComp.vue'),
            meta: {
              breadcrumbName: ':rId',
              breadcrumbParentName: '/artists',
              requiresAuth: false,
            },
          },
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
