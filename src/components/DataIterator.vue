<template>
  <div v-on:mousemove="move" ref="table">
    <AttributeViewEdit :attribute="attributeSelected" v-if="attributeSelected"/>

    <component v-if="manager" :is="component" v-bind="$attrs" :config="manager" v-on:onLoad="onLoad">
      <template slot='top' slot-scope="scope">
        <component 
          v-for="component in globalComponents" 
          :view="component.config"
          :is="toComponent(component.config.extends)" 
          :resource="scope.resource" 
          :options="mergeOptions(options, component.config.options)" 
          v-bind="$attrs" 
          activatorType='q-btn'
          :vars="vars"
        />
      </template>
      <template slot='actions' slot-scope="scope">
        <component
          v-for="component in resourceComponents" 
          :view="component.config"
          :is="toComponent(component.config.extends)" 
          :resource="scope.resource"
          :manager="manager"
          :options="mergeOptions(options, component.config.options)"
          v-bind="$attrs"
          activatorType='q-btn-table'
          :vars="vars"
        />
      </template>
      <template slot='header' slot-scope="scope">
        <thead id="head">
          <tr ref="headerRow">
            <td class="headerContainer" style='width: 40px'></td>
            <td
              v-for="header in scope.headers"
              :key="header.text"
              v-if="header.attribute"
              class="headerContainer cell"
              :data-attribute-name="header.attribute.name"
            >

              <v-menu offset-y dense  :nudge-width="60">
                <template v-slot:activator="{ on }">
                  <div class="headerContent btn-move-column px-4" v-on="on">
                    <div>
                      <span>{{ header.attribute.label }}</span>
                    </div>
                  </div>
                </template>
                <v-list class="pa-0" dense>
                  <v-list-item class='px-3' @click="attributeSelected = header.attribute">
                    <q-icon small class="mr-2">fas fa-edit</q-icon> Edit 
                  </v-list-item>
                  <v-list-item class='px-3' @click="">
                    <q-icon small class="mr-2">fas fa-sort-alpha-up</q-icon> Sort By Asc
                  </v-list-item>
                  <v-list-item class='px-3' @click="">
                    <q-icon small class="mr-2">fas fa-sort-alpha-down</q-icon> Sort By Desc
                  </v-list-item>
                </v-list>
              </v-menu>
              <div 
                v-on:mousedown="startResize"
                class="headerResizer"
              >
                <div class="headerResizerSplitter"></div>
              </div>
            </td>
            <td class="headerContainer">
              <div class="headerContent">
                <div class='flex-fill'></div>
                <div class="headerIconContainer">
                  <span><q-icon class="mx-1 primary-on-hover" small >settings</q-icon></span>
                </div>
              </div>
            </td>
          </tr>
        </thead>
      </template>
    </component>
  </div>
</template>

<script>

import { Utils } from '../app/Helpers/Utils'
import { CommonResource } from '../mixins/CommonResource'
import { Interceptor } from '@quartz/core'
import _ from 'lodash'
import { container } from '@quartz/core'
import { ResizeColumn } from './Concerns/ResizeColumn'
import { MoveColumn } from './Concerns/MoveColumn'
import AttributeViewEdit from './AttributeViewEdit'

export default {
  props: {
    settingsEnabled: {
      type: Boolean,
      default: true
    }
  },
  mixins: [
    CommonResource,
    ResizeColumn,
    MoveColumn
  ],
  components: {
    AttributeViewEdit
  },
  data() {
    return {
      component: null,
      manager: null,
      resourceComponents: [],
      globalComponents: [],
      attributeSelected: null
    }
  },
  methods: {
    onLoad() {
      this.loadResize()
      this.loadMove()
    }
  },
  created() {
    this.createManager();

    this.resourceComponents = this.$container.get('data-view').getActionsByView(this.view.id, 'resource')
    this.globalComponents = this.$container.get('data-view').getActionsByView(this.view.id, 'global')
  }
}
</script>
<style>
  
  .headerContainer:not(:hover) .headerIconContainer > span > .v-icon{
    visibility: hidden;
  }

  .draggable-mirror {
    background: #efefef;
    border: 2px solid rgba(0, 0, 0, 0.12);
    border-width: 0 2px 0 2px;
    display: flex;
    align-items: center;
    opacity: 0.6;
  }

  .draggable--is-dragging {
    background: yellow;
  }

  .draggable-container--is-dragging {

  }
  .draggable-mirror .headerIconContainer, .draggable-mirror .headerResizer {
    display: none !important;
  }
</style>

<style scoped>
  
  .headerContainer:hover .headerIconContainer{
    background: white;
  }

  .headerContainer:not(:hover) .headerResizer{
    visibility: hidden;
  }

  .headerContainer {
    min-width: 40px;
    position: relative;
    color: rgba(0,0,0,.54);
    font-weight: 500;
    font-size: 12px;
    outline: 0;
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
  }

  .headerContent {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .headerIconContainer {
    display: flex;
    align-items: center;
    position: absolute;
    right: 10px;
  }

  .headerResizer {
    position: absolute;
    right: 0;
    height: 100%;
    top: 0;
    width: 10px;
    cursor: e-resize;
  }

  .headerResizerSplitter {
    height: 100%;
    margin-left: 4px;
    margin-right: 4px;
    width: 0px;
    border-right: 2px dashed rgb(241, 241, 241);
  }

  .cell {
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
  }

  td {
    padding: 0;
  }


  .draggable-source--is-dragging > {
    visibility: hidden;
  }

  .headerContainer:hover {
    cursor:pointer;
    background: #eeeeee;
  }

</style>
