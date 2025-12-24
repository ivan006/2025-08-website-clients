<template>
  <pre>{{ xml }}</pre>
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
  }
}
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  font-size: 14px;
}
</style>
