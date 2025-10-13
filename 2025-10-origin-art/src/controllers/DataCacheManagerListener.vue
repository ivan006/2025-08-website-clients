<template>
    <div>

        <!-- Listener toggle under heading -->
        <div class="row items-center q-gutter-sm q-mb-md">
            <q-toggle v-model="listening" label="Listen for requests" color="primary" dense
                @update:model-value="toggleInterception" />
            <div class="text-grey-7 text-caption">
                Toggle <strong>Listen</strong>, then browse the site to
                <strong>invoke</strong> data endpoints. Return here to view the results.
            </div>
        </div>

        <!-- 🧩 Segment hiding -->
        <div v-if="requests.length" class="q-mt-md">
            <div class="row items-center q-gutter-sm">
                <q-input dense outlined type="number" v-model.number="hideSegmentsCount" label="Hide first N segments"
                    min="0" style="max-width: 180px" />
                <div class="row items-center q-gutter-xs">
                    <q-btn v-for="preset in [0, 5, 14, 26, 30]" :key="preset" size="sm" outline color="primary"
                        :label="preset" :flat="hideSegmentsCount === preset" @click="hideSegmentsCount = preset" />
                </div>
            </div>
        </div>

        <!-- 🧾 Endpoint list -->
        <div class="q-mt-md text-caption text-grey">
            <div v-if="!requests.length" class="q-mt-sm">
                No requests captured yet. Turn on the listener and browse the site to invoke data.
            </div>

            <div v-else>
                <ol>
                    <li v-for="(url, i) in requests" :key="i">
                        <code>
                    <span
                        v-for="(part, j) in visibleParts(url)"
                        :key="j"
                        :style="{ color: rainbow[j % rainbow.length], fontWeight: 'bold' }"
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
    name: 'DataCacheManagerListener',
    components: {},

    data() {
        return {
            listening: false,
            requests: [],
            origFetchRef: null,
            origXHROpenRef: null,
            hideSegmentsCount: 26,
            rainbow: [
                '#1565C0', '#0277BD', '#00897B', '#2E7D32',
                '#EF6C00', '#AD1457', '#6A1B9A', '#424242'
            ],
        }
    },

    methods: {
        coloredParts(arg) {
            let newString = decodeURIComponent(arg)
            const array = newString.split(/([?/&=]+)/)
            return array.filter(p => p.length > 0)
        },

        visibleParts(arg) {
            const parts = this.coloredParts(arg)
            return parts.slice(this.hideSegmentsCount)
        },

        toggleInterception(active) {
            active ? this.startIntercept() : this.stopIntercept()
        },

        startIntercept() {
            this.requests = []
            const jsonRequests = new Set()
            const vm = this

            this.origFetchRef = window.fetch
            window.fetch = async (input, init = {}) => {
                const method = (init?.method || 'GET').toUpperCase()
                if (method === 'GET' && typeof input === 'string' && input.includes('?url=')) {
                    jsonRequests.add(input)
                    vm.requests = Array.from(jsonRequests)
                }
                return vm.origFetchRef(input, init)
            }

            this.origXHROpenRef = XMLHttpRequest.prototype.open
            XMLHttpRequest.prototype.open = function (method, url, ...rest) {
                if (method.toUpperCase() === 'GET' && typeof url === 'string' && url.includes('?url=')) {
                    jsonRequests.add(url)
                    vm.requests = Array.from(jsonRequests)
                }
                return vm.origXHROpenRef.call(this, method, url, ...rest)
            }
        },

        stopIntercept() {
            if (this.origFetchRef) window.fetch = this.origFetchRef
            if (this.origXHROpenRef) XMLHttpRequest.prototype.open = this.origXHROpenRef
            this.origFetchRef = this.origXHROpenRef = null
            this.listening = false
        },
    },

    mounted() {

    },

    beforeUnmount() {
        this.stopIntercept()
    }
}
</script>
