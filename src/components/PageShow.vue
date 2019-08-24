<template>
  <div >
    <component :is="component" :config="manager" v-bind="$attrs" v-if="view">
      <template slot='body' slot-scope="scope">
        <q-tabs class='show-tabs my-4' v-model="tabs">
          <v-tab flat tile :key="key" v-for="(component, key, index) in components" v-if="hasComponent(component)" >{{ key }}</v-tab>
          <v-tab-item 
            v-bind:class="{'ml-4': $container.get('style.q-tabs.vertical'), 'mt-4': !$container.get('style.q-tabs.vertical')}"
            :key="key" 
            v-for="(component, key, index) in components" 
            :transition="false" 
            :reverse-transition="false" 
            v-if="hasComponent(component)"
          >
            <component 
              :is="toComponent(component.extends)"
              :resource="toResource(component, scope.resource)" 
              v-bind="$attrs"
              :prefix="manager.name"
              :options="mergeOptions(options, component.options, scope.resource)"
              :key="manager.name + '.' + component.key + component.extends"
            />
          </v-tab-item>
        </q-tabs>
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
import { CommonPage } from '../mixins/CommonPage'
import { container, Interceptor } from '@quartz/core'
import _ from 'lodash'


export default {
  mixins: [
    CommonPage,
  ],
  data() {
    return {
      tabs: null,
      component: null,
      resourceComponents: [],
    }
  },
  components: {
    ResourceSettings
  },
  computed: {
    components: function () {
      return this.view.config.options.components
    }
  },
  created() {
    this.createManagerByName(this.view.config.label)

    if (this.view.config.options.actions) {
      this.resourceComponents = this.view.config.options.actions.resource
    }

    this.component = Interceptor.resolve('pageShowOnRetrieve', {
      manager: this.manager,
      component: 'q-page-show'
    }).component
  },
  methods: {
    hasComponent(component) {
      return !component.options || typeof component.options.hide === 'undefined' || !component.options.hide
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
