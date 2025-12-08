<template>
  <pre>{{ xml }}</pre>
</template>

<script>
import ArtworksBoundCache from "src/models/orm-api/ArtworksBoundCache";

export default {
  name: "SitemapArtworks",

  data() {
    return {
      artworks: [],
      xml: "Loading..."
    };
  },

  async mounted() {
    await this.loadArtworks();
    this.buildXML();
  },

  methods: {
    async loadArtworks() {
      const res = await ArtworksBoundCache.FetchAll([], {
        view: "viwn7wDGK6yk5ZHOl"
      });

      this.artworks = res.response.data.records
        .map(r => ({ id: r.id, ...r.fields }))
        .filter(r => !r.Hide); // respect your Hide flag
    },

    escape(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    },

    buildXML() {
      const base = window.location.origin;

      const urls = this.artworks
        .map(a => {
          const loc = this.escape(base + (a["SEO URL"] || `/artwork/${a.id}`));

          const lastmod = a["Last Modified"]
            ? new Date(a["Last Modified"]).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];

          return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
        })
        .join("");

      this.xml = `<?xml version="1.0" encoding="UTF-8"?>  
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
    }
  }
};
</script>

<style>
/* Ensures browser displays raw XML */
pre {
  white-space: pre-wrap;
  font-size: 14px;
}
</style>
