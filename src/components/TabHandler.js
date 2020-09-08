import { Url } from '@quartz/core'

export var TabHandler = {
  data: function() {
    return {
      tabs: null
    }
  },
  mounted () {
    this.updateTabFromQueryUrl();
    this.updateUrlQueryParameter(this.tabs);
  },
  methods: {
    updateTabFromQueryUrl() {
      this.tabs = parseInt(this.$route.query[this.getTabKey()] || 0)
    },
    getTabKey() {
      return this.manager.name + ".tab"
    },
    onTabChange(e) {
      this.tabs = e
      this.updateUrlQueryParameter(e);
    },
    updateUrlQueryParameter(value) {
      Url.updateQueryUrlParameter(this.getTabKey(), value)
    }
  }
}