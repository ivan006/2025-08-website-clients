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


      <div class="row justify-center">
        <!--<div class="row justify-center" >-->

        <template v-for="item in items" :key="item.id">

          <!--<q-avatar>-->
          <!--  <img :src="item">-->
          <!--</q-avatar>-->
          <div class="col-xl-4 col-md-4 col-sm-12 col-xs-12">
            <div class="q-py-md q-px-md">

            <q-card class="q-ma-sm" style="border-radius: 10px;">
              <q-card-section>
                <div class="">

                  <div class="row">

                    <div class="col-xl-12 col-md-12 col-sm-12 col-xs-12 q-px-md text-center">
                      <div

                      >
                        <!-- <img
                          :src="item?.['Image']?.[0]?.url ? `https://capetownlists.co.za/?url=${encodeURIComponent(item?.['Image']?.[0]?.thumbnails?.large?.url)}` : ''"
                          style="width: 100%; display: block; border-radius: 1000px;"
                        > -->
                        <img
                        src="~assets/square.webp"
                        :style="item?.['Image']?.[0]?.thumbnails?.large?.url ? `background-image: url(https://capetownlists.co.za/?url=${encodeURIComponent(item?.['Image']?.[0]?.thumbnails?.large?.url)});` : ``"
                        style="
                          background-position: center;
                          background-size: cover;
                          border-radius: 100%;
                          max-width: 100%;
                          "
                        />
                        <!--<img src="https://cdn.quasar.dev/img/avatar.png">-->
                      </div>
                    </div>
                    <div class="col-xl-12 col-md-12 col-sm-12 col-xs-12 q-px-sm  text-center">
                      <div class="column justify-center full-height">

                        <div class="lt-md q-mt-lg"></div>

                        <h2 class="r-font-h5 text-bold q-my-xs text-uppercase font-1ry">
                          {{item["Title"]}}
                        </h2>

                        <h3 class="r-font-h6 q-my-xs text-weight-light">
                          {{item["Subtitle"]}}
                        </h3>

                        <h4 class="r-font-h6 q-my-xs">
                          R{{item["Price"]}}.00
                        </h4>
                      </div>



                    </div>
                  </div>

                  <!--<pre>-->
                  <!--  {{item}}-->
                  <!--</pre>-->
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
import Dry_Items from 'src/models/orm-api/Dry_Items'
import {createMetaMixin} from "quasar";
import {buildSchemaItem, buildSeoConfig} from "src/utils/seo";
import SEODataViewer from "src/controllers/SEODataViewer.vue";

export default {
  name: 'Dry_Items_Controller',
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
        itemsPerPage: 1000,
        sortBy: [],
        groupBy: [],
      },
      filterValsRef: {},
    }
  },

  computed: {

    
    
    seoConfig(){

      const url = window.location.origin + (this.$route?.fullPath.split('#')[0] || '/');
      const siteName = import.meta.env.VITE_API_SITE_TITLE;

      let image = ""
      if (this.parent?.fields?.['Image']?.[0]?.url) {
        image = `https://capetownlists.co.za/?url=${encodeURIComponent(this.parent?.fields?.['Image']?.[0]?.url)}`;
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
    
    seoLdJson(){
    
      const url = window.location.origin + (this.$route?.fullPath.split('#')[0] || '/');
      const siteName = import.meta.env.VITE_API_SITE_TITLE;

      let image = ""
      if (this.parent?.fields?.['Image']?.[0]?.url) {
        image = `https://capetownlists.co.za/?url=${encodeURIComponent(this.parent?.fields?.['Image']?.[0]?.url)}`;
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
          image: item?.['Image']?.[0]?.url ? `https://capetownlists.co.za/?url=${encodeURIComponent(item?.['Image']?.[0]?.url)}` : "",
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
  
    superTableModel() {
      return Dry_Items
    },
    filterValsComp() {
      const result = {
        ...this.filterValsRef,
      };
      return result;
    },
    itemListElement() {
      const result = this.items;
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
