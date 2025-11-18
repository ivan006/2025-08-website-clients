<template>
  <div class="container-xl q-py-xl">

      <IframeWithLoader />
    <div v-if="loading" class="text-center q-pa-xl">
      Loading...
    </div>

    <div v-else class="row q-col-gutter-xl">
      <!-- LEFT: IMAGE -->
      <div class="col-12 col-md-6 flex flex-center">
        <q-img
          :src="mainImage"
          :placeholder-src="placeholderImage"
          fit="contain"
          class="rounded-borders"
          style="max-height: 90vh; width: 100%;"
        />
      </div>
      

      <!-- RIGHT: DETAILS -->
      <div class="col-12 col-md-6 q-pl-md-lg">

        <!-- Title -->
        <div class="text-h4 font-1ry">{{ item.Title }}</div>

        <!-- Subtitle / Artist Name -->
        <div class="text-subtitle2 text-grey-7 q-mt-xs">
          {{ item['Name (from Artist)']?.[0] || '' }}
        </div>

        <!-- Specs -->
        <div class="q-mt-xl text-body2">
          <div class="row q-col-gutter-sm">

            <div class="col-5 text-grey-7">Medium</div>
            <div class="col-7">{{ medium }}</div>

            <div class="col-5 text-grey-7 q-mt-sm">Height</div>
            <div class="col-7 q-mt-sm">{{ item.Height }} cm</div>

            <div class="col-5 text-grey-7 q-mt-sm">Width</div>
            <div class="col-7 q-mt-sm">{{ item.Width }} cm</div>

            <div class="col-5 text-grey-7 q-mt-sm">Artist</div>
            <div class="col-7 q-mt-sm">
              {{ item['Name (from Artist)']?.[0] }}
            </div>

            <div class="col-5 text-grey-7 q-mt-sm">Year</div>
            <div class="col-7 q-mt-sm">{{ item.Year }}</div>

          </div>
        </div>

        <!-- CTA BLOCK -->
        <div class="q-mt-xl bg-grey-1 q-pa-lg rounded-borders text-body1">
          <strong>Interested in this artwork?</strong><br>
          WhatsApp us at <a href="https://wa.me/0987654321">098&nbsp;765&nbsp;4321</a> to learn more, request a call-back, or book an in-person meeting. You can also call us directly.

        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Secondary_Page_Items from "src/models/orm-api/Secondary_Page_Items";
import IframeWithLoader from "src/controllers/IframeWithLoader.vue";

export default {
  name: "Artwork_Single_Controller",

  components: {
    IframeWithLoader
  },
  data() {
    return {
      loading: true,
      item: {},
    };
  },

  computed: {
    id() {
      return this.$route.params.rId;
    },

    superTableModel() {
      return Secondary_Page_Items;
    },

    medium() {
      return this.item["Name (from Medium)"]?.[0] ||
             this.item["Medium"]?.[0] ||
             "";
    },

    mainImage() {
      const att = this.item.Attachments?.[0];
      return att?.thumbnails?.large?.url
        ? `https://capetownlists.co.za/?url=${encodeURIComponent(att.thumbnails.large.url)}`
        : this.item["Image Url"] || "";
    },

    placeholderImage() {
      const att = this.item.Attachments?.[0];
      return att?.thumbnails?.small?.url
        ? `https://capetownlists.co.za/?url=${encodeURIComponent(att.thumbnails.small.url)}`
        : "";
    }
  },

  methods: {
    fetchData() {
      this.loading = true;

      this.superTableModel
        .FetchById(this.id, [], { flags: {}, moreHeaders: {}, rels: [] })
        .then((res) => {
          this.item = res.response.data.fields;
          this.loading = false;
        })
        .catch(() => (this.loading = false));
    },
  },

  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 4px;
}
</style>
