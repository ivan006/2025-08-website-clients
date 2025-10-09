<template>
  <div>
    <template v-if="!items.length">
      <template v-if="loading">
        <div class="text-center q-pa-md">Loading...</div>
      </template>
      <template v-else>
        <div class="text-center q-pa-md text-grey-5">None</div>
      </template>
    </template>
    <template v-else>
      <div
        class="row q-col-gutter-md justify-center"
      >
        <template v-for="item in items" :key="item.name">

          <div :class="colClasses(3)" >

            <div class="q-card q-mx-auto" style="height: 100%; overflow: hidden;">

              <div
                :style="'cursor: pointer'"
                @click="clickRow(item)"
                :class="colClasses(12)"
              >


                <div class="q-pa-xs q-mb-sm" style="min-height: 1.375rem;">
                  <div>
                    <div>
                      <div class="text-bold" style="visibility: visible;">Name: </div>
                      <div class="" style="">

                        <span class="">
                              <div title="KETO" style="overflow: hidden;">KETO</div>
                         </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </template>
      </div>
    </template>




  </div>
</template>

<script>
import TestEntity from 'src/models/orm-api/TestEntity'

export default {
    name: 'TestEntity-list',
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
      superTableModel() {
          return TestEntity
      },
      filterValsComp() {
        const result = {
          ...this.filterValsRef,
        };
        return result;
      },
    },
    methods: {


      clickRow(pVal, item) {

        this.$router.push({
          name: '/lists/brands/:rId/:rName',
          params: {
            rId: pVal,
            rName: item.name,
          },
        })
      },
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
          let flagsComputed = {};

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
  }
}
</script>
