<template>
  <div>
    <h6 class="text-subtitle1 q-mb-sm">All Content Combination Impact</h6>

    <div v-if="filters.length">
      <div v-for="(filter, i) in filters" :key="i" class="q-mb-sm row items-center">
        <div class="col">
          <q-input
            dense
            type="number"
            v-model.number="optionCounts[i]"
            :label="filter + ' options'"
            min="2"
            style="max-width: 250px"
          />
        </div>
      </div>

      <q-btn color="secondary" label="Calculate All Combos" @click="calculateAllCombos" class="q-mr-sm" />
      <div>
        <q-toggle
          v-model="truncateLongCombos"
          label="Truncate combos with more than 2 parts"
          color="primary"
        />
      </div>
    </div>

    <div v-if="filters.length" class="q-mt-md">
      <p>
        Adding content across all categories generates
        <strong>{{ filteredCombos.length.toLocaleString() }}</strong> possible combinations.
      </p>

      <div v-if="filteredCombos.length && filteredCombos.length < 200">
        <p>Here are all possible endpoint combinations (grouped by complexity):</p>
        <ol style="margin-left:1em;">
          <li v-for="(combo, i) in filteredCombos" :key="i">
            {{ combo }}
          </li>
        </ol>
      </div>

      <p v-else-if="filteredCombos.length >= 200" class="text-negative">
        ⚠️ Too many combinations ({{ filteredCombos.length.toLocaleString() }}) to list individually.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataCacheManagerAllCombos',
  props: {
    filters: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      optionCounts: [],
      truncateLongCombos: false
    }
  },
  watch: {
    filters: {
      immediate: true,
      handler(newFilters) {
        this.optionCounts = newFilters.map((_, i) => this.optionCounts[i] || 2)
      }
    }
  },
  computed: {
    optionCombosDetailed() {
      const results = []
      const subsetCount = Math.pow(2, this.filters.length)
      results.push({ label: 'All (unfiltered)', depth: 0 })

      for (let mask = 1; mask < subsetCount; mask++) {
        const activeFilters = this.filters
          .map((f, i) => (mask & (1 << i) ? i : null))
          .filter(i => i !== null)

        const expand = (prefix, index) => {
          if (index === activeFilters.length) {
            results.push({ label: prefix.join(' + '), depth: prefix.length })
            return
          }
          const filterIndex = activeFilters[index]
          const name = this.filters[filterIndex]
          const count = this.optionCounts[filterIndex]

          for (let opt = 1; opt <= count; opt++) {
            expand([...prefix, `${name} ${opt}`], index + 1)
          }
        }

        expand([], 0)
      }

      results.sort((a, b) => a.depth - b.depth)
      return results
    },

    filteredCombos() {
      if (this.truncateLongCombos) {
        return this.optionCombosDetailed
          .filter(r => r.depth <= 2)
          .map(r => r.label)
      }
      return this.optionCombosDetailed.map(r => r.label)
    }
  },
  methods: {
    calculateAllCombos() {
      this.optionCounts = [...this.optionCounts] // trigger recompute
    }
  }
}
</script>
