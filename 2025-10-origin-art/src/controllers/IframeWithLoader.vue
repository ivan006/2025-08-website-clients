<template>
  <div class="iframe-wrapper">
    
    <!-- LOADING OVERLAY -->
    <div
      v-if="loading"
      class="loading-overlay flex flex-center"
      style="
      "
    >
      <!-- <q-spinner color="primary" size="40px" /> -->
      Loading...
    </div>

    <!-- IFRAME -->
    <iframe 
      class="airtable-embed"
      :src="src"
      frameborder="0"
      width="100%"
      height="850"
      style="background: transparent;"
      @load="onLoad"
    ></iframe>

  </div>
</template>

<script>
export default {
  name: "IframeWithLoader",
  props: {
    src: { type: String, required: true }
  },
  data() {
    return {
      loading: true
    };
  },
  methods: {
    onLoad() {
      // Add a 2-second delay before hiding loader
      setTimeout(() => {
        this.loading = false;
      }, 3000); // change to 3000ms or 4000ms if needed
    }
  }
}
</script>
