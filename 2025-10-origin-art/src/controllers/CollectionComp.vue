<template>
  <div class="">
    <div v-if="loading" class="text-center q-pa-xl">Loading...</div>

    <div v-else>
      <!-- <div class="container-sm">

        <div class="columnx items-center text-center q-mb-md">

          <div class="row justify-center">
            <div class="col-12 col-md-8">
            
   
              <div class="text-h4 font-1ry q-mt-md">
                {{ item.fields.Title }}
              </div> 

            </div>
 
          </div>
        </div>
      </div> -->
      <!-- COVER PAGE -->
      <section
        v-if="item.fields?.['Show Cover Page'] === true"
        class="debug-border"
        style="
          position: relative;
          width: 210mm;
          height: 297mm;
          box-sizing: border-box;
          page-break-after: always;
          background: white;
          padding: 18mm 30mm;
        "
      >
        <!-- border: solid 1px grey; -->
        <div
          style="
            height: 260mm;
            display: flex;
            flex-direction: column;
            justify-content: center; /* vertical alignment */
          "
        >
          <!-- HEADING (30mm) -->

          <!-- IMAGE (150mm) -->
          <div v-if="item.fields?.Image?.[0]" style="height: 80mm">
            <img
              :src="`${$apiProxyUrl}${encodeURIComponent(
                item.fields.Image[0].url,
              )}`"
              style="
                height: 100%;
                margin-left: auto;
                margin-right: auto;
                display: block;
              "
            />
          </div>

          <div v-if="item.fields?.Image?.[0]" style="height: 20mm"></div>
          <div
            class="text-h3 font-1ry text-center"
            style="
              max-height: 80mm;
              width: 100%;
              line-height: 1.5em;
              display: flex;
              align-items: center; /* vertical center */
              justify-content: center; /* horizontal center */
            "
          >
            {{ item.fields.Title }}
          </div>

          <!-- BODY (55mm) -->
          <div style="height: 20mm"></div>
          <div
            v-if="item.fields?.['Body Text (max 200 chars)']"
            class="text-body1 text-center"
            style="
              height: 20mm;
              opacity: 0.85;
              overflow: hidden;
              margin-left: auto;
              margin-right: auto;
            "
            v-html="bodyHtml"
          ></div>

          <!-- BRAND / CONTACT (62mm) -->

          <div
            class="text-caption text-center"
            style="
              opacity: 0.7;
              line-height: 1.6;
              height: 70mm;
              padding-top: 10mm;
            "
          >
            <img
              :src="`${$apiProxyUrl}${encodeURIComponent(
                site['Compressed Logo'][0].url,
              )}`"
              style="
                height: 10mm;
                object-fit: contain;
                margin-left: auto;
                margin-right: auto;
              "
            />
            <div class="text-h5" style="margin-left: auto; margin-right: auto">
              {{ site?.["Title"] }}
            </div>
            <div
              class="text-body2"
              style="
                width: 50mm;
                padding-bottom: 5mm;
                margin-left: auto;
                margin-right: auto;
              "
            >
              {{ site?.["Tagline"] }}
            </div>
            <div style="margin-left: auto; margin-right: auto">
              {{ site?.["Contact Person"] }}
            </div>
            <div style="margin-left: auto; margin-right: auto">
              {{ site?.Email }}
            </div>
            <div style="margin-left: auto; margin-right: auto">
              {{ site?.["Phone Number"] }}
            </div>
          </div>
        </div>
      </section>

      <CollectionArtworks :parent="item" :site="site" />
      <!-- <div class="text-1ry-color">
        
      </div> -->
    </div>
  </div>
</template>

<script>
import Collections from "src/models/orm-api/Collections";
import CollectionArtworks from "src/controllers/CollectionArtworks.vue";
import { marked } from "marked";
import Site from "src/models/orm-api/Site";

export default {
  name: "CollectionComp",

  components: {
    CollectionArtworks,
  },

  data() {
    return {
      site: null,
      loading: true,
      item: {},
      showEnquiry: false,
      dialogOpen: false,
      dialogText: "",
      dialogTitle: "",
    };
  },

  computed: {
    bodyHtml() {
      return marked.parse(
        this.item.fields?.["Body Text (max 200 chars)"] || "",
      );
    },
    id() {
      return this.$route.params.rId;
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
    fetchData() {
      this.loading = true;
      Collections.FetchById(this.id)
        .then((response) => {
          this.item = response.response.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },

  mounted() {
    this.fetchData();

    this.fetchSite();
  },
};
</script>
