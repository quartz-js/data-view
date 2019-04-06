<template>
  <component :is="getComponent()" v-model="resource" :attribute="getAttribute()" :errors="errors"/>
</template>
<script>

import { Attributes } from '@railken/quartz-core'

export default {
  props: ['resource', 'manager', 'attributeName', 'attributeOptions', 'errors'],
  methods: {
    // Change based on Attribute Class
    getComponent() {
      let attribute = this.getAttribute().constructor.name

      if (attribute === 'TextAttribute') {
        return 'q-text'
      }

      if (attribute === 'LongTextAttribute') {
        return 'q-textarea'
      }

      if (attribute === 'EmailAttribute') {
        return 'q-text'
      }

      if (attribute === 'PasswordAttribute') {
        return 'q-secret'
      }

      if (attribute === 'BooleanAttribute') {
        return 'q-switch'
      }

      if (attribute === 'EnumAttribute') {
        return 'q-select'
      }

      if (attribute === 'YamlAttribute') {
        return 'q-yaml'
      }

      if (attribute === 'HtmlAttribute') {
        return 'q-html'
      }

      throw `Cannot find a valid component for attribute ${this.manager.name}:${this.attributeName}:${attribute}`
    },
    getAttribute() {
      return this.manager.getAttribute(this.attributeName)
    }
  },
}
</script>