<template>
  <div v-if="loading" class="text-center q-pa-xl">
    Loading...
  </div>

  <template v-else>

    <q-card flat borderedx>

      <!-- ===================== -->
      <!-- ARTIST SUMMARY ROW    -->
      <!-- ===================== -->

      <div class="row items-center justify-center">
        <div class="col-md-4 col-6 q-pa-md text-center">


          <q-avatar size="128px">
            <img :src="mainImage" :placeholder-src="placeholderImage" style=" object-fit: cover" :alt="item.Name"/>
          </q-avatar>
          <div class="text-h6 font-1ry q-mb-sm">
            {{ item.Name }}
          </div>
          <div class="text-body1" style="white-space: pre-line;">
            <!-- {{ truncate(item['Description'], 150) }} -->
            {{ item["Short Description (150 chars)"] }}
          </div>

          <q-btn flat class="q-mt-sm bg-dark text-white" :size="$q.screen.lt.md ? 'sm' : 'sm'" :to="artistProfileUrl" color="dark" no-caps
            label="View Profile" />
        </div>
        <div class="col-md-5 col-6"  >

          <HomeFeaturedArtistArtworks :parentItem="item" :parentId="artistId" class="q-pa-sm" />
        </div>
      </div>


    </q-card>

  </template>
</template>


<script>
import Artists from 'src/models/orm-api/Artists'
import HomeFeaturedArtistArtworks from 'src/controllers/HomeFeaturedArtistArtworks.vue'

export default {
  name: 'FeaturedArtist',

  components: {
    HomeFeaturedArtistArtworks,
  },

  props: {
    artistId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      loading: true,
      item: {},
      dialogOpen: false,
      dialogTitle: '',
      dialogText: ''
    }
  },

  computed: {

    artistProfileUrl() {
      return `/artists/${this.artistId}/${this.slugify(this.item.Name || 'artist')}`
    },
    mainImage() {
      const att = this.item.Attachments?.[0]
      return att?.thumbnails?.large?.url
        ? `${import.meta.env.VITE_API_PROXY_URL}/cacher/data-cache/index.php?url=${encodeURIComponent(att.thumbnails.large.url)}`
        : ''
    },
    placeholderImage() {
      const att = this.item.Attachments?.[0]
      return att?.thumbnails?.small?.url
        ? `${import.meta.env.VITE_API_PROXY_URL}/cacher/data-cache/index.php?url=${encodeURIComponent(att.thumbnails.small.url)}`
        : ''
    },
    prettyMedia() {
      const map = {
        'Fine Art': 'Fine Artist',
        'Sculptural Works': 'Sculptor',
        'New Media': 'New Media Artist',
        'Merch Art': 'Merch Artist'
      }
      return (this.item.Media || []).map(m => map[m] || m)
    }
  },

  methods: {


    slugify(str) {
      return String(str)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '')
    },
    // truncate(text, limit) {
    //   return text && text.length > limit
    //     ? text.slice(0, limit) + '…'
    //     : text
    // },

    truncate(text, limit) {
      if (!text || text.length <= limit) return text

      const softRange = Math.floor(limit * 0.25)
      const searchStart = Math.max(0, limit - softRange)

      const segmentRegex = /[.]/g
      let match
      let bestCut = -1

      while ((match = segmentRegex.exec(text)) !== null) {
        const idx = match.index
        if (idx >= searchStart && idx <= limit) {
          bestCut = idx
        }
        if (idx > limit) break
      }

      const cutIndex = bestCut !== -1 ? bestCut : limit
      return text.slice(0, cutIndex).trim().replace(/[.]$/, '') + '.'
    }

    ,
    async fetchArtist() {
      this.loading = true
      try {
        const res = await Artists.FetchById(this.artistId)
        this.item = res.response.data.fields
      } catch (e) {
        console.error('Failed to load featured artist', e)
      }
      this.loading = false
    }
  },

  mounted() {
    this.fetchArtist()
  }
}
</script>
