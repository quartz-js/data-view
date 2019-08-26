<template>
  <q-resource-remove v-bind="$attrs" :config="manager"></q-resource-remove>
</template>
<script>

import { Utils } from '../app/Helpers/Utils'
import { Common } from '../mixins/Common'

export default {
  mixins: [
    Common
  ],
  data() {
    return {
      attributes: []
    }
  },
  created() {
    this.createManager()
  }
}
</script>