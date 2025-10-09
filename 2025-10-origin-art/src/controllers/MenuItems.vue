<template>

  <div class="row justify-center" >
    <!--style="justify-content: right;"-->
    <template v-if="!items.length">
      <template v-if="loading">
        <div class="text-center q-pa-md">Loading...</div>
      </template>
      <template v-else>
        <div class="text-center q-pa-md text-grey-5">None</div>
      </template>
    </template>
    <template v-else>
      <template v-for="item in items" :key="item.id">

        <!--:tag="true ? 'a' : 'router-link'"-->
        <!--target="_blank"-->
        <!--:href="item.id"-->


        <!--@click="clickRow(item)"-->
        <q-item
          clickable
          :to="{path: item.URL, hash: item.Hash}"
          :active-class="'q-item--highlighted'"
          class="q-pl-lg r-font-h5 text-uppercase font-1ry"
          :style="isActive(item) ? 'border-bottom: black solid 5px;' : 'border-bottom: rgba(0,0,0,0) solid 5px;'"
        >
          <!--<q-item-section avatar v-if="props.icon" style="width: 20px;">-->
          <!--  <q-icon :name="props.icon" />-->
          <!--</q-item-section>-->

          <q-item-section>
            <q-item-label :style="isActive(item) ? 'font-weight: bold;': ''">
              <!--<template v-if="props.icon">-->
              <!--  <q-icon  :name="props.icon" size="sm" style="opacity: 50%" />-->
              <!--</template>-->
              {{ item.Label }}
            </q-item-label>
            <!--<q-item-label v-if="props.caption" caption>{{ props.caption }}</q-item-label>-->
          </q-item-section>
        </q-item>
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
      activeRoute: this.$route.path,
      items: [],
      loading: false,
      loadingError: false,
      options: {
        page: 1,
        itemsPerPage: 1000,
        sortBy: [],
        groupBy: [],
      },
      filterValsRef: {},
    }
  },
  computed: {
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
