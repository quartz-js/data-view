<template>
  <v-flex class="px-4" v-if="show">
    <component :is="getComponent()" v-bind="$attrs" v-model="rawResource" :attribute="getAttribute()" :errors="errors" @input="onChange()"/>
    <debug :value="{attribute: getAttribute()}" />
  </v-flex>
</template>
<script>

import { Attributes, container, HandleResource } from '@quartz/core'
import Debug from './Debug'

export default {
  components: {
    Debug
  },
  data() {
    return {
      show: false
    }
  },
  watch: {
    resource: {
      handler: function (){
        this.reloadShow()
      },
      deep: true
    }
  },
  props: ['manager', 'attributeName', 'attributeOptions', 'errors'],
  mixins: [ HandleResource ],
  methods: {

    reloadShow() {
      this.show = this.$container.get('template').parse(this.getAttribute().condition, { resource: this.rawResource }) == 1;
    },

    // Change based on Attribute Class
    getComponent() {
      let attribute = this.getAttribute().getClassName()
      
      let component = container.get('$quartz.attributeResolvers')[this.getAttribute().type] || container.get('$quartz.attributeResolvers')[attribute];

      if (component) {
        return component;
      }

      throw `Cannot find a valid component for attribute ${this.manager.name}:${this.attributeName}:${attribute}`
    },
    getAttribute() {
      return this.manager.getAttribute(this.attributeName)
    }
  },
  mounted () {
    this.reloadShow()
  }
}
</script>