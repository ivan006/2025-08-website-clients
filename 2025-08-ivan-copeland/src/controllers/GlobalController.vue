<template>
  <div
    :style="this.item.fields?.['Site Background Image']?.[0]?.url ? `background-image: url(https://capetownlists.co.za/?url=${this.item.fields?.['Site Background Image']?.[0]?.url});` : ``"
    style="
    min-height: 100vh;
    background-color: rgb(70,70,70);
    background-position: center;
    background-size: cover;
    background-attachment: fixed;

    background-color: rgba(0,0,0,.25);
    background-blend-mode: darken;
    "
    class="ScaledParent"
  >


    <q-toolbar style="" class="q-py-md bg-white ">

      <div class="container-md  ">
        <template v-if="loading">
          <div class="text-center q-pa-xl">Loading...</div>
        </template>
        <template v-else>
          <div class="row justify-between items-center  q-py-md ">

            <div
              class="col-12 col-md-auto text-center"
            >

              <!--<q-btn flat round dense icon="menu" class="q-mr-sm" />-->
              <!--<q-avatar large>-->
              <!--  <img :src="this.item.fields?.['Logo Image']?.[0]?.url">-->
              <!--  &lt;!&ndash;<q-icon name="school" size="lg" style="opacity: 50%" />&ndash;&gt;-->
              <!--</q-avatar>-->

              <img
                :src="this.item.fields?.['Logo Image'][0].thumbnails.large.url ? `https://capetownlists.co.za/?url=${this.item.fields?.['Logo Image'][0].thumbnails.large.url}` : ''"
                style="height: 200px;"
              >
              <!--<q-toolbar-title>-->
              <!--  &lt;!&ndash;{{ siteTitle }}&ndash;&gt;-->
              <!--</q-toolbar-title>-->
            </div>
            <div
              class="col-12 col-md-auto q-my-lg text-center"
            >

              <!--<q-btn flat round dense icon="whatshot" />-->
              <MenuItems />

            </div>
          </div>
        </template>

      </div>

    </q-toolbar>



    <!--<img v-if="item.fields" :src="`https://capetownlists.co.za/?url=${item.fields['Site Background Image']?.[0]?.url}`" alt="">-->
    <!--<img v-if="item.fields" :src="`${item.fields['Site Background Image']?.[0]?.url}`" alt="">-->



    <q-page-container>
      <!--<pre>{{item}}</pre>-->
      <div class="q-mt-md " style="min-height: 60vh;">
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
