import { DataResolver } from '../app/Services/DataResolver'
import { Dictionary } from '../app/Services/Dictionary'
import { Utils } from '../app/Helpers/Utils'
import { ResourceLocalization } from '@quartz/core/src/mixins/ResourceLocalization'
import _ from 'lodash'

export var Common = {
  mixins: [ResourceLocalization],
  props: {
    rawView: {

    },
    options: {

    },
    prefix: {

    },
    vars: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      view: null,
      manager: null
    }
  },
  methods: {
    parseView(view, resource) {

      if (!view) {
        return view
      }

      _.map(view.components, attribute => {

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

      if (this.$attrs.onManagerLoad) {
        this.$attrs.onManagerLoad(this.manager);
      }

      if (this.vars) {
        this.manager.vars = this.vars
      }

      if (this.view.config.options.fixed) {
        this.fillFixed(this.view.config.options.fixed)
      }

      if (!this.manager) {
      }
    },
    createManagerByName(name) {
      this.view.config.options = this.mergeOptions(this.view.config.options, this.options)
      this.manager = this.newManagerByView(this.$container.get('data-view').getViewByName(name + ".resource.upsert"));
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

    toComponent(str, prefix) {
      return Utils.nameToComponent(str)
    },

    fillFixed(fixed)
    {
      /*fixed: (resource) => {
        return _.get(options, 'fixed', undefined)
      },*/
      if (fixed.attributes) {
        _.map(fixed.attributes, (val, key) => {
          let attr = this.manager.getAttribute(key)

          attr.setFixed(val, this.vars)
          
        })
      }
    }
  },
  created() {
    this.view = _.cloneDeep(this.rawView)
  }
}