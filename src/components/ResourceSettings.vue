<template>
  <div>
    <q-form v-model="settingsActive">

      <div style='overflow-y:auto; max-height: 100%' >
        <div class="content text-left">
          <h3 class='title'>Data View</h3>
          <p class='mt-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tincidunt diam vel ante porttitor porta. Mauris condimentum tortor at nulla tempor scelerisque. Phasellus consectetur magna sed massa congue, quis tempus enim facilisis. Donec a tortor malesuada, imperdiet ipsum ac, fringilla ante.</p>
          
          <div class='ma-3'>
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

          <div class='content text-right mt-5'>
            <q-btn @click="settingsActive = false">{{ $t('$quartz.core.close') }}</q-btn>
          </div>
        </div>
      </div>
    </q-form>

    <div class='py-4 px-3 text-md-right'>
      <a href="javascript:;" @click="settingsActive = true" class='ma-0'>{{ $t('$quartz.core.settings') }}</a>
    </div>
  </div>
</template>

<script>
import { Common } from '../mixins/Common'
import { DataResolver } from '../app/Services/DataResolver'
import ResourceSettingsResource from './ResourceSettingsResource'

const yaml = require('js-yaml')
    
export default {
  mixins: [Common],
  components: {
    ResourceSettingsResource,
  },
  props: {
    name: {
      type: String
    }
  },
  data() {
    return {
      item: null,
      items: [],
      settingsActive: false,
    }
  },
  created() {
    this.items = Object.values(this.$container.get('data-view').getViewByTag(this.name));
  }
}
</script>