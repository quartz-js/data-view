<template>
  <q-resource-edit v-bind="$attrs" :config="manager">
    <template slot='edit' slot-scope="scope">
      <v-layout row wrap>
        <component 
          v-for="attribute in manager.attributes"
          v-if="attribute.fillable"
          v-bind="$attrs"
          :is="toComponent(attribute.style.extends)" 
          :resource="scope.resource"
          :attributeOptions="attribute.style"
          :attributeName="attribute.label"
          :errors="scope.errors"
          :manager="manager"
        />
      </v-layout>
    </template>
  </q-resource-edit>
</template>
<script>

import { Utils } from '../app/Helpers/Utils'
import { Common } from '../mixins/Common'

export default {
  mixins: [
    Common
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