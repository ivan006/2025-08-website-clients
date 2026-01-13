<template>
  
    <div>
        <!-- <q-btn
            round
            flat
            dense
            color="grey-7"
            icon="code"
            style="  
            position: fixed;
            bottom: 16px;
            right: 16px;
            z-index: 9999;
            background: rgba(0,0,0,0.05);
            "
            @click="alert = true"
        /> -->


        <!-- <q-dialog v-model="alert">
        <q-card>
        <q-card-section>
            <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            
            <pre>{{ seoConfig }}</pre>
            seoLdJson
            <pre>{{ seoLdJson }}</pre>
        </q-card-section>

        <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
        </q-card>
        </q-dialog> -->


        <q-dialog v-model="alert" >
            <q-card style="max-height: 90vh; overflow-y: auto;">
                <q-card-section>
                    <div class="text-h6">SEO Data Viewer</div>
                    <div class="text-caption text-grey">Meta tags & JSON-LD extracted from this page</div>
                </q-card-section>

                <!-- Meta Tags Section -->
                <q-card-section>
                    <div class="row items-center justify-between q-mb-sm">
                    <h6 class="text-subtitle2 q-mb-none">Meta Tags</h6>
                    <q-btn
                        dense
                        flat
                        :size="$q.screen.lt.md ? 'md' : 'sm'"
                        icon="content_copy"
                        @click="copyObject(seoConfig)"
                    >
                        <q-tooltip>Copy</q-tooltip>
                    </q-btn>
                    </div>
                    <!-- <pre><code>{{ metaTags }}</code></pre> -->
                    <pre><code>{{ seoConfig }}</code></pre>
                </q-card-section>

                <!-- Structured Data Section -->
                <q-card-section>
                    <div class="row items-center justify-between q-mb-sm">
                    <h6 class="text-subtitle2 q-mb-none">Structured Data (JSON-LD)</h6>
                    <q-btn
                        dense
                        flat
                        :size="$q.screen.lt.md ? 'md' : 'sm'"
                        icon="content_copy"
                        @click="copyObject(seoLdJson)"
                    >
                        <q-tooltip>Copy</q-tooltip>
                    </q-btn>
                    </div>
                    
                    <!-- <pre><code>{{ jsonLd }}</code></pre> -->
                    <pre><code>{{ seoLdJson }}</code></pre>
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
  name: 'SEODataViewer',
  components: {
  },

  props: {
    seoConfig: {
      type: Object,
      default: () => ({})
    },
    seoLdJson: {
      type: Object,
      default: () => ({})
    },
  },
  data(){
    return {
      alert: false
    }
  },
  computed: {
  },
  methods: {
    
    copyObject(obj) {
        // const text = JSON.stringify(obj);
        const text = JSON.stringify(obj, null, 2);
        
      navigator.clipboard.writeText(text).then(() => {
        // this.$q.notify({
        //   type: "positive",
        //   message: "Copied to clipboard",
        //   timeout: 1000
        // });
      });
    }
  },
  mounted(){
    
    window.addEventListener('keydown', e => {
        if (e.shiftKey && e.key === 'S') {
        this.alert = true
        }
    })
  },
  watch: {
  }
}
</script>
