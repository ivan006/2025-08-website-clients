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
    
  

    <div class="bg-1ry-color text-white " >
      <div
        class="container-md q-py-sm"
      >

        <q-toggle
          v-model="groupByTheme"
          label="Group by Theme instead of Tier"
          color="primary"
          class="q-mb-xl"
        />
      </div>
    </div>

    <div v-for="(groups, categoryName) in groupedArtworks" :key="categoryName">
      
      <div class="bg-2ry-color text-white font-1ry" >
        <div
          class="container-md q-py-xl"
        >

          <h2 class="text-h3 text-center q-mt-xl">{{ categoryName }}</h2>
        </div>
      </div>
        

      <div v-for="(artists, groupKey) in groups" :key="groupKey">
        
        <div class="bg-1ry-color text-white" >
          <div
            class="container-md q-py-xl"
          >

            <h4 class="text-h4 text-center q-mb-lg font-1ry">{{ groupKey }} {{ categoryName }}</h4>
          </div>
        </div>
          
        <div class="bg-2ry-color" >
          <div
            class="container-md q-py-xl"
          >

            <div class="row">
              <div
                v-for="(artworks, artist) in artists"
                :key="artist"
                class="q-card q-pa-md items-start no-wrap q-mb-xl bg-3ry-color text-white"
                
                :class="artistCardWidthClass(artworks.length)"
                style="border-radius: 12px; overflow: hidden; "
              >
                <div class="row q-col-gutter-md justify-start items-center">
                  <!-- Left: Artist info -->
                  <div
                    class="q-pa-md text-center text-md-left flex column items-center items-md-start"
                    :class="artCardWidthClass(artworks.length)"
                    style="align-self: stretch; display: flex; justify-content: center;"
                  >
                    <div>
                      <h3 class="text-h5 q-mb-sm">{{ artist }}</h3>

                      <div class="text-body1 text-grey-5 q-mb-xs">
                        Style:
                        <q-badge
                          outline
                          class="text-capitalize q-px-sm q-py-xs text-2ry-color"
                          style="border-radius: 8px; font-size: 13px; border-color: currentColor;"
                        >
                          {{ artworks[0]['Theme Name']?.[0] || 'Unspecified' }}
                        </q-badge>
                      </div>

                      <div class="text-body1 text-grey-5">
                        Tier: <q-badge
                          outline
                          color="secondary"
                          class="text-capitalize q-px-sm q-py-xs text-1ry-color"
                          style="border-radius: 8px; font-size: 13px; border-color: currentColor;"
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
                        color="primary"
                        flat
                        size="md"
                        class="q-mt-xs text-weight-medium bg-transparent text-1ry-color hover:text-amber-3"
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
                      style="height: 200px; display: block; border-radius: 10px; margin-left: auto; margin-right: auto;  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);"
                    >

                    <div class="q-pt-sm">
                      <div class="text-weight-bold text-uppercase text-h6">
                        {{ art.Title }}
                      </div>
                      <div class="text-body1 text-grey-5 q-my-xs">
                        R{{ art.Price.toLocaleString() }}
                      </div>

                      <q-btn
                        color="primary"
                        flat
                        size="md"
                        class="q-mt-xs text-weight-medium bg-transparent text-1ry-color hover:text-amber-3"
                        label="Read More"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ✅ Dynamic View All button for this subgroup -->
            <div class="text-center q-mb-xl">
              <!-- <q-btn
                color="primary"
                outline
                size="md"
                class="q-px-lg q-mt-sm"
                :label="`View All ${groupKey} ${categoryName}`"
              /> -->
              <q-btn
                color="primary"
                flat
                size="md"
                class="q-mt-xs text-weight-medium"
                :label="`View More ${groupKey} Works`"
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
        itemsPerPage: 10,
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
      const tierOrder = ['Diamond Tier', 'Platinum Tier', 'Gold Tier', 'Silver Tier', 'Bronze Tier']

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
            : art['Artist Tier Name']?.[0] || 'Uncategorized Tier'

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
          image: item['Image'] ? `https://capetownlists.co.za/?url=${item['Image']}` : "",
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
        image = `https://capetownlists.co.za/?url=${this.parent?.fields?.['Image']?.[0]?.url}`;
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
