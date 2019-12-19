import VueGridLayout from 'vue-grid-layout';

export var EnableConfig = {
  data() {
    return {
      config: false,
    }
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  methods: {
    save () {

      this.layout.map(layout => {
        let view = Object.values(this.$container.get('data-view').getViewById(layout.id))[0]

        if (!view.config.options) {
          view.config.options = {}
        }

        view.config.options.layout = {
          x: layout.x,
          y: layout.y,
          h: layout.h,
          w: layout.w
        }

        let config = this.$container.get('yaml').dump(view.config)

        this.dataView.put(`/?query=id = '${layout.id}'`, { config: config }).then(response => {

        })
      })
    },
    reloadConfig() {
      this.config = !!this.$container.get('settings').get('dw-edit', 0);
    }
  },
  created() {
    this.dataView = this.$container.get('data-view').newApiByName('data-view')
    window.bus.$on('component.update', () => {
      this.reloadConfig();
      this.$forceUpdate();
    });
    this.reloadConfig();
  }
  /*
  mounted() {
    window.addEventListener('keyup', (event) => {

      if (event.keyCode == 17) { 
        this.config = false;
      }

    });

    window.addEventListener('keydown', (event) => {

      if (event.keyCode == 17) { 
        this.config = true;
      }
    });
  },
  */
}