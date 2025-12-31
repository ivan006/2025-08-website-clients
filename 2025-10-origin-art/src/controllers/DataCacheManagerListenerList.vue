<template>
  <div class="q-mt-md">

    <!-- 🧩 Segment hiding -->
    <div v-if="requests.length" class="row items-center q-gutter-sm q-mb-md">
      <q-input
        dense
        outlined
        type="number"
        v-model.number="hideSegmentsCount"
        label="Hide first N segments"
        min="0"
        style="max-width: 180px"
      />
      <q-btn
        v-for="preset in [0, 5, 14, 26, 30]"
        :key="preset"
        size="sm"
        outline
        color="primary"
        :label="preset"
        :flat="hideSegmentsCount === preset"
        @click="hideSegmentsCount = preset"
      />
    </div>

    <!-- 🧾 Requests table -->
    <q-table
      v-if="requests.length"
      flat
      bordered
      dense
      :rows="rows"
      :columns="columns"
      row-key="id"
    >
      <template #body-cell-url="props">
        <q-td>
          <code class="text-caption">
            <span
              v-for="(part, i) in visibleParts(props.row.url)"
              :key="i"
              :style="{ color: rainbow[i % rainbow.length], fontWeight: 'bold' }"
            >
              {{ part }}
            </span>
          </code>
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td align="right">
          <q-btn
            size="sm"
            color="negative"
            outline
            icon="delete"
            label="Delete"
            @click="deleteCache(props.row.url)"
          />
        </q-td>
      </template>
    </q-table>

    <div v-else class="text-caption text-grey q-mt-sm">
      No requests captured yet.
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataCacheManagerListenerList',

  props: {
    requests: { type: Array, required: true }
  },

  data () {
    return {
      hideSegmentsCount: 14,
      rainbow: [
        '#1565C0', '#0277BD', '#00897B', '#2E7D32',
        '#EF6C00', '#AD1457', '#6A1B9A', '#424242'
      ],
      columns: [
        {
          name: 'url',
          label: 'Request',
          field: 'url',
          align: 'left'
        },
        {
          name: 'actions',
          label: 'Actions',
          align: 'right'
        }
      ]
    }
  },

  computed: {
    rows () {
      return this.requests.map((url, i) => ({
        id: i,
        url
      }))
    }
  },

  methods: {
    coloredParts (arg) {
      const decoded = decodeURIComponent(arg)
      return decoded.split(/([?/&=]+)/).filter(p => p.length)
    },

    visibleParts (arg) {
      return this.coloredParts(arg).slice(this.hideSegmentsCount)
    },

    async deleteCache (url) {
      const deleteUrl = url.replace('?url=', '?delete=')

      try {
        await fetch(deleteUrl, { method: 'GET' })
      } catch (e) {
        console.error('Delete failed:', e)
      }
    }
  }
}
</script>
