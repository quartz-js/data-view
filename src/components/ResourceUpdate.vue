<template>
  <q-resource-edit v-bind="$attrs" :config="manager">
    <template slot='edit' slot-scope="scope">
      <component 
        :is="getComponent()" 
        :manager="manager"
        v-bind="$attrs"
        :options="options"
        />
    </template>
  </q-resource-edit>
</template>
<script>

import { Utils } from '../app/Helpers/Utils'
import { CommonResource } from '../mixins/CommonResource'

export default {
  mixins: [
    CommonResource
  ],
  methods: {
    getComponent() {
      return "data-view-" + this.view.config.upsert
    }
  },
}
</script>