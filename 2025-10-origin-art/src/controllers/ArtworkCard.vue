<template>
  <q-card flat bordered class="text-1ry-color box-shadow-1ry rounded-borders">

    <q-img
      :src="largeUrl"
      :placeholder-src="smallUrl"
      ratio="1"
      class="rounded-borders"
      :style="{ height: cardHeight, objectFit: 'contain' }"
      fit="contain"
      style="background-color: #EEE;"
    />
    
    <q-separator />

    <q-card-section>
      <div class="text-h6 font-1ry" style="min-height: 64px;">
        {{ art.Title }}
      </div>

      <div class="text-subtitle2 text-2ry-color q-mt-xs">
        {{ artistName }}
      </div>

      <div class="text-body1 q-mt-xs text-weight-bold">
        R{{ Number(art.Price)?.toLocaleString() }}
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        flat
        size="sm"
        label="View Details"
        class="bg-1ry-color"
        :to="`/artworks/${art.id}/${slugify(art.Title || 'artwork')}`"
      />
    </q-card-actions>


  </q-card>
</template>

<script>
export default {
  name: "ArtworkCard",

  props: {
    art: { type: Object, required: true },
  },

  computed: {
    attachments() {
      return this.art.Attachments?.[0] || {};
    },

    largeUrl() {
      const u = this.attachments.thumbnails?.large?.url;
      return u ? `https://capetownlists.co.za/?url=${encodeURIComponent(u)}` : "";
    },

    smallUrl() {
      const u = this.attachments.thumbnails?.small?.url;
      return u ? `https://capetownlists.co.za/?url=${encodeURIComponent(u)}` : "";
    },

    artistName() {
      return this.art["Name (from Artist)"]?.[0] || "Unknown Artist";
    },

    cardHeight() {
      return this.$q.screen.lt.md ? "150px" : "250px";
    }
  },
  methods: {


    slugify(text) {
      return text
        .toLowerCase()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w-]+/g, '')     // Remove non-word characters
        .replace(/--+/g, '-')        // Merge multiple -
        .replace(/^-+|-+$/g, '');    // Trim - from start/end
    },
  }
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 4px;
}
</style>
