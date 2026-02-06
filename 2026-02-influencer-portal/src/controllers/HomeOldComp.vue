<template>
  <div style="padding-top: 0px" class="ScaledParent">
    <div v-show="loading || childLoading">
      <div class="text-center q-pa-xl">Loading...</div>
    </div>
    <div v-show="!(loading || childLoading)">
      <!-- <div class="bg-3ry-color ">
        <div
          :style="this.item.fields?.['Image']?.[0]?.url ? `background-image: url(${$apiProxyUrl}${encodeURIComponent(this.item.fields?.['Image']?.[0]?.url)});` : ``"
          style="
          min-height: 400px;
          background-color: rgb(70,70,70);
          background-position: center;
          
          background-size: 100% auto; /* height fills, width scales proportionally */
          image-rendering: crisp-edges; /* optional, prevents blurring */
          background-attachment: scroll;

          background-color: rgba(0,0,0,.0);
          background-blend-mode: darken;

          background-repeat: no-repeat;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;



          padding-top: 0px;
          
          "
          class="ScaledParent ssection-blur"
        >
          
          <div class="q-py-xl">

            <div
              class="container-md text-white"
            >
              
              <div class="row q-col-gutter-md justify-center">
            
                <div class="col-xl-8 col-md-8 col-12 text-shadow-dark-1ryd">
                  
                  <div class="gt-md q-py-xl"></div>
                  
                  <h1 class="text-center r-font-h2 text-bold">
                    <span class="text-weight-thin font-1ry text-uppercase bg-3ry-color" style="letter-spacing: 15px; padding: 0 0.6em; box-decoration-break: clone; border-radius: 200px;">
                      {{item.fields?.['Title']}}
                    </span>
                  </h1>


                  <h2 class="text-center r-font-h4" >
                    <span class="text-weight-thin font-2ry text-uppercase bg-3ry-color" style="letter-spacing: 15px; padding: 0 0.6em; box-decoration-break: clone; border-radius: 200px;" >
                      <span v-html="item.fields?.['Subtitle']"></span>
                    </span>
                  </h2>
                  
                  <div class="gt-md q-py-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <!--       
      <div class=" bg-white text- q-py-xl">
        <div
          class="container-md "
        >

          <h2 class="r-font-h3 text-center q-my-none text-uppercase font-1ry">
            {{item.fields?.['List Section Title']}}
          </h2>
        </div>
      </div> -->
      <div class="text-1ry-color">
        <HomeItemsOldComp :parent="this.item" @loaded="childLoading = false" />
      </div>

      <!-- <div class=" bg-white text- q-py-xl" id="contact">
        <div
          class="container-md "
        >

          <h2 class="r-font-h3 text-center q-my-none text-uppercase font-1ry">
            
             Contact Us
          </h2>
        </div>
      </div>
      <div class="  bg-2ry-color" >
        <div
          class="container-md q-py-xl"
        >

          <div class=" bg- text-dark">
            <div class="row q-col-gutter-md justify-around text-center">

              <div class="col-md-4 col-6 ">
                
                <q-card class="q-ma-sm bg-white" style="border-radius: 10px;" flat>
                  <q-card-section>
                    
                    <q-icon name="call" size="48px" color="green" />
                    <h5 class="q-my-md text-uppercase font-1ry">Call Us</h5>
                    <p class="text-body1">
                      {{item.fields?.['Phone Number']}}
                    </p>
                  </q-card-section>
                </q-card>
              </div>

              
              <div class="col-md-4 col-6 ">
                
                <q-card class="q-ma-sm bg-white" style="border-radius: 10px;" flat>
                  <q-card-section>
                    
                    <q-icon name="mail" size="48px" color="green" />
                    <h5 class="q-my-md text-uppercase font-1ry">Email Us</h5>
                    <p class="text-body1">
                      {{item.fields?.['Email Address']}}
                    </p>
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-md-4 col-12">
                
                <q-card class="q-ma-sm bg-white" style="border-radius: 10px;" flat>
                  <q-card-section>
                  
                    <q-icon name="schedule" size="48px" color="green" />
                    <h5 class="q-my-md text-uppercase font-1ry">Opening Hours</h5>
                     <p class="text-body1" style="white-space: pre-line;">
                        {{item.fields?.['Opening Hours']}}
                      </p>
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-6 col-md-6 col-12">
                
                <q-card class="q-ma-sm bg-white text-" style="border-radius: 10px;" flat >
                  <q-card-section>
                    <q-icon class="text" name="place" size="48px" color="green" />
                    <h5 class="q-my-md text-uppercase font-1ry">Find Us</h5>
                    <p class="text-body1" style="white-space: pre-line;">
                        {{item.fields?.['Address']}}
                    </p>
                  </q-card-section>
                </q-card>
              </div>

              </div>

            <div class="q-mt-md">
              
              <q-card class="q-ma-sm bg-white" style="border-radius: 10px;" flat>
                  <q-card-section>
                    
                    <iframe
                      width="100%"
                      height="400"
                      frameborder="0"
                      style="border:0"
                      allowfullscreen
                      src="https://www.google.com/maps/embed/v1/place?key=AIzaSyApw7uDtsYbaB0YzeB-xkWSz__rVRLi6VQ&q=52+Main+Rd,+Diep+River,+Cape+Town,+7800,+South+Africa">
                    </iframe>
                  </q-card-section>
                </q-card>


            </div>
          </div>
        </div>
      </div> -->
    </div>
    <!--<HomeSEOController />-->
  </div>
</template>

<script>
import Home_Page from "src/models/orm-api/Home_Page";
import { createMetaMixin } from "quasar";
// import HomeSEOController from "src/controllers/HomeSEOController.vue";
import HomeItemsOldComp from "src/controllers/HomeItemsOldComp.vue";
import { buildSeoConfig } from "src/utils/seo";

export default {
  name: "HomeOldComp",
  components: { HomeItemsOldComp },
  // mixins: [

  //   createMetaMixin(function () {
  //     const url = window.location.origin + (this.$route?.fullPath.split('#')[0] || '/');
  //     const siteName = import.meta.env.VITE_API_SITE_TITLE;

  //     let image = ""
  //     if (this.item?.fields?.['Image']?.[0]?.url) {
  //       image = `${import.meta.env.VITE_API_PROXY_URL}/data-cache/index.php?url=${encodeURIComponent(this.item?.['Image']?.[0]?.url)}`;
  //       image = `${import.meta.env.VITE_API_PROXY_URL}/data-cache/index.php?url=${encodeURIComponent(this.item?.fields?.['Image']?.[0]?.url)}`;
  //     }

  //     return buildSeoConfig({
  //       title: this.item.fields?.['Title'] || siteName,
  //       description: this.item.fields?.['Subtitle'] || '',
  //       url,
  //       image: image || `${window.location.origin}/og-default.jpg`,
  //       siteName,
  //       type: this.item.fields?.['SEO Type'],
  //     });
  //   })
  // ],
  data() {
    return {
      loading: true,
      childLoading: true,
      item: {},
    };
  },
  computed: {
    id() {
      // return this.$route.params.rId
      return "rec2ykH253BM2Qrsc";
    },
    superTableModel() {
      return Home_Page;
    },
  },
  methods: {
    fetchData() {
      this.loading = true;
      this.superTableModel
        .FetchById(this.id)
        .then((response) => {
          this.item = response.response.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped></style>
