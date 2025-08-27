<template>
  <div></div>
</template>

<script>
// import MenuItems from 'src/controllers/MenuItems.vue';
import Menu_Items from "src/models/orm-api/Menu_Items";
import Footer_Singleton from "src/models/orm-api/Footer_Singleton";
import {createMetaMixin} from "quasar";

export default {
  name: 'HomeSEOController',
  mixins: [
    createMetaMixin(function () {

      const origin = window.location.origin

      const sameAsLinks = [
        this.item.fields?.['Facebook Link'],
        this.item.fields?.['Instagram Link']
      ].filter(Boolean) // Remove null, undefined, and empty strings
      const org = import.meta.env.VITE_API_SITE_TITLE
      return {
        script: {
          structuredData: {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": org,
              "url": origin,
              "logo": `${origin}/android-chrome-192x192.png`,
              ...(sameAsLinks.length > 0 && { sameAs: sameAsLinks }) // Add only if links exist
            })
          }
        }
      }
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
      return 'recohXZhMAthQh64w'
    },
    superTableModel() {
      return Footer_Singleton
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
