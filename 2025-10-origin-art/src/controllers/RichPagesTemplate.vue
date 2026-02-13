<template>
  <div>
    <div v-show="loading || childLoading">
      <div class="text-center q-pa-xl">Loading...</div>
    </div>
    <div v-show="!(loading || childLoading)">
      <RichPageSectionsTemplate
        :parent="this.item"
        @loaded="childLoading = false"
      />
    </div>
  </div>
</template>

<script>
import RichPageModel from "src/models/orm-api/RichPageModel";
import RichPageSectionsTemplate from "src/controllers/RichPageSectionsTemplate.vue";

export default {
  name: "RichPagesTemplate",
  components: {
    RichPageSectionsTemplate,
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
      // return this.$route.params.rId
      return "recHpBSy9dEXXwQDF";
    },
    superTableModel() {
      return RichPageModel;
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
