<template>
  <div class=" q-pt-md ">
    <div v-if="loading" class="text-center q-pa-xl">
      Loading...
    </div>

    <div v-else>
      
      <div class="container-sm">

        <!-- =============== CENTERED ARTIST HEADER =============== -->
        <div class="columnx items-center text-center q-mb-md">

          <div class="row justify-center">
            <div class="col-12 col-md-8">
            
              <!-- Avatar -->

              <!-- 
                fit="cover"
                fit="contain"
              -->
              <!-- Name -->
              <div class="text-h4 font-1ry q-mt-md">
                {{ item.fields.Title }}
              </div> 

            </div>

          </div>
        </div>
      </div>
      
      <CollectionArtworks :parentId="id" />
      <!-- <div class="text-1ry-color">
        
      </div> -->

    </div>

  </div>
</template>


<script>
import Collections from 'src/models/orm-api/Collections'
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


    // async fetchData() {
    //   // console.time('[ArtistSingle] fetchData total')
    //   this.loading = true

    //   try {
    //     // 1️⃣ Load bound cache (once)
    //     // console.time('[ArtistSingle] Load bound cache')
    //     if (!this.allRecords?.length) {
    //       const res = await Collections.FetchAll()
    //       this.allRecords = res.response.data.records.map(r => ({
    //         id: r.id,
    //         ...r.fields
    //       }))
    //     }
    //     // console.timeEnd('[ArtistSingle] Load bound cache')

    //     // 2️⃣ Find artist locally
    //     // console.time('[ArtistSingle] Find artist')
    //     const artist = this.allRecords.find(r => r.id === this.id)
    //     // console.timeEnd('[ArtistSingle] Find artist')

    //     if (!artist) {
    //       throw new Error(`Artist ${this.id} not found in bound cache`)
    //     }

    //     // 3️⃣ Assign
    //     this.item = artist

    //   } catch (err) {
    //     console.error('❌ Failed to load artist:', err)
    //   }

    //   this.loading = false
    //   // console.timeEnd('[ArtistSingle] fetchData total')
    // },
    
    fetchData() {
      this.loading = true
      Collections
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
  },
};
</script>


