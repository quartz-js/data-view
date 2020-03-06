<template>
  <component :is="activatorType"
    @click="execute" 
    v-bind="$attrs"
    color="primary"
    content-icon='mdi-play'
    content-text="execute"
  />
</template>
<script>

import { Utils } from '../app/Helpers/Utils'
import _ from 'lodash'

export default {
  props: ['view', 'manager', 'resource', 'activatorType'],
  methods: {
    execute() {
      if (this.view.options.http) {
        let api = this.$container.get('data-view').newApiByUrl(this.view.options.http.url)

        let data = this.view.options.http.body

        data = _.mapValues(data, (item, key) => {
          return this.$container.get('template').parse(item, {resource: this.resource})
        })

        api.persist(this.view.options.http.query, {data: data}).then(i => {
          window.bus.$emit("message", {
            message: "Your request has been sent",
            type: "info"
          });

          bus.$emit(this.manager.resourceEvent("updated"), null);
        })
      }
    }
  }
}
</script>