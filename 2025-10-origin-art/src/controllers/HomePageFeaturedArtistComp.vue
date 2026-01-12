<template>
  <div class="">
    <div v-if="loading" class="text-center q-pa-xl">
      Loading...
    </div>

    <div v-else class="container-sm">

      <q-card flat borderedx class="q-pa-lg">

        <HomeFeaturedArtistArtworks :parentId="artistId"/>
        <!-- Featured Artist Layout -->
        <div class="row q-col-gutter-xl items-stretch">

          <!-- Left: Profile Image -->
          <div class="col-12 col-md-6 flex flex-center">
            <q-img :src="mainImage" :placeholder-src="placeholderImage" ratio="1" style="height:500px" fit="cover" />
          </div>

          <!-- Right: Artist Info (VERTICALLY CENTERED) -->
          <div class="col-12 col-md-6 flex">
            <div class="column justify-center">

              <div class="text-h4 font-1ry">
                {{ item.Name }}
              </div>

              <!-- Media badges -->
              <div class="row q-gutter-sm q-mt-sm">
                <q-badge v-for="m in prettyMedia" :key="m" color="grey-7" text-color="white" class="q-py-xs q-px-sm"
                  style="font-size:.75rem;border-radius:4px">
                  {{ m }}
                </q-badge>
              </div>

              <!-- Short bio / statement -->
              <div v-if="item.Description" class="text-body1 q-mt-md" style="max-width:600px; white-space:pre-line">
                {{ truncate(item.Description, 300) }}
              </div>

              <div class="row">

                <q-btn :to="artistProfileUrl" flat label="View Profile" no-caps class="q-mt-sm bg-dark text-white"
                  size="small" />
                <!-- <q-btn flat size="sm" label="View Profile" class="bg-1ry-color" :to="artistProfileUrl" /> -->
              </div>

            </div>
          </div>

        </div>

      </q-card>

    </div>

  </div>
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
        ? `${import.meta.env.VITE_API_PROXY_URL}${encodeURIComponent(att.thumbnails.large.url)}`
        : ''
    },
    placeholderImage() {
      const att = this.item.Attachments?.[0]
      return att?.thumbnails?.small?.url
        ? `${import.meta.env.VITE_API_PROXY_URL}${encodeURIComponent(att.thumbnails.small.url)}`
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

      const segmentRegex = /[.,]/g
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
      return text.slice(0, cutIndex).trim().replace(/[.,]$/, '') + '.'
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
