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
  </q-resource-show>
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