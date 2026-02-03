<template>
  <div
    :style="
      this.item.fields?.['Image']?.[0]?.url
        ? `background-image: url(${$apiProxyUrl}${encodeURIComponent(
            this.item.fields?.['Image']?.[0]?.url,
          )});`
        : ``
    "
    style="
      min-height: 100vh;
      background-color: rgb(70, 70, 70);
      background-position: center;
      background-size: contain;

      background-color: rgba(0, 0, 0, 0.5);
      background-blend-mode: darken;
      padding-top: 0px;
    "
    class="ScaledParent"
  >
    <!-- background-size: cover; -->
    <!-- background-attachment: fixed; -->
    <div v-show="loading || childLoading">
      <div class="text-center q-pa-xl">Loading...</div>
    </div>
    <div v-show="!(loading || childLoading)">
      <div class="q-py-xl">
        <div class="container-md text-white">
          <div class="row q-col-gutter-md justify-center">
            <div class="col-xl-8 col-md-8 col-12">
              <div class="gt-md q-py-xl"></div>

              <h1 class="text-center r-font-h2 text-bold">
                <span
                  class="text-weight-thin font-1ry text-uppercase"
                  style="letter-spacing: 15px"
                >
                  {{ item.fields?.["Title"] }} - Dont Look at me!
                </span>
              </h1>

              <h2 class="text-center r-font-h4">
                <span
                  class="text-weight-light font-2ry text-uppercase"
                  style="letter-spacing: 15px"
                >
                  {{ item.fields?.["Subtitle"] }}
                </span>
              </h2>

              <div class="gt-md q-py-xl"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white text- q-py-xl">
        <div class="container-md">
          <h2 class="r-font-h3 text-center q-my-none text-uppercase font-1ry">
            {{ item.fields?.["List Section Title"] }}
          </h2>
        </div>
      </div>

      <div class="bg-2ry-color">
        <div class="container-md q-py-xl">
          <HomeItemsCompOld
            :parent="this.item"
            @loaded="childLoading = false"
          />
        </div>
      </div>

      <div class="bg-white text- q-py-xl" id="contact">
        <div class="container-md">
          <h2 class="r-font-h3 text-center q-my-none text-uppercase font-1ry">
            Contact Us
          </h2>
        </div>
      </div>
      <div class="bg-2ry-color">
        <div class="container-md q-py-xl">
          <!-- <Tertiary_Page_Items_Controller :parent="this.item" /> -->
          <div class="bg- text-dark">
            <div class="row q-col-gutter-md justify-around text-center">
              <!-- Phone -->
              <div class="col-md-4 col-6">
                <q-card
                  class="q-ma-sm bg-white"
                  style="border-radius: 10px"
                  flat
                >
                  <q-card-section>
                    <q-icon name="call" size="48px" color="green" />
                    <h5 class="q-my-md text-uppercase font-1ry">Call Us</h5>
                    <p class="text-body1">
                      {{ item.fields?.["Phone Number"] }}
                    </p>
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-md-4 col-6">
                <q-card
                  class="q-ma-sm bg-white"
                  style="border-radius: 10px"
                  flat
                >
                  <q-card-section>
                    <q-icon name="mail" size="48px" color="green" />
                    <h5 class="q-my-md text-uppercase font-1ry">Email Us</h5>
                    <p class="text-body1">
                      {{ item.fields?.["Email Address"] }}
                    </p>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Opening Hours -->
              <div class="col-md-4 col-12">
                <q-card
                  class="q-ma-sm bg-white"
                  style="border-radius: 10px"
                  flat
                >
                  <q-card-section>
                    <q-icon name="schedule" size="48px" color="green" />
                    <h5 class="q-my-md text-uppercase font-1ry">
                      Opening Hours
                    </h5>
                    <p class="text-body1" style="white-space: pre-line">
                      {{ item.fields?.["Opening Hours"] }}
                    </p>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Address & Directions -->
              <div class="col-6 col-md-6 col-12">
                <q-card
                  class="q-ma-sm bg-white text-"
                  style="border-radius: 10px"
                  flat
                >
                  <q-card-section>
                    <q-icon
                      class="text"
                      name="place"
                      size="48px"
                      color="green"
                    />
                    <h5 class="q-my-md text-uppercase font-1ry">Find Us</h5>
                    <p class="text-body1" style="white-space: pre-line">
                      {{ item.fields?.["Address"] }}
                    </p>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- Map -->
            <div class="q-mt-md">
              <q-card class="q-ma-sm bg-white" style="border-radius: 10px" flat>
                <q-card-section>
                  <iframe
                    width="100%"
                    height="400"
                    frameborder="0"
                    style="border: 0"
                    allowfullscreen
                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyApw7uDtsYbaB0YzeB-xkWSz__rVRLi6VQ&q=52+Main+Rd,+Diep+River,+Cape+Town,+7800,+South+Africa"
                  >
                  </iframe>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Home_Page from "src/models/orm-api/Home_Page";
import { createMetaMixin } from "quasar";
import HomeItemsCompOld from "src/controllers/HomeItemsCompOld.vue";
import { buildSeoConfig } from "src/utils/seo";

export default {
  name: "HomeCompOld",
  components: { HomeItemsCompOld },
  // mixins: [

  //   createMetaMixin(function () {
  //     const url = window.location.origin + (this.$route?.fullPath.split('#')[0] || '/');
  //     const siteName = import.meta.env.VITE_API_SITE_TITLE;

  //     let image = ""
  //     if (this.item?.fields?.['Image']?.[0]?.url) {
  //       image = `${import.meta.env.VITE_API_PROXY_URL}/cacher/data-cache/index.php?url=${encodeURIComponent(this.item?.['Image']?.[0]?.url)}`;
  //       image = `${import.meta.env.VITE_API_PROXY_URL}/cacher/data-cache/index.php?url=${encodeURIComponent(this.item?.fields?.['Image']?.[0]?.url)}`;
  //     }

  //     return buildSeoConfig({
  //       title: this.item.fields?.['Title'] || siteName,
  //       description: this.item.fields?.['Subtitle'] || '',
  //       url,
  //       image: image || `${window.location.origin}/og-default.jpg`,
  //       siteName,
  //       type: this.item.fields?.['SEO Type'],
  //     });
  //   })
  // ],
  data() {
    return {
      loading: true,
      childLoading: false,
      item: {},
    };
  },
  computed: {
    id() {
      // return this.$route.params.rId
      return "rec2ykH253BM2Qrsc";
    },
    superTableModel() {
      return Home_Page;
    },
  },
  methods: {
    fetchData() {
      this.loading = true;
      this.superTableModel
        .FetchById(
          this.id,
          // this.relationships,
          [],
          { flags: {}, moreHeaders: {}, rels: [] },
        )
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
  },
};
</script>

<style scoped></style>
