<template>
  <div>
    <v-navigation-drawer v-model="settingsActive" fixed right width='1200' temporary>

      <div style='overflow-y:auto; max-height: 100%' >


        <div class="content text-xs-left">

          <h3 class='title'>Settings</h3>
          <p class='mt-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tincidunt diam vel ante porttitor porta. Mauris condimentum tortor at nulla tempor scelerisque. Phasellus consectetur magna sed massa congue, quis tempus enim facilisis. Donec a tortor malesuada, imperdiet ipsum ac, fringilla ante.</p>

          <v-tabs v-model="tab">
            <v-tab :key="1">List</v-tab>
            <v-tab :key="2">Show - Tabs</v-tab>
            <v-tab-item :key="1" v-bind:class="{'disable': loading}" :transition="false" :reverse-transition="false">
              <v-data-table
                :headers="table.list.headers"
                :items="table.list.items"
                hide-actions
              >
                <template v-slot:items="props">
                  <tr>
                    <td>{{ props.item.name }}</td>
                    <td class="text-xs-right">
                      <v-layout align-center>
                        <v-btn icon v-bind:class="{'hidden': !canMoveDown('list', props.index)}" @click="moveDown('list', props.index)"><v-icon>arrow_drop_down</v-icon></v-btn>
                        <v-btn icon v-bind:class="{'hidden': !canMoveUp('list', props.index)}" @click="moveUp('list', props.index)"><v-icon>arrow_drop_up</v-icon></v-btn>
                        <div><v-checkbox hide-details :input-value="typeof props.item.show == 'undefined'" @change="changeShow('list', props.index, $event)"></v-checkbox></div>
                        <v-btn dark color="red" @click="remove('list', props.index)">delete</v-btn>
                        <v-btn color="primary" @click="update('list')">Save</v-btn>
                      </v-layout>
                    </td>
                  </tr>
                  <tr>
                    <td colspan='2'><q-form-yaml class='my-3' :value="dumpYaml(props.item)" @input="updateYaml('list', props.index, $event)"></q-form-yaml></td>
                  </tr>
                </template>
              </v-data-table>
            </v-tab-item>
            <v-tab-item :key="2" v-bind:class="{'disable': loading}" :transition="false" :reverse-transition="false">
              <v-data-table
                :headers="table.pageShow.headers"
                :items="table.pageShow.items"
                hide-actions
              >
                <template v-slot:items="props">
                  <tr>
                    <td>{{ table.pageShow.keys[props.index] }}</td>
                    <td class="text-xs-right">
                      <v-layout align-center>
                        <v-btn icon v-bind:class="{'hidden': !canMoveDown('pageShow', props.index)}" @click="moveDown('pageShow', props.index)"><v-icon>arrow_drop_down</v-icon></v-btn>
                        <v-btn icon v-bind:class="{'hidden': !canMoveUp('pageShow', props.index)}" @click="moveUp('pageShow', props.index)"><v-icon>arrow_drop_up</v-icon></v-btn>
                        <div><v-checkbox hide-details :input-value="typeof props.item.show == 'undefined'" @change="changeShow('pageShow', props.index, $event)"></v-checkbox></div>
                        <v-btn color="primary" @click="update('pageShow')">Save</v-btn>
                      </v-layout>
                    </td>
                  </tr>
                  <tr>
                    <td colspan='2'><q-form-yaml class='my-3' :value="dumpYaml(props.item)" @input="updateYaml('pageShow', props.index, $event)"></q-form-yaml></td>
                  </tr>
                </template>
              </v-data-table>
            </v-tab-item>
          </v-tabs>

          <v-layout align-center class='ma-3'>
            <v-text-field label="name" v-model="table.list.create" placeholder="Type the name of the new field here"></v-text-field>
            <v-btn color="primary" @click="create('list')">{{ $t('$quartz.core.create') }}</v-btn>
          </v-layout>

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
const yaml = require('js-yaml')
    
export default {
  mixins: [Common],
  props: {
    name: {
      type: String
    }
  },
  data() {
    return {
      tab: null,
      settingsActive: false,
      loading: false,
      table: {
        list: {
          create: null,
          view: null,
          manager: null,
          expand: false,
          headers: [{text: 'name', sortable: false, width: 120}, {text: '', sortable: false}],
          items: []
        },
        pageShow: {
          create: null,
          view: null,
          manager: null,
          expand: false,
          headers: [{text: 'name', sortable: false, width: 120}, {text: '', sortable: false}],
        }
      }
    }
  },
  methods: {
    sortComponentsByKeys(type)
    {
      let components = {};

      for (let index in this.table[type].keys) {
        let key = this.table[type].keys[index];

        components[key] = this.table[type].view.config.options.components[key];
      }      

      this.table[type].view.config.options.components = components;

      this.update(type);

    },
    updateYaml(type, index, $event)
    { 
      let key = this.table[type].keys[index];
      this.table[type].view.config.options.components[key] = this.loadYaml($event);
    },
    create (type)
    {
      let name = this.table[type].create;

      this.table[type].keys.push(name);
      this.table[type].items.push({
        name: name,
        extends: "data-view-attribute-show",
        include: this.table[type].view.config.options.data + ".components." + name
      });

      this.table[type].create = null;

      this.sortComponentsByKeys(type);
    },
    remove(type, index)
    {
      let array = this.table[type].keys;

      array.splice(index, 1);

      this.table[type].view.config.options.components[index].show = value;

      this.sortComponentsByKeys(type);
    },
    move (array, fromIndex, toIndex)
    {
      array.splice(toIndex, 0, array.splice(fromIndex, 1)[0] );
    },
    canMoveUp(type, index) {
      return index > 0
    },
    moveUp(type, index)
    {
      if (this.loading) {
        return;
      }

      if (!this.canMoveUp(type, index)) {
        return
      }

      this.move(this.table[type].keys, index, index-1);

      this.sortComponentsByKeys(type);
    },
    canMoveDown(type, index) {
      return index < this.table[type].items.length-1
    },
    moveDown(type, index)
    {
      if (this.loading) {
        return;
      }

      if (!this.canMoveDown(type, index)) {
        return
      }

      this.move(this.table[type].keys, index, index+1);

      this.sortComponentsByKeys(type);
    },
    changeShow(type, index, value)
    {
      if (this.loading) {
        return;
      }

      index = this.table[type].keys[index];

      if (value === true) {
        delete this.table[type].view.config.options.components[index].show
      } else {
        this.table[type].view.config.options.components[index].show = value;
      }

      this.update(type);
    },
    loadYaml(string)
    {
      return yaml.load(string)
    },
    update(type)
    {
      if (this.loading) {
        return;
      }

      this.loading = true;
      let dataViewId = this.table[type].view.id;
      return this.api.update(dataViewId, {
        config: this.dumpYaml(this.table[type].view.config)
      }).then(response => {

        bus.$emit('data-view.updated', response.body.data);

        return this.load();
      }).finally(response => {
        this.loading = false;
      })
    },
    dumpYaml(object)
    {
      return yaml.dump(object).replace(/^\s*\n/gm)
    },
    load () {
      this.table.list.items = Object.values(this.table.list.view.config.options.components);
      this.table.list.keys = Object.keys(this.table.list.view.config.options.components);
      this.table.pageShow.items = Object.values(this.table.pageShow.view.config.options.components);
      this.table.pageShow.keys = Object.keys(this.table.pageShow.view.config.options.components);
    },
  },
  created() {
    this.resolver = new DataResolver();
    this.api = this.resolver.newApiByName('data-view');
    this.table.list.view = this.resolver.getViewByName(this.name + "-resource-index");
    this.table.pageShow.view = this.resolver.getViewByName(this.name + "-page-show");

    this.load();
  }
}
</script>

<style>
.CodeMirror {
  height: 250px !important
}

.theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row) {
  background: initial !important;
}
</style>