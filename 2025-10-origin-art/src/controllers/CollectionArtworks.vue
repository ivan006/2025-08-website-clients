<template>
  <div class="">
    <div v-if="loading" class="text-center q-pa-lg">
      Loading artworks...
    </div>

    <div v-else-if="!items.length" class="text-center q-pa-lg text-grey-7">
      No artworks found for this artist.
    </div>

    <div v-else>
      
      <div class="bg-white">

        <section
          v-for="(art, i) in items"
          :key="art.id"
          class="column items-center"
          style="
            position: relative;
            width: 200mm;
            height: 287mm;
            padding: 0mm 15mm;
            box-sizing: border-box;
            page-break-after: always;
          "

        >
            <!-- border: solid 1px grey; -->

          <!-- HEADER -->
          <div class="row justify-end full-width q-mb-xl">
            <img :src="VITE_API_DEFAULT_IMAGE" style="height: 22mm;" />
          </div>

          <!-- IMAGE -->
          <!-- IMAGE FRAME -->
          <div
            class="column items-center justify-center q-mb-lg"
            style="
              height: 197mm;
              overflow: hidden;
            "
          >
              <!-- width: 200mm; -->
            <!-- border: solid 1px grey; -->
            <img
              :src="largeUrl(art)"
              style="
                max-height: 100%;
                max-width: 100%;
                object-fit: contain;
              "
            />
          </div>


          <!-- META -->
          <div class="full-width text-left text-body2" style="
            ">
            <!-- border: solid 1px grey; -->
            <strong>{{ artistName(art) }}</strong><br />
            <em>{{ art.Title }}</em><br />
            {{ art['Name (from Medium)']?.[0] }}<br />
            {{ art.Height }} × {{ art.Width }} cm<br />
            {{ art.Year }}<br />
            R{{ Number(art.Price)?.toLocaleString() }}
          </div>

          <!-- FOOTER -->
          <div
            class="full-width text-center text-caption"
            style="
              position: absolute; 
              bottom: 0mm; 
              left: 0;
            "
          >
              <!-- border: solid 1px grey; -->
            – {{ i + 1 }} –
          </div>



        </section>

      </div>



    </div>

  </div>
</template>

<script>
import Artworks from 'src/models/orm-api/Artworks'

export default {
  name: 'CollectionArtworks',

  components: {
  },

  props: {
    parentId: {
      type: [String, Number]
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
      return `AND(({RECORD_ID (from Collections)}='${this.parentId}'))`
    },
    VITE_API_DEFAULT_IMAGE() {
      return import.meta.env.VITE_API_DEFAULT_IMAGE
    },



  },

  methods: {
    
    attachments(art) {
      return art.Attachments?.[0] || {}
    },

    largeUrl(art) {
      const u = this.attachments(art).url
      return u
        ? `${import.meta.env.VITE_API_PROXY_URL}${encodeURIComponent(u)}`
        : ''
    },

    artistName(art) {
      return art['Name (from Artist)']?.[0] || 'Unknown Artist'
    },
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

          

          // ✅ sort by artist last name
          this.items.sort((a, b) => {
            const lastA = (a['Name (from Artist)']?.[0] || '').trim().split(' ').pop().toLowerCase()
            const lastB = (b['Name (from Artist)']?.[0] || '').trim().split(' ').pop().toLowerCase()
            return lastA.localeCompare(lastB)
          })
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

