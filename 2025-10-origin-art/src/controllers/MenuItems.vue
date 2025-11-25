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

        <q-item
          clickable
          :to="item.url"
          class="q-pl-lg text-uppercase"
          @mouseenter="openMenu(item.id)"
          :style="{
            borderBottom: isActive(item) ? '5px solid black' : '5px solid transparent',
            fontWeight: isActive(item) ? 'bold' : 'normal'
          }"
        >
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-menu
          v-if="item.children.length"
          v-model="openMenus[item.id]"
          anchor="bottom left"
          self="top left"
          transition-show="jump-down"
          transition-hide="jump-up"
          persistent
        >
          <div
            class="row q-pa-md"
            :style="{ minWidth:'650px', columnGap:'40px' }"

            @mouseenter="forceStayOpen(item.id)" 
            @mouseleave="closeMenu(item.id)" 
          >
           
            <!-- Category column -->
            <div
              v-for="child in item.children"
              :key="child.id"
              class="column"
              :style="{ minWidth: '200px' }"
            >

              <!-- Parent Label -->
              <router-link
                :to="child.url"
                :style="{
                  fontWeight: 'bold',
                  color: 'black',
                  marginBottom: '8px',
                  display: 'block',
                  textDecoration: 'none'
                }"
              >
                {{ child.label }}
              </router-link>

              <!-- Tier Levels -->
              <router-link
                v-for="grand in child.children"
                :key="grand.id"
                :to="grand.url"
                :style="{
                  color: '#555',
                  marginBottom: '6px',
                  display: 'block',
                  textDecoration: 'none'
                }"
              >
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
  components: {
  },

  props: {
    fetchFlags: {
      type: Object,
      default: () => ({})
    }
  },
  data(){
    return {
      openMenus: {},
      activeRoute: this.$route.path,
      items: [],
      loading: false,
      loadingError: false,
      options: {
        page: 1,
        itemsPerPage: 100,
        sortBy: [],
        groupBy: [],
      },
      filterValsRef: {},
    }
  },
  computed: {

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
          childIds: item.Site_Menu_Items || []
        }
      })

      // Step 2 — recursive builder
      const buildTree = (node) => {
        const children = []

        // Children defined explicitly in Site_Menu_Items
        node.childIds.forEach(childId => {
          if (map[childId]) children.push(buildTree(map[childId]))
        })

        // Children defined implicitly via Parent reference
        Object.values(map).forEach(n => {
          if (n.parentIds.includes(node.id)) {
            children.push(buildTree(n))
          }
        })

        return { ...node, children }
      }

      // Step 3 — return only root nodes (those with no Parent)
      const roots = Object.values(map)
        .filter(node => node.parentIds.length === 0)

      const result = roots.map(root => buildTree(root))
      console.log(result)
      return result
    },

    superTableModel() {
      return Site_Menu_Items
    },
    filterValsComp() {
      const result = {
        ...this.filterValsRef,
      };
      return result;
    },
  },
  methods: {


    openMenu(id) {
      this.openMenus[id] = true
    },

    forceStayOpen(id) {
      this.openMenus[id] = true
    },

    closeMenu(id) {
      this.openMenus[id] = false
    },


    // isActive(item) {
    //   return this.$route.path === item.url
    // },
    isActive(item) {
      return item.URL === this.activeRoute && item.Hash == null;
    },

    // clickRow(item) {
    //
    //   this.$router.push({
    //     path: item.URL
    //     // name: '/lists/brands/:rId/:rName',
    //     // params: {
    //     //   rId: pVal,
    //     //   rName: item.name,
    //     // },
    //   })
    // },
    colClasses(baseWidth = 12) {
      baseWidth = +baseWidth


      // Coefficients for each breakpoint
      const coefficients = {
        lg: 1,   // Large screens
        md: 1.5, // Medium screens
        sm: 2,   // Small screens
        xs: 4    // Extra small screens
      };

      // Rounding function to the nearest value from the set [1, 2, 3, 4, 6, 12]
      function roundToNearestSet(value) {
        // return Math.min(Math.round(value), 12)
        const set = [1, 2, 3, 4, 6, 12];
        return set.reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev));
      }

      // Calculate widths based on coefficients and round them
      const lg = roundToNearestSet(baseWidth * coefficients.lg);
      const md = roundToNearestSet(baseWidth * coefficients.md);
      const sm = roundToNearestSet(baseWidth * coefficients.sm);
      const xs = roundToNearestSet(baseWidth * coefficients.xs);

      return `col-${lg} col-lg-${lg} col-md-${md} col-sm-${sm} col-xs-${xs}`;
    },

    async fetchData() {
      try {

        this.loading = true;
        this.loadingError = false;
        let rules = [];


        let extraHeaderComputed = {};
        let flagsComputed = {
          // view: "viwd5NTAtsGwAryxx"
        };

        const response = await this.superTableModel.FetchAll(
          // =========================
          [],
          {
            ...rules,
            ...flagsComputed,
            /// -----------------------
            ...this.fetchFlags,
          },
          extraHeaderComputed,
          {
            page: this.options.page,
            limit: this.options.itemsPerPage,
            //============================
            filters: this.filterValsComp,
            clearPrimaryModelOnly: false,
          },
        );

        this.$emit('loaded')

        this.items = response.response.data.records.map(record => {
          return {
            id: record.id,
            createdTime: record.createdTime,
            ...record.fields
          };
        });


        this.loading = false;

      } catch (error) {
        this.loading = false;
        this.loadingError = true;
      }
    },
  },
  mounted(){
    this.fetchData();
  },
  watch: {
    '$route.path'(newPath) {
      this.activeRoute = newPath;
    }
  }
}
</script>
