<template>
  <div>
    <!-- 📱 Sticky bar on mobile -->
    <div
      class="q-pa-sm bg-grey-2 flex justify-between items-center"
      style="position: sticky; top: 0; z-index: 3;"
      v-if="$q.screen.lt.md"
    >
      <div class="text-subtitle1">Catalogue</div>
      <q-btn flat color="primary" label="Filters" @click="showFilters = true" />
    </div>

    <div class="row q-col-gutter-md">
      <!-- 🧭 Filters Sidebar (desktop only) -->
      <div class="col-12 col-md-3" v-if="$q.screen.gt.sm">
        <div
          class="q-pa-md bg-grey-2 rounded-borders"
          style="position: sticky; top: 0; z-index: 2;"
        >
          <slot name="filters" />
        </div>
      </div>

      <!-- 🖼️ Catalogue -->
      <div class="col-12 col-md-9">
        <slot name="content" />
      </div>
    </div>

    <!-- 📱 Mobile Filters Drawer -->
    <q-drawer
      v-model="showFilters"
      side="right"
      overlay
      bordered
      content-class="bg-white"
    >
      <div class="column full-height">
        <!-- Sticky header -->
        <div
          class="q-pa-md bg-grey-3 text-h6 text-center"
          style="position: sticky; top: 0; z-index: 2;"
        >
          Filters
        </div>

        <!-- Scrollable filters content -->
        <div class="q-pa-md scroll" style="flex: 1; overflow-y: auto;">
          <slot name="filters" />
        </div>

        <!-- Sticky footer -->
        <div
          class="q-pa-md bg-grey-2"
          style="position: sticky; bottom: 0; z-index: 2;"
        >
          <q-btn label="Done" color="primary" unelevated class="full-width" @click="showFilters = false" />
        </div>
      </div>
    </q-drawer>
  </div>
</template>

<script>
export default {
  name: 'CatalogueLayout',
  data () {
    return {
      showFilters: false
    }
  }
}
</script>
