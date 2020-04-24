<template>
  <div v-on:mousemove="move" ref="table">
    <component v-if="manager" :is="component" v-bind="$attrs" :config="manager" v-on:onLoad="loadWidth">
      
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
            <td></td>
            <td
              v-for="header in scope.headers"
              :key="header.text"
              v-if="header.attribute"
              class="px-4 headerContainer cell"
              :data-attribute-name="header.attribute.name"
            >
              <span class="mr-2">{{ header.attribute.label }}</span>
              <q-icon class="mx-1" color="primary" small>open_with</q-icon>

              <attribute-view-edit :attribute='header.attribute' class="component-editable" />
              <div 
                v-on:mousedown="startResize"
                class="headerResizer"
                :class="{'hidden': resizable.clientX == null && !resizable.show}"
              >
                <div class="headerResizerSplitter"></div>
              </div>
            </td>
            <td>
              Actions
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
    ResizeColumn
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
    }
  },
  created() {
    this.createManager();

    this.resourceComponents = this.$container.get('data-view').getActionsByView(this.view.id, 'resource')
    this.globalComponents = this.$container.get('data-view').getActionsByView(this.view.id, 'global')
  }
}
</script>
<style scoped>

  .headerContainer {
    min-width: 80px;
    position: relative;
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
