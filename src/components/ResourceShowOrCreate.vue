<template>
  <div>
    <component 
        v-if="!resource"
        :is="'data-view-'+this.view.config.create" 
        :resource="resource"
        type="box"
        :options="options"
        v-bind="$attrs"
      />
    <component 
      v-if="resource"
      :is="'data-view-'+this.view.config.show" 
      :options="options"
      :resource="resource"
      v-bind="$attrs"
    />
  </div>
</template>
<script>

import { HandleResource } from '@quartz/core'
import { Common } from '../mixins/Common'

export default {
  mixins: [
    Common,
    HandleResource
  ],
  methods: {
    getComponent() {
      return this.resource && this.resource.id ? "data-view-" + this.view.config.show : "data-view-" + this.view.config.create
    }
  },
}
</script>