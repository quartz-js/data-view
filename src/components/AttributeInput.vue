<template>
  <v-flex xs12 class="px-4">
    <component :is="getComponent()" v-model="rawResource" :attribute="getAttribute()" :errors="errors" @input="onChange()"/>
  </v-flex>
</template>
<script>

import { Attributes, container, HandleResource } from '@railken/quartz-core'

export default {
  props: ['manager', 'attributeName', 'attributeOptions', 'errors'],
  mixins: [ HandleResource ],
  methods: {
    // Change based on Attribute Class
    getComponent() {
      let attribute = this.getAttribute().getClassName()

      let component = container.get('$quartz.attributeResolvers')[attribute];

      if (component) {
        return component;
      }

      throw `Cannot find a valid component for attribute ${this.manager.name}:${this.attributeName}:${attribute}`
    },
    getAttribute() {
      return this.manager.getAttribute(this.attributeName)
    }
  },
}
</script>