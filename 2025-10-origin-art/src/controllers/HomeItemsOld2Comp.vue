<template>
  <template v-if="loading">
    <div class="text-center q-pa-md">Loading...</div>
  </template>

  <template v-else-if="!items.length">
    <div class="text-center q-pa-md text-2ry-color">None</div>
  </template>

  <template v-else>
    <SEODataViewer :seoConfig="seoConfigMasked" :seoLdJson="seoLdJson" />

    <div v-for="(arts, mediaName) in groupedByMedia" :key="mediaName">
      <!-- MEDIA HEADER -->
      <div style="background: #ffffff">
        <div class="container-md q-pt-md q-pb-md">
          <h2
            class="text-h5 text-center font-1ry"
            style="margin: 0; font-weight: 500"
          >
            {{ mediaName }}
          </h2>
        </div>
      </div>

      <!-- GRID OF ARTWORKS -->
      <div class="bg-2ry-color">
        <div class="container-md q-py-xl">
          <div class="row q-col-gutter-lg justify-center">
            <div
              v-for="art in arts"
              :key="art.id"
              class="col-6 col-md-3 q-pa-sm"
            >
              <q-card
                flat
                bordered
                class="box-shadow-1ry bg-white rounded-borders"
              >
                <q-img
                  :src="largeUrl(art.Attachments)"
                  :placeholder-src="smallUrl(art.Attachments)"
                  ratio="1"
                  class="rounded-borders"
                  :style="{ height: cardHeight, objectFit: 'cover' }"
                  fit="contain"
                />

                <q-card-section class="text-center">
                  <div class="text-h6 font-1ry">{{ art.Title }}</div>
                  <div class="text-body1 text-2ry-color">
                    R{{ art.Price?.toLocaleString() }}
                  </div>

                  <q-btn
                    flat
                    :size="$q.screen.lt.md ? 'md' : 'md'"
                    class="q-mt-xs text-3ry-color"
                    label="Read More"
                    :to="art['SEO URL']"
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import ArtworksBoundCache from "src/models/orm-api/ArtworksBoundCache";
import { createMetaMixin } from "quasar";
import { buildSchemaItem, buildSeoConfig } from "src/utils/seo";
import SEODataViewer from "src/controllers/SEODataViewer.vue";

export default {
  name: "HomeItemsOld2Comp",

  components: {
    SEODataViewer,
  },

  mixins: [
    createMetaMixin(function () {
      return this.seoConfig;
    }),
  ],

  data() {
    return {
      loading: false,
      items: [],
    };
  },

  computed: {
    cardHeight() {
      return this.$q.screen.lt.md ? "150px" : "250px";
    },
    /* ---------------------- SEO JSON-LD ---------------------- */
    seoLdJson() {
      const products = this.items.map((item) =>
        buildSchemaItem({
          type: "Product",
          url: item["SEO URL"]
            ? window.location.origin + item["SEO URL"]
            : null,
          name: item.Title || "",
          description: item.Subtitle || "",
          image:
            item.Attachments?.[0]?.thumbnails?.large?.url ||
            item["Image Url"] ||
            "",
          price: item.Price,
        }),
      );

      return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: products,
      };
    },

    /* ---------------------- SEO META ---------------------- */
    seoConfig() {
      const url =
        window.location.origin + (this.$route?.fullPath.split("#")[0] || "/");

      return buildSeoConfig({
        title: "Artist Works",
        description: "Browse grouped artworks by media, tier, and artist.",
        url,
        siteName: import.meta.env.VITE_API_SITE_TITLE,
      });
    },

    seoConfigMasked() {
      const c = { ...this.seoConfig };
      c.script = "";
      return c;
    },

    /* ---------------------- GROUPING LOGIC ---------------------- */
    groupedByMedia() {
      const MEDIA_ORDER = [
        "Fine Art",
        "Sculptural Works",
        "New Media",
        "Merch Art",
      ];

      const result = {};

      this.items.forEach((art) => {
        const medias = art["Name (from Medium)"] || [];

        medias.forEach((media) => {
          if (!MEDIA_ORDER.includes(media)) return;

          if (!result[media]) result[media] = [];
          result[media].push(art);
        });
      });

      // Sort by media order
      const sorted = {};
      MEDIA_ORDER.forEach((m) => {
        if (result[m]) sorted[m] = result[m];
      });

      return sorted;
    },
  },

  methods: {
    artistCardWidthClass(count) {
      if (count >= 3) return "col-12 col-md-12";
      if (count === 2) return "offset-md-2 col-md-8 col-12 ";
      if (count === 1) return "offset-md-3 col-md-6 col-12";
      return "col-12";
    },

    artCardWidthClass(count) {
      if (count >= 3) return "col-md-3 col-12";
      if (count === 2) return "col-md-4 col-12";
      if (count === 1) return "col-md-6 col-12";
      return "col-12";
    },
    largeUrl(u) {
      return u[0].thumbnails?.small?.url
        ? `${
            import.meta.env.VITE_API_PROXY_URL
          }/data-cache/index.php?url=${encodeURIComponent(
            u[0].thumbnails?.large?.url,
          )}`
        : "";
    },

    smallUrl(u) {
      return u[0].thumbnails?.small?.url
        ? `${
            import.meta.env.VITE_API_PROXY_URL
          }/data-cache/index.php?url=${encodeURIComponent(
            u[0].thumbnails?.small?.url,
          )}`
        : "";
    },
    async fetchData() {
      this.loading = true;

      try {
        const res = await ArtworksBoundCache.FetchAll("auto", [], {
          view: "viw3kGBDVemlmpxwd",
        });

        this.items = res.response.data.records.map((r) => ({
          id: r.id,
          ...r.fields,
        }));
      } catch (err) {
        console.error("❌ Failed to load artworks:", err);
      }

      this.loading = false;
      this.$emit("loaded");
    },
  },

  async mounted() {
    await this.fetchData();
  },
};
</script>
