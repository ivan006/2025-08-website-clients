<template>
  <div ref="top">
    <div class="row items-center no-wrap">

      <!-- ◀️ LEFT ARROW -->
      <div v-if="!$q.screen.lt.md" class="col-auto q-pr-sm">
        <q-btn
          flat
          round
          color="primary"
          icon="chevron_left"
          :size="$q.screen.lt.md ? 'xl' : 'lg'"
          @click="updatePage(page - 1)"
          :disable="page <= 0"
        />
      </div>

      <!-- GRID -->
      <div class="col">
        <div class="row q-col-gutter-lgx justify-center">
          <div
            v-for="art in pagedItems"
            :key="art.id"
            class="col-6 col-md-3 q-pa-sm"
          >
            <ArtworkCard :art="art" />
          </div>
        </div>
      </div>

      <!-- ▶️ RIGHT ARROW -->
      <div v-if="!$q.screen.lt.md" class="col-auto q-pl-sm">
        <q-btn
          flat
          round
          color="primary"
          icon="chevron_right"
          :size="$q.screen.lt.md ? 'xl' : 'lg'"
          @click="updatePage(page + 1)"
          :disable="page >= totalPages - 1"
        />
      </div>

    </div>

    <!-- BOTTOM PAGINATION -->
    <div class="text-center q-mt-lg flex flex-center q-gutter-sm">

      <q-btn
        flat
        color="primary"
        icon="chevron_left"
        label="Previous"
        :disable="page <= 0"
        @click="updatePage(page - 1)"
      />

      <div>
        <q-btn
          v-for="n in totalPages"
          :key="n"
          :size="$q.screen.lt.md ? 'md' : 'sm'"
          flat
          round
          :label="n"
          :color="n - 1 === page ? 'primary' : 'grey-6'"
          @click="updatePage(n - 1)"
        />
      </div>

      <q-btn
        flat
        color="primary"
        icon-right="chevron_right"
        label="Next"
        :disable="page >= totalPages - 1"
        @click="updatePage(page + 1)"
      />

    </div>

  </div>
</template>

<script>
import ArtworkCard from 'src/controllers/ArtworkCard.vue'

export default {
  name: 'ArtworkPaginatedGrid',

  components: {
    ArtworkCard
  },

  props: {
    items: { type: Array, required: true },
    page: { type: Number, required: true },
    itemsPerPage: { type: Number, default: 8 }
  },

  computed: {
    totalPages() {
      return Math.ceil(this.items.length / this.itemsPerPage)
    },

    pagedItems() {
      const start = this.page * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.items.slice(start, end)
    }
  },

  methods: {
    updatePage(newPage) {
        if (newPage < 0 || newPage >= this.totalPages) return

        this.$emit('update:page', newPage)

        this.$nextTick(() => {
            const el = this.$refs.top
            if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY
            window.scrollTo({
                top: top - 45,
                behavior: 'smooth'
            })
            }
        })
    }

  }
}
</script>
