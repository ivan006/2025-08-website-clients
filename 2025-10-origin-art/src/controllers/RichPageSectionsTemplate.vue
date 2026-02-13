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
              <!-- color: rgb(150, 150, 150); -->
              <i
                v-if="item.Icon"
                style="font-size: 80px; color: rgb(100, 100, 100)"
                class="q-icon material-icons"
                >{{ item.Icon }}</i
              >
              <h2
                class="font-1ry text-uppercase q-my-md r-font-h4"
                style="font-weight: 500"
              >
                {{ item.Title }}
              </h2>
              <div v-html="toHtml(item.Body)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RichPageSectionsModel from "src/models/orm-api/RichPageSectionsModel";
import { marked } from "marked";

export default {
  name: "RichPageSectionsTemplate",

  components: {},

  props: {
    parent: {
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
    toHtmlPlus(input) {
      let html = marked.parse(input || "");

      const globalClasses = "font-1ry text-uppercase q-my-md";
      const globalStyle = "font-weight: 500;";

      html = html
        .replace(
          /<h2>/gi,
          `<h2 class="${globalClasses} r-font-h4" style="${globalStyle}">`,
        )
        .replace(
          /<h3>/gi,
          `<h3 class="${globalClasses} r-font-h6" style="${globalStyle}">`,
        )
        .replace(
          /<h4>/gi,
          `<h4 class="${globalClasses} r-font-hx" style="${globalStyle}">`,
        );

      return html;
    },
    toHtml(input) {
      let html = marked.parse(input || "");

      return html;
    },
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
