<template>
  <div>
      <q-page-index :config="manager" v-bind="$attrs">
        <template slot='body' slot-scope="scope">
          <component v-for="component in components" :is="toComponent(component.extends)" :resource="scope.resource" v-bind="$attrs" :key="manager.name + component.extends"/>
        </template>
      </q-page-index>
    <resource-settings :name="manager.data" />
  </div>
</template>

<script>

import { DataResolver } from '../app/Services/DataResolver'
import { Common } from '../mixins/Common'
import ResourceSettings from './ResourceSettings'

export default {
  mixins: [
    Common
  ],
  components: {
    ResourceSettings
  },
  data() {
    return {
      components: []
    }
  },
  created() {

    this.createManagerByName(this.view.config.label)
    this.components = this.view.config.options.components

  }
}
</script>
