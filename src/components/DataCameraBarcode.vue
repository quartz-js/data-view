<template>
  <q-data-camera-barcode v-if="manager" v-bind="$attrs" :config="manager"></q-data-camera-barcode>
</template>

<script>

import { CommonResource } from '../mixins/CommonResource'

export default {
  mixins: [
    CommonResource
  ],
  data() {
    return {
      manager: null,
    }
  },
  created() {
    this.createManager();
  }
}
</script>
