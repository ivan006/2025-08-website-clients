<template>
  <div>
    <!-- 📱 Sticky filter bar (mobile only) -->
    <div
      class="bg-white q-pa-sm shadow-2 row justify-between items-center"
      style="position: sticky; top: 0; z-index: 10;"
      v-if="$q.screen.lt.md"
    >
      <div class="text-subtitle1">Catalogue</div>
      <q-btn
        color="primary"
        label="Filters"
        @click="showFilters = true"
        dense
      />
    </div>

    <div class="row q-col-gutter-md">
      <!-- 🧭 Sidebar (desktop filters) -->
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

    <!-- 📱 Mobile filters panel -->
    <q-dialog v-model="showFilters" persistent full-width maximized>
      <q-card style="min-height: 100vh; display: flex; flex-direction: column;">
        <q-card-section class="q-pa-md scroll" style="flex: 1; overflow-y: auto;">
          <slot name="filters" />
        </q-card-section>

        <!-- 🧩 Sticky Done button -->
        <q-card-actions align="center" class="bg-white q-pa-md shadow-2">
          <q-btn label="Done" color="primary" @click="showFilters = false" class="full-width" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
