<template>
  <div>
    <q-form v-model="settingsActive">

      <div style='overflow-y:auto; max-height: 100%' >
        <div class="pa-5 text-left">
          <h3 class='title'>Edit Data View</h3>
          <p class='mt-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tincidunt diam vel ante porttitor porta. Mauris condimentum tortor at nulla tempor scelerisque. Phasellus consectetur magna sed massa congue, quis tempus enim facilisis. Donec a tortor malesuada, imperdiet ipsum ac, fringilla ante.</p>
          
          <div>
            <q-select
              :items="items"
              v-model="item"
              label="Components"
              placeholder="Pick one component"
              item-text="name"
              return-object
              :hide-details="true"
            ></q-select>
          </div>
          <div v-if="item">
            <component is="resource-settings-resource" :name="item.name"/>
          </div>



          <!--<v-layout align-center class='ma-3'>
            <v-text-field label="name" v-model="table.list.create" placeholder="Type the name of the new field here"></v-text-field>
            <q-btn color="primary" @click="create('list')">{{ $t('$quartz.core.create') }}</q-btn>
          </v-layout>-->

        </div>
      </div>

      <data-view-clone :tag="name" @success="cloned($event)" @error=""/>
      <div class='content text-right mt-5'>
        <q-btn @click="settingsActive = false">{{ $t('$quartz.core.close') }}</q-btn>
      </div>
    </q-form>

    <div class='py-4 px-3 text-md-right'>
      <a href="javascript:;" @click="settingsActive = true" class='ma-0'>{{ $t('$quartz.core.settings') }}</a>
    </div>
  </div>
</template>

<script>
import { Common } from '../mixins/Common'
import { Dictionary } from '../app/Services/Dictionary'
import { DataResolver } from '../app/Services/DataResolver'
import ResourceSettingsResource from './ResourceSettingsResource'
import DataViewClone from './DataViewClone'

const yaml = require('js-yaml')
    
export default {
  components: {
    DataViewClone,
    ResourceSettingsResource,
  },
  props: {
    name: {
      type: String
    },
    view: {
      type: Object
    }
  },
  data() {
    return {
      item: null,
      items: [],
      settingsActive: false,
    }
  },
  methods: {

    cloned(data) {
      let api = this.$container.get('data-view').newApiByName('data-view');

      let config = this.view.config

      config.options.components[data.name] = {
        extends: data.name
      }

      this.$container.get('data-view').updateViewByName(this.view.name, config)
      
      return api.update(this.view.id, {
        config: this.$container.get('yaml').dump(config)
      }).then(response => {
        this.settingsActive = false
        window.bus.$emit('component.update');
      });

    }
  },
  created() {
    this.items = Object.values(this.$container.get('data-view').getViewByTag(this.name));
  }
}
</script>