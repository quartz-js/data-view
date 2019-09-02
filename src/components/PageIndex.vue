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
            <q-btn content-text="create" content-icon="add" @click="duplicate=true"/>

            <q-form v-model="duplicate">
              <data-view-clone :tag="view.config.label" @success="cloned($event)" @error=""/>
            </q-form>
          </v-row>
          </v-layout>
        </q-card>

        <component v-for="component in selectedComponent" v-if="component" v-bind='component.props'/>
      </template>
    </q-page-index>
    <resource-settings :name="manager.data" />
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
    cloned(data) {
      let api = new Dictionary().newApiByName('data-view');

      let config = this.view.config

      config.options.components[data.name] = {
        extends: data.name
      }

      new Dictionary().updateViewByName(this.view.name, config)
      
      return api.update(this.view.id, {
        config: this.$container.get('yaml').dump(config)
      }).then(response => {
        this.duplicate = false
        window.bus.$emit('component.update');
      });

    }
  },
  created() {

    this.createManagerByName(this.view.config.label)
    this.components = Object.values(_.map(this.view.config.options.components, (component, key) => {
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
