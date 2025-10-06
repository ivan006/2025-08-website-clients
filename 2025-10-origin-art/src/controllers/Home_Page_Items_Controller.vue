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
    
    <div v-for="(artists, tier) in groupedSculptures" :key="tier" class="q-my-xl">
      <h2 class="text-h4 text-center q-mb-lg">{{ tier }}</h2>

      <div
        v-for="(artworks, artist) in artists"
        :key="artist"
        class="q-card q-my-lg q-pa-md row items-start no-wrap"
        style="border-radius: 12px; overflow: hidden;"
      >
        <!-- Left: Artist info -->
        <div class="col-12 col-md-3 q-pa-md text-center text-md-left">
          <h3 class="text-h5 q-mb-sm">{{ artist }}</h3>
          <div class="text-caption text-grey-7">Tier: {{ tier }}</div>
          <q-btn
            color="green"
            unelevated
            size="sm"
            class="q-mt-md q-px-md"
            style="border-radius: 100px;"
            label="View Artist"
          />
        </div>

        <!-- Right: Artworks -->
        <div class="col-12 col-md-9 row q-col-gutter-md justify-start">
          <div
            v-for="art in artworks"
            :key="art.id"
            class="col-12 col-sm-4 col-md-4"
          >
            <q-card class="q-ma-sm" style="border-radius: 10px;">
              <q-card-section class="q-pa-none">
                <div
                  :style="art['Image']
                    ? 'background-image: url(https://capetownlists.co.za/?url=' + art['Image'] + ');'
                    : ''"
                  style="
                    background-position: center;
                    background-size: cover;
                    border-radius: 10px 10px 0 0;
                    height: 200px;
                  "
                ></div>
                <div class="q-py-sm q-px-md text-center">
                  <div class="text-weight-bold text-uppercase">
                    {{ art.Title }}
                  </div>
                  <div class="text-subtitle2 text-grey-7 q-my-xs">
                    R{{ art.Price.toLocaleString() }}
                  </div>
                </div>
              </q-card-section>
            </q-card>
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
    

    groupedSculptures() {
      const sculptures = this.items.filter(
        i =>
          Array.isArray(i['Priority in Sculpture']) &&
          i['Priority in Sculpture'].includes('Yes')
      )

      const grouped = {}

      for (const art of sculptures) {
        const tier = art['Artist Tier Name']?.[0] || 'Uncategorized Tier'
        const artist = art['Artist Name']?.[0] || 'Unknown Artist'

        if (!grouped[tier]) grouped[tier] = {}
        if (!grouped[tier][artist]) grouped[tier][artist] = []

        grouped[tier][artist].push(art)
      }

      // Limit to 3 artworks per artist
      for (const tier in grouped) {
        for (const artist in grouped[tier]) {
          grouped[tier][artist] = grouped[tier][artist].slice(0, 3)
        }
      }

      return grouped
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
          image: item?.['Image']?.[0]?.url ? `https://capetownlists.co.za/?url=${item?.['Image']?.[0]?.url}` : "",
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
