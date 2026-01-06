<template>
    <div class="q-pa-lg text-white" style="
      background: #1f2328;
      height: 100%;
      min-height: 420px;
    ">
        <div class="text-caption opacity-70">
            Checkout
        </div>

        <div v-if="loading" class="q-mt-lg">
            <q-spinner size="24px" />
        </div>

        <div v-else>
            <div class="text-h6 text-weight-bold q-mt-sm">
                {{ product.title }}
            </div>

            <div class="text-h4 text-weight-bold q-mt-md">
                {{ product.currency }} {{ product.price }}
            </div>

            <div class="text-caption opacity-70 q-mt-md">
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
                price: Number(item.Price || 0).toLocaleString('en-ZA', {
                    minimumFractionDigits: 2
                }),
                currency: "ZAR"
            };

        } finally {
            this.loading = false;
        }
    }
};
</script>
