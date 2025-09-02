<template>
  <div
    :style="this.item.fields?.['Image']?.[0]?.url ? `background-image: url(https://capetownlists.co.za/?url=${this.item.fields?.['Image']?.[0]?.url});` : ``"
    style="
    min-height: 100vh;
    background-color: rgb(70,70,70);
    background-position: center;
    background-size: cover;
    background-attachment: fixed;

    background-color: rgba(0,0,0,.2);
    background-blend-mode: darken;
    "
    class="ScaledParent"
  >
    <template v-if="loading">
      <div class="text-center q-pa-xl">Loading...</div>
    </template>
    <template v-else>

      <div class="q-py-xl">

        <div
          class="container-md"
        >
          <div class="row q-col-gutter-md text-white">


            <!--<div class="col-xl-1 col-md-1 col-sm-12 col-xs-12">-->


            <!--</div>-->

            <div class="col-xl-10 col-md-10 col-sm-12 col-xs-12 offset-md-1 q-px-xl flex flex-center " style="min-height: 500px;">




              <div>
                <div class="gt-sm">
                  <h1 class="text-center text-h1 " style="letter-spacing: 15px;">
                  <span class="text-weight-thin font-1ry text-uppercase" style="letter-spacing: 15px;">
                    {{item.fields?.['Title']}}
                  </span>
                  </h1>
                </div>
                <div class="lt-md">
                  <h1 class="text-center text-h3 font-1ry">
                  <span class="text-weight-thin font-1ry text-uppercase" style="letter-spacing: 15px;">
                    {{item.fields?.['Title']}}
                  </span>
                  </h1>
                </div>

                <div class="gt-sm">
                  <h2 class="text-center text-h3" >
                  <span class="text-weight-light font-2ry text-uppercase" style="letter-spacing: 15px;">
                  {{item.fields?.['Subtitle']}}
                  </span>
                  </h2>
                </div>
                <div class="lt-md">
                  <h2 class="text-center text-h5 text-bold font-2ry">
                  <span class="text-weight-light font-2ry text-uppercase" style="letter-spacing: 15px;">
                  {{item.fields?.['Subtitle']}}
                  </span>
                  </h2>
                </div>
              </div>


              <!--<div class="text-center">-->

              <!--  <q-btn-->
              <!--    size="lg"-->
              <!--    class="text-black"-->
              <!--    color="white"-->
              <!--    :href="item.fields?.['Hero CTA URL']"-->
              <!--  >-->
              <!--    {{item.fields?.['Hero CTA Text']}}-->
              <!--  </q-btn>-->
              <!--</div>-->
              <!--<pre>{{item}}</pre>-->
            </div>
          </div>
        </div>
      </div>





      <div class=" bg-white" style="padding-top: 100px; padding-bottom: 100px;">
        <div
          class="container-md q-px-lg"
        >



          <div class="gt-sm">
            <div class="text-h3 font-2ry text-center q-mb-xl">
              {{item.fields?.["Short Description"]}}
            </div>
          </div>
          <div class="lt-md">
            <div class="text-h5 font-2ry text-center q-mb-xl">
              {{item.fields?.["Short Description"]}}
            </div>
          </div>


          <div class="gt-sm">

            <div class="text-h3 font-1ry q-mt-md text-center ">
              R{{item.fields?.["Price"]}}.00
              <q-badge color="teal" style="font-size: 0.8em">
                Monthly Fee
              </q-badge>
              +
              R{{item.fields?.["Setup Fee"]}}.00
              <q-badge color="teal" style="font-size: 0.8em">
                Setup Fee
              </q-badge>
            </div>

          </div>
          <div class="lt-md">


            <div class="text-h5 font-1ry q-mt-md text-center ">
              R{{item.fields?.["Price"]}}.00
              <q-badge color="teal" style="font-size: 0.8em">
                Monthly Fee
              </q-badge>
              +
              R{{item.fields?.["Setup Fee"]}}.00
              <q-badge color="teal" style="font-size: 0.8em">
                Setup Fee
              </q-badge>
            </div>

          </div>
        </div>

      </div>



      <!--<div class=" ">-->
      <!--  <div class="row">-->

      <!--    <div-->
      <!--      class="col-xl-6 col-md-6 col-sm-12 col-xs-12"-->
      <!--    >-->



      <!--      <img-->
      <!--        :src="this.item.fields?.['Contact Image']?.[0]?.url ? `https://capetownlists.co.za/?url=${this.item.fields?.['Contact Image']?.[0]?.url}` : ''"-->
      <!--        style="-->
      <!--          width: 100%; display: block;-->
      <!--          -webkit-filter: grayscale(100%);-->
      <!--          filter:  brightness(120%);-->
      <!--        "-->
      <!--      >-->

      <!--    </div>-->
      <!--    <div class="col-xl-6 col-md-6 col-sm-12 col-xs-12  " >-->
      <!--      <div class="row full-height items-center q-py-lg q-px-xl ">-->

      <!--        <div class=""  id="contact">-->



      <!--          <h2 class="text-h3 text-bold font-1ry text-uppercase">-->

      <!--            {{item.fields?.['Contact Title']}}-->
      <!--          </h2>-->

      <!--          <div class=" text-h5 q-pb-xl font-2ry ">-->

      <!--            {{item.fields?.['Contact Email Address']}}-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->

      <!--    </div>-->
      <!--  </div>-->
      <!--</div>-->
    </template>
    <!--<HomeSEOController />-->


  </div>
</template>

<script>
import { createMetaMixin } from 'quasar'
import {buildSchemaItem, buildSeoConfig} from "src/utils/seo";
import Home_Page_Items from "src/models/orm-api/Home_Page_Items";




export default {
  name: "HomeController.vue",
  components: {},
  mixins: [

    createMetaMixin(function () {
      const url = window.location.origin + (this.$route?.fullPath || '/');
      const siteName = import.meta.env.VITE_API_SITE_TITLE;

      let image = ""
      if (this.item?.fields?.['Image']?.[0]?.url) {
        image = `https://capetownlists.co.za/?url=${this.item?.['Image']?.[0]?.url}`;
        image = `https://capetownlists.co.za/?url=${this.item?.fields?.['Image']?.[0]?.url}`;
      }

      const schema = buildSchemaItem({
        type: this.item.fields?.['SEO Type'],
        name: this.item.fields?.['Title'] || siteName,
        description: this.item.fields?.['Subtitle'] || '',
        price: this.item.fields?.['Price'] || '',
        url,
        image,
        extras: {}
      });

      return buildSeoConfig({
        title: this.item.fields?.['Title'] || siteName,
        description: this.item.fields?.['Subtitle'] || '',
        url,
        image: image || `${window.location.origin}/og-default.jpg`,
        siteName,
        type: this.item.fields?.['SEO Type'],
        schema
      });
    })
  ],
  data(){
    return {
      loading: true,
      item: {},
    }
  },
  computed: {

    id() {
      return this.$route.params.rId
      // return 'recoIS6KWZ2aqcBJT'
    },
    superTableModel() {
      return Home_Page_Items
    },
  },
  methods: {
    fetchData() {
      this.loading = true
      this.superTableModel
        // .FetchAll(
        //   [],
        //   {},
        //   {},
        //   {
        //     page: 1,
        //     limit: 10,
        //     filters: {},
        //     clearPrimaryModelOnly: false,
        //     filterByFormula: `{Slug} = "${this.id}"`,
        //   },
        // )
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




    if (window.location.hash) {
      const hash = window.location.hash; // keep the full hash intact

      // Test if hash is safe to use in querySelector
      try {
        document.querySelector(hash); // test if selector is valid
      } catch (e) {
        console.warn(`Invalid selector: ${hash} - skipping scroll`);
        return; // skip scrolling
      }

      const scrollToHash = () => {
        const el = document.querySelector(hash); // use raw hash

        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY
          window.scrollTo({
            top: top,
            behavior: 'smooth'
          })
        } else {
          setTimeout(scrollToHash, 200)
        }
      }

      scrollToHash()
    }
  }
}
</script>

<style scoped>

</style>
