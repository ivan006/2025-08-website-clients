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

    <div class="row">
      <!--<div class="row justify-center" >-->

      <template v-for="item in items" :key="item.id">


        <!--<q-avatar>-->
        <!--  <img :src="item">-->
        <!--</q-avatar>-->
        <div class="col-xl-8 col-md-8 col-sm-12 col-xs-12  offset-xl-2 offset-md-2">
          <div class="q-py-lg q-px-lg">
           
            <router-link
              :to="`/home/${item['id']}/${item['Slug']}`"

              class="q-link q-item"
            >
              <div class="row">

                <div class="col-xl-4 col-md-4 col-sm-12 col-xs-12 q-px-lg">

                  <!--<img src="~assets/square.webp">-->
                  <img
                    src="~assets/square.webp"
                    :style="item?.['Image']?.[0]?.thumbnails?.large?.url ? `background-image: url(https://capetownlists.co.za/?url=${item?.['Image']?.[0]?.thumbnails?.large?.url});` : ``"
                    style="
                  background-color: rgb(70,70,70);
                  background-position: center;
                  background-size: cover;
                  border-radius: 100%;
                  max-width: 100%;
                  "
                  />

                  <!--<img-->
                  <!--  :src="item?.['Image']?.[0]?.url ? `https://capetownlists.co.za/?url=${item?.['Image']?.[0]?.thumbnails?.large?.url}` : ''"-->
                  <!--  style="-->


                  <!--  display: inline;-->
                  <!--  margin: 0 auto;-->
                  <!--  height: 100%;-->
                  <!--  width: auto;-->
                  <!--  "-->
                  <!--&gt;-->
                </div>
                <div class="col-xl-8 col-md-8 col-sm-12 col-xs-12 q-px-lg ">
                  <div class="column justify-center full-height">

                    <div class="lt-md q-mt-lg"></div>

                    <h2 class="text-h4 text-bold q-mt-none font-1ry text-uppercase q-my-xs">
                      {{item["Title"]}}
                    </h2>

                    <!--<div class="text-body3 font-1ry  " style="letter-spacing: 0px;">-->

                    <!--  <q-badge color="teal" style="font-size: 0.8em">-->
                    <!--    {{item["Subtitle"]}}-->
                    <!--  </q-badge>-->
                    <!--</div>-->
                    <!--<div class="text-body3 font-2ry  text-uppercase q-mb-sm" style="letter-spacing: 10px;">-->

                    <!--  {{item["Subtitle"]}}-->
                    <!--</div>-->
                    <div class="text-body3 font-2ry">
                      <!--{{item["Subtitle"]}} - {{item["Short Description"]}}-->
                      {{item["Short Description"]}}
                    </div>


                    <div class="text-body3 font-1ry q-my-sm">
                      R{{item["Price"]}}.00
                      <q-badge class="bg-3ry-color" style="font-size: 0.8em">
                        Monthly Fee
                      </q-badge>
                      +
                      R{{item["Setup Fee"]}}.00
                      <q-badge class="bg-3ry-color" style="font-size: 0.8em">
                        Setup Fee
                      </q-badge>
                    </div>


                    <!--<div class="text-body3 font-1ry q-mt-md">-->
                    <!--  &lt;!&ndash;<q-badge color="teal" style="font-size: 1em">&ndash;&gt;-->
                    <!--  &lt;!&ndash;</q-badge>&ndash;&gt;-->

                    <!--  {{item["Price Text"]}}-->
                    <!--</div>-->



                    <!--<div class="">-->
                    <!--  <q-btn-->
                    <!--    outline-->
                    <!--    :to="`/home/${item['id']}/${item['Slug']}`"-->
                    <!--    class="q-mt-md text-3ry-color "-->
                    <!--    style="text-transform: none"-->
                    <!--  >-->

                    <!--    Learn More-->
                    <!--  </q-btn>-->
                    <!--</div>-->

                    <!--<div class="text-body3 font-1ry q-mt-md">-->
                    <!--  <q-badge color="teal" style="font-size: 0.8em">-->
                    <!--    R{{item["Price"]}}.00-->
                    <!--  </q-badge>-->
                    <!--  Monthly Fee-->
                    <!--  +-->
                    <!--  <q-badge color="teal" style="font-size: 0.8em">-->
                    <!--    R{{item["Setup Fee"]}}.00-->
                    <!--  </q-badge>-->
                    <!--  Setup Fee-->
                    <!--</div>-->
                  </div>



                </div>
              </div>
            </router-link>

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
import {buildSeoConfig, buildSchemaItem} from "src/utils/seo";

export default {
  name: 'Home_Page_Items_Controller',
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
          image: `https://capetownlists.co.za/?url=${item?.['Image']?.[0]?.url}`,
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
        schema.hasProduct = products;
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
        let flagsComputed = {
          view: "viw1aARBy4sfw3ZjO"
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
