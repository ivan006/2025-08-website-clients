<template>
    <div class="q-pa-lg text-white" style="
      background: #1f2328;
      height: 100%;
      min-height: 420px;
    ">

        <!-- Checkout label -->
        <div class="text-caption text-weight-medium q-mb-xs" style="opacity: 0.75;">
            Checkout
        </div>

        <!-- Product name -->
        <div class="text-h6 text-weight-bold q-mb-xs">
            {{ product.Title }}
        </div>

        <!-- Price (display-6 equivalent) -->
        <div class="text-h4 text-weight-medium q-mb-sm">
            ZAR {{ currency(product.Price) }}
        </div>

        <!-- Meta -->
        <div class="text-caption" style="opacity: 0.75;">
            Secure payment powered by PayFast
        </div>

    </div>
</template>


<script>

export default {
    name: "CheckoutProductDisplay",

    props: {
        // productId: {
        //     type: String,
        //     required: true
        // },
        product: {
            type: String,
            required: true
        }
    },

    data() {
        return {
        };
    },
    methods: {
        currency(price) {
            return Number(price || 0)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
        }
    }
};
</script>
