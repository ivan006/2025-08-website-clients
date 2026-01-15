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
        :size="$q.screen.lt.md ? 'sm' : 'sm'"
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
    <q-td style="white-space: normal; word-break: break-all;">
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
            :size="$q.screen.lt.md ? 'sm' : 'sm'"
            color="negative"
            outline
            icon="delete"
            :label="buttonLabel(props.row.url)"
            :loading="deleting.has(props.row.url)"
            :disable="deleted.has(props.row.url)"
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
        deleting: new Set(),
        deleted: new Set(),
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


    buttonLabel (url) {
        if (this.deleted.has(url)) return 'Deleted'
        if (this.deleting.has(url)) return 'Deleting…'
        return 'Delete'
    },

    async deleteCache (url) {
        if (this.deleting.has(url) || this.deleted.has(url)) return

        this.deleting.add(url)

        try {
        await fetch(url.replace('?url=', '?delete='))
        this.deleted.add(url)
        } catch (e) {
        console.error('Delete failed', e)
        } finally {
        this.deleting.delete(url)
        }
    }
  }
}
</script>
