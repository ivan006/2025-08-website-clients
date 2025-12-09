<template>
  <div class=" q-py-md ">
    <div v-if="loading" class="text-center q-pa-xl">
      Loading...
    </div>

    <div v-else>
      
      <div class="container-xl">

        <!-- =============== CENTERED ARTIST HEADER =============== -->
        <div class="column items-center text-center q-mb-md">

          <!-- Avatar -->

          <q-img
            :src="mainImage"
            :placeholder-src="placeholderImage"
            ratio="1"
            :alt="item.Name"
            style="width: 180px;"
            fit="contain"
          />
          <!-- 
            fit="cover"
            fit="contain"
          -->
          <!-- Name -->
          <div class="text-h5 font-1ry q-mt-md">
            {{ item.Name }}
          </div>

          <!-- ARTIST LEVEL (label on left) -->
          <!-- <div class="row items-center q-mt-sm">
            <div class="text-grey-7 text-caption q-mr-sm" style="min-width: 90px;">
              Artist Level:
            </div>

            <q-badge
              class="q-py-xs q-px-sm"
              :style="prettyTierStyle + '; font-size: 0.8rem; border-radius: 4px;'"
            >
              {{ prettyTier }}
            </q-badge>
          </div> -->

          <!-- ARTIST TYPE (multiple badges) -->
          <div class="row items-center q-mt-sm">
            <!-- <div class="text-grey-7 text-caption q-mr-sm" style="min-width: 90px;">
              Media:
            </div> -->

            <div class="row q-gutter-sm">
              <q-badge
                v-for="m in prettyMedia"
                :key="m"
                color="primary"
                text-color="white"
                class="q-py-xs q-px-sm"
                style="font-size: 0.75rem; border-radius: 4px;"
              >
                {{ m }}
              </q-badge>
            </div>
          </div>



        </div>
      </div>

      <q-separator class="q-my-md" />
      
      
      <ArtistArtworks :artistName="item.Name" />
      <!-- <div class="text-1ry-color">
        
      </div> -->

    </div>

  </div>
</template>






<script>
import Artists from "src/models/orm-api/Artists";
import ArtistArtworks from "src/controllers/ArtistArtworks.vue";

export default {
  name: "ArtistComp",

  components: {
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
    
    mediaLabelMap() {
      return {
        'Fine Art': 'Fine Artist',
        'Sculptural Works': 'Sculptor',
        'New Media': 'New Media Artist',
        'Merch Art': 'Merch Artist'
      }
    },

    tierLabelMap() {
      return {
        'Gold': 'Established Artist',
        'Silver': 'Mid-Career Artist',
        'Bronze': 'Emerging Artist'
      }
    },

    
    tierGradientMap() {
      return {
        'Gold': 'background: linear-gradient(135deg, #F7D774, #DDAF3A); ',
        'Silver': 'background: linear-gradient(135deg, #DCDCDC, #AFAFAF); ',
        'Bronze': 'background: linear-gradient(135deg, #D6A77A, #A16B34); '
      }
    },

    prettyTierStyle() {
      const t = this.item['Av. Price Tier']
      return this.tierGradientMap[t] || ''
    },

    prettyMedia() {
      const arr = this.item.Media || []
      return arr.map(m => this.mediaLabelMap[m] || m)
    },

    prettyTier() {
      const t = this.item['Av. Price Tier']
      return this.tierLabelMap[t] || t
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
