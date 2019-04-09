<template>
  <q-resource-index v-bind="$attrs" :config="manager">
    <template slot='top' slot-scope="scope">
      <component v-for="component in globalComponents" :is="toComponent(component.extends)" :resource="scope.resource" :options="mergeOptions(options, component.options)" v-bind="$attrs"/>
      
    </template>
    <template slot='actions' slot-scope="scope">
      <component v-for="component in resourceComponents" :is="toComponent(component.extends)" :resource="scope.resource" :options="mergeOptions(options, component.options)" v-bind="$attrs"/>
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
    console.log(this.view.name);
    this.createManager();

    if (!this.view.config.options.actions) {
      console.error(this.view);
    }

    console.log(this.view.config.options);
    this.resourceComponents = this.view.config.options.actions.resource
    this.globalComponents = this.view.config.options.actions.global
  }
}
</script>
