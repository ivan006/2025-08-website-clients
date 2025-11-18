<template>
  <div>

    <!-- Backdrop -->
    <div 
      v-show="modelValue"
      class="fixed full-width full-height"
      style="
        top:0;
        left:0;
        background: rgba(0,0,0,0.4);
        z-index: 2000;
      "
      @click="close"
    ></div>

    <!-- Modal container -->
    <div 
      v-show="modelValue"
      class="fixed flex items-center justify-center"
      style="
        top:0;
        left:0;
        width:100vw;
        height:100vh;
        z-index: 2001;
      "
    >
      <q-card
        flat
        bordered
        class="bg-white"
        style="
          width:700px;
          max-width:95vw;
          min-height:400px;
          max-height:90vh;
          overflow:hidden;
        "
      >
        <slot />
      </q-card>
    </div>

  </div>
</template>

<script>
export default {
  name: "AlwaysMountedModal",
  props: {
    modelValue: { type: Boolean, required: true }
  },
  emits: ["update:modelValue"],
  methods: {
    close() {
      this.$emit("update:modelValue", false)
    }
  }
}
</script>
