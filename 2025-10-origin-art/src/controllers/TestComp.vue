<template>
  <template v-if="!items.length">
    <template v-if="loading">
      <div class="text-center q-pa-md">Loading...</div>
    </template>
    <template v-else>
      <div class="text-center q-pa-md text-2ry-color ">None</div>
    </template>
  </template>
  <template v-else>
    <SEODataViewer :seoConfig="seoConfigMasked" :seoLdJson="seoLdJson" />
    
  

    <div v-for="(groups, categoryName) in groupedArtworks" :key="categoryName">
      
      
       
      <div class=" bg-1ry-color text- q-py-lg">
        <div
          class="container-md "
        >

          <div class="r-font-h3 text-center q-my-none text-uppercase font-1ry">
            
            <h2 class="text-h3 text-center q-mt-xl ">{{ categoryName }}</h2>
          </div>
        </div>
      </div>
      

      <div class="bg-2ry-color  q-py-xl" >
        <div
          class="container-md q-py-sm"
        >

          <q-toggle
            v-model="groupByTheme"
            label="Group by Theme instead of Tier"
            
            class=" text-3ry-color"
          />
        </div>
      </div>
        

      <div v-for="(artists, groupKey) in groups" :key="groupKey">
        
        <div class="bg-3ry-color " >
          <div
            class="container-md q-py-lg"
          >

            <h4 class="text-h4 text-center  font-1ry text-white  q-my-lg">{{ groupKey }} {{ categoryName }}</h4>
          </div>
        </div>
          
        <div class="bg-2ry-color" >
          <div
            class="container-md q-py-xl"
          >

            <div class="row">
              <q-card
                v-for="(artworks, artist) in artists"
                :key="artist"
                flat 
                class="q-ard q-pa-md items-start no-wrap q-mb-xl box-shadsow-1ry flat bg-1ry-color  text-1ry-color border-1ry"
                
                :class="artistCardWidthClass(artworks.length)"
                style="border-radius: 12px; overflow: hidden; "
              >
                <div class="row q-col-gutter-md justify-start items-center">
                  <!-- Left: Artist info -->
                  <div
                    class="q-pa-md text-center text-md-left flex column items-center items-md-start "
                    :class="artCardWidthClass(artworks.length)"
                    style="align-self: stretch; display: flex; justify-content: center;"
                  >
                    <div>
                      <h3 class="text-h5 q-mb-sm font-1ry">{{ artist }}</h3>

                      <div class="text-body1 text-2ry-color q-mb-xs">
                        Style: <q-badge
                          outline
                          
                          class="text-uppdercase q-px-sm q-py-xs text-3ry-color"
                          style="border-radius: 8px; font-size: 13px;"
                        >
                          {{ artworks[0]['Theme Name']?.[0] || 'Unspecified' }}
                        </q-badge>
                      </div>
                      <div class="text-body1 text-2ry-color ">
                        Tier: <q-badge
                          outline
                          
                          class="text-uppdercase q-px-sm q-py-xs text-3ry-color"
                          style="border-radius: 8px; font-size: 13px;"
                        >
                          {{ artworks[0]['Artist Tier Name']?.[0] || 'Uncategorized' }}
                        </q-badge>
                      </div>


                      <!-- <q-btn
                        color="green"
                        unelevated
                        size="md"
                        class="q-mt-md q-px-lg text-weight-bold"
                        style="border-radius: 100px;"
                        label="View All"
                      /> -->
                      <q-btn
                        
                        flat
                        size="md"
                        class="q-mt-xs text-weight-medium text-3ry-color"
                        label="View All Works"
                      />
                      
                      
                        <!-- label="View Artist" -->
                    </div>
                  </div>

                  <!-- Right: Artworks -->
                  <div
                    v-for="art in artworks.slice(0, 3)"
                    :key="art.id"
                    :class="artCardWidthClass(artworks.length)"
                    style="border-radius: 10px; overflow: hidden; text-align: center;"
                  >
            
                    <img
                      :src="art['Image'] ? `https://capetownlists.co.za/?url=${art['Image']}` : ''"
                      style="height: 200px; display: block; border-radius: 10px; margin-left: auto; margin-right: auto;"
                    >

                    <div class="q-pt-sm">
                      <div class="text-weight- text- text-h6 font-1ry">
                        {{ art.Title }}
                      </div>
                      <div class="text-body1 text-2ry-color q-my-xs">
                        R{{ art.Price.toLocaleString() }}
                      </div>

                      <q-btn
                        
                        flat
                        size="md"
                        class="q-mt-xs text-weight-medium text-3ry-color"
                        label="Read More"
                      />
                    </div>
                  </div>
                </div>
              </q-card>
            </div>

            <!-- ✅ Dynamic View All button for this subgroup -->
            <div class="text-center q-mb-xl">
              <!-- <q-btn
                
                outline
                size="md"
                class="q-px-lg q-mt-sm"
                :label="`View All ${groupKey} ${categoryName}`"
              /> -->
              <q-btn
                
                flat
                size="md"
                class="q-mt-xs text-weight-medium text-3ry-color"
                :label="`View All ${groupKey} Works`"
              />
                <!-- :label="`View All ${groupKey} ${categoryName}`" -->
            </div>
          </div>
        </div>
      </div>
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
      groupByTheme: false,
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
    



    groupedArtworks() {
      const categories = {
        'Fine Art': {
          priority: 'Priority in Fine Art',
          media: 'Fine Art'
        },
        'Sculptural Works': {
          priority: 'Priority in Sculpture',
          media: 'Sculptural Works'
        },
        'New Media': {
          priority: 'Priority in New Media',
          media: 'New Media'
        }
      }

      const groupedByCategory = {}

      // Define preferred sort order for both themes and tiers
      const themeOrder = ['Decorative', 'Evocative']
      // const tierOrder = ['Diamond Tier', 'Platinum Tier', 'Gold Tier', 'Silver Tier', 'Bronze Tier']
      const tierOrder = ['Gold Tier', 'Silver Tier', 'Bronze Tier']

      for (const [categoryName, { priority, media }] of Object.entries(categories)) {
        const filtered = this.items.filter(i =>
          Array.isArray(i[priority]) &&
          i[priority].includes('Yes') &&
          Array.isArray(i['Media Category Name']) &&
          i['Media Category Name'].includes(media)
        )

        const grouped = {}

        for (const art of filtered) {
          const groupKey = this.groupByTheme
            ? art['Theme Name']?.[0] || 'Uncategorized Theme'
            // : art['Artist Tier Name']?.[0] || 'Uncategorized Tier'
            : art['Tier Category']?.[0] || 'Uncategorized Tier'

          const artist = art['Artist Name']?.[0] || 'Unknown Artist'

          if (!grouped[groupKey]) grouped[groupKey] = {}
          if (!grouped[groupKey][artist]) grouped[groupKey][artist] = []

          grouped[groupKey][artist].push(art)
        }

        // Limit to 3 artworks per artist
        for (const groupKey in grouped) {
          for (const artist in grouped[groupKey]) {
            grouped[groupKey][artist] = grouped[groupKey][artist].slice(0, 3)
          }
        }

        // ✅ Sort group keys depending on grouping mode
        const sortedKeys = Object.keys(grouped).sort((a, b) => {
          const orderList = this.groupByTheme ? themeOrder : tierOrder
          const aIndex = orderList.indexOf(a)
          const bIndex = orderList.indexOf(b)

          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
          if (aIndex !== -1) return -1
          if (bIndex !== -1) return 1
          return a.localeCompare(b)
        })

        const sortedGrouped = {}
        for (const key of sortedKeys) {
          sortedGrouped[key] = grouped[key]
        }

        groupedByCategory[categoryName] = sortedGrouped
      }

      return groupedByCategory
    }
,
    seoLdJson(){
      


      const url = window.location.origin + (this.$route?.fullPath.split('#')[0] || '/');
      const siteName = import.meta.env.VITE_API_SITE_TITLE;

      let image = ""
      if (this.parent?.fields?.['Image']?.[0]?.url) {
        image = `${import.meta.env.VITE_API_PROXY_URL}${this.parent?.fields?.['Image']?.[0]?.url}`;
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
          image: item['Image'] ? `${import.meta.env.VITE_API_PROXY_URL}${item['Image']}` : "",
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
        image = `${import.meta.env.VITE_API_PROXY_URL}${this.parent?.fields?.['Image']?.[0]?.url}`;
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

    artistCardWidthClass(count) {
      if (count >= 3) return 'col-12 col-md-12';
      if (count === 2) return 'offset-md-2 col-md-8 col-12 ';
      if (count === 1) return 'offset-md-3 col-md-6 col-12';
      return 'col-12';
    },
    
    artCardWidthClass(count) {
      if (count >= 3) return 'col-md-3 col-12';
      if (count === 2) return 'col-md-4 col-12';
      if (count === 1) return 'col-md-6 col-12';
      return 'col-12';
    },
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
