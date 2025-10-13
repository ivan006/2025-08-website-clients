<template>
  <div>
    <q-dialog v-model="show" persistent>
      <q-card
        flat
        bordered
        class="q-pa-lg"
        style="max-height: 90vh; overflow-y: auto; width: 950px; max-width: 90vw;"
      >
        <!-- 🌐 Header -->
        <q-card-section class="q-pb-none">
          <div class="text-h5 text-primary text-weight-bold flex items-center">
            <q-icon name="cloud_sync" size="md" class="q-mr-sm" />
            Data Cache Manager
          </div>
          <div class="text-subtitle2 text-grey-7 q-mt-sm">
            A tool for keeping your site’s cached data accurate and up to date.
          </div>
        </q-card-section>

        <!-- 🧭 Overview -->
        <q-card-section>
          <div class="text-body2 text-grey-7">
            This tool provides two re-caching modes:
          </div>
          <ul class="q-my-sm">
            <li>
              <b>Exploration-based Re-caching</b> – a robust fallback that
              re-caches everything you visit while active.
            </li>
            <li>
              <b>Predictive Re-caching</b> – a smarter, context-aware system
              (coming soon).
            </li>
          </ul>
        </q-card-section>

        <!-- 🌍 Exploration Mode -->
        <q-expansion-item
          icon="travel_explore"
          label="Exploration-based Re-caching"
          default-opened
          header-class="bg-grey-2 text-primary text-weight-medium rounded-borders"
          expand-icon-class="text-primary"
        >
          <q-card-section>
            

            <!-- 🧩 Active Endpoints -->
            <div class="text-subtitle2 q-mb-xs">Active Endpoints Tracker</div>
            <q-card flat bordered class="q-pa-md q-mb-md bg-grey-1">
            <q-toggle v-model="listening" label="Listen for requests" color="primary" dense
              @update:model-value="toggleInterception" />
              <DataCacheManagerListenerList :requests="requests" @toggle="toggleInterception" />
            </q-card>

            <q-separator spaced />
            <div class="text-body1 text-weight-medium q-mb-sm">How it works</div>
            <p class="text-body2 text-grey-7">
              The active endpoints list defines which endpoints should be re-cached,
              ensuring new artworks appear correctly for site visitors.
              <br /><br />
              Since artworks can appear under multiple filter combinations, be
              intentional when invoking data to capture all relevant endpoints.
              <br /><br />
              Each filter (for example,
              <code>Media</code>, <code>Style</code>, or <code>Budget Tier</code>)
              doubles the number of cache variations — following the formula
              <b>2<sup>x</sup></b> where <code>x</code> is the number of filters.
              <br /><br />
              Use the calculator below to see how your filter setup affects the
              number of combinations the site may invoke.
            </p>

            <!-- 🔢 Filter Math Tool -->
            <div class="text-subtitle2 q-mb-xs">Filter Combination Calculator</div>
            <q-card flat bordered class="q-pa-md bg-grey-1">
              <DataCacheManagerStrategicUseTool />
            </q-card>
          </q-card-section>
        </q-expansion-item>

        <!-- 🤖 Predictive Mode -->
        <q-expansion-item
          icon="lightbulb"
          label="Predictive Re-caching (Coming Soon)"
          header-class="bg-grey-2 text-primary text-weight-medium rounded-borders"
          expand-icon-class="text-primary"
        >
          <q-card-section>
            <p class="text-body2 text-grey-7">
              This upcoming feature will allow you to define how your endpoints are structured and 
              how content relates to different taxonomies.
              <br /><br />
              When you add new content that falls within multiple taxonomies, the system will use 
              that structure to calculate every valid combination of filters. 
              <br /><br />
              It will then generate the full set of corresponding endpoints, so they can later be 
              targeted for cache clearing or pre-caching—ensuring your visitors always see up-to-date results.
            </p>

            <div
              class="bg-grey-3 text-grey-7 q-pa-lg q-mt-md rounded-borders text-center"
              style="border: 1px dashed rgba(0,0,0,0.2);"
            >
              <q-icon name="hourglass_empty" size="sm" class="q-mb-sm" />
              <div>Coming soon…</div>
            </div>
          </q-card-section>
        </q-expansion-item>


        <!-- ⚙️ Footer -->
        <q-separator spaced />
        <q-card-actions align="right">
          <q-btn
            flat
            label="Close"
            color="primary"
            icon="close"
            class="q-px-md"
            @click="show = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>


<script>
import DataCacheManagerStrategicUseTool from './DataCacheManagerStrategicUseTool.vue'
import DataCacheManagerListenerList from './DataCacheManagerListenerList.vue'

export default {
  name: 'DataCacheManager',
  components: { DataCacheManagerStrategicUseTool, DataCacheManagerListenerList },

  data() {
    return {
      listening: false,
      requests: [],
      origFetchRef: null,
      origXHROpenRef: null,
      show: false,
    }
  },

  methods: {
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
    window.addEventListener('keydown', e => {
      if (e.shiftKey && e.key.toLowerCase() === 'c') this.show = !this.show
    })
  },

  beforeUnmount() {
    this.stopIntercept()
  },
}
</script>
