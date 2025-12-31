<template>
  <div>
    <q-dialog v-model="show" >
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
        </q-card-section>

        <!-- 🧭 Overview -->
        <q-card-section>
          
          <DataCacheManagerListenerList :requests="requests"  />
          
        <q-banner
          class="q-mt-md bg-grey-2 text-grey-9"
          rounded
          dense
        >
          <template #avatar>
            <q-icon name="info" color="primary" />
          </template>

          <div class="text-caption">
            After deleting cached entries, you may need to perform a <strong>hard refresh</strong>
            to ensure your browser loads the latest content.
            <br /><br />

            <strong>Hard refresh shortcuts:</strong><br />
            • <strong>Windows:</strong> Ctrl + Shift + R &nbsp;or&nbsp; Ctrl + F5<br />
            • <strong>Mac:</strong> Cmd + Shift + R
          </div>
        </q-banner>
        </q-card-section>




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
// import DataCacheManagerStrategicUseTool from './DataCacheManagerStrategicUseTool.vue'
import DataCacheManagerListenerList from './DataCacheManagerListenerList.vue'

export default {
  name: 'DataCacheManager',
  components: { 
    // DataCacheManagerStrategicUseTool, 
    DataCacheManagerListenerList 
  },

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
    // toggleInterception(active) {
    //   active ? this.startIntercept() : this.stopIntercept()
    // },

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

        return vm.origFetchRef.call(window, input, init)
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

    // stopIntercept() {
    //   if (this.origFetchRef) window.fetch = this.origFetchRef
    //   if (this.origXHROpenRef) XMLHttpRequest.prototype.open = this.origXHROpenRef
    //   this.origFetchRef = this.origXHROpenRef = null
    //   this.listening = false
    // },
  },

  mounted() {
    window.addEventListener('keydown', e => {
      if (e.shiftKey && e.key.toLowerCase() === 'c') this.show = !this.show
    })
    this.startIntercept()
  },

  // beforeUnmount() {
  //   this.stopIntercept()
  // },
}
</script>
