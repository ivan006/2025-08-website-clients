<template>
  <div class="container-xl q-py-xl">

    <div v-if="loading" class="text-center q-pa-xl">
      Loading...
    </div>

    <div v-else class="row q-col-gutter-xl">
      <!-- LEFT: IMAGE -->
      <div class="col-12 col-md-6 flex flex-center">
        <q-img
          :src="mainImage"
          :placeholder-src="placeholderImage"
          fit="contain"
          class="rounded-borders"
          style="max-height: 90vh; width: 100%;"
        />
      </div>
      

      <!-- RIGHT: DETAILS -->
      <div class="col-12 col-md-6 q-pl-md-lg">

        <!-- Title -->
        <div class="text-h4 font-1ry">{{ item.Title }}</div>

        <!-- Subtitle / Artist Name -->
        <div class="text-subtitle2 text-grey-7 q-mt-xs">
          {{ item['Name (from Artist)']?.[0] || '' }}
        </div>

        <!-- Specs -->
        <div class="q-mt-xl text-body2">
          <div class="row q-col-gutter-sm">

            <div class="col-5 text-grey-7">Medium</div>
            <div class="col-7">{{ medium }}</div>

            <div class="col-5 text-grey-7 q-mt-sm">Height</div>
            <div class="col-7 q-mt-sm">{{ item.Height }} cm</div>

            <div class="col-5 text-grey-7 q-mt-sm">Width</div>
            <div class="col-7 q-mt-sm">{{ item.Width }} cm</div>

            <div class="col-5 text-grey-7 q-mt-sm">Artist</div>
            <div class="col-7 q-mt-sm">
              {{ item['Name (from Artist)']?.[0] }}
            </div>

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
            <a href="https://wa.me/0987654321" style="text-decoration:none; color: inherit;">
              098&nbsp;765&nbsp;4321
            </a>
          </div>

          <!-- Enquire text -->
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


        <AlwaysMountedModal v-model="showEnquiry">
          <IframeWithLoader 
            :src="`https://airtable.com/embed/appWL8gDT9ZaqV8jY/pagdRpra8CQue8ubu/form?prefill_Artwork%20Inventory%20Number=${item['Inv Code']}`"
          />
        </AlwaysMountedModal>



      </div>
    </div>
    
  </div>
</template>

<script>
import Secondary_Page_Items from "src/models/orm-api/Secondary_Page_Items";
import IframeWithLoader from "src/controllers/IframeWithLoader.vue";
import AlwaysMountedModal from "src/controllers/AlwaysMountedModal.vue";

export default {
  name: "Artwork_Single_Controller",

  components: {
    IframeWithLoader,
    AlwaysMountedModal
  },
  data() {
    return {
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
      return Secondary_Page_Items;
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
