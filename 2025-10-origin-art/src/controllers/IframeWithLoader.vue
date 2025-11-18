<template>
  <div class="iframe-wrapper" style="position: relative; min-height: 300px;">
    
    <!-- LOADING OVERLAY -->
    <div
      v-if="loading"
      class="loading-overlay flex flex-center"
      style="
        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        background:white;
        z-index:10;
      "
    >
      <q-spinner color="primary" size="40px" />
      <!-- If you're not using Quasar, replace the above with any spinner -->
    </div>

    <!-- IFRAME -->
    <!-- <iframe
      :src="src"
      frameborder="0"
      style="width:100%; height:100%;"
    ></iframe> -->

    
    <iframe 
        class="airtable-embed" src="https://airtable.com/embed/appWL8gDT9ZaqV8jY/pagdRpra8CQue8ubu/form" 
        frameborder="0" 
        onmousewheel="" 
        width="100%" height="850" 
        style="background: transparent; "
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
      this.loading = false;
    }
  }
}
</script>
