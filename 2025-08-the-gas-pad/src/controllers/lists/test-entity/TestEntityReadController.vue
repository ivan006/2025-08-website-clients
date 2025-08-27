<template>

    <div>
        <q-card class="q-mb-md">
            <TestEntityRead :id="id" />
        </q-card>
    </div>
</template>

<script>
import TestEntityRead from 'src/views/lists/test-entity/TestEntityRead.vue'

export default {
    name: 'TestEntityRead-controller',
    components: {
      TestEntityRead,
    },

    data() {
        return {
            id: +this.$route.params.rId
        }
    },
}
</script>
