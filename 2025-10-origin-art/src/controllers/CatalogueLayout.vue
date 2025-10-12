<template>
  <div>
    <!-- 📱 Sticky bar on mobile -->
    <div
      class="q-pa-sm bg-grey-2x bg-white flex justify-between items-center q-mb-md"
      style="position: sticky; top: 0; z-index: 3;"
      v-if="$q.screen.lt.md"
    >
      <div class="text-subtitle1">Catalogue</div>
      <q-btn flat color="primary" class="text-3ry-color" label="Filters" @click="showFilters = true" />
    </div>

    <div class="row q-col-gutter-mdx " >
      <!-- 🧭 Filters Sidebar (desktop only) -->
      <div class="col-12 col-md-2 q-pa-md" v-if="$q.screen.gt.sm" style="border-right: 1px solid rgba(0, 0, 0, 0.12);">
        <div
        class="q-pa-mdx bg-grey-2x rounded-borders "
        style="position: sticky; top: 10px; z-index: 2;"
        >
            <slot name="filters" />
        </div>
      </div>

      <!-- 🖼️ Catalogue -->
      <div class="col-12 col-md-10 q-pb-md bg-2ry-color q-pa-sm">
        <slot name="content" />
      </div>
    </div>

    <!-- 📱 Mobile Filters Drawer (full width) -->
    <q-drawer
      v-model="showFilters"
      side="right"
      overlay
      bordered
      content-class="bg-white"
      behavior="mobile"
      :width="$q.screen.width"  
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
          <q-btn label="Done" color="" unelevated class="full-width bg-3ry-color" @click="showFilters = false" />
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
