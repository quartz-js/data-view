<template>
  <v-flex class="px-4" v-bind="getProps()">
    <component :is="getComponent()" v-model="rawResource" :attribute="getAttribute()" :errors="errors" @input="onChange()"/>
  </v-flex>
</template>
<script>

import { Attributes, container, HandleResource } from '@railken/quartz-core'

export default {
  props: ['manager', 'attributeName', 'attributeOptions', 'errors'],
  mixins: [ HandleResource ],
  methods: {

    getProps () {
      let obj = {};

      obj[`xs${ this.getAttribute().style.size }`] = true;

      return obj;
    },

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