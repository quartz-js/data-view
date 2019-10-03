<template>
  <div v-if="resource">
    <q-resource-edit v-bind="$attrs" :config="manager" :resource="resource">
      <template slot='edit' slot-scope="scope">
        <debug :value="{view: view, resource: resource}" />
        <v-layout row wrap align-end>
          <component 
            v-for="attribute in manager.attributes"
            v-if="attribute.fillable && !attribute.hide"
            v-on="$listeners"
            v-bind="$attrs"
            :is="toComponent('attribute-input')" 
            :resource="scope.resource"
            :attributeOptions="attribute.style"
            :attributeName="attribute.name"
            :errors="scope.errors"
            :manager="manager"
          />
          <component 
            v-for="component in view.config.options.components"
            v-if="component.type === 'component'"
            v-on="$listeners"
            v-bind="$attrs"
            :is="component.extends" 
            :resource="scope.resource"
            :manager="manager"
          />
        </v-layout>
      </template>
    </q-resource-edit>
  </div>
  <div v-else>
    <q-resource-create v-bind="$attrs" :config="manager" :resource="resource">
      <template slot='create' slot-scope="scope">
        <debug :value="{view: view, resource: resource}" />
        <v-layout row wrap align-end>
          <component 
            v-for="attribute in manager.attributes"
            v-if="attribute.fillable && !attribute.hide"
            v-on="$listeners"
            v-bind="$attrs"
            :is="toComponent('attribute-input')" 
            :resource="scope.resource"
            :attributeOptions="attribute.style"
            :attributeName="attribute.name"
            :errors="scope.errors"
            :manager="manager"
          />
        </v-layout>
      </template>
    </q-resource-create>
  </div>
</template>
<script>

import { HandleResource } from '@quartz/core'
import { Utils } from '../app/Helpers/Utils'
import { CommonResource } from '../mixins/CommonResource'
import Debug from './Debug'

export default {
  components: {
    Debug
  },
  mixins: [
    CommonResource,
    HandleResource
  ],
  data() {
    return {
      debug: false
    }
  },
  methods: {
    toComponent(str) {
      return Utils.nameToComponent(str)
    }
  },
  created() {
    this.createManager()
  }
}
</script>