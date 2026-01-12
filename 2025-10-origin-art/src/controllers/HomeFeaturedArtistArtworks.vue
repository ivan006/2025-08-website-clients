<template>
  <div>

    <div v-if="loading" class="text-center q-pa-lg">
      Loading featured artworks…
    </div>

    <div v-else-if="!items.length" class="text-center q-pa-lg text-grey-7">
      No featured artworks found.
    </div>

    <div v-else class="container-xl q-py-md">

      <q-carousel v-model="slide" swipeable animated arrows navigation height="420px" control-color="dark"
        class="rounded-borders">
        <q-carousel-slide v-for="(art, index) in items" :key="art.id" :name="index" class="flex flex-center">
          <div style="max-width:320px; width:100%;">
            <!-- <pre>{{ art }}</pre> -->
            <ArtworkCard :art="art" />
          </div>
        </q-carousel-slide>
      </q-carousel>


    </div>

  </div>
</template>

<script>
import ArtworksBoundCache from 'src/models/orm-api/ArtworksBoundCache'
import ArtworkCard from 'src/controllers/ArtworkCard.vue'

export default {
  name: 'FeaturedArtistArtworkCarousel',

  components: {
    ArtworkCard
  },

  props: {
    parentId: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {

      loading: false,
      items: [],
      slide: 0
    }
  },

  methods: {
    async fetchArtworks() {
      this.loading = true

      try {
        const res = await ArtworksBoundCache.FetchAll([], {
          view: 'viwn7wDGK6yk5ZHOl'
        })

        const all = res.response.data.records
          .map(r => ({ id: r.id, ...r.fields }))
          .filter(r => !r.Hide)

        this.items = all.filter(r =>
          (r['RECORD_ID (from Artist)'] || []).includes(this.parentId) &&
          r.Featured === 'Yes'
        )
      } finally {
        this.loading = false
      }
    }
  },

  mounted() {
    this.fetchArtworks()
  }
}
</script>
