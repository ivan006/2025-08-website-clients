<template>
  <div class="bg-white">
    <div class="container-sm q-py-lg">
      <SEODataViewer :seoConfig="seoConfigMasked" :seoLdJson="seoLdJson" />

      <div
        v-if="loading"
        class="text-center q-pa-xl row items-center justify-center"
        style="min-height: 60vh"
      >
        <div>Loading...</div>
      </div>

      <div v-else class="row q-col-gutter-xl">
        <!-- LEFT: IMAGE -->
        <div class="col-12 col-md-6 flex flex-centerx">
          <q-img
            :src="mainImage"
            :placeholder-src="placeholderImage"
            fit="contain"
            class="rounded-borders cursor-pointer"
            :style="{ height: cardHeight }"
            @click="showDialog = true"
            :alt="`${item.Title || 'Artwork'} by ${
              item['Name (from Artist)']?.[0] || 'Unknown artist'
            }`"
          />

          <!-- DIALOG -->
          <!-- <q-dialog v-model="showDialog" persistentx>
            <q-card style="max-width: 90vw; max-height: 90vh;">
              <q-img
                :src="mainImage"
                fit="contain"
                style="max-height: 90vh;"
              />
              
            </q-card>
          </q-dialog> -->

          <!-- FULL TEXT DIALOG -->
          <q-dialog v-model="showDialog" class="no-padding-dialog">
            <q-card style="max-width: 700px; width: 90%">
              <q-card-section class="q-pa-none">
                <q-img
                  :src="mainImage"
                  fit="contain"
                  style="max-height: 90vh"
                />
              </q-card-section>

              <!-- <q-card-actions align="right">
                  <q-btn :size="$q.screen.lt.md ? 'md' : 'md'" flat label="Close" v-close-popup />
                </q-card-actions> -->
            </q-card>
          </q-dialog>
          <!-- style="background-color: #EEE;" -->
          <!-- style="width: 100%; height: 600px;" -->
        </div>

        <!-- RIGHT: DETAILS -->
        <div class="col-12 col-md-6 q-pl-md-lg">
          <!-- Title -->
          <div class="text-h4 font-1ry">{{ item.Title }}</div>

          <!-- Artist -->
          <!-- <div class="text-subtitle2 text-grey-7 q-mt-xs">
            {{ item['Name (from Artist)']?.[0] || '' }}
          </div> -->

          <router-link
            :to="
              `/artists/` + item.Artist[0] + `/` + item['Name (from Artist)']
            "
            class="text-subtitle2 text-grey-7 q-mt-xs"
          >
            {{ item["Name (from Artist)"]?.[0] || "" }}
          </router-link>

          <!-- Price -->
          <div class="text-h6 text-weight-bold q-mt-sm">
            R{{
              Number(item.Price).toLocaleString("en-ZA", {
                minimumFractionDigits: 2,
              })
            }}
          </div>

          <!-- Specs -->
          <div class="q-mt-xl text-body2">
            <div class="row q-col-gutter-sm">
              <div class="col-5 text-grey-7">Medium</div>
              <div class="col-7">{{ medium }}</div>

              <div class="col-5 text-grey-7">Materials</div>
              <div class="col-7">
                {{
                  Array.isArray(item["Name (from Materials)"])
                    ? item["Name (from Materials)"].join(", ")
                    : item["Name (from Materials)"] || "-"
                }}
              </div>

              <div class="col-5 text-grey-7">Availability</div>
              <div class="col-7 q-mt-sm">
                <q-badge
                  transparent
                  align="middle"
                  size="sm"
                  class="bg-grey-7 text-white"
                >
                  {{ item.Status }}
                </q-badge>
              </div>

              <div class="col-5 text-grey-7 q-mt-sm">Height</div>
              <div class="col-7 q-mt-sm">{{ item.Height }} cm</div>

              <div class="col-5 text-grey-7 q-mt-sm">Width</div>
              <div class="col-7 q-mt-sm">{{ item.Width }} cm</div>

              <div class="col-5 text-grey-7 q-mt-sm">Year</div>
              <div class="col-7 q-mt-sm">{{ item.Year }}</div>

              <div class="col-5 text-grey-7 q-mt-sm">Inventory Code</div>
              <div class="col-7 q-mt-sm">{{ item["Inv Code"] }}</div>
            </div>
          </div>

          <div class="q-mt-xlx text-body1">
            <div class="">
              <div class="q-mb-sm q-mt-lg">
                <strong class="">Interested in this artwork?</strong>
              </div>

              <div class="q-mt-mdx row q-col-gutter-sm">
                <div class="col-auto">
                  <div>
                    <q-btn
                      :size="$q.screen.lt.md ? 'md' : 'md'"
                      :disable="
                        !['For Sale', 'Details Pending'].includes(item.Status)
                      "
                      color="dark"
                      label="Buy Now"
                      :to="`/checkout/${id}`"
                    />

                    <div
                      v-if="
                        !['For Sale', 'Details Pending'].includes(item.Status)
                      "
                      class="text-caption text-grey q-mt-xs"
                    >
                      This item is no longer available.
                    </div>
                  </div>
                </div>

                <div class="col-auto">
                  <div>
                    <q-btn
                      :size="$q.screen.lt.md ? 'md' : 'md'"
                      color="dark"
                      outline
                      label="Enquire Now"
                      class="q-mt-mdx"
                      @click="showEnquiry = true"
                    />
                  </div>
                </div>
              </div>
              <!-- WhatsApp text -->
              <div class="q-mt-sm">Or contact us using the number below.</div>

              <!-- <div class="q-mt-sm q-pa-sm rounded-borders" style="
                border: 1px solid rgba(0,0,0,0.15);
                font-size: 1.1rem;
                user-select: text;
                display: inline-block;
              ">
                <a href="https://wa.me/+27826009693" style="text-decoration:none; color: inherit;">
                  +27 82 600 9693
                </a>
              </div> -->

              <div class="row items-center q-gutter-sm q-mt-sm">
                <!-- Plain number (selectable, not a link) -->
                <div
                  class="q-pa-sm rounded-borders"
                  style="
                    border: 1px solid rgba(0, 0, 0, 0.15);
                    font-size: 1.1rem;
                    user-select: text;
                  "
                >
                  +27 82 600 9693
                </div>

                <!-- WhatsApp icon -->
                <q-btn
                  round
                  flat
                  color="dark"
                  icon="mdi-whatsapp"
                  :href="'https://wa.me/27826009693'"
                  target="_blank"
                  aria-label="Contact via WhatsApp"
                />

                <!-- Call icon -->
                <q-btn
                  round
                  flat
                  color="dark"
                  icon="mdi-phone"
                  :href="'tel:+27826009693'"
                  aria-label="Call phone number"
                />
              </div>

              <!-- Enquire text -->
              <!-- <div class="q-mt-lg">
                Or send an enquiry using the button below.
              </div> -->
            </div>
          </div>

          <AlwaysMountedModal v-model="showEnquiry">
            <IframeWithLoader
              :src="`https://airtable.com/embed/appWL8gDT9ZaqV8jY/pagdRpra8CQue8ubu/form?prefill_Artwork%20Inventory%20Number=${item['Inv Code']}`"
            />
            <!-- <IframeWithLoader 
              :src="`https://airtable.com/embed/appWL8gDT9ZaqV8jY/pagdRpra8CQue8ubu/form?prefill_Artwork=${id}`"
            /> -->
          </AlwaysMountedModal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ArtworksBoundCache from "src/models/orm-api/ArtworksBoundCache";
import Artworks from "src/models/orm-api/Artworks";
import IframeWithLoader from "src/controllers/IframeWithLoader.vue";
import AlwaysMountedModal from "src/controllers/AlwaysMountedModal.vue";

import SEODataViewer from "src/controllers/SEODataViewer.vue";
import { createMetaMixin } from "quasar";
import { buildSchemaItem, buildSeoConfig } from "src/utils/seo";

export default {
  name: "ArtworkComp",

  components: {
    IframeWithLoader,
    AlwaysMountedModal,
    SEODataViewer,
  },
  mixins: [
    createMetaMixin(function () {
      return this.seoConfig;
    }),
  ],
  data() {
    return {
      showDialog: false,
      loading: true,
      item: {},
      showEnquiry: false,
      dialogueVModel: true,
    };
  },

  computed: {
    id() {
      return this.$route.params.rId;
    },

    superTableModel() {
      return Artworks;
    },

    medium() {
      return (
        this.item["Name (from Medium)"]?.[0] || this.item["Medium"]?.[0] || ""
      );
    },

    mainImage() {
      const att = this.item.Attachments?.[0];
      return att?.thumbnails?.large?.url
        ? `${
            import.meta.env.VITE_API_PROXY_URL
          }/cacher/data-cache/index.php?url=${encodeURIComponent(
            att.thumbnails.large.url,
          )}`
        : this.item["Image Url"] || "";
    },

    placeholderImage() {
      const att = this.item.Attachments?.[0];
      return att?.thumbnails?.small?.url
        ? `${
            import.meta.env.VITE_API_PROXY_URL
          }/cacher/data-cache/index.php?url=${encodeURIComponent(
            att.thumbnails.small.url,
          )}`
        : "";
    },

    cardHeight() {
      return this.$q.screen.lt.md ? "350px" : "600px";
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
        description: this.artworkDescription(this.item),
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
      let imageWidth = import.meta.env.VITE_API_DEFAULT_IMAGE_WIDTH;
      let imageHeight = import.meta.env.VITE_API_DEFAULT_IMAGE_HEIGHT;
      if (this.mainImage) {
        image = this.mainImage;

        const imageObject = this.item.Attachments?.[0]?.thumbnails?.large;
        imageWidth = imageObject.width;
        imageHeight = imageObject.height;
      }

      return buildSeoConfig({
        title: this.item?.["Title"],
        description: this.artworkDescription(this.item),
        url,
        image,
        imageWidth,
        imageHeight,
        siteName,
        type: "Person",
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
      this.loading = true;

      Artworks.FetchById(this.id)
        .then((res) => {
          this.item = res.response.data.fields;
          this.loading = false;
        })
        .catch(() => (this.loading = false));
    },
    artworkDescription(item) {
      const parts = [];

      const medium = item["Name (from Medium)"]?.[0];
      if (medium) {
        parts.push(`A ${medium.toLowerCase()} artwork`);
      }

      const materials = Array.isArray(item["Name (from Materials)"])
        ? item["Name (from Materials)"].join(", ")
        : item["Name (from Materials)"];
      if (materials) {
        parts.push(`made using ${materials}`);
      }

      if (item.Height && item.Width) {
        parts.push(`measuring ${item.Height} × ${item.Width} cm`);
      }

      if (item.Year) {
        parts.push(`created in ${item.Year}`);
      }

      // Capitalize first letter, add full stop
      return parts.length
        ? parts.join(", ").replace(/^./, (c) => c.toUpperCase()) + "."
        : "";
    },
    async fetchData() {
      // console.time('[ArtworkSingle] fetchData total')
      this.loading = true;

      try {
        // console.time('[ArtworkSingle] FetchAll (bound cache)')
        const res = await ArtworksBoundCache.FetchAll("auto", [], {
          view: "viwn7wDGK6yk5ZHOl",
        });
        // console.timeEnd('[ArtworkSingle] FetchAll (bound cache)')

        // console.time('[ArtworkSingle] Map records')
        const records = res.response.data.records.map((r) => ({
          id: r.id,
          ...r.fields,
        }));
        // console.timeEnd('[ArtworkSingle] Map records')

        // console.time('[ArtworkSingle] Find item')
        this.item = records.find((r) => r.id === this.id) || null;
        // console.timeEnd('[ArtworkSingle] Find item')
      } catch (e) {
        this.item = null;
      } finally {
        this.loading = false;
        // console.timeEnd('[ArtworkSingle] fetchData total')
      }
    },
  },

  mounted() {
    // this.fetchData();
    this.fetchIndiData();
  },
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 4px;
}
</style>
