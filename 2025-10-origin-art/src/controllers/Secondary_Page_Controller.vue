<template>
  <div
  >
    <div v-show="loading || childLoading">
      <div class="text-center q-pa-xl">Loading...</div>
    </div>
    <div v-show="!(loading || childLoading)">

      
      

    
      
      <Secondary_Page_Items_Controller :parent="this.item" @loaded="childLoading=false" />


    </div>



  </div>
</template>

<script>
import ArtworksPage from "src/models/orm-api/ArtworksPage";
import Secondary_Page_Items_Controller from "src/controllers/Secondary_Page_Items_Controller.vue";

export default {
  name: "Secondary_Page_Controller",
  components: {
    Secondary_Page_Items_Controller
  },
  data(){
    return {
      loading: true,
      childLoading: true,
      item: {},
    }
  },
  computed: {

    id() {
      // return this.$route.params.rId
      return 'recHpBSy9dEXXwQDF'
    },
    superTableModel() {
      return ArtworksPage
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
}
</script>

<style scoped>

</style>
