import { Url } from '@quartz/core'

/**
 * Handle tab and store the value of the selected tab in query url
 */
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

    /**
     * Update current tab value from the url
     */
    updateTabFromQueryUrl() {
      this.tabs = parseInt(this.$route.query[this.getTabKey()] || 0)
    },

    /**
     * Get the key used to identify the parameter in the url
     */
    getTabKey() {
      return this.manager.name + ".tab"
    },

    /**
     * Called when the value of the tab is changed
     */
    onTabChange(e) {
      this.tabs = e
      this.updateUrlQueryParameter(e);
    },

    /**
     * Update the url query string
     */
    updateUrlQueryParameter(value) {
      Url.updateQueryUrlParameter(this.getTabKey(), value)
    }
  }
}