<template>
  <component 
    :is="getComponent()" 
    :resource="resource"
    v-bind="$attrs"
    :options="options"
  />
</template>
<script>

import { HandleResource } from '@quartz/core'
import { CommonResource } from '../mixins/CommonResource'

export default {
  mixins: [
    CommonResource,
    HandleResource
  ],
  methods: {
    getComponent() {
      return this.resource && this.resource.id ? "data-view-" + this.view.config.update : "data-view-" + this.view.config.create
    }
  },
}
</script>