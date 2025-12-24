<template>
  <div class="container-mdx" style="">
    <SitemapComp :items="sitemapItems" />
    <SEODataViewer :seoConfig="seoConfigMasked" :seoLdJson="seoLdJson" />
    <catalogue-layout
      :mobileTitle="mobileFiltersLabel"
    >

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
            >
              <template v-slot:label="scope">
                <div class="row items-center no-wrap justify-between q-gutter-x-sm">
                  <div>{{ scope.label }}</div>

                  <q-badge
                    transparent
                    align="middle"
                    size="sm"
                    class="bg-grey-7 text-white"
                  >
                    {{ getCount(scope.value, 'type') }}
                  </q-badge>
                </div>
              </template>
            </q-option-group>
          </q-expansion-item>



          <!-- <q-separator /> -->

          <!-- ARTIST LEVEL -->
          <!-- <q-expansion-item label="Artist Level" class="text-weight-bold" default-opened>
            <q-option-group
              v-model="routeArtistLevel"
              :options="artistLevelOptions"
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
                    class="bg-grey-7 text-white"
                  >
                    {{ getCount(scope.value, 'level') }}
                  </q-badge>
                </div>
              </template>
            </q-option-group>
          </q-expansion-item> -->



          <!-- <q-separator /> -->

        </div>
      </template>

      <!-- 🔥 CONTENT -->
      <template #content>

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
import SitemapComp from 'src/controllers/SitemapComp.vue'

export default {
  name: 'ArtistsComp',
  components: { 
    SEODataViewer, 
    CatalogueLayout,
    ArtistCard,
    ItemsPaginatedGrid,
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
      attachmentMap: {
        'Fine Art': 'Attachments_FA',
        'New Media': 'Attachments_NM',
        'Sculptural Works': 'Attachments_SW',
        'Merch Art': 'Attachments_MA',
      },
      allRecords: [],
      filteredItems: [],
      routeArtistLevel: "all-price-ranges",
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
      { label: 'All', value: 'all-media' },
      { label: 'Fine Artists', value: 'fine-art' },
      { label: 'Sculptors', value: 'sculptural-works' },
      { label: 'New Media Artists', value: 'new-media' },
      { label: 'Merch Artists', value: 'merch-art' },
    ],

    artistLevelOptions: [
      { label: 'All', value: 'all-price-ranges' },
      { label: 'Established (40k+)', value: 'gold' },
      { label: 'Mid-Career (12k–40k)', value: 'silver' },
      { label: 'Emerging (<12k)', value: 'bronze' },
    ],
    }
  },

  computed: {
    sitemapItems() {
      // const start = performance.now()

      const result = this.filteredItems.map(item => {
        const slug = String(item.Name || 'artist')
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .replace(/--+/g, '-')
          .replace(/^-+|-+$/g, '')

        return {
          url: `${window.location.origin}/artists/${item.id}/${slug}/`,
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

      if (this.filterValsRef.search?.trim()) parts.push('Search');
      if (this.routeArtistType !== 'all-media') parts.push('Artist Type');
      if (this.routeArtistLevel !== 'all-price-ranges') parts.push('Artist Level');

      if (parts.length === 0) return '';
      if (parts.length === 1) return `1 Selected Filter`;
      return `${parts.length} Selected Filters`;
    },
    routeArtistType: {
      get() {
        return this.$route.params.artistType || 'all-media'
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

    // routeArtistLevel: {
    //   get() {
    //     return this.$route.params.artistLevel || 'all-price-ranges'
    //   },
    //   set(val) {
    //     this.$router.push({
    //       params: {
    //         ...this.$route.params,
    //         artistLevel: val
    //       }
    //     })
    //   }
    // },


    totalPages() {
      return Math.ceil(this.totalFiltered / this.options.itemsPerPage)
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
        description: this.parent.fields?.['Subtitle'] || "",
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
          type: "Person",
          url: item['SEO URL'] ? window.location.origin + item['SEO URL'] : null,
          name: item['Name'] || "",
          description: item?.['artist:artist_statement'] ? this.truncate(item?.['artist:artist_statement'], 500) : "",
          image: item?.['Attachments']?.[0]?.thumbnails?.large?.url ? `${import.meta.env.VITE_API_PROXY_URL}${encodeURIComponent(item?.['Attachments']?.[0]?.thumbnails?.large?.url)}` : import.meta.env.VITE_API_DEFAULT_IMAGE,
          // price: item['Price'] || "broo...",
          // extras: {
          //   category: item["Name (from Medium)"]?.[0]  || "",
          // }
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
        description: this.parent.fields?.['Subtitle'] || "",
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
    
    truncate(text, limit = 1000) {
      if (!text) return "";
      return text.length > limit ? text.slice(0, limit) + "..." : text;
    },
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

    getCount(optionValue, lookupKey) {
      if (!this.allRecords?.length) return 0;

      const search = this.filterValsRef?.search?.toLowerCase() || '';

      // Start with all records
      let subset = [...this.allRecords];

      const activeType = this.routeArtistType;
      const activeLevel = this.routeArtistLevel;

      /* -------------------------------
      APPLY ACTIVE FILTERS (except the one being counted)
      ------------------------------- */

      // If counting ARTIST TYPE, ignore activeType
      if (lookupKey !== 'type' && activeType !== 'all-media') {
        const map = {
          'fine-art': 'Fine Art',
          'sculptural-works': 'Sculptural Works',
          'new-media': 'New Media',
          'merch-art': 'Merch Art'
        };

        const expected = map[activeType];
        subset = subset.filter(r => (r.Media || []).includes(expected));
      }

      // If counting ARTIST LEVEL, ignore activeLevel
      if (lookupKey !== 'level' && activeLevel !== 'all-price-ranges') {
        const tierMap = {
          gold: 'Gold',
          silver: 'Silver',
          bronze: 'Bronze'
        };

        const expected = tierMap[activeLevel];
        subset = subset.filter(r => r['Av. Price Tier'] === expected);
      }

      // Apply search filter
      if (search) {
        subset = subset.filter(r =>
          (r.Name || '').toLowerCase().includes(search)
        );
      }

      /* -------------------------------
      CALCULATE COUNT FOR THIS OPTION
      ------------------------------- */

      // All option returns the whole subset
      if (optionValue === 'all-media' || optionValue === 'all-price-ranges') {
        return subset.length;
      }

      // Count for specific ARTIST TYPE
      if (lookupKey === 'type') {
        const map = {
          'fine-art': 'Fine Art',
          'sculptural-works': 'Sculptural Works',
          'new-media': 'New Media',
          'merch-art': 'Merch Art'
        };

        const expected = map[optionValue];
        return subset.filter(r => (r.Media || []).includes(expected)).length;
      }

      // Count for specific ARTIST LEVEL
      if (lookupKey === 'level') {
        const tierMap = {
          gold: 'Gold',
          silver: 'Silver',
          bronze: 'Bronze'
        };

        const expected = tierMap[optionValue];
        return subset.filter(r => r['Av. Price Tier'] === expected).length;
      }

      return 0;
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
        if (type !== 'all-media') {
          const humanReadable = {
            'fine-art': 'Fine Art',
            'sculptural-works': 'Sculptural Works',
            'new-media': 'New Media',
            'merch-art': 'Merch Art'
          }[type]

          filtered = filtered.filter(r => (r.Media || []).includes(humanReadable))
        }

        // Artist Level → tier lookup
        if (level !== 'all-price-ranges') {
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
