<template>
  <div>
    <q-page-index :config="manager" v-bind="$attrs">
      <template slot='body' slot-scope="scope">
        <q-card class="pa-2">
          <v-layout align-center>
            <q-component-selector style='flex-grow: 2'
              label="Components"
              outlined
              :items="components"
              :resource="scope.resource" 
              v-bind="$attrs"
              :value="$container.get('settings').get('data-view:selector:page-index:'+view.name, ['main'])"
              @input="$container.get('settings').store('data-view:selector:page-index:'+view.name, $event.value);selectedComponent=$event.components"
            ></q-component-selector>
          </v-row>
          </v-layout>
        </q-card>
        <component v-for="component in selectedComponent" v-if="component" v-bind='component.props'/>
      </template>
    </q-page-index>
    <resource-settings :name="manager.data" :view="view"/>
  </div>
</template>

<script>

import { DataResolver } from '../app/Services/DataResolver'
import { Dictionary } from '../app/Services/Dictionary'
import { CommonPage } from '../mixins/CommonPage'
import ResourceSettings from './ResourceSettings'
import DataViewClone from './DataViewClone'
import _ from 'lodash'

export default {
  mixins: [
    CommonPage,
  ],
  components: {
    DataViewClone,
    ResourceSettings
  },
  data() {
    return {
      duplicate: false,
      components: [],
      selectedComponent: []
    }
  },
  methods: {
  },
  created() {

    this.createManagerByName(this.view.config.label)
    this.components = Object.values(_.map(this.$container.get('data-view').getComponentsByView(this.view), (component, key) => {
      return {
        text: key,
        value: key,
        props: {
          is: this.toComponent(component.extends),
          key: this.manager.name + ':' + key + ':' + component.extends,
          class: 'my-5'
        }
      }
    }))

  }
}
</script>
