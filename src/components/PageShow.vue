<template>
  <q-page-show :config="manager" v-bind="$attrs">
    <template slot='tabs' slot-scope="scope">
      <v-tab v-for="(section, key) in sections">{{ key }}</v-tab>
      <v-tab-item v-for="(section, key) in sections" :transition="false" :reverse-transition="false">
        <component 
          :is="toComponent(section.extends)"
          :resource="toResource(section, scope.resource)" 
          v-bind="$attrs"
          :prefix="manager.name"
          :options="mergeOptions(options, section.options, scope.resource)"
          :key="manager.name + '.' + section.key + section.extends"
        />
      </v-tab-item>
    </template>
    <template slot='actions' slot-scope="scope">
      <component 
        v-for="component in resourceComponents" 
        :is="toComponent(component.extends)" 
        :resource="scope.resource" 
        :options="mergeOptions(options, component.options)" 
        v-bind="$attrs"/>
    </template>
  </q-page-show>
</template>
<script>

import { DataResolver } from '../app/Services/DataResolver'
import { Common } from '../mixins/Common'

export default {
  mixins: [
    Common
  ],
  data() {
    return {
      sections: []
    }
  },
  created() {
    this.createManagerByName(this.view.config.options.data)

    if (this.view.config.options.actions) {
      this.resourceComponents = this.view.config.options.actions.resource
    }
    
    this.sections = this.view.config.options.sections

  },
  methods: {
    toResource(view, resource) {
      if (view.options && view.options.extractor) {
        
        let relationedResource = resource[view.options.extractor];

        return relationedResource;

      }

      return resource
    }
  }
}
</script>
