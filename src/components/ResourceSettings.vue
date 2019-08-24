<template>
  <div>
    <q-drawer-form v-model="settingsActive">

      <div style='overflow-y:auto; max-height: 100%' >
        <div class="content text-left">
          <h3 class='title'>Data View</h3>
          <p class='mt-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tincidunt diam vel ante porttitor porta. Mauris condimentum tortor at nulla tempor scelerisque. Phasellus consectetur magna sed massa congue, quis tempus enim facilisis. Donec a tortor malesuada, imperdiet ipsum ac, fringilla ante.</p>

          <v-tabs v-model="tab">
            <v-tab :key="1">Resource</v-tab>
            <v-tab :key="2">Resource List</v-tab>
            <v-tab :key="3">Resource Create</v-tab>
            <v-tab :key="4">Resource Update</v-tab>
            <v-tab :key="5">Resource Show</v-tab>
            <v-tab :key="6">Page Show</v-tab>
            <v-tab-item :key="1" :transition="false" :reverse-transition="false">
              <resource-settings-resource :name='name + "-resource"' />
            </v-tab-item>
            <v-tab-item :key="2" :transition="false" :reverse-transition="false">
              <resource-settings-resource :name='name + "-resource-index"' />
            </v-tab-item>
            <v-tab-item :key="3" :transition="false" :reverse-transition="false">
              <resource-settings-resource :name='name + "-resource-create"' />
            </v-tab-item>
            <v-tab-item :key="4" :transition="false" :reverse-transition="false">
              <resource-settings-resource :name='name + "-resource-update"' />
            </v-tab-item>
            <v-tab-item :key="5" :transition="false" :reverse-transition="false">
              <resource-settings-resource :name='name + "-resource-show"' />
            </v-tab-item>
            <v-tab-item :key="6" :transition="false" :reverse-transition="false">
              <resource-settings-resource :name='name + "-page-show"' :size="false" />
            </v-tab-item>
          </v-tabs>

          <!--<v-layout align-center class='ma-3'>
            <v-text-field label="name" v-model="table.list.create" placeholder="Type the name of the new field here"></v-text-field>
            <q-btn color="primary" @click="create('list')">{{ $t('$quartz.core.create') }}</q-btn>
          </v-layout>-->

          <div class='content text-right mt-5'>
            <q-btn @click="settingsActive = false">{{ $t('$quartz.core.close') }}</q-btn>
          </div>
        </div>
      </div>
    </q-drawer-form>

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
      tab: null,
      settingsActive: false,
    }
  },
}
</script>