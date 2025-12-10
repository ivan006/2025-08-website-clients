<template>
  <div class="container-sm q-py-lg">

    <div v-if="loading" class="text-center q-pa-xl">
      Loading...
    </div>

    <div v-else class="row q-col-gutter-xl">
      <!-- LEFT: IMAGE -->
      <div class="col-12 col-md-6 flex flex-centerx">
        <q-img
          :src="mainImage"
          :placeholder-src="placeholderImage"
          fit="contain"
          class="rounded-borders cursor-pointer"
          :style="{ height: cardHeight }"
          @click="showDialog = true"
        />
        
        <!-- DIALOG -->
        <!-- <q-dialog v-model="showDialog" persistentx>
          <q-card style="max-width: 90vw; max-height: 90vh;">
            <q-img
              :src="mainImage"
              fit="contain"
              style="max-height: 90vh;"
            />
            
          </q-card>
        </q-dialog> -->

        
          <!-- FULL TEXT DIALOG -->
          <q-dialog v-model="showDialog" class="no-padding-dialog">
            <q-card style="max-width: 700px; width: 90%;">
              <q-card-section class="q-pa-none">
                <q-img
                  :src="mainImage"
                  fit="contain"
                  style="max-height: 90vh;"
                />
              </q-card-section>

              <!-- <q-card-actions align="right">
                <q-btn flat label="Close" v-close-popup />
              </q-card-actions> -->
            </q-card>
          </q-dialog>
          <!-- style="background-color: #EEE;" -->
          <!-- style="width: 100%; height: 600px;" -->
      </div>
      

      <!-- RIGHT: DETAILS -->
      <div class="col-12 col-md-6 q-pl-md-lg">

        <!-- Title -->
        <div class="text-h4 font-1ry">{{ item.Title }}</div>

        <!-- Artist -->
        <!-- <div class="text-subtitle2 text-grey-7 q-mt-xs">
          {{ item['Name (from Artist)']?.[0] || '' }}
        </div> -->
        
        <router-link
          :to="`/artists/`+item.Artist[0]+`/`+item['Name (from Artist)']"
          class="text-subtitle2 text-grey-7 q-mt-xs"
        >
          {{ item['Name (from Artist)']?.[0] || '' }}
        </router-link>

        <!-- Price -->
        <div class="text-h6 text-weight-bold q-mt-sm">
          R{{ Number(item.Price).toLocaleString('en-ZA', { minimumFractionDigits: 2 }) }}

        </div>

        <!-- Specs -->
        <div class="q-mt-xl text-body2">
          <div class="row q-col-gutter-sm">

            <div class="col-5 text-grey-7">Medium</div>
            <div class="col-7">{{ medium }}</div>

            <div class="col-5 text-grey-7">Materials</div>
            <div class="col-7">
              {{ Array.isArray(item['Name (from Materials)'])
                  ? item['Name (from Materials)'].join(', ')
                  : item['Name (from Materials)'] || '-' }}
            </div>

            <div class="col-5 text-grey-7">Availability</div>
            <div class="col-7 q-mt-sm">
              
              <q-badge
                transparent
                align="middle"
                size="sm"
                class="bg-grey-7 text-white"
              >
                {{ item.Status }}
              </q-badge>
            </div>


            <div class="col-5 text-grey-7 q-mt-sm">Height</div>
            <div class="col-7 q-mt-sm">{{ item.Height }} cm</div>

            <div class="col-5 text-grey-7 q-mt-sm">Width</div>
            <div class="col-7 q-mt-sm">{{ item.Width }} cm</div>

            <div class="col-5 text-grey-7 q-mt-sm">Year</div>
            <div class="col-7 q-mt-sm">{{ item.Year }}</div>

            <div class="col-5 text-grey-7 q-mt-sm">Inventory Code</div>
            <div class="col-7 q-mt-sm">{{ item['Inv Code'] }}</div>

          </div>
        </div>


        <div class="q-mt-xl  text-body1">

          <strong>Interested in this artwork?</strong>

          <!-- WhatsApp text -->
          <div class="q-mt-sm">
            Contact us on the number below.
          </div>

          <div 
            class="q-mt-sm q-pa-sm rounded-borders"
            style="
              border: 1px solid rgba(0,0,0,0.15);
              font-size: 1.1rem;
              user-select: text;
              display: inline-block;
            "
          >
            <a href="https://wa.me/+27826009693" style="text-decoration:none; color: inherit;">
              +27 82 600 9693
            </a>
          </div>

          <!-- Enquire text -->
          <div class="q-mt-lg">
            Or send an enquiry using the button below.
          </div>

          <q-btn 
            class="q-mt-md"
            color="dark"
            label="Enquire Now"
            @click="showEnquiry = true"
          />

        </div>


        <AlwaysMountedModal v-model="showEnquiry">
          <IframeWithLoader 
            :src="`https://airtable.com/embed/appWL8gDT9ZaqV8jY/pagdRpra8CQue8ubu/form?prefill_Artwork%20Inventory%20Number=${item['Inv Code']}`"
          />
          <!-- <IframeWithLoader 
            :src="`https://airtable.com/embed/appWL8gDT9ZaqV8jY/pagdRpra8CQue8ubu/form?prefill_Artwork=${id}`"
          /> -->
        </AlwaysMountedModal>



      </div>
    </div>
    
  </div>
</template>

<script>
import Artworks from "src/models/orm-api/Artworks";
import IframeWithLoader from "src/controllers/IframeWithLoader.vue";
import AlwaysMountedModal from "src/controllers/AlwaysMountedModal.vue";

export default {
  name: "ArtworkComp",

  components: {
    IframeWithLoader,
    AlwaysMountedModal
  },
  data() {
    return {
      showDialog: false,
      loading: true,
      item: {},
      showEnquiry: false,
      dialogueVModel: true,
    };
  },

  computed: {
    id() {
      return this.$route.params.rId;
    },

    superTableModel() {
      return Artworks;
    },

    medium() {
      return this.item["Name (from Medium)"]?.[0] ||
             this.item["Medium"]?.[0] ||
             "";
    },

    mainImage() {
      const att = this.item.Attachments?.[0];
      return att?.thumbnails?.large?.url
        ? `https://capetownlists.co.za/?url=${encodeURIComponent(att.thumbnails.large.url)}`
        : this.item["Image Url"] || "";
    },

    placeholderImage() {
      const att = this.item.Attachments?.[0];
      return att?.thumbnails?.small?.url
        ? `https://capetownlists.co.za/?url=${encodeURIComponent(att.thumbnails.small.url)}`
        : "";
    },
    
    cardHeight() {
      return this.$q.screen.lt.md ? "350px" : "600px";
    }
  },

  methods: {
    fetchData() {
      this.loading = true;

      this.superTableModel
        .FetchById(this.id, [], { flags: {}, moreHeaders: {}, rels: [] })
        .then((res) => {
          this.item = res.response.data.fields;
          this.loading = false;
        })
        .catch(() => (this.loading = false));
    },
  },

  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 4px;
}
</style>
