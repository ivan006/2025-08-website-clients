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
                  {{item.fields?.['Hero Title']}}
                </h1>
              </div>
              <div class="lt-md">
                <h1 class="text-center text-h2 text-bold">
                  {{item.fields?.['Hero Title']}}
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

          <Services_Controller />
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
                {{item.fields?.['Description']}}
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
import Services_Page_Singleton from "src/models/orm-api/Services_Page_Singleton";
import { createMetaMixin } from 'quasar'
import Services_Controller from "src/controllers/Services_Controller.vue";

export default {
  name: "Services_Page_Singleton_Controller",
  components: {
    Services_Controller
  },

  mixins: [
    createMetaMixin(function () {
      const org = import.meta.env.VITE_API_SITE_TITLE
      const origin = window.location.origin
      const path = this.$route.fullPath
      const canonicalUrl = `${origin}${path}`

      return {
        title: this.item.fields?.['Hero Title'],
        titleTemplate: title => `${title} | ${org}`, // prepend site name
        meta: {
          description: {
            name: 'description',
            content: this.item.fields?.['Description'] || ''
          },
        },
        script: {
          structuredData: {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": this.item.fields?.['Hero Title'] || '',
              "url": canonicalUrl,
              "description": this.item.fields?.['Description'] || ``,
            })
          }
        }
      }
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
      return 'receSN4yF0BAq47iO'
    },
    superTableModel() {
      return Services_Page_Singleton
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
