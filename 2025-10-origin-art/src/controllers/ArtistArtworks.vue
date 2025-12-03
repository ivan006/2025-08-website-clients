<template>
  <div class="">

    <div v-if="loading" class="text-center q-pa-lg">
      Loading artworks...
    </div>

    <div v-else-if="!items.length" class="text-center q-pa-lg text-grey-7">
      No artworks found for this artist.
    </div>

    <div v-else>
      
      <!-- PER-MEDIUM SECTIONS -->
      <div
        v-for="(group, mediaName) in grouped"
        :key="mediaName"
        class=""
      >

        <!-- Heading -->
        <!-- <div class="text-h6 q-mb-md font-1ry">
          {{ mediaName }}
        </div> -->
        
        <!-- MEDIA HEADER -->
        <div style="background: #ffffff;">
          <div class="container-md q-pt-md q-pb-md">
            <h2
              class="text-h5 text-center font-1ry"
              style="margin: 0; font-weight: 500;"
            >
              {{ mediaName }}
            </h2>
          </div>
        </div>

        <!-- PAGINATED GRID -->
        <ArtworkPaginatedGrid
          :items="group"
          v-model:page="sectionPages[mediaName]"
          :items-per-page="8"
          class="bg-2ry-color q-pa-sm"
        />

      </div>

    </div>

  </div>
</template>

<script>
import Artworks from 'src/models/orm-api/Artworks'
import ArtworkPaginatedGrid from 'src/controllers/ArtworkPaginatedGrid.vue'

export default {
  name: 'ArtistArtworks',

  components: {
    ArtworkPaginatedGrid
  },

  props: {
    artistName: {
      type: String,
      default: 'Adilson De Oliveira'
    }
  },

  data() {
    return {
      loading: false,
      items: [],
      sectionPages: {}  // page trackers for each medium group
    }
  },

  computed: {
    filterFormula() {
      return `AND(({Name (from Artist)}='${this.artistName}'))`
    },

    grouped() {
      const groups = {}

      this.items.forEach(art => {
        const mediums = art['Name (from Medium)'] || ['Uncategorized']

        mediums.forEach(m => {
          if (!groups[m]) groups[m] = []
          groups[m].push(art)

          if (this.sectionPages[m] === undefined) {
            this.sectionPages[m] = 0   // ✅ Vue 3 reactive assignment
          }
        })
      })

      return groups
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
          limit: 200,
          filters: {
            filterByFormula: this.filterFormula
          }
        }
      )
        .then(res => {
          this.items = res.response.data.records.map(r => ({
            id: r.id,
            ...r.fields
          }))
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  },

  mounted() {
    this.fetchArtworks()
  }
}
</script>
