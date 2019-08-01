<script>
import { Common } from '../mixins/Common'
import { DataResolver } from '../app/Services/DataResolver'
import { mixins } from '@quartz/core'
const yaml = require('js-yaml')
    
export default {
  mixins: [Common, mixins.Expandable],
  props: {
    name: {
      type: String
    }
  },
  data() {
    return {
      loading: false,
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
    changeShow(index, value)
    {
      if (this.loading) {
        return;
      }

      index = this.table.keys[index];

      if (value === true) {
        delete this.table.view.config.options.components[index].show
      } else {
        this.table.view.config.options.components[index].show = value;
      }

      this.update();
    },
    loadYaml(string)
    {
      return yaml.load(string)
    },
    update()
    {
      if (this.loading) {
        return;
      }

      this.loading = true;
      let dataViewId = this.table.view.id;
      return this.api.update(dataViewId, {
        config: this.dumpYaml(this.table.view.config)
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
      this.table.items = Object.values(this.table.view.config.options.components);
      this.table.keys = Object.keys(this.table.view.config.options.components);

      this.table.details = Object.keys(this.table.view.config.options.components);
    },
  },
  created() {
    this.resolver = new DataResolver();
    this.api = this.resolver.newApiByName('data-view');
    this.table.view = this.resolver.getViewByName(this.name);
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