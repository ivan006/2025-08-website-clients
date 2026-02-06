<template>
  <div class="iframe-wrapper">
    <!-- LOADING OVERLAY -->
    <div v-if="loading" class="flex flex-center" style="height: 700px">
      <!-- <q-spinner color="primary" size="40px" /> -->
      Loading...
    </div>

    <!-- IFRAME -->
    <iframe
      class="airtable-embed"
      :src="src"
      frameborder="0"
      width="100%"
      height="700px"
      style="background: transparent"
      :style="loading ? 'display: none;' : ''"
      @load="onLoad"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "IframeWithLoader",
  props: {
    src: { type: String, required: true },
  },
  data() {
    return {
      loading: true,
    };
  },
  methods: {
    onLoad() {
      // Add a 2-second delay before hiding loader
      setTimeout(() => {
        this.loading = false;
      }, 2000); // change to 3000ms or 4000ms if needed
    },
  },
};
</script>
