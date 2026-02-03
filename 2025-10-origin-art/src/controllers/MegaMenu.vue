<template>
  <div
    class="row items-center no-wrap"
    style="gap: 32px; white-space: nowrap; padding: 0 12px"
  >
    <div
      v-for="item in menuData"
      :key="item.id"
      class="relative-position"
      @mouseenter="hoverItem(item)"
      style="padding: 8px 0; display: flex; align-items: center"
    >
      <!-- ROOT WITHOUT CHILDREN -->
      <router-link
        v-if="!item.children?.length"
        :to="item.url"
        style="
          text-transform: uppercase;
          font-size: 15px;
          padding: 6px 4px;
          display: inline-block;
          text-decoration: none;
          color: #1a1a1a;
        "
        :style="
          isActive(item)
            ? 'border-bottom:5px solid black; font-weight:700;'
            : 'border-bottom:5px solid transparent; font-weight:500;'
        "
      >
        {{ item.label }}
      </router-link>

      <!-- ROOT WITH CHILDREN -->
      <span
        v-else
        class="cursor-pointer"
        style="
          display: flex;
          align-items: center;
          gap: 4px;
          text-transform: uppercase;
          font-size: 15px;
          padding: 6px 4px;
          white-space: nowrap;
          color: #1a1a1a;
        "
        :style="
          openMenus[item.id]
            ? 'border-bottom:5px solid black; background:#f5f5f5; font-weight:700;'
            : 'border-bottom:5px solid transparent; font-weight:500;'
        "
      >
        {{ item.label }}

        <!-- FIXED CARET ALIGNMENT -->
        <q-icon
          name="keyboard_arrow_down"
          style="font-size: 18px; line-height: 15px; margin-top: -2px"
          :style="
            openMenus[item.id]
              ? 'transform:rotate(180deg); transition:150ms;'
              : 'transform:rotate(0deg); transition:150ms;'
          "
        />
      </span>

      <!-- DROPDOWN -->
      <q-menu
        v-if="item.children?.length"
        v-model="openMenus[item.id]"
        persistent
        anchor="bottom left"
        self="top left"
        transition-show="fade"
        transition-hide="fade"
        :content-style="{
          padding: '0',
          borderRadius: '12px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        }"
      >
        <div
          style="
            width: 0;
            height: 0;
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-bottom: 12px solid white;
            margin-left: 30px;
          "
        ></div>

        <q-card
          flat
          class="q-pa-lg"
          style="background: white; border-radius: 10px; padding: 28px 36px"
          @mouseleave="close(item.id)"
        >
          <div class="row" style="column-gap: 50px; min-width: 850px">
            <div
              v-for="mid in item.children"
              :key="mid.id"
              style="min-width: 190px"
            >
              <div
                style="
                  font-size: 15px;
                  font-weight: 600;
                  color: #444;
                  margin-bottom: 12px;
                "
              >
                {{ mid.label }}

                <router-link
                  :to="mid.url"
                  style="
                    margin-left: 6px;
                    color: #888;
                    font-size: 12px;
                    text-decoration: none;
                  "
                >
                  (All)
                </router-link>
              </div>

              <router-link
                v-for="leaf in mid.children"
                :key="leaf.id"
                :to="leaf.url"
                style="
                  display: block;
                  margin-bottom: 10px;
                  color: #555;
                  font-size: 14px;
                  padding-left: 16px;
                  text-decoration: none;
                  position: relative;
                "
              >
                <span
                  style="
                    position: absolute;
                    left: 0;
                    top: 5px;
                    width: 6px;
                    height: 6px;
                    border-right: 2px solid #888;
                    border-bottom: 2px solid #888;
                    transform: rotate(-45deg);
                    opacity: 0.5;
                  "
                >
                </span>

                {{ leaf.label }}
              </router-link>
            </div>
          </div>
        </q-card>
      </q-menu>
    </div>
  </div>
</template>

<script>
import menuData from "./menu.json";

export default {
  name: "MegaMenu",

  data() {
    return {
      menuData,
      openMenus: {},
    };
  },

  methods: {
    isActive(item) {
      return this.$route.path === item.url;
    },
    hoverItem(item) {
      this.openMenus = {};
      if (item.children?.length) {
        this.openMenus = { [item.id]: true };
      }
    },
    close(id) {
      this.openMenus = { ...this.openMenus, [id]: false };
    },
  },
};
</script>
