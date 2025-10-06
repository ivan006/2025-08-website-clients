<template>
  <div
    :style="this.item.fields?.['Banner Image']?.[0]?.url ? `background-image: url(https://capetownlists.co.za/?url=${this.item.fields?.['Banner Image']?.[0]?.url});` : ``"
    style="
    min-height: 50vh;
    background-color: rgb(70,70,70);
    background-position: center;
    background-size: cover;
    background-attachment: fixed;

    background-color: rgba(0,0,0,.2);
    background-blend-mode: darken;
    "
    class="ScaledParent "
  >
    <template v-if="loading">
      <div class="text-center q-pa-xl">Loading...</div>
    </template>
    <template v-else>

      <div class="q-py-xl">

        <div
          class="container-md"
        >
          <div class="row q-col-gutter-md  text-white">


            <!--<div class="col-xl-1 col-md-1 col-sm-12 col-xs-12">-->


            <!--</div>-->

            <div class="col-xl-4 col-md-4 col-sm-12 col-xs-12">
              <div class="row">
                <div class="col-xl-12 col-md-12 col-sm-12 col-xs-12">
                  
                  <img
                  src="~assets/square.webp"
                  :style="this.item.fields?.['Image']?.[0]?.thumbnails?.large?.url ? `background-image: url(https://capetownlists.co.za/?url=${this.item.fields?.['Image']?.[0]?.thumbnails?.large?.url});` : ``"
                  style="
                    background-color: rgb(70,70,70);
                    background-position: center;
                    background-size: cover;
                    border-radius: 100%;
                    max-width: 100%;
                    "
                  />
                </div>
              </div>
            </div>
            <div class="col-xl-8 col-md-8 col-sm-12 col-xs-12  flex flex-center">
              
              <div class="q-pl-xl">
                
                <h1 class="r-r-font-h2 text-bold">
                  <span class="text-weight-thin font-1ry text-uppercase" style="letter-spacing: 15px;">
                    {{item.fields?.['Title']}}
                  </span>
                </h1>

                
                <h2 class="r-r-font-h3" >
                  <span class="text-weight-light font-2ry text-uppercase" style="letter-spacing: 15px;">
                    {{item.fields?.['Subtitle']}}
                  </span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class=" bg-2ry-color " style="padding-top: 100px; padding-bottom: 100px;">
        <div
          class="container-md "
        >

          <Tertiary_Page_Items_Controller :parent="this.item" />
        </div>
      </div> -->



    </template>



  </div>
</template>

<script>
import Dry_Items from "src/models/orm-api/Dry_Items";

export default {
  name: "Dry_Controller",
  components: {
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
      return 'recCokU8M3eLMeuH0'
    },
    superTableModel() {
      return Dry_Items
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
