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
                <h1 class="text-center text-h3">
                  {{item.fields?.['Title']}}
                </h1>
              </div>
              <div class="lt-md">
                <h1 class="text-center text-h4">
                  {{item.fields?.['Title']}}
                </h1>
              </div>


              <div class="gt-sm">
                <h2 class="text-center text-h1 text-bold">
                  {{item.fields?.['Tagline']}}
                </h2>
              </div>
              <div class="lt-md">
                <h2 class="text-center text-h2 text-bold">
                  {{item.fields?.['Tagline']}}
                </h2>
              </div>

              <div class="text-center">

                <q-btn
                  size="lg"
                  class="text-black"
                  color="white"
                  :href="item.fields?.['Hero CTA URL']"
                >
                  {{item.fields?.['Hero CTA Text']}}
                </q-btn>
              </div>
              <!--<pre>{{item}}</pre>-->
            </div>
          </div>
        </div>
      </div>

      <div class=" bg-black" style="padding-top: 100px; padding-bottom: 100px;">
        <div
          class="container-md "
        >

          <div class="row">

            <div class="col-xl-6 col-md-6 col-sm-12 col-xs-12">

              <h1 class="text-center text-h3 text-bold">
                About Us
              </h1>

            </div>
            <div class="col-xl-6 col-md-6 col-sm-12 col-xs-12 q-px-xl">
              <div class=" text-h5 ">

                {{item.fields?.['About Us Text']}}
              </div>

            </div>
          </div>
        </div>
      </div>

      <div class="q-py-xl">

        <div
          class="container-md"
        >
          <div class="row q-col-gutter-md">


            <!--<div class="col-xl-1 col-md-1 col-sm-12 col-xs-12">-->


            <!--</div>-->

            <div class="col-xl-10 col-md-10 col-sm-12 col-xs-12 offset-md-1 q-px-xl">


              <div class="gt-sm">
                <h3 class="text-center text-h2 text-bold">
                  {{item.fields?.['List Section Title']}}
                </h3>
              </div>
              <div class="lt-md">
                <h3 class="text-center text-h3 text-bold">
                  {{item.fields?.['List Section Title']}}
                </h3>
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
      <!--Site_Site_Menu_Items-->

      <!--Home_Page-->

      <!--Home_Page_Items-->

      <!--Gas_Prices_Page-->

      <!--Gas_Prices_Page_Prices-->

      <!--Pool_Products_Page-->

      <!--Pool_Products_Page_Products-->

      <div class=" bg-black" style="padding-top: 100px; padding-bottom: 100px;">
        <div
          class="container-md "
        >

          <Home_Page_Items_Controller />
        </div>
      </div>

      <div class=" bg-white text-black">
        <div class="row">

          <div
            class="col-xl-6 col-md-6 col-sm-12 col-xs-12"
          >

            <!--:style="this.item.fields?.['Contact Image']?.[0]?.url ? `background-image: url(https://capetownlists.co.za/?url=${this.item.fields?.['Contact Image']?.[0]?.url});` : ``"-->
            <!--<div style="height: 500px;">-->

            <!--</div>-->

            <img
              :src="this.item.fields?.['Contact Image']?.[0]?.url ? `https://capetownlists.co.za/?url=${this.item.fields?.['Contact Image']?.[0]?.url}` : ''"
              style="width: 100%; display: block;"
            >

          </div>
          <div class="col-xl-6 col-md-6 col-sm-12 col-xs-12  " >
            <div class="row full-height items-center q-py-lg q-px-xl ">

              <div class=""  id="contact">



                <h2 class="text-h3 text-bold ">

                  {{item.fields?.['Contact Title']}}
                </h2>

                <div class=" text-h5 q-pb-xl">

                  {{item.fields?.['Contact Email Address']}}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </template>
    <!--<HomeSEOController />-->


  </div>
</template>

<script>
import Home_Page from "src/models/orm-api/Home_Page";
import { createMetaMixin } from 'quasar'
import HomeSEOController from "src/controllers/HomeSEOController.vue";
import Home_Page_Items_Controller from "src/controllers/Home_Page_Items_Controller.vue";
import {buildSeoConfig} from "src/utils/seo";




export default {
  name: "HomeController.vue",
  components: {Home_Page_Items_Controller},
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
      return 'recoIS6KWZ2aqcBJT'
    },
    superTableModel() {
      return Home_Page
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




    if (window.location.hash) {
      const hash = window.location.hash; // keep the full hash intact

      // Test if hash is safe to use in querySelector
      try {
        document.querySelector(hash); // test if selector is valid
      } catch (e) {
        console.warn(`Invalid selector: ${hash} - skipping scroll`);
        return; // skip scrolling
      }

      const scrollToHash = () => {
        const el = document.querySelector(hash); // use raw hash

        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY
          window.scrollTo({
            top: top,
            behavior: 'smooth'
          })
        } else {
          setTimeout(scrollToHash, 200)
        }
      }

      scrollToHash()
    }
  }
}
</script>

<style scoped>

</style>
