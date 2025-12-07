<template>

  <div class="row justify-center">
    <!-- Loading -->
    <template v-if="loading">
      <div class="text-center q-pa-md">Loading...</div>
    </template>

    <!-- Empty -->
    <template v-else-if="!nestedMenu.length">
      <div class="text-center q-pa-md text-grey-5">None</div>
    </template>

    <!-- Menu -->
    <template v-else>

      <template v-for="item in nestedMenu" :key="item.id">

        <!-- ROOT ITEMS -->
        <q-item clickable :to="{path: !item.children.length ? item.url : undefined, hash: item.Hash}" class="q-pl-lg text-uppercase "
          @mouseenter="handleRootHover(item)" @mouseleave="scheduleClose(item.id)" @click.stop :style="{
            borderBottom: isActive(item) ? '5px solid black' : '5px solid transparent',
            fontWeight: isActive(item) ? 'bold' : 'normal',
            color: '#1a1a1a',
            paddingLeft: '16px'
          }">
          <q-item-section>
            <q-item-label class="text-weight-bold " style="color: #666;">
              {{ item.label }}


              <q-icon v-if="item.children.length" name="keyboard_arrow_down"
                style="font-size:18px; line-height:15px; margin-top:-2px;" :style="openMenuId === item.id
                  ? 'transform:rotate(180deg); transition:150ms;'
                  : 'transform:rotate(0deg); transition:150ms;'" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <!-- MEGA MENU (ONLY IF HAS CHILDREN) -->
        <q-menu v-if="item.children.length" :model-value="openMenuId === item.id"
          @update:model-value="val => openMenuId = val ? item.id : null" anchor="bottom left" self="top left"
          transition-show="fade" transition-hide="fade" persistent :content-style="{
            padding: '0',
            borderRadius: '12px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
          }">

          <!-- POINTER NOTCH -->
          <div :style="{
            width: '0',
            height: '0',
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderBottom: '12px solid white',
            marginLeft: '50px'
          }"></div>

          <!-- MAIN MEGA BOX -->
          <div class="row" @mouseenter="clearCloseTimer(closeTimer)" @mouseleave="scheduleClose(item.id)" :style="{
            padding: '24px 32px',
            columnGap: '50px',
            background: 'white',
            borderRadius: '10px',
            width: 'auto',
            maxWidth: '95vw'
          }">

            <!-- SECTION: solo children (no sub-items) -->
            <!-- SOLO ITEMS (no subchildren) -->
            <div v-if="grouped[item.id].solo.length" class="column q-mb-xlx" :style="{
              flex: '0 0 auto',
              minWidth: '220px',
              paddingBottom: '10px'
            }">
              <router-link v-for="solo in grouped[item.id].solo" :key="solo.id" :to="solo.url"
                @click="scheduleClose(item.id)" :style="{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 0',
                  color: '#333',
                  fontSize: '15px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  opacity: '0.85',
                  transition: 'opacity 150ms'
                }" @mouseenter="$event.target.style.opacity = '1'" @mouseleave="$event.target.style.opacity = '0.85'">
                <!-- Chevron bullet -->
                <span :style="{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRight: '2px solid #888',
                  borderBottom: '2px solid #888',
                  transform: 'rotate(-45deg)',
                  marginTop: '2px'
                }"></span>

                {{ solo.label }}
              </router-link>
            </div>


            <!-- SECTION: children that *have* subchildren -->
            <div v-for="child in grouped[item.id].cols" :key="child.id" class="column"
              :style="{ flex: '0 0 auto', minWidth: '180px' }">

              <!-- Category Name -->
              <div :style="{
                fontWeight: '600',
                marginBottom: '14px',
                color: '#444',
                fontSize: '15px'
              }">
                {{ child.label }}
                <router-link :to="child.url" :style="{
                  marginLeft: '6px',
                  color: '#999',
                  fontSize: '12px',
                  textDecoration: 'none'
                }">
                  (All)
                </router-link>
              </div>

              <!-- Sub-items -->
              <router-link v-for="grand in child.children" :key="grand.id" :to="grand.url" :style="{
                display: 'block',
                marginBottom: '10px',
                color: '#666',
                fontSize: '14px',
                textDecoration: 'none',
                paddingLeft: '14px',
                position: 'relative'
              }">
                <span :style="{
                  position: 'absolute',
                  left: '0',
                  top: '5px',
                  width: '6px',
                  height: '6px',
                  borderRight: '2px solid #888',
                  borderBottom: '2px solid #888',
                  transform: 'rotate(-45deg)',
                  opacity: '0.6'
                }"></span>

                {{ grand.label }}
              </router-link>

            </div>

          </div>




        </q-menu>

      </template>

    </template>

  </div>

</template>

<script>
import Site_Menu_Items from 'src/models/orm-api/Site_Menu_Items'

export default {
  name: 'MenuItems',

  props: {
    fetchFlags: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      openMenuId: null,
      activeRoute: this.$route.path,
      items: [],
      loading: false,
      loadingError: false,
      options: {
        page: 1,
        itemsPerPage: 100
      },
      filterValsRef: {}
    }
  },

  computed: {

    grouped() {
      const out = {}
      this.nestedMenu.forEach(root => {
        const solo = []
        const cols = []

        root.children.forEach(c => {
          if (!c.children || c.children.length === 0) {
            solo.push(c)
          } else {
            cols.push(c)
          }
        })

        out[root.id] = { solo, cols }
      })
      return out
    },
    nestedMenu() {
      const items = this.items
      if (!items || !items.length) return []

      // Step 1 — index by id
      const map = {}
      items.forEach(item => {
        map[item.id] = {
          id: item.id,
          label: item.Label,
          url: item.URL,
          slug: item.Slug,
          parentIds: item.Parent || [],
          childIds: item.Site_Menu_Items || [],
          Hash: item.Hash || []
        }
      })

      // Step 2 — recursive tree builder
      const buildTree = (node) => {
        const children = []

        // Child relations → explicit
        node.childIds.forEach(childId => {
          if (map[childId]) children.push(buildTree(map[childId]))
        })

        // Parent relations → implicit
        Object.values(map).forEach(n => {
          if (n.parentIds.includes(node.id)) {
            children.push(buildTree(n))
          }
        })

        return { ...node, children }
      }

      // Step 3 — return roots
      const roots = Object.values(map).filter(n => n.parentIds.length === 0)
      return roots.map(root => buildTree(root))
    }
  },

  methods: {

    clearCloseTimer() {
      clearTimeout(this.closeTimer);
    },

    handleRootHover(item) {
      clearTimeout(this.closeTimer);
      if (item.children?.length) {
        this.openMenuId = item.id;
      } else {
        this.openMenuId = null;
      }
    },

    scheduleClose(id) {
      clearTimeout(this.closeTimer);

      this.closeTimer = setTimeout(() => {
        if (this.openMenuId === id) {
          this.openMenuId = null;
        }
      }, 120); // ← MAGIC NUMBER (works perfectly)
    },
    isActive(item) {
      return item.URL === this.activeRoute && item.Hash == null;
    },

    // Fetch data
    async fetchData() {
      try {
        this.loading = true
        this.loadingError = false

        const response = await Site_Menu_Items.FetchAll(
          [],
          {
            ...this.fetchFlags
          },
          {},
          {
            page: this.options.page,
            limit: this.options.itemsPerPage,
            filters: this.filterValsRef,
            clearPrimaryModelOnly: false
          }
        )

        this.$emit('loaded')

        this.items = response.response.data.records.map(record => ({
          id: record.id,
          createdTime: record.createdTime,
          ...record.fields
        }))

        this.loading = false

      } catch (err) {
        this.loading = false
        this.loadingError = true
      }
    }
  },

  mounted() {
    this.fetchData()
  },

  watch: {
    '$route.path'(val) {
      this.activeRoute = val
    }
  }
}
</script>
