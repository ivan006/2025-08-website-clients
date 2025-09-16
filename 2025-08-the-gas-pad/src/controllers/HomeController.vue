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
    padding-top: 0px;
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
                  <h1 class="text-center text-h2 font-1ry">
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
                  <h2 class="text-center text-h4 text-bold font-2ry">
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

      <!-- <div class="bg-white q-py-lg " >
        <div
          class="container-md "
        >


            <h3 class="text-center text-h2 font-1ry text-uppercas">
              {{item.fields?.['List Section Title']}}
            </h3>
        </div>
      </div> -->

      <!--<div class="q-py-xl">-->

      <!--  <div-->
      <!--    class="container-md"-->
      <!--  >-->
      <!--    <div class="row q-col-gutter-md">-->


      <!--      &lt;!&ndash;<div class="col-xl-1 col-md-1 col-sm-12 col-xs-12">&ndash;&gt;-->


      <!--      &lt;!&ndash;</div>&ndash;&gt;-->

      <!--      <div class="col-xl-10 col-md-10 col-sm-12 col-xs-12 offset-md-1 q-px-xl">-->


      <!--        <div class="gt-sm">-->
      <!--          <h3 class="text-center text-h2 text-bold">-->
      <!--            {{item.fields?.['List Section Title']}}-->
      <!--          </h3>-->
      <!--        </div>-->
      <!--        <div class="lt-md">-->
      <!--          <h3 class="text-center text-h3 text-bold">-->
      <!--            {{item.fields?.['List Section Title']}}-->
      <!--          </h3>-->
      <!--        </div>-->

      <!--        &lt;!&ndash;<div class="gt-sm">&ndash;&gt;-->
      <!--        &lt;!&ndash;</div>&ndash;&gt;-->
      <!--        &lt;!&ndash;<div class="lt-md">&ndash;&gt;-->
      <!--        &lt;!&ndash;</div>&ndash;&gt;-->

      <!--        &lt;!&ndash;<pre>{{item}}</pre>&ndash;&gt;-->
      <!--      </div>-->
      <!--    </div>-->
      <!--  </div>-->
      <!--</div>-->



      <div class="bg-white" >
        <div
          class="container-md q-py-xl"
        >
          <h3 class="text-center text-h3 font-1ry text-uppercase  q-my-xl">
            {{item.fields?.['List Section Title']}}
          </h3>

          <Home_Page_Items_Controller />
        </div>
      </div>

      <!-- <div class=" bg-3ry-color text-white">
        <div class="row">

          <div
            class="col-xl-6 col-md-6 col-sm-12 col-xs-12"
          >

         

            <img
              :src="this.item.fields?.['Contact Image']?.[0]?.url ? `https://capetownlists.co.za/?url=${this.item.fields?.['Contact Image']?.[0]?.url}` : ''"
              style="
                width: 100%; display: block;
                -webkit-filter: grayscale(100%);
                filter:  brightness(120%);
              "
            >

          </div>
          <div class="col-xl-6 col-md-6 col-sm-12 col-xs-12  " >
            <div class="row full-height items-center q-py-lg q-px-xl ">

              <div class=""  id="contact1">



                <h2 class="text-h3 text-bold ">

                  {{item.fields?.['Contact Title']}}
                </h2>

                <div class=" text-h5 q-pb-xl">

                  {{item.fields?.['Contact Email Address']}}
                </div>
                
                <div class="q-pa-lg bg- text-dark">
                  <div class="row q-col-gutter-xl justify-around text-center">

                    <div class="col-12 col-md-6">
                      
                      <q-card class="q-ma-sm bg-grey-3" style="border-radius: 10px;" flat>
                        <q-card-section>
                          
                          <q-icon name="call" size="48px" color="green" />
                          <h5 class="q-mt-sm">Call Us</h5>
                          <p class="q-mt-xs">+27 21 123 4567</p>
                        </q-card-section>
                      </q-card>
                    </div>

                    <div class="col-12 col-md-6">
                      
                      <q-card class="q-ma-sm bg-grey-3" style="border-radius: 10px;" flat>
                        <q-card-section>
                        
                          <q-icon name="schedule" size="48px" color="green" />
                          <h5 class="q-mt-sm">Opening Hours</h5>
                          <p class="q-mt-xs">Monday to Saturday<br>11:00 PM – 5:00 AM</p>
                        </q-card-section>
                      </q-card>
                    </div>

             
                  </div>
                </div>

                

              </div>
            </div>

          </div>
        </div>


      </div> -->
      <div class=" bg-3ry- bg-2ry-color" id="contact" >
        <div
          class="container-md q-py-xl"
        >
          <h3 class="text-center text-h3 font-1ry text-uppercase  q-my-xl text-">
            <!-- {{item.fields?.['List Section Title']}} -->
             Contact Us
          </h3>

          <!-- <Tertiary_Page_Items_Controller :parent="this.item" /> -->
          <div class="q-pa-lg bg- text-dark">
            <div class="row q-col-gutter-xl justify-around text-center">

              <!-- Phone -->
              <div class="col-12 col-md-4">
                
                <q-card class="q-ma-sm bg-grey-3" style="border-radius: 10px;" flat>
                  <q-card-section>
                    
                    <q-icon name="call" size="48px" color="green" />
                    <h5 class="q-mt-sm">Call Us</h5>
                    <p class="q-mt-xs">+27 21 123 4567</p>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Opening Hours -->
              <div class="col-12 col-md-4">
                
                <q-card class="q-ma-sm bg-grey-3" style="border-radius: 10px;" flat>
                  <q-card-section>
                  
                    <q-icon name="schedule" size="48px" color="green" />
                    <h5 class="q-mt-sm">Opening Hours</h5>
                    <p class="q-mt-xs">Monday to Saturday<br>11:00 PM – 5:00 AM</p>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Address & Directions -->
              <div class="col-12 col-md-4">
                
                <q-card class="q-ma-sm bg-grey-3 text-" style="border-radius: 10px;" flat >
                  <q-card-section>
                    <q-icon class="text" name="place" size="48px" color="green" />
                    <h5 class="q-mt-sm">Find Us</h5>
                    <p class="q-mt-xs">123 Main Road, Cape Town<br>(see map below 👇)</p>
                  </q-card-section>
                </q-card>
              </div>

              </div>

            <!-- Map -->
            <div class="q-mt-xl">
              
              <q-card class="q-ma-sm bg-grey-3" style="border-radius: 10px;" flat>
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
      </div>
    </template>
    <!--<HomeSEOController />-->


  </div>
</template>

<script>
import Home_Page from "src/models/orm-api/Home_Page";
import { createMetaMixin } from 'quasar'
import HomeSEOController from "src/controllers/HomeSEOController.vue";
import Home_Page_Items_Controller from "src/controllers/Home_Page_Items_Controller.vue";
import {buildSeoConfig} from "src/utils/seo";




export default {
  name: "HomeController.vue",
  components: {Home_Page_Items_Controller},
  mixins: [

    createMetaMixin(function () {
      const url = window.location.origin + (this.$route?.fullPath || '/');
      const siteName = import.meta.env.VITE_API_SITE_TITLE;

      let image = ""
      if (this.item?.fields?.['Image']?.[0]?.url) {
        image = `https://capetownlists.co.za/?url=${this.item?.['Image']?.[0]?.url}`;
        image = `https://capetownlists.co.za/?url=${this.item?.fields?.['Image']?.[0]?.url}`;
      }

      return buildSeoConfig({
        title: this.item.fields?.['Title'] || siteName,
        description: this.item.fields?.['Subtitle'] || '',
        url,
        image: image || `${window.location.origin}/og-default.jpg`,
        siteName,
        type: this.item.fields?.['SEO Type'],
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
      // return this.$route.params.rId
      return 'recoIS6KWZ2aqcBJT'
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
  mounted(){
    this.fetchData();
  }
}
</script>

<style scoped>

</style>
