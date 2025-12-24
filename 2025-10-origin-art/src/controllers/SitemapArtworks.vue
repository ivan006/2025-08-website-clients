<template>
  <div>
    <q-dialog v-model="open">
      <q-card style="max-height: 90vh; overflow-y: auto;">
        <q-card-section>
          <div class="text-h6">Sitemap XML Viewer</div>
          <div class="text-caption text-grey">
            Generated sitemap output for artworks
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row items-center justify-between q-mb-sm">
            <h6 class="text-subtitle2 q-mb-none">Sitemap XML</h6>
            <q-btn
              dense
              flat
              size="sm"
              icon="content_copy"
              @click="copyText(xml)"
            >
              <q-tooltip>Copy</q-tooltip>
            </q-btn>
          </div>

          <pre><code>{{ xml }}</code></pre>
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
  name: "SitemapArtworks",

  props: {
    items: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      open: false
    }
  },

  computed: {
    xml() {
      const escape = (str) =>
        String(str)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")

      const urls = this.items.map(i => `
  <url>
    <loc>${escape(i.url)}</loc>
    <lastmod>${escape(i.lastmod)}</lastmod>
  </url>`)

      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`
    }
  },

  methods: {
    copyText(text) {
      navigator.clipboard.writeText(text)
    }
  },

  mounted() {
    window.addEventListener("keydown", e => {
      if (e.shiftKey && e.key === "G") {
        this.open = true
      }
    })
  }
}
</script>

