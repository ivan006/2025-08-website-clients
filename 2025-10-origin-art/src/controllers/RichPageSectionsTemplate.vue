<template>
  <div v-if="loading" class="text-center q-pa-lg">Loading artworks...</div>

  <div
    v-else-if="!itemsComputed.length"
    class="text-center q-pa-lg text-grey-7"
  >
    No artworks found for this artist.
  </div>

  <div v-else>
    <div class="bg-white q-py-xl">
      <div class="container-sm">
        <div class="text-body1x text-subtitle1">
          <div class="row q-col-gutter-x-xl justify-center">
            <div
              v-for="(item, index) in itemsComputed"
              :key="index"
              class="col-12 col-md-6 text-center"
            >
              <div v-html="item.Body"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RichPageSectionsModel from "src/models/orm-api/RichPageSectionsModel";

export default {
  name: "RichPageSectionsTemplate",

  components: {},

  props: {
    parent: {
      type: [Object],
    },
    site: {
      type: [Object],
    },
  },

  data() {
    return {
      loading: false,
      items: [],
      sectionPages: {}, // page trackers for each medium group
    };
  },

  computed: {
    itemsComputed() {
      const records = [...this.items];
      const orderedIds = this.parent?.fields?.Art || [];

      if (!orderedIds.length) return records;

      const orderMap = new Map();
      orderedIds.forEach((id, index) => {
        orderMap.set(id, index);
      });

      return records.sort((a, b) => {
        const ai = orderMap.get(a.id);
        const bi = orderMap.get(b.id);

        if (ai === undefined && bi === undefined) return 0;
        if (ai === undefined) return 1;
        if (bi === undefined) return -1;
        return ai - bi;
      });
    },

    VITE_API_DEFAULT_IMAGE() {
      return import.meta.env.VITE_API_DEFAULT_IMAGE;
    },
  },

  methods: {
    attachments(art) {
      return art.Attachments?.[0] || {};
    },

    largeUrl(art) {
      const u = this.attachments(art).url;
      return u
        ? `${
            import.meta.env.VITE_API_PROXY_URL
          }/data-cache/index.php?url=${encodeURIComponent(u)}`
        : "";
    },

    artistName(art) {
      return art["Name (from Artist)"]?.[0] || "Unknown Artist";
    },
    fetchArtworks() {
      this.loading = true;

      RichPageSectionsModel.FetchAll(
        "auto",
        [],
        {},
        {},
        {
          limit: 200,
          filters: {
            filterByFormula: `SEARCH('${this.parent.id}', ARRAYJOIN({RECORD_ID (from Pages)}, ','))`,
          },
        },
      )
        .then((res) => {
          this.items = res.response.data.records.map((r) => ({
            id: r.id,
            ...r.fields,
          }));

          // ✅ sort by artist last name
          this.items.sort((a, b) => {
            const lastA = (a["Name (from Artist)"]?.[0] || "")
              .trim()
              .split(" ")
              .pop()
              .toLowerCase();
            const lastB = (b["Name (from Artist)"]?.[0] || "")
              .trim()
              .split(" ")
              .pop()
              .toLowerCase();
            return lastA.localeCompare(lastB);
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },

  mounted() {
    this.fetchArtworks();
  },
};
</script>

<style>
.debug-border {
  border: 1px solid grey;
}

@media print {
  .debug-border {
    border: none !important;
  }
}
</style>
