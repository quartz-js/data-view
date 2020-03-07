<template>
  <div>
    <component v-if="manager" :is="component" v-bind="$attrs" :config="manager">
      <template slot='top' slot-scope="scope">
        <component 
          v-for="component in globalComponents" 
          :view="component.config"
          :is="toComponent(component.config.extends)" 
          :resource="scope.resource" 
          :options="mergeOptions(options, component.config.options)" 
          v-bind="$attrs" 
          activatorType='q-btn'
          :vars="vars"
        />
      </template>
      <template slot='actions' slot-scope="scope">
        <component
          v-for="component in resourceComponents" 
          :view="component.config"
          :is="toComponent(component.config.extends)" 
          :resource="scope.resource"
          :manager="manager"
          :options="mergeOptions(options, component.config.options)"
          v-bind="$attrs"
          activatorType='q-btn-table'
          :vars="vars"
        />
      </template>
    </component>
  </div>
</template>

<script>

import { Utils } from '../app/Helpers/Utils'
import { CommonResource } from '../mixins/CommonResource'
import { Interceptor } from '@quartz/core'
import _ from 'lodash'

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
  created() {
    this.createManager();
    console.log(this.view.config)

    this.resourceComponents = this.$container.get('data-view').getActionsByView(this.view.id, 'resource')
    this.globalComponents = this.$container.get('data-view').getActionsByView(this.view.id, 'global')

  }
}
</script>
