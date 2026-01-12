<template>
    <q-card flat bordered class="text-1ry-color box-shadow-1ry rounded-borders">

        <!-- IMAGE -->
        <q-img :src="largeUrl" :placeholder-src="smallUrl" ratio="1" class="rounded-borders"
            :style="{ height: $q.screen.lt.md ? '150px' : '250px', objectFit: 'cover' }" fit="contain" />

        <!-- TEXT -->
        <q-card-section>
            <div class="text-h6 font-1ry" style="min-height: 64px;">
                {{ artist.Name }}
            </div>

            <div class="text-subtitle2 text-2ry-color q-mt-xs">
                {{ artist['Count (Art)'] }} artworks
            </div>

            <!-- <div class="text-body1 q-mt-xs text-weight-bold">
                Avg Price: R{{ artist['Av. Price']?.toLocaleString() || '–' }}
            </div> -->
        </q-card-section>

        <!-- BUTTON -->
        <q-card-actions align="right">
            <q-btn flat size="sm" label="View Profile" class="bg-1ry-color" :to="artistProfileUrl" />
        </q-card-actions>
    </q-card>
</template>


<script>
export default {
    name: 'ArtistCard',

    props: {
        artist: { type: Object, required: true },
    },

    computed: {
        largeUrl() {
            const img = this.getPrimaryImage()
            const url = img?.thumbnails?.large?.url
            return url ? `${import.meta.env.VITE_API_PROXY_URL}/cacher/data-cache/index.php?url=${encodeURIComponent(url)}` : ''
        },

        smallUrl() {
            const img = this.getPrimaryImage()
            const url = img?.thumbnails?.small?.url
            return url ? `${import.meta.env.VITE_API_PROXY_URL}/cacher/data-cache/index.php?url=${encodeURIComponent(url)}` : ''
        },

        artistProfileUrl() {
            return `/artists/${this.artist.id}/${this.slugify(this.artist.Name || 'artist')}`
        }
    },

    methods: {
        getPrimaryImage() {
            // choose first available image source
            return (
                this.artist.Attachments?.[0] ||
                this.artist.Attachments_FA?.[0] ||
                this.artist.Attachments_SW?.[0] ||
                this.artist.Attachments_NM?.[0] ||
                this.artist.Attachments_MA?.[0] ||
                null
            )
        },

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
