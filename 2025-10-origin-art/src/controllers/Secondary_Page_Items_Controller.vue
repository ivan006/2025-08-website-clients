<template>
  <div class="row no-wrap">
    <!-- 🧭 Left Filter Panel -->
    <div class="col-12 col-md-3 bg-3ry-color q-pa-md">
      <h5 class="text-h5 text-1ry-color q-mb-md">Filter Artworks</h5>

      <q-input v-model="filterValsRef.search" label="Search by Title" filled dense @keyup.enter="fetchData" />
      <q-select
        v-model="filterValsRef['Media Category Name']"
        :options="['Fine Art', 'Sculptural Works', 'New Media']"
        label="Media Type"
        filled dense emit-value map-options
        class="q-mt-sm"
        @update:model-value="fetchData"
      />
      <q-select
        v-model="filterValsRef['Theme Name']"
        :options="['Decorative', 'Evocative']"
        label="Theme"
        filled dense emit-value map-options
        class="q-mt-sm"
        @update:model-value="fetchData"
      />
      <q-select
        v-model="filterValsRef['Artist Tier Name']"
        :options="['Gold Tier', 'Silver Tier', 'Bronze Tier']"
        label="Tier"
        filled dense emit-value map-options
        class="q-mt-sm"
        @update:model-value="fetchData"
      />

      <q-btn label="Apply Filters" color="primary" class="q-mt-md full-width" @click="fetchData" />
    </div>

    <!-- 🖼️ Artwork Grid -->
    <div class="col-12 col-md-9 bg-2ry-color q-pa-xl">
      <SEODataViewer :seoConfig="seoConfigMasked" :seoLdJson="seoLdJson" />

      <div v-if="loading" class="text-center q-pa-md">Loading...</div>
      <div v-else-if="!items.length" class="text-center q-pa-md text-2ry-color">No artworks found.</div>

      <div v-else class="row q-col-gutter-lg">
        <div v-for="art in items" :key="art.id" class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="bg-1ry-color text-1ry-color box-shadow-1ry">
            <q-img
              :src="art['Image'] ? `https://capetownlists.co.za/?url=${art['Image']}` : ''"
              ratio="1"
              class="rounded-borders"
            />
            <q-card-section>
              <div class="text-h6 font-1ry">{{ art.Title }}</div>
              <div class="text-subtitle2 text-2ry-color q-mt-xs">
                {{ art['Artist Name']?.[0] || 'Unknown Artist' }}
              </div>
              <div class="text-body1 q-mt-xs">R{{ art.Price?.toLocaleString() }}</div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat size="sm" color="primary" label="View Details" />
            </q-card-actions>
          </q-card>
        </div>
      </div>

      <div class="text-center q-mt-lg">
        <q-pagination
          v-model="options.page"
          :max="Math.ceil(totalItems / options.itemsPerPage)"
          max-pages="7"
          boundary-numbers
          @update:model-value="fetchData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Home_Page_Items from 'src/models/orm-api/Home_Page_Items'
import { createMetaMixin } from 'quasar'
import { buildSchemaItem, buildSeoConfig } from 'src/utils/seo'
import SEODataViewer from 'src/controllers/SEODataViewer.vue'

export default {
  name: 'Catalogue_Page',
  components: { SEODataViewer },
  mixins: [createMetaMixin(function () { return this.seoConfig })],
  data() {
    return {
      items: [],
      totalItems: 0,
      loading: false,
      filterValsRef: {},
      options: { page: 1, itemsPerPage: 12 },
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
          image: item['Image'] ? `https://capetownlists.co.za/?url=${item['Image']}` : '',
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
        const response = await Home_Page_Items.FetchAll([], this.filterValsRef, {}, {
          page: this.options.page,
          limit: this.options.itemsPerPage,
          filters: this.filterValsRef,
        })
        this.items = response.response.data.records.map((r) => ({ id: r.id, ...r.fields }))
        this.totalItems = response.response.data.total || this.items.length
      } catch (err) {
        console.error(err)
      }
      this.loading = false
    },
  },
  mounted() {
    this.fetchData()
  },
}
</script>
