<template>
  
  <!-- 🧮 Calculator -->
  <div>
    <q-input
      filled
      dense
      v-model="inputString"
      label="Enter filter names separated by commas"
      style="max-width: 400px"
      class="q-mb-md"
    />
    <q-btn color="primary" label="Calculate" @click="calculate" />

    <div v-if="filters.length" class="q-mt-md">
      <p>
        <strong>{{ filters.length }}</strong> filters → 
        <strong>{{ totalCombos }}</strong> combinations
      </p>
      <ul style="margin-left:1em;">
        <li v-for="(combo, i) in combos" :key="i">
          {{ combo.join(' + ') || 'All (unfiltered)' }}
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
export default {
  name: 'CacheComboLesson',
  data() {
    return {
      inputString: 'Media, Style, Budget Tier',
      filters: [],
      combos: []
    }
  },
  computed: {
    totalCombos() {
      return Math.pow(2, this.filters.length)
    }
  },
  methods: {
    calculate() {
      this.filters = this.inputString
        .split(',')
        .map(f => f.trim())
        .filter(Boolean)
      this.combos = this.generateCombos(this.filters)
    },
    generateCombos(filters) {
      const results = [[]]
      for (let mask = 1; mask < Math.pow(2, filters.length); mask++) {
        const combo = filters.filter((_, i) => mask & (1 << i))
        results.push(combo)
      }
      return results
    }
  },
  mounted() {
    this.calculate()
  }
}
</script>
