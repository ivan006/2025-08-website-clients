<template>
  <div class="">
    <div v-if="loading" class="text-center q-pa-lg">Loading artworks...</div>

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
            width: 210mm;
            height: 297mm;
            padding: 0mm 15mm;
            box-sizing: border-box;
          "
          :style="{
            pageBreakAfter: i === items.length - 1 ? 'auto' : 'always',
          }"
        >
          <!-- border: solid 1px grey; -->
          <!-- border: solid 1px grey; -->

          <!-- HEADER -->
          <div
            class="row justify-end full-width"
            style="margin-top: 13mm; height: 22mm"
          >
            <img :src="VITE_API_DEFAULT_IMAGE" style="height: 100%" />
          </div>

          <!-- IMAGE -->
          <!-- IMAGE FRAME -->
          <div
            class="column items-center justify-center"
            style="height: 200mm; overflow: hidden; padding: 10mm 0"
          >
            <!-- width: 200mm; -->
            <!-- border: solid 1px grey; -->
            <img
              :src="largeUrl(art)"
              style="max-height: 100%; max-width: 100%; object-fit: contain"
            />
          </div>

          <!-- META -->
          <div
            class="full-width text-left text-body2"
            style="height: 42mm; overflow: hidden"
          >
            <!-- border: solid 1px grey; -->
            <strong>{{ artistName(art) }}</strong
            ><br />
            <em>{{ art.Title }}</em
            ><br />
            {{ art["Name (from Medium)"]?.[0] }}<br />
            {{ art.Height }} × {{ art.Width }} cm<br />
            {{ art.Year }}<br />
            R{{ Number(art.Price)?.toLocaleString() }}
          </div>
          <!-- FOOTER -->
          <div
            class="full-width row text-caption"
            style="
              position: absolute;
              bottom: 0mm;
              left: 0;
              padding-left: 15mm;
              padding-right: 15mm;
              align-items: flex-end;
              margin-bottom: 13mm;
              height: 7mm;
            "
          >
            <!-- CONTACT INFO (CENTER, SINGLE LINE) -->
            <div class="col-10">
              Enquiries:
              {{ site?.["Contact Person"] }}
              &nbsp;|&nbsp;
              {{ site?.Email }}
              &nbsp;|&nbsp;
              {{ site?.["Phone Number"] }}
            </div>

            <div class="col-2 text-right">
              {{ i + 1 }}
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import Artworks from "src/models/orm-api/Artworks";
import Site from "src/models/orm-api/Site";

export default {
  name: "CollectionArtworks",

  components: {},

  props: {
    parent: {
      type: [Object],
    },
  },

  data() {
    return {
      site: null,
      loading: false,
      items: [],
      sectionPages: {}, // page trackers for each medium group
    };
  },

  computed: {
    filterFormula() {
      // return `AND(({RECORD_ID (from Collections)}='${this.parent.id}'))`
      // return `AND(FIND('${this.parent.id}',{RECORD_ID (from Collections)}))`
      return `AND(SEARCH('${this.parent.id}',ARRAYJOIN({RECORD_ID (from Collections)}, ',')))`;
    },

    VITE_API_DEFAULT_IMAGE() {
      return import.meta.env.VITE_API_DEFAULT_IMAGE;
    },
  },

  methods: {
    fetchSite() {
      Site.FetchById("recE9Mnz1vihDkgXU").then((res) => {
        this.site = res.response.data.fields;
      });
    },
    attachments(art) {
      return art.Attachments?.[0] || {};
    },

    largeUrl(art) {
      const u = this.attachments(art).url;
      return u
        ? `${
            import.meta.env.VITE_API_PROXY_URL
          }/cacher/data-cache/index.php?url=${encodeURIComponent(u)}`
        : "";
    },

    artistName(art) {
      return art["Name (from Artist)"]?.[0] || "Unknown Artist";
    },
    fetchArtworks() {
      this.loading = true;

      Artworks.FetchAll(
        "auto",
        [],
        {},
        {},
        {
          limit: 200,
          filters: {
            filterByFormula: this.filterFormula,
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
    this.fetchSite();
  },
};
</script>
