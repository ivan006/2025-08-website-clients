<template>
  <div class="">
    <SEODataViewer :seoConfig="seoConfigMasked" :seoLdJson="seoLdJson" />
    <div v-if="loading" class="text-center q-pa-xl">Loading...</div>

    <template v-else>
      <div class="row items-center bg-white" style="min-height: 60vh">
        <div class="col">
          <div class="text- q-py-md">
            <div class="container-sm">
              <h2
                class="r-font-h3 text-center q-my-none text-uppercase font-1ry"
              >
                {{ item.Title }}
              </h2>
            </div>
          </div>

          <div class="bg-white q-py-md">
            <div class="container-sm">
              <div
                class="text-body1x text-subtitle1"
                style="white-space: pre-line"
              >
                <div v-html="bodyHtml"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Policies from "src/models/orm-api/Policies";
import SEODataViewer from "src/controllers/SEODataViewer.vue";
import { createMetaMixin } from "quasar";
import { buildSchemaItem, buildSeoConfig } from "src/utils/seo";
import { marked } from "marked";

// 🔒 explicit, boring, safe
const SLUG_TO_RECORD_ID = {
  "privacy-policy": "recIL2JG4aDRfVi78",
  "refund-policy": "recGe8aQ1rjkVFpKY",
  "about-us": "rec3yq3CL9KjxmdQG",
};

export default {
  name: "SimplePageTemplate",

  components: { SEODataViewer },

  mixins: [
    createMetaMixin(function () {
      return this.seoConfig;
    }),
  ],

  data() {
    return {
      loading: true,
      item: {},
    };
  },

  computed: {
    bodyHtml() {
      return marked.parse(this.item.Body || "");
    },
    pageSlug() {
      return this.$route.params.pageSlug;
    },

    recordId() {
      return SLUG_TO_RECORD_ID[this.pageSlug];
    },

    seoLdJson() {
      const url =
        window.location.origin + (this.$route?.fullPath.split("#")[0] || "/");
      const siteName = import.meta.env.VITE_API_SITE_TITLE;

      let image = import.meta.env.VITE_API_DEFAULT_IMAGE;
      if (this.mainImage) {
        image = this.mainImage;
      }

      const schema = buildSchemaItem({
        type: this.item?.["SEO Type"],
        name: this.item?.["Title"] || siteName,
        description: this.item.Body,
        url,
        image,
        extras: {},
      });

      return schema;
    },
    seoConfig() {
      const url =
        window.location.origin + (this.$route?.fullPath.split("#")[0] || "/");
      const siteName = import.meta.env.VITE_API_SITE_TITLE;

      let image = import.meta.env.VITE_API_DEFAULT_IMAGE;
      if (this.mainImage) {
        image = this.mainImage;
      }

      return buildSeoConfig({
        title: this.item?.["Title"],
        description: this.item.Body,
        url,
        image,
        siteName,
        type: "WebPage",
        schema: this.seoLdJson,
      });
    },
    seoConfigMasked() {
      const c = { ...this.seoConfig };
      c.script = "";
      return c;
    },
  },

  methods: {
    fetchIndiData() {
      if (!this.recordId) return;

      this.loading = true;
      Policies.FetchById(this.recordId)
        .then((res) => {
          this.item = res.response.data.fields;
        })
        .finally(() => (this.loading = false));
    },
  },

  mounted() {
    this.fetchIndiData();
  },
};
</script>
