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

    <div class=" bg-white q-py-xl">
      <div
        class="container-md "
      >

        <h2 class="r-font-h2 text-center q-my-none text-uppercase font-1ry">Deposits</h2>
      </div>
    </div>
    
    <div class=" bg-2ry-color q-py-xl">
      <div
        class="container-md "
      >


        <div class="row q-col-gutter-md">
          <!--<div class="row justify-center" >-->

          <template v-for="item in items" :key="item.id">
            <template v-if="item['Category'] === 'Deposit'">

              <!--<q-avatar>-->
              <!--  <img :src="item">-->
              <!--</q-avatar>-->
              <div class="col-xl-3 col-md-6 col-6">
                <div class="">

                  <div class="row">

                    
                    <q-card class="q-ma-sm" style="border-radius: 10px;">
                      <q-card-section>
                        <div class="">

                          <div class="row">

                            <div class="col-xl-7 col-md-7 col-sm-12 col-xs-12 q-px-md">
                              <div

                              >
                                <img
                                  :src="item?.['Image']?.[0]?.url ? `https://capetownlists.co.za/?url=${item?.['Image']?.[0]?.thumbnails?.large?.url}` : ''"
                                  style="width: 100%; display: block; border-radius: 1000px;"
                                >
                                <!--<img src="https://cdn.quasar.dev/img/avatar.png">-->
                              </div>
                            </div>
                            <div class="col-xl-5 col-md-5 col-sm-12 col-xs-12 q-px-sm ">
                              <div class="column justify-center full-height">

                                <div class="lt-md q-mt-lg"></div>

                                <h2 class="text-body1 text-bold q-mt-none font-1ry text-uppercase">
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
                        
                      </q-card-section>
                    </q-card>
                   
                  </div>

                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>

    
    <div class=" bg-white text- q-py-xl">
      <div
        class="container-md "
      >

        <h2 class="r-font-h2 text-center q-my-none text-uppercase font-1ry">Refills</h2>
      </div>
    </div>
    
    <div class=" bg-2ry-color  q-py-xl">
      <div
        class="container-md "
      >

        <div class="row q-col-gutter-none">
          <template v-for="item in items" :key="item.id">
            <template v-if="item['Category'] === 'Refill'">

              <div class="col-xl-3 col-md-6 col-6">
                
                <q-card class="q-ma-sm" style="border-radius: 10px;">
                  <q-card-section>
                    <div class="">

                      <div class="row">

                        <div class="col-xl-7 col-md-7 col-sm-12 col-xs-12 q-px-md">
                          <div

                          >
                            <img
                              :src="item?.['Image']?.[0]?.url ? `https://capetownlists.co.za/?url=${item?.['Image']?.[0]?.thumbnails?.large?.url}` : ''"
                              style="width: 100%; display: block; border-radius: 1000px;"
                            >
                            <!--<img src="https://cdn.quasar.dev/img/avatar.png">-->
                          </div>
                        </div>
                        <div class="col-xl-5 col-md-5 col-sm-12 col-xs-12 q-px-sm ">
                          <div class="column justify-center full-height">

                            <div class="lt-md q-mt-lg"></div>

                            <h2 class="text-body1 text-bold q-mt-none font-1ry text-uppercase">
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
                    
                  </q-card-section>
                </q-card>
                <!-- <div class="q-py-md q-px-md">

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
                </div> -->
              </div>
            </template>
          </template>



        </div>
      </div>
    </div>
    


  </template>


</template>

<script>
import Secondary_Page_Items from 'src/models/orm-api/Secondary_Page_Items'
import {createMetaMixin} from "quasar";
import {buildSchemaItem, buildSeoConfig} from "src/utils/seo";

export default {
  name: 'Secondary_Page_Items_Controller',
  components: {
  },
  mixins: [
    createMetaMixin(function () {





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
          name: item['Title'] || '',
          description: item['Subtitle'] || '',
          image: item?.['Image']?.[0]?.url ? `https://capetownlists.co.za/?url=${item?.['Image']?.[0]?.url}` : "",
          price: String(item['Price']),
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


      return buildSeoConfig({
        title: this.parent.fields?.['Title'] || siteName,
        description: this.parent.fields?.['Subtitle'] || '',
        url,
        image: image || `${window.location.origin}/og-default.jpg`,
        siteName,
        type: this.parent.fields?.['SEO Type'],
        schema
      });
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
    superTableModel() {
      return Secondary_Page_Items
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
        let flagsComputed = {
          // view: "viwB8vBSwwRbUjhCW"
        };

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
