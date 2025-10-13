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
          <div class="text-h6 q-mb-sm">Invoked Data</div>

          <DataCacheManagerListener />
        </q-card-section>

        <!-- 🧠 Strategic Use -->
        <q-card-section>
          <div class="text-h6 q-mb-sm">Strategic Use of the Tool</div>
          
            <div class="q-pa-mdx q-mt-md text-body2 text-grey-8">

              <!-- 📘 Lesson text -->
              <div class="q-mb-md">
              <p>
              <strong>A note on strategic tool use:</strong><br>
              After using the <em>Listener</em> to invoke data across the site,
              this section shows how to plan cache rebuilds more strategically —
              ensuring that new artworks appear across all relevant filter combinations.
              </p>



                <p>
                  Each filter on your site (for example, <em>Media</em>, <em>Style</em>, or <em>Budget Tier</em>)
                  doubles the number of possible cache combinations.
                  The relationship follows a simple formula:
                  <code>2<sup>x</sup></code>, where <strong>x</strong> is the number of filters.
                </p>

                <p>
                  <strong>Example (3 filters):</strong> Media, Style, Budget Tier → <strong>8 combinations</strong>:
                </p>

                <ul style="margin-left:1em;">
                  <li>All (unfiltered)</li>
                  <li>Media</li>
                  <li>Style</li>
                  <li>Budget Tier</li>
                  <li>Media + Style</li>
                  <li>Media + Budget Tier</li>
                  <li>Style + Budget Tier</li>
                  <li>Media + Style + Budget Tier</li>
                </ul>

                <p>
                  Use the calculator below to explore how your own filter setup affects the total number
                  of cache combinations the site can <em>invoke</em>.
                </p>
              </div>

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
import DataCacheManagerListener from './DataCacheManagerListener.vue';

export default {
  name: 'DataCacheManager',
  components: { DataCacheManagerStrategicUseTool, DataCacheManagerListener },

  data() {
    return {
      show: false,
    }
  },

  methods: {
  },

  mounted() {
    window.addEventListener('keydown', e => {
      if (e.shiftKey && e.key.toLowerCase() === 'c') this.show = !this.show
    })
  },

  beforeUnmount() {
  }
}
</script>
