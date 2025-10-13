<template>
  <div>
    <!-- 🧰 Hidden Data Cache Manager dialog -->
    <q-dialog v-model="show" persistent maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card style="max-height: 90vh; overflow-y: auto;">
        <q-card-section>
          <div class="text-h6">Data Cache Manager</div>
          <div class="text-caption text-grey">
            Monitor and clear cached JSON data endpoints
          </div>
        </q-card-section>

        <!-- Controls -->
        <q-card-section>
          <div class="row items-center justify-between">
            <div class="text-subtitle2">Listener</div>
            <q-toggle
              v-model="listening"
              label="Listen"
              color="primary"
              dense
              @update:model-value="toggleInterception"
            />
          </div>

          <div class="q-mt-sm">
            <q-btn
              label="Clear Cache for Observed Requests"
              color="negative"
              outline
              icon="delete_forever"
              size="sm"
              @click="clearCache"
              :disable="!requests.length"
            />
          </div>

          <div class="q-mt-md text-caption text-grey">
            <span v-if="!requests.length">No requests captured yet.</span>
            <ul v-else>
              <li v-for="(url, i) in requests" :key="i">
                <code>{{ url }}</code>
              </li>
            </ul>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'DataCacheManager',

  data() {
    return {
      show: false,
      listening: false,
      requests: [],
      origFetchRef: null,
      origXHROpenRef: null
    }
  },

  methods: {
    toggleInterception(active) {
      if (active) this.startIntercept()
      else this.stopIntercept()
    },

    startIntercept() {
      this.requests = []
      const jsonRequests = new Set()
      const vm = this

      // --- Intercept fetch
      this.origFetchRef = window.fetch
      window.fetch = async (input, init = {}) => {
        const method = (init?.method || 'GET').toUpperCase()
        if (method === 'GET' && typeof input === 'string' && input.includes('?url=')) {
          jsonRequests.add(input)
          vm.requests = Array.from(jsonRequests)
        }
        return vm.origFetchRef(input, init)
      }

      // --- Intercept XHR
      this.origXHROpenRef = XMLHttpRequest.prototype.open
      XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        if (method.toUpperCase() === 'GET' && typeof url === 'string' && url.includes('?url=')) {
          jsonRequests.add(url)
          vm.requests = Array.from(jsonRequests)
        }
        return vm.origXHROpenRef.call(this, method, url, ...rest)
      }

      this.$q.notify({ type: 'positive', message: 'Listening for JSON requests...' })
    },

    stopIntercept() {
      if (this.origFetchRef) window.fetch = this.origFetchRef
      if (this.origXHROpenRef) XMLHttpRequest.prototype.open = this.origXHROpenRef
      this.origFetchRef = this.origXHROpenRef = null
      this.listening = false
      this.$q.notify({ type: 'info', message: 'Stopped listening' })
    },

    clearCache() {
      if (!this.requests.length) return
      this.requests.forEach((url) => {
        const delURL = url.replace('?url=', '?delete=')
        fetch(delURL, { method: 'GET' })
          .then(() => console.log('Cleared cache:', delURL))
          .catch((err) => console.error('Error clearing cache:', delURL, err))
      })
      this.$q.notify({ type: 'positive', message: 'Clear requests sent' })
    }
  },

  mounted() {
    // Global hotkey Shift + C
    window.addEventListener('keydown', (e) => {
      if (e.shiftKey && e.key.toLowerCase() === 'c') {
        this.show = !this.show
      }
    })
  },

  beforeUnmount() {
    this.stopIntercept()
  }
}
</script>
