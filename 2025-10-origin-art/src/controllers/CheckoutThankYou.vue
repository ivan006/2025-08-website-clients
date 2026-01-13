<template>
  <div class="q-pa-md bg-grey-1x" style="">

    <div class="q-mx-auto"
      style="max-width: 640px; border-radius: 12px; overflow: hidden; background: white; box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);">
      <div class="q-pa-lg">

        <div class="text-h6 text-weight-bold q-mb-md">
          Thank you
        </div>

        <div class="text-body1 q-mb-md">
          Your order has been received.
        </div>



        <div class="text-body2 q-mb-lg">
          If your payment was successful, you’ll receive a confirmation email shortly.
          A separate shipping quote will be provided once your order has been processed.
        </div>


        <q-banner class="bg-grey-2 text-dark q-mb-lg" rounded>
          <div class="text-body2">
            Payments are securely processed by PayFast.
          </div>
        </q-banner>

        <q-btn :size="$q.screen.lt.md ? 'lg' : 'md'" color="dark" unelevated no-caps class="full-width q-py-sm" 
          @click="goHome">
          Continue browsing
        </q-btn>

        <div class="text-caption text-grey text-center q-mt-sm">
          If you have any questions, please contact support.
        </div>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "CheckoutThankYou",
  methods: {
    goHome() {
      this.$router.push("/");
    }
  }
};
</script>
