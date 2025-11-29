<template>
  <div class="row items-center no-wrap">

    <!-- ROOT ITEMS -->
    <div
      v-for="item in menuData"
      :key="item.id"
      class=" relative-position"
      @mouseenter="handleRootHover(item)"
      @mouseleave="hoverId = null"
    >
    <!-- q-mx-lg -->

      <!-- ROOT: NO CHILDREN -->
      <router-link
        v-if="!item.children || !item.children.length"
        :to="item.url"
        @mouseenter="hoverId = item.id"
        :style="{
          textTransform:'uppercase',
          fontSize:'15px',
          fontWeight: isActive(item) ? '700' : '400',
          borderBottom: isActive(item)
            ? '5px solid black'
            : '5px solid transparent',
          color:'#1a1a1a',
          textDecoration:'none',
          display:'inline-block',
        }"
      >
        <div
          :style="{
            padding:'8px 20px',
            backgroundColor: hoverId === item.id ? '#f2f2f2' : 'transparent',
            transition:'background-color 120ms ease'
          }"
        >
          {{ item.label }}
        </div>
      </router-link>

      <!-- ROOT: HAS CHILDREN -->
      <span
        v-else
        @mouseenter="hoverId = item.id"
        @click.stop
        @mousedown.stop
        @mouseup.stop
        :style="{
          textTransform:'uppercase',
          fontSize:'15px',
          borderBottom: isActive(item)
            ? '5px solid black'
            : '5px solid transparent',
          color:'#1a1a1a',
          display:'inline-flex',
          alignItems:'center',
          gap:'4px',
          cursor:'default',
        }"
      >
          <!-- fontWeight: openMenus[item.id] ? '700' : '500', -->
        <div
          :style="{
            padding:'8px 20px',
            backgroundColor: hoverId === item.id ? '#f2f2f2' : 'transparent',
            transition:'background-color 120ms ease'
          }"
        >
          {{ item.label }}

          <!-- CARET -->
          <q-icon
            name="keyboard_arrow_down"
            :style="{
              fontSize:'18px',
              lineHeight:'1',
              verticalAlign:'middle',
              transition:'transform 150ms ease',
              transform: openMenus[item.id]
                ? 'rotate(180deg) translateY(1px)'
                : 'rotate(0deg) translateY(-1px)'
            }"
          />
        </div>
      </span>

      <!-- MEGA MENU -->
      <q-menu
        v-if="item.children && item.children.length"
        v-model="openMenus[item.id]"
        persistent
        anchor="bottom left"
        self="top left"
        transition-show="fade"
        transition-hide="fade"
        :content-style="{
          padding:'0',
          borderRadius:'12px',
          boxShadow:'0 6px 20px rgba(0,0,0,0.15)'
        }"
      >

        <!-- POINTER NOTCH -->
        <div
          :style="{
            width:'0',
            height:'0',
            borderLeft:'12px solid transparent',
            borderRight:'12px solid transparent',
            borderBottom:'12px solid white',
            marginLeft:'40px'
          }"
        ></div>

        <!-- WHITE DROPDOWN BOX -->
        <q-card
          flat
          class="q-pa-lg"
          :style="{
            width:'100%',
            background:'white',
            borderRadius:'10px',
            padding:'28px 36px'
          }"
          @mouseleave="hide(item.id)"
        >

          <div
            class="row"
            :style="{ minWidth:'850px', columnGap:'50px' }"
          >

            <!-- LEVEL 2 -->
            <div
              v-for="mid in item.children"
              :key="mid.id"
              :style="{ minWidth:'190px' }"
            >
              <div
                :style="{
                  fontSize:'15px',
                  fontWeight:'600',
                  color:'#444',
                  marginBottom:'12px'
                }"
              >
                {{ mid.label }}

                <router-link
                  :to="mid.url"
                  :style="{
                    marginLeft:'6px',
                    color:'#888',
                    fontSize:'12px',
                    textDecoration:'none'
                  }"
                >
                  (All)
                </router-link>
              </div>

              <!-- LEVEL 3 LINKS -->
              <router-link
                v-for="leaf in mid.children"
                :key="leaf.id"
                :to="leaf.url"
                :style="{
                  display:'block',
                  marginBottom:'10px',
                  color:'#555',
                  fontSize:'14px',
                  paddingLeft:'16px',
                  textDecoration:'none',
                  position:'relative'
                }"
              >

                <!-- bullet -->
                <span
                  :style="{
                    position:'absolute',
                    left:'0',
                    top:'5px',
                    width:'6px',
                    height:'6px',
                    borderRight:'2px solid #888',
                    borderBottom:'2px solid #888',
                    transform:'rotate(-45deg)',
                    opacity:'0.5'
                  }"
                ></span>

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
import menuData from "./menu.json"

export default {
  name: "MegaMenu",

  data() {
    return {
      menuData,
      openMenus: {},
      hoverId: null
    }
  },

  methods: {

    isActive(item) {
      return this.$route.path === item.url
    },

    handleRootHover(item) {
      this.openMenus = {}
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
