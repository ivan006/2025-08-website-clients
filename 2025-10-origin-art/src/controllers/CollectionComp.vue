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
        class="column items-center"
        style="
          position: relative;
          width: 210mm;
          height: 297mm;
          padding: 25mm 20mm;
          box-sizing: border-box;
          page-break-after: always;
          background: white;
        "
      >
        <!-- HEADING (30mm) -->
        <div
          class="text-h4 font-1ry text-center"
          style="height: 30mm; display: flex; align-items: center"
        >
          {{ item.fields.Title }}
        </div>

        <!-- BODY (55mm) -->
        <div
          v-if="item.fields?.['Body Text']"
          class="text-body1 text-center"
          style="
            height: 55mm;
            max-width: 140mm;
            opacity: 0.85;
            overflow: hidden;
          "
          v-html="bodyHtml"
        ></div>

        <!-- IMAGE (150mm) -->
        <div
          v-if="item.fields?.Image?.[0]"
          class="column items-center justify-center"
          style="height: 150mm"
        >
          <img
            :src="`${$apiProxyUrl}${encodeURIComponent(
              item.fields.Image[0].url,
            )}`"
            style="max-height: 100%; max-width: 100%; object-fit: contain"
          />
        </div>

        <!-- BRAND / CONTACT (62mm) -->
        <div
          class="column items-center justify-center"
          style="height: 62mm; opacity: 0.85"
        >
          <img
            :src="VITE_API_DEFAULT_IMAGE"
            style="height: 22mm; object-fit: contain"
            class="q-mb-md"
          />
          <div
            class="text-caption text-center"
            style="opacity: 0.7; line-height: 1.6"
          >
            <div>{{ site?.["Contact Person"] }}</div>
            <div>{{ site?.Email }}</div>
            <div>{{ site?.["Phone Number"] }}</div>
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
      return marked.parse(this.item.fields?.["Body Text"] || "");
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
