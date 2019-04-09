import { DataResolver } from '../app/Services/DataResolver'
import { Utils } from '../app/Helpers/Utils'

export var Common = {
  props: ['view', 'options'],
  data() {
    return {
      manager: null
    }
  },
  methods: {
    mergeOptions(options1, options2) {
      return _.merge(options1, options2)
    },
    createManager() {
      this.view.options = this.mergeOptions(this.view.config.options, this.options)
      this.manager = this.newManagerByView(this.view);
    },

    newManagerByView(view) {
      let resolver = new DataResolver();
      let manager = resolver.createManager(view);


      return manager;
    },

    toComponent(str) {
      return Utils.nameToComponent("data-view-" + str)
    }
  }
}