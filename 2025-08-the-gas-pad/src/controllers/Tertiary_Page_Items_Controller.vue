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
    <SEODataViewer :seoConfig="seoConfig" :seoLdJson="seoLdJson" />
   <!-- <pre>{{ itemsNoSubcategory }}</pre> -->
    <template v-for="(items, category) in itemsNoSubcategory" :key="category">
      <div class="bg-white " >
        <div
          class="container-md q-py-xl"
        >
          <h2 class="r-font-h3 q-my-none text-center font-1ry text-uppercase">{{ category }}</h2>
        </div>
      </div>
      <div class="bg-2ry-color" >
        <div
          class="container-md q-py-xl"
        >
        
          <div class="row q-col-gutter-md">

            <template v-for="item in items" :key="item.id" >
                        
              <!--<q-avatar>-->
              <!--  <img :src="item">-->
              <!--</q-avatar>-->
              <div class="col-xl-3 col-md-3 col-6 ">
                
                <q-card  style="border-radius: 10px;">
                  <q-card-section>
                   <div

                    >
                      <div class="row q-col-gutter-none  justify-around">

                        <div class="col-xl-6 col-md-6 col-12 ">
                          
                
                          <img
                            :src="item?.['Image']?.[0]?.url ? `https://capetownlists.co.za/?url=${item?.['Image']?.[0]?.thumbnails?.large?.url}` : ''"
                            style="width: 100%; display: block; border-radius: 1000px;"
                          >
                        </div>
                      </div>  
                      <!--<img src="https://cdn.quasar.dev/img/avatar.png">-->
                    </div>
                    <div class="lt-md q-mt-lg"></div>

                    <h2 class="r-font-h5 text-center text-bold q-mt-none font-1ry text-uppercase">
                      {{item["Title"]}}
                    </h2>
                  </q-card-section>
                </q-card>
              </div>
            </template>
            

          </div>
        </div>
      </div>
    </template>

    
    <template v-for="(subcats, category) in itemsComputed" :key="category">
      <div class="bg-white " >
        <div
          class="container-md q-py-xl"
        >
          <h2 class="r-font-h3 q-my-none text-center font-1ry text-uppercase">{{ category }}</h2>
        </div>
      </div>
      <div class="bg-2ry-color" >
        <!-- <div>&nbsp;</div> -->
        <div
          class="container-md q-pb-xl"
        >
        
          <div class="row q-col-gutter-md">
            <template v-for="(products, sub) in subcats" :key="sub">

              <div class="col-xl-3 col-md-3 col-sm-12 col-xs-12  ">
                  
                <!-- <q-card class="bg-4ry-color">
                  <q-card-section> -->
                    
                    <h3 class="r-font-h5 q-my-none q-py-xl text-center text-uppercase font-1ry" style="">{{ sub }}</h3>

                    <div class="row q-col-gutter-md justify-center">
                      <template v-for="item in products" :key="item.id" >
                        
                        <!--<q-avatar>-->
                        <!--  <img :src="item">-->
                        <!--</q-avatar>-->
                        <div class="col-xl-12 col-md-12 col-6 ">
                          
                          <q-card class="" style="border-radius: 10px;">
                            <q-card-section>
                              <div class="">

                                <div class="row">

                                  <div class="col-xl-6 col-md-6 col-sm-12 col-xs-12 q-px-md">
                                    <div

                                    >
                                      <img
                                        :src="item?.['Image']?.[0]?.url ? `https://capetownlists.co.za/?url=${item?.['Image']?.[0]?.thumbnails?.large?.url}` : ''"
                                        style="width: 100%; display: block; border-radius: 1000px;"
                                      >
                                      <!--<img src="https://cdn.quasar.dev/img/avatar.png">-->
                                    </div>
                                  </div>
                                  <div class="col-xl-6 col-md-6 col-sm-12 col-xs-12 q-px-sm ">
                                    <div class="column justify-center full-height">

                                      <div class="lt-md q-mt-lg"></div>

                                      <h2 class="r-font-h6 text-bold q-mt-none font-1ry text-uppercase">
                                        {{item["Title"]}}
                                      </h2>

                                      <div class="text-body2">
                                        {{item["Subtitle"]}}
                                      </div>

                                      <div class="text-body2">
                                        R{{item["Price"]}}.00
                                      </div>
                                    </div>



                                  </div>
                                </div>

                                <!--<pre>-->
                                <!--  {{item}}-->
                                <!--</pre>-->
                              </div>
                              
                            </q-card-section>
                          </q-card>
                        </div>
                      </template>
                    </div>
                  
                  <!-- </q-card-section>
                </q-card> -->
              </div>  
            </template>

          </div> 
        </div>
      </div>

    </template>
    <div class="row">
      <!--<div class="row justify-center" >-->


      <!--<pre>-->
      <!--  {{itemListElement}}-->
      <!--</pre>-->
      <!--<h2 class="text-center">Deposits</h2>-->
      <div class="row">
        <!--<div class="row justify-center" >-->

        

        <!-- <template v-for="item in items" :key="item.id">

          
          <div class="col-xl-3 col-md-6 col-sm-12 col-xs-12">
            <div class="q-py-md q-px-md">

              <div class="row">

                <div class="col-xl-5 col-md-5 col-sm-12 col-xs-12 q-px-md">
                  <div

                  >
                    <img
                      :src="item?.['Image']?.[0]?.url ? `https://capetownlists.co.za/?url=${item?.['Image']?.[0]?.thumbnails?.large?.url}` : ''"
                      style="width: 100%; display: block; border-radius: 1000px;"
                    >
                  </div>
                </div>
                <div class="col-xl-7 col-md-7 col-sm-12 col-xs-12 q-px-sm ">
                  <div class="column justify-center full-height">

                    <div class="lt-md q-mt-lg"></div>

                    <h2 class="text-body1 text-bold q-mt-none">
                      {{item["Title"]}}
                    </h2>

                    <div class="text-body2">
                      {{item["Subtitle"]}}
                    </div>

                    <div class="text-body2">
                      R{{item["Price"]}}.00
                    </div>
                  </div>



                </div>
              </div>

            </div>
          </div>
        </template> -->
      </div>
    </div>

  </template>


</template>

<script>
import Tertiary_Page_Items from 'src/models/orm-api/Tertiary_Page_Items'
import {createMetaMixin} from "quasar";
import {buildSchemaItem, buildSeoConfig} from "src/utils/seo";
import SEODataViewer from "src/controllers/SEODataViewer.vue";

export default {
  name: 'Tertiary_Page_Items_Controller',
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
      filterValsRef: {},
    }
  },

  computed: {
    
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
  
    superTableModel() {
      return Tertiary_Page_Items
    },
    filterValsComp() {
      return {
        ...this.filterValsRef,
      };
    },
    itemListElement() {
      return this.items;
    },  
    itemsComputed() {
      const grouped = {};

      this.items.forEach(item => {
        const category = item['Category'] || 'Uncategorized';
        const sub = item['Sub-category'];

        // skip items with no subcategory
        if (!sub) return;

        if (!grouped[category]) {
          grouped[category] = {};
        }
        if (!grouped[category][sub]) {
          grouped[category][sub] = [];
        }
        grouped[category][sub].push(item);
      });

      return grouped;
    },

    // Collect items that have NO subcategory
    // Group items with Category but no Sub-category
    itemsNoSubcategory() {
      const grouped = {};

      this.items.forEach(item => {
        const category = item['Category'] || 'Uncategorized';
        const sub = item['Sub-category'];

        if (sub) return; // skip items that *do* have subcategory

        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(item);
      });

      return grouped;
    }
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
