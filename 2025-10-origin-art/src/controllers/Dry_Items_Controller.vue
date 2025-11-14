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
              >
                <template v-slot:label="scope">
                  <div class="row items-center no-wrap justify-between q-gutter-x-sm">
                    <div>{{ scope.label }}</div>
                    <q-badge
                      transparent
                      align="middle"
                      size="sm"
                    >
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

      <!-- ✅ CONTENT -->
      <template #content>
        <SEODataViewer :seoConfig="seoConfigMasked" :seoLdJson="seoLdJson" />

        <div v-if="loading" class="text-center q-pa-md">Loading...</div>

        <div v-else-if="!items.length" class="text-center q-pa-md text-2ry-color">
          No artists found.
        </div>

        <div v-else>
          <div ref="resultsTop" class="text-center q-pa-sm text-1ry-color">
            {{ totalFiltered }} artists found
          </div>

          <div class="row items-center no-wrap">
            <!-- ◀️ Left Arrow -->
            <div v-if="!$q.screen.lt.md" class="col-auto q-pr-sm">
              <q-btn
                flat round color="primary" icon="chevron_left" size="lg"
                @click="prevPage" :disable="currentPage === 0"
              />
            </div>

            <!-- 🖼️ Grid -->
            <div class="col">
              <div class="row q-col-gutter-lgx justify-center">
                <div v-for="artist in items" :key="artist.id" class="col-6 col-md-3 q-pa-sm">
                  <q-card flat bordered class="text-1ry-color box-shadow-1ry">

                    <q-img
                      :src="artist.Attachments?.[0]?.thumbnails?.large?.url
                        ? `https://capetownlists.co.za/?url=${encodeURIComponent(artist.Attachments?.[0]?.thumbnails?.large?.url)}`
                        : ''"
                      :placeholder-src="artist.Attachments?.[0]?.thumbnails?.small?.url
                        ? `https://capetownlists.co.za/?url=${encodeURIComponent(artist.Attachments?.[0]?.thumbnails?.small?.url)}`
                        : ''"
                      ratio="1"
                      class="rounded-borders"
                      :style="{ height: $q.screen.lt.md ? '150px' : '250px', objectFit: 'cover' }"
                      fit="cover"
                    />

                    <q-card-section>
                      <div class="text-h6 font-1ry" style="min-height: 64px;">
                        {{ artist.Name }}
                      </div>

                      <div class="text-subtitle2 text-2ry-color q-mt-xs">
                        {{ artist['Count (Art)'] }} artworks
                      </div>

                      <div class="text-body1 q-mt-xs text-weight-bold">
                        Avg Price: R{{ artist['Av. Price']?.toLocaleString() || '–' }}
                      </div>
                    </q-card-section>

                    <q-card-actions align="right">
                      <q-btn flat size="sm" label="View Profile" class="bg-1ry-color" />
                    </q-card-actions>
                  </q-card>
                </div>
              </div>
            </div>

            <!-- ▶️ Right Arrow -->
            <div v-if="!$q.screen.lt.md" class="col-auto q-pl-sm">
              <q-btn
                flat round color="primary" icon="chevron_right" size="lg"
                @click="nextPage" :disable="currentPage >= totalPages - 1"
              />
            </div>
          </div>
        </div>

        <!-- LOCAL PAGINATION -->
        <div class="text-center q-mt-lg flex flex-center q-gutter-sm">
          <q-btn flat color="primary" icon="chevron_left" label="Previous"
            :disable="currentPage === 0" @click="prevPage" />

          <div>
            <q-btn
              v-for="n in totalPages"
              :key="n"
              size="sm" flat round
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
import Ery_Items from 'src/models/orm-api/Ery_Items'
import { createMetaMixin } from 'quasar'
import { buildSchemaItem, buildSeoConfig } from 'src/utils/seo'
import SEODataViewer from 'src/controllers/SEODataViewer.vue'
import CatalogueLayout from 'src/controllers/CatalogueLayout.vue'

export default {
  name: 'ArtistsController',
  components: { SEODataViewer, CatalogueLayout },
  mixins: [createMetaMixin(function () { return this.seoConfig })],

  data() {
    return {
      allRecords: [],
      items: [],
      loading: false,
      totalFiltered: 0,
      currentPage: 0,
      options: { itemsPerPage: 8 },

      filterValsRef: {
        Media: '',
        'Av. Price Tier': '',
      },

      filterGroups: [
        {
          label: 'Media',
          lookup: 'Media',
          options: [
            { label: 'All', value: '' },
            { label: 'Fine Art', value: 'Fine Art' },
            { label: 'Sculpture', value: 'Sculpture' },
            { label: 'New Media', value: 'New Media' },
          ],
        },
        {
          label: 'Avg. Price Tier',
          lookup: 'Av. Price Tier',
          options: [
            { label: 'All', value: '' },
            { label: 'Gold (40k+)', value: 'Gold' },
            { label: 'Silver (12k–40k)', value: 'Silver' },
            { label: 'Bronze (<12k)', value: 'Bronze' },
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
      const artists = this.items.map(a =>
        buildSchemaItem({
          type: 'Person',
          name: a.Name,
          image: a.Attachments?.[0]?.thumbnails?.large?.url || '',
          description: `${a['Count (Art)']} artworks`,
        })
      )

      return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: artists,
      }
    },

    seoConfig() {
      const url = window.location.origin + (this.$route?.fullPath.split('#')[0] || '/')
      return buildSeoConfig({
        title: 'Artist Catalogue',
        description: 'Browse our list of artists.',
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
      if (!this.allRecords.length) return 0;

      const current = this.filterValsRef;

      // Apply other filters first
      let subset = this.allRecords;
      for (const [key, val] of Object.entries(current)) {
        if (key === lookup || !val) continue;

        subset = subset.filter(r =>
          Array.isArray(r[key])
            ? r[key].includes(val)
            : r[key] === val
        );
      }

      if (value === '') return subset.length;

      return subset.filter(r =>
        Array.isArray(r[lookup])
          ? r[lookup].includes(value)
          : r[lookup] === value
      ).length;
    },

    async fetchData() {
      this.loading = true;
      try {
        if (!this.allRecords.length) {
          const res = await Ery_Items.FetchAll()
          this.allRecords = res.response.data.records.map(r => ({ id: r.id, ...r.fields }))
        }

        const { Media, 'Av. Price Tier': tier } = this.filterValsRef

        let filtered = this.allRecords

        if (Media)
          filtered = filtered.filter(r => (r.Media || []).includes(Media))

        if (tier)
          filtered = filtered.filter(r => r['Av. Price Tier'] === tier)

        this.totalFiltered = filtered.length

        const start = this.currentPage * this.options.itemsPerPage
        const end = start + this.options.itemsPerPage
        this.items = filtered.slice(start, end)
      } catch (err) {
        console.error('❌ Failed to load artists:', err)
      }

      this.loading = false
      this.$emit('loaded')
    },

    async nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++
        await this.fetchData()
        this.scrollToResultsTop()
      }
    },

    async prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--
        await this.fetchData()
        this.scrollToResultsTop()
      }
    },

    async goToPage(idx) {
      this.currentPage = idx
      await this.fetchData()
      this.scrollToResultsTop()
    },

    scrollToResultsTop() {
      this.$nextTick(() => {
        const el = this.$refs.resultsTop
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    },

    async resetAndFetch() {
      this.currentPage = 0
      await this.fetchData()
      this.scrollToResultsTop()
    },
  },

  async mounted() {
    await this.fetchData()
  },
}
</script>
