<template>
  <div>
    <!-- 🧰 Hidden Data Cache Manager dialog -->
    <q-dialog v-model="show" >
      <q-card style="max-height: 90vh; overflow-y: auto;  width: 900px; max-width: 80vw;">
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

          <!-- <div class="q-mt-sm">
            <q-btn
              label="Clear Cache for Observed Requests"
              color="negative"
              outline
              icon="delete_forever"
              size="sm"
              @click="clearCache"
              :disable="!requests.length"
            />
          </div> -->

          <div class="q-mt-md text-caption text-grey">
            <span v-if="!requests.length">No requests captured yet.</span>
            <ol v-else>
              <li v-for="(url, i) in requests" :key="i">
                <!-- <code>{{ splitUrl(url) }}</code> -->
                <code>
                   <span
                    v-for="(part, i) in coloredParts(url)"
                    :key="i"
                    :style="{ color: rainbow[i % rainbow.length], fontWeight: 'bold' }"
                  >
                    {{ part }}
                  </span>
                </code>
              </li>
            </ol>
          </div>
          <CacheComboLesson />
          
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import CacheComboLesson from 'src/controllers/CacheComboLesson.vue'
export default {
  name: 'DataCacheManager',

  components: {
    CacheComboLesson
  },
  data() {
    return {
      show: false,
      listening: false,
      requests: [],
      origFetchRef: null,
      origXHROpenRef: null,
      
      rainbow: [
        
        // '#b71c1c', // deep red
        // '#e65100', // burnt orange
        // '#f9a825', // golden yellow
        // '#2e7d32', // dark green
        // '#1565c0', // deep blue
        // '#4527a0', // dark indigo
        // '#6a1b9a'  // rich violet


        
        // '#1E88E5', // blue
        // '#00ACC1', // cyan
        // '#43A047', // green
        // '#F9A825', // amber
        // '#EF6C00', // orange
        // '#E91E63', // pink
        // '#8E24AA', // purple
        // '#616161'  // grey

        
        '#1565C0', // deep blue
        '#0277BD', // teal-blue
        '#00897B', // dark turquoise
        '#2E7D32', // forest green
        '#EF6C00', // burnt orange
        '#AD1457', // dark pink
        '#6A1B9A', // deep purple
        '#424242'  // charcoal grey

      ],
    }
  },

  methods: {
    coloredParts(arg) {
      let newString = decodeURIComponent(arg)

      newString = newString.replace(`https://capetownlists.co.za/?url=https://api.airtable.com/v0/appVY1Zwf71mOzczr/`, '');
      // Split but keep the delimiters ( ?, /, & ) in the results using a capturing group
      const array = newString.split(/([?/&=]+)/)

      // Filter out empty strings and return full list including delimiters
      return array.filter(p => p.length > 0)
    },
    splitUrl(arg) {
      let newString = decodeURIComponent(arg)

      newString = newString.replace(/[?]/g, ' ? ');
      newString = newString.replace(/[/]/g, ' / ');
      newString = newString.replace(/[&]/g, ' & ');

      // let newString = arg
      // newString = newString.replace("/", " / ");
      // newString = newString.replace("&", " & ");
      // newString = newString.replace("?", " ? ");
        
      return newString
    },
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
    },

    stopIntercept() {
      if (this.origFetchRef) window.fetch = this.origFetchRef
      if (this.origXHROpenRef) XMLHttpRequest.prototype.open = this.origXHROpenRef
      this.origFetchRef = this.origXHROpenRef = null
      this.listening = false
    },

    // clearCache() {
    //   if (!this.requests.length) return
    //   this.requests.forEach((url) => {
    //     const delURL = url.replace('?url=', '?delete=')
    //     fetch(delURL, { method: 'GET' })
    //       .then(() => console.log('Cleared cache:', delURL))
    //       .catch((err) => console.error('Error clearing cache:', delURL, err))
    //   })
    // }
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
