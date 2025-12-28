<template>
  <div
  >
    <div v-show="loading || childLoading">
      <div class="text-center q-pa-xl">Loading...</div>
    </div>
    <div v-show="!(loading || childLoading)">

      
      

    
      
      <CollectionsComp :parent="this.item" @loaded="childLoading=false" />


    </div>



  </div>
</template>

<script>
import Home_Page_Items from "src/models/orm-api/Home_Page_Items";
import CollectionsComp from "src/controllers/CollectionsComp.vue";

export default {
  name: "CollectionsPageComp",
  components: {
    CollectionsComp
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
      return 'recotIrLQvmldYRkb'
    },
    superTableModel() {
      return Home_Page_Items
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
