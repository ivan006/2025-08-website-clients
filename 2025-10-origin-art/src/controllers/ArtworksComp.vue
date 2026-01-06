<template>
  <div class="container-mdx" style="">
    <SitemapComp :items="sitemapItems" />
    <SEODataViewer :seoConfig="seoConfigMasked" :seoLdJson="seoLdJson" />
    <catalogue-layout
      :mobileTitle="mobileFiltersLabel"
    >

      <!-- FILTERS -->
      <template #filters>
        <div>
          <!-- MEDIUM -->
          <q-expansion-item label="Medium" class="text-weight-bold" default-opened>
            <q-option-group
              v-model="routeMedium"
              :options="mediumOptions"
              type="radio"
              @update:model-value="resetAndFetch"
              class="q-pb-md text-weight-regular"
            >
              <template v-slot:label="scope">
                <div class="row items-center no-wrap justify-between q-gutter-x-sm">
                  <div>{{ scope.label }}</div>
                  <q-badge transparent align="middle" size="sm" class="bg-grey-7">
                    {{ getCount(scope.value, 'medium') }}
                  </q-badge>
                </div>
              </template>
            </q-option-group>
          </q-expansion-item>



          <q-separator />

          <!-- PRICE RANGE -->
          <q-expansion-item label="Price Range" class="text-weight-bold" default-opened>
            <q-option-group
              v-model="routePriceRange"
              :options="priceOptions"
              type="radio"
              @update:model-value="resetAndFetch"
              class="q-pb-md text-weight-regular"
            >
              <template v-slot:label="scope">
                <div class="row items-center no-wrap justify-between q-gutter-x-sm">
                  <div>{{ scope.label }}</div>
                  <q-badge transparent align="middle" size="sm"  class="bg-grey-7">
                    {{ getCount(scope.value, 'price') }}
                  </q-badge>
                </div>
              </template>
            </q-option-group>
          </q-expansion-item>



          <q-separator />

          <!-- HEIGHT -->
          <q-expansion-item label="Height" class="text-weight-bold" default-opened>
            <q-option-group
              v-model="filterValsRef['Height Bracket']"
              :options="heightOptions"
              type="radio"
              @update:model-value="resetAndFetch"
              class="q-pb-md text-weight-regular"
            >
              <template v-slot:label="scope">
                <div class="row items-center no-wrap justify-between q-gutter-x-sm">
                  <div>{{ scope.label }}</div>
                  <q-badge transparent align="middle" size="sm" class="bg-grey-7">
                    {{ getCount(scope.value, 'height') }}
                  </q-badge>
                </div>
              </template>
            </q-option-group>
          </q-expansion-item>



          <q-separator />

          <!-- WIDTH -->
          <q-expansion-item label="Width" class="text-weight-bold" default-opened>
            <q-option-group
              v-model="filterValsRef['Width Bracket']"
              :options="widthOptions"
              type="radio"
              @update:model-value="resetAndFetch"
              class="q-pb-md text-weight-regular"
            >
              <template v-slot:label="scope">
                <div class="row items-center no-wrap justify-between q-gutter-x-sm">
                  <div>{{ scope.label }}</div>
                  <q-badge transparent align="middle" size="sm" class="bg-grey-7">
                    {{ getCount(scope.value, 'width') }}
                  </q-badge>
                </div>
              </template>
            </q-option-group>
          </q-expansion-item>


        </div>
      </template>

      <!-- CONTENT -->
      <template #content>

        <div v-if="loading" class="text-center q-pa-md">
          Loading...
        </div>

        <div v-else-if="!filteredItems.length" class="text-center q-pa-md text-2ry-color">
          No artworks found.
        </div>

        <div v-else>

          <div ref="resultsTop" class="text-center q-pa-sm text-1ry-color">
            {{ totalFiltered }} artworks found
          </div>

          <!-- <ArtworkPaginatedGrid :items="filteredItems" v-model:page="currentPage"
            :items-per-page="options.itemsPerPage" /> -->
          <ItemsPaginatedGrid
            :items="filteredItems"
            v-model:page="currentPage"
            :items-per-page="options.itemsPerPage"
          >
            <template #item="{ item }">
              <ArtworkCard :art="item" />
            </template>
          </ItemsPaginatedGrid>


        </div>

      </template>

    </catalogue-layout>
  </div>
</template>

<script>
import ArtworksBoundCache from 'src/models/orm-api/ArtworksBoundCache'
import ItemsPaginatedGrid from 'src/controllers/ItemsPaginatedGrid.vue'

import { createMetaMixin } from 'quasar'
import { buildSchemaItem, buildSeoConfig } from 'src/utils/seo'

import SEODataViewer from 'src/controllers/SEODataViewer.vue'
import CatalogueLayout from 'src/controllers/CatalogueLayout.vue'
import ArtworkCard from 'src/controllers/ArtworkCard.vue'
import SitemapComp from 'src/controllers/SitemapComp.vue'

export default {
  name: 'ArtworksComp',

  components: {
    SEODataViewer,
    CatalogueLayout,
    ItemsPaginatedGrid,
    ArtworkCard,
    SitemapComp
  },

  mixins: [createMetaMixin(function () { return this.seoConfig })],

  props: {
    parent: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      allRecords: [],
      loading: false,

      filteredItems: [],

      totalFiltered: 0,
      currentPage: 0,

      options: { itemsPerPage: 8 },

      /* Only height + width remain local */
      filterValsRef: {
        'Height Bracket': '',
        'Width Bracket': ''
      },

      heightOptions: [
        { label: 'All', value: '' },
        { label: 'Large (>80cm)', value: 'Large' },
        { label: 'Medium (40cm-80cm)', value: 'Medium' },
        { label: 'Small (<40cm)', value: 'Small' }
      ],

      widthOptions: [
        { label: 'All', value: '' },
        { label: 'Large (>60cm)', value: 'Large' },
        { label: 'Medium (30cm-60cm)', value: 'Medium' },
        { label: 'Small (<30cm)', value: 'Small' }
      ],


      mediumOptions: [
        { label: 'All', value: 'all-media' },
        { label: 'Fine Art', value: 'fine-art' },
        { label: 'Sculptural Works', value: 'sculptural-works' },
        { label: 'New Media', value: 'new-media' },
        { label: 'Merch Art', value: 'merch-art' }
      ],


      priceOptions: [
        { label: 'All', value: 'all-price-ranges' },
        { label: 'Platinum Tier (Above R20k)', value: 'platinum' },
        { label: 'Gold Tier (R10k-R20k)', value: 'gold' },
        { label: 'Silver Tier (R5k-R10k)', value: 'silver' },
        { label: 'Bronze Tier (Below R5k)', value: 'bronze' }
      ],





    }
  },

  computed: {
    
    sitemapItems() {
      // const start = performance.now()

      const result = this.filteredItems.map(item => {
        const slug = String(item.Title || 'artwork')
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .replace(/--+/g, '-')
          .replace(/^-+|-+$/g, '')

        return {
          url: `${window.location.origin}/artworks/${item.id}/${slug}/`,
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

    mobileFiltersLabel() {
      const parts = [];

      if (this.routeMedium !== 'all-media') parts.push('Medium');
      if (this.routePriceRange !== 'all-price-ranges') parts.push('Price');
      if (this.filterValsRef['Height Bracket']) parts.push('Height');
      if (this.filterValsRef['Width Bracket']) parts.push('Width');

      if (parts.length === 0) return '';
      if (parts.length === 1) return `1 Selected Filter`;

      return `${parts.length} Selected Filters`;
    },
    routeMedium: {
      get() {
        return this.$route.params.medium || 'all-media'
      },
      set(val) {
        this.$router.push({
          params: {
            ...this.$route.params,
            medium: val
          }
        })
      }
    },

    routePriceRange: {
      get() {
        return this.$route.params.priceRange || 'all-price-ranges'
      },
      set(val) {
        this.$router.push({
          params: {
            ...this.$route.params,
            priceRange: val
          }
        })
      }
    },
    
    seoLdJson(){
      


      const url = window.location.origin + (this.$route?.fullPath.split('#')[0] || '/');
      const siteName = import.meta.env.VITE_API_SITE_TITLE;

      let image = import.meta.env.VITE_API_DEFAULT_IMAGE
      if (this.parent?.fields?.['Image']?.[0]?.url) {
        image = `${import.meta.env.VITE_API_PROXY_URL}${encodeURIComponent(this.parent?.fields?.['Image']?.[0]?.url)}`;
      }


      const schema = buildSchemaItem({
        type: this.parent.fields?.['SEO Type'],
        name: this.parent.fields?.['Title'] || siteName,
        description: this.parent.fields?.['Subtitle'] || '',
        url,
        image,
        extras: {
          // telephone: this.parent.fields?.['Phone Number'] || "",
          // email: this.parent.fields?.['Email Address'] || "",
          // address: {
          //   "@type": "PostalAddress",
          //   streetAddress: this.parent.fields?.['Address'] || "",
          //   addressLocality: "Cape Town",
          //   addressRegion: "Western Cape",
          //   addressCountry: "ZA"
          // },
          // openingHours: this.parent.fields?.['Opening Hours'] 
          //   ? this.parent.fields['Opening Hours'].split('\n').map(line => line.trim())
          //   : []
        }
      })


      const products = this.filteredItems.map((item) => {

        const newItem = buildSchemaItem({
          type: "Product",
          url: item['SEO URL'] ? window.location.origin + item['SEO URL'] : null,
          name: item['Title'] || "",
          description: this.artworkDescription(item),
          image: item?.['Attachments']?.[0]?.thumbnails?.large?.url ? `${import.meta.env.VITE_API_PROXY_URL}${encodeURIComponent(item?.['Attachments']?.[0]?.thumbnails?.large?.url)}` : import.meta.env.VITE_API_DEFAULT_IMAGE,
          price: item['Price'] || "",
          extras: {
            category: item["Name (from Medium)"]?.[0]  || "",
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

      let image = import.meta.env.VITE_API_DEFAULT_IMAGE
      if (this.parent?.fields?.['Image']?.[0]?.url) {
        image = `${import.meta.env.VITE_API_PROXY_URL}${encodeURIComponent(this.parent?.fields?.['Image']?.[0]?.url)}`;
      }

     return buildSeoConfig({
        title: this.parent.fields?.['Title'],
        description: this.parent.fields?.['Subtitle'] || '',
        url,
        image: image || `${window.location.origin}/og-default.jpg`,
        siteName,
        type: this.parent.fields?.['SEO Type'],
        schema: this.seoLdJson
      });
    },

    seoConfigMasked() {
      const c = { ...this.seoConfig }
      c.script = ''
      return c
    }
  },

  watch: {
    /* Re-run filtering whenever the URL changes */
    '$route.params': {
      handler() {
        this.resetAndFetch()
      },
      deep: true
    }
  },

  methods: {
    priceBucket(price) {
      const p = Number(price || 0)
      if (p <= 5000) return 'bronze'
      if (p <= 10000) return 'silver'
      if (p <= 20000) return 'gold'
      return 'platinum'
    },
    artworkDescription(item) {
      const parts = []

      const medium = item["Name (from Medium)"]?.[0]
      if (medium) {
        parts.push(`A ${medium.toLowerCase()} artwork`)
      }

      const materials = Array.isArray(item['Name (from Materials)'])
        ? item['Name (from Materials)'].join(', ')
        : item['Name (from Materials)']
      if (materials) {
        parts.push(`made using ${materials}`)
      }

      if (item.Height && item.Width) {
        parts.push(`measuring ${item.Height} × ${item.Width} cm`)
      }

      if (item.Year) {
        parts.push(`created in ${item.Year}`)
      }

      // Capitalize first letter, add full stop
      return parts.length
        ? parts.join(', ').replace(/^./, c => c.toUpperCase()) + '.'
        : ''
    },

    getCount(optionValue, lookupKey) {
      if (!this.allRecords?.length) return 0;

      let subset = [...this.allRecords];

      const activeMedium = this.routeMedium;
      const activePrice = this.routePriceRange;
      const activeHeight = this.filterValsRef['Height Bracket'];
      const activeWidth = this.filterValsRef['Width Bracket'];

      const mediumMap = {
        'fine-art': 'Fine Art',
        'sculptural-works': 'Sculptural Works',
        'new-media': 'New Media',
        'merch-art': 'Merch Art'
      };

      // --------------------------
      // Apply all OTHER filters
      // --------------------------

      // Medium filter
      if (lookupKey !== 'medium' && activeMedium !== 'all-media') {
        const expected = mediumMap[activeMedium];
        subset = subset.filter(r =>
          (r['Name (from Medium)'] || []).includes(expected)
        );
      }

      // Price filter (derived from Price)
      if (lookupKey !== 'price' && activePrice !== 'all-price-ranges') {
        subset = subset.filter(r =>
          this.priceBucket(r.Price) === activePrice
        )
      }



      // Height
      if (lookupKey !== 'height' && activeHeight) {
        subset = subset.filter(r => r['Height Bracket'] === activeHeight);
      }

      // Width
      if (lookupKey !== 'width' && activeWidth) {
        subset = subset.filter(r => r['Width Bracket'] === activeWidth);
      }


      // --------------------------
      // COUNT FOR THIS SPECIFIC OPTION
      // --------------------------

      switch (lookupKey) {
        case 'medium':
          if (optionValue === 'all-media') return subset.length;
          return subset.filter(r =>
            (r['Name (from Medium)'] || []).includes(mediumMap[optionValue])
          ).length;

        case 'price':
          if (optionValue === 'all-price-ranges') return subset.length;
          return subset.filter(r =>
            this.priceBucket(r.Price) === optionValue
          ).length;


        case 'height':
          return optionValue
            ? subset.filter(r => r['Height Bracket'] === optionValue).length
            : subset.length;

        case 'width':
          return optionValue
            ? subset.filter(r => r['Width Bracket'] === optionValue).length
            : subset.length;
      }

      return 0;
    },

    slugify(str) {
      return String(str)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    },
    async fetchData() {
      this.loading = true

      /* Load once */
      if (!this.allRecords.length) {
        const res = await ArtworksBoundCache.FetchAll([], {
          view: "viwn7wDGK6yk5ZHOl"
        })
        this.allRecords = res.response.data.records
          .map(r => ({ id: r.id, ...r.fields }))
          .filter(r => !r.Hide)   // ignore items where Hide === true (or truthy)
      }

      let filtered = this.allRecords

      /* URL filters */
      const medium = this.routeMedium
      const price = this.routePriceRange

      if (medium !== 'all-media') {
        filtered = filtered.filter(r =>
          (r['Name (from Medium)'] || []).map(x => x.toLowerCase()).includes(medium.replace('-', ' '))
        )
      }

      if (price !== 'all-price-ranges') {
        filtered = filtered.filter(r =>
          this.priceBucket(r.Price) === price
        )
      }



      /* LOCAL filters */
      const h = this.filterValsRef['Height Bracket']
      const w = this.filterValsRef['Width Bracket']

      if (h) filtered = filtered.filter(r => r['Height Bracket'] === h)
      if (w) filtered = filtered.filter(r => r['Width Bracket'] === w)

      this.filteredItems = filtered
      this.totalFiltered = filtered.length

      this.loading = false
      this.$emit('loaded')
    },

    async resetAndFetch() {
      this.currentPage = 0
      await this.fetchData()
      this.scrollToResultsTop()
    },

    scrollToResultsTop() {
      this.$nextTick(() => {
        const el = this.$refs.resultsTop
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  },

  async mounted() {
    await this.fetchData()
  }
}
</script>
