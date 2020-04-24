export var ResizeColumn = {
  data() {
    return {
      resizable: {
        show: false,
        clientX: null,
        target: null,
        timeout: null
      },
    }
  },
  methods: {
    move (event) {

      if (this.resizable.clientX === null) {
        return true;
      }

      clearTimeout(this.resizable.timeout)

      let target = this.resizable.target.closest('.headerContainer')
      let e1 = target.getBoundingClientRect().x
      let e2 = event.clientX
      let width = e2-e1+7

      if (width < 80) {
        width = 80
      }

      let name = target.getAttribute('data-attribute-name')

      this.updateWidthAttribute(name, width)

      this.resizable.timeout = setTimeout(() => {
        this.saveWidthAttribute(name, width)
      }, 200)
    },

    updateWidthAttribute(name, width) {
      let cols = this.$refs.table.querySelectorAll(`[data-attribute-name='${name}']`)

      cols.forEach(t => {
        t.style.minWidth = `${width}px`
        t.style.width = `${width}px`
        t.style.maxWidth = `${width}px`
      })
    },

    saveWidthAttribute(name, width) {
      let viewId = this.manager.getAttribute(name).view.local.id
      let view = Object.values(this.$container.get('data-view').getViewById(viewId))[0]

      let api = this.$container.get('data-view').newApiByName('data-view');

      let config = view.config

      if (!config.options) {
        config.options = {}
      }

      config.options.width = width

      this.$container.get('data-view').updateViewByName(view.name, config)
      
      return api.update(viewId, {
        config: this.$container.get('yaml').dump(config)
      }).then(response => {

      });
    },

    startResize (event) {
      this.resizable.clientX = event.clientX
      this.resizable.target = event.target
    },

    endResize () {
      this.resizable.clientX = null;
      this.resizable.target = null;
    },

    loadWidth () {
      this.manager.attributes.map((attr) => {
        attr.width && this.updateWidthAttribute(attr.name, attr.width)
      })
    }
  },
  created() {
    document.addEventListener('mouseup', (i) => {
      this.endResize()
    })

  }
}