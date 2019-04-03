<template>
  <q-resource-index v-bind="$attrs" :config="manager">
    <template slot='top' slot-scope="scope">
      <component v-for="component in globalComponents" :is="toComponent(component.extends)" :resource="scope.resource" v-bind="$attrs"/>
    </template>
    <template slot='actions' slot-scope="scope">
      <component v-for="component in resourceComponents" :is="toComponent(component.extends)" :resource="scope.resource" v-bind="$attrs"/>
    </template>
  </q-resource-index>
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
      manager: null,
      resourceComponents: [],
      globalComponents: []
    }
  },
  created() {
    this.createManager();
    this.resourceComponents = this.view.config.options.actions.resource
    this.globalComponents = this.view.config.options.actions.global
  }
}
</script>
