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
        .filter(r => !r.Hide);
    },

    escape(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    },

    fullURL(path) {
      return this.escape(window.location.origin + path);
    },

    iso(field) {
      if (!field) return new Date().toISOString().split("T")[0];
      return new Date(field).toISOString().split("T")[0];
    },

    buildXML() {
      let urls = [];

      this.artworks.forEach(a => {
        const url = a["SEO URL"]
          ? this.fullURL(a["SEO URL"])
          : this.fullURL(`/artwork/${a.id}`);

        urls.push(`
  <url>
    <loc>${url}</loc>
    <lastmod>${this.iso(a["Last Modified"])}</lastmod>
  </url>`);
      });

      this.xml = `<?xml version="1.0" encoding="UTF-8"?>  
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
    }
  }
};
</script>

<style>
pre {
  white-space: pre-wrap;
  font-size: 14px;
}
</style>
