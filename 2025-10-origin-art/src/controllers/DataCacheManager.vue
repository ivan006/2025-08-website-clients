<template>
  <div>
    <!-- 🧰 Hidden Data Cache Manager dialog -->
    <q-dialog v-model="show">
      <q-card style="max-height: 90vh; overflow-y: auto; width: 900px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h5 q-mb-xs">Data Cache Manager</div>
          <div class="text-caption text-grey">
            Monitor and rebuild cached JSON data endpoints
          </div>
        </q-card-section>

        <!-- 🧭 Invoked Data -->
        <q-card-section>
          <div class="text-h6 q-mb-sm">Listener</div>

          
          <!-- Listener toggle under heading -->
          <div class=" items-center q-gutter-sm q-mb-md">
              <q-toggle v-model="listening" label="Listen for requests" color="primary" dense
                  @update:model-value="toggleInterception" />
              <div class="text-grey-7 ">
                  To populate the listener list, turn on the listener and interact with the site’s 
                  filters. This will prompt the site to request various relevant data endpoints. 
                  Any endpoints you invoke while the listener is active will be added to the list when you return to this tool.
              </div>
          </div>
          
          <div class="text-h7 q-mb-sm">Listener List</div>
          <DataCacheManagerListenerList :requests="requests"/>
        </q-card-section>

        <!-- 🧠 Strategic Use -->
        <q-card-section>
          <div class="text-h6 q-mb-sm">Strategic Use</div>
          
            <div class="q-pa-mdx q-mt-md text-body2 text-grey-8">

              <!-- 📘 Lesson text -->
              <div class="q-mb-md">
              <p>
               The purpose of populating the listener list is to identify which endpoints should be re-cached. 
               <br>This ensures that newly added artworks become visible to site visitors.

               <br>Because each artwork can appear under multiple filter combinations, it’s important to approach 
               this step intentionally rather than randomly browsing.

               <br>By thoughtfully invoking and capturing the right endpoints, you’ll make sure that new artworks 
               display correctly across all relevant filter scenarios.

               <br>To plan your re-caching effectively, it helps to understand how many possible cache combinations your filters create.
              </p>



                <p>
                  To plan your re-caching effectively, it helps to understand how many possible cache combinations your filters create.
                  Each filter on your site (for example, <em>Media</em>, <em>Style</em>, or <em>Budget Tier</em>)
                  doubles the number of potential cache variations.
                  This relationship follows a simple formula:
                  <code>2<sup>x</sup></code>, where <strong>x</strong> is the number of filters.
                </p>

                <p>
                  Use the calculator below to experiment with your own filter setup and see how many combinations the site can
                  <em>invoke</em>.
                </p>

                <q-separator spaced />
                <DataCacheManagerStrategicUseTool />


              <q-separator spaced />

              <!-- 🔮 Coming soon -->
              <div class="text-grey-7">
                <p>
                  <strong>Coming soon:</strong> an advanced re-caching tool that automates this process,
                  intelligently rebuilding all relevant endpoints when new content is added.
                  It’s still in development and will require project-specific configuration.
                </p>
              </div>
            </div>
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
import DataCacheManagerStrategicUseTool from './DataCacheManagerStrategicUseTool.vue';
import DataCacheManagerListenerList from './DataCacheManagerListenerList.vue';

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
  }
}
</script>
