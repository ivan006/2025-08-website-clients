<template>
    <q-card flat bordered class="text-1ry-color box-shadow-1ry rounded-borders">

        <!-- TEXT -->
        <q-card-section>
            <div class="text-h6 font-1ry" style="min-height: 64px;">
                {{ item.Title }}
            </div>

            <!-- <div class="text-subtitle2 text-2ry-color q-mt-xs">
                ID: {{ item.ID }}
            </div> -->

            <!-- <div class="text-body1 q-mt-xs text-weight-bold">
                Avg Price: R{{ item['Av. Price']?.toLocaleString() || '–' }}
            </div> -->
        </q-card-section>

        <!-- BUTTON -->
        <q-card-actions align="right">
            <q-btn flat :size="$q.screen.lt.md ? 'sm' : 'sm'" label="View Profile" class="bg-1ry-color" :to="profileUrl" />
        </q-card-actions>
    </q-card>
</template>


<script>
export default {
    name: 'CollectionCard',

    props: {
        item: { type: Object, required: true },
    },

    computed: {

        profileUrl() {
            return `/collections/${this.item.id}`
        }
    },

    methods: {

        slugify(str) {
            return String(str)
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '')
                .replace(/--+/g, '-')
                .replace(/^-+|-+$/g, '')
        }
    }
}
</script>
