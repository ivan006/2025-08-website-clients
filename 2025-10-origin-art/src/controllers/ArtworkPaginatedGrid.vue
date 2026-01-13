<template>


  <ItemsPaginatedGrid :showArrows="false" :items="items" v-model:page="currentPage" :items-per-page="itemsPerPage">

    <template #item="{ item }">
      <ArtworkCard :art="item" />
    </template>
  </ItemsPaginatedGrid>

</template>

<script>
import ArtworkCard from 'src/controllers/ArtworkCard.vue'
import ItemsPaginatedGrid from 'src/controllers/ItemsPaginatedGrid.vue'

export default {
  name: 'ArtworkPaginatedGrid',

  components: {
    ArtworkCard,
    ItemsPaginatedGrid
  },

  props: {
    items: { type: Array, required: true },
    // page: { type: Number, required: true },
    itemsPerPage: { type: Number, default: 8 }
  },
  data() {
    return {
      currentPage: 0,
    }
  },

}
</script>
