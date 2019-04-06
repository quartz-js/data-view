<template>
  <q-resource-show v-bind="$attrs" :config="manager">
    <template slot='show' slot-scope="scope">
      <component 
        v-for="(attributeOptions, attributeName) in attributes"
        v-bind="$attrs"
        :is="toComponent(attributeOptions.extends)" 
        :resource="scope.resource"
        :attributeOptions="attributeOptions"
        :attributeName="attributeName"
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
  data() {
    return {
      attributes: []
    }
  },
  methods: {
    toComponent(str) {
      return Utils.nameToComponent(str)
    }
  },
  created() {
    this.createManager()
    this.attributes = this.view.config.options.attributes
  }
}
</script>