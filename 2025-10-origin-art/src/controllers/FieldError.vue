<template>
    <div>

        <div v-if="errors.length" class="text-negative text-caption q-mt-xsx text-center" role="alert">
            <div v-for="(err, i) in errors" :key="i">
                {{ err }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FieldError',

    props: {
        errors: {
            type: Array,
            default: () => []
        }
    }
}
</script>
