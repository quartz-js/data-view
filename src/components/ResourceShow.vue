<template>
  <q-resource-show v-bind="$attrs" :config="manager" v-if="manager">
    <template slot='show' slot-scope="scope">
      <div class='layout row wrap'>
        <component 
          v-for="attribute in manager.attributes"
          v-if="attribute.show"
          v-bind="$attrs"
          :is="toComponent(attribute.style.extends ? attribute.style.extends : 'data-view-attribute-show')" 
          :resource="scope.resource"
          :attributeOptions="attribute.style"
          :attributeName="attribute.name"
          :errors="scope.errors"
          :manager="manager"
          />
      </div>
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
import { CommonResource } from '../mixins/CommonResource'

export default {
  mixins: [
    CommonResource
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