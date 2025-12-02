<template>
  <div class="container-mdx" style="border-bottom: 1px solid rgba(0,0,0,0.12);">
    <catalogue-layout>

      <!-- 🔎 FILTERS -->
      <template #filters>
        <div>


          <!-- SEARCH -->
          <q-expansion-item label="Search Name" class="text-weight-bold" default-opened>
            <div class="q-pa-md">
              <q-input
                v-model="filterValsRef.search"
                outlined
                debounce="250"
                placeholder="Type artist name..."
                @update:model-value="resetAndFetch"
              />
            </div>
          </q-expansion-item>

          <!-- Other Filters -->
          <!-- ARTIST TYPE -->
          <q-expansion-item label="Artist Type" class="text-weight-bold" default-opened>
            <q-option-group
              v-model="routeArtistType"
              :options="artistTypeOptions"
              type="radio"
              @update:model-value="resetAndFetch"
              class="q-pb-md text-weight-regular"
            />
          </q-expansion-item>

          <q-separator />

          <!-- ARTIST LEVEL -->
          <q-expansion-item label="Artist Level" class="text-weight-bold" default-opened>
            <q-option-group
              v-model="routeArtistLevel"
              :options="artistLevelOptions"
              type="radio"
              @update:model-value="resetAndFetch"
              class="q-pb-md text-weight-regular"
            />
          </q-expansion-item>

          <q-separator />

        </div>
      </template>

      <!-- 🔥 CONTENT -->
      <template #content>
        <SEODataViewer :seoConfig="seoConfigMasked" :seoLdJson="seoLdJson" />

        <div v-if="loading" class="text-center q-pa-md">Loading...</div>

        <div v-else-if="!filteredItems.length" class="text-center q-pa-md text-2ry-color">
          No artists found.
        </div>

        <div v-else>
          <div ref="resultsTop" class="text-center q-pa-sm text-1ry-color">
            {{ totalFiltered }} artists found
          </div>

          <ItemsPaginatedGrid
            :items="filteredItems"
            v-model:page="currentPage"
            :items-per-page="options.itemsPerPage"
          >
            <template #item="{ item }">
              <ArtistCard :artist="item" />
            </template>
          </ItemsPaginatedGrid>
        </div>

      </template>

    </catalogue-layout>
  </div>
</template>

<script>
import ArtistsBoundCache from 'src/models/orm-api/ArtistsBoundCache'
import { createMetaMixin } from 'quasar'
import { buildSchemaItem, buildSeoConfig } from 'src/utils/seo'
import SEODataViewer from 'src/controllers/SEODataViewer.vue'
import CatalogueLayout from 'src/controllers/CatalogueLayout.vue'
import ItemsPaginatedGrid from 'src/controllers/ItemsPaginatedGrid.vue'
import ArtistCard from 'src/controllers/ArtistCard.vue'

export default {
  name: 'ArtistsComp',
  components: { 
    SEODataViewer, 
    CatalogueLayout,
    ArtistCard,
    ItemsPaginatedGrid,
  },
  mixins: [createMetaMixin(function () { return this.seoConfig })],

  data() {
    return {
      attachmentMap: {
        'Fine Art': 'Attachments_FA',
        'New Media': 'Attachments_NM',
        'Sculptural Works': 'Attachments_SW',
        'Merch Art': 'Attachments_MA',
      },
      allRecords: [],
      filteredItems: [],
      loading: false,
      totalFiltered: 0,
      currentPage: 0,
      options: { itemsPerPage: 8 },

      filterValsRef: {
        search: '',
        Media: '',
        'Av. Price Tier': '',
      },

    artistTypeOptions: [
      { label: 'All', value: 'all-types' },
      { label: 'Fine Artists', value: 'fine-art' },
      { label: 'Sculptors', value: 'sculptural-works' },
      { label: 'New Media Artists', value: 'new-media' },
      { label: 'Merch Artists', value: 'merch-art' },
    ],

    artistLevelOptions: [
      { label: 'All', value: 'all-levels' },
      { label: 'Established (40k+)', value: 'gold' },
      { label: 'Mid-Career (12k–40k)', value: 'silver' },
      { label: 'Emerging (<12k)', value: 'bronze' },
    ],
    }
  },

  computed: {
    routeArtistType: {
      get() {
        return this.$route.params.artistType || 'all-types'
      },
      set(val) {
        this.$router.push({
          params: {
            ...this.$route.params,
            artistType: val
          }
        })
      }
    },

    routeArtistLevel: {
      get() {
        return this.$route.params.artistLevel || 'all-levels'
      },
      set(val) {
        this.$router.push({
          params: {
            ...this.$route.params,
            artistLevel: val
          }
        })
      }
    },


    totalPages() {
      return Math.ceil(this.totalFiltered / this.options.itemsPerPage)
    },

    seoLdJson() {
      const artists = this.filteredItems.map(a =>
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

  watch: {
    '$route.params': {
      handler() {
        this.resetAndFetch()
      },
      deep: true
    }

  },

  methods: {
    goToSingle(artist) {
      const slug = this.slugify(artist.Name || 'artist');
      this.$router.push(`/artists/${artist.id}/${slug}`);
    },

    slugify(text) {
      return text
        ?.toString()
        .toLowerCase()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w-]+/g, '')     // Remove non-word characters
        .replace(/--+/g, '-')        // Merge multiple -
        .replace(/^-+|-+$/g, '');    // Trim - from start/end
    },
    getArtistImage(artist) {
      const selected = this.filterValsRef.Media

      // If no media selected → fallback to default Attachments
      if (!selected) {
        return artist.Attachments?.[0] || null
      }

      // Find matching field column for selected media
      const field = this.attachmentMap[selected]

      // If this media-type column exists and has images → use it
      const imgs = artist[field]
      if (imgs && imgs.length > 0) {
        return imgs[0]
      }

      // Otherwise use the default Attachments
      return artist.Attachments?.[0] || null
    },

    /* 🔍 Token-based search */
    matchesTokenSearch(name, query) {
      if (!query) return true;

      const nameTokens = (name || '').toLowerCase().split(/\s+/);
      const queryTokens = query.toLowerCase().split(/\s+/);

      return queryTokens.every(qt =>
        nameTokens.some(nt => nt.includes(qt))
      );
    },

    getCount(value, lookup) {
      if (!this.allRecords.length) return 0;

      const current = this.filterValsRef;

      let subset = this.allRecords;

      // Apply other filters except the one we're counting
      for (const [key, val] of Object.entries(current)) {
        if (key === lookup || !val || key === 'search') continue;

        subset = subset.filter(r =>
          Array.isArray(r[key])
            ? r[key].includes(val)
            : r[key] === val
        );
      }

      // Apply search filter separately
      if (current.search) {
        subset = subset.filter(r =>
          this.matchesTokenSearch(r.Name, current.search)
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
          const res = await ArtistsBoundCache.FetchAll()
          this.allRecords = res.response.data.records.map(r => ({ id: r.id, ...r.fields }))
        }

        let filtered = this.allRecords;

        const search = this.filterValsRef.search

        const type = this.routeArtistType     // slug
        const level = this.routeArtistLevel   // slug

        // Artist Type → Media lookup
        if (type !== 'all-types') {
          const humanReadable = {
            'fine-art': 'Fine Art',
            'sculptural-works': 'Sculptural Works',
            'new-media': 'New Media',
            'merch-art': 'Merch Art'
          }[type]

          filtered = filtered.filter(r => (r.Media || []).includes(humanReadable))
        }

        // Artist Level → tier lookup
        if (level !== 'all-levels') {
          const tierMap = {
            gold: 'Gold',
            silver: 'Silver',
            bronze: 'Bronze'
          }[level]

          filtered = filtered.filter(r => r['Av. Price Tier'] === tierMap)
        }

        // search
        if (search) {
          filtered = filtered.filter(r =>
            this.matchesTokenSearch(r.Name, search)
          )
        }




        this.filteredItems = filtered
        this.totalFiltered = filtered.length;
      } catch (err) {
        console.error('❌ Failed to load artists:', err)
      }

      this.loading = false
      this.$emit('loaded')
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
