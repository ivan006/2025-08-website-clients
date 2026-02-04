<template>
  <div class="">
    <div v-if="loading" class="text-center q-pa-xl">Loading...</div>

    <div v-else>
      <!-- <div class="container-sm">

        <div class="columnx items-center text-center q-mb-md">

          <div class="row justify-center">
            <div class="col-12 col-md-8">
            
   
              <div class="text-h4 font-1ry q-mt-md">
                {{ item.fields.Title }}
              </div> 

            </div>
 
          </div>
        </div>
      </div> -->
      <!-- COVER PAGE -->
      <section
        v-if="item.fields?.Heading"
        class="column items-center justify-center"
        style="
          position: relative;
          width: 210mm;
          height: 297mm;
          padding: 25mm 20mm;
          box-sizing: border-box;
          page-break-after: always;
          background: white;
        "
      >
        <!-- IMAGE -->
        <div
          v-if="item.fields?.Image?.[0]"
          class="column items-center justify-center"
          style="height: 160mm; margin-bottom: 15mm"
        >
          <img
            :src="`${$apiProxyUrl}${encodeURIComponent(
              item.fields.Image[0].url,
            )}`"
            style="max-height: 100%; max-width: 100%; object-fit: contain"
          />
        </div>

        <!-- HEADING -->
        <div class="text-h4 font-1ry text-center q-mb-md">
          {{ item.fields.Heading }}
        </div>

        <!-- BODY TEXT -->
        <div
          v-if="item.fields?.['Body Text']"
          class="text-body1 text-center"
          style="white-space: pre-line; max-width: 140mm; opacity: 0.85"
        >
          {{ item.fields["Body Text"] }}
        </div>
      </section>
      <pre> {{ item }}</pre>
      <CollectionArtworks :parent="item" />
      <!-- <div class="text-1ry-color">
        
      </div> -->
    </div>
  </div>
</template>

<script>
import Collections from "src/models/orm-api/Collections";
import CollectionArtworks from "src/controllers/CollectionArtworks.vue";

export default {
  name: "CollectionComp",

  components: {
    CollectionArtworks,
  },

  data() {
    return {
      loading: true,
      item: {},
      showEnquiry: false,
      dialogOpen: false,
      dialogText: "",
      dialogTitle: "",
    };
  },

  computed: {
    id() {
      return this.$route.params.rId;
    },
  },

  methods: {
    fetchData() {
      this.loading = true;
      Collections.FetchById(this.id)
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
