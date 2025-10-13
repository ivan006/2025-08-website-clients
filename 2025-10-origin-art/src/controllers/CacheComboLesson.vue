<template>
  <div class="q-pa-mdx q-mt-md text-body2 text-grey-8">

    <!-- 📘 Lesson text -->
    <div class="q-mb-md">
    <p>
    <strong>A note on strategic tool use:</strong><br>
    After using the <em>Listener</em> to invoke data across the site,
    this section shows how to plan cache rebuilds more strategically —
    ensuring that new artworks appear across all relevant filter combinations.
    </p>



      <p>
        Each filter on your site (for example, <em>Media</em>, <em>Style</em>, or <em>Budget Tier</em>)
        doubles the number of possible cache combinations.
        The relationship follows a simple formula:
        <code>2<sup>x</sup></code>, where <strong>x</strong> is the number of filters.
      </p>

      <p>
        <strong>Example (3 filters):</strong> Media, Style, Budget Tier → <strong>8 combinations</strong>:
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

      <p>
        Use the calculator below to explore how your own filter setup affects the total number
        of cache combinations the site can <em>invoke</em>.
      </p>
    </div>

    <q-separator spaced />

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

    <q-separator spaced />

    <!-- 🔮 Coming soon -->
    <div class="text-grey-7">
      <p>
        <strong>Coming soon:</strong> an advanced re-caching tool that automates this process,
        intelligently rebuilding all relevant endpoints when new content is added.
        It’s still in development and will require project-specific configuration.
      </p>
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
