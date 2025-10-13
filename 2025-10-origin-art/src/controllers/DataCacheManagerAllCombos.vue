<template>
  <div>
    <!-- 🧾 All-Content Combination Calculator -->
    <div class="text-subtitle1 q-mb-sm">All Combonations</div>

    <div v-if="filters.length">
      <div v-for="(filter, i) in filters" :key="i" class="q-mb-sm row items-center">
        <div class="col">
          <q-input
            dense
            type="number"
            v-model.number="optionCounts[i]"
            :label="filter + ' options'"
            min="1"
            style="max-width: 250px"
          />
        </div>
      </div>
      <q-btn color="secondary" label="Calculate All Combos" @click="calculateAllCombos" />
    </div>

    <div v-if="filters.length" class="q-mt-md">
      <p>
        Adding content across all categories generates
        <strong>{{ optionCombos.length.toLocaleString() }}</strong> possible combinations.
      </p>

      <div v-if="optionCombos.length && optionCombos.length < 200">
        <p>Here are all possible endpoint combinations (grouped by complexity):</p>
        <ul style="margin-left:1em;">
          <li v-for="(combo, i) in optionCombos" :key="i">
            {{ combo }}
          </li>
        </ul>
      </div>

      <p v-else-if="optionCombos.length >= 200" class="text-negative">
        ⚠️ Too many combinations ({{ optionCombos.length.toLocaleString() }}) to list individually.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataCacheManagerAllCombos',
  data() {
    return {
      filters: ['Media', 'Style', 'Budget Tier'],
      optionCounts: [2, 2, 2]
    }
  },
  computed: {
    optionCombos() {
      const results = []
      const subsetCount = Math.pow(2, this.filters.length)

      // Always include unfiltered first
      results.push({ label: 'All (unfiltered)', depth: 0 })

      // Generate all subset combinations
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

      // Sort by combination depth (1, 2, 3…)
      results.sort((a, b) => a.depth - b.depth)

      // Map back to labels
      return results.map(r => r.label)
    }
  },
  methods: {
    calculateAllCombos() {
      this.optionCounts = [...this.optionCounts]
    }
  }
}
</script>
