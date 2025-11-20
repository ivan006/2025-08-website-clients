<template>
  <div class="container-mdx" style="border-bottom: 1px solid rgba(0,0,0,0.12);">
    <catalogue-layout>

      <!-- FILTERS -->
      <template #filters>
        <div>
          <template v-for="(filter, fIdx) in filterGroups" :key="fIdx">
            <q-expansion-item :label="filter.label" class="text-weight-bold" default-opened>

              <q-option-group
                v-model="filterValsRef[filter.lookup]"
                :options="filter.options"
                type="radio"
                @update:model-value="resetAndFetch"
                class="q-pb-md text-weight-regular"
              >
                <template v-slot:label="scope">
                  <div class="row items-center no-wrap justify-between q-gutter-x-sm">
                    <div>{{ scope.label }}</div>
                    <q-badge transparent align="middle" size="sm">
                      {{ getCount(scope.value, filter.lookup) }}
                    </q-badge>
                  </div>
                </template>
              </q-option-group>

            </q-expansion-item>

            <q-separator v-if="fIdx < filterGroups.length - 1" />
          </template>
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

          <!-- PAGINATED GRID -->
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

      filterValsRef: {
        'Height Bracket': '',
        'Width Bracket': '',
        'Name (from Medium)': '',
        'Price Bracket': '',
      },

      filterGroups: [
        {
          label: 'Medium',
          lookup: 'Name (from Medium)',
          options: [
            { label: 'All', value: '' },
            { label: 'Fine Art', value: 'Fine Art' },
            { label: 'Sculptural Works', value: 'Sculptural Works' },
            { label: 'New Media', value: 'New Media' },
            { label: 'Merch Art', value: 'Merch Art' },
          ],
        },
        {
          label: 'Price Range',
          lookup: 'Price Bracket',
          options: [
            { label: 'All', value: '' },
            { label: 'Gold Tier (Above 40k)', value: 'Gold' },
            { label: 'Silver Tier (12k-40k)', value: 'Silver' },
            { label: 'Bronze Tier (Below 12k)', value: 'Bronze' },
          ],
        },
        {
          label: 'Height',
          lookup: 'Height Bracket',
          options: [
            { label: 'All', value: '' },
            { label: 'Large (Above 80cm)', value: 'Large' },
            { label: 'Medium (40cm-80cm)', value: 'Medium' },
            { label: 'Small (Below 40cm)', value: 'Small' },
          ],
        },
        {
          label: 'Width',
          lookup: 'Width Bracket',
          options: [
            { label: 'All', value: '' },
            { label: 'Large (Above 60cm)', value: 'Large' },
            { label: 'Medium (30cm-60cm)', value: 'Medium' },
            { label: 'Small (Below 30cm)', value: 'Small' },
          ],
        },
      ]
    }
  },

  computed: {
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

  methods: {
    getCount(value, lookup) {
      if (!this.allRecords.length) return 0

      const current = this.filterValsRef

      const activeFilters = Object.entries(current)
        .filter(([key, val]) => key !== lookup && val)

      let subset = this.allRecords

      for (const [key, val] of activeFilters) {
        subset = subset.filter(r => {
          const field = r[key]
          if (Array.isArray(field)) return field.includes(val)
          return field === val
        })
      }

      if (value === '') return subset.length

      return subset.filter(r => {
        const field = r[lookup]
        if (Array.isArray(field)) return field.includes(value)
        return field === value
      }).length
    },

    async fetchData() {
      this.loading = true

      if (!this.allRecords.length) {
        const res = await ArtworksBoundCache.FetchAll()
        this.allRecords = res.response.data.records.map(r => ({ id: r.id, ...r.fields }))
      }

      const { 'Height Bracket': height, 'Width Bracket': width, 'Name (from Medium)': medium, 'Price Bracket': price } = this.filterValsRef

      let filtered = this.allRecords
      if (height) filtered = filtered.filter(r => r['Height Bracket'] === height)
      if (width) filtered = filtered.filter(r => r['Width Bracket'] === width)
      if (medium) filtered = filtered.filter(r => (r['Name (from Medium)'] || []).includes(medium))
      if (price) filtered = filtered.filter(r => r['Price Bracket'] === price)

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
