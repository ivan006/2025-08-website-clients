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

          <RichPageSectionsTemplate :parent="{ ...item, id: recordId }" />
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
import RichPageModel from "src/models/orm-api/RichPageModel";
import SEODataViewer from "src/controllers/SEODataViewer.vue";
import RichPageSectionsTemplate from "src/controllers/RichPageSectionsTemplate.vue";
import { buildSchemaItem, buildSeoConfig } from "src/utils/seo";
import { marked } from "marked";
import Site from "src/models/orm-api/Site";
import { createMetaMixin } from "quasar";

export default {
  name: "RichPagesTemplate",

  components: {
    RichPageSectionsTemplate,
    SEODataViewer,
  },
  mixins: [
    createMetaMixin(function () {
      return this.seoConfig;
    }),
  ],
  data() {
    return {
      loading: true,
      item: {},
      showEnquiry: false,
      dialogOpen: false,
      dialogText: "",
      dialogTitle: "",
      slugToRecordId: {
        "about-us": "recm1zwISXhFelkc5",
        "work-with-us": "recukJ1L2nAS4FUbH",
      },
    };
  },

  computed: {
    pageSlug() {
      return this.$route.params.pageSlug;
    },
    recordId() {
      return this.slugToRecordId[this.pageSlug];
    },
    bodyHtml() {
      return marked.parse(
        this.item.fields?.["Body Text (max 200 chars)"] || "",
      );
    },

    VITE_API_DEFAULT_IMAGE() {
      return import.meta.env.VITE_API_DEFAULT_IMAGE;
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
    fetchData() {
      this.loading = true;
      RichPageModel.FetchById(this.recordId)
        .then((response) => {
          this.item = response.response.data.fields;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    splitSections(input) {
      const html = this.toHtmlPlus(input);

      const match = html.match(/<h([1-6])\b/i);
      if (!match) return [html.trim()];

      const highestLevel = match[1];
      const splitRegex = new RegExp(`(?=<h${highestLevel}\\b)`, "i");

      return html.split(splitRegex).filter((s) => s.trim());
    },
    splitSectionsAndHeadings(input) {
      const html = this.toHtmlPlus(input);

      // 1️⃣ Detect highest (smallest number) heading level present
      const match = html.match(/<h([1-6])\b/i);
      if (!match) {
        return [{ heading: "", body: html.trim() }];
      }

      const highestLevel = match[1];

      // 2️⃣ Split only on that heading level
      const splitRegex = new RegExp(`(?=<h${highestLevel}\\b)`, "i");
      const sections = html.split(splitRegex).filter((s) => s.trim());

      return sections.map((sectionHtml) => {
        const doc = new DOMParser().parseFromString(sectionHtml, "text/html");

        const headingEl = doc.body.querySelector(`h${highestLevel}`);
        let heading = "";

        if (headingEl) {
          // Capture heading HTML
          heading = headingEl.outerHTML;

          // Look for first paragraph immediately after heading
          const nextEl = headingEl.nextElementSibling;

          if (nextEl && nextEl.tagName.toLowerCase() === "p") {
            // Attach first paragraph to heading block
            heading += nextEl.outerHTML;
            nextEl.remove();
          }

          // Remove heading itself from body
          headingEl.remove();
        }

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
  },

  mounted() {
    this.fetchData();
  },
};
</script>
