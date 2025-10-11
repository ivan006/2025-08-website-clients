<template>
  <div
  >


    <q-toolbar class="q-py-md bg-whit text-" style="margin-bottom: -0px; background-color: rgba(255,255,255,1.0); border-bottom: 1px solid rgba(0, 0, 0, 0.12);">

      <div class="container-md  ">
        <div v-show="loading || childLoading">
          <div class="text-center q-pa-xl">Loading...</div>
        </div>
        <div v-show="!(loading || childLoading)">
          <div class="row justify-between items-center  q-py-mdx ">

            <div
              class="col-12 col-md-auto text-center"
            >

              <!--<q-btn flat round dense icon="menu" class="q-mr-sm" />-->
              <!--<q-avatar large>-->
              <!--  <img :src="this.item.fields?.['Logo Image']?.[0]?.url">-->
              <!--  &lt;!&ndash;<q-icon name="school" size="lg" style="opacity: 50%" />&ndash;&gt;-->
              <!--</q-avatar>-->



              <q-item
                to="/"
                class="q-pa-none"
              >

                <q-item-section>

                  <div>
                    <img
                      :src="this.item.fields?.['Logo Image'][0].thumbnails.large.url ? `https://capetownlists.co.za/?url=${encodeURIComponent(this.item.fields?.['Logo Image'][0].thumbnails.large.url)}` : ''"
                      style="max-height: 100px;"
                    >
                  </div>
                </q-item-section>
              </q-item>
              <!--<q-toolbar-title>-->
              <!--  &lt;!&ndash;{{ siteTitle }}&ndash;&gt;-->
              <!--</q-toolbar-title>-->
            </div>
            <div
              class="col-12 col-md-auto q-my-lgx text-center"
            >

              <!--<q-btn flat round dense icon="whatshot" />-->
              <MenuItems @loaded="childLoading=false" />

            </div>
          </div>
        </div>

      </div>

    </q-toolbar>



    <!--<img v-if="item.fields" :src="`https://capetownlists.co.za/?url=${encodeURIComponent(item.fields['Site Background Image']?.[0]?.url)}`" alt="">-->
    <!--<img v-if="item.fields" :src="`${item.fields['Site Background Image']?.[0]?.url}`" alt="">-->



    <q-page-container>
      <!--<pre>{{item}}</pre>-->
      <div class=" " style="min-height: 60vh;">
        <!--<BreadcrumbsComp />-->
        <router-view />
      </div>
    </q-page-container>
    <!--<div class="q-pb-md">-->
    <!--</div>-->
    <!--<div class="q-px-md">-->
    <!--</div>-->
    <FooterController />
  </div>

</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
// import BreadcrumbsComp from 'src/controllers/BreadcrumbsComp.vue';
import VueCookies from 'vue-cookies';
import MenuItems from 'src/controllers/MenuItems.vue';
import Site_Menu_Items from "src/models/orm-api/Site_Menu_Items";
import Site from "src/models/orm-api/Site";
import FooterController from "src/controllers/FooterController.vue";

export default {
  name: 'GlobalController',
  components: {
    FooterController,
    // BreadcrumbsComp,
    MenuItems
  },

  data(){
    return {
      siteTitle: 'Lorum Ipsum',
      loading: true,
      childLoading: true,
      item: {},
    }
  },
  computed: {

    id() {
      // return this.$route.params.rId
      return 'reci1Y5KdKFBkz3T1'
    },
    superTableModel() {
      return Site
    },
    bgUrl() {
      const result = this.item.fields?.['Site Background Image']?.[0]?.url
      return result
    },
  },
  methods: {
    fetchData() {
      this.loading = true
      this.superTableModel
        .FetchById(
          this.id,
          // this.relationships,
          [],
          { flags: {}, moreHeaders: {}, rels: [] }
        )
        .then((response) => {
          this.item = response.response.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        });
    },
  },
  mounted(){
    this.fetchData();
  }
};
</script>
