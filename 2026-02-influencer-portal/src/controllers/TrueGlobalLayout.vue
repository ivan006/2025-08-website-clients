<template>
  <div>
    <router-view />

    <DataCacheManager />
  </div>
</template>

<script>
import DataCacheManager from "src/controllers/DataCacheManager.vue";
export default {
  name: "GlobalController",
  components: {
    DataCacheManager,
  },
};
</script>
