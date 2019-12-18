<template>
  <q-resource-show v-bind="$attrs" :config="manager" v-if="manager">
    <template slot='show' slot-scope="scope">
      <grid-layout
        :layout.sync="layout"
        :col-num="12"
        :row-height="60"
        :is-draggable="config"
        :is-resizable="config"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[5, 5]"
        :use-css-transforms="false"
      >

        <grid-item v-for="attribute in manager.attributes"
           v-if="!attribute.hide"
           :x="attribute.layout.x"
           :y="attribute.layout.y"
           :w="attribute.layout.w"
           :h="attribute.layout.h"
           :i="attribute.layout.i"
           :key="attribute.layout.i"
           :class="{'active': config}"
           @resized="save"
           @moved="save"
          >
            <component 
              v-bind="$attrs"
              :is="toComponent('attribute-show')" 
              :resource="scope.resource"
              :attributeOptions="attribute.style"
              :attributeName="attribute.name"
              :errors="scope.errors"
              :manager="manager"
              class="ma-2"
              />
        </grid-item>
      </grid-layout>

      <div class="text-right">
        <v-btn 
          icon 
          class='ml-3' 
          :color="config ? 'primary' : null" 
          @click="config = !config"
        >
          <q-icon>fas fa-sliders-h</q-icon>
        </v-btn>
      </div>
    </template>
    <template slot='actions' slot-scope="scope">
      <component 
        v-for="component in resourceComponents" 
        :is="toComponent(component.extends)" 
        :manager="manager"
        :resource="scope.resource" 
        :options="mergeOptions(options, component.options)" 
        v-bind="$attrs"/>
    </template>
  </q-resource-show>
</template>
<script>

import { Utils } from '../app/Helpers/Utils'
import { CommonResource } from '../mixins/CommonResource'
import { EnableConfig } from '../mixins/EnableConfig'

export default {
  mixins: [
    CommonResource,
    EnableConfig
  ],
  data() {
    return {
      layout: [],
      resourceComponents: []
    }
  },
  methods: {
    toComponent(str) {
      return Utils.nameToComponent(str)
    }
  },
  created() {
    this.createManager()
    this.layout = this.manager.attributes.map(i => {
      return i.layout
    })
    this.resourceComponents = this.view.config.options.actions.resource
  }
}
</script>