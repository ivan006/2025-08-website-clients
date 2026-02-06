<template>
  <div>
    <div v-if="loading" class="text-center q-pa-lg">
      Loading featured artworks…
    </div>

    <div v-else-if="!items.length" class="text-center q-pa-lg text-grey-7">
      No featured artworks found.
    </div>

    <div v-else class="">
      <q-carousel
        v-model="slide"
        swipeable
        animated
        arrows
        navigation
        autoplay
        infinite
        control-color="white"
        class="rounded-borders"
        style="height: unset"
      >
        <q-carousel-slide
          v-for="(art, index) in items"
          :key="art.id"
          :name="index"
        >
          <div class="relative-position">
            <!-- Artwork image -->

            <!-- <q-card flat bordered>

            </q-card> -->

            <q-img
              :src="getLargeUrl(art)"
              :placeholder-src="getSmallUrl(art)"
              ratio="1"
              fit="contain"
              class="rounded-borders bg-grey-2"
              :height="cardHeight"
              :alt="`${art.Title} by ${art['Name (from Artist)']?.[0]}`"
            />

            <!-- Overlay caption -->
            <div
              class="absolute-bottom q-pa-md"
              style="
                background: linear-gradient(
                  to top,
                  rgba(0, 0, 0, 0.65),
                  rgba(0, 0, 0, 0)
                );
              "
            >
              <div class="text-h6 text-white font-1ry">
                {{ art.Title }}
              </div>

              <div class="text-subtitle2 text-grey-3">
                {{ art["Name (from Artist)"]?.[0] || "" }}
              </div>

              <div class="text-body1 text-weight-bold text-white q-mt-xs">
                R{{ Number(art.Price)?.toLocaleString() }}
              </div>
              <div class="q-mb-lg"></div>
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </div>
</template>

<script>
import ArtworksBoundCache from "src/models/orm-api/ArtworksBoundCache";
import ArtworkCard from "src/controllers/ArtworkCard.vue";

export default {
  name: "FeaturedArtistArtworkCarousel",

  components: {
    // ArtworkCard
  },

  props: {
    parentId: {
      type: [String, Number],
      required: true,
    },
  },

  data() {
    return {
      loading: false,
      items: [],
      slide: 0,
    };
  },
  computed: {
    cardHeight() {
      return this.$q.screen.lt.md ? "300px" : "400px";
    },
  },
  methods: {
    async fetchArtworks() {
      this.loading = true;

      try {
        const res = await ArtworksBoundCache.FetchAll("auto", [], {
          view: "viwn7wDGK6yk5ZHOl",
        });

        const all = res.response.data.records
          .map((r) => ({ id: r.id, ...r.fields }))
          .filter((r) => !r.Hide);

        this.items = all.filter(
          (r) =>
            (r["RECORD_ID (from Artist)"] || []).includes(this.parentId) &&
            r.Featured === "Yes",
        );
      } finally {
        this.loading = false;
      }
    },

    getAttachments(art) {
      return art.Attachments?.[0] || {};
    },

    getLargeUrl(art) {
      const u = this.getAttachments(art).thumbnails?.large?.url;
      return u
        ? `${
            import.meta.env.VITE_API_PROXY_URL
          }/cacher/data-cache/index.php?url=${encodeURIComponent(u)}`
        : "";
    },

    getSmallUrl(art) {
      const u = this.getAttachments(art).thumbnails?.small?.url;
      return u
        ? `${
            import.meta.env.VITE_API_PROXY_URL
          }/cacher/data-cache/index.php?url=${encodeURIComponent(u)}`
        : "";
    },

    slugify(text) {
      return text
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w-]+/g, "") // Remove non-word characters
        .replace(/--+/g, "-") // Merge multiple -
        .replace(/^-+|-+$/g, ""); // Trim - from start/end
    },
  },

  mounted() {
    this.fetchArtworks();
  },
};
</script>
