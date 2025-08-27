<template>
  <template v-if="!items.length">
    <template v-if="loading">
      <div class="text-center q-pa-md">Loading...</div>
    </template>
    <template v-else>
      <div class="text-center q-pa-md text-grey-5">None</div>
    </template>
  </template>
  <template v-else>

    <div class="row">
      <!--<div class="row justify-center" >-->

      <template v-for="item in items" :key="item.id">

        <!--<q-avatar>-->
        <!--  <img :src="item">-->
        <!--</q-avatar>-->
        <div class="col-xl-6 col-md-6 col-sm-12 col-xs-12">
          <div class="q-py-lg q-px-lg">

            <div class="row">

              <div class="col-xl-4 col-md-4 col-sm-12 col-xs-12 q-px-lg">
                <div

                >
                  <img
                    :src="item?.['Image']?.[0]?.url ? `https://capetownlists.co.za/?url=${item?.['Image']?.[0]?.thumbnails?.large?.url}` : ''"
                    style="width: 100%; display: block; border-radius: 1000px;"
                  >
                  <!--<img src="https://cdn.quasar.dev/img/avatar.png">-->
                </div>
              </div>
              <div class="col-xl-8 col-md-8 col-sm-12 col-xs-12 q-px-lg ">
                <div class="column justify-center full-height">

                  <div class="lt-md q-mt-lg"></div>

                  <h2 class="text-h4 text-bold q-mt-none">
                    {{item["Title"]}}
                  </h2>

                  <div class="text-body3">
                    {{item["Tagline"]}}
                  </div>
                </div>



              </div>
            </div>

            <!--<pre>-->
            <!--  {{item}}-->
            <!--</pre>-->
          </div>
        </div>
      </template>

    </div>

  </template>


</template>

<script>
import Pool_Products_Page_Products from 'src/models/orm-api/Pool_Products_Page_Products'

export default {
  name: 'Pool_Products_Page_Products_Controller',
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
        itemsPerPage: 10,
        sortBy: [],
        groupBy: [],
      },
      filterValsRef: {},
    }
  },
  computed: {
    superTableModel() {
      return Pool_Products_Page_Products
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
      return item.URL === this.activeRoute;
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
  },
  watch: {
    '$route.path'(newPath) {
      this.activeRoute = newPath;
    }
  }
}
</script>
