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
    class="ScaledParent "
  >
    <template v-if="loading">
      <div class="text-center q-pa-xl">Loading...</div>
    </template>
    <template v-else>

      <div class="q-py-xl">

        <div
          class="container-md"
        >
          <div class="row q-col-gutter-md  text-white">


            <!--<div class="col-xl-1 col-md-1 col-sm-12 col-xs-12">-->


            <!--</div>-->

            <div class="col-xl-10 col-md-10 col-sm-12 col-xs-12 offset-md-1 q-px-xl flex flex-center " style="min-height: 500px;">


              <div>
                <div class="gt-sm">
                  <h1 class="text-center text-h1 text-bold">
                  <span class="text-weight-thin font-1ry text-uppercase" style="letter-spacing: 15px;">
                    {{item.fields?.['Title']}}
                  </span>
                  </h1>
                </div>
                <div class="lt-md">
                  <h1 class="text-center text-h2 text-bold">
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

              <!--<div class="gt-sm">-->
              <!--</div>-->
              <!--<div class="lt-md">-->
              <!--</div>-->

              <!--<pre>{{item}}</pre>-->
            </div>
          </div>
        </div>
      </div>

      <div class=" bg-3ry- bg-white" style="padding-top: 100px; padding-bottom: 100px;">
        <div
          class="container-md "
        >

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



  </div>
</template>

<script>
import Contact from "src/models/orm-api/Contact";
// import Tertiary_Page_Items_Controller from "src/controllers/Tertiary_Page_Items_Controller.vue";

export default {
  name: "Contact_Controller",
  components: {
    // Tertiary_Page_Items_Controller
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
      return 'recSez68qeQbE22j5'
    },
    superTableModel() {
      return Contact
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
