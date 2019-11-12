<template>
  <component :is="resource ? 'q-resource-edit' : 'q-resource-create'" v-bind="$attrs" :config="manager" :resource="resource">
    <template :slot="resource ? 'edit' : 'create'" slot-scope="scope">
      <debug :value="{view: view, resource: resource}" />
      <grid-layout
        :layout.sync="layout"
        :col-num="12"
        :row-height="90"
        :is-draggable="config"
        :is-resizable="config"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[5, 5]"
        :use-css-transforms="true"
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
            v-if="!attribute.hide"
            v-on="$listeners"
            v-bind="$attrs"
            :is="toComponent('attribute-input')" 
            :resource="scope.resource"
            :attributeOptions="attribute.style"
            :attributeName="attribute.name"
            :errors="scope.errors"
            :manager="manager"
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

      <component 
        v-for="component in view.config.options.components"
        v-if="component.type === 'component'"
        v-on="$listeners"
        v-bind="$attrs"
        :is="component.extends" 
        :resource="scope.resource"
        :manager="manager"
      />
    </template>
  </component>
</template>
<script>

import { HandleResource } from '@quartz/core'
import { Utils } from '../app/Helpers/Utils'
import { CommonResource } from '../mixins/CommonResource'
import Debug from './Debug'
import { EnableConfig } from '../mixins/EnableConfig'

export default {
  components: {
    Debug
  },
  mixins: [
    CommonResource,
    HandleResource,
    EnableConfig
  ],
  data() {
    return {
      debug: false,
      layout: []
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
  }
}
</script>