<template>
  <div
    :style="this.item.fields?.['Image']?.[0]?.url ? `background-image: url(https://capetownlists.co.za/?url=${this.item.fields?.['Image']?.[0]?.url});` : ``"
    style="
    min-height: 100vh;
    background-color: rgb(70,70,70);
    background-position: center;
    background-size: cover;
    background-attachment: fixed;

    background-color: rgba(0,0,0,.2);
    background-blend-mode: darken;
    "
    class="ScaledParent"
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

            <div class="col-xl-10 col-md-10 col-sm-12 col-xs-12 offset-md-1 q-px-xl flex flex-center " style="min-height: 500px;">


              <div>
                <div class="gt-sm">
                  <h1 class="text-center text-h1 text-bold">
                  <span class="text-weight-thin font-1ry text-uppercase" style="letter-spacing: 15px;">
                    {{item.fields?.['Title']}}
                  </span>
                  </h1>
                </div>
                <div class="lt-md">
                  <h1 class="text-center text-h2 text-bold">
                  <span class="text-weight-thin font-1ry text-uppercase" style="letter-spacing: 15px;">
                    {{item.fields?.['Title']}}
                  </span>
                  </h1>
                </div>

                <div class="gt-sm">
                  <h2 class="text-center text-h3" >
                  <span class="text-weight-light font-2ry text-uppercase" style="letter-spacing: 15px;">
                  {{item.fields?.['Subtitle']}}
                  </span>
                  </h2>
                </div>
                <div class="lt-md">
                  <h2 class="text-center text-h4 text-bold font-2ry">
                  <span class="text-weight-light font-2ry text-uppercase" style="letter-spacing: 15px;">
                  {{item.fields?.['Subtitle']}}
                  </span>
                  </h2>
                </div>
              </div>

              <!--<div class="gt-sm">-->
              <!--</div>-->
              <!--<div class="lt-md">-->
              <!--</div>-->

              <!--<pre>{{item}}</pre>-->
            </div>
          </div>
        </div>
      </div>

      <div class=" bg-3ry-color text-white" style="padding-top: 100px; padding-bottom: 100px;">
        <div
          class="container-md "
        >

          <Tertiary_Page_Items_Controller :parent="this.item" />
        </div>
      </div>


      <div class="q-py-xl">

        <div
          class="container-md"
        >
          <div class="row q-col-gutter-md text-white">


            <!--<div class="col-xl-1 col-md-1 col-sm-12 col-xs-12">-->


            <!--</div>-->

            <div class="col-xl-8 col-md-8 col-sm-12 col-xs-12 offset-md-2 q-px-xl">


              <h2 class="text-center text-h3 text-bold">
                {{item.fields?.['Subtitle']}}
              </h2>


              <div class="text-center">

                <q-btn
                  size="xl"
                  class="text-black"
                  color="white"
                  :to="item.fields?.['Button Link']"
                >
                  {{item.fields?.['Button Text']}}
                </q-btn>
              </div>
              <!--<pre>{{item}}</pre>-->
            </div>
          </div>
        </div>
      </div>
    </template>



  </div>
</template>

<script>
import Tertiary_Page from "src/models/orm-api/Tertiary_Page";
import Tertiary_Page_Items_Controller from "src/controllers/Tertiary_Page_Items_Controller.vue";

export default {
  name: "Tertiary_Page_Controller",
  components: {
    Tertiary_Page_Items_Controller
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
      return 'recmpTrAB2ygtIn9p'
    },
    superTableModel() {
      return Tertiary_Page
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
