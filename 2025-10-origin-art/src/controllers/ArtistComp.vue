<template>
  <div class="container-xl q-py-xl">

    <!-- LOADING -->
    <div v-if="loading" class="text-center q-pa-xl">
      Loading...
    </div>

    <!-- PAGE -->
    <div v-else class="row q-col-gutter-xl">
      
      <!-- =============== LEFT: MAIN IMAGE =============== -->
      <div class="col-12 col-md-6 flex flex-center">
        <q-img
          :src="mainImage"
          :placeholder-src="placeholderImage"
          fit="contain"
          class="rounded-borders"
          style="width: 100%; height: 600px;"
        />
      </div>


      <!-- =============== RIGHT: ARTIST DETAILS =============== -->
      <div class="col-12 col-md-6 q-pl-md-lg">

        <!-- Artist Name -->
        <div class="text-h4 font-1ry">
          {{ item.Name }}
        </div>

        <!-- Average Price -->
        <div class="text-h6 q-mt-sm">
          Average Price:
          R{{ Number(item['Av. Price']).toLocaleString('en-ZA') }}
        </div>

        <!-- Price Tier -->
        <div class="text-subtitle2 text-grey-7">
          Tier: {{ item['Av. Price Tier'] }}
        </div>


        <!-- CONTACT SECTION -->
        <div class="q-mt-xl text-body1">

          <strong>Interested in this artist's work?</strong>

          <div class="q-mt-sm">
            Contact us on the number below.
          </div>

          <!-- Phone Box -->
          <div 
            class="q-mt-sm q-pa-sm rounded-borders"
            style="
              border: 1px solid rgba(0,0,0,0.15);
              font-size: 1.1rem;
              user-select: text;
              display: inline-block;
            "
          >
            <a href="https://wa.me/0987654321" style="text-decoration:none; color: inherit;">
              098&nbsp;765&nbsp;4321
            </a>
          </div>

          <!-- Enquiry Button -->
          <div class="q-mt-lg">
            Or send an enquiry using the button below.
          </div>

          <q-btn 
            class="q-mt-md"
            color="primary"
            label="Enquire Now"
            @click="showEnquiry = true"
          />

        </div>

        <!-- Enquiry Modal -->
        <AlwaysMountedModal v-model="showEnquiry">
          <IframeWithLoader 
            :src="`https://airtable.com/embed/appWL8gDT9ZaqV8jY/pagdRpra8CQue8ubu/form?prefill_Artist=${encodeURIComponent(item.Name)}`"
          />
        </AlwaysMountedModal>

      </div>


    </div>
    
      
    <ArtistArtworks  />

  </div>
</template>



<script>
import Artists from "src/models/orm-api/Artists";
import IframeWithLoader from "src/controllers/IframeWithLoader.vue";
import AlwaysMountedModal from "src/controllers/AlwaysMountedModal.vue";
import ArtistArtworks from "src/controllers/ArtistArtworks.vue";

export default {
  name: "ArtistComp",

  components: {
    IframeWithLoader,
    AlwaysMountedModal,
    ArtistArtworks,
  },

  data() {
    return {
      loading: true,
      item: {},
      showEnquiry: false,
    };
  },

  computed: {
    id() {
      return this.$route.params.rId;
    },

    superTableModel() {
      return Artists;
    },

    mainImage() {
      const att = this.item.Attachments?.[0];
      return att?.thumbnails?.large?.url
        ? `https://capetownlists.co.za/?url=${encodeURIComponent(att.thumbnails.large.url)}`
        : "";
    },

    placeholderImage() {
      const att = this.item.Attachments?.[0];
      return att?.thumbnails?.small?.url
        ? `https://capetownlists.co.za/?url=${encodeURIComponent(att.thumbnails.small.url)}`
        : "";
    },
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
