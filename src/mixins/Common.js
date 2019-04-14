import { DataResolver } from '../app/Services/DataResolver'
import { Utils } from '../app/Helpers/Utils'
import _ from 'lodash'

export var Common = {
  props: ['view', 'options', 'prefix'],
  data() {
    return {
      manager: null
    }
  },
  methods: {
    parseView(view, resource) {

      if (!view) {
        return view
      }

      _.map(view.attributes, attribute => {

        if (attribute.fixed && typeof attribute.fixed === 'string' && attribute.fixed.match(/\$\{parent\.id\}/)) {
          attribute.fixed = resource;
        }

        return attribute
      })

      return view
    },
    mergeOptions(options1, options2, resource) {

      if (resource) {
        options1 = this.parseView(options1, resource);
        options2 = this.parseView(options2, resource);
      }
      return _.merge(options1, options2)
    },
    createManager() {
      this.view.config.options = this.mergeOptions(this.view.config.options, this.options)
      this.manager = this.newManagerByView(this.view);
    },
    createManagerByName(name) {
      this.view.config.options = this.mergeOptions(this.view.config.options, this.options)
      this.manager = this.newManagerByView(new DataResolver().getViewByName(name + "-resource"));
    },
    getKey (view) {
      this.manager.name + this.toComponent(str)
    },
    newManagerByView(view) {
      let resolver = new DataResolver();

      let manager = resolver.createManager(view);

      if (this.prefix) {
        manager.name = this.prefix + '.' + manager.name
      }

      return manager;
    },

    toComponent(str) {
      return Utils.nameToComponent("data-view-" + str)
    }
  }
}