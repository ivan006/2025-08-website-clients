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

        <!-- Price info -->
        <div class="text-subtitle2 text-grey-7 q-mt-xs">
          Average Price: R{{ Number(item['Av. Price']).toLocaleString('en-ZA') }}
        </div>

        <div class="text-subtitle2 text-grey-7">
          Tier: {{ item['Av. Price Tier'] }}
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
