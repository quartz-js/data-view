<template>
  <q-resource-create v-bind="$attrs" :config="manager">
    <template slot='create' slot-scope="scope">
      <component 
        v-for="(attributeOptions, attributeName) in attributes"
        v-if="manager.getAttribute(attributeName).fillable"
        v-bind="$attrs"
        :is="toComponent(attributeOptions.extends)" 
        :resource="scope.resource"
        :attributeOptions="attributeOptions"
        :attributeName="attributeName"
        :errors="scope.errors"
        :manager="manager"
      />
    </template>
  </q-resource-create>
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