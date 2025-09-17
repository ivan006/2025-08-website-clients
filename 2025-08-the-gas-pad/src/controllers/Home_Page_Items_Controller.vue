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
    
    <div class="row q-col-gutter-md justify-around">
      <!--<div class="row justify-center" >-->

      <template v-for="item in items" :key="item.id">

        <!--<q-avatar>-->
        <!--  <img :src="item">-->
        <!--</q-avatar>-->
        <div class="col-xl-4 col-md-4 col-12">
          <div class="">

           
            <q-card class="q-ma-sm" style="border-radius: 10px;">
              <q-card-section class="q-pa-none">
                

                <div>
                  <div
                  :style="item?.['Image']?.[0]?.thumbnails?.large?.url ? `background-image: url(https://capetownlists.co.za/?url=${item?.['Image']?.[0]?.thumbnails?.large?.url});` : ``"
                  style="
                    background-position: center;
                    background-size: cover;
                    border-radius: 10px 10px 0 0 ;
                    max-width: 100%;
                    height: 200px;
                    "
                  >
                  </div>
                  <!--<img src="https://cdn.quasar.dev/img/avatar.png">-->
                </div>
                
                <div class=" q-py-lg q-px-md text-center ">

                  <!-- <div class="lt-md q-mt-lg"></div> -->

                  <h2 class="r-font-h4 font-1ry text- q-my-md text-uppercase">
                    {{item["Title"]}}
                  </h2>

                  <h3 class="r-font-h6 q-my-md font-2ry text-weight-light">
                    {{item["Subtitle"]}}
                  </h3>
                  
          
                  <q-btn
                    :to="item['SEO URL']"
                    color="green"
                    size="md"
                    unelevated
                    class="q-my-md q-px-lg"
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

export default {
  name: 'Home_Page_Items_Controller',
  components: {
    SEODataViewer
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
        itemsPerPage: 10,
        sortBy: [],
        groupBy: [],
      },
      filterValsRef: {}
    }
  },
  computed: {
    
    seoLdJson(){
      


      const url = window.location.origin + (this.$route?.fullPath || '/');
      const siteName = import.meta.env.VITE_API_SITE_TITLE;

      let image = ""
      if (this.parent?.fields?.['Image']?.[0]?.url) {
        image = `https://capetownlists.co.za/?url=${this.parent?.fields?.['Image']?.[0]?.url}`;
      }


      const schema = buildSchemaItem({
        type: this.parent.fields?.['SEO Type'],
        name: this.parent.fields?.['Title'] || siteName,
        description: this.parent.fields?.['Subtitle'] || '',
        url,
        image,
        extras: {}
      });


      const products = this.items.map((item) => {

        const newItem = buildSchemaItem({
          type: item['SEO Type'],
          url: item['SEO URL'] ? window.location.origin + item['SEO URL'] : null,
          name: item['Title'] || '',
          description: item['Subtitle'] || '',
          image: item?.['Image']?.[0]?.url ? `https://capetownlists.co.za/?url=${item?.['Image']?.[0]?.url}` : "",
          price: item['Price'] ? String(item['Price']) : null,
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

      const url = window.location.origin + (this.$route?.fullPath || '/');
      const siteName = import.meta.env.VITE_API_SITE_TITLE;

      let image = ""
      if (this.parent?.fields?.['Image']?.[0]?.url) {
        image = `https://capetownlists.co.za/?url=${this.parent?.fields?.['Image']?.[0]?.url}`;
      }

     return buildSeoConfig({
        title: this.parent.fields?.['Title'] || siteName,
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
