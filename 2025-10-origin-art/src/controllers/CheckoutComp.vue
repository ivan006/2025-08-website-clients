<template>
    <div class="q-pa-md">

        <div class="q-mx-auto" style="max-width: 520px;">
            <div class="q-pa-md q-gutter-md">

                <div class="text-h6">Checkout</div>

                <!-- Delivery / Contact -->
                <q-input v-model="form.delivery_name" label="Full name" outlined dense />
                <q-input v-model="form.delivery_email" label="Email" type="email" outlined dense />
                <q-input v-model="form.delivery_phone" label="Phone (optional)" outlined dense />

                <!-- Address -->
                <q-input v-model="form.addr_street" label="Street address" outlined dense />
                <q-input v-model="form.addr_unit" label="Unit / Apartment (optional)" outlined dense />

                <div class="row q-col-gutter-sm">
                    <div class="col-6">
                        <q-input v-model="form.addr_city" label="City / Town" outlined dense />
                    </div>
                    <div class="col-6">
                        <q-input v-model="form.addr_region" label="Region / Province" outlined dense />
                    </div>
                </div>

                <div class="row q-col-gutter-sm">
                    <div class="col-6">
                        <q-input v-model="form.addr_postcode" label="Postal / ZIP" outlined dense />
                    </div>
                    <div class="col-6">
                        <q-input v-model="form.addr_country" label="Country" outlined dense />
                    </div>
                </div>

                <!-- Submit -->
                <q-btn class="full-width" color="dark" :disable="loading" @click="submit">
                    <template v-if="!loading">
                        Continue to payment
                    </template>

                    <template v-else>
                        <q-spinner size="18px" class="q-mr-sm" />
                        {{ loadingText }}
                    </template>
                </q-btn>

                <div class="text-caption text-grey text-center">
                    You’ll be redirected to PayFast to complete payment
                </div>

            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: "CheckoutComp",

    props: {
    },

    data() {
        return {
            loading: false,
            loadingText: "",

            form: {
                delivery_name: "",
                delivery_email: "",
                delivery_phone: "",
                addr_street: "",
                addr_unit: "",
                addr_city: "",
                addr_region: "",
                addr_postcode: "",
                addr_country: ""
            }
        };
    },


    computed: {
        productId() {
            return this.$route.params.productId;
        },
    },
    methods: {
        async submit() {
            try {
                this.loading = true;
                this.loadingText = "Generating order number";

                // 1️⃣ Create order shell
                const orderRes = await fetch("/pay/generate-order-number.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.form)
                }).then(r => r.json());

                if (!orderRes.ok) {
                    throw new Error(orderRes.error || "Failed to generate order");
                }

                // 2️⃣ Confirm price + sign
                this.loadingText = "Confirming price";

                const confirmRes = await fetch("/pay/confirm-price.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        product_id: this.productId,
                        payload_extras: {
                            m_payment_id: orderRes.order_id,
                            email_address: this.form.delivery_email
                        }
                    })
                }).then(r => r.json());

                if (!confirmRes.ok) {
                    throw new Error(confirmRes.error || "Failed to confirm price");
                }

                // 3️⃣ Redirect to PayFast
                this.redirectToPayFast(confirmRes.payfast_url, confirmRes.fields);

            } catch (err) {
                console.error(err);
                this.loading = false;
                this.loadingText = "";
                alert(err.message || "Checkout failed");
            }
        },

        redirectToPayFast(url, fields) {
            const form = document.createElement("form");
            form.method = "POST";
            form.action = url;

            Object.entries(fields).forEach(([key, value]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = value;
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        }
    }
};
</script>
