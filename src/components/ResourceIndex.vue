<template>
  <component :is="component" v-bind="$attrs" :config="manager">
    <template slot='top' slot-scope="scope">
      <component v-for="component in globalComponents" :is="toComponent(component.extends)" :resource="scope.resource" :options="mergeOptions(options, component.options)" v-bind="$attrs"/>
    </template>
    <template slot='actions' slot-scope="scope">
      <component v-for="component in resourceComponents" :is="toComponent(component.extends)" :resource="scope.resource" :options="mergeOptions(options, component.options)" v-bind="$attrs"/>
    </template>
  </component>
</template>

<script>

import { Utils } from '../app/Helpers/Utils'
import { Common } from '../mixins/Common'
import { Interceptor } from '@railken/quartz-core'

export default {
  mixins: [
    Common
  ],
  data() {
    return {
      component: null,
      manager: null,
      resourceComponents: [],
      globalComponents: []
    }
  },
  created() {
    this.createManager();
    this.resourceComponents = this.view.config.options.actions.resource
    this.globalComponents = this.view.config.options.actions.global
    this.component = Interceptor.resolve('resourceIndexOnRetrieve', {
      manager: this.manager,
      component: 'q-resource-index'
    }).component
  }
}
</script>
