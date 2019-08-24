<template>
  <component v-if="manager" :is="component" v-bind="$attrs" :config="manager">
    <template slot='top' slot-scope="scope">
      <component v-for="component in globalComponents" :is="toComponent(component.extends)" :resource="scope.resource" :options="mergeOptions(options, component.options)" v-bind="$attrs"/>
    </template>
    <template slot='actions' slot-scope="scope">
      <component v-for="component in resourceComponents" :is="toComponent(component.extends)" :resource="scope.resource" :manager="manager" :options="mergeOptions(options, component.options)" v-bind="$attrs" activatorType='q-btn-table'/>
    </template>
  </component>
</template>

<script>

import { Utils } from '../app/Helpers/Utils'
import { CommonResource } from '../mixins/CommonResource'
import { Interceptor } from '@quartz/core'

export default {
  props: {
    settingsEnabled: {
      type: Boolean,
      default: true
    }
  },
  mixins: [
    CommonResource
  ],
  data() {
    return {
      component: null,
      manager: null,
      resourceComponents: [],
      globalComponents: []
    }
  },
  methods: {
    toComponent(str) {
      return Utils.nameToComponent(str)
    }
  },
  created() {
    this.createManager();
    this.resourceComponents = this.view.config.options.actions.resource
    this.globalComponents = this.view.config.options.actions.global
    this.component = Interceptor.resolve('resourceIndexOnRetrieve', {
      manager: this.manager,
      component: 'q-data-iterator-table'
    }).component

  }
}
</script>
