<template>
  <div></div>
</template>

<script>
// import MenuItems from 'src/controllers/MenuItems.vue';
import Menu_Items from "src/models/orm-api/Menu_Items";
import Site_Settings from "src/models/orm-api/Site_Settings";
import {createMetaMixin} from "quasar";
import { buildSeoConfig } from 'src/utils/seo';

export default {
  name: 'HomeSEOController',
  mixins: [
    createMetaMixin(function () {
      const origin = window.location.origin;

      // Pull from Airtable if present; otherwise use a site default
      const org = import.meta.env.VITE_API_SITE_TITLE || 'Your Site';
      const title = this.item?.fields?.['Title'] || org;
      const description =
        this.item?.fields?.['Tagline'] ||
        'Discover our latest menu, hours, and how to order.';
      // Prefer an Airtable-hosted image or a local default
      const shareImage =
        this.item?.fields?.['Share Image URL'] ||
        `${origin}/og-default.jpg`; // place a 1200x630 jpg here

      const url = origin + (this.$route?.fullPath || '/');

      const sameAsLinks = [
        this.item?.fields?.['Facebook Link'],
        this.item?.fields?.['Instagram Link']
      ].filter(Boolean);


      const siteName = import.meta.env.VITE_API_SITE_TITLE || 'My Site';

      return buildSeoConfig({
        title: this.item.fields?.['Title'] || siteName,
        description: this.item.fields?.['Tagline'] || '',
        url,
        image: this.item.fields?.['Share Image URL'] || `${window.location.origin}/og-default.jpg`,
        siteName,
        sameAs: sameAsLinks,
        type: 'WebPage',
      });
    })
  ],
  components: {
    // BreadcrumbsComp,
    // MenuItems
  },

  data(){
    return {
      loading: true,
      item: {},
    }
  },
  computed: {

    id() {
      // return this.$route.params.rId
      return 'reci1Y5KdKFBkz3T1'
    },
    superTableModel() {
      return Site_Settings
    },
  },
  methods: {
    fetchData() {
      this.loading = true
      this.superTableModel
        .FetchById(
          this.id,
          // this.relationships,
          [],
          { flags: {}, moreHeaders: {}, rels: [] }
        )
        .then((response) => {
          this.item = response.response.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        });
    },
  },
  mounted(){
    this.fetchData();
  }
};
</script>
