<template>
  <div class="container-mdx" style="border-bottom: 1px solid rgba(0,0,0,0.12);">
    <catalogue-layout>
      <!-- ✅ FILTERS -->
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
              />
            </q-expansion-item>
            <q-separator v-if="fIdx < filterGroups.length - 1" />
          </template>
        </div>
      </template>

      <!-- ✅ CONTENT -->
      <template #content>
        <SEODataViewer :seoConfig="seoConfigMasked" :seoLdJson="seoLdJson" />
        <div v-if="loading" class="text-center q-pa-md">Loading...</div>
        <div v-else-if="!items.length" class="text-center q-pa-md text-2ry-color">No artworks found.</div>
        <div v-else>
          <div class="text-center q-pa-sm text-1ry-color">
            {{ totalFiltered }} artworks found
          </div>

          <div class="row q-col-gutter-lgx">
            <div v-for="art in items" :key="art.id" class="col-6 col-md-2 q-pa-sm">
              <q-card flat bordered class="text-1ry-color box-shadow-1ry">
                <!-- <img
                  :src="art.Attachments?.[0]?.thumbnails?.large?.url || art['Image Url'] || ''"
                  ratio="1"
                  class="rounded-borders"
                /> -->
                <img :src="art.Attachments?.[0]?.thumbnails?.large?.url ? `https://capetownlists.co.za/?url=${encodeURIComponent(art.Attachments?.[0]?.thumbnails?.large?.url)}` : ''"
                  ratio="1" class="rounded-borders"  style=" height: 200px; object-fit: contain ;"/>
                <q-card-section>
                  <div class="text-h6 font-1ry" style="min-height: 64px;">{{ art.Title }}</div>
                  <div class="text-subtitle2 text-2ry-color q-mt-xs">
                    {{ art['Artist Name']?.[0] || 'Unknown Artist' }}
                  </div>
                  <div class="text-body1 q-mt-xs text-weight-bold">
                    R{{ art.Price?.toLocaleString() }}
                  </div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat size="sm" label="View Details" class="bg-1ry-color" />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </div>

        <!-- ✅ LOCAL PAGINATION -->
        <div class="text-center q-mt-lg flex flex-center q-gutter-sm">
          <q-btn flat color="primary" icon="chevron_left" label="Previous"
            :disable="currentPage === 0"
            @click="prevPage" />
          <div>
            <q-btn
              v-for="n in totalPages"
              :key="n"
              size="sm"
              flat
              round
              :label="n"
              :color="n - 1 === currentPage ? 'primary' : 'grey-6'"
              @click="goToPage(n - 1)"
            />
          </div>
          <q-btn flat color="primary" icon-right="chevron_right" label="Next"
            :disable="currentPage >= totalPages - 1"
            @click="nextPage" />
        </div>
      </template>
    </catalogue-layout>
  </div>
</template>

<script>
import Dry_Items from 'src/models/orm-api/Dry_Items'
import { createMetaMixin } from 'quasar'
import { buildSchemaItem, buildSeoConfig } from 'src/utils/seo'
import SEODataViewer from 'src/controllers/SEODataViewer.vue'
import CatalogueLayout from 'src/controllers/CatalogueLayout.vue'

export default {
  name: 'Tertiary_Page_Items_Controller',
  components: { SEODataViewer, CatalogueLayout },
  mixins: [createMetaMixin(function () { return this.seoConfig })],

  data() {
    return {
      allRecords: [],
      items: [],
      loading: false,
      totalFiltered: 0,
      currentPage: 0,
      options: { itemsPerPage: 12 },
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
            { label: 'Gold (Above 40k)', value: 'Gold' },
            { label: 'Silver (12k-40k)', value: 'Silver' },
            { label: 'Bronze (Below 12k)', value: 'Bronze' },
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
      ],
    }
  },

  computed: {
    totalPages() {
      return Math.ceil(this.totalFiltered / this.options.itemsPerPage)
    },
    seoLdJson() {
      const url = window.location.origin + (this.$route?.fullPath.split('#')[0] || '/')
      const products = this.items.map(item =>
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
    },
  },

  methods: {
    async fetchData() {
      this.loading = true
      try {
        // 🧩 Fetch bound cache once
        if (!this.allRecords.length) {
          const res = await Dry_Items.FetchAll()
          this.allRecords = res.response.data.records.map(r => ({ id: r.id, ...r.fields }))
          console.log('✅ Bound cache loaded:', this.allRecords.length)
        }

        // 🧩 Apply client-side filters
        const { 'Height Bracket': height, 'Width Bracket': width, 'Name (from Medium)': medium, 'Price Bracket': price } = this.filterValsRef

        let filtered = this.allRecords
        if (height) filtered = filtered.filter(r => r['Height Bracket'] === height)
        if (width) filtered = filtered.filter(r => r['Width Bracket'] === width)
        if (medium) filtered = filtered.filter(r => (r['Name (from Medium)'] || []).includes(medium))
        if (price) filtered = filtered.filter(r => r['Price Bracket'] === price)

        this.totalFiltered = filtered.length

        // 🧩 Local pagination
        const start = this.currentPage * this.options.itemsPerPage
        const end = start + this.options.itemsPerPage
        this.items = filtered.slice(start, end)
      } catch (err) {
        console.error('❌ Failed to load bound cache:', err)
      }
      this.loading = false
      this.$emit('loaded')
    },

    async nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++
        await this.fetchData()
      }
    },
    async prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--
        await this.fetchData()
      }
    },
    async goToPage(idx) {
      this.currentPage = idx
      await this.fetchData()
    },
    async resetAndFetch() {
      this.currentPage = 0
      await this.fetchData()
    },
  },

  async mounted() {
    await this.fetchData()
  },
}
</script>