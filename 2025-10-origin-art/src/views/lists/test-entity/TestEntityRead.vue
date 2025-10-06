<template>
  <div>
    <!--{{$route.params.rId}}-->

    <!--<SuperRecord-->
    <!--  :model="superRecordModel"-->
    <!--  :id="$route.params.rId"-->
    <!--  :displayMapField="true"-->
    <!--  @initialLoadHappened="$emit('initialLoadHappened')"-->
    <!--&gt;-->
    <!--</SuperRecord>-->
  </div>
</template>

<script>
// import { SuperRecord } from 'wizweb-fe'
import TestEntity from 'src/models/orm-api/TestEntity'

export default {
  name: 'TestEntityRead',
  // components: { SuperRecord },

  props: {
  },
  data(){
    return {
      loading: true,
      item: {},
    }
  },
  computed: {

    id() {
      return this.$route.params.rId
    },
    superTableModel() {
      return TestEntity
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

          this.item = response.response.data.data
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

<style scoped></style>
