<template>
  <div class="row items-center no-wrap">

    <!-- ROOT LEVEL -->
    <div
      v-for="item in menuData"
      :key="item.id"
      class="q-mx-sm"
    >

      <!-- A) ROOT WITHOUT CHILDREN -->
      <q-btn :size="$q.screen.lt.md ? 'lg' : 'md'"
        v-if="!item.children || !item.children.length"
        flat
        no-caps
        dense
        :to="item.url"
        :style="rootStyle(false)"
        :label="item.label"
      />

      <!-- B) ROOT WITH CHILDREN -->
      <q-btn-dropdown
        v-else
         :size="$q.screen.lt.md ? 'lg' : 'md'"
        flat
        no-caps
        dense
        :style="rootStyle(true)"
        :label="item.label"
        icon-right="keyboard_arrow_down"
        content-style="min-width: 220px"
      >

        <!-- FIRST LEVEL -->
        <q-list bordered separator>

          <MenuItem
            v-for="child in item.children"
            :key="child.id"
            :node="child"
          />

        </q-list>

      </q-btn-dropdown>

    </div>
  </div>
</template>

<script>
import menuData from "./menu.json"
import MenuItem from "./MenuItem.vue"

export default {
  name: "MultiLevelNav",

  components: { MenuItem },

  data() {
    return {
      menuData,
    }
  },

  methods: {
    rootStyle(hasChildren) {
      return {
        textTransform: "uppercase",
        fontSize: "15px",
        fontWeight: "600",
        color: "#1a1a1a",
        padding: "6px 10px",
        backgroundColor: "transparent"
      }
    }
  }
}
</script>
