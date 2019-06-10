<template>
  <component :is="component" :config="manager" v-bind="$attrs">
    <template slot='tabs' slot-scope="scope">
      <v-tab v-for="(section, key, index) in sections" v-if="hasSection(key)">{{ key }}</v-tab>
      <v-tab-item v-for="(section, key, index) in sections" :transition="false" :reverse-transition="false" v-if="hasSection(key)">
        <component 
          v-if="scope.tabs === index"
          :is="toComponent(section.extends)"
          :resource="toResource(section, scope.resource)" 
          v-bind="$attrs"
          :prefix="manager.name"
          :options="mergeOptions(options, section.options, scope.resource)"
          :key="manager.name + '.' + section.key + section.extends"
        />
      </v-tab-item>

      <v-dialog v-model="settingsActive" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            {{ $t('$quartz.core.settings') }}
          </v-card-title>
          <v-card-text>
            <v-select 
              :items="listable" 
              v-model="cols" 
              :menu-props="{ maxHeight: '400' }" 
              :label="$t('$quartz.core.columns')" 
              multiple 
              @change="updateListable"
              persistent-hint 
              item-text="label"
            ></v-select>
          </v-card-text>
        </v-card>
      </v-dialog> 

      <div class='text-md-right' style='flex-grow: 1;padding: 5px;'>
        <v-btn @click="settingsActive = true" icon class='icon ma-0'>
          <v-icon color="primary"  >settings</v-icon>
        </v-btn>
      </div>
    </template>
    <template slot='actions' slot-scope="scope">
      <component 
        v-for="component in resourceComponents" 
        :is="toComponent(component.extends)" 
        :resource="scope.resource" 
        :options="mergeOptions(options, component.options)" 
        v-bind="$attrs"/>
    </template>
  </component>
</template>
<script>

import { DataResolver } from '../app/Services/DataResolver'
import { Common } from '../mixins/Common'
import { container, Interceptor } from '@railken/quartz-core'
import _ from 'lodash'


export default {
  mixins: [
    Common
  ],
  data() {
    return {
      component: null,
      sections: [],
      listable: [],
      resourceComponents: [],
      cols: [],
      settingsActive: false,
    }
  },
  created() {
    this.createManagerByName(this.view.config.label)

    if (this.view.config.options.actions) {
      this.resourceComponents = this.view.config.options.actions.resource
    }
    
    this.sections = this.view.config.options.sections

    this.listable = _.map(this.sections, (section, key) => {
      return key
    });

    this.cols = JSON.parse(container.get('settings').get('app.page-show.' + this.manager.name, JSON.stringify(this.listable)));

    this.component = Interceptor.resolve('pageShowOnRetrieve', {
      manager: this.manager,
      component: 'q-page-show'
    }).component
  },
  methods: {
    hasSection(section) {
      return this.cols.indexOf(section) !== -1;
    },
    updateListable() {
      container.get('settings').store('app.page-show.' + this.manager.name, JSON.stringify(this.cols));
    },
    toResource(view, resource) {
      if (view.options && view.options.extractor) {
        
        let relationedResource = resource[view.options.extractor];

        return relationedResource;

      }

      return resource
    }
  }
}
</script>
