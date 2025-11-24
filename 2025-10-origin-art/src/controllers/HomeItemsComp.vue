<template>
  <template v-if="loading">
    <div class="text-center q-pa-md">Loading...</div>
  </template>

  <template v-else-if="!items.length">
    <div class="text-center q-pa-md text-2ry-color">None</div>
  </template>

  <template v-else>

    
    <SEODataViewer :seoConfig="seoConfigMasked" :seoLdJson="seoLdJson" />
    <!-- LEVEL 1: MEDIA -->
    <div v-for="(tiers, mediaName) in groupedArtworks" :key="mediaName">

      <!-- Media Header -->
      <div class="bg-1ry-color q-py-lg">
        <div class="container-md">
          <h2 class="text-h3 text-center q-mt-xl font-1ry">
            {{ mediaName }}
          </h2>
        </div>
      </div>

      <!-- LEVEL 2: TIER -->
      <div v-for="(artists, tierName) in tiers" :key="tierName">
        
        <div class="bg-3ry-color">
          <div class="container-md q-py-lg">
            <h4 class="text-h4 text-center font-1ry text-white q-my-lg">
              {{ tierName }} - {{ mediaName }}
            </h4>
          </div>
        </div>

        <!-- LEVEL 3: ARTIST -->
        <div class="bg-2ry-color">
          <div class="container-md q-py-xl">

            
            <q-card
              v-for="(artworks, artistName) in artists"
              :key="artistName"
              flat
              class="q-pa-md q-mb-xl bg-1ry-color text-1ry-color"
              style="border-radius: 12px;"
            >

              <div class="row q-col-gutter-md items-center">

                <!-- Artist Info -->
                <div class="column items-center items-md-start col-12 col-md-3">
                  <h3 class="text-h5 q-mb-sm font-1ry">{{ artistName }}</h3>

                  <div class="text-body1 text-2ry-color q-mb-xs">
                    Tier:
                    <q-badge outline class="q-px-sm q-py-xs" style="border-radius: 8px;">
                      {{ tierName }}
                    </q-badge>
                  </div>

                  <q-btn flat size="md" class="q-mt-xs text-3ry-color" label="View All Works"/>
                </div>

                <!-- First 3 artworks -->
                <div
                  v-for="art in artworks.slice(0, 3)"
                  :key="art.id"
                  class="col-12 col-md-3"
                >
                  <!-- <img
                    :src="art.Attachments?.[0]?.thumbnails?.large?.url 
                            ? `https://capetownlists.co.za/?url=${encodeURIComponent(art.Attachments[0].thumbnails.large.url)}`
                            : art['Image Url']"
                    style="height: 200px; border-radius: 10px; width: 100%; object-fit: cover;"
                  > -->

                  <q-img
                    :src="largeUrl(art['Attachments'])"
                    :placeholder-src="smallUrl(art['Attachments'])"
                    ratio="1"
                    class="rounded-borders"
                    :style="{ height: cardHeight, objectFit: 'contain' }"
                    fit="contain"
                  />
                  <!-- <pre>{{ art }}</pre> -->

                  <div class="q-pt-sm text-center">
                    <div class="text-h6 font-1ry">{{ art.Title }}</div>
                    <div class="text-body1 text-2ry-color">R{{ art.Price.toLocaleString() }}</div>

                    <q-btn flat size="md" class="q-mt-xs text-3ry-color" label="Read More" />
                  </div>
                </div>

              </div>

            </q-card>

          </div>
        </div>

      </div>

    </div>

  </template>
</template>


<script>
import ArtworksBoundCache from 'src/models/orm-api/ArtworksBoundCache'
import { createMetaMixin } from 'quasar'
import { buildSchemaItem, buildSeoConfig } from 'src/utils/seo'
import SEODataViewer from 'src/controllers/SEODataViewer.vue'

export default {
  name: 'ArtistGroupedView',

  components: {
    SEODataViewer
  },

  mixins: [createMetaMixin(function () { return this.seoConfig })],

  data() {
    return {
      loading: false,
      items: []
    }
  },

  computed: {
    /* ---------------------- SEO JSON-LD ---------------------- */
    seoLdJson() {
      const products = this.items.map(item =>
        buildSchemaItem({
          type: 'Product',
          url: item['SEO URL'] ? window.location.origin + item['SEO URL'] : null,
          name: item.Title || '',
          description: item.Subtitle || '',
          image:
            item.Attachments?.[0]?.thumbnails?.large?.url ||
            item['Image Url'] ||
            '',
          price: item.Price
        })
      )

      return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: products
      }
    },

    /* ---------------------- SEO META ---------------------- */
    seoConfig() {
      const url =
        window.location.origin +
        (this.$route?.fullPath.split('#')[0] || '/')

      return buildSeoConfig({
        title: 'Artist Works',
        description: 'Browse grouped artworks by media, tier, and artist.',
        url,
        siteName: import.meta.env.VITE_API_SITE_TITLE
      })
    },

    seoConfigMasked() {
      const c = { ...this.seoConfig }
      c.script = ''
      return c
    },

    /* ---------------------- GROUPING LOGIC ---------------------- */
    groupedArtworks() {
      const MEDIA_ORDER = ["Fine Art", "Sculptural Works", "New Media", "Merch Art"]
      const TIER_ORDER = ["Gold", "Silver", "Bronze"]

      const result = {}

      this.items.forEach(art => {
        const medias = art["Name (from Medium)"] || []
        const tierRaw = art["Av. Price Tier (from Artist)"]
        const tier = Array.isArray(tierRaw) ? tierRaw[0] : tierRaw

        const artist = art["Name (from Artist)"]?.[0] || "Unknown Artist"

        medias.forEach(media => {
          // skip invalid media
          if (!MEDIA_ORDER.includes(media)) return 

          // skip invalid tier
          if (!TIER_ORDER.includes(tier)) return 

          if (!result[media]) result[media] = {}
          if (!result[media][tier]) result[media][tier] = {}
          if (!result[media][tier][artist]) result[media][tier][artist] = []

          result[media][tier][artist].push(art)
        })
      })

      // Sort media + tiers into the right order
      const sorted = {}

      MEDIA_ORDER.forEach(media => {
        if (result[media]) {
          sorted[media] = {}

          TIER_ORDER.forEach(tier => {
            if (result[media][tier]) {
              sorted[media][tier] = result[media][tier]
            }
          })
        }
      })

      return sorted
    }

  },

  methods: {
    largeUrl(u) {
      return u[0].thumbnails?.small?.url ? `https://capetownlists.co.za/?url=${encodeURIComponent(u[0].thumbnails?.large?.url)}` : "";
    },

    smallUrl(u) {
      return u[0].thumbnails?.small?.url ? `https://capetownlists.co.za/?url=${encodeURIComponent(u[0].thumbnails?.small?.url)}` : "";
    },
    async fetchData() {
      this.loading = true

      try {
        const res = await ArtworksBoundCache.FetchAll([], {
          view: 'viw4c8kfHaMDrB0aC'
        })

        this.items = res.response.data.records.map(r => ({
          id: r.id,
          ...r.fields
        }))
      } catch (err) {
        console.error('❌ Failed to load artworks:', err)
      }

      this.loading = false
      this.$emit('loaded')
    }
  },

  async mounted() {
    await this.fetchData()
  }
}
</script>

