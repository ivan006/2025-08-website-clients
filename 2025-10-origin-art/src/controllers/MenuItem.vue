<template>
  <div>

    <!-- ITEM WITH NO CHILDREN -->
    <q-item
      v-if="!hasChildren"
      clickable
      :to="node.url"
      :style="itemStyle"
    >
      <q-item-section>{{ node.label }}</q-item-section>
    </q-item>

    <!-- ITEM WITH CHILDREN -->
    <q-expansion-item
      v-else
      dense
      expand-separator
      icon="chevron_right"
      header-class="text-dark"
      :label="node.label"
      :style="itemStyle"
    >
      <q-list>

        <MenuItem
          v-for="child in node.children"
          :key="child.id"
          :node="child"
        />

      </q-list>
    </q-expansion-item>

  </div>
</template>

<script>
export default {
  name: "MenuItem",

  props: {
    node: Object
  },

  computed: {
    hasChildren() {
      return this.node.children && this.node.children.length
    },

    itemStyle() {
      return {
        fontSize: "14px",
        padding: "4px 10px",
        color: "#444",
      }
    }
  }
}
</script>
