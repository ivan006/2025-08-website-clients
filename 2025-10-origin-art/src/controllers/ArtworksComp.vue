<template> 
  <div class="container-mdx" style="border-bottom: 1px solid rgba(0,0,0,0.12);">
    <catalogue-layout>

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
            />
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
            />
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
            />
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
            />
          </q-expansion-item>
        </div>
      </template>

      <!-- CONTENT -->
      <template #content>

        <SEODataViewer :seoConfig="seoConfigMasked" :seoLdJson="seoLdJson" />

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

          <ArtworkPaginatedGrid
            :items="filteredItems"
            v-model:page="currentPage"
            :items-per-page="options.itemsPerPage"
          />

        </div>

      </template>

    </catalogue-layout>
  </div>
</template>

<script>
import ArtworksBoundCache from 'src/models/orm-api/ArtworksBoundCache'
import ArtworkPaginatedGrid from 'src/controllers/ArtworkPaginatedGrid.vue'

import { createMetaMixin } from 'quasar'
import { buildSchemaItem, buildSeoConfig } from 'src/utils/seo'

import SEODataViewer from 'src/controllers/SEODataViewer.vue'
import CatalogueLayout from 'src/controllers/CatalogueLayout.vue'

export default {
  name: 'ArtworksComp',

  components: {
    SEODataViewer,
    CatalogueLayout,
    ArtworkPaginatedGrid
  },

  mixins: [createMetaMixin(function () { return this.seoConfig })],

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
        { label: 'Large (Above 80cm)', value: 'Large' },
        { label: 'Medium (40cm-80cm)', value: 'Medium' },
        { label: 'Small (Below 40cm)', value: 'Small' }
      ],

      widthOptions: [
        { label: 'All', value: '' },
        { label: 'Large (Above 60cm)', value: 'Large' },
        { label: 'Medium (30cm-60cm)', value: 'Medium' },
        { label: 'Small (Below 30cm)', value: 'Small' }
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
        { label: 'Gold Tier (Above 30k)', value: 'gold' },
        { label: 'Silver Tier (12k-30k)', value: 'silver' },
        { label: 'Bronze Tier (Below 12k)', value: 'bronze' }
      ],




    }
  },

  computed: {
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


    seoLdJson() {
      const products = this.filteredItems.map(item =>
        buildSchemaItem({
          type: 'Product',
          url: item['SEO URL'] ? window.location.origin + item['SEO URL'] : null,
          name: item['Title'] || '',
          description: item['Subtitle'] || '',
          image: item.Attachments?.[0]?.thumbnails?.large?.url || item['Image Url'] || '',
          price: item['Price'],
        })
      )
      return { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: products }
    },

    seoConfig() {
      const url = window.location.origin + (this.$route?.fullPath.split('#')[0] || '/')
      return buildSeoConfig({
        title: 'Art Catalogue',
        description: 'Browse our collection of artworks across categories and styles.',
        url,
        siteName: import.meta.env.VITE_API_SITE_TITLE,
      })
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
        filtered = filtered.filter(r => r['Price Bracket'].toLowerCase() === price)
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
