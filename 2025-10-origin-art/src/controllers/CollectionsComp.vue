<template>
  <div class="container-mdx" style="">
    <catalogue-layout :mobileTitle="mobileFiltersLabel">
      <!-- 🔎 FILTERS -->
      <template #filters>
        <div>
          <!-- SEARCH -->
          <q-expansion-item
            label="Search Name"
            class="text-weight-bold"
            default-opened
          >
            <div class="q-pa-md">
              <q-input
                v-model="filterValsRef.search"
                outlined
                debounce="250"
                placeholder="Type collection name..."
                @update:model-value="resetAndFetch"
              />
            </div>
          </q-expansion-item>
        </div>
      </template>

      <!-- 🔥 CONTENT -->
      <template #content>
        <div v-if="loading" class="text-center q-pa-md">Loading...</div>

        <div
          v-else-if="!filteredItems.length"
          class="text-center q-pa-md text-2ry-color"
        >
          No collections found.
        </div>

        <div v-else>
          <div ref="resultsTop" class="text-center q-pa-sm text-1ry-color">
            {{ totalFiltered }} collections found
          </div>

          <ItemsPaginatedGrid
            :items="filteredItems"
            v-model:page="currentPage"
            :items-per-page="options.itemsPerPage"
          >
            <template #item="{ item }">
              <CollectionCard :item="item" />
            </template>
          </ItemsPaginatedGrid>
        </div>
      </template>
    </catalogue-layout>
  </div>
</template>

<script>
import Collections from "src/models/orm-api/Collections";
import { createMetaMixin } from "quasar";
import CatalogueLayout from "src/controllers/CatalogueLayout.vue";
import ItemsPaginatedGrid from "src/controllers/ItemsPaginatedGrid.vue";
import CollectionCard from "src/controllers/CollectionCard.vue";

export default {
  name: "CollectionsComp",
  components: {
    CatalogueLayout,
    CollectionCard,
    ItemsPaginatedGrid,
  },
  mixins: [
    createMetaMixin(function () {
      return this.seoConfig;
    }),
  ],

  props: {},
  data() {
    return {
      allRecords: [],
      filteredItems: [],
      // routeArtistLevel: "all-price-ranges",
      // artworkCount: "all",
      loading: false,
      totalFiltered: 0,
      currentPage: 0,
      options: { itemsPerPage: 16 },

      filterValsRef: {
        search: "",
        "Av. Price Tier": "",
      },
    };
  },

  computed: {
    mobileFiltersLabel() {
      const parts = [];

      if (this.filterValsRef.search?.trim()) parts.push("Search");
      // if (this.routeArtistType !== 'all-media') parts.push('Artist Type');
      // if (this.routeArtistLevel !== 'all-price-ranges') parts.push('Artist Level');

      if (parts.length === 0) return "";
      if (parts.length === 1) return `1 Selected Filter`;
      return `${parts.length} Selected Filters`;
    },

    totalPages() {
      return Math.ceil(this.totalFiltered / this.options.itemsPerPage);
    },
  },

  watch: {
    "$route.params": {
      handler() {
        this.resetAndFetch();
      },
      deep: true,
    },
  },

  methods: {
    truncate(text, limit = 1000) {
      if (!text) return "";
      return text.length > limit ? text.slice(0, limit) + "..." : text;
    },
    goToSingle(collection) {
      const slug = this.slugify(collection.Title || "collection");
      this.$router.push(`/collections/${collection.id}/${slug}`);
    },

    slugify(text) {
      return text
        ?.toString()
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w-]+/g, "") // Remove non-word characters
        .replace(/--+/g, "-") // Merge multiple -
        .replace(/^-+|-+$/g, ""); // Trim - from start/end
    },

    /* 🔍 Token-based search */
    matchesTokenSearch(name, query) {
      if (!query) return true;

      const nameTokens = (name || "").toLowerCase().split(/\s+/);
      const queryTokens = query.toLowerCase().split(/\s+/);

      return queryTokens.every((qt) =>
        nameTokens.some((nt) => nt.includes(qt)),
      );
    },

    getCount(optionValue, lookupKey) {
      if (!this.allRecords?.length) return 0;

      const search = this.filterValsRef?.search?.toLowerCase() || "";

      // Start with all records
      let subset = [...this.allRecords];

      // Apply search filter
      if (search) {
        subset = subset.filter((r) =>
          (r.Title || "").toLowerCase().includes(search),
        );
      }

      /* -------------------------------
      CALCULATE COUNT FOR THIS OPTION
      ------------------------------- */

      // All option returns the whole subset
      if (optionValue === "all-media" || optionValue === "all-price-ranges") {
        return subset.length;
      }

      return 0;
    },

    async fetchData() {
      this.loading = true;
      try {
        if (!this.allRecords.length) {
          const res = await Collections.FetchAll();
          this.allRecords = res.response.data.records.map((r) => ({
            id: r.id,
            ...r.fields,
          }));
        }

        let filtered = this.allRecords;

        const search = this.filterValsRef.search;

        // search
        if (search) {
          filtered = filtered.filter((r) =>
            this.matchesTokenSearch(r.Title, search),
          );
        }

        this.filteredItems = filtered;
        this.totalFiltered = filtered.length;
      } catch (err) {
        console.error("❌ Failed to load collections:", err);
      }

      this.loading = false;
      this.$emit("loaded");
    },

    scrollToResultsTop() {
      this.$nextTick(() => {
        const el = this.$refs.resultsTop;
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },

    async resetAndFetch() {
      this.currentPage = 0;
      await this.fetchData();
      this.scrollToResultsTop();
    },
  },

  async mounted() {
    await this.fetchData();
  },
};
</script>
