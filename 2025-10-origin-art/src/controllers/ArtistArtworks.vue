<template>
  <div class="q-mt-xl">

    <div v-if="loading" class="text-center q-pa-lg">
      Loading artworks...
    </div>

    <div v-else-if="!items.length" class="text-center q-pa-lg text-grey-7">
      No artworks found for this artist.
    </div>

    <div v-else class="row q-col-gutter-lg">
      <div
        v-for="art in items"
        :key="art.id"
        class="col-6 col-md-3 q-pa-sm"
      >
        <ArtworkCard
          :art="art"
        />
      </div>
    </div>

  </div>
</template>

<script>
import Artworks from "src/models/orm-api/Artworks"
import ArtworkCard from "src/controllers/ArtworkCard.vue"

export default {
  name: "ArtistArtworks",

  components: {
    ArtworkCard
  },

  props: {
    artistName: {
      type: String,
      default: "Adilson De Oliveira"
    }
  },

  data() {
    return {
      loading: false,
      items: []
    }
  },

  computed: {
    filterFormula() {
      return `AND(({Name (from Artist)}='${this.artistName}'))`
    }
  },

  methods: {

    fetchArtworks() {
      this.loading = true

      Artworks.FetchAll(
        [],
        {},
        {},
        {
          limit: 60,
          filters: {
            filterByFormula: this.filterFormula
          }
        }
      )
        .then((res) => {
          this.items = res.response.data.records.map((r) => ({
            id: r.id,
            ...r.fields
          }))
          this.loading = false
        })
        .catch(() => (this.loading = false))
    }
  },

  mounted() {
    this.fetchArtworks()
  }
}
</script>

