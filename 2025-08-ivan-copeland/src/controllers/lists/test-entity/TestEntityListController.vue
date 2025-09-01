<template>

    <div>
        <test-entity-list
            :fetchFlags="fetchFlags"
        />
    </div>
</template>

<script>
import TestEntityList from "src/views/lists/test-entity/TestEntityList.vue";

export default {
    name: 'Brand-list-controller',
    components: {
      TestEntityList,
    },

    data() {
        return {
            parentKeyValuePair: {},
            fetchFlags: {}
        }
    },
}
</script>
