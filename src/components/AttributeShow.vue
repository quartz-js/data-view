<template>
  <component :is="getComponent()" :resource="resource" :attribute="getAttribute()" :errors="errors"/>
</template>
<script>

import { Attributes } from '@railken/quartz-core'

export default {
  props: ['resource', 'manager', 'attributeName', 'attributeOptions', 'errors'],
  methods: {
    // Change based on Attribute Class
    getComponent() {
      let attribute = this.getAttribute().constructor.name

      return 'q-show-text'

      throw `Cannot find a valid component for attribute ${this.manager.name}:${this.attributeName}:${attribute}`
    },
    getAttribute() {
      return this.manager.getAttribute(this.attributeName)
    }
  },
}
</script>