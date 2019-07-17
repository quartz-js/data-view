<template>
  <div>
  <component :is="component" :config="manager" v-bind="$attrs">
    <template slot='tabs' slot-scope="scope">
      <v-tab :key="key" v-for="(component, key, index) in components" v-if="hasComponent(component)"> {{ key }}</v-tab>
      <v-tabs-items>
        <v-tab-item :key="key" v-for="(component, key, index) in components" :transition="false" :reverse-transition="false" v-if="hasComponent(component)">
          <component 
            :is="toComponent(component.extends)"
            :resource="toResource(component, scope.resource)" 
            v-bind="$attrs"
            :prefix="manager.name"
            :options="mergeOptions(options, component.options, scope.resource)"
            :key="manager.name + '.' + component.key + component.extends"
          />
        </v-tab-item>
      </v-tabs-items>
    </template>
    <template slot='actions' slot-scope="scope">
      <component 
        v-for="component in resourceComponents" 
        :is="toComponent(component.extends)" 
        :resource="scope.resource" 
        :options="mergeOptions(options, component.options)" 
        v-bind="$attrs"/>
    </template>
  </component>

  <resource-settings :name="manager.data" />
  </div>
</template>
<script>

import ResourceSettings from './ResourceSettings'
import { DataResolver } from '../app/Services/DataResolver'
import { Common } from '../mixins/Common'
import { container, Interceptor } from '@quartz/core'
import _ from 'lodash'


export default {
  mixins: [
    Common
  ],
  data() {
    return {
      component: null,
      components: [],
      resourceComponents: [],
    }
  },
  components: {
    ResourceSettings
  },
  created() {
    this.createManagerByName(this.view.config.label)

    if (this.view.config.options.actions) {
      this.resourceComponents = this.view.config.options.actions.resource
    }
    
    this.components = this.view.config.options.components

    this.component = Interceptor.resolve('pageShowOnRetrieve', {
      manager: this.manager,
      component: 'q-page-show'
    }).component
  },
  methods: {
    hasComponent(component) {
      return component.show === true || typeof component.show === 'undefined'
    },
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
