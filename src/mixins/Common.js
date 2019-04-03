import { DataResolver } from '../app/Services/DataResolver'
import { Utils } from '../app/Helpers/Utils'

export var Common = {
  props: ['view'],
  data() {
    return {
      manager: null
    }
  },
  methods: {
    createManager() {
      let resolver = new DataResolver();
      this.manager = resolver.createManager(this.view);
    },

    toComponent(str) {
      return Utils.nameToComponent("data-view-" + str)
    }
  }
}