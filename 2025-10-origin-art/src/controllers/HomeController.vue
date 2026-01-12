<template>
  <div style="


    padding-top: 0px;
    " class="ScaledParent">
    <div v-show="loading || childLoading">
      <div class="text-center q-pa-xl">Loading...</div>
    </div>
    <div v-show="!(loading || childLoading)">
      <img
        :src="this.item.fields?.['Image']?.[0]?.url ? `${$apiProxyUrl}${encodeURIComponent(this.item.fields?.['Image']?.[0]?.thumbnails?.large?.url)}` : ''"
        alt="" style="display: none;">
      <div class="bg-3ry-color ">
        <div
          :style="this.item.fields?.['Image']?.[0]?.url ? `background-image: url(${$apiProxyUrl}${encodeURIComponent(this.item.fields?.['Image']?.[0]?.url)});` : ``"
          style="
          background-color: rgb(70,70,70);
          background-position: center;
          
          background-size: cover; /* height fills, width scales proportionally */
          image-rendering: crisp-edges; /* optional, prevents blurring */
          background-attachment: scroll;

          background-color: rgba(0,0,0,.0);
          background-blend-mode: darken;

          background-repeat: no-repeat;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;


          background-color: rgba(0,0,0,.3);
          background-blend-mode: darken;

          padding-top: 0px;
          
          " class="ScaledParent ssection-blur">
          <!-- min-height: 400px; -->
          <div class="q-py-xl">

            <div class="container-sm text-white">

              <div class="row q-col-gutter-md justify-center">

                <div class="col-xl-6 col-md-6 col-12 ">

                  <div class="gt-md q-py-lg"></div>

                  <h1 class="text-center r-font-h3 text-bold ">
                    <span class="text-weight-bold font-1ry text-uppercase" style="letter-spacing: 15px;">
                      {{ item.fields?.['Title'] }}
                    </span>
                  </h1>


                  <h2 class="text-center text-subtitle2">
                    <span class="text-weight-lightx font-2ry text-uppercase" style="letter-spacing: 10px;">
                      {{ item.fields?.['Subtitle'] }}
                    </span>
                  </h2>

                  <div class="gt-md q-py-lg"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="row q-col-gutter-md justify-center">
        
            <div class="col-xl-8 col-md-8 col-12 ">
              
              <div class="gt-md q-py-xl"></div>
              
              <h1 class="text-center r-font-h2 text-bold">
                <span class="text-weight-thin font-1ry text-uppercase" style="letter-spacing: 15px;">
                  {{item.fields?.['Title']}}
                </span>
              </h1>


              <h2 class="text-center r-font-h4" >
                <span class="text-weight-light font-2ry text-uppercase" style="letter-spacing: 15px;">
                {{item.fields?.['Subtitle']}}
                </span>
              </h2>
              
              <div class="gt-md q-py-xl"></div>
            </div>
          </div> -->
          <!-- <div class="q-py-xl">

            <div
              class="container-sm text-white"
            >
              
              <div class="row q-col-gutter-md justify-center">
            
                <div class="col-xl-8 col-md-8 col-12 text-shadow-dark-1ryd">
                  
                  <div class="gt-md q-py-xl"></div>
                  
                  <h1 class="text-center r-font-h2 text-bold">
                
                    {{item.fields?.['Title']}}
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
          </div> -->
        </div>
      </div>



      <!--       
      <div class=" bg-white text- q-py-xl">
        <div
          class="container-sm "
        >

          <h2 class="r-font-h3 text-center q-my-none text-uppercase font-1ry">
            {{item.fields?.['List Section Title']}}
          </h2>
        </div>
      </div> -->


      <!-- <div class=" bg-white text- q-py-md">
        <div
          class="container-sm "
        >

          <h2 class="r-font-h3 text-center q-my-none text-uppercase font-1ry">
            {{item.fields?.['List Section Title']}} 
          </h2>
        </div>
      </div> -->
      <div class="bg-2ry-color">
        <div class="container-sm q-py-lg">

          <Home_Page_Items_Controller :parent="this.item" @loaded="childLoading = false" />
        </div>
      </div>


      <div class=" bg-white text- q-py-md" id="contact">
        <div class="container-sm ">

          <h2 class="r-font-h3 text-center q-my-none text-uppercase font-1ry">

            Featured Artist
          </h2>
        </div>
      </div>
      <!-- Featured artist -->
      <div class="bg-2ry-color">
        <div class="container-sm q-py-xl">
          <HomePageFeaturedArtistComp v-if="item.fields" :artistId="item.fields['Featured Artist'][0]" />
        </div>
      </div>

      <div class=" bg-white text- q-py-md" id="contact">
        <div class="container-sm ">

          <h2 class="r-font-h3 text-center q-my-none text-uppercase font-1ry">

            Contact Us
          </h2>
        </div>
      </div>
      <div class="  bg-2ry-color">
        <div class="container-sm q-py-lg">

          <!-- <Tertiary_Page_Items_Controller :parent="this.item" /> -->
          <div class=" bg- text-dark">
            <div class="row q-col-gutter-lg justify-around text-center">

              <!-- Phone -->
              <div class="col-md-6 col-6 ">

                <q-card class="q-ma-smx bg-white" style="border-radius: 10px;" flat>
                  <q-card-section>

                    <q-icon name="call" size="48px" color="grey-8" />
                    <h5 class="r-font-h6 q-my-md text-uppercase font-1ry">Call Us</h5>
                    <p class="text-body1">
                      {{ item.fields?.['Phone Number'] }}
                    </p>
                  </q-card-section>
                </q-card>
              </div>


              <div class="col-md-6 col-6 ">

                <q-card class="q-ma-smx bg-white" style="border-radius: 10px;" flat>
                  <q-card-section>

                    <q-icon name="mail" size="48px" color="grey-8" />
                    <h5 class="r-font-h6 q-my-md text-uppercase font-1ry">Email Us</h5>
                    <p class="text-body1">
                      {{ item.fields?.['Email Address'] }}
                    </p>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Opening Hours -->
              <div class="col-md-6 col-6">

                <q-card class="q-ma-smx bg-white" style="border-radius: 10px;" flat>
                  <q-card-section>

                    <q-icon name="schedule" size="48px" color="grey-8" />
                    <h5 class="r-font-h6 q-my-md text-uppercase font-1ry ">Opening Hours</h5>
                    <p class="text-body2" style="white-space: pre-line;">
                      {{ item.fields?.['Opening Hours'] }}
                    </p>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Address & Directions -->
              <div class="col-6 col-md-6 col-6">

                <q-card class="q-ma-smx bg-white text-" style="border-radius: 10px;" flat>
                  <q-card-section>
                    <q-icon class="text" name="place" size="48px" color="grey-8" />
                    <h5 class="r-font-h6 q-my-md text-uppercase font-1ry">Find Us</h5>
                    <p class="text-body1" style="white-space: pre-line;">
                      {{ item.fields?.['Address'] }}
                    </p>
                  </q-card-section>
                </q-card>
              </div>

            </div>

            <!-- Map -->
            <div class="q-mt-md">

              <q-card class="q-ma-sm bg-white" style="border-radius: 10px;" flat>
                <q-card-section>

                  <iframe width="100%" height="400" frameborder="0" style="border:0" allowfullscreen
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.1808007588993!2d18.423585899999996!3d-33.910745999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc6715b38f74dd%3A0x56bfcc0d5b5bdd08!2sOrigin%20Art!5e0!3m2!1sen!2sza!4v1765308424127!5m2!1sen!2sza">
                  </iframe>

                </q-card-section>
              </q-card>


            </div>
          </div>
        </div>
      </div>



      <!-- <div class=" bg-white text- q-py-xl" id="contact">
        <div
          class="container-sm "
        >

          <h2 class="r-font-h3 text-center q-my-none text-uppercase font-1ry">
            
             Contact Us
          </h2>
        </div>
      </div>
      <div class="  bg-2ry-color" >
        <div
          class="container-sm q-py-xl"
        >

          <div class=" bg- text-dark">
            <div class="row q-col-gutter-md justify-around text-center">

              <div class="col-md-4 col-6 ">
                
                <q-card class="q-ma-sm bg-white" style="border-radius: 10px;" flat>
                  <q-card-section>
                    
                    <q-icon name="call" size="48px" color="grey-8" />
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
                    
                    <q-icon name="mail" size="48px" color="grey-8" />
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
                  
                    <q-icon name="schedule" size="48px" color="grey-8" />
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
                    <q-icon class="text" name="place" size="48px" color="grey-8" />
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


  </div>
</template>

<script>
import Home_Page from "src/models/orm-api/Home_Page";
import { createMetaMixin } from 'quasar'
import Home_Page_Items_Controller from "src/controllers/Home_Page_Items_Controller.vue";
import HomePageFeaturedArtistComp from "src/controllers/HomePageFeaturedArtistComp.vue";
import { buildSeoConfig } from "src/utils/seo";




export default {
  name: "HomeController.vue",
  components: {
    Home_Page_Items_Controller,
    HomePageFeaturedArtistComp,

  },
  // mixins: [

  //   createMetaMixin(function () {
  //     const url = window.location.origin + (this.$route?.fullPath.split('#')[0] || '/');
  //     const siteName = import.meta.env.VITE_API_SITE_TITLE;

  //     let image = ""
  //     if (this.item?.fields?.['Image']?.[0]?.url) {
  //       image = `${import.meta.env.VITE_API_PROXY_URL}/cacher/data-cache/index.php?url=${encodeURIComponent(this.item?.['Image']?.[0]?.url)}`;
  //       image = `${import.meta.env.VITE_API_PROXY_URL}/cacher/data-cache/index.php?url=${encodeURIComponent(this.item?.fields?.['Image']?.[0]?.url)}`;
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
      childLoading: false,
      item: {},
    }
  },
  computed: {

    id() {
      // return this.$route.params.rId
      return 'rec2ykH253BM2Qrsc'
    },
    superTableModel() {
      return Home_Page
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
  mounted() {
    this.fetchData();
  }
}
</script>

<style scoped></style>
