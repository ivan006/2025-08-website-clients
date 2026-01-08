<template>
    <div class="q-pa-md bg-grey-1">

        <div class="q-mx-auto "
            style=" max-width: 960px; border-radius: 12px; overflow: hidden; background: white; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);">
            <div class="row">

                <!-- LEFT: Product display -->
                <div class="col-12 col-md-5">
                    <CheckoutProductDisplay :product-id="productId" />
                </div>

                <!-- RIGHT: Checkout form -->
                <div class="col-12 col-md-7">
                    <div class="q-pa-lg" @pointerdown="clearErrors">

                        <!-- Title -->
                        <div class="text-h6 text-weight-bold q-mb-lg">
                            Enter delivery details
                        </div>

                        <!-- Contact info -->
                        <div class="text-subtitle2 text-weight-medium q-mb-sm">
                            Contact information
                        </div>

                        <q-input v-model="form.delivery_name" placeholder="Full name" outlined dense hide-bottom-space
                            class="" />
                        <NativeLikeValidationError class="q-mb-sm" :errors="errors.delivery_name" />

                        <q-input v-model="form.delivery_email" placeholder="Email" type="email" outlined dense
                            hide-bottom-space class="" />
                        <NativeLikeValidationError class="q-mb-sm" :errors="errors.delivery_email" />

                        <q-input v-model="form.delivery_phone" placeholder="Phone number (optional)" outlined dense
                            class="q-mb-lg" />

                        <!-- Address -->
                        <div class="text-subtitle2 text-weight-medium q-mb-sm">
                            Delivery address
                        </div>

                        <q-input v-model="form.addr_street" placeholder="Street address" outlined dense
                            hide-bottom-space class="" />
                        <NativeLikeValidationError class="q-mb-sm" :errors="errors.addr_street" />

                        <q-input v-model="form.addr_unit" placeholder="Apartment / Unit (optional)" outlined dense
                            class="q-mb-sm" />

                        <div class="row q-col-gutter-sm q-mb-sm">
                            <div class="col-6">
                                <q-input v-model="form.addr_city" placeholder="City / Town" outlined dense
                                    hide-bottom-space />
                                <NativeLikeValidationError class="q-mb-sm" :errors="errors.addr_city" />
                            </div>
                            <div class="col-6">
                                <q-input v-model="form.addr_region" placeholder="Province / Region" outlined dense
                                    hide-bottom-space />
                                <NativeLikeValidationError class="q-mb-sm" :errors="errors.addr_region" />
                            </div>
                        </div>

                        <div class="row q-col-gutter-sm q-mb-lg">
                            <div class="col-6">
                                <q-input v-model="form.addr_postcode" placeholder="Postal / ZIP" outlined dense
                                    hide-bottom-space />
                                <NativeLikeValidationError class="q-mb-sm" :errors="errors.addr_postcode" />
                            </div>
                            <div class="col-6">
                                <q-input v-model="form.addr_country" placeholder="Country" outlined dense
                                    hide-bottom-space />
                                <NativeLikeValidationError class="q-mb-sm" :errors="errors.addr_country" />
                            </div>
                        </div>
                        <q-banner v-if="checkoutError" class="bg-red-1 text-red q-mb-md" rounded>
                            <div class="text-body2">
                                {{ checkoutError }}
                            </div>
                        </q-banner>

                        <!-- CTA -->
                        <q-btn class="full-width q-py-sm" color="dark" no-caps unelevated :disable="loading"
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

import CheckoutProductDisplay from "src/controllers/CheckoutProductDisplay.vue";
import NativeLikeValidationError from "src/controllers/NativeLikeValidationError.vue";

export default {
    name: "CheckoutComp",

    components: {
        CheckoutProductDisplay,
        NativeLikeValidationError,
    },
    props: {
    },

    data() {

        return {
            checkoutError: null,
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
                addr_country: "",
                product_id: [this.$route.params.productId],
            },

            errors: {
                delivery_name: [],
                delivery_email: [],
                addr_street: [],
                addr_city: [],
                addr_region: [],
                addr_postcode: [],
                addr_country: []
            },

            rules: {
                delivery_name: [
                    v => !!v || 'Please fill in this field.'
                ],
                delivery_email: [
                    v => !!v || 'Please fill in this field.',
                    v => /.+@.+\..+/.test(v) || 'Please enter a valid email.'
                ],
                addr_street: [v => !!v || 'Please fill in this field.'],
                addr_city: [v => !!v || 'Please fill in this field.'],
                addr_region: [v => !!v || 'Please fill in this field.'],
                addr_postcode: [v => !!v || 'Please fill in this field.'],
                addr_country: [v => !!v || 'Please fill in this field.']
            },
        };
    },


    computed: {
        productId() {
            return this.$route.params.productId;
        },
    },
    methods: {

        runRules(value, rules = []) {
            for (const rule of rules) {
                const res = rule(value)
                if (res !== true) {
                    return [res] // 👈 first error only
                }
            }
            return []
        },

        clearErrors() {
            Object.keys(this.errors).forEach(k => {
                this.errors[k] = []
            })
            this.checkoutError = null // 👈 clear checkout-level error
        },


        async submit() {
            this.clearErrors()

            let valid = true

            for (const field in this.rules) {
                const errs = this.runRules(this.form[field], this.rules[field])

                if (errs.length) {
                    this.errors[field] = errs   // populate only first error
                    valid = false
                    break                        // ⬅️ stop here
                }
            }

            if (!valid) return

            try {
                this.loading = true;
                this.loadingText = "Securing order number";

                // 1️⃣ Create order shell
                const orderRes = await fetch(`${import.meta.env.VITE_API_PAY_INTEGRATION_URL}/generate-order-number.php`, {
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
                this.loadingText = "Securing price";

                const confirmRes = await fetch(`${import.meta.env.VITE_API_PAY_INTEGRATION_URL}/confirm-price.php`, {
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

                    // 🔒 Handle known backend codes
                    if (confirmRes.code === 'PRODUCT_SOLD') {
                        this.checkoutError = 'Sorry, this product has already been sold.';
                        this.loading = false;
                        this.loadingText = '';
                        return;
                    }

                    throw new Error(confirmRes.error || "Failed to confirm price");
                }



                this.loading = false;
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
