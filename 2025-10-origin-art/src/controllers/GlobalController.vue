<template>
  <div
  >

    <!-- TOP CONTACT BAR -->
    <!-- 🔥 TOP CONTACT + SOCIAL BAR -->
    <!-- 🔥 TOP CONTACT + SOCIAL BAR (taller version) -->
    <div
      class="bg-white "
      style="
        border-bottom: 1px solid rgba(0,0,0,0.08);
        padding: 10px 0;       /* taller */
      "
    >
      <div class="container-md">
        <div class="row justify-between items-center">

          <!-- LEFT: PHONE -->
          <div class="row items-center q-gutter-sm">

            <q-icon
              name="mdi-phone-outline"
              size="20px"
              style="opacity: 0.85;"
            />

            <span
              class="text-body1"
              style="font-weight: 500; letter-spacing: 0.3px;"
            >
              {{ this.item.fields?.['Phone Number'] }}
            </span>

          </div>

          <!-- RIGHT: SOCIAL -->
          <div class="row items-center q-gutter-lg">

            <a :href="this.item.fields?.['Facebook URL']" target="_blank" style="color: #000;">
              <q-icon name="mdi-facebook" size="20px" style="opacity: 0.85;" />
            </a>

            <a :href="this.item.fields?.['Instagram URL']" target="_blank" style="color: #000;">
              <q-icon name="mdi-instagram" size="20px" style="opacity: 0.85;" />
            </a>

          </div>

        </div>
      </div>
    </div>




    <q-toolbar class="q-py-md q-px-none bg-whit text-" style="margin-bottom: -0px; background-color: rgba(255,255,255,1.0); border-bottom: 1px solid rgba(0, 0, 0, 0.12);">

      <div class="container-md  ">
        <div v-show="loading || childLoading">
          <div class="text-center q-pa-xl">Loading...</div>
        </div>
        <div v-show="!(loading || childLoading)">
          <div class="row justify-between items-center  q-py-mdx ">

            <div
              class="col-12x col-md-auto text-center"
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
                      :src="this.item.fields?.['Logo Image'][0].thumbnails.large.url ? `${$apiProxyUrl}${encodeURIComponent(this.item.fields?.['Logo Image'][0].thumbnails.large.url)}` : ''"
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
              class="col-12x col-md-auto q-my-lgx text-center"
            >
              <!-- <MegaMenu /> -->

              <!--<q-btn flat round dense icon="whatshot" />-->
              <MenuItems @loaded="childLoading=false" />

            </div>
          </div>
        </div>

      </div>

    </q-toolbar>



    <!--<img v-if="item.fields" :src="`${$apiProxyUrl}${encodeURIComponent(item.fields['Site Background Image']?.[0]?.url)}`" alt="">-->
    <!--<img v-if="item.fields" :src="`${item.fields['Site Background Image']?.[0]?.url}`" alt="">-->



    <q-page-container>
      <!--<pre>{{item}}</pre>-->
      <div class="bg-grey-1 " style="min-height: 60vh;">
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
import MegaMenu from 'src/controllers/MegaMenu.vue'


export default {
  name: 'GlobalController',
  components: {
    FooterController,
    // BreadcrumbsComp,
    MenuItems,
    // MegaMenu,
  },

  data(){
    return {
      siteTitle: 'Lorum Ipsum',
      loading: true,
      childLoading: false,
      item: {},
    }
  },
  computed: {

    id() {
      // return this.$route.params.rId
      return 'recE9Mnz1vihDkgXU'
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
