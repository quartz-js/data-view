<template>
  <div>
    <div class='py-4 px-3 text-md-right'>
      <router-link :to='url' class='ma-0' target='_blank'>{{ $t('$quartz.core.settings') }}</router-link>
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
    this.url = `/data-view?query=tag eq '${this.name}'`
  }
}
</script>