<template>
  <div class="q-pt-md">
    <div v-if="loading" class="text-center q-pa-xl">Loading...</div>

    <div v-else>
      <!-- <div class="container-sm">

        <div class="columnx items-center text-center q-mb-md">

          <div class="row justify-center">
            <div class="col-12 col-md-8">
            
   
              <div class="text-h4 font-1ry q-mt-md">
                {{ item.fields.Title }}
              </div> 

            </div>

          </div>
        </div>
      </div> -->

      <CollectionArtworks :parentId="id" />
      <!-- <div class="text-1ry-color">
        
      </div> -->
    </div>
  </div>
</template>

<script>
import Collections from "src/models/orm-api/Collections";
import CollectionArtworks from "src/controllers/CollectionArtworks.vue";

export default {
  name: "CollectionComp",

  components: {
    CollectionArtworks,
  },

  data() {
    return {
      loading: true,
      item: {},
      showEnquiry: false,
      dialogOpen: false,
      dialogText: "",
      dialogTitle: "",
    };
  },

  computed: {
    id() {
      return this.$route.params.rId;
    },
  },

  methods: {
    fetchData() {
      this.loading = true;
      Collections.FetchByyyyId(this.id)
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
