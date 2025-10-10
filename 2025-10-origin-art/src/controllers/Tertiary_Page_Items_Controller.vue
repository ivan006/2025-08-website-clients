<template>
  <q-page class="bg-2ry-color q-pa-xl" style="overflow: visible;">
    <CatalogueLayout>
      <template #filters>
        <div>
          <h5 class="text-h6 q-mb-md">Filters</h5>
          <q-select filled label="Category" :options="['Art', 'Design', 'Sculpture']" />
          <q-select filled label="Color" :options="['Red', 'Blue', 'Gold']" class="q-mt-sm" />
          <q-btn class="q-mt-md full-width" color="primary" label="Apply" />
        </div>
      </template>

      <template #content>
        <div class="row q-col-gutter-lg">
          <div v-for="n in 25" :key="n" class="col-12 col-sm-6 col-md-4">
            <q-card flat bordered class="bg-white text-dark">
              <q-img :src="`https://picsum.photos/400/400?random=${n}`" ratio="1" />
              <q-card-section>
                <div class="text-h6">Artwork {{ n }}</div>
                <div class="text-subtitle2 text-grey">R{{ (n * 150).toLocaleString() }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </template>
    </CatalogueLayout>
  </q-page>
</template>

<script>
import CatalogueLayout from 'src/controllers/CatalogueLayout.vue'
export default { components: { CatalogueLayout } }
</script>
