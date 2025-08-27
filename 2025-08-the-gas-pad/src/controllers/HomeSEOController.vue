<template>
  <div></div>
</template>

<script>
// import MenuItems from 'src/controllers/MenuItems.vue';
import Site_Menu_Items from "src/models/orm-api/Site_Menu_Items";
import Site from "src/models/orm-api/Site";
import {createMetaMixin} from "quasar";
import { buildSeoConfig } from 'src/utils/seo';

export default {
  name: 'HomeSEOController',
  mixins: [
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
      return Site
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
