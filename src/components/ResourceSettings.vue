<template>
  <div>
    <v-navigation-drawer v-model="settingsActive" fixed right width='1200' temporary>

      <div style='overflow-y:auto; max-height: 100%' >
        <div class="content text-xs-left">
          <h3 class='title'>Data View</h3>
          <p class='mt-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tincidunt diam vel ante porttitor porta. Mauris condimentum tortor at nulla tempor scelerisque. Phasellus consectetur magna sed massa congue, quis tempus enim facilisis. Donec a tortor malesuada, imperdiet ipsum ac, fringilla ante.</p>

          <v-tabs v-model="tab">
            <v-tab :key="1">Resource List</v-tab>
            <v-tab :key="2">Page Show</v-tab>
            <v-tab-item :key="1" :transition="false" :reverse-transition="false">
              <resource-settings-resource-index :name='name + "-resource-index"' />
            </v-tab-item>
            <v-tab-item :key="2" :transition="false" :reverse-transition="false">
              <resource-settings-page-show :name='name + "-page-show"' />
            </v-tab-item>
          </v-tabs>

          <!--<v-layout align-center class='ma-3'>
            <v-text-field label="name" v-model="table.list.create" placeholder="Type the name of the new field here"></v-text-field>
            <v-btn color="primary" @click="create('list')">{{ $t('$quartz.core.create') }}</v-btn>
          </v-layout>-->

          <div class='content text-xs-right mt-5'>
            <v-btn @click="settingsActive = false">{{ $t('$quartz.core.close') }}</v-btn>
          </div>
        </div>
      </div>
    </v-navigation-drawer>

    <div class='py-4 px-3 text-md-right'>
      <a href="javascript:;" @click="settingsActive = true" class='ma-0'>{{ $t('$quartz.core.settings') }}</a>
    </div>
  </div>
</template>

<script>
import { Common } from '../mixins/Common'
import { DataResolver } from '../app/Services/DataResolver'
import ResourceSettingsResourceIndex from './ResourceSettingsResourceIndex'
import ResourceSettingsPageShow from './ResourceSettingsPageShow'
const yaml = require('js-yaml')
    
export default {
  mixins: [Common],
  components: {
    ResourceSettingsResourceIndex,
    ResourceSettingsPageShow
  },
  props: {
    name: {
      type: String
    }
  },
  data() {
    return {
      tab: null,
      settingsActive: false,
    }
  },
}
</script>