<template>
  <q-resource-show v-bind="$attrs" :config="manager">
    <template slot='show' slot-scope="scope">
      <component 
        v-for="attribute in manager.attributes"
        v-if="!attribute.hidden"
        v-bind="$attrs"
        :is="toComponent(attribute.style.extends)" 
        :resource="scope.resource"
        :attributeOptions="attribute.style"
        :attributeName="attribute.label"
        :errors="scope.errors"
        :manager="manager"
        />
    </template>
    <template slot='actions' slot-scope="scope">
      <component 
        v-for="component in resourceComponents" 
        :is="toComponent(component.extends)" 
        :manager="manager"
        :resource="scope.resource" 
        :options="mergeOptions(options, component.options)" 
        v-bind="$attrs"/>
    </template>
  </q-resource-show>
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
      resourceComponents: []
    }
  },
  methods: {
    toComponent(str) {
      return Utils.nameToComponent(str)
    }
  },
  created() {
    this.createManager()
    this.resourceComponents = this.view.config.options.actions.resource
  }
}
</script>