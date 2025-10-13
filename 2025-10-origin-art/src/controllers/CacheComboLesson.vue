<template>
  <div class="q-pa-mdx q-mt-md text-body2 text-grey-8">

    <!-- 📘 Lesson text -->
    <div class="q-mb-md">
      <p>
        <strong>About this tool:</strong><br>
        The Data Cache Manager is a <strong>cache rebuilding</strong> tool that works by observing endpoint activity.
        Toggle <em>Listen</em>, browse the site as normal, and it will <strong>invoke</strong> and log every API request the site makes.
        Afterwards, reopen the tool to view those endpoints and click <em>Clear</em> to rebuild their caches.
      </p>

      <p>
        That’s the <strong>core use</strong>: toggle, browse, rebuild.
        To use it more intelligently—such as after adding artwork—understand how many caches may need rebuilding.
        Each filter doubles the combinations of possible cached views:
        <code>2<sup>x</sup></code> where <strong>x</strong> is the number of filters.
      </p>

      <p>
        <strong>Example (3 filters):</strong> Media, Style, Budget Tier → 8 total combinations:
      </p>

      <ul style="margin-left:1em;">
        <li>All</li><li>Media</li><li>Style</li><li>Budget Tier</li>
        <li>Media + Style</li><li>Media + Budget</li><li>Style + Budget</li><li>All 3</li>
      </ul>

      <p>
        Try it yourself below to see how many cache states your setup might invoke.
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

    <div class="text-grey-7">
      <p>
        <strong>Coming soon:</strong> an advanced tool to automatically re-cache intelligently.
        It’s in development and will also require developer configuration for each context.
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
