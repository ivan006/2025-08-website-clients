<template>
    <div class="q-pa-lg text-white" style="
      background: #1f2328;
      height: 100%;
      min-height: 420px;
    ">
        <div v-if="loading" class="q-mt-lg">
            <q-spinner size="24px" />
        </div>

        <div v-else>

            <!-- Checkout label -->
            <div class="text-caption text-weight-medium q-mb-xs" style="opacity: 0.75;">
                Checkout
            </div>

            <!-- Product name -->
            <div class="text-h6 text-weight-bold q-mb-xs">
                {{ product.title }}
            </div>

            <!-- Price (display-6 equivalent) -->
            <div class="text-h4 text-weight-medium q-mb-sm">
                {{ product.currency }} {{ product.price }}
            </div>

            <!-- Meta -->
            <div class="text-caption" style="opacity: 0.75;">
                Secure payment powered by PayFast
            </div>

        </div>
    </div>
</template>


<script>
import ArtworksBoundCache from 'src/models/orm-api/ArtworksBoundCache'

export default {
    name: "CheckoutProductDisplay",

    props: {
        productId: {
            type: String,
            required: true
        }
    },

    data() {
        return {
            loading: true,
            product: {
                title: "Product",
                price: "0.00",
                currency: "ZAR"
            }
        };
    },

    async mounted() {
        this.loading = true;

        try {
            const res = await ArtworksBoundCache.FetchAll([], {
                view: 'viwn7wDGK6yk5ZHOl'
            });

            const records = res.response.data.records.map(r => ({
                id: r.id,
                ...r.fields
            }));

            const item = records.find(r => r.id === this.productId);

            if (!item) return;

            this.product = {
                title: item.Title || "Product",
                price: Number(item.Price || 0)
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
                currency: "ZAR"
            };

        } finally {
            this.loading = false;
        }
    }
};
</script>
