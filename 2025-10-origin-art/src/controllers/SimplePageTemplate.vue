<template>
  <div class="">
    <SEODataViewer :seoConfig="seoConfigMasked" :seoLdJson="seoLdJson" />
    <div v-if="loading" class="text-center q-pa-xl">Loading...</div>

    <template v-else>
      <div class="row items-center bg-white" style="min-height: 60vh">
        <div class="col">
          <!-- this image load is for touching the smaller image for whatsap and social media previews -->
          <img
            :src="
              item?.['Attachments']?.[0]?.url
                ? `${$apiProxyUrl}${encodeURIComponent(
                    item?.['Attachments']?.[0]?.thumbnails?.large?.url,
                  )}`
                : ''
            "
            alt=""
            style="display: none"
          />
          <div class="bg-3ry-color">
            <div
              :style="
                item?.['Attachments']?.[0]?.url
                  ? `background-image: url(${$apiProxyUrl}${encodeURIComponent(
                      item?.['Attachments']?.[0]?.url,
                    )});`
                  : ``
              "
              style="
                background-color: rgb(70, 70, 70);
                background-position: center;

                background-size: cover; /* height fills, width scales proportionally */
                image-rendering: crisp-edges; /* optional, prevents blurring */
                background-attachment: scroll;

                background-color: rgba(0, 0, 0, 0);
                background-blend-mode: darken;

                background-repeat: no-repeat;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;

                background-color: rgba(0, 0, 0, 0.3);
                background-blend-mode: darken;

                padding-top: 0px;
              "
              class=""
            >
              <div class="q-py-xl">
                <div class="container-sm text-white">
                  <div class="row q-col-gutter-md justify-center">
                    <div class="col-xl-6 col-md-6 col-12">
                      <div class="gt-md q-py-md"></div>

                      <h1 class="text-center r-font-h3 text-bold">
                        <span
                          class="text-weight-bold font-1ry text-uppercase"
                          style="letter-spacing: 15px"
                        >
                          {{ item?.["Title"] }}
                        </span>
                      </h1>
                    </div>
                    <div class="col-xl-12 col-md-12 col-12"></div>
                    <div class="col-xl-10 col-md-10 col-12">
                      <div class="text-center text-subtitle2x text-body">
                        <div
                          class="text-weight-lightx font-2ry text-uppercasex r-font-h4"
                          style="letter-spacing: 10cpx"
                        >
                          <div v-html="toHtml(item.Tagline)"></div>
                        </div>
                      </div>

                      <div class="gt-md q-py-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="text- q-py-md">
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
              <div class="text-body1x text-subtitle1" style="">
                <div v-html="taglineHtml"></div>
              </div>
            </div>
          </div> -->
          <div class="bg-white q-py-md">
            <div class="container-sm">
              <div class="text-body1x text-subtitle1">
                <div
                  v-for="(row, index) in toRows(item.Body)"
                  :key="index"
                  class="q-mb-xl"
                >
                  <div v-html="row.heading"></div>

                  <div class="row q-col-gutter-xl">
                    <div
                      class="col-12 col-md-6"
                      v-html="toColumns(row.body).left"
                    ></div>
                    <div
                      class="col-12 col-md-6"
                      v-html="toColumns(row.body).right"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-3ry-color">
            <div style="padding-top: 0px" class="">
              <div class="q-py-xl">
                <div class="container-sm text-white">
                  <div class="row q-col-gutter-md justify-center">
                    <div class="col-xl-12 col-md-12 col-12"></div>
                    <div class="col-xl-10 col-md-10 col-12">
                      <div class="text-center text-subtitle2x text-body">
                        <div
                          class="text-weight-lightx font-2ry text-uppercasex r-font-h4"
                          style="letter-spacing: 10cpx"
                        >
                          <div v-html="toHtml(item['Closing Line'])"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
  "info-for-artists": "recfjkCIv8hVr8647",
  "info-for-collectors": "recj52kiC87mNRTsj",
  "info-for-collectors-2": "rec9IhLFHPPv6auBS",
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
    toRows(input) {
      const html = this.toHtmlPlus(input);

      // 1️⃣ Detect highest (smallest number) heading present
      const match = html.match(/<h([1-6])\b/i);
      if (!match) {
        return [{ heading: "", body: html.trim() }];
      }

      const highestLevel = match[1]; // e.g. "1" or "2"

      // 2️⃣ Split only on that heading level
      const regex = new RegExp(`(?=<h${highestLevel}\\b)`, "i");

      const sections = html.split(regex).filter((s) => s.trim());

      return sections.map((sectionHtml) => {
        const doc = new DOMParser().parseFromString(sectionHtml, "text/html");

        const headingEl = doc.body.querySelector(`h${highestLevel}`);

        const heading = headingEl ? headingEl.outerHTML : "";
        if (headingEl) headingEl.remove();

        return {
          heading,
          body: doc.body.innerHTML.trim(),
        };
      });
    },
    toColumns(input) {
      // 1️⃣ full pipeline first
      let html = this.toHtmlPlus(input); // use the computed that already injects classes

      // 2️⃣ split AFTER transform
      const sections = html.split(/(?=<h1|<h2|<h3|<h4|<h5|<h6)/i);
      const mid = Math.ceil(sections.length / 2);

      return {
        left: sections.slice(0, mid).join(""),
        right: sections.slice(mid).join(""),
      };
    },
    toHtmlPlus(input) {
      let html = marked.parse(input || "");

      // 1️⃣ tag → marker + level-specific classes
      html = html
        // .replace(/<h-1>/gi, `<h-1 class="headingclass r-font-h2">`)
        // .replace(/<h0>/gi, `<h0 class="headingclass r-font-h3">`)
        // .replace(/<h1>/gi, `<h1 class="headingclass r-font-h4">`)
        .replace(/<h2>/gi, `<h2 class="headingclass text-center r-font-h5">`)
        .replace(/<h3>/gi, `<h3 class="headingclass r-font-h6">`)
        .replace(/<h4>/gi, `<h4 class="headingclass r-font-hx">`);

      // 2️⃣ global pass (single source of truth)
      html = html.replace(
        /headingclass/g,
        "font-1ry text-uppercase text-centerx q-my-md",
      );

      return html;
    },
    toHtml(input) {
      let html = marked.parse(input || "");

      return html;
    },
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
