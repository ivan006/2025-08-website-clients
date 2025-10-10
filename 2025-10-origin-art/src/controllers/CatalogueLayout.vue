<template>
  <div class="row no-wrap items-start">
    <!-- 🧭 Sidebar -->
    <div class="col-12 col-md-3 q-pr-md">
      <div
        class="q-pa-md bg-3ry-color text-white rounded-borders"
        style="position: sticky; top: 80px; z-index: 2;"
      >
        <slot name="filters" />
      </div>
    </div>

    <!-- 🖼️ Catalogue -->
    <div class="col-12 col-md-9">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default { name: 'CatalogueLayout' }
</script>
