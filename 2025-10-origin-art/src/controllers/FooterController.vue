<template>
  <div class="bg-dark text-white">

    <div class="container-md q-py-xl">

      <div v-if="loading" class="text-center q-pa-xl">Loading...</div>

      <div v-else class="row q-col-gutter-lg">

        <!-- COLUMN 1 — BRAND -->
        <div class="col-12 col-md-3">
          <div class="text-h6 text-weight-bold">
            {{ item.fields?.['Site Title'] || 'Origin Art' }}
          </div>

          <div class="q-mt-sm" style="opacity: .8;">
            Fresh contemporary art from South Africa, curated with intention.
          </div>

          <!-- SOCIAL -->
          <div class="row q-mt-md q-gutter-md">
            <a :href="item.fields?.['Facebook URL']" target="_blank" class="text-white">
              <q-icon name="mdi-facebook" size="20px" />
            </a>
            <a :href="item.fields?.['Instagram URL']" target="_blank" class="text-white">
              <q-icon name="mdi-instagram" size="20px" />
            </a>
          </div>
        </div>


        <!-- COLUMN 2 — CONTACT -->
        <div class="col-6 col-md-3">
          <div class="text-h6 text-weight-bold">Contact</div>

          <div class="q-mt-sm" style="opacity:.8;">
            {{ item.fields?.['Address'] }}
          </div>

          <div class="q-mt-sm">
            📞 {{ item.fields?.['Phone Number'] }}
          </div>

          <div class="q-mt-xs">
            ✉️ <a :href="'mailto:' + item.fields?.['Email']" class="text-white">
              {{ item.fields?.['Email'] }}
            </a>
          </div>
        </div>


        <!-- COLUMN 3 — LINKS -->
        <div class="col-6 col-md-3">
          <div class="text-h6 text-weight-bold">Quick Links</div>

          <div class="column q-mt-sm" style="opacity:.8;">
            <router-link class="text-white q-mt-xs" to="/artists">Artists</router-link>
            <router-link class="text-white q-mt-xs" to="/artworks">Artworks</router-link>
            <router-link class="text-white q-mt-xs" to="/about">About</router-link>
            <router-link class="text-white q-mt-xs" to="/contact">Contact</router-link>
          </div>
        </div>


        <!-- COLUMN 4 — NEWSLETTER -->
        <div class="col-12 col-md-3">
          <div class="text-h6 text-weight-bold">Newsletter</div>

          <a :href="item.fields?.['Subscribe Link']" target="_blank"
            class="q-mt-sm bg-white text-dark q-pa-sm rounded-borders full-width flex items-center justify-between"
            style="text-decoration:none;">
            <span>Subscribe</span>
            <q-icon name="mdi-send" />
          </a>
        </div>

      </div>
    </div>


    <!-- COPYRIGHT STRIP -->
    <div class="bg-black text-white q-py-sm">
      <div class="container-md flex items-center justify-between">
        <div style="opacity:.6; font-size:13px;">
          {{ item.fields?.['Copyright Text'] }}
        </div>

        <div style="opacity:.6; font-size:13px;">English ▾</div>
      </div>
    </div>

  </div>
</template>


<script>
import Site from "src/models/orm-api/Site";

export default {
  name: 'FooterController',
  data() {
    return {
      loading: true,
      item: {},
    };
  },

  computed: {
    id() {
      return 'reci1Y5KdKFBkz3T1';
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
