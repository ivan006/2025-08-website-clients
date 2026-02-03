<template>
  <div>
    <div v-show="loading || childLoading">
      <div class="text-center q-pa-xl">Loading...</div>
    </div>
    <div v-show="!(loading || childLoading)">
      <ArtworksComp :parent="this.item" @loaded="childLoading = false" />
    </div>
  </div>
</template>

<script>
import Home_Page_Items from "src/models/orm-api/Home_Page_Items";
import ArtworksComp from "src/controllers/ArtworksComp.vue";

export default {
  name: "Tertiary_Page_Controller",
  components: {
    ArtworksComp,
  },
  data() {
    return {
      loading: true,
      childLoading: true,
      item: {},
    };
  },
  computed: {
    id() {
      return "recx4SIMoh1gfoasb";
    },
    superTableModel() {
      return Home_Page_Items;
    },
  },
  methods: {
    fetchData() {
      this.loading = true;
      this.superTableModel
        .FetchById(this.id)
        .then((response) => {
          this.item = response.response.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped></style>
