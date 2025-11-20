<template>
  <div class="q-mt-xl">

    <!-- Loading -->
    <div v-if="loading" class="text-center q-pa-lg">
      Loading artworks...
    </div>

    <!-- No results -->
    <div v-else-if="!items.length" class="text-center q-pa-lg text-grey-7">
      No artworks found for this artist.
    </div>

    <!-- Artwork Grid -->
    <div v-else class="row q-col-gutter-lg">
      <div
        v-for="art in items"
        :key="art.id"
        class="col-6 col-md-3 q-pa-sm"
      >
        <q-card flat bordered class="rounded-borders">

          <q-img
            :src="imageUrl(art)"
            :ratio="1"
            fit="contain"
            class="rounded-borders"
          />

          <q-card-section>
            <div class="text-h6 font-1ry" style="min-height: 60px;">
              {{ art.Title }}
            </div>

            <div class="text-subtitle2 text-grey-7">
              {{ art['Artist Name']?.[0] }}
            </div>

            <div class="text-body1 text-weight-bold q-mt-xs">
              R{{ Number(art.Price)?.toLocaleString('en-ZA') }}
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              size="sm"
              flat
              color="primary"
              label="View Details"
              :to="`/artwork/${art.id}`"
            />
          </q-card-actions>

        </q-card>
      </div>
    </div>

  </div>
</template>

<script>
import Artworks from "src/models/orm-api/Artworks";

export default {
  name: "ArtistArtworks",

  props: {
    // not needed yet but ready for later
    artistName: {
      type: String,
      default: "Adilson De Oliveira"
    }
  },

  data() {
    return {
      loading: false,
      items: []
    };
  },

  methods: {
    imageUrl(art) {
      const a = art.Attachments?.[0];
      return a?.thumbnails?.large?.url
        ? `https://capetownlists.co.za/?url=${encodeURIComponent(a.thumbnails.large.url)}`
        : "";
    },

    fetchArtworks() {
      this.loading = true;

      // Airtable formula: {Artist Name} contains "Artist"
      const formula = `FIND("${this.artistName}", ARRAYJOIN({Artist Name}))`;

      Artworks.FetchAll([], {}, {}, {
        filters: { filterByFormula: formula },
        limit: 60
      })
        .then((res) => {
          this.items = res.response.data.records.map(r => ({
            id: r.id,
            ...r.fields
          }));
          this.loading = false;
        })
        .catch(() => (this.loading = false));
    }
  },

  mounted() {
    this.fetchArtworks();
  }
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 4px;
}
</style>
