<template>
  <div
    :style="this.item.fields?.['Image']?.[0]?.url ? `background-image: url(https://capetownlists.co.za/?url=${this.item.fields?.['Image']?.[0]?.url});` : ``"
    style="
    min-height: 100vh;
    background-color: rgb(70,70,70);
    background-position: center;
    background-size: cover;
    background-attachment: fixed;

    background-color: rgba(0,0,0,.5);
    background-blend-mode: darken;
    "
    class="ScaledParent"
  >
    <div v-show="childLoading">
      <div class="text-center q-pa-xl">Loading...</div>
    </div>
    <div v-show="!childLoading">

      <div class="q-py-xl">

        <div
          class="container-md text-white"
        >
          
          <div class="row q-col-gutter-md justify-center">
        
            <div class="col-xl-8 col-md-8 col-12 ">
              
              <div class="gt-md q-py-xl"></div>
              
              <h1 class="text-center r-font-h2 text-bold">
                <span class="text-weight-thin font-1ry text-uppercase" style="letter-spacing: 15px;">
                  {{item.fields?.['Title']}}
                </span>
              </h1>


              <h2 class="text-center r-font-h4" >
                <span class="text-weight-light font-2ry text-uppercase" style="letter-spacing: 15px;">
                {{item.fields?.['Subtitle']}}
                </span>
              </h2>
              
              <div class="gt-md q-py-xl"></div>
            </div>
          </div>
        </div>
      </div>

      <div class=" bg-2ry-color q-py-xl" >
        <div
          class="container-md "
        >

          <Dry_Items_Controller :parent="this.item" @loaded="childLoading=false" />
        </div>
      </div>


    </div>



  </div>
</template>

<script>
import Dry from "src/models/orm-api/Dry";
import Dry_Items_Controller from "src/controllers/Dry_Items_Controller.vue";

export default {
  name: "Dry_Controller",
  components: {
    Dry_Items_Controller
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
      return 'recZ0Py4gN0SjDJYj'
    },
    superTableModel() {
      return Dry
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
