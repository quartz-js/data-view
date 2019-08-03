<template>
  <v-flex v-bind="getProps()">
    <component :is="getComponent()" :resource="resource" :attribute="getAttribute()" :errors="errors"/>
  </v-flex>
</template>
<script>

import { Attributes } from '@quartz/core'

export default {
  props: ['resource', 'manager', 'attributeName', 'attributeOptions', 'errors'],
  methods: {
    getProps () {
      let obj = {};

      obj[`xs${ this.getAttribute().style.size }`] = true;

      return obj;
    },
    // Change based on Attribute Class
    getComponent() {
      let attribute = this.getAttribute().getClassName()

      return 'q-show-text'

      throw `Cannot find a valid component for attribute ${this.manager.name}:${this.attributeName}:${attribute}`
    },
    getAttribute() {
      return this.manager.getAttribute(this.attributeName)
    }
  },
}
</script>