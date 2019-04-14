<template>
  <component 
    :is="getComponent()" 
    :resource="resource"
    v-bind="$attrs"
  />
</template>
<script>

import { HandleResource } from '@railken/quartz-core'
import { Common } from '../mixins/Common'

export default {
  mixins: [
    Common,
    HandleResource
  ],
  methods: {
    getComponent() {
      return this.resource ? "data-view-" + this.view.config.update : "data-view-" + this.view.config.create
    }
  },
}
</script>