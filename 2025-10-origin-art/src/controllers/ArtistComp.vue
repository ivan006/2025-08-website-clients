<template>
  <div class=" q-pt-md ">
    <div v-if="loading" class="text-center q-pa-xl">
      Loading...
    </div>

    <div v-else>
      
      <SEODataViewer :seoConfig="seoConfigMasked" :seoLdJson="seoLdJson" />
      <div class="container-sm">

        <!-- =============== CENTERED ARTIST HEADER =============== -->
        <div class="column items-center text-center q-mb-md">

          <div class="row justify-center">
            <div class="col-12 col-md-8">
            
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
              <div class="text-h4 font-1ry q-mt-md">
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

              <div class="row items-center justify-center q-mt-sm">
                <!-- <div class="text-grey-7 text-caption q-mr-sm" style="min-width: 90px;">
                  Media:
                </div> -->

                <div class="row q-gutter-sm">
                  <q-badge
                    v-for="m in prettyMedia"
                    :key="m"
                    color="grey-7"
                    text-color="white"
                    class="q-py-xs q-px-sm"
                    style="font-size: 0.75rem; border-radius: 4px;"
                  >
                    {{ m }}
                  </q-badge>
                </div>
              </div>

            </div>
            <!-- Artist Statement -->
            <div v-if="item['artist:artist_statement']" class="col-12 col-md-8">

              <h3 class="text-h6 font-1ry q-mb-sm">Artist Statement</h3>

              <div class="text-body1" style="white-space: pre-line;">
                {{ truncate(item['artist:artist_statement'], 500) }}
              </div>

              <q-btn
                v-if="isLong(item['artist:artist_statement'], 500)"
                flat
                label="Read More"
                class="q-mt-sm bg-dark text-white"
                size="small"
                @click="openDialog('Artist Statement', item['artist:artist_statement'])"
              />
            </div>

            <!-- Biography -->
            <div v-if="item['artist:biography']" class="col-12 col-md-8">
              <h3 class="text-h6 font-1ry q-mb-sm">Biography</h3>

              <div class="text-body1" style="white-space: pre-line;">
                {{ truncate(item['artist:biography'], 500) }}
              </div>

              <q-btn
                v-if="isLong(item['artist:biography'], 500)"
                flat label="Read More"
                class="q-mt-sm bg-dark text-white"
                size="small"
                @click="openDialog('Biography', item['artist:biography'])"
              />
            </div>

            <!-- Influences -->
            <div v-if="item['artist:influences']" class="col-12 col-md-8">
              <h3 class="text-h6 font-1ry q-mb-sm">Influences</h3>

              <div class="text-body1" style="white-space: pre-line;">
                {{ truncate(item['artist:influences'], 500) }}
              </div>

              <q-btn
                v-if="isLong(item['artist:influences'], 500)"
                flat label="Read More"
                class="q-mt-sm bg-dark text-white"
                size="small"
                @click="openDialog('Influences', item['artist:influences'])"
              />
            </div>

            <!-- Awards -->
            <div v-if="item['artist:awards']" class="col-12 col-md-8">
              <h3 class="text-h6 font-1ry q-mb-sm">Awards</h3>

              <div class="text-body1" style="white-space: pre-line;">
                {{ truncate(item['artist:awards'], 500) }}
              </div>

              <q-btn
                v-if="isLong(item['artist:awards'], 500)"
                flat label="Read More"
                class="q-mt-sm bg-dark text-white"
                size="small"
                @click="openDialog('Awards', item['artist:awards'])"
              />
            </div>

            <!-- Commissions -->
            <div v-if="item['artist:comm_accepted']" class="col-12 col-md-8">
              <h3 class="text-h6 font-1ry q-mb-sm">Commissions</h3>

              <div class="text-body1" style="white-space: pre-line;">
                {{ truncate(item['artist:comm_accepted'], 500) }}
              </div>

              <q-btn
                v-if="isLong(item['artist:comm_accepted'], 500)"
                flat label="Read More"
                class="q-mt-sm bg-dark text-white"
                size="small"
                @click="openDialog('Commissions', item['artist:comm_accepted'])"
              />
            </div>

            <!-- FULL TEXT DIALOG -->
            <q-dialog v-model="dialogOpen">
              <q-card style="max-width: 700px; width: 90%;">
                <q-card-section>
                  <div class="text-h6 q-mb-md">{{ dialogTitle }}</div>
                  <div class="text-body1" style="white-space: pre-line;">
                    {{ dialogText }}
                  </div>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat label="Close" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>



        </div>
      </div>

      
      
      <ArtistArtworks :parentId="id" />
      <!-- <div class="text-1ry-color">
        
      </div> -->

    </div>

  </div>
</template>






<script>
import Artists from "src/models/orm-api/Artists";
import ArtistArtworks from "src/controllers/ArtistArtworks.vue";
import SEODataViewer from "src/controllers/SEODataViewer.vue";
import { createMetaMixin } from 'quasar'
import { buildSchemaItem, buildSeoConfig } from 'src/utils/seo'

export default {
  name: "ArtistComp",

  components: {
    ArtistArtworks,
    SEODataViewer,
  },


  mixins: [createMetaMixin(function () { return this.seoConfig })],
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

    superTableModel() {
      return Artists;
    },

    mainImage() {
      const att = this.item.Attachments?.[0];
      return att?.thumbnails?.large?.url
        ? `${import.meta.env.VITE_API_PROXY_URL}${encodeURIComponent(att.thumbnails.large.url)}`
        : "";
    },

    placeholderImage() {
      const att = this.item.Attachments?.[0];
      return att?.thumbnails?.small?.url
        ? `${import.meta.env.VITE_API_PROXY_URL}${encodeURIComponent(att.thumbnails.small.url)}`
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
    },
    
    
    seoLdJson(){
      const url = window.location.origin + (this.$route?.fullPath.split('#')[0] || '/');
      const siteName = import.meta.env.VITE_API_SITE_TITLE;

      let image = import.meta.env.VITE_API_DEFAULT_IMAGE
      if (this.mainImage) {
        image = this.mainImage;
      }


      const schema = buildSchemaItem({
        type: this.item?.['SEO Type'],
        name: this.item?.['Name'] || siteName,
        description: this.item?.['artist:artist_statement'] ? this.truncate(this.item?.['artist:artist_statement'], 500) : "",
        url,
        image,
        extras: {
        }
      })



      return schema;
    },
    seoConfig(){

      const url = window.location.origin + (this.$route?.fullPath.split('#')[0] || '/');
      const siteName = import.meta.env.VITE_API_SITE_TITLE;


      let image = import.meta.env.VITE_API_DEFAULT_IMAGE
      if (this.mainImage) {
        image = this.mainImage;
      }

      return buildSeoConfig({
          title: this.item?.['Name'],
          description: this.item?.['artist:artist_statement'] ? this.truncate(this.item?.['artist:artist_statement'], 500) : "",
          url,
          image: image || `${window.location.origin}/og-default.jpg`,
          siteName,
          type: "Person",
          schema: this.seoLdJson
        });
    },

    seoConfigMasked() {
      const c = { ...this.seoConfig }
      c.script = ''
      return c
    }
  },

  methods: {
    truncate(text, limit = 1000) {
      if (!text) return "";
      return text.length > limit ? text.slice(0, limit) + "..." : text;
    },

    isLong(text, limit = 1000) {
      return text && text.length > limit;
    },

    openDialog(title, fullText) {
      this.dialogTitle = title;
      this.dialogText = fullText;
      this.dialogOpen = true;
    },
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
