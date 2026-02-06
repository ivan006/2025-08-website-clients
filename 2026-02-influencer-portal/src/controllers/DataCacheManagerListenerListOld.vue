<template>
    <div>
        <!-- 🧩 Segment hiding -->
        <div v-if="requests.length" class="q-mt-md">
            <div class="row items-center q-gutter-sm">
                <q-input
                    dense
                    outlined
                    type="number"
                    v-model.number="hideSegmentsCount"
                    label="Hide first N segments"
                    min="0"
                    style="max-width: 180px"
                />
                <div class="row items-center q-gutter-xs">
                    <q-btn
                        v-for="preset in [0, 5, 14, 26, 30]"
                        :key="preset"
                        :size="$q.screen.lt.md ? 'sm' : 'sm'"
                        outline
                        color="primary"
                        :label="preset"
                        :flat="hideSegmentsCount === preset"
                        @click="hideSegmentsCount = preset"
                    />
                </div>
            </div>
        </div>

        <!-- 🧾 Endpoint list -->
        <div class="q-mt-md text-caption text-grey">
            <div v-if="!requests.length" class="q-mt-sm">
                No requests captured yet.
            </div>

            <div v-else>
                <ol>
                    <li v-for="(url, i) in requests" :key="i">
                        <code>
                            <span
                                v-for="(part, j) in visibleParts(url)"
                                :key="j"
                                :style="{
                                    color: rainbow[j % rainbow.length],
                                    fontWeight: 'bold',
                                }"
                            >
                                {{ part }}
                            </span>
                        </code>
                    </li>
                </ol>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "DataCacheManagerListenerList",
    components: {},
    props: {
        requests: { type: Array },
    },
    data() {
        return {
            hideSegmentsCount: 26,
            rainbow: [
                "#1565C0",
                "#0277BD",
                "#00897B",
                "#2E7D32",
                "#EF6C00",
                "#AD1457",
                "#6A1B9A",
                "#424242",
            ],
        };
    },

    methods: {
        coloredParts(arg) {
            let newString = decodeURIComponent(arg);
            const array = newString.split(/([?/&=]+)/);
            return array.filter((p) => p.length > 0);
        },

        visibleParts(arg) {
            const parts = this.coloredParts(arg);
            return parts.slice(this.hideSegmentsCount);
        },
    },

    mounted() {},
};
</script>
