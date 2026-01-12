<template>
  <div class="bg-white">

    <div class="container-sm q-py-lg ">

      <SEODataViewer :seoConfig="seoConfigMasked" :seoLdJson="seoLdJson" />
      <div v-if="loading" class="text-center q-pa-xl">
        Loading...
      </div>

      <template v-else>


      </template>

    </div>
  </div>
</template>

<script>
import Policies from "src/models/orm-api/Policies";

import SEODataViewer from "src/controllers/SEODataViewer.vue";
import { createMetaMixin } from 'quasar'
import { buildSchemaItem, buildSeoConfig } from 'src/utils/seo'

export default {
  name: "PolicyPrivacyComp",

  components: {
    SEODataViewer,
  },
  mixins: [createMetaMixin(function () { return this.seoConfig })],
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
      return 'recIL2JG4aDRfVi78';
    },




    seoLdJson() {
      const url = window.location.origin + (this.$route?.fullPath.split('#')[0] || '/');
      const siteName = import.meta.env.VITE_API_SITE_TITLE;

      let image = import.meta.env.VITE_API_DEFAULT_IMAGE
      if (this.mainImage) {
        image = this.mainImage;
      }


      const schema = buildSchemaItem({
        type: this.item?.['SEO Type'],
        name: this.item?.['Title'] || siteName,
        description: this.artworkDescription(this.item),
        url,
        image,
        extras: {
        }
      })



      return schema;
    },
    seoConfig() {

      const url = window.location.origin + (this.$route?.fullPath.split('#')[0] || '/');
      const siteName = import.meta.env.VITE_API_SITE_TITLE;


      let image = import.meta.env.VITE_API_DEFAULT_IMAGE
      if (this.mainImage) {
        image = this.mainImage;
      }


      return buildSeoConfig({
        title: this.item?.['Title'],
        description: this.artworkDescription(this.item),
        url,
        image,
        siteName,
        type: "Person",
        schema: this.seoLdJson
      });
    },

    seoConfigMasked() {
      const c = { ...this.seoConfig }
      c.script = ''
      return c
    }
  },

  methods: {

    fetchIndiData() {
      this.loading = true;

      Policies
        .FetchById(this.id, [], { flags: {}, moreHeaders: {}, rels: [] })
        .then((res) => {
          this.item = res.response.data.fields;
          this.loading = false;
        })
        .catch(() => (this.loading = false));
    },
    artworkDescription(item) {
      return 1
    },


  },

  mounted() {
    this.fetchIndiData();
  },
};
</script>
