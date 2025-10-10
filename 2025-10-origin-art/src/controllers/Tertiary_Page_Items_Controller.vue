<template>
  <div class="q-pa-md">
    <catalogue-layout>
      <template #filters>
        <div>
          <q-input filled label="Search" class="q-mb-md" />
          <q-select filled label="Category" :options="['A', 'B', 'C']" class="q-mb-md" />
          <q-btn label="Apply" color="primary" />
        </div>
      </template>

      <template #content>
        <div class="q-gutter-md">
          <q-card v-for="n in 12" :key="n" class="q-pa-md">
            <div class="text-h6">Item {{ n }}</div>
            <div class="text-caption text-grey">Some description here...</div>
          </q-card>
        </div>
      </template>
    </catalogue-layout>
  </div>
</template>


<script>
import CatalogueLayout from 'src/controllers/CatalogueLayout.vue'

export default {
  name: 'Tertiary_Page_Items_Controller',
  components: { CatalogueLayout }
}
</script>

