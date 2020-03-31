<template>
  <v-dialog
    v-model="dialog"
    max-width="440"
  >
    <v-card class="text-center pa-5">
      <div class="headline"><div class="text-center">You have an update!</div></div>
      
      <v-card-text class="pa-7">
        <q-view-icon :src="manager.icon" alt="icon" width='170' style='margin:0 auto' />
      </v-card-text>

      <v-card-text>

        Your views have been changed. Please refresh the page in order to see the latest version.
      </v-card-text>

      <div class="pa-4 text-center">
        <q-btn
          color="primary"
          :loading="loading"
          @click="refresh()"
        >
          Ok, refresh!
        </q-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>

import { DataResolver } from '../app/Services/DataResolver'

export default {
  data() {
    return {
      manager: false,
      dialog: false,
      loading: false
    }
  },
  methods: {
    refresh() {
      this.loading = true;
      window.location.reload()
    }
  },
  created() {
    
    this.manager = new DataResolver().createManagerByName('data-view')

      window.Echo.channel('presence-global').listen('.data-view.flush', (e) => {
        console.log(e)
        this.dialog = true;
      })

  }
}
</script>