<template>
  <div v-on:mousemove="move">
    <component v-if="manager" :is="component" v-bind="$attrs" :config="manager">
      
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
          <tr
              @mouseover="resizable.show = true" 
              @mouseleave="resizable.show = false" 
            >
            <th style='width: 40px'></th>
            <th
              v-for="header in scope.headers"
              :key="header.text"
              v-if="header.attribute"
              class="px-4 headerContainer cell"
              :data-attribute-name="header.attribute.name"

            >
              <span>{{ header.attribute.label }}</span>
              <q-icon small>open_with</q-icon>
              <q-icon small>settings</q-icon>
              <div 
                v-on:mousedown="startResize"
                class="headerResizer"
                :class="{'hidden': resizable.clientX == null && !resizable.show}"
              >
                <div class="headerResizerSplitter"></div>
              </div>
            </th>
            <th>
              Actions
            </th>
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

export default {
  props: {
    settingsEnabled: {
      type: Boolean,
      default: true
    }
  },
  mixins: [
    CommonResource
  ],
  data() {
    return {
      resizable: {
        show: false,
        clientX: null,
        target: null
      },
      component: null,
      manager: null,
      resourceComponents: [],
      globalComponents: []
    }
  },
  methods: {
    move (event) {

      if (this.resizable.clientX === null) {
        return true;
      }

      let target = this.resizable.target.closest('.headerContainer')
      let e1 = target.getBoundingClientRect().x
      let e2 = event.clientX
      let width = e2-e1+7

      if (width < 80) {
        width = 80
      }


      let name = target.getAttribute('data-attribute-name')

      let cols = target.closest('table').querySelectorAll(`[data-attribute-name='${name}']`)

      cols.forEach(t => {
        t.style.minWidth = `${width}px`
        t.style.width = `${width}px`
        t.style.maxWidth = `${width}px`
      })
    },

    startResize (event) {
      this.resizable.clientX = event.clientX
      this.resizable.target = event.target
    },

    endResize () {
      this.resizable.clientX = null;
      this.resizable.target = null;
    }
  },
  created() {
    this.createManager();

    this.resourceComponents = this.$container.get('data-view').getActionsByView(this.view.id, 'resource')
    this.globalComponents = this.$container.get('data-view').getActionsByView(this.view.id, 'global')

    document.addEventListener('mouseup', (i) => {
      this.endResize()
    })

  }
}
</script>
<style scoped>

  th {
    position: relative;
  }

  .headerContainer {
    min-width: 80px;
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
</style>
