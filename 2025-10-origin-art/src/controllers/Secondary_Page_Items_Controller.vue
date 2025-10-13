<template>
  <div class="container-mdx" style="border-bottom: 1px solid rgba(0, 0, 0, 0.12); ">
    <catalogue-layout>
      <template #filters>
        <div>
          <!-- 🎨 Media Type -->
          <q-expansion-item label="Media Type" class="text-weight-bold" default-opened>
            <q-option-group v-model="filterValsRef['Media Category Name']" :options="[
              { label: 'All', value: '' },
              { label: 'Fine Art', value: 'Fine Art' },
              { label: 'Sculptural Works', value: 'Sculptural Works' },
              { label: 'New Media', value: 'New Media' }
            ]" type="radio" @update:model-value="resetAndFetch" class="q-pb-md text-weight-regular" />
          </q-expansion-item>

          <q-separator />
          <!-- 🌈 Theme -->
          <q-expansion-item label="Style" class="text-weight-bold">
            <q-option-group v-model="filterValsRef['Theme Name']" :options="[
              { label: 'All', value: '' },
              { label: 'Decorative', value: 'Decorative' },
              { label: 'Evocative', value: 'Evocative' }
            ]" type="radio" @update:model-value="resetAndFetch" class="q-pb-md text-weight-regular" />
          </q-expansion-item>

          <q-separator />
          <!-- 🏅 Tier -->
          <q-expansion-item label="Budget" class="text-weight-bold">
            <q-option-group v-model="filterValsRef['Tier Category']" :options="[
              { label: 'All', value: '' },
              { label: 'Gold (Above 50k)', value: 'Gold Tier' },
              { label: 'Silver (10k-50k)', value: 'Silver Tier' },
              { label: 'Bronze (Below 10k)', value: 'Bronze Tier' }
            ]" type="radio" @update:model-value="resetAndFetch" class="q-pb-md text-weight-regular" />
          </q-expansion-item>
        </div>
      </template>

      <template #content>
        <SEODataViewer :seoConfig="seoConfigMasked" :seoLdJson="seoLdJson" />
          <pre>{{offsetTrail}}</pre>
        <div v-if="loading" class="text-center q-pa-md">Loading...</div>
        <div v-else-if="!items.length" class="text-center q-pa-md text-2ry-color">No artworks found.</div>

        <div v-else class="row q-col-gutter-lgx">
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

        <!-- ✅ Pagination buttons -->
        <div class="text-center q-mt-lg">
          <q-btn flat color="primary" label="Previous" icon="chevron_left" :disable="currentPage === 0"
            @click="prevPage" class="q-mr-sm" />
          <q-btn flat color="primary" label="Next" icon-right="chevron_right" :disable="!nextOffset"
            @click="nextPage" />
        </div>
      </template>
    </catalogue-layout>
  </div>
</template>

<script>
import Home_Page_Items from 'src/models/orm-api/Home_Page_Items'
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
      loading: false,
      filterValsRef: {
        'Media Category Name': '',
        'Theme Name': '',
        'Tier Category': '',
      },
      nextOffset: null,
      offsetTrail: [null], // stores offsets for back navigation
      currentPage: 0,
      options: { itemsPerPage: 12 },
    }
  },
  computed: {
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
    async fetchData(offset = null) {
      this.loading = true
      try {
        const filters = this.filterValsRef
        const parts = Object.entries(filters)
          .filter(([_, v]) => v)
          .map(([k, v]) => `({${k}}='${v.replace(/'/g, "\\'")}')`)
        const formula = parts.length ? `AND(${parts.join(',')})` : ''

        const response = await Home_Page_Items.FetchAll([], {}, {}, {
          limit: this.options.itemsPerPage,
          filters: formula ? { filterByFormula: formula } : {},
          offset, // 🔹 proper Airtable offset token
        })

        const data = response.response.data
        this.items = data.records.map((r) => ({ id: r.id, ...r.fields }))
        this.nextOffset = data.offset || null
      } catch (err) {
        console.error(err)
      }
      this.loading = false
      this.$emit('loaded')
    },

    async nextPage() {
      if (this.nextOffset) {
        // ✅ Save offset for back navigation
        this.offsetTrail.push(this.nextOffset)
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

    async resetAndFetch() {
      this.offsetTrail = [null]
      this.currentPage = 0
      await this.fetchData()
    },
  },

  mounted() {
    this.fetchData()
  },
}
</script>
