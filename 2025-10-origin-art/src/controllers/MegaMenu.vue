<template>
  <div class="row items-center no-wrap">

    <!-- Top-level items -->
    <div
        v-for="item in menuData"
        :key="item.id"
        class="q-mx-md relative-position"
        @mouseenter="handleRootHover(item)"
    >

      <!-- No-children → pure link -->
      <router-link
        v-if="!item.children || !item.children.length"
        :to="item.url"
        class="text-primary text-weight-medium"
      >
        {{ item.label }}
      </router-link>

      <!-- Has children → hoverable label -->
      <span
        v-else
        class="text-primary text-weight-medium cursor-pointer"
      >
        {{ item.label }}
      </span>

      <!-- Mega menu (ONLY IF has children) -->
      <q-menu
        v-if="item.children && item.children.length"
        v-model="openMenus[item.id]"
        persistent
        anchor="bottom left"
        self="top left"
        transition-show="fade"
        transition-hide="fade"
        :content-style="{ minWidth: '900px', maxWidth: '1000px' }"
      >

        <q-card
          flat
          class="q-pa-lg"
          :style="{ width: '100%' }"
          @mouseleave="hide(item.id)"
        >

          <div class="row q-col-gutter-xl">

            <!-- Level 2 columns -->
            <div
              v-for="mid in item.children"
              :key="mid.id"
              class="col-3"
            >
              <div class="text-bold q-mb-xs">
                {{ mid.label }}
                <router-link :to="mid.url" class="q-ml-sm text-primary">(All)</router-link>
              </div>

              <!-- Level 3 -->
              <q-list dense padding>
                <q-item
                  v-for="leaf in mid.children"
                  :key="leaf.id"
                  clickable
                  :to="leaf.url"
                  class="q-pl-none"
                >
                  <q-item-section>{{ leaf.label }}</q-item-section>
                </q-item>
              </q-list>

            </div>

          </div>

        </q-card>
      </q-menu>

    </div>

  </div>
</template>

<script>
import menuData from "./menu.json"

export default {
  name: "MegaMenu",

  data() {
    return {
      menuData,
      openMenus: {}
    }
  },

  methods: {
    handleRootHover(item) {
        // close all menus first
        this.openMenus = {}

        // then open this item's menu IF it has children
        if (item.children && item.children.length) {
        this.openMenus = { [item.id]: true }
        }
    },

    hide(id) {
        this.openMenus = { ...this.openMenus, [id]: false }
    }
  }
}
</script>
