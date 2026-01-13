<template>
  <q-dialog v-model="locked" persistent>
    <q-card style="min-width: 300px">
      <q-card-section>
        <div class="text-h6">Checkout Locked</div>
        <div class="text-caption q-mt-sm">
          Checkout is locked because this is the staging site — to view the live website, please visit originart.art. <br>
          Enter password to access checkout
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="input"
          type="password"
          label="Password"
          autofocus
          @keyup.enter="unlock"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn :size="$q.screen.lt.md ? 'lg' : 'md'" label="Unlock" color="primary" @click="unlock" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data () {
    return {
      input: '',
      unlocked: false,
      password: 'softlaunch',
      stagingHost: 'the-gas-pad.letsnetworkhub.com'
    }
  },
  computed: {
    isStaging () {
      return window.location.hostname === this.stagingHost
    },
    locked () {
      return this.isStaging && !this.unlocked
    }
  },
  mounted () {
    this.unlocked = document.cookie.includes('checkout_unlocked=true')
  },
  methods: {
    unlock () {
      if (this.input === this.password) {
        document.cookie = 'checkout_unlocked=true; path=/'
        this.unlocked = true
      }
    }
  }
}
</script>
