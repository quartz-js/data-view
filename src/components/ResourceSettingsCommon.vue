<script>
import { Common } from '../mixins/Common'
import { Dictionary } from '../app/Services/Dictionary'
import { mixins } from '@quartz/core'
const yaml = require('js-yaml')
import _ from 'lodash'

export default {
  mixins: [Common, mixins.Expandable],
  props: {
    name: {
      type: String
    },
    size: {
      type: Boolean,
      default: true,
    }
  },
  watch: {
    name: {
      handler: function () {
         this.create()
      }
    }
  },
  data() {
    return {
      loading: false,
      yaml: null,
      table: {
        headers: [{text: 'name', sortable: false, width: 120}, {text: '', sortable: false}],
        create: null,
        view: null,
        manager: null,
        expand: false,
        items: []
      }
    }
  },
  methods: {
    sortComponentsByKeys()
    {
      let components = {};

      for (let index in this.table.keys) {
        let key = this.table.keys[index];

        components[key] = this.table.view.config.options.components[key];
      }      

      this.table.view.config.options.components = components;

      this.update();

    },
    updateYaml(index, $event)
    { 
      let key = this.table.keys[index];
      this.table.view.config.options.components[key] = this.loadYaml($event);
    },
    updateConfig($event)
    { 
      return this.update(this.yaml)
    },
    create ()
    {
      let name = this.table.create;

      this.table.keys.push(name);
      this.table.items.push({
        name: name,
        extends: "data-view-attribute-show",
        include: this.table.view.config.options.data + ".components." + name
      });

      this.table.create = null;

      this.sortComponentsByKeys();
    },
    remove(index)
    {
      let array = this.table.keys;

      array.splice(index, 1);

      this.table.view.config.options.components[index].show = value;

      this.sortComponentsByKeys();
    },
    move (array, fromIndex, toIndex)
    {
      array.splice(toIndex, 0, array.splice(fromIndex, 1)[0] );
    },
    canMoveUp(index) {
      return index > 0
    },
    moveUp(index)
    {
      if (this.loading) {
        return;
      }

      if (!this.canMoveUp(index)) {
        return
      }

      this.move(this.table.keys, index, index-1);

      this.sortComponentsByKeys();
    },
    canMoveDown(index) {
      return index < this.table.items.length-1
    },
    moveDown(index)
    {
      if (this.loading) {
        return;
      }

      if (!this.canMoveDown(index)) {
        return
      }

      this.move(this.table.keys, index, index+1);

      this.sortComponentsByKeys();
    },
    changeText(fields, index, value)
    {
      if (this.loading) {
        return;
      }

      index = this.table.keys[index];

      if (parseInt(value) == value) {
        value = parseInt(value)
      }

      if (value === '' || value === false) {
        _.unset(this.table.view.config.options.components[index], fields, value)
      } else {
        _.set(this.table.view.config.options.components[index], fields, value)
      }

      this.update();
    },
    loadYaml(string)
    {
      return yaml.load(string)
    },
    update(val)
    {
      if (this.loading) {
        return;
      }

      this.loading = true;
      let dataViewId = this.table.view.id;
      return this.api.update(dataViewId, {
        config: val ? val : this.dumpYaml(this.table.view.config)
      }).then(response => {

        this.dictionary.updateViewByName(this.name, response.body.data.processed);
        
        this.load();

        bus.$emit('data-view.updated', response.body.data);


        return response;
      }).finally(response => {
        this.loading = false;
      })
    },
    dumpYaml(object)
    {
      return yaml.dump(object).replace(/^\s*\n/gm)
    },
    load () {
      this.table.view = this.dictionary.getViewByName(this.name);
      this.table.items = Object.values(this.table.view.config.options.components);
      this.table.keys = Object.keys(this.table.view.config.options.components);

      this.table.details = Object.keys(this.table.view.config.options.components);

      this.yaml = this.$container.get('yaml').dump(this.table.view.config)
    },
    create() {

      this.dictionary = this.$container.get('data-view');
      this.api = this.dictionary.newApiByName('data-view');
      this.load();
    }
  },
  mounted () {
    this.create()
  }
}
</script>

<style>

.theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row) {
  background: initial !important;
}
</style>