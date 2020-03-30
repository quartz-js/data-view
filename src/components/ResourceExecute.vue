<template>
  <component :is="activatorType"
    @click="execute" 
    v-bind="$attrs"
    color="primary"
    content-icon='mdi-play'
    :content-text="view.label"
    :loading="loading"
  />
</template>
<script>

import { Utils } from '../app/Helpers/Utils'
import _ from 'lodash'

export default {
  props: ['view', 'manager', 'resource', 'activatorType'],
  data() {
    return {
      loading: false
    }
  },
  methods: {
    execute() {
      if (this.loading) {
        return;
      }

      this.loading = true;

      if (this.view.options.http) {
        let api = this.$container.get('data-view').newApiByUrl(this.view.options.http.url)

        let data = this.view.options.http.body

        data = _.mapValues(data, (item, key) => {
          return typeof item === 'string' ? this.$container.get('template').parse(item, {resource: this.resource}) : item
        })

        api.persist(this.view.options.http.query, {queue: 1, data: data}).then(i => {
          window.bus.$emit("message", {
            message: "Your request has been sent",
            type: "info"
          });

          if (this.manager) {
            bus.$emit(this.manager.resourceEvent("updated"), null);
          }
        }).finally(i => {
          this.loading = false
        })
      }
    }
  }
}
</script>