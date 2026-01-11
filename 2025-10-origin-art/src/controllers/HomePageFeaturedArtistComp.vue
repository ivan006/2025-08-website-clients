<template>
  <div class="q-pt-md bg-white">
    <div v-if="loading" class="text-center q-pa-xl">
      Loading...
    </div>

    <div v-else class="container-sm">
      <!-- Featured Artist Header -->
      <div class="column items-center text-center q-mb-lg">

        <q-img :src="mainImage" :placeholder-src="placeholderImage" ratio="1" style="width:180px" fit="contain" />

        <div class="text-h4 font-1ry q-mt-md">
          {{ item.Name }}
        </div>

        <!-- Media badges -->
        <div class="row justify-center q-gutter-sm q-mt-sm">
          <q-badge v-for="m in prettyMedia" :key="m" color="grey-7" text-color="white" class="q-py-xs q-px-sm"
            style="font-size:.75rem;border-radius:4px">
            {{ m }}
          </q-badge>
        </div>

        <!-- Short bio / statement -->
        <div v-if="item.Description" class="text-body1 q-mt-md" style="max-width:600px;white-space:pre-line">
          {{ truncate(item.Description, 300) }}
        </div>

        <q-btn v-if="isLong(item.Description, 300)" flat label="Read More" class="q-mt-sm bg-dark text-white"
          size="small" @click="openDialog('Artist Statement', item.Description)" />

      </div>

      <!-- Optional artworks preview -->
      <!-- <ArtistArtworks :parentId="artistId" /> -->

      <!-- Dialog -->
      <q-dialog v-model="dialogOpen">
        <q-card style="max-width:700px;width:90%">
          <q-card-section>
            <div class="text-h6 q-mb-md">{{ dialogTitle }}</div>
            <div class="text-body1" style="white-space:pre-line">
              {{ dialogText }}
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Close" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>
  </div>
</template>
<script>
import Artists from 'src/models/orm-api/Artists'
import ArtistArtworks from 'src/controllers/ArtistArtworks.vue'

export default {
  name: 'FeaturedArtist',

  components: { 
    // ArtistArtworks
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
    truncate(text, limit) {
      return text && text.length > limit
        ? text.slice(0, limit) + '…'
        : text
    },
    isLong(text, limit) {
      return text && text.length > limit
    },
    openDialog(title, text) {
      this.dialogTitle = title
      this.dialogText = text
      this.dialogOpen = true
    },
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
