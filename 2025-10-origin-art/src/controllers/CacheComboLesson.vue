<template>
  <div class="q-pa-mdx q-mt-md text-body2 text-grey-8">

    <!-- 📘 Lesson text -->
    <div class="q-mb-md">
      <p>
        <strong>Understanding cache combinations:</strong><br>
        The total number of cache combinations that must be cleared when adding or updating an artwork depends on how many filters your system uses.
      </p>

      <p>
        The formula is:
        <code>2<sup>x</sup></code>,
        where <strong>x</strong> is the number of filters.
      </p>

      <p>
        Each filter has two relevant states — its specific value (for example, <em>“Sculptural Works”</em>) and the
        <em>“All”</em> state.  
        Together, these represent every possible way that a piece of artwork can appear across your filtered views.
      </p>

      <p>
        <strong>Example:</strong><br>
        If you have three filters —
        <em>Media</em>, <em>Style</em>, and <em>Budget Tier</em> — then there are
        <strong>8 total combinations</strong>:
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
    </div>

    <q-separator spaced />

    <!-- 🧮 Interactive calculator -->
    <div>
      <p><strong>Try it yourself:</strong></p>
      
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
          You have <strong>{{ filters.length }}</strong> filters.<br>
          Total combinations (including “All”): <strong>{{ totalCombos }}</strong>
        </p>

        <ul style="margin-left:1em;">
          <li v-for="(combo, i) in combos" :key="i">
            {{ combo.join(' + ') || 'All (unfiltered)' }}
          </li>
        </ul>
      </div>
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
      // Parse filters from input string
      this.filters = this.inputString
        .split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0)

      // Generate combinations (including "All")
      this.combos = this.generateCombos(this.filters)
    },

    generateCombos(filters) {
      const results = [[]] // start with All/unfiltered
      const n = filters.length

      for (let mask = 1; mask < Math.pow(2, n); mask++) {
        const combo = []
        for (let i = 0; i < n; i++) {
          if (mask & (1 << i)) combo.push(filters[i])
        }
        results.push(combo)
      }

      return results
    }
  },

  mounted() {
    this.calculate() // auto-run for the default example
  }
}
</script>
