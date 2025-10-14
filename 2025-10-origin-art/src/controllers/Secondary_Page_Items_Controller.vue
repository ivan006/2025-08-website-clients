<template>
  <div class="container-mdx" style="border-bottom: 1px solid rgba(0, 0, 0, 0.12);">
    <catalogue-layout>
      <template #filters>
        <div>
          <template v-for="(filter, fIdx) in filterGroups" :key="fIdx">
            <q-expansion-item
              :label="filter.label"
              class="text-weight-bold"
              default-opened
            >
              <q-option-group
                v-model="filterValsRef[filter.lookup]"
                :options="filter.options"
                type="radio"
                @update:model-value="resetAndFetch"
                class="q-pb-md text-weight-regular"
              >
                <template v-slot:label="scope">
                  <div class="text-body1">{{ scope.label }}</div>
                    <q-badge
                      v-if="scope.modelValue !== scope.value"
                      color="grey-5"
                      transparent
                      align="middle"
                      class="q-ml-sm"
                    >
                      {{ getCount(scope.value, filter.lookup) }}
                    </q-badge>
                  <!-- {{ scope }} -->
                  
                </template>
              </q-option-group>
            </q-expansion-item>

            <q-separator v-if="fIdx < filterGroups.length - 1" />
          </template>
        </div>
      </template>



      <template #content>
        <SEODataViewer :seoConfig="seoConfigMasked" :seoLdJson="seoLdJson" />
        <!-- <pre>{{ offsetTrail }}</pre> -->
        <div v-if="loading" class="text-center q-pa-md">Loading...</div>
        <div v-else-if="!items.length" class="text-center q-pa-md text-2ry-color">No artworks found.</div>
        <div v-else >
          <div class="text-center q-pa-sm text-1ry-color">
            {{ currentRecordCount }} artworks found
          </div>

          <div class="row q-col-gutter-lgx">
            <div v-for="art in items" :key="art.id" class="col-6 col-md-2 q-pa-sm">
              <q-card flat bordered class="text-1ry-color box-shadow-1ry">
                <img :src="art['Image'] ? `https://capetownlists.co.za/?url=${encodeURIComponent(art['Image'])}` : ''"
                  ratio="1" class="rounded-borders" />
                <q-card-section>
                  <div class="text-h6 font-1ry" style="min-height: 64px;">{{ art.Title }}</div>
                  <div class="text-subtitle2 text-2ry-color q-mt-xs">
                    {{ art['Artist Name']?.[0] || 'Unknown Artist' }}
                  </div>
                  <div class="text-body1 q-mt-xs text-weight-bold">R{{ art.Price?.toLocaleString() }}</div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat size="sm" label="View Details" class="bg-1ry-color" />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </div>

        <!-- ✅ Smart Pagination -->
        <div class="text-center q-mt-lg flex flex-center q-gutter-sm">
          <q-btn flat color="primary" icon="chevron_left" label="Previous" :disable="currentPage === 0"
            @click="prevPage" />

          <div>
            <q-btn v-for="(off, idx) in offsetTrail" :key="idx" size="sm" flat round :label="idx + 1"
              :color="idx === currentPage ? 'primary' : 'grey-6'" @click="goToPage(idx)" />
          </div>

          <q-btn flat color="primary" icon-right="chevron_right" label="Next" :disable="!nextOffset"
            @click="nextPage" />
        </div>
      </template>
    </catalogue-layout>
  </div>
</template>

<script>
import Secondary_Page_Items from 'src/models/orm-api/Secondary_Page_Items'
import Tertiary_Page_Items from 'src/models/orm-api/Tertiary_Page_Items' // 👈 new
import { createMetaMixin } from 'quasar'
import { buildSchemaItem, buildSeoConfig } from 'src/utils/seo'
import SEODataViewer from 'src/controllers/SEODataViewer.vue'
import CatalogueLayout from 'src/controllers/CatalogueLayout.vue'

export default {
  name: 'Catalogue_Page',
  components: { SEODataViewer, CatalogueLayout },
  mixins: [createMetaMixin(function () { return this.seoConfig })],
  data() {
    return {
      items: [],
      recordCounts: [], // 👈 stores 48 count records
      loading: false,
      filterValsRef: {
        'Media Category Name': 'Fine Art',
        'Theme Name': 'Evocative',
        'Tier Category': 'Gold Tier',
      },
      nextOffset: null,
      offsetTrail: [null],
      currentPage: 0,
      options: { itemsPerPage: 60 },
      filterGroups: [
        {
          label: 'Media Type',
          lookup: 'Media Category Name',
          table: 'Media Category',
          options: [
            { label: 'Fine Art', value: 'Fine Art' },
            { label: 'Sculptural Works', value: 'Sculptural Works' },
            { label: 'New Media', value: 'New Media' },
          ],
        },
        {
          label: 'Style',
          lookup: 'Theme Name',
          table: 'Art Theme',
          options: [
            { label: 'Evocative', value: 'Evocative' },
            { label: 'Decorative', value: 'Decorative' },
          ],
        },
        {
          label: 'Budget',
          lookup: 'Tier Category',
          table: 'Artist Tiers',
          options: [
            { label: 'Gold (Above 50k)', value: 'Gold Tier' },
            { label: 'Silver (10k-50k)', value: 'Silver Tier' },
            { label: 'Bronze (Below 10k)', value: 'Bronze Tier' },
          ],
        },
      ],

    }
  },

  computed: {
    // 👇 Finds the current combination’s precomputed total
    currentRecordCount() {
      const media = this.filterValsRef['Media Category Name']
      const theme = this.filterValsRef['Theme Name']
      const tier = this.filterValsRef['Tier Category']

      return this.recordCounts.find(r => {
        const f = r.fields
        const mediaNames = f['Name (from Media Category)'] || []
        const themeNames = f['Name (from Art Theme)'] || []
        const tierNames  = f['Name (from Artist Tiers)'] || []

        const mediaMatch = media ? mediaNames.includes(media) : mediaNames.length === 0
        const themeMatch = theme ? themeNames.includes(theme) : themeNames.length === 0
        const tierMatch  = tier  ? tierNames.includes(tier)  : tierNames.length === 0

        return mediaMatch && themeMatch && tierMatch
      })?.fields['Record Count'] || 0
    },



    seoLdJson() {
      const url = window.location.origin + (this.$route?.fullPath.split('#')[0] || '/')
      const products = this.items.map((item) =>
        buildSchemaItem({
          type: 'Product',
          url: item['SEO URL'] ? window.location.origin + item['SEO URL'] : null,
          name: item['Title'] || '',
          description: item['Subtitle'] || '',
          image: item['Image'] ? `https://capetownlists.co.za/?url=${encodeURIComponent(item['Image'])}` : '',
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
    
    getCount(value, lookup) {
      // optional badge logic — replace with your real recordCounts if you want
      const rec = this.recordCounts.find(r =>
        (r.fields[`Name (from ${lookup})`] || []).includes(value)
      )
      return rec ? rec.fields['Record Count'] : 0
    },
    async fetchRecordCounts() {
      try {
        
        const res = await Tertiary_Page_Items.FetchAll([], {}, {}, { limit: 100 })
        this.recordCounts = res.response.data.records
        console.log('✅ Record counts loaded:', this.recordCounts.length)
      } catch (err) {
        console.error('❌ Failed to load record counts:', err)
      }
    },

    async fetchData(offset = null) {
      this.loading = true
      try {
        const filters = this.filterValsRef
        const parts = Object.entries(filters)
          .filter(([_, v]) => v)
          .map(([k, v]) => `({${k}}='${v.replace(/'/g, "\\'")}')`)
        const formula = parts.length ? `AND(${parts.join(',')})` : ''

        const response = await Secondary_Page_Items.FetchAll([], {}, {}, {
          limit: this.options.itemsPerPage,
          filters: formula ? { filterByFormula: formula } : {},
          offset,
        })

        const data = response.response.data
        this.items = data.records.map((r) => ({ id: r.id, ...r.fields }))
        const newOffset = data.offset || null
        this.nextOffset = newOffset

        if (newOffset && !this.offsetTrail.includes(newOffset)) {
          this.offsetTrail.push(newOffset)
        }

        console.log(`Page ${this.currentPage + 1} → Offset:`, offset, '→ Next:', newOffset)
      } catch (err) {
        console.error(err)
      }
      this.loading = false
      this.$emit('loaded')
    },

    async nextPage() {
      if (this.nextOffset) {
        this.currentPage++
        await this.fetchData(this.nextOffset)
      }
    },

    async prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--
        const prevOffset = this.offsetTrail[this.currentPage]
        await this.fetchData(prevOffset)
      }
    },

    async goToPage(pageIndex) {
      this.currentPage = pageIndex
      const offset = this.offsetTrail[pageIndex]
      await this.fetchData(offset)
    },

    async resetAndFetch() {
      this.offsetTrail = [null]
      this.currentPage = 0
      await this.fetchData()
    },
  },

  async mounted() {
    await this.fetchRecordCounts() // 👈 prefetch count table once
    await this.fetchData()
  },
}
</script>
