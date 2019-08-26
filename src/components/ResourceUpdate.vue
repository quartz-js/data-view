<template>
  <q-resource-edit v-bind="$attrs" :config="manager">
    <template slot='edit' slot-scope="scope">
      <v-layout row wrap align-end>
        <component 
          v-for="attribute in manager.attributes"
          v-if="attribute.fillable && attribute.show"
          v-bind="$attrs"
          :is="toComponent(attribute.style.extends ? attribute.style.extends : 'attribute-input')" 
          :resource="scope.resource"
          :attributeOptions="attribute.style"
          :attributeName="attribute.name"
          :errors="scope.errors"
          :manager="manager"
        />
        <component 
          v-for="component in view.config.options.components"
          v-if="component.type === 'component'"
          v-bind="$attrs"
          :is="component.extends" 
          :resource="scope.resource"
          :manager="manager"
        />
      </v-layout>
    </template>
  </q-resource-edit>
</template>
<script>

import { Utils } from '../app/Helpers/Utils'
import { CommonResource } from '../mixins/CommonResource'

export default {
  mixins: [
    CommonResource
  ],
  created() {
    this.createManager()
  }
}
</script>