<template>
  <q-resource-create v-bind="$attrs" :config="manager">
    <template slot='create' slot-scope="scope">
      <v-layout row wrap>
        <component 
          v-for="attribute in manager.attributes"
          v-if="attribute.fillable && attribute.show"
          v-bind="$attrs"
          :is="toComponent(attribute.style.extends ? attribute.style.extends : 'data-view-attribute-input')" 
          :resource="scope.resource"
          :attributeOptions="attribute.style"
          :attributeName="attribute.label"
          :errors="scope.errors"
          :manager="manager"
        />
      </v-layout>
    </template>
  </q-resource-create>
</template>
<script>

import { Utils } from '../app/Helpers/Utils'
import { CommonResource } from '../mixins/CommonResource'

export default {
  mixins: [
    CommonResource
  ],
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