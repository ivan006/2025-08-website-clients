<template>
  <div class="q-pa-md bg-grey-1">

    <div
      class="q-mx-auto"
      style="max-width: 640px; border-radius: 12px; overflow: hidden; background: white; box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);"
    >
      <div class="q-pa-lg">

        <div class="text-h6 text-weight-bold q-mb-md">
          Payment cancelled
        </div>

        <div class="text-body1 q-mb-md">
          Your payment was not completed.
        </div>

        <div class="text-body2 q-mb-lg">
          No charges were made. You can return to the site and try again at any time.
        </div>

        <q-banner
          class="bg-grey-2 text-dark q-mb-lg"
          rounded
        >
          <div class="text-body2">
            Payments are securely processed by PayFast.
          </div>
        </q-banner>

        <q-btn :size="$q.screen.lt.md ? 'md' : 'md'"
          color="dark"
          unelevated
          no-caps
          class="full-width q-py-sm"
          @click="goHome"
        >
          Return to site
        </q-btn>

        <div class="text-caption text-grey text-center q-mt-sm">
          If you experienced an issue, please contact support.
        </div>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "CheckoutCancel",
  methods: {
    goHome() {
      this.$router.push("/");
    }
  }
};
</script>
