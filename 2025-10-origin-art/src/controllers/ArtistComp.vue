<template>
  <div class="container-xl q-py-md">

    <div v-if="loading" class="text-center q-pa-xl">
      Loading...
    </div>

    <div v-else>

      <!-- =============== CENTERED ARTIST HEADER =============== -->
      <div class="column items-center text-center q-mb-md">

        <!-- Avatar -->

        <q-img
          :src="mainImage"
          :placeholder-src="placeholderImage"
          ratio="1"
          :alt="item.Name"
          style="width: 180px;"
          fit="contain"
        />
        <!-- 
          fit="cover"
          fit="contain"
        -->
        <!-- Name -->
        <div class="text-h5 font-1ry q-mt-md">
          {{ item.Name }}
        </div>

        <!-- ARTIST LEVEL -->
        <div class="text-subtitle1 text-weight-bold q-mt-sm">
          {{ prettyTier }}
        </div>

        <!-- ARTIST TYPE(S) -->
        <div class="text-grey-7 q-mt-xs">
          {{ prettyMedia.join(', ') }}
        </div>

      </div>

      <q-separator class="q-my-md" />

      <!-- =============== ARTWORKS =============== -->
      <ArtistArtworks :artistName="item.Name" />

    </div>

  </div>
</template>






<script>
import Artists from "src/models/orm-api/Artists";
import ArtistArtworks from "src/controllers/ArtistArtworks.vue";

export default {
  name: "ArtistComp",

  components: {
    ArtistArtworks,
  },

  data() {
    return {
      loading: true,
      item: {},
      showEnquiry: false,
    };
  },

  computed: {
    id() {
      return this.$route.params.rId;
    },

    superTableModel() {
      return Artists;
    },

    mainImage() {
      const att = this.item.Attachments?.[0];
      return att?.thumbnails?.large?.url
        ? `https://capetownlists.co.za/?url=${encodeURIComponent(att.thumbnails.large.url)}`
        : "";
    },

    placeholderImage() {
      const att = this.item.Attachments?.[0];
      return att?.thumbnails?.small?.url
        ? `https://capetownlists.co.za/?url=${encodeURIComponent(att.thumbnails.small.url)}`
        : "";
    },
    
    mediaLabelMap() {
      return {
        'Fine Art': 'Fine Artist',
        'Sculptural Works': 'Sculptor',
        'New Media': 'New Media Artist',
        'Merch Art': 'Merch Artist'
      }
    },

    tierLabelMap() {
      return {
        'Gold': 'Established (Avg Price 40k+)',
        'Silver': 'Mid-Career (Avg Price 12k–40k)',
        'Bronze': 'Emerging (Avg Price <12k)'
      }
    },

    prettyMedia() {
      const arr = this.item.Media || []
      return arr.map(m => this.mediaLabelMap[m] || m)
    },

    prettyTier() {
      const t = this.item['Av. Price Tier']
      return this.tierLabelMap[t] || t
    }
  },

  methods: {
    fetchData() {
      this.loading = true;

      this.superTableModel
        .FetchById(this.id, [], { flags: {}, moreHeaders: {}, rels: [] })
        .then((res) => {
          this.item = res.response.data.fields;
          this.loading = false;
        })
        .catch(() => (this.loading = false));
    },
  },

  mounted() {
    this.fetchData();
  },
};
</script>



<style scoped>
.rounded-borders {
  border-radius: 4px;
}
</style>
