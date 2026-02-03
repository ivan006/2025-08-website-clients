<template>
  <div class="bg-blackx text-whitex">
    <q-separator />
    <div class="container-md q-py-xl">
      <div v-if="loading" class="text-center q-pa-xl">Loading...</div>

      <div v-else class="row justify-center q-col-gutter-lg">
        <!-- COLUMN 1 — LOGO + SOCIALS -->
        <div class="col-4 col-md-3 flex column items-start">
          <img
            :src="
              item.fields?.['Logo Image']?.[0]?.thumbnails?.large?.url
                ? $apiProxyUrl +
                  encodeURIComponent(
                    item.fields['Logo Image'][0].thumbnails.large.url,
                  )
                : ''
            "
            alt="Origin Art Logo"
            style="height: 90px"
          />
        </div>

        <!-- COLUMN 2 — CONTACT INFO -->
        <div class="col-4 col-md-3">
          <div class="text-h6 text-weight-bold font-1ry">Contact</div>

          <!-- Phone -->
          <div class="q-mt-sm">
            {{ item.fields?.["Phone Number"] }}
          </div>

          <!-- Email -->
          <div class="q-mt-xs">
            <a :href="'mailto:' + item.fields?.['Email']" class="text-dark">
              {{ item.fields?.["Email"] }}
            </a>
          </div>

          <!-- SOCIAL ICONS -->
          <div class="row q-mt-md q-gutter-md">
            <a
              :href="item.fields?.['Facebook URL']"
              target="_blank"
              class="text-dark"
            >
              <q-icon name="mdi-facebook" size="22px" />
            </a>
            <a
              :href="item.fields?.['Instagram URL']"
              target="_blank"
              class="text-dark"
            >
              <q-icon name="mdi-instagram" size="22px" />
            </a>
          </div>
        </div>

        <!-- COLUMN 2 — CONTACT INFO -->
        <div class="col-4 col-md-3">
          <div class="text-h6 text-weight-bold font-1ry">Address</div>

          <!-- Address -->
          <div class="q-mt-sm" style="white-space: pre-line; opacity: 0.8">
            {{ item.fields?.["Address"] }}
          </div>
        </div>

        <!-- COLUMN 3 — NEWSLETTER -->
        <div class="col-6 col-md-3">
          <div class="text-h6 text-weight-bold font-1ry">Newsletter</div>

          <q-btn
            :size="$q.screen.lt.md ? 'md' : 'md'"
            color="dark"
            no-caps
            :href="item.fields?.['Subscribe Link']"
            target="_blank"
            class="full-width"
          >
            <div class="flex items-center justify-between full-width">
              <div>Subscribe</div>
              <div>
                <q-icon size="xs" name="mdi-send" />
              </div>
            </div>
          </q-btn>
          <!-- <a :href="item.fields?.['Subscribe Link']" target="_blank"
            class="q-mt-md bg-dark text-white q-pa-sm rounded-borders full-width flex items-center justify-between"
            style="text-decoration:none;">
            <span>Subscribe</span>
            <q-icon name="mdi-send" />
          </a> -->
        </div>
      </div>
    </div>

    <q-separator />
    <!-- COPYRIGHT STRIP -->
    <div class="bg-grey-2 text-whitex q-py-sm">
      <div class="container-md flex items-center justify-center text-center">
        <div style="opacity: 0.6; font-size: 13px">
          {{ item.fields?.["Copyright Text"] }}
        </div>
        <div class="q-mt-xs text-caption" style="opacity: 0.6">
          <router-link to="/privacy-policy" class="q-mr-md text-dark">
            Privacy Policy
          </router-link>
          <router-link to="/refund-policy" class="text-dark">
            Refund Policy
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Site from "src/models/orm-api/Site";

export default {
  name: "FooterController",
  data() {
    return {
      loading: true,
      item: {},
    };
  },

  computed: {
    id() {
      return "recE9Mnz1vihDkgXU";
    },
    superTableModel() {
      return Site;
    },
  },

  methods: {
    fetchData() {
      this.loading = true;
      this.superTableModel
        .FetchById(this.id, [], { flags: {}, moreHeaders: {}, rels: [] })
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
