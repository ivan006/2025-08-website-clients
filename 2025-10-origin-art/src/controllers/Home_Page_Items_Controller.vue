<template>
  <template v-if="!items.length">
    <template v-if="loading">
      <div class="text-center q-pa-md">Loading...</div>
    </template>
    <template v-else>
      <div class="text-center q-pa-md text-grey-5">None</div>
    </template>
  </template>
  <template v-else>
    <SEODataViewer :seoConfig="seoConfigMasked" :seoLdJson="seoLdJson" />
    <SitemapComp :items="sitemapItems" />
    
    <div class="row q-col-gutter-lg justify-around">
      <!--<div class="row justify-center" >-->

      <template v-for="item in items" :key="item.id">

        <!--<q-avatar>-->
        <!--  <img :src="item">-->
        <!--</q-avatar>-->
        <div class="col-xl-6 col-md-6 col-6">
          <div class="">

           
            <q-card class="q-ma-smx" style="border-radius: 10px;" flat>
              <q-card-section class="q-pa-none">
                
           
                <div>
                  <div
                  :style="{
                    height: $q.screen.lt.md ? '150px' : '220px',
                    backgroundImage: item?.['Image']?.[0]?.thumbnails?.large?.url
                      ? `url(${$apiProxyUrl}${encodeURIComponent(item['Image'][0].thumbnails.large.url)})`
                      : ''
                  }"
                  style="
                    background-position: center;
                    background-size: cover;
                    border-radius: 10px 10px 0 0 ;
                    max-width: 100%;
                    " 
                  >
                  </div>
                  <!--<img src="https://cdn.quasar.dev/img/avatar.png">-->
                </div>
                
                <div class=" q-py-sm q-px-md text-center ">

                  <!-- <div class="lt-md q-mt-lg"></div> -->

                  <h2 class="r-font-h4 font-1ry text- q-my-sm text-uppercase">
                    {{item["Title"]}}
                  </h2>

                  <p class="text-subtitle1 q-my-sm font-2ry text-weight-light">
                    {{item["Subtitle"]}}
                  </p>
                  
          
                  <q-btn
                    :to="item['SEO URL']"
                    color="grey-8"
                    size="md"
                    unelevated
                    class="q-my-sm q-px-lg"
                    style="border-radius: 100px;"
                    
                    no-caps
                  >
                    <!-- {{ item["Button Text"] }} -->
                    Learn More
                  </q-btn>

                  


                
                </div>
                
              </q-card-section>
            </q-card>

            <!--<pre>-->
            <!--  {{item}}-->
            <!--</pre>-->
          </div>
        </div>
      </template>

    </div>

  </template>


</template>

<script>
import Home_Page_Items from 'src/models/orm-api/Home_Page_Items'
import {createMetaMixin} from "quasar";
import {buildSchemaItem, buildSeoConfig} from "src/utils/seo";
import SEODataViewer from "src/controllers/SEODataViewer.vue";
import SitemapComp from 'src/controllers/SitemapComp.vue'

export default {
  name: 'HomeItemsComp',
  components: {
    SEODataViewer,
    SitemapComp
  },
  
  mixins: [
    createMetaMixin(function () {

      return this.seoConfig;

    })
  ],

  props: {
    fetchFlags: {
      type: Object,
      default: () => ({})
    },
    parent: {
      type: Object,
      default: () => ({})
    },
  },
  data(){
    return {
      activeRoute: this.$route.path,
      items: [],
      loading: false,
      loadingError: false,
      options: {
        page: 1,
        itemsPerPage: 100,
        sortBy: [],
        groupBy: [],
      },
      filterValsRef: {}
    }
  },
  computed: {
    
    sitemapItems() {
      // const start = performance.now()

      const result = this.items.map(item => {
        const slug = item['SEO URL']

        return {
          url: `${window.location.origin}${slug}`,
          lastmod: item['Last Modified']
            ? new Date(item['Last Modified']).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
        }
      })

      // const end = performance.now()

      // console.log(
      //   `[sitemapItems] ${result.length} items in ${(end - start).toFixed(2)} ms`
      // )

      return result
    },
    
    seoLdJson(){
      


      const url = window.location.origin + (this.$route?.fullPath.split('#')[0] || '/');
      const siteName = import.meta.env.VITE_API_SITE_TITLE;

      let image = import.meta.env.VITE_API_DEFAULT_IMAGE
      if (this.parent?.fields?.['Image']?.[0]?.url) {
        image = `${import.meta.env.VITE_API_PROXY_URL}/cacher/data-cache/index.php?url=${encodeURIComponent(this.parent?.fields?.['Image']?.[0]?.thumbnails?.large?.url)}`;
      }


      const schema = buildSchemaItem({
        type: this.parent.fields?.['SEO Type'],
        name: this.parent.fields?.['Title'] || siteName,
        description: this.parent.fields?.['Subtitle'] || '',
        url,
        image,
        extras: {
          telephone: this.parent.fields?.['Phone Number'] || "",
          email: this.parent.fields?.['Email Address'] || "",
          address: {
            "@type": "PostalAddress",
            streetAddress: this.parent.fields?.['Address'] || "",
            addressLocality: "Cape Town",
            addressRegion: "Western Cape",
            addressCountry: "ZA"
          },
          openingHours: this.parent.fields?.['Opening Hours'] 
            ? this.parent.fields['Opening Hours'].split('\n').map(line => line.trim())
            : []
        }
      })


      const products = this.items.map((item) => {

        const newItem = buildSchemaItem({
          type: item['SEO Type'],
          url: item['SEO URL'] ? window.location.origin + item['SEO URL'] : null,
          name: item['Title'] || '',
          description: item['Subtitle'] || '',
          image: item?.['Image']?.[0]?.url ? `${import.meta.env.VITE_API_PROXY_URL}/cacher/data-cache/index.php?url=${encodeURIComponent(item?.['Image']?.[0]?.url)}` : "",
          price: item['Price'],
          extras: {
            category: item['Category'],
          }
        });
        // console.log(newItem)

        return newItem;
      });

      // Only add itemListElement if provided
      if (products.length > 0) {
        schema.itemListElement = products;
      }

      return schema;
    },
    seoConfig(){

      const url = window.location.origin + (this.$route?.fullPath.split('#')[0] || '/');
      const siteName = import.meta.env.VITE_API_SITE_TITLE;

      let image = ""
      if (this.parent?.fields?.['Image']?.[0]?.url) {
        image = `${import.meta.env.VITE_API_PROXY_URL}/cacher/data-cache/index.php?url=${encodeURIComponent(this.parent?.fields?.['Image']?.[0]?.url)}`;
      }

     return buildSeoConfig({
        title: null,
        description: this.parent.fields?.['Subtitle'] || '',
        url,
        image: image || `${window.location.origin}/og-default.jpg`,
        siteName,
        type: this.parent.fields?.['SEO Type'],
        schema: this.seoLdJson
      });
    },
    
    seoConfigMasked(){
      const seoConfigMasked = { ...this.seoConfig }
      seoConfigMasked.script = ""
      return seoConfigMasked
    },
  
    
    superTableModel() {
      return Home_Page_Items
    },
    filterValsComp() {
      const result = {
        ...this.filterValsRef,
      };
      return result;
    },
  },
  methods: {

    isActive(item) {
      return item.URL === this.activeRoute;
    },

    async fetchData() {
      try {

        this.loading = true;
        this.loadingError = false;
        let rules = [];


        let extraHeaderComputed = {};
        let flagsComputed = {};

        const response = await this.superTableModel.FetchAll(
          // =========================
          [],
          {
            ...rules,
            ...flagsComputed,
            /// -----------------------
            ...this.fetchFlags,
          },
          extraHeaderComputed,
          {
            page: this.options.page,
            limit: this.options.itemsPerPage,
            //============================
            filters: this.filterValsComp,
            clearPrimaryModelOnly: false,
          },
        );

        this.$emit('loaded')


        this.items = response.response.data.records.map(record => {
          return {
            id: record.id,
            createdTime: record.createdTime,
            ...record.fields
          };
        });


        this.loading = false;

      } catch (error) {
        this.loading = false;
        this.loadingError = true;
      }
    },
  },
  mounted(){
    this.fetchData();
  },
  watch: {
    '$route.path'(newPath) {
      this.activeRoute = newPath;
    }
  }
}
</script>
