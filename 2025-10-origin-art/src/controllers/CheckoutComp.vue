<template>
    <div class="q-pa-md bg-grey-1">

        <div class="q-mx-auto " style="
    max-width: 960px;
    border-radius: 12px;
    overflow: hidden;
    background: white;
    box-shadow:
      0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  ">
            <div class="row">

                <!-- LEFT: Product display -->
                <div class="col-12 col-md-5">
                    <CheckoutProductDisplay :product-id="productId" />
                </div>

                <!-- RIGHT: Checkout form -->
                <div class="col-12 col-md-7">

                    <div class="q-pa-lg">

                        <!-- Title -->
                        <div class="text-h6 text-weight-bold q-mb-lg">
                            Enter billing details
                        </div>

                        <!-- Contact info -->
                        <div class="text-subtitle2 text-weight-medium q-mb-sm">
                            Contact information
                        </div>

                        <q-input v-model="form.delivery_name" placeholder="Full name" outlined dense input-style=""
                            class="q-mb-sm" />

                        <q-input v-model="form.delivery_email" placeholder="Email" type="email" outlined dense
                            input-style="" class="q-mb-sm" />

                        <q-input v-model="form.delivery_phone" placeholder="Phone number (optional)" outlined dense
                            input-style="" class="q-mb-lg" />

                        <!-- Address -->
                        <div class="text-subtitle2 text-weight-medium q-mb-sm">
                            Billing address
                        </div>

                        <q-input v-model="form.addr_street" placeholder="Street address" outlined dense input-style=""
                            class="q-mb-sm" />

                        <q-input v-model="form.addr_unit" placeholder="Apartment / Unit (optional)" outlined dense
                            input-style="" class="q-mb-sm" />

                        <div class="row q-col-gutter-sm q-mb-sm">
                            <div class="col-6">
                                <q-input v-model="form.addr_city" placeholder="City / Town" outlined dense
                                    input-style="" />
                            </div>
                            <div class="col-6">
                                <q-input v-model="form.addr_region" placeholder="Province / Region" outlined dense
                                    input-style="" />
                            </div>
                        </div>

                        <div class="row q-col-gutter-sm q-mb-lg">
                            <div class="col-6">
                                <q-input v-model="form.addr_postcode" placeholder="Postal / ZIP" outlined dense
                                    input-style="" />
                            </div>
                            <div class="col-6">
                                <q-input v-model="form.addr_country" placeholder="Country" outlined dense
                                    input-style="" />
                            </div>
                        </div>

                        <!-- CTA -->
                        <q-btn class="full-width q-py-sm" color="dark" :no-caps="true" unelevated :disable="loading"
                            @click="submit" style="border-radius:6px; font-size:16px;">
                            <template v-if="!loading">
                                Continue to payment
                            </template>
                            <template v-else>
                                <q-spinner size="18px" class="q-mr-sm" />
                                {{ loadingText }}
                            </template>
                        </q-btn>

                        <div class="text-caption text-grey text-center q-mt-sm">
                            You will be redirected to PayFast to complete payment
                        </div>

                    </div>
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
