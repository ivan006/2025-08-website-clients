<template>
    <div ref="top">
        <div class="row items-center no-wrap">

            <!-- ◀️ LEFT ARROW -->
            <div v-if="!$q.screen.lt.md && showArrows" class="col-auto q-pr-sm">
                <q-btn flat round color="primary" icon="chevron_left" size="llg" @click="updatePage(page - 1)"
                    :disable="page <= 0" />
            </div>

            <!-- GRID -->
            <div class="col">
                <div class="row q-col-gutter-lgx justify-center">
                    <div v-for="item in pagedItems" :key="item.id" class="col-6 col-md-3 q-pa-sm">
                        <!-- SLOT FOR CUSTOM CARD -->
                        <slot name="item" :item="item" />
                    </div>
                </div>
            </div>

            <!-- ▶️ RIGHT ARROW -->
            <div v-if="!$q.screen.lt.md && showArrows" class="col-auto q-pl-sm">
                <q-btn flat round color="primary" icon="chevron_right" size="llg" @click="updatePage(page + 1)"
                    :disable="page >= totalPages - 1" />
            </div>

        </div>

        <!-- BOTTOM PAGINATION -->
        <div class="text-center q-mt-lg flex flex-center q-gutter-sm">

            <q-btn flat color="primary" icon="chevron_left" label="Previous" :disable="page <= 0"
                @click="updatePage(page - 1)" />

            <div>
                <template v-for="(n, i) in pageNumbers" :key="n">
                    <span v-if="i > 0 && n - pageNumbers[i - 1] > 1" class="q-mx-xs text-grey-6">
                        …
                    </span>

                    <q-btn size="ssm" flat round :label="n + 1" :color="n === page ? 'primary' : 'grey-6'"
                        @click="updatePage(n)" />
                </template>


            </div>

            <q-btn flat color="primary" icon-right="chevron_right" label="Next" :disable="page >= totalPages - 1"
                @click="updatePage(page + 1)" />

        </div>
    </div>
</template>

<script>
export default {
    name: 'ItemsPaginatedGrid',

    props: {
        items: { type: Array, required: true },
        page: { type: Number, required: true },
        showArrows: { type: Boolean, default: true },
        itemsPerPage: { type: Number, default: 40 }
    },

    computed: {
        pageNumbers() {
            const range = 1
            const pages = new Set()

            pages.add(0)                          // first
            pages.add(this.totalPages - 1)        // last

            for (
                let i = this.page - range;
                i <= this.page + range;
                i++
            ) {
                if (i >= 0 && i < this.totalPages) {
                    pages.add(i)
                }
            }

            return [...pages].sort((a, b) => a - b)
        },
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
