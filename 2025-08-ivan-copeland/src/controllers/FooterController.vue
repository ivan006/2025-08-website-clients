<template>
  <div class="bg-white">
    <div class="container-md">
      <template v-if="loading">
        <div class="text-center q-pa-xl">Loading...</div>
      </template>
      <template v-else>

        <div class="row justify-between  q-py-md items-center">

          <div
            class="col-12 col-md-auto text-center"
          >

            <img
              :src="this.item.fields?.['Footer Logo'][0].thumbnails.large.url ? `https://capetownlists.co.za/?url=${this.item.fields?.['Footer Logo'][0].thumbnails.large.url}` : ''"
              style="height: 100px;"
            >
          </div>
          <div
            class="col-12 col-md-auto text-center"
          >
            <div class="text-center">

              {{item.fields?.['Copyright Text']}}
            </div>
          </div>
          <div
            class="col-12 col-md-auto text-center"
          >
            <div class="row no-wrap justify-center q-my-lg" >
              <!--<a :href="this.item.fields?.['Facebook Link']" target="_blank" style="height: 16px; width: 16px;" class="q-mx-sm">-->
              <!--  <svg style="fill: rgb(255, 255, 255);" data-v-f03d3c87="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="c-icon c-icon&#45;&#45;md" role="presentation"><path data-v-f03d3c87="" d="M6.2965 3.7118v1.9264H5V8h1.2965v7H8.96V8h1.7883s.1669-1.134.2517-2.3702H8.9704V4.0184c0-.2408.2909-.56.5779-.56H11V1H9.0265c-2.7952 0-2.73 2.359-2.73 2.7118Z"></path></svg>-->
              <!--</a>-->
              <!--<a href="https://www.instagram.com/the_gas_pad/" target="_blank" style="height: 16px; width: 16px;" class="q-mx-sm">-->
              <!--  <svg style="fill: rgb(0, 0, 0);" data-v-f03d3c87="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="c-icon c-icon&#45;&#45;md" role="presentation"><path data-v-f03d3c87="" fill-rule="evenodd" clip-rule="evenodd" d="M7.7163 2c-1.6296 0-1.8336.0072-2.4732.036-.4978.01-.9904.104-1.4568.2784a2.9448 2.9448 0 0 0-1.0632.6924A2.9448 2.9448 0 0 0 2.0307 4.07a4.4126 4.4126 0 0 0-.2784 1.4568c-.0288.6396-.036.8436-.036 2.4732s.0072 1.8336.036 2.4732c.01.4978.104.9904.2784 1.4568a2.945 2.945 0 0 0 .6924 1.0632 2.945 2.945 0 0 0 1.0632.6924c.4664.1743.959.2685 1.4568.2784.6396.0288.84.036 2.4732.036s1.8336-.0072 2.4732-.036a4.4124 4.4124 0 0 0 1.4568-.2784 3.0688 3.0688 0 0 0 1.7556-1.7556 4.4124 4.4124 0 0 0 .2784-1.4568c.0288-.6396.036-.84.036-2.4732s-.0072-1.8336-.036-2.4732a4.4123 4.4123 0 0 0-.2784-1.4568 2.945 2.945 0 0 0-.6924-1.0632 2.945 2.945 0 0 0-1.0632-.6924 4.4126 4.4126 0 0 0-1.4568-.2784C9.5499 2.0072 9.3459 2 7.7163 2Zm0 2.9184a3.0816 3.0816 0 1 0 0 6.1632 3.0816 3.0816 0 0 0 0-6.1632Zm0 5.082A2.0004 2.0004 0 1 1 9.7167 8a2.0016 2.0016 0 0 1-2.0004 2.0004Zm3.9228-5.2032a.72.72 0 1 1-1.44 0 .72.72 0 0 1 1.44 0Z"></path></svg>-->
              <!--</a>-->
              <!--<a :href="this.item.fields?.['TikTok Link']" target="_blank" style="height: 16px; width: 16px;" class="q-mx-sm">-->
              <!--  <svg style="fill: rgb(255, 255, 255);" data-v-f03d3c87="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="c-icon c-icon&#45;&#45;md" role="presentation"><path data-v-f03d3c87="" d="M13.9592 6.6463a3.7426 3.7426 0 0 1-3.479-1.6677v5.7371a4.2621 4.2621 0 0 1-7.2677 3.0439 4.2617 4.2617 0 0 1-.934-4.6474 4.262 4.262 0 0 1 3.9397-2.6361c.0893 0 .1758 0 .2638.0125V8.582a2.3428 2.3428 0 0 0-.2638-.025 2.1645 2.1645 0 1 0 0 4.3261c1.2016 0 2.2622-.942 2.2622-2.138L8.5013 1h2.0096a3.7327 3.7327 0 0 0 3.4483 3.3242v2.3221Z"></path></svg>-->
              <!--</a>-->
            </div>

          </div>
        </div>
      </template>
    </div>
  </div>



</template>

<script>
// import MenuItems from 'src/controllers/MenuItems.vue';
import Site_Menu_Items from "src/models/orm-api/Site_Menu_Items";
import Site from "src/models/orm-api/Site";

export default {
  name: 'FooterController',
  components: {
    // BreadcrumbsComp,
    // MenuItems
  },

  data(){
    return {
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
