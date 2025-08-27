<template>
  <div>
    <template v-if="loading">
      <div class="text-center q-pa-xl">Loading...</div>
    </template>
    <template v-else>

      <div class="q-py-xl">

        <div
          class="container-md"
        >
          <div class="row q-col-gutter-md">


            <!--<div class="col-xl-1 col-md-1 col-sm-12 col-xs-12">-->


            <!--</div>-->

            <div class="col-xl-10 col-md-10 col-sm-12 col-xs-12 offset-md-1 q-px-xl">


              <div class="gt-sm">
                <h1 class="text-center text-h1 text-bold">
                  {{item.fields?.['Title']}}
                </h1>
              </div>
              <div class="lt-md">
                <h1 class="text-center text-h2 text-bold">
                  {{item.fields?.['Title']}}
                </h1>
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

      <div class=" bg-black" style="padding-top: 100px; padding-bottom: 100px;">
        <div
          class="container-md "
        >

          <Pool_Products_Page_Products_Controller />
        </div>
      </div>


      <div class="q-py-xl">

        <div
          class="container-md"
        >
          <div class="row q-col-gutter-md">


            <!--<div class="col-xl-1 col-md-1 col-sm-12 col-xs-12">-->


            <!--</div>-->

            <div class="col-xl-8 col-md-8 col-sm-12 col-xs-12 offset-md-2 q-px-xl">


              <h2 class="text-center text-h3 text-bold">
                {{item.fields?.['Tagline']}}
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
import Pool_Products_Page from "src/models/orm-api/Pool_Products_Page";
import { createMetaMixin } from 'quasar'
import Pool_Products_Page_Products_Controller from "src/controllers/Pool_Products_Page_Products_Controller.vue";
import {buildSeoConfig} from "src/utils/seo";

export default {
  name: "Pool_Products_Page_Controller",
  components: {
    Pool_Products_Page_Products_Controller
  },

  mixins: [
    createMetaMixin(function () {
      const url = window.location.origin + (this.$route?.fullPath || '/');
      const siteName = import.meta.env.VITE_API_SITE_TITLE;

      return buildSeoConfig({
        title: this.item.fields?.['Title'] || siteName,
        description: this.item.fields?.['Tagline'] || '',
        url,
        image: this.item.fields?.['Share Image URL'] || `${window.location.origin}/og-default.jpg`,
        siteName,
        type: this.item.fields?.['SEO Type'],
      });
    })
  ],
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
      return Pool_Products_Page
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
